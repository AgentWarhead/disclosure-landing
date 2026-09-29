// Generates /cases/ hub + every case page + assets/data/cases.json from content.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CASES, ARCHIVE, HUB } from './content.mjs';

const ROOT = 'C:/Users/bfauc/Desktop/Kootenay Made Digital/Disclosure App/disclosure-landing';
const HOST = 'https://www.getdisclosure.app';
const ACCESSED = '2026-09-28';
// Optional flags. Default behaviour (no flags) is unchanged.
//   --only=slug,slug  write just those case pages; skip the hub and cases.json
//   --out=dir         write under another root (for diffing a run without touching the site)
const argOf = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').slice(k.length + 3);
const ONLY = argOf('only') ? new Set(argOf('only').split(',')) : null;
const OUT = argOf('out') || ROOT;

// The hub copy states the case count from CASES, never a hardcoded number.
const NUM = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
const COUNT_WORD = NUM[CASES.length] || String(CASES.length);
for (const k of ['desc', 'ogDesc', 'lede']) HUB[k] = HUB[k].replaceAll('{Count}', COUNT_WORD);

// intel card data, read from the live hub (read only)
const intelHub = readFileSync(join(ROOT, 'intel/index.html'), 'utf8');
const INTEL = {};
for (const m of intelHub.matchAll(/<a href="\/intel\/([a-z0-9-]+)\/"><span class="fc-img"><img src="([^"]+)"[^>]*><\/span><span class="no">([^<]+)<\/span><span class="t">([^<]+)<span class="d">([^<]+)<\/span>/g)) {
  INTEL[m[1]] = { img: m[2], no: m[3], t: m[4], d: m[5] };
}
const CATOF = {};
for (const m of intelHub.matchAll(/<a href="\/intel\/([a-z0-9-]+)\/">[\s\S]*?<span class="cat">([^<]+)<\/span>/g)) CATOF[m[1]] = m[2];

