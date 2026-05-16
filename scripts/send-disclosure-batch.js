#!/usr/bin/env node
/*
  Disclosure waitlist batch sender.
  Default is DRY RUN. Nothing sends unless --send is passed.

  Examples:
    node scripts/send-disclosure-batch.js --dry-run
    node scripts/send-disclosure-batch.js --seed bfaucher97@gmail.com --send
    node scripts/send-disclosure-batch.js --send --limit 15 --delay-ms 1500
*/
const fs = require('fs');
const path = require('path');

const args = new Set(process.argv.slice(2));
const getArg = (name, fallback = '') => {
  const prefix = name + '=';
  const hit = process.argv.slice(2).find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
};

const SEND = args.has('--send');
const LIMIT = Number(getArg('--limit', '0')) || 0;
const DELAY_MS = Number(getArg('--delay-ms', '1200')) || 1200;
const ENDPOINT = getArg('--endpoint', 'https://www.getdisclosure.app/api/send-card');
const SEED = getArg('--seed', '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const OUT_DIR = path.resolve(process.cwd(), 'artifacts/email-runs');
const BAD_DOMAINS = new Set(['gmail.ccom']);
const INTERNAL_DOMAINS = new Set(['generateideas.app']);

function loadSupabaseConfig() {
  if (process.env.DISCL_SUPABASE_URL && process.env.DISCL_SUPABASE_SERVICE_ROLE_KEY) {
    return { url: process.env.DISCL_SUPABASE_URL, key: process.env.DISCL_SUPABASE_SERVICE_ROLE_KEY };
  }
  const candidates = [
    '/home/ubuntu/.config/supabase/disclosure.json',
    '/home/ubuntu/.config/disclosure/supabase.json',
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (cfg.url && cfg.service_role_key) return { url: cfg.url, key: cfg.service_role_key };
  }
  throw new Error('Missing Supabase config. Set DISCL_SUPABASE_URL and DISCL_SUPABASE_SERVICE_ROLE_KEY.');
}

async function fetchWaitlist() {
  const cfg = loadSupabaseConfig();
  const url = `${cfg.url.replace(/\/$/, '')}/rest/v1/waitlist?select=email,archetype,serial_number,created_at&order=created_at.asc`;
  const resp = await fetch(url, {
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      Accept: 'application/json',
      Prefer: 'count=exact',
    },
  });
  if (!resp.ok) throw new Error(`Supabase fetch failed ${resp.status}: ${await resp.text()}`);
  return resp.json();
}

function normalize(row) {
  return {
    email: String(row.email || '').trim().toLowerCase(),
    archetype: String(row.archetype || 'diplomat').trim().toLowerCase(),
    serial: String(row.serial_number || '').trim(),
    created_at: row.created_at,
  };
}

function classify(rows) {
  const seen = new Set();
  const sendable = [];
  const skipped = [];
  for (const raw of rows.map(normalize)) {
    const domain = raw.email.split('@')[1] || '';
    let reason = '';
    if (!raw.email.includes('@')) reason = 'invalid_email';
    else if (seen.has(raw.email)) reason = 'duplicate';
    else if (BAD_DOMAINS.has(domain)) reason = 'bad_domain';
    else if (INTERNAL_DOMAINS.has(domain)) reason = 'internal_domain';
    else if (!raw.serial) reason = 'missing_serial';
    if (reason) skipped.push({ ...raw, reason });
    else sendable.push(raw);
    seen.add(raw.email);
  }
  return { sendable, skipped };
}

function summarize(rows) {
  const count = (field) => rows.reduce((acc, row) => (acc[row[field]] = (acc[row[field]] || 0) + 1, acc), {});
  return { total: rows.length, archetypes: count('archetype'), domains: rows.reduce((acc, row) => { const d = row.email.split('@')[1] || 'unknown'; acc[d] = (acc[d] || 0) + 1; return acc; }, {}) };
}

async function sendOne(row) {
  const resp = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: row.email, archetype: row.archetype, serial: row.serial }),
  });
  const text = await resp.text();
  let detail;
  try { detail = JSON.parse(text); } catch { detail = text; }
  return { ok: resp.ok, status: resp.status, detail };
}

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

(async () => {
  const rows = await fetchWaitlist();
  const { sendable, skipped } = classify(rows);
  const seeded = SEED.length ? sendable.filter((r) => SEED.includes(r.email)) : sendable;
  const target = LIMIT ? seeded.slice(0, LIMIT) : seeded;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logPath = path.join(OUT_DIR, `${stamp}-${SEND ? 'send' : 'dry-run'}.jsonl`);

  console.log(JSON.stringify({ mode: SEND ? 'SEND' : 'DRY_RUN', endpoint: ENDPOINT, delayMs: DELAY_MS, seed: SEED, waitlist: rows.length, sendable: sendable.length, skipped: skipped.length, target: target.length, summary: summarize(sendable), skippedSummary: skipped.reduce((a, r) => (a[r.reason] = (a[r.reason] || 0) + 1, a), {}) }, null, 2));
  console.log(`log: ${logPath}`);

  if (!SEND) {
    fs.writeFileSync(logPath, target.map((row) => JSON.stringify({ dryRun: true, ...row })).join('\n') + '\n');
    console.log('Dry run only. Add --send to actually email. The lair remains merciful.');
    return;
  }

  for (let i = 0; i < target.length; i++) {
    const row = target[i];
    const result = await sendOne(row);
    const line = { ts: new Date().toISOString(), index: i + 1, total: target.length, email: row.email, archetype: row.archetype, serial: row.serial, ...result };
    fs.appendFileSync(logPath, JSON.stringify(line) + '\n');
    console.log(`${i + 1}/${target.length} ${row.email} ${result.ok ? 'OK' : 'FAIL'} ${JSON.stringify(result.detail)}`);
    if (!result.ok) {
      console.error('Hard stop on provider failure. Fix before continuing.');
      process.exit(1);
    }
    await sleep(DELAY_MS);
  }
})();
