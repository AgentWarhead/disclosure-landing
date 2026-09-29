// Stamps the shared header and footer onto every page between markers.
//   <!-- dx:header -->...<!-- /dx:header -->   (add "over" for a transparent nav over a hero: <!-- dx:header over -->)
//   <!-- dx:footer -->...<!-- /dx:footer -->
// The footer control line reads <meta name="dx:control" content="...">.
// Usage: node scripts/dx-chrome.mjs [--check] [--only=/cases/]
//   --only=<prefix>  stamp only pages whose URL path starts with the prefix (default: every page)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES } from './dx-data.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const header = readFileSync(join(root, 'docs/partials/header.html'), 'utf8').trim();
const footer = readFileSync(join(root, 'docs/partials/footer.html'), 'utf8').trim();
const check = process.argv.includes('--check');
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice('--only='.length);
const SKIP = new Set(['.git', 'node_modules', 'docs', 'scripts', 'supabase', 'frames', '.claude', 'api']);

function pages(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...pages(p));
    else if (name === 'index.html' || (dir === root && name === '404.html')) out.push(p);
  }
  return out;
}

function urlPath(file) {
  const rel = relative(root, file).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
}

const GLOW = { sentinel: 'rgba(239,68,68,.32)', diplomat: 'rgba(34,197,94,.32)', scholar: 'rgba(96,165,250,.32)', survivor: 'rgba(249,115,22,.32)', 'first-contact': 'rgba(255,215,0,.32)' };
function lensFor(path) {
  let m;
  if ((m = path.match(/^\/archetype\/(sentinel|diplomat|scholar|survivor|first-contact)\/$/))) return { src: '/assets/brand/iris-' + m[1] + '.webp', kind: 'iris', glow: GLOW[m[1]] };
  const map = {
    '/archetypes/': { src: '/assets/species-hangar/hangar-bg.webp', kind: 'wide' },
    '/intel/': { src: '/asset-bg-alien.webp', kind: 'wide' },
    '/first-contact/': { src: '/frames/f140.webp' },
    '/readiness/': { src: '/frames/f090.webp' },
    '/quiz/': { src: '/frames/f188.webp' },
    '/faq/': { src: '/frames/f060.webp' },
    '/about/': { src: '/frames/f001.webp' },
    '/privacy/': { src: '/frames/f075.webp' },
    '/terms/': { src: '/frames/f075.webp' },
    '/accessibility/': { src: '/frames/f075.webp' },
    '/tools/': { src: '/intel/images/ufo-sighting-1280.webp', kind: 'wide' },
    '/tools/what-did-i-see/': { src: '/intel/images/starlink-vs-ufo-1280.webp', kind: 'wide' },
    '/tools/report/': { src: '/assets/evidence/sketch-grey.webp', kind: 'wide' },
    '/tools/drake/': { src: '/intel/images/fermi-paradox-1280.webp', kind: 'wide' },
    '/glossary/': { src: '/asset-bg-alien.webp', kind: 'wide' },
    '/record/': { src: '/intel/images/roswell-incident-1280.webp', kind: 'wide' },
    '/record/pursue/': { src: '/asset-bg-alien.webp', kind: 'wide' },
    '/cases/': { src: '/assets/species-hangar/hangar-bg.webp', kind: 'wide' },
    '/404': { src: '/frames/f075.webp' },
    ...Object.fromEntries(CATEGORIES.map(c => ['/intel/' + c.slug + '/', { src: c.lens, kind: 'wide' }])),
  };
  return map[path] || null;
}

// live counts from the intel hub, so the nav never states a stale number
const hubHtml = readFileSync(join(root, 'intel', 'index.html'), 'utf8');
const DATA_TO_SLUG = { protocol: 'protocol', 'field-guide': 'field-guide', psychology: 'psychology', species: 'species', record: 'public-record', theory: 'theory' };
const catCount = {};
let intelCount = 0;
for (const g of hubHtml.matchAll(/<section class="intel-group" data-cat="([^"]+)"[\s\S]*?<\/section>/g)) {
  const n = (g[0].match(/<li[^>]*><a href="\/intel\/[^/"]+\/">/g) || []).length;
  catCount[DATA_TO_SLUG[g[1]]] = n; intelCount += n;
}
function fillCounts(html) {
  html = html.replace(/\{\{INTEL_COUNT\}\}/g, String(intelCount));
  html = html.replace(/(All )\d+( (?:intel )?files)/g, `$1${intelCount}$2`);
  return html.replace(/(<a href="\/intel\/([a-z-]+)\/"><span class="label">)\d+ files/g, (m, a, slug) => catCount[slug] ? `${a}${catCount[slug]} files` : m);
}

