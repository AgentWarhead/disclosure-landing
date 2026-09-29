// Writes sitemap.xml and llms.txt from the pages on disk.
// Every folder with an index.html is a page, except the skipped folders and any page marked noindex.
// Intel titles come from each page's <title> (first segment), falling back to its <h1>.
// Usage: node scripts/dx-sitemap.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const HOST = 'https://www.getdisclosure.app';
/* lastmod is real per page: scripts/lastmod.json keeps a hash of each page's <main> text and the
   moment it last changed. A page's lastmod moves only when its content does, and each Article's
   dateModified (the day part) is kept in step. The ledger was seeded 2026-09-28, the day the overhaul
   went live. New changes are stamped with the time, not just the day (2026-09-29): IndexNow submits
   pages whose lastmod moved, and a second edit on the same day never moved a day-only date. */
const LEDGER_FILE = join(root, 'scripts', 'lastmod.json');
const SEED = '2026-09-28';
const TODAY = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
let ledger = {};
try { ledger = JSON.parse(readFileSync(LEDGER_FILE, 'utf8')); } catch (e) { ledger = {}; }
const seeding = Object.keys(ledger).length === 0;
const SKIP = new Set(['.git', '.claude', 'node_modules', 'docs', 'scripts', 'supabase', 'api', 'frames', 'og']);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', middot: '·', hellip: '...', mdash: ', ', ndash: '-' };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in ENT ? ENT[n.toLowerCase()] : m));
}
function clean(s) {
  return decode(s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s*\u2014\s*/g, ', ')
    .replace(/\s+\u2013\s+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

const pages = walk(root).map((file) => {
  const rel = relative(root, file).split(sep).join('/');
  const path = '/' + rel.replace(/index\.html$/, '');
  const src = readFileSync(file, 'utf8');
  const noindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(src);
  const t = (src.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const h1 = (src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  const fromTitle = clean(t).split(' | ')[0].trim();
  const title = fromTitle && !/^DISCLOSURE$/i.test(fromTitle) ? fromTitle : clean(h1);
  const main = (src.match(/<main[\s\S]*?<\/main>/i) || [src])[0];
  const hash = createHash('sha256').update(clean(main)).digest('hex').slice(0, 16);
  const prev = ledger[path];
  const date = prev && prev.hash === hash ? prev.date : (seeding ? SEED : TODAY);
  ledger[path] = { hash, date };
  const day = date.slice(0, 10);
  if (/"dateModified":\s*"[^"]*"/.test(src) && !src.includes('"dateModified": "' + day + '"')) {
    writeFileSync(file, src.replace(/("dateModified":\s*")[^"]*(")/, '$1' + day + '$2'));
  }
  return { path, url: HOST + path, title, noindex, date };
}).filter((p) => !p.noindex);

/* ---------- ordering ---------- */
const CORE = [
  ['/', 'Home: the public record, the ten-question classification, the four roles, the app'],
  ['/archetypes/', 'The roles: the four public roles and the sealed fifth'],
  ['/quiz/', 'Encounter quiz: the same ten-question classification, for people who land here from search'],
  ['/first-contact/', 'First contact briefing: what a civilian should do in the first minutes'],
  ['/readiness/', 'Ten-second drill: a short practice run for the first minute'],
  ['/intel/', 'Intel archive: every intel file in one index'],
  ['/faq/', 'FAQ: plain answers about the app, the roles and the public record'],
  ['/about/', 'About: what DISCLOSURE is and how it handles the record'],
  ['/privacy/', 'Privacy policy, including how to unsubscribe'],
  ['/terms/', 'Terms of service'],
];
const DOSSIERS = [
  ['/archetype/sentinel/', 'Sentinel dossier: primary protector'],
  ['/archetype/diplomat/', 'Diplomat dossier: de-escalation lead'],
  ['/archetype/scholar/', 'Scholar dossier: field analyst'],
  ['/archetype/survivor/', 'Survivor dossier: self-preservation specialist'],
  ['/archetype/first-contact/', 'First Contact: the sealed file'],
];

const byPath = new Map(pages.map((p) => [p.path, p]));
const used = new Set();
const pick = (list) => list.filter(([p]) => byPath.has(p)).map(([p, label]) => { used.add(p); return { ...byPath.get(p), label }; });
const core = pick(CORE);
const dossiers = pick(DOSSIERS);
const INTEL_HUBS = new Set(['/intel/protocol/', '/intel/field-guide/', '/intel/psychology/', '/intel/species/', '/intel/public-record/', '/intel/theory/']);
const intel = pages.filter((p) => p.path.startsWith('/intel/') && p.path !== '/intel/').sort((a, b) => a.path.localeCompare(b.path));
intel.forEach((p) => used.add(p.path));
const other = pages.filter((p) => !used.has(p.path)).sort((a, b) => a.path.localeCompare(b.path));

/* ---------- sitemap.xml ---------- */
const ordered = [...core, ...dossiers, ...other, ...intel];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...ordered.map((p) => `  <url><loc>${p.url}</loc><lastmod>${p.date}</lastmod></url>`),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(root, 'sitemap.xml'), sitemap);
writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 1) + '\n');

/* ---------- llms.txt ---------- */
const line = (p, label) => `- [${label || p.title}](${p.url})`;
const llms = `# DISCLOSURE

> DISCLOSURE (getdisclosure.app) is a civilian first contact preparation app. It is in development for iOS and Android and has not been released. No release date is set. The website hosts a ten-question classification that gives each person a role for the first minutes of a contact event, plus role dossiers, a briefing, a short drill and an archive of intel files.

DISCLOSURE is not affiliated with any government agency.

## What it is

DISCLOSURE treats first contact the way a fire drill treats a fire: as something worth rehearsing whether or not it ever happens. It does not claim that contact has happened. The app is meant to train calm, practical behavior for the first minute: who moves people, who talks, who records, who finds the exit.

The website is live now. The app is not in any app store yet. People who take the classification can have their First Contact Card emailed to them and hear when the app opens.

## The classification and the roles

Ten scenario questions. Each answer leans toward one of four public roles. The result is a role, a serial number, a First Contact Card and an iris print drawn from the person's own answers, so no two people with different answers get the same one.

The four public roles:

- Sentinel, primary protector: stands between the unknown and everyone else, counts heads and holds the gap.
- Diplomat, de-escalation lead: lowers the temperature with open hands, a quiet voice and nothing sudden.
- Scholar, field analyst: records while everyone else reacts, and keeps what can be proven apart from what was only seen.
- Survivor, self-preservation specialist: reads the exit first and gets people moving before panic spreads.

There is also a sealed fifth designation, First Contact. It is not issued through the normal scoring and the site does not publish how it is assigned.

How often each role comes up is not measured, so no role percentages are published.

## Honesty

- Every official report so far, including the Pentagon's AARO historical review (March 2024) and NASA's independent UAP study (September 2023), found no evidence of extraterrestrial technology. None of the public documents the site cites confirm contact.
- The public record the site uses: sworn House Oversight testimony (July 26, 2023); NASA's UAP study report (September 14, 2023); a reduced UAP records provision that became law in the FY2024 defense bill (December 22, 2023) and created a UAP Records Collection at the National Archives; AARO's historical report (March 8, 2024); a second House hearing (November 13, 2024); a National Archives release of agency UAP records (April 24, 2025); the President saying in February 2026 that he was directing agencies to release UAP files (this was not an executive order); the Department of War's first batch of declassified UAP files (May 8, 2026); and a fuller UAP Disclosure Act amendment that passed the House on July 22, 2026 and is not law.
- Species files, abduction accounts and lore are presented as reports and claims, not as established fact.
- The site publishes no invented statistics, no live counters it cannot back, and no store badges while the app is unreleased.

## Planned app features

The app is in development and details may change. The planned features are: the classification; a First Contact Card with role, readiness score and serial; Liaison Standard (practising slow, open gestures with the front camera); Universal Translator (frequency tones and flashlight pulses); Stone Cold Drills (holding still through strange audio and sudden light); Rules of Engagement (light discipline and the 30-foot buffer); Family Drill Mode; Mental Fortitude (breathing paced by haptics); The Liaison's Creed; Blackout Mode; Incident Reports; and the Global Liaison Map.

## Core pages

${core.map((p) => line(p, p.label)).join('\n')}

## Role dossiers

${dossiers.map((p) => line(p, p.label)).join('\n')}
${other.length ? `\n## Other pages\n\n${other.map((p) => line(p)).join('\n')}\n` : ''}
## Intel files (${intel.filter((p) => !INTEL_HUBS.has(p.path)).length} files and ${intel.filter((p) => INTEL_HUBS.has(p.path)).length} category hubs)

${intel.map((p) => line(p)).join('\n')}
`;
writeFileSync(join(root, 'llms.txt'), llms);

console.log(`sitemap.xml: ${ordered.length} urls (core ${core.length}, dossiers ${dossiers.length}, other ${other.length}, intel ${intel.length})`);
const missing = [...CORE, ...DOSSIERS].map(([p]) => p).filter((p) => !byPath.has(p));
if (missing.length) console.log(`expected but not on disk (or noindex): ${missing.join(', ')}`);
const bad = [...llms].filter((c) => c === '\u2014' || c === '\u2013').length;
if (bad) { console.log(`llms.txt contains ${bad} em/en dash(es)`); process.exitCode = 1; }
