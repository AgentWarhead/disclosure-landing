// Site gate: static checks over every page. Exits 1 on any failure.
// Usage: node scripts/dx-check.mjs [--verbose]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const verbose = process.argv.includes('--verbose');
const SKIP = new Set(['.git', 'node_modules', 'docs', 'scripts', 'supabase', 'frames', '.claude', 'api', 'og', 'assets']);
const HOST = 'https://www.getdisclosure.app';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name === 'index.html' || (dir === root && name === '404.html')) out.push(p);
  }
  return out;
}
const pathOf = f => '/' + relative(root, f).split(sep).join('/').replace(/index\.html$/, '');
const strip = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
  .replace(/\s+/g, ' ');

const BANNED = [
  [/\bexecutive order\b/i, 'executive order (none exists; allowed only when explicitly negated)'],
  [/\b\d{1,2}(\.\d)?\s?% of (the )?(population|people|civilians|users)/i, 'role percentage'],
  [/(about|approximately|roughly)\s\d{1,2}%/i, 'invented percentage'],
  [/<\s?0\.1\s?%/i, 'rarity percentage'],
  [/\b99\+/, 'fake counter'],
  [/\b(apple|google) wallet\b/i, 'wallet claim'],
  [/\b(available now|download (it )?now|get it on the app store)\b/i, 'store claim'],
  [/\b(funnel|conversion|viral loop|search intent|seo)\b/i, 'internal language'],
  [/\b(unleash\w*|elevate[sd]? (your|the|every)|seamless\w*|game-?changer|empower\w*)\b/i, 'kill-list word'],
];

const pages = walk(root);
const failures = [];
let checked = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const path = pathOf(file);
  const is404 = file.endsWith('404.html');
  const f = [];
  checked++;

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const og = (html.match(/<meta property="og:image" content="([^"]*)"/) || [])[1] || '';
  const h1s = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) f.push('no title');
  else if (title.replace(/&amp;/g, '&').length > 65) f.push(`title ${title.length} chars`);
  if (!is404) {
    if (desc.length < 110 || desc.length > 170) f.push(`description ${desc.length} chars`);
    const want = path === '/' ? HOST + '/' : HOST + path;
    if (canon !== want) f.push(`canonical "${canon}" want "${want}"`);
    if (!og) f.push('no og:image');
    else {
      const local = og.replace(HOST, '').replace(/^https:\/\/getdisclosure\.app/, '');
      if (!existsSync(join(root, decodeURIComponent(local)))) f.push(`og:image missing on disk ${local}`);
    }
  }
  if (h1s !== 1) f.push(`${h1s} h1`);
  if (!html.includes('<!-- dx:header') || !html.includes('dx-nav')) f.push('no shared header');
  if (!html.includes('dx-foot')) f.push('no shared footer');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); const s = JSON.stringify(j); if (/getdisclosure\.app\/[a-z0-9-/]*[a-z0-9]"/.test(s) && /"(url|@id|item)":"https:\/\/www\.getdisclosure\.app\/[^"#]*[^/"]"/.test(s)) f.push('JSON-LD url without trailing slash'); }
    catch (e) { f.push('JSON-LD does not parse'); }
  }

  const text = strip(html);
  if (text.includes('—')) f.push('em dash in text');
  if (/\s–\s/.test(text)) f.push('en dash used as a dash');
  if (/[a-z,.]\s-\s[a-zA-Z]/.test(text)) f.push(`spaced hyphen dash: "${text.match(/.{20}[a-z,.]\s-\s[a-zA-Z].{20}/)?.[0]}"`);
  for (const [re, label] of BANNED) {
    const m = text.match(re);
    if (!m) continue;
    if (label.startsWith('executive order')) {
      const around = text.slice(Math.max(0, m.index - 80), m.index + 40).toLowerCase();
      if (/\b(no|not|never|wasn't|was not|isn't)\b/.test(around)) continue;
    }
    f.push(`${label}: "${text.slice(Math.max(0, m.index - 30), m.index + 40).trim()}"`);
  }
  if (/[Ãâ][\u0080-¿€™]/.test(html)) f.push('mojibake');

  for (const m of html.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (/<(em|i)\b|<span[^>]*class="[^"]*(accent|signal|green|outline|hl)/.test(m[2])) f.push(`accent word in ${m[1]}`);
  }

  for (const m of html.matchAll(/href="(\/[^"#?]*)(#[^"]*)?"/g)) {
    const href = m[1];
    if (/\.(png|jpe?g|webp|svg|ico|xml|txt|webmanifest|css|js|pdf)$/.test(href)) { if (!existsSync(join(root, href))) f.push(`missing file ${href}`); continue; }
    const target = href.endsWith('/') ? join(root, href, 'index.html') : null;
    if (!target) { f.push(`link without trailing slash ${href}`); continue; }
    if (!existsSync(target)) f.push(`broken link ${href}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) f.push('img without alt');

  if (f.length) failures.push([path, f]);
  else if (verbose) console.log('ok', path);
}

for (const [p, f] of failures) console.log(`\n${p}\n  - ${[...new Set(f)].join('\n  - ')}`);
console.log(`\n${checked} pages checked, ${failures.length} with failures`);
process.exitCode = failures.length ? 1 : 0;
