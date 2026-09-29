// The exhibit: one paper interlude per page, about 55% of the way down (docs/SCROLL-SCORE.md).
// Idempotent: replaces anything between <!-- dx:exhibit --> markers.
// Usage: node scripts/dx-exhibits.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const EX = {
  'first-contact/index.html': {
    no: 'Exhibit 07 &middot; Witness sketch', img: '/assets/evidence/sketch-nordic.webp', alt: 'A pencil witness sketch of a tall, pale humanoid figure with long hair, drawn on aged paper.',
    cap: 'Witness sketch, reported contact', line: 'The first one there will be holding a phone, not a rifle.',
    body: 'Most reports start the same way: an ordinary person, a strange light, and a few seconds to decide what kind of witness to be.',
  },
  'readiness/index.html': {
    no: 'Exhibit 12 &middot; Field photograph', img: '/asset-stone-cold-v3-640.webp', alt: 'A man staring ahead under hard green light while a monitor beside him shows his heart rate.',
    cap: 'Composure trial, still frame', line: 'Panic is not a flaw. It is an untrained reflex.',
    body: 'The drill exists so the first time you feel the ten-second freeze is not the time it matters.',
  },
  'quiz/index.html': {
    no: 'Exhibit 03 &middot; Witness sketch', img: '/assets/evidence/sketch-grey.webp', alt: 'A pencil witness sketch of a grey figure with a large head and black eyes, drawn on aged paper.',
    cap: 'Witness sketch, first report', line: 'Nobody chooses their role. They find out.',
    body: 'The ten questions do not test what you know. They record what you would do, which is the only thing that matters when the lights go out.',
  },
  'faq/index.html': {
    no: 'Exhibit 21 &middot; Witness sketch', img: '/assets/evidence/sketch-tall-white.webp', alt: 'A pencil witness sketch of a very tall, thin pale figure, drawn on aged paper.',
    cap: 'Witness sketch, desert report', line: 'Every question here was first asked at two in the morning.',
    body: 'Most of them were asked more than once, by people who did not want to sound strange asking out loud.',
  },
  'about/index.html': {
    no: 'Exhibit 01 &middot; Witness sketch', img: '/assets/evidence/sketch-reptilian.webp', alt: 'A pencil witness sketch of a scaled reptilian humanoid, drawn on aged paper.',
    cap: 'Witness sketch, unverified', line: 'A fire drill for something that may never happen.',
    body: 'Nobody expects the fire either. That is the whole point of a drill.',
  },
  'archetypes/index.html': {
    no: 'Exhibit 04 &middot; Witness sketch', img: '/assets/evidence/sketch-mantid.webp', alt: 'A pencil witness sketch of a tall insect-like mantis figure, drawn on aged paper.',
    cap: 'Witness sketch, group sighting', line: 'Four jobs. One minute. No time to hand them out.',
    body: 'Groups that freeze together scatter together. Groups where each person knows one job hold still long enough to think.',
  },
  'archetype/sentinel/index.html': {
    no: 'Exhibit S1 &middot; Field photograph', img: '/asset-stone-cold-v3-640.webp', alt: 'A man holding still under hard green light while a monitor beside him tracks his heart rate.',
    cap: 'Composure trial, still frame', line: 'The first one between them and everyone else.',
    body: 'Sentinels never wait to be asked. The training is learning when not to step forward.',
  },
  'archetype/diplomat/index.html': {
    no: 'Exhibit D1 &middot; Field photograph', img: '/asset-signal-language-v7-640.webp', alt: 'A figure in a night field holding open hands toward a green light, seen through a night-vision screen.',
    cap: 'Open-hands trial, night lens', line: 'Calm is contagious. So is panic. Pick one.',
    body: 'A room copies the steadiest person in it. The Diplomat decides to be that person on purpose.',
  },
  'archetype/scholar/index.html': {
    no: 'Exhibit R1 &middot; Witness sketch', img: '/assets/evidence/sketch-tall-white.webp', alt: 'A pencil witness sketch of a very tall, thin pale figure, drawn on aged paper.',
    cap: 'Sketch by the one who stayed to look', line: 'The account that survives is the one written down that night.',
    body: 'Memory rewrites itself every time the story is told. A time, a direction and a steady recording do not.',
  },
  'archetype/survivor/index.html': {
    no: 'Exhibit V1 &middot; Witness sketch', img: '/assets/evidence/sketch-reptilian.webp', alt: 'A pencil witness sketch of a scaled reptilian humanoid, drawn on aged paper.',
    cap: 'Sketched from a safe distance', line: 'Leaving is not losing. Leaving late is.',
    body: 'Survivors read the exit before the room. The training is timing: knowing when going is the calm choice.',
  },
  'archetype/first-contact/index.html': {
    no: 'Exhibit 00 &middot; Sealed sketch', img: '/assets/evidence/sketch-anunnaki.webp', alt: 'A pencil sketch of a regal robed figure, drawn on aged paper.',
    cap: 'Origin file, sealed', line: 'This page was not meant to exist.',
    body: 'If the file named you, you already know more than it can say.',
  },
};

function block(e) {
  return `<!-- dx:exhibit -->
  <section class="exhibit" aria-labelledby="exhibit-h">
    <div class="wrap exhibit-grid">
      <figure class="exhibit-doc">
        <img src="${e.img}" alt="${e.alt}" loading="lazy" decoding="async">
        <figcaption>${e.cap}</figcaption>
      </figure>
      <div class="exhibit-text">
        <p class="exhibit-no">${e.no}</p>
        <h2 class="exhibit-line" id="exhibit-h">${e.line}</h2>
        <p>${e.body}</p>
        <span class="stamp">Released in part</span>
      </div>
    </div>
  </section>
  <!-- /dx:exhibit -->`;
}

let n = 0;
for (const [file, e] of Object.entries(EX)) {
  const p = join(root, file);
  let s = readFileSync(p, 'utf8');
  s = s.replace(/\s*<!-- dx:exhibit -->[\s\S]*?<!-- \/dx:exhibit -->/g, '');
  const main = s.indexOf('<main');
  const mainEnd = s.lastIndexOf('</main>');
  // top-level blocks inside main: <section ...> or <div class="wrap ..."> or <article ...> at two-space indent
  const re = /\n  <(section|div|article)\b[^>]*>/g;
  re.lastIndex = main;
  const starts = [];
  let m;
  while ((m = re.exec(s)) && m.index < mainEnd) {
    const tag = s.slice(m.index, m.index + 200);
    if (/class="(ask|page-head)/.test(tag)) continue;
    starts.push(m.index);
  }
  let at;
  if (starts.length < 2) {
    at = s.indexOf('\n  <section class="ask"');
    if (at < 0) { console.log('skip (no anchor):', file); continue; }
  } else at = starts[Math.min(starts.length - 1, Math.ceil(starts.length * 0.55))];
  s = s.slice(0, at) + '\n  ' + block(e) + s.slice(at);
  writeFileSync(p, s);
  n++;
}
console.log(`exhibits placed on ${n} pages`);
