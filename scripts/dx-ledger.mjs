// Renders assets/data/ledger.json into static HTML inside record/index.html and record/pursue/index.html.
// Marker pairs: <!-- ledger:NAME --> ... <!-- /ledger:NAME -->. Idempotent.
// Usage: node scripts/dx-ledger.mjs   (rebuilds /record/ rows from assets/data/ledger.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = process.argv[2] || join(fileURLToPath(new URL('.', import.meta.url)), '..');
const HOST = 'https://www.getdisclosure.app';
const data = JSON.parse(readFileSync(join(root, 'assets/data/ledger.json'), 'utf8'));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TYPE = { hearing: 'Hearing', law: 'Legislation', report: 'Report', release: 'Release', statement: 'Statement' };
const PLURAL = { hearing: 'Hearings', law: 'Legislation', report: 'Reports', release: 'Releases', statement: 'Statements' };
const CHIP = { 'VERIFIED': 'chip-verified', 'PARTLY': 'chip-partly', 'FALSE AS WORDED': 'chip-false', 'NOT FOUND': 'chip-notfound' };
const domain = u => new URL(u).hostname.replace(/^www\./, '');
const pad = n => String(n).padStart(3, '0');

function parts(d) {
  const [y, m, day] = d.split('-');
  return { y, md: m ? (day ? `${day} ${MON[+m - 1]}` : MON[+m - 1]) : '', long: m ? (day ? `${MONL[+m - 1]} ${+day}, ${y}` : `${MONL[+m - 1]} ${y}`) : y };
}
const src = list => `<p class="lg-src">${list.map(s => `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.name || domain(s.url))}<span class="visually-hidden"> (source, opens in a new tab)</span></a>`).join('')}</p>`;
const chip = v => `<span class="chip ${CHIP[v]}">${esc(v)}</span>`;

// chronological sequence, oldest = 1
const entries = data.entries.slice().sort((a, b) => a.date.localeCompare(b.date) || (a.order || 0) - (b.order || 0));
entries.forEach((e, i) => { e.seq = i + 1; });
const newest = entries.slice().reverse();

function row(e, opts = {}) {
  const p = parts(e.date);
  let note = e.note ? `<p class="lg-note">${e.verdict === 'PARTLY' ? '<b>Partly:</b>' : ''}${esc(e.note)}</p>` : '';
  if (opts.release && e.contents) note = `<p class="lg-note">${esc(e.contents)}</p>` + note;
  const head = opts.release ? `<span class="label ps-rel-n">Release ${e.release}</span>` : `<span class="label lg-type">${TYPE[e.type]}</span>`;
  const text = esc(e.text);
  return `<li class="lg-row" id="${opts.release ? 'r' : 'e'}-${esc(e.id)}" data-type="${e.type}" data-seq="${e.seq}">` +
    `<p class="lg-date"><time datetime="${e.date}"><span class="lg-y">${p.y}</span><span class="lg-md">${p.md}</span></time><span class="lg-no">Entry ${pad(e.seq)}</span></p>` +
    `<div class="lg-body">${head}<p class="lg-text">${text}</p>${note}${src(e.sources)}</div>` +
    `<p class="lg-verdict">${chip(e.verdict)}</p></li>`;
}

function claim(c) {
  return `<li class="lg-claim" id="c-${esc(c.id)}"><div class="lg-claim-q">${chip(c.verdict)}<p>&ldquo;${esc(c.claim)}&rdquo;</p></div>` +
    `<div class="lg-claim-a"><span class="k">What the record shows</span><p>${esc(c.actually)}</p>${src(c.sources)}</div></li>`;
}

const counts = { all: entries.length };
for (const t of Object.keys(TYPE)) counts[t] = entries.filter(e => e.type === t).length;
const verified = entries.filter(e => e.verdict === 'VERIFIED').length;
const partly = entries.filter(e => e.verdict === 'PARTLY').length;
const first = parts(entries[0].date).y;

const blocks = {
  tally: `<ul class="lg-tally" aria-label="Ledger count"><li><b>${entries.length}</b> official events since ${first}</li><li><span class="chip chip-verified chip-flat">Verified</span><b>${verified}</b></li><li><span class="chip chip-partly chip-flat">Partly</span><b>${partly}</b></li><li><b>${data.claims.length}</b> circulating claims checked</li></ul>`,
  filters: `<div class="lg-btns">` + ['all', ...Object.keys(TYPE)].map(t => `<button type="button" data-filter="${t}" aria-pressed="${t === 'all'}">${t === 'all' ? 'All' : PLURAL[t]}<span class="n">${counts[t]}</span></button>`).join('') + `</div>`,
  status: `<p class="lg-status" data-ledger-status role="status" aria-live="polite">Showing all ${entries.length} entries, newest first.</p>`,
  rows: newest.map(e => row(e)).join('\n'),
  claims: data.claims.map(claim).join('\n'),
  count: String(entries.length),
  verified: String(verified),
  partly: String(partly),
  first,
  reviewed: parts(data.lastReviewed).long,
  ld: `<script type="application/ld+json">\n${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Record', item: HOST + '/record/' } ] },
      { '@type': 'WebPage', '@id': HOST + '/record/', url: HOST + '/record/', name: data.pageTitle, description: data.pageDescription,
        dateModified: data.lastReviewed, inLanguage: 'en-US', isPartOf: { '@id': HOST + '/#site' },
        mainEntity: { '@type': 'ItemList', name: 'The Disclosure Ledger', numberOfItems: entries.length, itemListOrder: 'https://schema.org/ItemListOrderDescending',
          itemListElement: newest.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${HOST}/record/#e-${e.id}`, name: `${parts(e.date).long}: ${e.text}` })) } } ]
  }, null, 2)}\n</script>`,
};

const rel = entries.filter(e => e.release).sort((a, b) => a.release - b.release);
const pursue = {
  releases: rel.map(e => row(e, { release: true })).join('\n'),
  relcount: String(rel.length),
  ld: `<script type="application/ld+json">\n${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Record', item: HOST + '/record/' },
        { '@type': 'ListItem', position: 3, name: 'PURSUE', item: HOST + '/record/pursue/' } ] },
      { '@type': 'WebPage', '@id': HOST + '/record/pursue/', url: HOST + '/record/pursue/', name: data.pursue.pageTitle, description: data.pursue.pageDescription,
        dateModified: data.lastReviewed, inLanguage: 'en-US', isPartOf: { '@id': HOST + '/#site' },
        mainEntity: { '@type': 'ItemList', name: 'Department of War UAP file releases, 2026', numberOfItems: rel.length, itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: rel.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${HOST}/record/pursue/#r-${e.id}`, name: `Release ${e.release}, ${parts(e.date).long}` })) } } ]
  }, null, 2)}\n</script>`,
};

function fill(file, map) {
  const p = join(root, file);
  let html = readFileSync(p, 'utf8');
  for (const [k, v] of Object.entries(map)) {
    const re = new RegExp(`<!-- ledger:${k} -->[\\s\\S]*?<!-- /ledger:${k} -->`, 'g');
    if (!re.test(html)) continue;
    html = html.replace(re, `<!-- ledger:${k} -->${v}<!-- /ledger:${k} -->`);
  }
  writeFileSync(p, html);
}
fill('record/index.html', blocks);
fill('record/pursue/index.html', { ...pursue, reviewed: blocks.reviewed, count: blocks.count });
console.log(`entries ${entries.length} (verified ${verified}, partly ${partly}), claims ${data.claims.length}, releases ${rel.length}`, counts);
