// Renders the 1200x630 share images into og/ (the contract table in docs/BUILD-BRIEF.md).
// Each image is HTML in the site's own design system, screenshotted headlessly (never a visible browser).
// Needs: a local server on the site root (default http://127.0.0.1:5177) and playwright-core with Chrome.
// Usage: node scripts/dx-og.mjs [name ...]      e.g. node scripts/dx-og.mjs home sentinel
// Env:   DX_BASE=http://127.0.0.1:5177   PLAYWRIGHT_CORE=<path to playwright-core>
import { createRequire } from 'node:module';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const BASE = process.env.DX_BASE || 'http://127.0.0.1:5177';
const PW = process.env.PLAYWRIGHT_CORE || 'C:\\Users\\bfauc\\AppData\\Local\\Temp\\claude\\C--Users-bfauc-Desktop-Kootenay-Made-Digital-Disclosure-App\\0a20baa1-7235-417c-ad9e-0acd4893c608\\scratchpad\\node_modules\\playwright-core';
const { chromium } = createRequire(import.meta.url)(PW);
const OUT = join(root, 'og');
const QUALITY = 84;
const MAX_BYTES = 220 * 1024;

/* ---------- shared frame ---------- */
const head = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300..900&family=Space+Mono:wght@400;700&display=block">
<link rel="stylesheet" href="${BASE}/assets/dx/dx.css?v=1">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: var(--void-0); }
  body::after { opacity: 0.035; }
  .og { position: relative; width: 1200px; height: 630px; overflow: hidden; background: var(--void-0); color: var(--bone); }
  .og-top, .og-foot { position: absolute; left: 72px; right: 72px; display: flex; justify-content: space-between; align-items: center; z-index: 3; }
  .og-top { top: 56px; }
  .og-foot { bottom: 50px; font-family: var(--mono); font-size: 18px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone-dim); }
  .og-word { font-family: var(--poster); font-weight: 900; font-size: 26px; letter-spacing: 0.34em; color: var(--bone); }
  .og-tag { font-family: var(--mono); font-size: 17px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--bone-dim); }
  .og-body { position: absolute; left: 72px; top: 150px; right: 72px; z-index: 3; }
  .og-h { margin: 0; font-family: var(--poster); font-weight: 800; color: var(--bone); letter-spacing: -0.035em; line-height: 0.98; text-wrap: balance; }
  .og-sub { margin: 26px 0 0; font-family: var(--poster); font-weight: 400; font-size: 32px; line-height: 1.3; color: var(--bone-dim); max-width: 21em; }
  .og-go { color: var(--signal); }
  .eye-bg { position: absolute; inset: 0; z-index: 1; }
  .eye-bg img { position: absolute; top: 0; right: -80px; height: 100%; width: auto; }
  .eye-bg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, #030504 0%, rgba(3,5,4,0.94) 34%, rgba(3,5,4,0.45) 62%, rgba(3,5,4,0.1) 100%), linear-gradient(0deg, rgba(3,5,4,0.85) 0%, rgba(3,5,4,0) 30%); }
