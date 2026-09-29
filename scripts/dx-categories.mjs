// Intel category hubs: writes /intel/<category>/index.html and wires every article into its hub
// (breadcrumb, BreadcrumbList, meta row link, "all files in this category" link). Idempotent.
// Usage: node scripts/dx-categories.mjs   (then run dx-chrome.mjs and dx-evidence.mjs)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, CAT_BY_SLUG, DATA_CAT } from './dx-data.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const HOST = 'https://www.getdisclosure.app';
const hubPath = join(root, 'intel', 'index.html');
let hub = readFileSync(hubPath, 'utf8');

// ---- read the hub: which files belong to which category, with their card text
const files = {};      // slug -> { no, title, d, cat }
const members = {};    // cat slug -> [slug]
for (const g of hub.matchAll(/<section class="intel-group" data-cat="([^"]+)"[\s\S]*?<\/section>/g)) {
  const cat = DATA_CAT[g[1]];
  members[cat] = [];
  for (const li of g[0].matchAll(/<li(?: class="feat")?><a href="\/intel\/([^/]+)\/">[\s\S]*?<span class="no">File (\d{3})<\/span><span class="t">([^<]+)<span class="d">([^<]+)<\/span>/g)) {
    const [, slug, no, title, d] = li;
    files[slug] = { no, title: title.trim(), d: d.trim(), cat };
    members[cat].push(slug);
  }
}

// thumbnails from each article's plate
const thumb = slug => {
  const p = join(root, 'intel', slug, 'index.html');
  if (!existsSync(p)) return null;
  const h = readFileSync(p, 'utf8');
  const m = h.match(/<img class="plate-img"[^>]*?srcset="([^"\s]+)\s+768w/) || h.match(/<img class="plate-img"[^>]*?src="([^"]+)"/);
  return m ? m[1] : null;
};
const esc = s => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

function card(slug, feat) {
  const f = files[slug];
  const t = thumb(slug);
  const img = t ? `<span class="fc-img"><img src="${t}" alt="" loading="lazy" decoding="async" width="768" height="429"></span>` : '<span class="fc-img fc-none"></span>';
  return `        <li${feat ? ' class="feat"' : ''}><a href="/intel/${slug}/">${img}<span class="no">File ${f.no}</span><span class="t">${f.title}<span class="d">${f.d}</span></span><span class="cat">${CAT_BY_SLUG[f.cat].name}</span></a></li>`;
}

// ---- write the six hubs
for (const c of CATEGORIES) {
  const list = members[c.slug] || [];
  const ordered = [c.start, ...list.filter(s => s !== c.start)].filter(s => files[s]);
  const url = `${HOST}/intel/${c.slug}/`;
  const others = CATEGORIES.filter(o => o.slug !== c.slug);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
        { '@type': 'ListItem', position: 2, name: 'Intel', item: `${HOST}/intel/` },
        { '@type': 'ListItem', position: 3, name: c.name, item: url } ] },
      { '@type': 'CollectionPage', '@id': url, url, name: c.title, description: c.desc,
        isPartOf: { '@id': `${HOST}/#site` },
        mainEntity: { '@type': 'ItemList', numberOfItems: ordered.length,
          itemListElement: ordered.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${HOST}/intel/${s}/`, name: files[s].title })) } },
    ],
  };
  const html = `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.title)} | DISCLOSURE</title>
<meta name="description" content="${esc(c.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030504">
<meta name="color-scheme" content="dark">
<meta name="dx:control" content="Archive &middot; ${esc(c.name)} &middot; ${ordered.length} files">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DISCLOSURE">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.lede)}">
<meta property="og:image" content="${HOST}/og/intel.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The DISCLOSURE intel archive.">
<meta name="twitter:card" content="summary_large_image">
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
<link rel="stylesheet" href="/assets/dx/intel.css?v=5">
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
</head>
<body>
<!-- dx:header -->
<!-- /dx:header -->

<main id="main">

  <header class="page-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/intel/">Intel</a></li><li aria-current="page">${c.name}</li></ol></nav>
      <h1>${c.h1}</h1>
      <p class="lede">${c.lede}</p>
      <p class="label cat-count">${ordered.length} files &middot; ${c.short}</p>
    </div>
  </header>

  <section class="section cat-answer" aria-labelledby="cat-answer-h">
    <div class="wrap cat-answer-grid">
      <h2 id="cat-answer-h">The short answer</h2>
      <div>
        <p class="lede cat-answer-text">${c.answer}</p>
        <p class="dim">${c.why}</p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="cat-files-h">
    <div class="wrap">
      <h2 id="cat-files-h" class="cat-files-h">Every ${c.name.toLowerCase()} file</h2>
      <ol class="file-index file-cards">
