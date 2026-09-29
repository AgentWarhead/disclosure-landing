// Evidence pass (docs/SCROLL-SCORE.md): turns file lists into photo cards, and pins one
// paper excerpt into each intel article. Idempotent. Usage: node scripts/dx-evidence.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const intelDir = join(root, 'intel');
const slugs = readdirSync(intelDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(intelDir, d.name, 'index.html')))
  .map(d => d.name);

// slug -> small thumbnail from the article's own plate image
const thumb = {};
for (const slug of slugs) {
  const html = readFileSync(join(intelDir, slug, 'index.html'), 'utf8');
  const m = html.match(/<img class="plate-img"[^>]*?srcset="([^"\s]+)\s+768w/) || html.match(/<img class="plate-img"[^>]*?src="([^"]+)"/);
  if (m) thumb[slug] = m[1];
}

const SKETCH = {
  'grey-alien-encounter-survival-guide': 'grey', 'zeta-reticuli-grey-aliens': 'grey',
  'nordic-alien-encounter-protocol': 'nordic', 'pleiadian-aliens-explained': 'nordic',
  'reptilian-alien-threat-assessment': 'reptilian',
  'mantid-alien-encounter-what-to-do': 'mantid', 'insectoid-aliens-explained': 'mantid',
  'tall-white-alien-charles-hall': 'tall-white',
  'anunnaki-creator-species-theory': 'anunnaki', 'ancient-astronaut-theory-explained': 'anunnaki',
};

function cardify(html, featureFirst) {
  return html.replace(/<ol class="file-index">([\s\S]*?)<\/ol>/g, (whole, inner) => {
    let i = 0;
    const lis = inner.replace(/<li><a href="\/intel\/([^/"]+)\/">(?!<span class="fc-img")/g, (m, slug) => {
      const src = thumb[slug];
      const cls = featureFirst && i++ === 0 ? ' class="feat"' : '';
      const img = src ? `<span class="fc-img"><img src="${src}" alt="" loading="lazy" decoding="async" width="768" height="429"></span>` : '<span class="fc-img fc-none"></span>';
      return `<li${cls}><a href="/intel/${slug}/">${img}`;
    });
    return `<ol class="file-index file-cards">${lis}</ol>`;
  }).replace(/<ol class="file-index file-cards">([\s\S]*?)<\/ol>/g, (w) => w); // stable
}

function stripTags(s) { return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
function firstSentence(t) {
  const m = t.match(/^(.{40,220}?[.!?])(\s|$)/);
  return m ? m[1] : (t.length > 200 ? t.slice(0, 197).replace(/\s+\S*$/, '') + '.' : t);
}

let pins = 0, lists = 0;
// intel articles
for (const slug of slugs) {
  const p = join(intelDir, slug, 'index.html');
  let s = readFileSync(p, 'utf8');
  const before = s;
  s = s.replace(/\s*<!-- dx:pin -->[\s\S]*?<!-- \/dx:pin -->/g, '');
  if (!s.includes('fc-img')) { s = cardify(s, false); if (s !== before) lists++; }

  const art = s.indexOf('<article class="prose');
  if (art > -1) {
    const h2s = [...s.slice(art).matchAll(/\n\s*<h2[\s>]/g)].map(m => art + m.index);
    if (h2s.length >= 3) {
      // quote a line from the opening section, pin it two sections later so it never sits beside its source
      const seg = s.slice(art, h2s[1]);
      const sentences = [...seg.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => stripTags(m[1]))
        .flatMap(t => t.match(/[^.!?]{30,200}[.!?](?=\s|$)/g) || [])
        .map(t => t.trim()).filter(t => !/[:;]$/.test(t) && !/^(This|That|It|These|Those)\b/.test(t) && t.split(' ').length >= 8);
      const pick = sentences.find(t => /\b(you|your|do not|never|always|first|most|every)\b/i.test(t)) || sentences[0];
      if (pick) {
        const line = pick.replace(/"/g, '&quot;');
        const no = (s.match(/File (\d{3})/) || [])[1] || '000';
        const sk = SKETCH[slug];
        const img = sk ? `<img src="/assets/evidence/sketch-${sk}.webp" alt="A pencil witness sketch of the reported ${sk.replace('-', ' ')} figure, drawn on aged paper." loading="lazy" decoding="async" width="720" height="964">` : '';
        const pin = `\n<!-- dx:pin --><aside class="pin" aria-label="Filed excerpt">${img}<p class="exhibit-no">Filed excerpt &middot; File ${no}</p><p class="pin-line">${line}</p><span class="stamp">Released in part</span></aside><!-- /dx:pin -->`;
        s = s.slice(0, h2s[2]) + pin + s.slice(h2s[2]);
        pins++;
      }
    }
  }
  if (s !== before) writeFileSync(p, s);
}
// the hub: cards, first file in each category featured
{
  const p = join(intelDir, 'index.html');
  let s = readFileSync(p, 'utf8');
  if (!s.includes('fc-img')) { s = cardify(s, true); writeFileSync(p, s); lists++; }
}
// home intel teaser
{
  const p = join(root, 'index.html');
  let s = readFileSync(p, 'utf8');
  if (!s.includes('fc-img')) { s = cardify(s, true); writeFileSync(p, s); lists++; }
}
console.log(`thumbnails ${Object.keys(thumb).length}/${slugs.length}, lists carded ${lists}, pins ${pins}`);