</style></head><body>`;
const tail = `</body></html>`;
const top = (tag) => `<div class="og-top"><span class="og-word">DISCLOSURE</span><span class="og-tag">${tag}</span></div>`;
const foot = (left, right = 'getdisclosure.app') => `<div class="og-foot"><span>${left}</span><span>${right}</span></div>`;
const eye = (opts = '') => `<div class="eye-bg"><img src="${BASE}/frames/f150.webp" alt="" style="${opts}"></div>`;

/* ---------- eye family: home, quiz, drill ---------- */
function eyeCard({ tag, h, size, sub, footLeft, y = 170 }) {
  return `<div class="og">${eye()}${top(tag)}
  <div class="og-body" style="top:${y}px;right:470px"><h1 class="og-h" style="font-size:${size}px">${h}</h1>${sub ? `<p class="og-sub" style="max-width:15em">${sub}</p>` : ''}</div>
  ${foot(footLeft)}</div>`;
}

/* ---------- role family ---------- */
const ROLES = {
  sentinel: { name: 'Sentinel', color: 'var(--sentinel)', role: 'Primary protector', line: 'Stands between the unknown and everyone else.' },
  diplomat: { name: 'Diplomat', color: 'var(--diplomat)', role: 'De-escalation lead', line: 'Lowers the temperature of every room.' },
  scholar: { name: 'Scholar', color: 'var(--scholar)', role: 'Field analyst', line: 'Records while everyone else reacts.' },
  survivor: { name: 'Survivor', color: 'var(--survivor)', role: 'Self-preservation specialist', line: 'Reads the exit before the room.' },
  'first-contact': { name: 'First Contact', color: 'var(--gold)', role: 'Designation not issued', line: 'It is not assigned. It appears.' },
};
function roleCard(key) {
  const r = ROLES[key];
  const sealed = key === 'first-contact';
  return `<div class="og">
  <div class="eye-bg"><img src="${BASE}/frames/f150.webp" alt="" style="opacity:${sealed ? 0.34 : 0.26};filter:grayscale(${sealed ? 0.2 : 0.55})"></div>
  ${top(sealed ? 'Sealed file' : 'Role dossier')}
  <div class="og-body" style="top:158px">
    <p class="og-tag" style="margin:0 0 18px;color:var(--bone-dim)">${r.role}</p>
    <h1 class="og-h" style="font-size:${sealed ? 150 : 172}px;letter-spacing:-0.045em;line-height:0.9">${r.name}</h1>
    <div style="width:132px;height:5px;background:${r.color};margin:34px 0 28px"></div>
    <p class="og-sub" style="margin:0;font-size:36px;color:var(--bone)">${r.line}</p>
  </div>
  ${foot('Find your role')}</div>`;
}

/* ---------- roles hub ---------- */
function rolesCard() {
  const row = (k) => `<div style="display:flex;align-items:center;gap:18px"><span style="width:16px;height:16px;border-radius:50%;background:${ROLES[k].color};display:inline-block"></span><span style="font-family:var(--poster);font-weight:800;font-size:40px;letter-spacing:-0.02em">${ROLES[k].name}</span></div>`;
  return `<div class="og">
  <div class="eye-bg"><img src="${BASE}/frames/f150.webp" alt="" style="opacity:0.2;filter:grayscale(0.6)"></div>
  ${top('The roles')}
  <div class="og-body" style="top:150px;display:grid;grid-template-columns:1.25fr 1fr;gap:56px;align-items:start">
    <h1 class="og-h" style="font-size:96px">Four roles. A fifth is not issued.</h1>
    <div style="display:grid;gap:26px;padding-top:12px;line-height:1.1">
      ${['sentinel', 'diplomat', 'scholar', 'survivor'].map(row).join('')}
      <div style="display:flex;align-items:center;gap:18px"><span style="width:16px;height:16px;border-radius:50%;background:var(--gold);display:inline-block"></span><span class="rx rx-fixed rx-void" style="font-family:var(--poster);font-weight:800;font-size:40px;line-height:1.1">First Contact</span></div>
    </div>
  </div>
  ${foot('Find your role')}</div>`;
}

/* ---------- briefing: paper on the void ---------- */
function briefingCard() {
  const bar = (w) => `<span class="rx rx-fixed" style="display:inline-block;width:${w}px;height:1.05em;vertical-align:-0.18em">&nbsp;</span>`;
  return `<div class="og">
  ${top('Briefing')}
  <div style="position:absolute;left:72px;top:150px;width:470px;z-index:3">
    <h1 class="og-h" style="font-size:86px">The first minutes.</h1>
    <p class="og-sub" style="font-size:30px">A civilian briefing for the minute nobody rehearses.</p>
  </div>
  <article class="paper" style="position:absolute;left:622px;top:128px;width:500px;height:404px;--tilt:-2deg;padding:32px 38px;z-index:2;font-family:var(--body)">
    <div class="paper-head" style="font-size:14px"><span>Civilian contact file DSC-014</span><span class="dim">Page 1 of 3</span></div>
    <p style="margin:0 0 14px;font-family:var(--poster);font-weight:800;font-size:34px;line-height:1.05;letter-spacing:-0.02em">First contact briefing</p>
    <p style="margin:0 0 10px;font-size:18px;line-height:1.5">1. Stop. Count the people with you. Keep them ${bar(120)} and behind you.</p>
    <p style="margin:0 0 10px;font-size:18px;line-height:1.5">2. Hands open, voice low. Nothing sudden. ${bar(170)}</p>
    <p style="margin:0 0 10px;font-size:18px;line-height:1.5">3. Note the time, the direction, the light. ${bar(90)} what you can prove.</p>
    <span class="stamp" style="position:absolute;right:30px;bottom:30px;font-size:21px;padding:8px 16px;border-width:3px">Released in part</span>
    <span class="exempt" style="position:absolute;left:38px;bottom:38px;font-size:14px">(b)(1) (b)(3)</span>
  </article>
  ${foot('Read the briefing')}</div>`;
}

/* ---------- intel hub ---------- */
function intelCard() {
  return `<div class="og">
  <div style="position:absolute;right:0;top:0;width:520px;height:630px;z-index:1;overflow:hidden">
    <img src="${BASE}/assets/species-hangar/grey-hero.webp" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 30%;filter:saturate(0.8) brightness(0.85)">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,#030504 0%,rgba(3,5,4,0.55) 30%,rgba(3,5,4,0) 70%),linear-gradient(0deg,rgba(3,5,4,0.8),rgba(3,5,4,0) 35%)"></div>
  </div>
  ${top('Intel archive')}
  <div class="og-body" style="top:170px;right:500px">
    <h1 class="og-h" style="font-size:92px">The intel archive.</h1>
    <p class="og-sub" style="font-size:31px">Plain answers to the questions people type at 2 am. Reports kept apart from proof.</p>
  </div>
  ${foot('Open the archive')}</div>`;
}

const JOBS = {
  home: () => eyeCard({ tag: 'Released in part', h: 'This file was not meant for you.', size: 88, sub: 'Ten questions find your role for the first minute of contact.', footLeft: 'Find your role' }),
  quiz: () => eyeCard({ tag: 'Encounter quiz', h: 'Ten questions. One designation.', size: 80, y: 146, sub: 'Find your role if first contact happened tonight.', footLeft: 'Take the quiz' }),
  drill: () => eyeCard({ tag: 'Readiness drill', h: 'The first ten seconds.', size: 96, sub: 'Train the freeze out before you ever need to.', footLeft: 'Run the drill' }),
  roles: rolesCard,
  briefing: briefingCard,
  intel: intelCard,
  sentinel: () => roleCard('sentinel'),
  diplomat: () => roleCard('diplomat'),
  scholar: () => roleCard('scholar'),
  survivor: () => roleCard('survivor'),
  'first-contact': () => roleCard('first-contact'),
};

const only = process.argv.slice(2);
const names = only.length ? only.filter((n) => n in JOBS) : Object.keys(JOBS);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--headless=new'] });
let failed = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  for (const name of names) {
    await page.setContent(head + JOBS[name]() + tail, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    });
    const fontsOk = await page.evaluate(() => document.fonts.check('800 40px "Public Sans"') && document.fonts.check('16px "Space Mono"'));
    const brokenImgs = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
    let q = QUALITY, file = join(OUT, `${name}.jpg`), size = 0;
    for (;;) {
      await page.screenshot({ path: file, type: 'jpeg', quality: q });
      size = statSync(file).size;
      if (size <= MAX_BYTES || q <= 60) break;
      q -= 4;
    }
    const bad = !fontsOk || brokenImgs.length || size > MAX_BYTES;
    if (bad) failed++;
    console.log(`${bad ? 'FAIL' : 'ok  '} og/${name}.jpg ${size} bytes q${q}${fontsOk ? '' : ' FONTS-NOT-LOADED'}${brokenImgs.length ? ' BROKEN ' + brokenImgs.join(' ') : ''}`);
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