const esc = s => String(s).replace(/&(?![a-z]+;|#\d+;)/g, '&amp;').replace(/"/g, '&quot;');
const stripTags = s => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&rsquo;/g, '\u2019').replace(/&ldquo;|&rdquo;/g, '"').replace(/&middot;/g, '\u00b7').replace(/&[a-z]+;/g, '');
const STATUS_WORD = { explained: 'Explained', disputed: 'Disputed', unexplained: 'Unexplained' };
const chip = s => `<span class="chip chip-${s}">${STATUS_WORD[s]}</span>`;
const ld = obj => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;

function head({ title, desc, path, control, ogType, ogTitle, ogDesc, ldBlocks, og, ogAlt }) {
  return `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title} | DISCLOSURE</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${HOST}${path}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030504">
<meta name="color-scheme" content="dark">
<meta name="dx:control" content="${control}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="DISCLOSURE">
<meta property="og:url" content="${HOST}${path}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(ogDesc)}">
<meta property="og:image" content="${HOST}${og || '/og/intel.jpg'}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogAlt || 'The DISCLOSURE archive.')}">
<meta name="twitter:card" content="summary_large_image">${og ? `\n<meta name="twitter:image" content="${HOST}${og}">` : ''}
<meta name="twitter:site" content="@disclosure_app">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300..900&amp;family=Space+Mono:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="/assets/dx/dx.css?v=5">
<link rel="stylesheet" href="/assets/dx/kit.css?v=5">
<link rel="stylesheet" href="/assets/dx/chrome.css?v=5">
<link rel="stylesheet" href="/assets/dx/intel.css?v=5">
<link rel="stylesheet" href="/assets/dx/cases.css?v=2">
${ldBlocks.map(ld).join('\n')}
</head>
<body>
<!-- dx:header -->
<!-- /dx:header -->
<main id="main">
`;
}
const FOOT = `</main>
<!-- dx:footer -->
<!-- /dx:footer -->
<script src="/assets/dx/dx.js?v=5" defer></script>
</body>
</html>
`;

function intelCard(slug) {
  const c = INTEL[slug];
  if (!c) throw new Error('no intel card ' + slug);
  return `<li><a href="/intel/${slug}/"><span class="fc-img"><img src="${c.img}" alt="" loading="lazy" decoding="async" width="768" height="429"></span><span class="no">${c.no}</span><span class="t">${c.t}<span class="d">${c.d}</span></span><span class="cat">${CATOF[slug] || 'Intel'}</span></a></li>`;
}
function caseCard(c, feat) {
  return `<li${feat ? ' class="feat"' : ''}><a href="/cases/${c.slug}/"><span class="fc-type" aria-hidden="true"><span class="fc-year">${c.year}</span><span class="fc-place">${c.cardPlace}</span>${chip(c.status)}</span><span class="no">Case ${c.no}</span><span class="t">${c.cardTitle}<span class="d">${c.cardLine}</span></span><span class="cat">${c.cardDate} &middot; ${STATUS_WORD[c.status]}</span></a></li>`;
}

// ---------- case pages ----------
for (const c of CASES) {
  if (ONLY && !ONLY.has(c.slug)) continue;
  const path = `/cases/${c.slug}/`;
  const words = stripTags(c.lede).split(/\s+/).filter(Boolean).length;
  if (words < 30 || words > 60) console.warn(`LEDE ${c.slug}: ${words} words`);
  const tlen = (c.title + ' | DISCLOSURE').length;
  if (tlen > 60) console.warn(`TITLE ${c.slug}: ${tlen}`);
  if (c.desc.length < 140 || c.desc.length > 160) console.warn(`DESC ${c.slug}: ${c.desc.length}`);

  const article = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: stripTags(c.h1), description: c.desc,
    image: [`${HOST}${c.og || '/og/intel.jpg'}`],
    url: HOST + path, mainEntityOfPage: { '@type': 'WebPage', '@id': HOST + path },
    datePublished: c.date || ACCESSED, dateModified: c.date || ACCESSED, articleSection: 'Case files',
    about: { '@type': 'Event', name: c.eventName, startDate: c.dateISO, location: { '@type': 'Place', name: c.placeFull, geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng } } },
    citation: c.sources.map(s => s.url),
    author: { '@type': 'Organization', name: 'DISCLOSURE', url: HOST + '/' },
    publisher: { '@type': 'Organization', name: 'DISCLOSURE', url: HOST + '/', logo: { '@type': 'ImageObject', url: HOST + '/android-chrome-512x512.png' } },
  };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
    { '@type': 'ListItem', position: 2, name: 'Case files', item: HOST + '/cases/' },
    { '@type': 'ListItem', position: 3, name: c.crumb, item: HOST + path },
  ] };

  const toc = [['what-happened', 'What happened'], ['evidence', 'What the evidence is'], ['explanations', 'The explanations on the table'], ['open', 'What is still open'], ['learn', 'What a civilian can learn'], ['sources', 'Sources']];
  const sheet = `<section class="case-sheet-wrap" aria-labelledby="sheet-h">
  <div class="wrap">
    <article class="paper case-sheet">
      <div class="paper-head"><span>Case file CSE-${c.no}</span><span class="dim">Summary sheet</span></div>
      <h2 id="sheet-h">Case summary</h2>
      <dl>
        <div class="row"><dt>Date</dt><dd>${c.sheet.date}</dd></div>
        <div class="row"><dt>Place</dt><dd>${c.sheet.place}</dd></div>
        <div class="row"><dt>Witnesses</dt><dd>${c.sheet.witnesses}</dd></div>
        <div class="row"><dt>Duration</dt><dd>${c.sheet.duration}</dd></div>
        <div class="row"><dt>Evidence</dt><dd>${c.sheet.evidence}</dd></div>
        <div class="row"><dt>Official finding</dt><dd>${c.sheet.finding}</dd></div>
        <div class="row row-status"><dt>Status</dt><dd><span class="stamp">${STATUS_WORD[c.status]}</span><p>${c.statusReason}</p></dd></div>
      </dl>
    </article>
  </div>
</section>`;

  const explanations = c.explanations.map(e => `<div class="explanation">
<h3>${e.h}</h3>
${e.html}
<p class="case-src">Best source: <a href="${e.src.url}" rel="noopener" target="_blank">${e.src.label}</a></p>
</div>`).join('\n');

  const sources = `<ol class="sources">
${c.sources.map(s => `<li><a href="${s.url}" rel="noopener" target="_blank">${s.title}</a>. <span class="dom">${s.domain}${s.pub ? ', ' + s.pub : ''}. Accessed ${c.accessed || ACCESSED}.</span></li>`).join('\n')}
</ol>`;

  const html = head({
    title: c.title, desc: c.desc, path, ogType: 'article', ogTitle: stripTags(c.h1), ogDesc: c.ogDesc || c.desc,
    control: `File CSE-${c.no} &middot; ${c.crumb} &middot; Unclassified`, ldBlocks: [article, crumbs], og: c.og, ogAlt: c.ogAlt,
  }) + `<header class="page-head case-head">
  <span class="case-year" aria-hidden="true">${c.year}</span>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/cases/">Case files</a></li><li aria-current="page">${c.crumb}</li></ol></nav>
    <h1>${c.h1}</h1>
    <p class="lede">${c.lede}</p>
    <p class="label case-meta"><span>Case ${c.no}</span><span>${c.cardDate}</span><span>${c.cardPlace}</span>${chip(c.status)}</p>
  </div>
</header>
${sheet}
<div class="wrap intel-body case-body">
  <article class="prose">
<h2 id="what-happened">What happened</h2>
${c.happened}
<h2 id="evidence">What the evidence is</h2>
${c.evidence}
<h2 id="explanations">The explanations on the table</h2>
${c.explIntro || ''}
${explanations}
<h2 id="open">What is still open</h2>
${c.open}
<h2 id="learn">What a civilian can learn from it</h2>
${c.learn}
<aside class="ledger-link"><p class="callout-h">Where this sits on the record</p><p>${c.ledgerLine} <a href="/record/">Open the Disclosure Ledger</a>.</p></aside>
<h2 id="sources">Sources</h2>
<p>Every source used on this page, with the date it was checked. Official records are listed first.</p>
${sources}
  </article>
  <aside class="intel-side" aria-label="File tools">
    <nav class="toc" aria-labelledby="toc-h">
      <p class="label" id="toc-h">In this file</p>
      <ol>
${toc.map(([id, t]) => `        <li><a href="#${id}">${t}</a></li>`).join('\n')}
      </ol>
    </nav>
    <div class="field-note">
      <span class="label">Field note</span>
      <p>${c.fieldNote}</p>
      <a class="link" href="/#classify">Find your role <span aria-hidden="true">&rarr;</span></a>
    </div>
  </aside>
</div>
<section class="section intel-related" aria-labelledby="rel-h">
  <div class="wrap">
    <h2 id="rel-h" class="intel-related-h">Related files</h2>
    <ol class="file-index file-cards cards-4">
      ${c.related.map(intelCard).join('\n      ')}
    </ol>
    <p class="cat-link"><a class="link" href="/cases/">All case files <span aria-hidden="true">&rarr;</span></a></p>
  </div>
</section>
<section class="ask" aria-labelledby="ask-h">
  <div class="wrap ask-grid">
    <div><h2 id="ask-h">${c.askH}</h2></div>
    <div>
      <p>${c.askP}</p>
      <div class="actions"><a class="btn" href="/#classify">Find your role <span class="arr" aria-hidden="true">&rarr;</span></a></div>
    </div>
  </div>
</section>
` + FOOT;
  mkdirSync(join(OUT, 'cases', c.slug), { recursive: true });
  const file = join(OUT, 'cases', c.slug, 'index.html');
  // keep the stamped header/footer if the file already exists (dx-chrome refills anyway)
  writeFileSync(file, html);
}

