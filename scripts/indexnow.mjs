#!/usr/bin/env node
/**
 * IndexNow: tell Bing (and every engine that shares IndexNow) which pages
 * changed, once per production deploy, instead of waiting for a recrawl.
 *
 * Ported 2026-09-29 from ClearToEnter (the studio standard). It runs from
 * .github/workflows/indexnow.yml after every successful production deploy.
 *
 * How it decides what to send:
 *   It reads the live sitemap (about 100 URLs) and compares it with the state
 *   file from its previous run. With no state file (the first run) it sends
 *   every URL once. After that it sends only:
 *     - URLs that are new to the sitemap, and
 *     - URLs whose lastmod moved since the last run.
 *   Resubmitting unchanged pages on every deploy is what IndexNow asks sites
 *   not to do, so the state file is the whole point.
 *
 *   Every URL carries a real lastmod: scripts/dx-sitemap.mjs moves a page's
 *   date only when the text inside its <main> changes (scripts/lastmod.json).
 *   To push one page by hand, run this script with --url=<page> (repeatable).
 *
 * Proof of ownership is the key file at the site root,
 * 735194b4bbbc54d8e7d7246b3eda3961.txt, whose body is the key. It is
 * public by design, not a secret. Red control: before sending anything the
 * script fetches the live key file and refuses (exit 1) unless its body is
 * exactly the key (one trailing newline allowed), because a missing or wrong
 * key file makes the endpoint answer 403 and nothing lands. The check also
 * runs on a dry run, so a dry run proves the key file is live.
 *
 * Usage:
 *   node scripts/indexnow.mjs                  send what changed since the state file
 *   node scripts/indexnow.mjs --dry-run        show what would be sent, send nothing, write nothing
 *   node scripts/indexnow.mjs --all            send every sitemap URL (use rarely)
 *   node scripts/indexnow.mjs --url=<url>      send just these URLs (repeatable), state untouched
 *   node scripts/indexnow.mjs --state=<path>   state file (default .indexnow-state.json)
 *   node scripts/indexnow.mjs --key-url=<url>  check the key file at this URL instead
 *                                              (for proving the red control refuses)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const KEY = '735194b4bbbc54d8e7d7246b3eda3961';
const HOST = 'www.getdisclosure.app';
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const SITEMAP = `${ORIGIN}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 2500; // the protocol allows 10,000 per request; stay well under
const ATTEMPTS = 4; // one try plus three retries on 429 and 5xx
const TIMEOUT_MS = 30_000;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const values = (name) =>
  args.filter((a) => a.startsWith(`--${name}=`)).map((a) => a.slice(name.length + 3));

const DRY = flag('dry-run') || flag('dry');
const ALL = flag('all');
const ONLY = values('url');
const STATE = path.resolve(ROOT, values('state')[0] || '.indexnow-state.json');
const KEY_CHECK_URL = values('key-url')[0] || KEY_LOCATION;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function localKeyMatches() {
  const file = path.join(ROOT, `${KEY}.txt`);
  if (!existsSync(file)) throw new Error(`${KEY}.txt is missing from the repo`);
  const body = readFileSync(file, 'utf8').replace(/\r?\n$/, '');
  if (body !== KEY) throw new Error(`${KEY}.txt must contain exactly the key`);
}

/** Red control. Returns null when the live key file is exactly the key, else the problem. */
async function liveKeyProblem() {
  let res;
  try {
    res = await fetch(KEY_CHECK_URL, { redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    return `the key file could not be fetched (${err.message})`;
  }
  if (res.status !== 200) return `the key file at ${KEY_CHECK_URL} answered HTTP ${res.status}`;
  const body = (await res.text()).replace(/\r?\n$/, '');
  return body === KEY ? null : `the key file at ${KEY_CHECK_URL} does not contain exactly the key`;
}

function decodeXml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

/** The live sitemap as Map(loc -> lastmod), '' where a URL carries no lastmod. */
async function readSitemap() {
  const res = await fetch(SITEMAP, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`the sitemap answered HTTP ${res.status}`);
  const xml = await res.text();
  if (/<sitemapindex[\s>]/.test(xml)) {
    throw new Error('the sitemap is now a sitemap index; teach this script to follow it');
  }
  const out = new Map();
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? '';
    if (loc) out.set(decodeXml(loc), lastmod);
  }
  if (out.size === 0) throw new Error('the sitemap parsed to zero URLs');
  const foreign = [...out.keys()].filter((u) => new URL(u).host !== HOST);
  if (foreign.length) {
    throw new Error(`${foreign.length} sitemap URLs are not on ${HOST} (first: ${foreign[0]}); IndexNow would answer 422`);
  }
  return out;
}

const HINTS = {
  400: 'bad request: the payload is malformed',
  403: 'the key was not accepted: check the key file is live at the site root',
  422: 'a URL does not belong to the host, or the key does not match the host',
  429: 'too many requests: IndexNow reads this as spam, so slow down',
};

async function postBatch(urlList, label) {
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    let status;
    let detail = '';
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      status = res.status;
      // 200 and 202 both mean received. 202 means the key is still being
      // validated, which is normal on the first submission.
      if (status === 200 || status === 202) {
        console.log(`${label}: sent ${urlList.length} URLs, IndexNow answered HTTP ${status}`);
        return;
      }
      detail = (await res.text()).slice(0, 200);
    } catch (err) {
      detail = err.message; // network error or timeout: worth a retry
    }
    const retryable = status === undefined || status === 429 || status >= 500;
    const hint = HINTS[status] || (status ? 'unexpected response' : 'no response');
    if (!retryable || attempt === ATTEMPTS) {
      throw new Error(`${label}: IndexNow answered ${status ? `HTTP ${status}` : 'nothing'} (${hint}) after ${attempt} attempt(s): ${detail}`);
    }
    const wait = (status === 429 ? 60_000 : 10_000) * attempt;
    console.log(`${label}: HTTP ${status ?? 'error'} (${hint}), retry ${attempt} of ${ATTEMPTS - 1} in ${wait / 1000}s`);
    await sleep(wait);
  }
}