${ordered.map((s, i) => card(s, i === 0)).join('\n')}
      </ol>
    </div>
  </section>

  <section class="section cat-more" aria-labelledby="cat-more-h">
    <div class="wrap">
      <h2 id="cat-more-h">Elsewhere in the archive</h2>
      <ul class="cat-tiles">
${others.map(o => `        <li${c.pairs.includes(o.slug) ? ' class="pair"' : ''}><a href="/intel/${o.slug}/"><span class="label">${(members[o.slug] || []).length} files</span><span class="ct-name">${o.name}</span><span class="ct-short">${o.short}</span></a></li>`).join('\n')}
      </ul>
    </div>
  </section>

  <section class="ask" aria-labelledby="ask-h">
    <div class="wrap ask-grid">
      <div><h2 id="ask-h">Reading is not the same as being ready.</h2></div>
      <div>
        <p>Ten questions tell you which job is yours in the first minute.</p>
        <div class="actions"><a class="btn" href="/#classify">Find your role <span class="arr" aria-hidden="true">&rarr;</span></a> <a class="link" href="/intel/">All intel files</a></div>
      </div>
    </div>
  </section>

</main>

<!-- dx:footer -->
<!-- /dx:footer -->

<script src="/assets/dx/dx.js?v=5" defer></script>
</body>
</html>
`;
  mkdirSync(join(root, 'intel', c.slug), { recursive: true });
  writeFileSync(join(root, 'intel', c.slug, 'index.html'), html);
}

// ---- wire every article into its hub
let wired = 0;
for (const [slug, f] of Object.entries(files)) {
  const p = join(root, 'intel', slug, 'index.html');
  if (!existsSync(p)) continue;
  const c = CAT_BY_SLUG[f.cat];
  let s = readFileSync(p, 'utf8');
  const before = s;
  // crumbs: Home / Intel / Category / File NNN
  s = s.replace(/(<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="\/">Home<\/a><\/li><li><a href="\/intel\/">Intel<\/a><\/li>)(?:<li><a href="\/intel\/[a-z-]+\/">[^<]+<\/a><\/li>)?/, `$1<li><a href="/intel/${c.slug}/">${c.name}</a></li>`);
  // JSON-LD breadcrumb
  s = s.replace(/("@type": "BreadcrumbList",\s*"itemListElement": \[[\s\S]*?"item": "https:\/\/www\.getdisclosure\.app\/intel\/"\s*\},)(\s*\{\s*"@type": "ListItem",\s*"position": 3,\s*"name": "[^"]*",\s*"item": "https:\/\/www\.getdisclosure\.app\/intel\/[a-z-]+\/"\s*\},)?(\s*\{\s*"@type": "ListItem",\s*"position": )\d(,)/,
    (m, a, _old, b, d) => `${a}\n    {\n      "@type": "ListItem",\n      "position": 3,\n      "name": "${c.name}",\n      "item": "${HOST}/intel/${c.slug}/"\n    },${b}4${d}`);
  // meta row: category becomes a link
  s = s.replace(/(<p class="label intel-meta">File \d{3} &middot; )(?:<a href="\/intel\/[a-z-]+\/">)?([^<&]+?)(?:<\/a>)?( &middot;)/, `$1<a href="/intel/${c.slug}/">${c.name}</a>$3`);
  // related: link to the whole category
  s = s.replace(/\s*<!-- dx:catlink -->[\s\S]*?<!-- \/dx:catlink -->/g, '');
  s = s.replace(/(<section class="section intel-related"[\s\S]*?<\/ol>)/, `$1\n    <!-- dx:catlink --><p class="cat-link"><a class="link" href="/intel/${c.slug}/">All ${c.name.toLowerCase()} files <span aria-hidden="true">&rarr;</span></a></p><!-- /dx:catlink -->`);
  if (s !== before) { writeFileSync(p, s); wired++; }
}

// ---- the hub: each group heading links to its category page
hub = hub.replace(/(<section class="intel-group" data-cat="([^"]+)"[\s\S]*?<h2 id="g-[^"]+">)(?:<a href="\/intel\/[a-z-]+\/">)?([^<]+)(?:<\/a>)?(<\/h2>)/g,
  (m, a, dc, name, b) => `${a}<a href="/intel/${DATA_CAT[dc]}/">${name}</a>${b}`);
writeFileSync(hubPath, hub);

console.log(`hubs ${CATEGORIES.length}, files mapped ${Object.keys(files).length}, articles wired ${wired}`);
for (const c of CATEGORIES) console.log(`  /intel/${c.slug}/ ${(members[c.slug] || []).length} files`);