// ---------- hub ----------
if (!ONLY) {
  const path = '/cases/';
  const counts = { explained: 0, disputed: 0, unexplained: 0 };
  CASES.forEach(c => counts[c.status]++);
  const n = CASES.length;
  const tally = Object.entries(counts).filter(([, v]) => v).map(([k, v]) => `${v} ${STATUS_WORD[k].toLowerCase()}`).join(', ');
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
      { '@type': 'ListItem', position: 2, name: 'Case files', item: HOST + path } ] },
    { '@type': 'CollectionPage', '@id': HOST + path, url: HOST + path, name: HUB.title, description: HUB.desc,
      isPartOf: { '@id': HOST + '/#site' },
      mainEntity: { '@type': 'ItemList', numberOfItems: n, itemListElement: CASES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${HOST}/cases/${c.slug}/`, name: stripTags(c.h1) })) } },
  ] };
  const html = head({ title: HUB.title, desc: HUB.desc, path, ogType: 'website', ogTitle: HUB.title, ogDesc: HUB.ogDesc, control: `Archive &middot; Case files &middot; ${n} files`, ldBlocks: [graph] })
  + `<header class="page-head case-head">
  <span class="case-year" aria-hidden="true">CSE</span>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Case files</li></ol></nav>
    <h1>${HUB.h1}</h1>
    <p class="lede">${HUB.lede}</p>
    <p class="label cat-count">${n} case files &middot; ${ARCHIVE.length} more in the archive</p>
  </div>
</header>
<section class="section cat-answer" aria-labelledby="labels-h">
  <div class="wrap cat-answer-grid">
    <h2 id="labels-h">How each case is labeled</h2>
    <div>
      <p class="lede cat-answer-text">${HUB.labelsIntro}</p>
      <ul class="case-labels">
        <li>${chip('explained')}<p>${HUB.labels.explained}</p></li>
        <li>${chip('disputed')}<p>${HUB.labels.disputed}</p></li>
        <li>${chip('unexplained')}<p>${HUB.labels.unexplained}</p></li>
      </ul>
    </div>
  </div>
</section>
<section class="section" aria-labelledby="files-h">
  <div class="wrap">
    <h2 id="files-h" class="case-files-h">The case files</h2>
    <p class="label case-tally">${n} files: ${tally}</p>
    <ol class="file-index file-cards">
      ${CASES.map((c, i) => caseCard(c, false)).join('\n      ')}
    </ol>
  </div>
</section>
<section class="section" aria-labelledby="also-h">
  <div class="wrap">
    <h2 id="also-h" class="case-files-h">Also in the archive</h2>
    <p class="dim" style="max-width:58ch;margin:calc(-1 * var(--space-4)) 0 var(--space-6)">${HUB.alsoLine}</p>
    <ol class="file-index file-cards cards-4">
      ${ARCHIVE.map(intelCard).join('\n      ')}
    </ol>
    <p class="cat-link"><a class="link" href="/record/">The Disclosure Ledger <span aria-hidden="true">&rarr;</span></a></p>
  </div>
</section>
<section class="ask" aria-labelledby="ask-h">
  <div class="wrap ask-grid">
    <div><h2 id="ask-h">${HUB.askH}</h2></div>
    <div>
      <p>${HUB.askP}</p>
      <div class="actions"><a class="btn" href="/#classify">Find your role <span class="arr" aria-hidden="true">&rarr;</span></a></div>
    </div>
  </div>
</section>
` + FOOT;
  if (HUB.desc.length < 140 || HUB.desc.length > 160) console.warn('HUB DESC ' + HUB.desc.length);
  mkdirSync(join(OUT, 'cases'), { recursive: true });
  writeFileSync(join(OUT, 'cases', 'index.html'), html);
}

// ---------- data ----------
if (!ONLY) {
mkdirSync(join(OUT, 'assets/data'), { recursive: true });
writeFileSync(join(OUT, 'assets/data/cases.json'), JSON.stringify({
  generated: ACCESSED,
  note: 'Structured case summaries for the DISCLOSURE case files. Claims are recorded as claims; status labels are defined at /cases/.',
  statusLabels: HUB.labels,
  cases: CASES.map(c => ({
    slug: c.slug, url: `/cases/${c.slug}/`, no: c.no, name: c.eventName, title: stripTags(c.h1),
    date: c.dateISO, dateDisplay: stripTags(c.sheet.date), year: c.year,
    place: c.placeFull, country: c.country, lat: c.lat, lng: c.lng, coordsNote: c.coordsNote,
    witnesses: stripTags(c.sheet.witnesses), duration: stripTags(c.sheet.duration), evidence: stripTags(c.sheet.evidence),
    officialFinding: stripTags(c.sheet.finding), officialFindingSource: c.findingSource,
    status: c.status, statusReason: stripTags(c.statusReason), verdict: stripTags(c.lede),
    explanations: c.explanations.map(e => ({ name: stripTags(e.h), source: e.src.url })),
    sources: c.sources.map(s => ({ title: stripTags(s.title), url: s.url, domain: s.domain, published: s.pub || null, accessed: c.accessed || ACCESSED })),
  })),
  alsoInArchive: ARCHIVE.map(s => `/intel/${s}/`),
}, null, 2) + '\n');
}
console.log(ONLY ? `generated ${[...ONLY].join(', ')} only (hub and data untouched)` : `generated ${CASES.length} cases + hub + data`);