let changed = 0, missing = [];
for (const file of pages(root)) {
  const path = urlPath(file);
  if (only && !path.startsWith(only)) continue;
  const src = readFileSync(file, 'utf8');
  let out = src;

  const h = out.match(/<!-- dx:header( over)? -->[\s\S]*?<!-- \/dx:header -->/);
  const f = out.match(/<!-- dx:footer -->[\s\S]*?<!-- \/dx:footer -->/);
  if (!h || !f) { missing.push(path); continue; }

  const control = (out.match(/<meta name="dx:control" content="([^"]*)"/) || [])[1] || 'Released in part';
  let hdr = fillCounts(header.replace('{{NAV_ATTR}}', h[1] ? ' data-over data-mode="over"' : '').replace('{{CONTROL}}', control));
  // exact-page links get aria-current (panel lists, mobile sheet)
  hdr = hdr.replace(/<a((?: class="[^"]*")?) href="([^"]+)">/g, (m, cls, href) => href === path && href !== '/' ? `<a${cls} href="${href}" aria-current="page">` : m);
  // the section tab for this page gets marked
  const section = /^\/(archetypes|archetype|quiz|about|faq)\//.test(path) ? (header.includes('dx-p-record') ? 'file' : (path === '/faq/' ? 'faq' : 'file'))
    : /^\/(first-contact|readiness)\/$/.test(path) || path === '/intel/protocol/' ? 'protocol'
    : /^\/(record|cases)\//.test(path) ? 'record'
    : path.startsWith('/tools/') ? 'tools'
    : path.startsWith('/intel/') || path === '/glossary/' ? 'archive' : '';
  if (section === 'faq') hdr = hdr.replace('<a class="dx-tab dx-tab-link" href="/faq/">', '<a class="dx-tab dx-tab-link is-current" href="/faq/" aria-current="page">');
  else if (section) hdr = hdr.replace(`class="dx-tab" type="button" aria-expanded="false" aria-controls="dx-p-${section}"`, `class="dx-tab is-current" type="button" aria-expanded="false" aria-controls="dx-p-${section}"`);
  const ftr = footer.replace('{{CONTROL}}', control);

  // ---- the kit: kit.css, the lens, the control strip (docs/SCROLL-SCORE.md) ----
  if (!out.includes('/assets/dx/kit.css')) out = out.replace(/(<link rel="stylesheet" href="\/assets\/dx\/dx\.css\?v=\d+">)/, '$1\n<link rel="stylesheet" href="/assets/dx/kit.css?v=5">');
  if (!out.includes('/assets/dx/chrome.css')) out = out.replace(/(<link rel="stylesheet" href="\/assets\/dx\/kit\.css\?v=\d+">)/, '$1\n<link rel="stylesheet" href="/assets/dx/chrome.css?v=5">');
  out = out.replace(/\n?<!-- dx:lens -->[\s\S]*?<!-- \/dx:lens -->/g, '');
  out = out.replace(/\n?<!-- dx:strip -->[\s\S]*?<!-- \/dx:strip -->/g, '');
  const lens = lensFor(path);
  if (lens) out = out.replace(/(<header class="page-head[^"]*"[^>]*>)/, `$1\n<!-- dx:lens --><div class="lens${lens.kind ? ' lens-' + lens.kind : ''}" aria-hidden="true"${lens.glow ? ` style="--lens-glow:${lens.glow}"` : ''}><img src="${lens.src}" alt="" decoding="async" fetchpriority="high"></div><!-- /dx:lens -->`);
  const strip = `<!-- dx:strip --><div class="strip" aria-hidden="true"><i style="width:64px"></i><span>${control.replace(/&middot;/g, '<b>/</b>')}</span><i style="width:140px"></i><span>Released in part</span><i style="width:38px"></i><span>Civilian copy</span><i style="width:220px"></i><i style="width:90px"></i></div><!-- /dx:strip -->`;
  out = out.replace(/(<header class="(?:page-head|plate)[^"]*"[^>]*>[\s\S]*?<\/header>)/, `$1\n${strip}`);

  out = out.replace(h[0], `<!-- dx:header${h[1] || ''} -->\n${hdr}\n<!-- /dx:header -->`);
  out = out.replace(f[0], `<!-- dx:footer -->\n${ftr}\n<!-- /dx:footer -->`);
  if (out !== src) {
    changed++;
    if (!check) writeFileSync(file, out);
  }
}
console.log(`${check ? 'would change' : 'changed'} ${changed} page(s)`);
if (missing.length) console.log(`no markers (${missing.length}): ${missing.join(', ')}`);
if (check && changed) process.exitCode = 1;