async function submit(urls) {
  const batches = Math.ceil(urls.length / BATCH);
  for (let i = 0; i < batches; i++) {
    if (i > 0) await sleep(5_000); // be polite between batches
    await postBatch(urls.slice(i * BATCH, (i + 1) * BATCH), `batch ${i + 1} of ${batches}`);
  }
}

function show(urls) {
  for (const u of urls.slice(0, 12)) console.log(`  ${u}`);
  if (urls.length > 12) console.log(`  ...and ${urls.length - 12} more`);
}

async function main() {
  localKeyMatches();

  let urls;
  let live = null;
  if (ONLY.length) {
    const bad = ONLY.filter((u) => {
      try { return new URL(u).host !== HOST; } catch { return true; }
    });
    if (bad.length) throw new Error(`not a ${HOST} URL: ${bad[0]}`);
    urls = ONLY;
    console.log(`--url: ${urls.length} URL(s), state file untouched`);
  } else {
    live = await readSitemap();
    const withDate = [...live.values()].filter(Boolean).length;
    console.log(`sitemap: ${live.size} URLs, ${withDate} with a lastmod, ${live.size - withDate} without`);
    const prior = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : null;
    if (ALL || !prior) {
      urls = [...live.keys()];
      console.log(`${prior ? '--all' : 'no state file, first run'}: ${urls.length} URLs to send`);
    } else {
      let fresh = 0;
      let moved = 0;
      urls = [];
      for (const [loc, lastmod] of live) {
        if (!Object.hasOwn(prior, loc)) { fresh++; urls.push(loc); }
        else if (lastmod && prior[loc] !== lastmod) { moved++; urls.push(loc); }
      }
      console.log(`${urls.length} of ${live.size} URLs to send: ${fresh} new to the sitemap, ${moved} with a moved lastmod`);
    }
  }
  show(urls);
  const batches = Math.ceil(urls.length / BATCH);
  if (urls.length) console.log(`would go out as ${batches} batch(es) of up to ${BATCH}`);

  // Red control, on every run including dry runs.
  const problem = await liveKeyProblem();
  if (problem) {
    console.error(`indexnow: refusing to submit, ${problem}. Deploy ${KEY}.txt first.`);
    process.exitCode = 1;
    return;
  }
  console.log(`red control: live key file at ${KEY_CHECK_URL} matches the key`);

  if (DRY) {
    console.log('dry run: nothing sent, state file untouched');
    return;
  }
  if (urls.length) await submit(urls);
  else console.log('nothing new or changed, nothing sent');

  if (live) {
    writeFileSync(STATE, JSON.stringify(Object.fromEntries(live), null, 1));
    console.log(`state written: ${STATE}`);
  }
}

main().catch((err) => {
  console.error(`indexnow: ${err.message}`);
  process.exitCode = 1;
});
