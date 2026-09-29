// Migrates the intel archive (hub + every article) onto the dx design system.
// Reads the frozen originals in docs/legacy/intel/, writes intel/index.html and intel/{slug}/index.html.
// Idempotent: always rebuilds from the legacy copies. No dependencies.
// Usage: node scripts/dx-migrate-intel.mjs   (then run node scripts/dx-chrome.mjs)
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const LEG = join(ROOT, 'docs/legacy/intel');
const OUT = join(ROOT, 'intel');
const HOST = 'https://www.getdisclosure.app';
const MODIFIED = '2026-09-28';

const stats = {
  emDash: 0, enDash: 0, spacedHyphen: 0, emoji: 0, arrows: 0, slashPrefixes: 0,
  inlineStyles: 0, ctaBlocksRemoved: 0, fieldNotesAdded: 0, hudBlocksRemoved: 0,
  internalLanguage: 0, factFixes: 0, headingsRewritten: 0, relatedSectionsReplaced: 0,
  faqSectionsShown: 0, howtoKept: 0, patches: 0, patchMisses: [],
};

// ---------------------------------------------------------------------------
// 1. The catalog: hub order, categories, one-line descriptions.
//    File numbers follow this order (001 to 064).
// ---------------------------------------------------------------------------
const GROUPS = [
  { id: 'protocol', name: 'Protocol', intro: 'What to do, in order, while it is happening or just after.', files: [
    ['what-to-do-if-you-see-a-ufo', 'What to do if you see a UFO', 'Most witnesses freeze. A few document. The first 90 seconds, step by step.'],
    ['how-to-report-a-ufo-sighting', 'How to report a UFO sighting', 'Time, place, witnesses, original files, and nothing you cannot back up.'],
    ['ufo-evidence-checklist', 'UFO evidence checklist', 'Photos, video, metadata and witnesses: the details investigators can actually use.'],
    ['how-to-film-a-ufo-at-night', 'How to film a UFO at night', 'Steady framing, reference points and exposure when the sky refuses to behave.'],
    ['what-to-do-if-a-ufo-follows-your-car', 'If a UFO follows your car', 'Do not chase, do not panic-drive, do not stop somewhere dangerous. Safety before footage.'],
    ['what-to-do-if-a-ufo-lands-nearby', 'What to do if a UFO lands nearby', 'Distance, documentation and crowd control. Do not become the second incident.'],
    ['ufo-sighting-family-protocol', 'UFO sighting family protocol', 'Keep kids, pets and partners calm while one person records and one person watches.'],
    ['ufo-contact-emergency-kit', 'UFO contact emergency kit', 'Power loss, documentation, first aid, pets and family: the practical kit.'],
    ['how-to-talk-about-a-ufo-sighting', 'How to talk about a UFO sighting', 'Lead with facts, protect your credibility, and say only what you actually saw.'],
    ['how-to-prepare-for-alien-contact', 'How to prepare for alien contact', 'Calm routines, clean information habits, and knowing your role before you need it.'],
    ['alien-survival-guide-complete', 'Alien survival guide', 'Reported encounter patterns and the calm civilian rules that come before anything else.'],
  ] },
  { id: 'field-guide', name: 'Field guide', intro: 'How to tell a satellite, a drone or a balloon from something that deserves a report.', files: [
    ['starlink-vs-ufo', 'Starlink or UFO: how to tell', 'Satellite trains fool thousands of people a night. Here is the test.'],
    ['drone-vs-ufo', 'Drone or UFO', 'Navigation lights, sound, hover and battery limits: the checks that keep a sighting credible.'],
    ['airplane-satellite-balloon-ufo-misidentification', 'Airplane, satellite, balloon or UFO?', 'The civilian filter for common sky mistakes, before a report becomes folklore.'],
    ['what-are-orbs-in-the-sky', 'What are orbs in the sky?', 'Drone, satellite, balloon, aircraft or unknown. Rule out the ordinary first.'],
    ['black-triangle-ufo-explained', 'Black triangle UFOs explained', 'One of the most reported shapes: aircraft, formations, stealth talk and evidence.'],
    ['close-encounter-types-explained', 'Close encounter types explained', 'CE1 to CE5 in plain language, and what each one asks of a witness.'],
    ['ufo-vs-uap-difference', 'UFO vs UAP: the difference', 'What the terms mean, why official language changed, and why neither means alien.'],
  ] },
  { id: 'psychology', name: 'Psychology', intro: 'Fear, memory, silence and panic: what the mind does with an impossible minute.', files: [
    ['four-types-of-people-alien-contact', 'The four types of people during alien contact', 'Sentinel, Diplomat, Scholar and Survivor, and a fifth that is not issued.'],
    ['psychology-of-ufo-encounters', 'The psychology of UFO encounters', 'Fight, flight, freeze or engage. Your response is not random, and it can be rehearsed.'],
    ['why-people-freeze-during-ufo-sightings', 'Why people freeze during UFO sightings', 'Your nervous system is not broken. It is untrained.'],
    ['missing-time-after-ufo-sighting', 'Missing time after a UFO sighting', 'Get steady, write down the gap, keep the evidence, and ask for support if it shook you.'],
    ['how-to-evaluate-ufo-memory', 'How to evaluate a UFO memory', 'Separate what you saw from what you added later.'],
    ['sleep-paralysis-vs-alien-abduction', 'Sleep paralysis or abduction', 'Why it feels real, and when to talk to a professional.'],
    ['alien-dreams-contact-meaning', 'Alien dreams and what they mean', 'How to read a contact dream without turning symbols into evidence.'],
    ['ontological-shock-explained', 'Ontological shock explained', 'When the event is over but reality still feels unstable.'],
    ['disclosure-anxiety-explained', 'Disclosure anxiety explained', 'How to stay informed without letting the feed turn curiosity into dread.'],
    ['experiencer-support-after-ufo-encounter', 'Supporting someone after an encounter', 'Listen, keep the record, and bring in professional help when it is needed.'],
    ['why-ufo-witnesses-stay-silent', 'Why UFO witnesses stay silent', 'Stigma costs good reports. Safer ways to share without overclaiming.'],
    ['mass-panic-first-contact', 'Mass panic and first contact', 'Panic is not inevitable. Roles, spacing and verified information keep people useful.'],
    ['alien-implants-explained', 'Alien implant claims explained', 'Medical care first, evidence second, and never self-removal.'],
  ] },
  { id: 'species', name: 'Species', intro: 'The beings people keep describing. Reports and lore, handled as reports and lore.', files: [
    ['types-of-alien-species-ranked-threat', 'Reported species, ranked by threat', 'The field guide behind the six specimen files.'],
    ['grey-alien-encounter-survival-guide', 'Grey encounter guide', 'Reported clinical contact, and the rules for staying calm, still and clear afterward.'],
    ['reptilian-alien-threat-assessment', 'Reptilian threat assessment', 'In encounter lore, dominance cues matter. The safe response starts with not challenging.'],
    ['nordic-alien-encounter-protocol', 'Nordic encounter protocol', 'Human-looking contact reports feel reassuring. Protocol still matters more than appearance.'],
    ['mantid-alien-encounter-what-to-do', 'Mantid encounter guide', 'Reported clinical contact, fear, and how to protect your memory under pressure.'],
    ['tall-white-alien-charles-hall', 'The Tall White account', 'Charles Hall\u2019s story as a behavior lesson: stay composed before you understand the rules.'],
    ['anunnaki-creator-species-theory', 'The Anunnaki theory', 'Ancient astronaut claims, origin myths, and thinking clearly when a claim feels too big.'],
    ['zeta-reticuli-grey-aliens', 'Zeta Reticuli Greys', 'Where the Grey origin story comes from, and what the abduction accounts share.'],
    ['alien-hybrid-theory-explained', 'Alien hybrid theory', 'Contested abduction lore and genetic claims. Write it down before belief hardens.'],
    ['pleiadian-aliens-explained', 'Pleiadian aliens explained', 'Benevolent contact claims, spiritual messages, and the risk of relaxing too early.'],
    ['arcturian-aliens-explained', 'Arcturian aliens explained', 'Healing-themed contact lore, and why a pleasant story is not a protocol.'],
    ['sirians-alien-lore-explained', 'Sirian alien lore', 'Star-being stories, water symbolism, ancient claims, and keeping lore in its lane.'],
    ['insectoid-aliens-explained', 'Insectoid aliens explained', 'Hive imagery, clinical fear, and the difference between a pattern and proof.'],
  ] },
  { id: 'record', name: 'Public record', intro: 'What governments, archives and scientists have actually said, with the dates.', files: [
    ['uap-disclosure-act-2026-timeline', 'The UAP Disclosure Act timeline, 2023 to 2026', 'Hearings, the records law, the Department of War releases, and what is still not law.'],
    ['aaro-explained', 'What is AARO?', 'The Pentagon\u2019s UAP office: what it reports, what it cannot prove, and why it matters.'],
    ['uap-records-collection-explained', 'The UAP Records Collection', 'What the National Archives holds, and how to read records without inventing the gaps.'],
    ['nasa-uap-report-explained', 'The NASA UAP report explained', 'What NASA\u2019s independent study did and did not say.'],
    ['government-ufo-programs-history', 'Government UFO programs', 'Blue Book to AARO: seven decades of study, denial and partial release.'],
    ['project-blue-book-explained', 'Project Blue Book explained', 'The Air Force case archive, its limits, and what official uncertainty teaches.'],
    ['roswell-ufo-incident-explained', 'The Roswell incident explained', 'The claim, the official record, and the folklore that grew between them.'],
    ['nimitz-tic-tac-ufo-explained', 'The Nimitz Tic Tac case', 'The Navy encounter that changed the public conversation about UAP.'],
    ['phoenix-lights-explained', 'The Phoenix Lights explained', 'A mass sighting, a military explanation, and the limits of eyewitness memory.'],
    ['rendlesham-forest-ufo-incident', 'The Rendlesham Forest incident', 'Witness claims, military context, and why memory discipline matters.'],
    ['seti-post-detection-protocol', 'SETI post-detection protocol', 'What scientists do after a possible signal, and why verification comes first.'],
    ['rio-scale-explained', 'The Rio Scale explained', 'How scientists would score a possible contact signal.'],
  ] },
  { id: 'theory', name: 'Theory', intro: 'The big models of why the sky is quiet, and what each would mean for a civilian.', files: [
    ['are-we-alone-in-the-universe', 'Are we alone in the universe?', 'The numbers, the silence, and what the evidence can and cannot say.'],
    ['what-would-first-contact-look-like', 'What first contact might look like', 'Not the movie version: detection, response, and the civilian shockwave.'],
    ['fermi-paradox-explained', 'The Fermi Paradox explained', 'The Great Filter, the zoo, the Dark Forest, and the answer nobody likes.'],
    ['zoo-hypothesis-explained', 'The Zoo Hypothesis', 'The idea that Earth is watched but not contacted.'],
    ['dark-forest-theory-first-contact', 'The Dark Forest theory', 'The model where silence is strategy and broadcasting may not be safe.'],
    ['interdimensional-hypothesis-explained', 'The interdimensional hypothesis', 'A contact model where the strange part is not distance but the rules of the room.'],
    ['ai-probe-alien-theory', 'The AI probe theory', 'If contact arrives as machines first, the civilian protocol changes.'],
    ['ancient-astronaut-theory-explained', 'Ancient astronaut theory', 'Reading ancient-contact claims without confusing myth, archaeology and pattern hunger.'],
  ] },
];

const FILES = [];
for (const g of GROUPS) for (const [slug, title, desc] of g.files) FILES.push({ slug, hubTitle: title, hubDesc: desc, cat: g.name, catId: g.id });
FILES.forEach((f, i) => { f.no = String(i + 1).padStart(3, '0'); });
const BY_SLUG = new Map(FILES.map(f => [f.slug, f]));

const onDisk = readdirSync(LEG, { withFileTypes: true }).filter(d => d.isDirectory() && existsSync(join(LEG, d.name, 'index.html'))).map(d => d.name).sort();
const missingFromCatalog = onDisk.filter(s => !BY_SLUG.has(s));
const missingFromDisk = FILES.filter(f => !onDisk.includes(f.slug)).map(f => f.slug);
if (missingFromCatalog.length || missingFromDisk.length || new Set(FILES.map(f => f.slug)).size !== FILES.length) {
  console.error('catalog mismatch', { missingFromCatalog, missingFromDisk });
  process.exit(1);
}
const COUNT = FILES.length;

// ---------------------------------------------------------------------------
// 2. A small tolerant HTML parser and serializer.
// ---------------------------------------------------------------------------
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);

function parseAttrs(s) {
  const a = {};
  for (const m of s.matchAll(/([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) a[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return a;
}
function parse(html) {
  const root = { type: 'el', tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--([\s\S]*?)-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)|(<)/g;
  let m;
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) { top.children.push({ type: 'comment', text: m[1] }); continue; }
    if (m[6] !== undefined || m[7] !== undefined) { top.children.push({ type: 'text', text: m[6] ?? m[7] }); continue; }
    const tag = m[3].toLowerCase();
    if (m[2]) {
      const i = stack.map(n => n.tag).lastIndexOf(tag);
      if (i > 0) stack.length = i;
      continue;
    }
    const el = { type: 'el', tag, attrs: parseAttrs(m[4] || ''), children: [] };
    top.children.push(el);
    if (RAW.has(tag)) {
      const end = html.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
      const stop = end < 0 ? html.length : end;
      el.children.push({ type: 'text', text: html.slice(re.lastIndex, stop) });
      re.lastIndex = end < 0 ? html.length : html.indexOf('>', end) + 1;
      continue;
    }
    if (!VOID.has(tag) && !m[5]) stack.push(el);
  }
  return root;
}
const cls = n => (n.type === 'el' ? (n.attrs.class || '').split(/\s+/).filter(Boolean) : []);
const hasCls = (n, ...c) => cls(n).some(x => c.includes(x));
const els = n => n.children.filter(c => c.type === 'el');
function textOf(n) {
  if (n.type === 'text') return n.text;
  if (n.type !== 'el' || RAW.has(n.tag)) return '';
  return n.children.map(textOf).join('');
}
function* walk(n) { yield n; if (n.type === 'el') for (const c of n.children) yield* walk(c); }
function find(n, pred) { for (const x of walk(n)) if (x.type === 'el' && pred(x)) return x; return null; }
function findAll(n, pred) { const out = []; for (const x of walk(n)) if (x.type === 'el' && pred(x)) out.push(x); return out; }

// ---------------------------------------------------------------------------
// 3. Case map: learn proper nouns and acronyms from the article prose so
//    ALL-CAPS labels and Title Case headlines can become sentence case.
// ---------------------------------------------------------------------------
const CASE = new Map();
function buildCaseMap(trees) {
  const counts = new Map();
  for (const t of trees) {
    for (const p of findAll(t, n => ['p', 'li'].includes(n.tag))) {
      const text = textOf(p).replace(/\s+/g, ' ');
      const toks = [...text.matchAll(/[A-Za-z][A-Za-z'\u2019]*/g)];
      toks.forEach((m, i) => {
        const w = m[0];
        const before = text.slice(0, m.index).replace(/["'\u201c\u2018(\s]+$/, '');
        if (!before || /[.!?:]$/.test(before)) return;
        const caps = s => s.length > 1 && s === s.toUpperCase();
        if (caps(w) && ((toks[i - 1] && caps(toks[i - 1][0])) || (toks[i + 1] && caps(toks[i + 1][0])))) return;
        const lw = w.toLowerCase();
        if (!counts.has(lw)) counts.set(lw, new Map());
        const c = counts.get(lw);
        c.set(w, (c.get(w) || 0) + 1);
      });
    }
  }
  for (const [lw, forms] of counts) {
    const best = [...forms.entries()].sort((a, b) => b[1] - a[1])[0];
    if (best[0] !== lw && (forms.get(lw) || 0) <= best[1] * 0.1) CASE.set(lw, best[0]);
  }
  for (const w of ['UFO', 'UAP', 'NHI', 'AARO', 'NASA', 'SETI', 'FAA', 'ODNI', 'FBI', 'CIA', 'NDAA', 'AI', 'CE', 'I', 'US', 'U.S.', 'UAPTF', 'AATIP', 'EBE']) CASE.set(w.toLowerCase(), w);
  for (const w of ['First', 'Contact', 'Grey', 'Greys', 'Nordic', 'Mantid', 'Reptilian', 'Anunnaki', 'Pleiadian', 'Pleiadians', 'Arcturian', 'Arcturians', 'Sirian', 'Sirians', 'Tall', 'White', 'Sentinel', 'Diplomat', 'Scholar', 'Survivor', 'Sentinels', 'Diplomats', 'Scholars', 'Survivors']) {
    // these are proper only inside names; do not force them globally
    if (CASE.get(w.toLowerCase()) === w && ['First', 'Contact', 'Tall', 'White'].includes(w)) CASE.delete(w.toLowerCase());
  }
  for (const w of ['us', 'it', 'a', 'an', 'the', 'is', 'of', 'to', 'in', 'on', 'and', 'or', 'for', 'at', 'as', 'by', 'what', 'why', 'how', 'when', 'where', 'who', 'do', 'does', 'if', 'not', 'class', 'sign', 'card', 'critical', 'high', 'conditional']) CASE.delete(w);
}
const isCaps = s => { const L = s.replace(/[^A-Za-z]/g, ''); return L.length >= 2 && L === L.toUpperCase(); };
function wordCase(w, keepCaps) {
  const poss = w.match(/^(.+?)(['\u2019]s)$/i);
  if (poss) return wordCase(poss[1], keepCaps) + poss[2].toLowerCase();
  const lw = w.toLowerCase();
  if (/^(ufo|uap|nhi)s$/.test(lw)) return lw.slice(0, -1).toUpperCase() + 's';
  if (keepCaps && w.length > 1 && w === w.toUpperCase()) return w;
  return CASE.get(lw) || lw;
}
// names that span words, fixed after casing
const PHRASES = [
  [/\bs\.t\.a\.n\.d\./gi, 'S.T.A.N.D.'],
  [/S\.T\.A\.N\.D\. ([A-Z])/g, (m, c) => `S.T.A.N.D. ${c.toLowerCase()}`],
  [/\bvs\. ([A-Z])/g, (m, c) => `vs. ${c.toLowerCase()}`],
  [/\buap records collection\b/gi, 'UAP Records Collection'],
  [/\brecord group\b/gi, 'Record Group'],
  [/\bdark forest\b/gi, 'Dark Forest'],
  [/\bzoo hypothesis\b/gi, 'Zoo Hypothesis'],
  [/\bfermi paradox\b/gi, 'Fermi Paradox'],
  [/\bgreat filter\b/gi, 'Great Filter'],
  [/\bphoenix lights\b/gi, 'Phoenix Lights'],
  [/\brio scale\b/gi, 'Rio Scale'],
  [/\btall whites?\b/gi, m => m.replace(/tall/i, 'Tall').replace(/white/i, 'White')],
  [/\brendlesham forest\b/gi, 'Rendlesham Forest'],
  [/\bfirst contact card\b/gi, 'First Contact Card'],
  [/\bblue book\b/gi, 'Blue Book'],
  [/\bbetty and barney hill\b/gi, 'Betty and Barney Hill'],
  [/(\s)a$/, '$1A'],
];
const phrases = s => PHRASES.reduce((acc, [re, rep]) => acc.replace(re, rep), s);
function capFirst(s) {
  return s.replace(/(^|[.?!]\s+|^["\u201c(])([a-z])/g, (m, a, b) => a + b.toUpperCase());
}
function sentenceCase(s) {
  if (!isCaps(s)) return s;
  return phrases(capFirst(s.replace(/[A-Za-z][A-Za-z'\u2019]*/g, w => wordCase(w, false))));
}
function titleToSentence(s) {
  const lowerCount = (s.match(/\b[a-z]{3,}/g) || []).length;
  const wordCount = (s.match(/\b[A-Za-z]{3,}/g) || []).length;
  if (lowerCount > wordCount / 2) return s; // already sentence-ish
  return phrases(capFirst(s.replace(/[A-Za-z][A-Za-z'\u2019]*/g, w => wordCase(w, true))));
}

// ---------------------------------------------------------------------------
// 4. Text hygiene.
// ---------------------------------------------------------------------------
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F2FF}]\uFE0F?/gu;
function cleanText(t) {
  let s = t;
  s = s.replace(/\s*\u2014\s*/g, () => { stats.emDash++; return ', '; });
  s = s.replace(/\s+\u2013\s+/g, () => { stats.enDash++; return ', '; });
  s = s.replace(/(\S) - (\S)/g, (m, a, b) => { stats.spacedHyphen++; return `${a}, ${b}`; });
  s = s.replace(EMOJI, () => { stats.emoji++; return ''; });
  s = s.replace(/\s*[\u2192\u2190\u2197\u21d2]/g, () => { stats.arrows++; return ''; });
  s = s.replace(/(?<![:\w])\/\/+\s*/g, (m, off) => { stats.slashPrefixes++; return off === 0 ? '' : ': '; });
  s = s.replace(/(:\s*){2,}/g, ': ').replace(/\s+:/g, ':');
  s = s.replace(/[\u2588]+/g, '');
  s = s.replace(/ \| /g, ', ');
  return s;
}
function cleanLabel(t) {
  let s = cleanText(t.replace(/\s+/g, ' ').trim());
  s = s.replace(/^[\[\s:|]+|[\]\s:|]+$/g, '').replace(/\s*\|\s*/g, ': ').replace(/^field card:\s*/i, '');
  s = sentenceCase(s).replace(/:\s*$/, '').trim();
  return s;
}
const NOISE_LABEL = /^(screenshot field card|disclosure field artifact|field artifact)$/i;

function slugify(s) {
  return s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section';
}
const esc = s => s.replace(/&(?![a-z]+;|#\d+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, '\u2019').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&rsquo;/g, '\u2019').replace(/&lsquo;/g, '\u2018').replace(/&ldquo;/g, '\u201c').replace(/&rdquo;/g, '\u201d').replace(/&nbsp;/g, ' ');

function rewriteHeading(t) {
  let s = t;
  const rules = [
    [/^Why (?:do )?people search (?:for )?(.+?)\??$/i, (m, x) => `Why do people ask about ${x}?`],
    [/^(?:First-contact|First contact) readiness value$/i, () => 'What this means for first contact readiness'],
    [/^How (?:this|does this) connects? to first contact readiness\??$/i, () => 'How does this connect to first contact readiness?'],
    [/^Why this bridges to (.+)$/i, (m, x) => `Why this matters for ${x}`],
  ];
  for (const [re, fn] of rules) if (re.test(s)) { s = s.replace(re, fn); stats.headingsRewritten++; break; }
  return s;
}

// ---------------------------------------------------------------------------
// 5. Body conversion: legacy components to plain prose.
// ---------------------------------------------------------------------------
const BLOCK = new Set(['p', 'div', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'blockquote', 'section', 'aside', 'header', 'footer', 'figure', 'pre', 'hr', 'dl', 'nav', 'main', 'article']);
const hasBlock = n => n.children.some(c => c.type === 'el' && (BLOCK.has(c.tag) || hasBlock(c)));

// App pitch and locked-card blocks: removed, a field note may take the first mid-article slot.
const CTA_CLS = ['article-cta', 'locked-box', 'locked-notice', 'contact-card', 'readiness-box'];
// Decorative HUD blocks: removed outright.
const HUD_CLS = ['six-percent-box', 'redacted-block', 'dossier-header', 'classification-header', 'critical-banner', 'tl-dot', 'sc-locked', 'species-meta', 'card-redacted'];
const BOX_CLS = ['classified-box', 'warning-box', 'protocol-box', 'source-panel', 'field-card', 'article-artifact', 'specimen-box', 'ten-second-box', 'ninety-second-box', 'universal-rules', 'species-card', 'archetype-card', 'evidence-item', 'do-box', 'dont-box', 'stat-block', 'timeline'];
const LABEL_CLS = ['box-label', 'field-label', 'artifact-label', 'wb-label', 'source-label', 'sb-label', 'tsb-label', 'nsb-label', 'ur-label', 'archetype-label', 'evidence-source', 'sc-name', 'lb-label', 'rb-label', 'cb-label', 'spb-label', 'ch-kicker', 'trait-label'];
const TEXT_CLS = ['wb-text', 'sb-text', 'tsb-text', 'nsb-text', 'sc-profile', 'evidence-text', 'sc-threat', 'rb-text', 'ur-text', 'step-content'];
const ITEM_CLS = ['artifact-step', 'protocol-step', 'prep-step', 'ur-rule', 'stat-item', 'tl-item'];
const UNWRAP_CLS = ['article-body', 'protocol-grid', 'do-dont-grid', 'archetype-body', 'archetype-traits', 'sc-header', 'artifact-grid', 'step-grid', 'card-fields'];
const CTA_HREF = /^\/(quiz\/?|#quiz|#access|#classify)$/;

function normHref(h) {
  if (!h) return h;
  h = h.trim();
  if (/^https?:\/\/(www\.)?getdisclosure\.app/i.test(h)) h = h.replace(/^https?:\/\/(www\.)?getdisclosure\.app/i, '') || '/';
  if (h === '/#quiz' || h === '/#access' || h === '#quiz') return '/#classify';
  if (/^\/[^#?]*[^/#?]$/.test(h) && !/\.[a-z0-9]{2,4}$/i.test(h)) h += '/';
  h = h.replace(/^\/([^#?]*[^/])(#.*)$/, '/$1/$2');
  return h;
}
function collectLinks(n, ctx) {
  for (const a of findAll(n, x => x.tag === 'a')) {
    const h = normHref(a.attrs.href || '');
    const m = h && h.match(/^\/intel\/([a-z0-9-]+)\/$/);
    if (m && m[1] !== ctx.slug && BY_SLUG.has(m[1]) && !ctx.related.includes(m[1])) ctx.related.push(m[1]);
  }
}
function isInlineCta(n) {
  if (n.tag !== 'div' || !n.attrs.style) return false;
  return findAll(n, x => x.tag === 'a').some(a => CTA_HREF.test(normHref(a.attrs.href || '').replace(/\/$/, '/'))) ;
}
function isLinkDump(n) {
  if (!['p', 'ul', 'ol'].includes(n.tag)) return false;
  if (hasCls(n, 'related', 'related-list')) return true;
  const t = plain(textOf(n));
  const linkText = findAll(n, x => x.tag === 'a').map(a => plain(textOf(a))).join(' ');
  return /^related files:/i.test(t) || (linkText.length > 0 && linkText.length / Math.max(1, t.length) > 0.35);
}

function convInline(nodes, ctx) {
  let out = '';
  for (const n of nodes) {
    if (n.type === 'text') { out += cleanText(n.text); continue; }
    if (n.type !== 'el') continue;
    if (n.attrs.style) stats.inlineStyles++;
    if (RAW.has(n.tag) || n.tag === 'svg' || n.tag === 'img' || n.tag === 'button') continue;
    if (hasCls(n, 'r', 'card-redacted', 'tl-dot')) continue;
    const inner = convInline(n.children, ctx);
    switch (n.tag) {
      case 'a': {
        const href = normHref(n.attrs.href || '');
        if (!href) { out += inner; break; }
        const ext = /^https?:/.test(href);
        out += `<a href="${esc(href)}"${ext ? ' rel="noopener"' : ''}>${inner.trim()}</a>`;
        break;
      }
      case 'strong': case 'b': out += inner.trim() ? `<strong>${inner}</strong>` : inner; break;
      case 'em': case 'i': out += inner.trim() ? `<em>${inner}</em>` : inner; break;
      case 'code': out += `<code>${inner}</code>`; break;
      case 'br': out += '<br>'; break;
      case 'time': out += `<time${n.attrs.datetime ? ` datetime="${esc(n.attrs.datetime)}"` : ''}>${inner}</time>`; break;
      default: out += BLOCK.has(n.tag) ? ` ${inner} ` : inner;
    }
  }
  return out;
}
const tidy = s => s.replace(/\s+/g, ' ').replace(/\s+([,.;:?!])/g, '$1').trim();

// item rows (steps, rules, stats, timeline): key + body
function stepItem(n, ctx) {
  const kids = els(n);
  let key = '', body = '';
  const byCls = c => kids.find(k => hasCls(k, c));
  if (hasCls(n, 'artifact-step')) {
    key = plain(textOf(kids[0] || { type: 'text', text: '' }));
    body = convInline(kids.slice(1), ctx);
  } else if (hasCls(n, 'protocol-step')) {
    const h = kids.find(k => /^h\d$/.test(k.tag));
    key = plain(textOf(h || kids[0])).replace(/^\d+\s*(\/\/|[.:)])?\s*/, '');
    body = convInline(kids.filter(k => k !== h), ctx);
  } else if (hasCls(n, 'prep-step')) {
    const c = byCls('step-content') || n;
    const h = find(c, x => /^h\d$/.test(x.tag));
    key = plain(textOf(h || { type: 'text', text: '' }));
    body = convInline(els(c).filter(k => k !== h), ctx);
  } else if (hasCls(n, 'ur-rule')) {
    key = plain(textOf(byCls('ur-num') || kids[0]));
    body = convInline((byCls('ur-text') || n).children, ctx);
  } else if (hasCls(n, 'stat-item')) {
    key = plain(textOf(byCls('stat-number') || kids[0]));
    body = esc(sentenceCase(plain(textOf(byCls('stat-label') || kids[1]))));
  } else if (hasCls(n, 'tl-item')) {
    key = plain(textOf(byCls('tl-date')));
    body = `<strong>${esc(titleToSentence(plain(textOf(byCls('tl-event')))))}.</strong> ${convInline((byCls('tl-detail') || { children: [] }).children, ctx)}`;
  } else {
    key = plain(textOf(kids[0]));
    body = convInline(kids.slice(1), ctx);
  }
  key = cleanLabel(key);
  if (isCaps(key)) key = sentenceCase(key);
  if (/^[a-z]/.test(key)) key = key[0].toUpperCase() + key.slice(1);
  return `<li><span class="k">${esc(decode(key))}</span><span>${tidy(body)}</span></li>`;
}

// rule-list / mistake-list: <li><strong>// KEY</strong>Text</li>
function ruleItem(li, ctx) {
  const first = els(li)[0];
  if (first && ['strong', 'b'].includes(first.tag)) {
    let key = cleanLabel(plain(textOf(first))).replace(/^mistake \d+:\s*/i, '');
    key = key.replace(/[.:]?$/, '.');
    key = key[0].toUpperCase() + key.slice(1);
    const rest = convInline(li.children.filter(c => c !== first), ctx);
    return `<li><strong>${esc(decode(key))}</strong> ${tidy(rest)}</li>`;
  }
  return `<li>${tidy(convInline(li.children, ctx))}</li>`;
}

function convList(n, ctx) {
  const rule = hasCls(n, 'rule-list', 'mistake-list', 'sc-rules');
  const items = els(n).filter(c => c.tag === 'li').map(li => {
    if (rule) return ruleItem(li, ctx);
    if (hasBlock(li)) return `<li>${convBlocks(li.children, ctx).join('\n')}</li>`;
    return `<li>${tidy(convInline(li.children, ctx))}</li>`;
  });
  if (!items.length) return '';
  return `<${n.tag}>\n${items.join('\n')}\n</${n.tag}>`;
}

function convBox(n, ctx) {
  if (n.attrs.style) stats.inlineStyles++;
  const parts = [];
  let titled = false;
  const title = t => {
    if (!t || NOISE_LABEL.test(t)) return;
    if (!titled) { parts.push(`<p class="callout-h">${esc(decode(t))}</p>`); titled = true; }
    else parts.push(`<p><strong>${esc(decode(t))}</strong></p>`);
  };
  const walkBox = kids => {
    let group = [];
    const flush = () => { if (group.length) parts.push(`<ol class="steps">\n${group.join('\n')}\n</ol>`); group = []; };
    for (const c of kids) {
      if (c.type === 'text') { const t = tidy(cleanText(c.text)); if (t) { flush(); parts.push(`<p>${t}</p>`); } continue; }
      if (c.type !== 'el') continue;
      if (hasCls(c, ...ITEM_CLS)) { group.push(stepItem(c, ctx)); continue; }
      flush();
      if (hasCls(c, ...HUD_CLS)) { collectLinks(c, ctx); continue; }
      if (hasCls(c, ...LABEL_CLS)) { title(cleanLabel(plain(textOf(c)))); continue; }
      if (/^h[2-6]$/.test(c.tag)) { title(cleanLabel(plain(textOf(c)))); continue; }
      if (hasCls(c, 'archetype-name', 'nsb-time', 'spb-stat', 'cb-threat', 'card-archetype')) { const t = cleanLabel(plain(textOf(c))); if (t) parts.push(`<p><strong>${esc(decode(t))}</strong></p>`); continue; }
      if (hasCls(c, 'trait-col')) { walkBox(c.children); continue; }
      if (hasCls(c, ...UNWRAP_CLS) || hasCls(c, 'universal-rules')) { walkBox(c.children); continue; }
      if (hasCls(c, ...TEXT_CLS) || (c.tag === 'div' && !hasBlock(c))) {
        const inner = tidy(convInline(c.children, ctx));
        if (inner) parts.push(`<p>${isCaps(plain(inner)) && !/<a /.test(inner) ? esc(sentenceCase(plain(inner))) : inner}</p>`);
        if (c.attrs.style) stats.inlineStyles++;
        continue;
      }
      if (c.tag === 'ul' || c.tag === 'ol') { const l = convList(c, ctx); if (l) parts.push(l); continue; }
      if (c.tag === 'p') { const inner = tidy(convInline(c.children, ctx)); if (inner) parts.push(`<p>${inner}</p>`); continue; }
      if (hasBlock(c)) { walkBox(c.children); continue; }
      const inner = tidy(convInline([c], ctx)); if (inner) parts.push(`<p>${inner}</p>`);
    }
    flush();
  };
  walkBox(n.children);
  if (!parts.length) return '';
  const mod = hasCls(n, 'dont-box', 'warning-box', 'ten-second-box') ? ' callout-warn' : '';
  return `<aside class="callout${mod}">\n${parts.join('\n')}\n</aside>`;
}

function convBlocks(nodes, ctx) {
  const out = [];
  let group = [];
  let skippingRelated = false;
  const flush = () => { if (group.length) out.push(`<ol class="steps">\n${group.join('\n')}\n</ol>`); group = []; };
  for (const n of nodes) {
    if (n.type === 'comment') continue;
    if (n.type === 'text') {
      const t = tidy(cleanText(n.text));
      if (t) { flush(); out.push(`<p>${t}</p>`); }
      continue;
    }
    if (n.type !== 'el' || RAW.has(n.tag)) continue;

    if (skippingRelated) {
      if (isLinkDump(n)) { collectLinks(n, ctx); continue; }
      skippingRelated = false;
    }
    if (hasCls(n, ...ITEM_CLS)) { group.push(stepItem(n, ctx)); continue; }
    flush();

    if (hasCls(n, ...CTA_CLS) || isInlineCta(n)) {
      stats.ctaBlocksRemoved++;
      if (n.attrs.style) stats.inlineStyles++;
      collectLinks(n, ctx);
      out.push('<!--cta-->');
      // keep real content that was nested inside a CTA block
      for (const k of findAll(n, x => hasCls(x, ...BOX_CLS) && !hasCls(x, ...CTA_CLS))) {
        const parentBox = findAll(n, x => x !== k && hasCls(x, ...BOX_CLS) && find(x, y => y === k));
        if (!parentBox.length) out.push(convBox(k, ctx));
      }
      continue;
    }
    if (hasCls(n, ...HUD_CLS)) { stats.hudBlocksRemoved++; collectLinks(n, ctx); continue; }
    if (hasCls(n, 'cta-k')) continue;
    if (hasCls(n, 'threat-badge')) { out.push(`<p class="threat label">${esc(cleanLabel(plain(textOf(n))).replace(/^Threat:?\s*/i, 'Reported threat: '))}</p>`); continue; }
    if (isLinkDump(n) && (hasCls(n, 'related', 'related-list') || /^related files:/i.test(plain(textOf(n))))) { collectLinks(n, ctx); continue; }
    if (hasCls(n, ...BOX_CLS)) { const b = convBox(n, ctx); if (b) out.push(b); continue; }
    if (hasCls(n, ...UNWRAP_CLS)) { out.push(...convBlocks(n.children, ctx)); continue; }

    const tag = n.tag;
    if (/^h[1-6]$/.test(tag)) {
      let t = cleanLabel(plain(textOf(n)));
      if (/^related( field| civilian)? (files|briefings)$/i.test(t) || /^related /i.test(t)) {
        skippingRelated = true; stats.relatedSectionsReplaced++; continue;
      }
      if (tag === 'h2') {
        t = rewriteHeading(t);
        let id = slugify(t); let k = 2; while (ctx.ids.has(id)) id = `${slugify(t)}-${k++}`;
        ctx.ids.add(id); ctx.h2.push({ id, text: t });
        out.push(`<h2 id="${id}">${esc(decode(t))}</h2>`);
      } else {
        const lvl = ctx.h2.length ? 'h3' : 'h2';
        if (lvl === 'h2') { let id = slugify(t); ctx.ids.add(id); ctx.h2.push({ id, text: t }); out.push(`<h2 id="${id}">${esc(decode(t))}</h2>`); }
        else out.push(`<h3>${esc(decode(t))}</h3>`);
      }
      continue;
    }
    if (tag === 'ul' || tag === 'ol') { const l = convList(n, ctx); if (l) out.push(l); continue; }
    if (tag === 'p') {
      if (n.attrs.style) stats.inlineStyles++;
      const inner = tidy(convInline(n.children, ctx));
      if (inner) out.push(`<p>${inner}</p>`);
      continue;
    }
    if (tag === 'blockquote') { out.push(`<blockquote>${tidy(convInline(n.children, ctx))}</blockquote>`); continue; }
    if (tag === 'table') { out.push(convTable(n, ctx)); continue; }
    if (tag === 'hr') continue;
    if (hasBlock(n)) { if (n.attrs.style) stats.inlineStyles++; out.push(...convBlocks(n.children, ctx)); continue; }
    const inner = tidy(convInline([n], ctx));
    if (inner) out.push(`<p>${inner}</p>`);
  }
  flush();
  return out.filter(Boolean);
}
function convTable(n, ctx) {
  const rows = findAll(n, x => x.tag === 'tr').map(tr => '<tr>' + els(tr).map(c => `<${c.tag}>${tidy(convInline(c.children, ctx))}</${c.tag}>`).join('') + '</tr>');
  return `<table>\n${rows.join('\n')}\n</table>`;
}

// ---------------------------------------------------------------------------
// 6. Hand-authored content: the timeline rewrite, per-slug overrides, patches.
// ---------------------------------------------------------------------------
const src = (href, label) => ` <a class="src" href="${href}" rel="noopener">${label}</a>`;
const TIMELINE_BODY = `
<p><strong>The UAP disclosure timeline from 2023 to 2026</strong> is a record of hearings, one law, an archive release and a run of Department of War file batches. It is not a record of confirmed contact. Every official report in it (AARO, NASA) found no evidence of extraterrestrial technology.</p>
<p>This file lists what happened, on which date, and who did it. Where a claim is often repeated wrong, it says so.</p>
<aside class="callout">
<p class="callout-h">Quick answer: is the UAP Disclosure Act law?</p>
<p>Not in full. A reduced version of the Schumer and Rounds UAP Disclosure Act became law inside the FY2024 defense bill in December 2023. It created a UAP Records Collection at the National Archives, but the independent review board and the eminent domain powers were cut. A fuller UAP Disclosure Act passed the House as an amendment on July 22, 2026. It still needs the Senate and a conference agreement.</p>
</aside>
<h2 id="the-timeline">The timeline</h2>
<ol class="steps">
<li><span class="k"><time datetime="2023-07-26">26 Jul 2023</time></span><span><strong>Sworn testimony in the House.</strong> David Grusch, David Fravor and Ryan Graves testify under oath before a House Oversight subcommittee. Their claims enter the public record. The hearing does not settle them.${src('https://oversight.house.gov/hearing/unidentified-anomalous-phenomena-implications-on-national-security-public-safety-and-government-transparency/', 'oversight.house.gov')}</span></li>
<li><span class="k"><time datetime="2023-09-14">14 Sep 2023</time></span><span><strong>NASA&rsquo;s study team reports.</strong> A panel of 16 outside experts asks for better data and real scientific method, and finds no evidence that UAP are extraterrestrial.${src('https://www.nasa.gov/news-release/update-nasa-shares-uap-independent-study-report-names-director/', 'nasa.gov')}</span></li>
<li><span class="k"><time datetime="2023-12-22">22 Dec 2023</time></span><span><strong>The records law.</strong> The FY2024 National Defense Authorization Act becomes law. Sections 1841 to 1843 order agencies to send UAP records to a new UAP Records Collection at the National Archives. The review board and eminent domain powers in the Schumer and Rounds text were cut in conference.${src('https://www.archives.gov/research/topics/uaps', 'archives.gov')}</span></li>
<li><span class="k"><time datetime="2024-03-08">08 Mar 2024</time></span><span><strong>AARO&rsquo;s historical review.</strong> The Pentagon&rsquo;s All-domain Anomaly Resolution Office publishes Volume 1 of its review of government UAP efforts since 1945. It finds no evidence that any sighting was extraterrestrial technology, or that the government reverse-engineered alien craft.${src('https://www.aaro.mil/Portals/136/PDFs/AARO_Historical_Record_Report_Vol_1_2024.pdf', 'aaro.mil')}</span></li>
<li><span class="k"><time datetime="2024-11-13">13 Nov 2024</time></span><span><strong>A second House hearing.</strong> &ldquo;Unidentified Anomalous Phenomena: Exposing the Truth&rdquo; hears Tim Gallaudet, Luis Elizondo, Michael Gold and Michael Shellenberger.${src('https://oversight.house.gov/hearing/unidentified-anomalous-phenomena-exposing-the-truth/', 'oversight.house.gov')}</span></li>
<li><span class="k"><time datetime="2025-04-24">24 Apr 2025</time></span><span><strong>The National Archives releases records.</strong> UAP records sent by ODNI, the Office of the Secretary of Defense, the FAA and the Nuclear Regulatory Commission go public, as the 2023 law requires.${src('https://www.archives.gov/press/press-releases/2025/nr25-07', 'archives.gov')}</span></li>
<li><span class="k"><time datetime="2025-09-09">09 Sep 2025</time></span><span><strong>A whistleblower hearing.</strong> Rep. Anna Paulina Luna&rsquo;s Task Force on the Declassification of Federal Secrets holds &ldquo;Restoring Public Trust Through UAP Transparency and Whistleblower Protection.&rdquo;${src('https://oversight.house.gov/hearing/restoring-public-trust-through-uap-transparency-and-whistleblower-protection/', 'oversight.house.gov')}</span></li>
<li><span class="k"><time datetime="2026-02-19">19 Feb 2026</time></span><span><strong>The President&rsquo;s statement.</strong> In a social media post, the President says he is directing the Secretary of War and other agencies to identify and release UAP files. It was a public statement, not an executive order.${src('https://www.nbcnews.com/politics/trump-administration/trump-says-directing-pentagon-release-files-related-ufos-aliens-rcna259833', 'nbcnews.com')}</span></li>
<li><span class="k"><time datetime="2026-05-08">08 May 2026</time></span><span><strong>The first Department of War release.</strong> The Department of War, with ODNI support, publishes its first batch of declassified UAP files at war.gov/UFO under a program called PURSUE. It was not a National Archives event.${src('https://www.npr.org/2026/05/08/g-s1-121186/ufo-files-released-defense-department', 'npr.org')}</span></li>
<li><span class="k">May to Sep 2026</span><span><strong>More batches.</strong> Further Department of War batches follow on 22 May, 12 June, 10 July, 7 August and 18 September 2026.${src('https://en.wikipedia.org/wiki/United_States_UFO_files', 'wikipedia.org')}</span></li>
<li><span class="k"><time datetime="2026-07-21">21 Jul 2026</time></span><span><strong>AARO&rsquo;s FY2025 report.</strong> Published months after its deadline, it logs 319 new reports and attributes every resolved case to ordinary causes.${src('https://www.aaro.mil/Portals/136/PDFs/FY25%20UAP%20Annual%20Report/AARO_FY2025_Consolidated_Annual_Report_on_UAP.pdf', 'aaro.mil')}</span></li>
<li><span class="k"><time datetime="2026-07-22">22 Jul 2026</time></span><span><strong>The House passes a fuller UAP Disclosure Act.</strong> The House adds Rep. Eric Burlison&rsquo;s UAP Disclosure Act to its FY2027 defense bill. It would create an independent records review board and extend disclosure rules to contractors. It is not law: it still needs the Senate and conference.${src('https://burlison.house.gov/media/press-releases/house-adopts-burlison-amendment-establishing-uap-disclosure-framework', 'burlison.house.gov')}</span></li>
</ol>
<h2 id="what-is-the-uap-disclosure-act">What is the UAP Disclosure Act?</h2>
<p>It began as a Senate amendment filed by Chuck Schumer and Mike Rounds in July 2023. It would have created an independent review board to decide which UAP records the public sees. Congress kept the records collection and cut the board.</p>
<p>That is why you will read both &ldquo;the UAP Disclosure Act passed&rdquo; and &ldquo;it never passed.&rdquo; Neither is quite right. A reduced version became law in December 2023. The fuller version has passed only the House, in July 2026.</p>
<h2 id="what-did-the-president-order-in-february-2026">What did the President order in February 2026?</h2>
<p>He posted that he would direct the Secretary of War and other agencies to begin identifying and releasing government files on UAP. No executive order on UAP appears in the Federal Register, and reporting at the time described a social media statement, not a formal order.</p>
<p>What followed was real: the Department of War published its first batch of files on May 8, 2026, and kept releasing more through September.</p>
<h2 id="what-the-record-does-not-say">What the record does not say</h2>
<p>None of these documents confirm contact. AARO&rsquo;s historical review and NASA&rsquo;s study found no evidence of extraterrestrial technology, and AARO&rsquo;s FY2025 report put every case it resolved down to ordinary causes.</p>
<p>What changed after 2023 is the venue. The question moved from late-night radio into sworn testimony, federal law, government archives and official releases. The question is now official. The answer is not.</p>
<h2 id="how-to-read-the-next-release">How to read the next release</h2>
<aside class="callout">
<p class="callout-h">Signal tracker</p>
<ol class="steps">
<li><span class="k">Date</span><span>When did the filing, hearing or release actually happen?</span></li>
<li><span class="k">Actor</span><span>Congress, an agency, a contractor, a whistleblower, a court or an archive.</span></li>
<li><span class="k">Authority</span><span>Does it compel a release, request a review, or only describe concern?</span></li>
<li><span class="k">Language</span><span>Which word changed: UAP, anomalous, non-human, recovered?</span></li>
<li><span class="k">Your move</span><span>What should a prepared person do differently now?</span></li>
</ol>
</aside>
<h2 id="civilian-takeaway">Civilian takeaway</h2>
<ul>
<li><strong>Track primary sources.</strong> Hearings, laws, agency reports and official releases beat clipped posts.</li>
<li><strong>Check the agency.</strong> The National Archives, the Department of War and AARO are different offices with different jobs. Many wrong headlines start by mixing them up.</li>
<li><strong>Separate claim from confirmation.</strong> A serious allegation deserves attention. It still needs evidence.</li>
<li><strong>Prepare locally.</strong> If a disclosure wave hits, your household and your information habits matter first.</li>
</ul>`;

const OVERRIDES = {
  'uap-disclosure-act-2026-timeline': {
    title: 'UAP Disclosure Act Timeline, 2023 to 2026',
    h1: 'The UAP Disclosure Act timeline, 2023 to 2026',
    description: 'The UAP disclosure record from 2023 to 2026: the hearings, the records law, the Department of War file releases, and why the full UAP Disclosure Act is not law.',
    body: TIMELINE_BODY,
    related: ['uap-records-collection-explained', 'aaro-explained', 'nasa-uap-report-explained', 'government-ufo-programs-history', 'disclosure-anxiety-explained'],
    faq: [
      ['Is the UAP Disclosure Act law?', 'Not in full. A reduced version became law in the FY2024 defense bill in December 2023 and created the UAP Records Collection at the National Archives. A fuller version passed the House as an amendment on July 22, 2026 and still needs the Senate.'],
      ['Did the President sign an executive order on UAP files?', 'No executive order on UAP was issued. In February 2026 the President said in a social media post that he was directing agencies to identify and release UAP files.'],
      ['What was released on May 8, 2026?', 'The Department of War published its first batch of declassified UAP files at war.gov/UFO. It was not a National Archives release.'],
      ['Do the released files confirm alien contact?', 'No. Every official report so far, including AARO\u2019s and NASA\u2019s, found no evidence of extraterrestrial technology.'],
    ],
    dropHowTo: true,
  },
  'four-types-of-people-alien-contact': {
    title: 'Four Types of People During Alien Contact',
    h1: 'The four types of people during alien contact',
    description: 'The four civilian roles during alien contact, Sentinel, Diplomat, Scholar and Survivor, plus a sealed fifth. What each one does first, and how each one fails.',
    ogDescription: 'Sentinel, Diplomat, Scholar, Survivor. Four roles for the first minute of contact, and a fifth that is not issued.',
    alt: 'Civilians reacting in different ways during a first contact event.',
    faq: [
      ['What are the four types of people during alien contact?', 'Sentinel, Diplomat, Scholar and Survivor. Each is a job for the first minute of contact. A fifth designation, First Contact, is sealed: it is not issued, it appears.'],
      ['Is an alien contact role a personality type?', 'It is closer to a stress-response role. It describes what you are likely to reach for first under contact pressure, and how that instinct can go wrong.'],
      ['How do I find my role?', 'Answer the ten questions of the DISCLOSURE classification. It gives you one role for the first minute of contact.'],
    ],
  },
};

// Headlines the sentence-case pass cannot get right on its own (proper nouns, subtitles).
const H1S = {
  'alien-survival-guide-complete': 'Alien survival guide: contact protocols',
  'starlink-vs-ufo': 'Starlink vs UFO: how to tell the difference',
  'drone-vs-ufo': 'Drone vs UFO: a field identification guide',
  'ufo-vs-uap-difference': 'UFO vs UAP: what’s the difference?',
  'psychology-of-ufo-encounters': 'UFO encounter psychology: why people freeze',
  'types-of-alien-species-ranked-threat': 'Types of alien species, ranked by reported threat',
  'tall-white-alien-charles-hall': 'Tall White aliens and Charles Hall',
  'sirians-alien-lore-explained': 'Sirian alien lore explained',
  'uap-records-collection-explained': 'The UAP Records Collection explained',
  'government-ufo-programs-history': 'Government UFO programs: Blue Book to AARO',
  'phoenix-lights-explained': 'The Phoenix Lights explained',
  'rio-scale-explained': 'The Rio Scale explained',
  'fermi-paradox-explained': 'The Fermi Paradox explained',
  'zoo-hypothesis-explained': 'The Zoo Hypothesis explained',
  'dark-forest-theory-first-contact': 'The Dark Forest theory and first contact',
  'interdimensional-hypothesis-explained': 'The interdimensional hypothesis explained',
  'nasa-uap-report-explained': 'The NASA UAP report explained',
  'seti-post-detection-protocol': 'The SETI post-detection protocol explained',
  'roswell-ufo-incident-explained': 'The Roswell UFO incident explained',
  'nimitz-tic-tac-ufo-explained': 'The Nimitz Tic Tac UFO explained',
  'rendlesham-forest-ufo-incident': 'The Rendlesham Forest UFO incident',
};
// Meta descriptions (also the lede) rewritten to 140 to 160 characters.
const DESCS = {
  'aaro-explained': 'What AARO is, what the Pentagon’s UAP office has actually found, what it cannot prove, and how a civilian should read its reports without filling the gaps.',
  'ai-probe-alien-theory': 'The AI probe theory says first contact may arrive as machines, not visitors. What the idea claims, what it would change, and how a civilian should respond.',
  'alien-hybrid-theory-explained': 'Alien hybrid theory explained: where the abduction claims come from, what they cannot prove, and how to keep your judgment when a story feels personal.',
  'ancient-astronaut-theory-explained': 'Ancient astronaut theory explained: what it claims about the past, where the evidence falls short, and how to read origin stories without losing the thread.',
  'arcturian-aliens-explained': 'Arcturian aliens explained: the healer and starseed stories, where they come from, and why a comforting contact story still calls for a careful protocol.',
  'close-encounter-types-explained': 'Close encounter types in plain language: CE1, CE2 and CE3, the later CE4 and CE5 claims, what each level means, and how a witness should respond to each.',
  'experiencer-support-after-ufo-encounter': 'How to support someone after a UFO encounter or strange experience: listen first, keep the record, help them feel grounded, and know when to bring in help.',
  'grey-alien-encounter-survival-guide': 'A grey alien encounter guide for civilians: what witnesses report, what to do and not do in the moment, and how to protect your memory once it is over.',
  'how-to-film-a-ufo-at-night': 'How to film a UFO at night so the footage is worth something: a wide frame, a steady phone, spoken notes, original files, and details written down fast.',
  'how-to-talk-about-a-ufo-sighting': 'How to talk about a UFO sighting without losing people: lead with facts, skip the theories, protect other witnesses, and say only what you can back up.',
  'insectoid-aliens-explained': 'Insectoid aliens explained: the mantis and hive reports, why they frighten people so much, and how to keep panic in check if the report is ever yours.',
  'mantid-alien-encounter-what-to-do': 'A mantid alien encounter guide for civilians: what witnesses report, how to hold your mind steady, what not to do, and how to record it once you are safe.',
  'nasa-uap-report-explained': 'The NASA UAP report explained: what the 2023 independent study found, what it did not prove, and why its call for better data matters to every witness.',
  'nimitz-tic-tac-ufo-explained': 'The Nimitz Tic Tac UFO case explained: the Navy pilots’ account, the sensor questions, what the official record says, and what the case teaches civilians.',
  'ontological-shock-explained': 'Ontological shock in plain language: why a UFO sighting or contact news can shake a person’s sense of reality, and how to stay grounded in the days after.',
  'pleiadian-aliens-explained': 'Pleiadian aliens explained: the benevolent contact claims, the spiritual messages, the risk of trusting them too fast, and a calm protocol for any contact.',
  'psychology-of-ufo-encounters': 'UFO encounter psychology: why people freeze, panic, film or walk toward a UAP sighting, and how to train a calmer first response before you ever need it.',
  'reptilian-alien-threat-assessment': 'A reptilian alien threat assessment for civilians: what the reports describe, the first ten seconds of protocol, and the mistakes that make things worse.',
  'seti-post-detection-protocol': 'The SETI post-detection protocol explained: what scientists agree to do after a possible signal, what the rules cannot control, and how to read the news.',
  'sirians-alien-lore-explained': 'Sirian alien lore explained: the Sirius origin stories, the contact claims built on them, and how to enjoy the lore without mistaking it for evidence.',
  'starlink-vs-ufo': 'Starlink or UFO? How satellite trains look from the ground, the details that tell them apart, and when a night-sky sighting deserves a closer second look.',
  'uap-records-collection-explained': 'A civilian guide to the National Archives UAP Records Collection: what the records are, what they leave out, and how to read a release without guessing.',
  'what-to-do-if-a-ufo-lands-nearby': 'What to do if a UFO lands nearby: keep your distance, record from safety, look after the other witnesses, stay away from debris, and call the right people.',
  'what-to-do-if-you-see-a-ufo': 'What to do if you see a UFO or UAP: stay calm, keep your distance, record the details that matter, and know your role before the next sighting happens.',
  'why-people-freeze-during-ufo-sightings': 'Why people freeze during UFO sightings, what sudden stress does to attention and memory, and how to train a calmer first response before you need one.',
  'why-ufo-witnesses-stay-silent': 'Why UFO witnesses stay silent after a sighting, how stigma costs good reports, and how to share what you saw without losing people’s trust in you.',
  'zeta-reticuli-grey-aliens': 'Zeta Reticuli Grey aliens explained: where the star map story came from, what the abduction accounts share, and what a civilian should do with the lore.',
};

// Sitewide wording fixes, applied to article bodies and to FAQ/HowTo schema text.
const TEXT_FIXES = [
  [/Disclosure treats the Anunnaki as a high-impact scenario for advanced readiness\. The app moves users through classification, psychological drills, and first-contact frameworks before deeper origin-shock material\./g, 'Disclosure treats the Anunnaki as a high-impact scenario for calm judgment, not as proof.'],
  [/Sentinel, Diplomat, Scholar, Survivor, or First Contact/g, 'Sentinel, Diplomat, Scholar or Survivor'],
  [/protective, diplomatic, analytical, or rare/g, 'protective, diplomatic, analytical or self-preserving'],
  [/, then use the app access path for drills, field card progression, and first-contact readiness\./g, '. The app, now in development, turns that role into drills.'],
  [/archetype awareness, and app access\./g, 'and knowing your role.'],
  [/Claim app access/g, 'Find your role'],
  [/created under the 2024 National Defense Authorization Act/g, 'created under the FY2024 National Defense Authorization Act, signed in December 2023'],
  [/DISCLOSURE maps civilian response through five archetypes: Sentinel, Diplomat, Scholar, Survivor, and First Contact\./g, 'DISCLOSURE maps civilian response through four roles: Sentinel, Diplomat, Scholar and Survivor. A fifth, First Contact, is not issued.'],
];
function textFixes(s) {
  let out = s;
  for (const [re, rep] of TEXT_FIXES) out = out.replace(re, () => { stats.internalLanguage++; return rep; });
  return out;
}

// Targeted fixes on the converted article HTML: [slug or '*', find, replace, kind]
const PATCHES = [
  // four-types: consistent with four public roles plus a sealed fifth
  ['four-types-of-people-alien-contact', /<p>The <strong>five types of people during alien contact<\/strong> are not fantasy castes\.[\s\S]*?<\/p>\s*<p>You may see this question framed[\s\S]*?<\/p>/,
    '<p>The <strong>four types of people during alien contact</strong> are not fantasy castes. They are practical civilian response roles. If non-human intelligence became undeniable in public, people would not react as one species with one mind. They would protect, communicate, study or withdraw.</p>\n<p>DISCLOSURE names four public roles: Sentinel, Diplomat, Scholar and Survivor. There is a fifth designation, First Contact. It is not issued. It appears.</p>', 'content'],
  ['four-types-of-people-alien-contact', /<p>Sentinel protects\. Diplomat de-escalates\. Scholar documents\. Survivor preserves life\. First Contact engages on behalf of more than the self\.<\/p>/,
    '<p>Sentinel protects. Diplomat de-escalates. Scholar documents. Survivor preserves life.</p>', 'content'],
  ['four-types-of-people-alien-contact', /<li>First Contact steps forward only when the moment demands it\.<\/li>\s*/, '', 'content'],
  ['four-types-of-people-alien-contact', /<h2 id="type-05-first-contact">[\s\S]*?(?=<h2 )/,
    '<h2 id="the-sealed-fifth-first-contact">The sealed fifth: First Contact</h2>\n<p>There is a fifth designation. It is not issued, and nobody applies for it. It appears.</p>\n<p>What can be said in public is this: the role is not a reward for wanting attention. Whoever holds it serves the room, not the spotlight. There is no public record of who holds it.</p>\n', 'content'],
  ['four-types-of-people-alien-contact', /None\. A first contact scenario needs all five\. The Sentinel keeps the crowd from surging\. The Diplomat keeps fear from becoming hostility\. The Scholar preserves evidence\. The Survivor protects continuity\. First Contact engages only when engagement is truly required\./,
    'None. A first contact scenario needs all four. The Sentinel keeps the crowd from surging. The Diplomat keeps fear from becoming hostility. The Scholar preserves evidence. The Survivor protects continuity.', 'content'],
  ['four-types-of-people-alien-contact', /then take the <a href="\/quiz\/"><strong>classification quiz<\/strong><\/a> to identify your primary and secondary response pattern\./,
    'then take the <a href="/quiz/"><strong>classification quiz</strong></a> to find your role.', 'content'],
  ['four-types-of-people-alien-contact', /Survivors should study timing\. First Contact profiles should study humility and team support\./, 'Survivors should study timing.', 'content'],
  ['four-types-of-people-alien-contact', /<p>Your archetype is a default, not a destiny\. The system identifies the role you reach for under pressure and the failure mode that comes with it\. That is where preparation begins\.<\/p>/,
    '<p>Your role is a default, not a destiny. It names what you reach for under pressure, and the failure mode that comes with it. That is where preparation begins.</p>', 'content'],
  ['four-types-of-people-alien-contact', /<li><span class="k">First contact<\/span><span>[^<]*<\/span><\/li>\s*/i, '', 'content'],
  ['four-types-of-people-alien-contact', /<p><strong>The protector<\/strong><\/p>/, '<p><strong>Primary protector</strong></p>', 'content'],
  ['four-types-of-people-alien-contact', /<p><strong>The continuity specialist<\/strong><\/p>/, '<p><strong>Self-preservation</strong></p>', 'content'],
  ['four-types-of-people-alien-contact', /<p><strong>The de-escalation lead<\/strong><\/p>/, '<p><strong>De-escalation lead</strong></p>', 'content'],
  ['four-types-of-people-alien-contact', /<p><strong>The field analyst<\/strong><\/p>/, '<p><strong>Field analyst</strong></p>', 'content'],
  // internal funnel language
  ['government-ufo-programs-history', /That is where the DISCLOSURE funnel begins/, 'That is where DISCLOSURE begins', 'internal'],
  ['how-to-prepare-for-alien-contact', /<strong>App access<\/strong><\/a> connects the public file to the card and training funnel\./, '<strong>The classification</strong></a> connects the public file to your role and your training.', 'internal'],
  ['four-types-of-people-alien-contact', /(<h2 id="[^"]*">)Type 0\d: the (\w+)<\/h2>/g, '$1The $2</h2>', 'content'],
  ['how-to-prepare-for-alien-contact', /The First Contact Card is the bridge from curiosity to a role you can practice\./, 'The First Contact Card turns curiosity into a role you can practice.', 'internal'],
];

// ---------------------------------------------------------------------------
// 7. Extraction from a legacy article.
// ---------------------------------------------------------------------------
function meta(html, re) { const m = html.match(re); return m ? decode(m[1]).trim() : ''; }
function imageInfo(slug, heroImg, ogUrl) {
  const imgDir = join(ROOT, 'intel/images');
  let src = heroImg ? heroImg.attrs.src : '';
  if (!src || !existsSync(join(ROOT, src))) src = ogUrl && existsSync(join(ROOT, ogUrl)) ? ogUrl : '';
  if (!src) {
    const guess = readdirSync(imgDir).find(f => f.startsWith(slug.split('-').slice(0, 2).join('-')) && !/-\d+\.webp$/.test(f));
    src = guess ? `/intel/images/${guess}` : '/og/intel.jpg';
  }
  const base = src.replace(/\.webp$/, '');
  const w = +(heroImg?.attrs.width || 0) || 1600, h = +(heroImg?.attrs.height || 0) || 900;
  const set = [];
  if (existsSync(join(ROOT, base + '-768.webp'))) set.push(`${base}-768.webp 768w`);
  if (existsSync(join(ROOT, base + '-1280.webp'))) set.push(`${base}-1280.webp 1280w`);
  set.push(`${src} ${w}w`);
  const og = ogUrl && existsSync(join(ROOT, ogUrl)) ? ogUrl : src;
  return { src, srcset: set.join(', '), w, h, og };
}

function readArticle(slug) {
  const html = readFileSync(join(LEG, slug, 'index.html'), 'utf8');
  const tree = parse(html);
  const title = meta(html, /<title>([\s\S]*?)<\/title>/).replace(/\s*\|\s*DISCLOSURE\s*$/i, '');
  const description = meta(html, /<meta name="description" content="([^"]*)"/);
  const ogDescription = meta(html, /<meta property="og:description" content="([^"]*)"/);
  const ogImage = meta(html, /<meta property="og:image" content="([^"]*)"/).replace(/^https?:\/\/(www\.)?getdisclosure\.app/, '');
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);
  const hero = find(tree, n => n.tag === 'header' && hasCls(n, 'article-hero'));
  const heroImg = hero && find(hero, n => n.tag === 'img');
  const h1 = find(tree, n => n.tag === 'h1');
  const main = find(tree, n => n.tag === 'main');
  const metaBox = main && find(main, n => hasCls(n, 'article-meta'));
  const metaText = metaBox ? plain(textOf(metaBox)) : '';
  const filed = (metaText.match(/FILED:\s*(\d{4}-\d{2}-\d{2})/i) || [])[1] || (ld.find(x => x['@type'] === 'Article') || {}).datePublished || '2026-05-15';
  const read = (metaText.match(/READ TIME:\s*~?\s*(\d+)/i) || [])[1] || '6';
  const legacyStyles = (html.slice(html.indexOf('<main')).match(/ style="/g) || []).length;
  return { slug, html, tree, title, description, ogDescription, ogImage, ld, heroImg, h1: h1 ? plain(textOf(h1)) : title, main, metaBox, filed, read, legacyStyles };
}

// ---------------------------------------------------------------------------
// 8. Templates.
// ---------------------------------------------------------------------------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = d => { const [y, m, dd] = d.split('-'); return `${+dd} ${MONTHS[+m - 1]} ${y}`; };
const abs = p => HOST + p;
const ldBlock = o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2).replace(/</g, '\\u003c')}\n</script>`;
const cleanJsonText = s => (typeof s === 'string' ? plain(textFixes(cleanText(decode(s)))) : s);

function head({ title, description, path, control, ogType, ogTitle, ogDescription, ogImage, ogAlt, css, ld, preload }) {
  return `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} | DISCLOSURE</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(path)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030504">
<meta name="color-scheme" content="dark">
<meta name="dx:control" content="${control}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="DISCLOSURE">
<meta property="og:url" content="${abs(path)}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(ogDescription)}">
<meta property="og:image" content="${abs(ogImage)}">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@disclosure_app">
<meta name="twitter:title" content="${esc(ogTitle)}">
<meta name="twitter:description" content="${esc(ogDescription)}">
<meta name="twitter:image" content="${abs(ogImage)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${preload || ''}<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300..900&amp;family=Space+Mono:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="/assets/dx/dx.css?v=1">
<link rel="stylesheet" href="/assets/dx/${css}.css?v=1">
${ld.map(ldBlock).join('\n')}
</head>`;
}
const ASK = `<section class="ask" aria-labelledby="ask-h">
  <div class="wrap ask-grid">
    <div><h2 id="ask-h">Reading is the easy part.</h2></div>
    <div>
      <p>The first minute of contact goes to whoever already knows their job. Ten questions find yours.</p>
      <div class="actions"><a class="btn" href="/#classify">Find your role <span class="arr" aria-hidden="true">&rarr;</span></a></div>
    </div>
  </div>
</section>`;
const tail = `
<!-- dx:footer -->
<!-- /dx:footer -->
<script src="/assets/dx/dx.js?v=1" defer></script>`;

const FIELD_NOTES = {
  protocol: ['Knowing the steps and doing them with a racing heart are different skills. The drill takes ten seconds.', '/readiness/', 'Run the ten-second drill'],
  'field-guide': ['Most sightings end as ordinary objects. The minute before you know that is the one worth training.', '/readiness/', 'Run the ten-second drill'],
  psychology: ['Fear can be rehearsed. So can calm. Each role has a job for the first minute, and a way it goes wrong.', '/archetypes/', 'Read the four roles'],
  species: ['Reports differ. Your first move should not. Each role has a job for the first minute.', '/archetypes/', 'Read the four roles'],
  record: ['The record moves slowly. The first minute will not.', '/first-contact/', 'Read the first contact briefing'],
  theory: ['Theories do not decide what you do when the light is real. A plan does.', '/first-contact/', 'Read the first contact briefing'],
};

function row(f, headingTag) {
  return `<li><a href="/intel/${f.slug}/"><span class="no">File ${f.no}</span><span class="t">${esc(f.hubTitle)}<span class="d">${esc(f.hubDesc)}</span></span><span class="cat">${esc(f.cat)}</span></a></li>`;
}

function buildArticle(a) {
  const f = BY_SLUG.get(a.slug);
  const ov = OVERRIDES[a.slug] || {};
  const ctx = { slug: a.slug, related: [], h2: [], ids: new Set() };

  // body
  let body;
  if (ov.body) {
    body = ov.body.trim();
    for (const m of body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)) { ctx.h2.push({ id: m[1], text: decode(m[2]) }); ctx.ids.add(m[1]); }
    collectLinks(a.main, ctx);
    stats.ctaBlocksRemoved += findAll(a.main, n => hasCls(n, ...CTA_CLS) || isInlineCta(n)).length;
    stats.factFixes += 6; // countdown, executive push, Dec 2023 framing, Nov 2024 detail, June 2023 entry, 300-day section
  } else {
    const kids = a.main.children.filter(n => !(n.type === 'el' && hasCls(n, 'article-meta')));
    body = convBlocks(kids, ctx).join('\n');
  }
  // one field note at most, in the first mid-article CTA slot (content must follow it)
  const slots = [...body.matchAll(/<!--cta-->/g)];
  let placed = false;
  body = body.replace(/<!--cta-->/g, (m, off) => {
    if (placed) return '';
    const after = body.slice(off);
    if (!/<h2 /.test(after)) return '';
    placed = true; stats.fieldNotesAdded++;
    const [text, href, label] = FIELD_NOTES[f.catId];
    return `<aside class="field-note">\n<span class="label">Field note</span>\n<p>${text}</p>\n<a class="link" href="${href}">${label} <span aria-hidden="true">&rarr;</span></a>\n</aside>`;
  });
  void slots;

  // patches
  for (const [slug, re, rep, kind] of PATCHES) {
    if (slug !== a.slug && slug !== '*') continue;
    if (re.test(body)) { body = body.replace(re, rep); stats.patches++; if (kind === 'internal') stats.internalLanguage++; if (kind === 'fact') stats.factFixes++; }
    else stats.patchMisses.push(`${a.slug}: ${re}`);
  }
  body = textFixes(body);
  // rebuild the h2 list after patches (ids may have changed)
  ctx.h2 = [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(m => ({ id: m[1], text: plain(m[2]) }));

  // FAQ: shown on the page so the FAQPage schema describes visible content
  const faqLd = a.ld.find(x => x['@type'] === 'FAQPage');
  let faq = ov.faq || (faqLd ? (faqLd.mainEntity || []).map(q => [cleanJsonText(q.name), cleanJsonText(q.acceptedAnswer && q.acceptedAnswer.text)]) : []);
  faq = faq.filter(([q, ans]) => q && ans);
  const bodyPlain = plain(body).toLowerCase();
  const shown = faq.filter(([q]) => !bodyPlain.includes(q.toLowerCase().replace(/\?$/, '')));
  if (shown.length) {
    stats.faqSectionsShown++;
    body += `\n<h2 id="questions">Common questions</h2>\n<div class="transcript">\n${shown.map(([q, ans]) => `<details><summary>${esc(q)}</summary><div class="a"><div><p>${esc(ans)}</p></div></div></details>`).join('\n')}\n</div>`;
    ctx.h2.push({ id: 'questions', text: 'Common questions' });
  }

  // related files: the article's own links first, then same-category neighbours
  let rel = (ov.related || ctx.related).filter(s => s !== a.slug && BY_SLUG.has(s));
  rel = [...new Set(rel)].slice(0, 5);
  if (rel.length < 3) {
    const same = FILES.filter(x => x.catId === f.catId && x.slug !== a.slug && !rel.includes(x.slug));
    const idx = FILES.indexOf(f);
    same.sort((x, y) => Math.abs(FILES.indexOf(x) - idx) - Math.abs(FILES.indexOf(y) - idx));
    for (const x of same) { if (rel.length >= 4) break; rel.push(x.slug); }
  }

  // head data
  const title = ov.title || a.title;
  const description = cleanJsonText(ov.description || DESCS[a.slug] || a.description);
  const ogDescription = cleanJsonText(ov.ogDescription || a.ogDescription || description);
  const h1 = ov.h1 || H1S[a.slug] || titleToSentence(cleanText(a.h1));
  if (description.length < 140 || description.length > 160) stats.patchMisses.push(`${a.slug}: description length ${description.length}`);
  const img = imageInfo(a.slug, a.heroImg, a.ogImage);
  const alt = cleanJsonText(ov.alt || (a.heroImg && a.heroImg.attrs.alt) || h1);
  const path = `/intel/${a.slug}/`;
  const wordsIn = plain(body).split(/\s+/).length;
  const read = ov.body ? Math.max(3, Math.round(wordsIn / 230)) : a.read;
  const art = a.ld.find(x => x['@type'] === 'Article') || {};

  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: h1.length <= 110 ? h1 : title,
      description,
      image: [abs(img.og)],
      url: abs(path),
      mainEntityOfPage: { '@type': 'WebPage', '@id': abs(path) },
      datePublished: art.datePublished || a.filed,
      dateModified: MODIFIED,
      articleSection: f.cat,
      author: { '@type': 'Organization', name: 'DISCLOSURE', url: HOST + '/' },
      publisher: { '@type': 'Organization', name: 'DISCLOSURE', url: HOST + '/', logo: { '@type': 'ImageObject', url: HOST + '/android-chrome-512x512.png' } },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Intel', item: HOST + '/intel/' },
        { '@type': 'ListItem', position: 3, name: h1, item: abs(path) },
      ],
    },
  ];
  if (faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans } })) });
  const howto = a.ld.find(x => x['@type'] === 'HowTo');
  if (howto && !ov.dropHowTo) {
    const clean = o => (typeof o === 'string' ? cleanJsonText(o) : Array.isArray(o) ? o.map(clean) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, k === 'url' || k === 'image' || k === '@id' ? v : clean(v)])) : o);
    const h = clean(howto);
    h['@context'] = 'https://schema.org';
    delete h.url; delete h.image;
    ld.push(h); stats.howtoKept++;
  }

  const toc = ctx.h2.length >= 2 ? `<nav class="toc" aria-labelledby="toc-h">
      <p class="label" id="toc-h">In this file</p>
      <ol>
${ctx.h2.map(h => `        <li><a href="#${h.id}">${esc(decode(h.text))}</a></li>`).join('\n')}
      </ol>
    </nav>` : '';

  const html = `${head({
    title, description, path, control: `File INT-${f.no} &middot; ${esc(f.hubTitle)} &middot; Unclassified`, ogType: 'article',
    ogTitle: title, ogDescription, ogImage: img.og, ogAlt: alt, css: 'intel', ld,
    preload: `<link rel="preload" as="image" href="${img.srcset.includes('-1280.webp') ? img.src.replace(/\.webp$/, '-1280.webp') : img.src}" imagesrcset="${img.srcset}" imagesizes="100vw" fetchpriority="high">\n`,
  })}
<body>
<!-- dx:header over -->
<!-- /dx:header -->
<main id="main">
<header class="plate intel-plate">
  <img class="plate-img" src="${img.srcset.includes('-1280.webp') ? img.src.replace(/\.webp$/, '-1280.webp') : img.src}" srcset="${img.srcset}" sizes="100vw" width="${img.w}" height="${img.h}" alt="${esc(alt)}" fetchpriority="high" decoding="async">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/intel/">Intel</a></li><li aria-current="page">File ${f.no}</li></ol></nav>
    <h1>${esc(h1)}</h1>
    <p class="lede">${esc(description)}</p>
    <p class="label intel-meta">File ${f.no} &middot; ${esc(f.cat)} &middot; ${read} min read &middot; Filed <time datetime="${a.filed}">${fmtDate(a.filed)}</time></p>
  </div>
</header>
<div class="wrap intel-body">
  <article class="prose">
${body}
  </article>
  <aside class="intel-side" aria-label="File tools">
    ${toc}
    <div class="field-note">
      <span class="label">Field note</span>
      <p>Your role changes what you do next.</p>
      <a class="link" href="/#classify">Find your role <span aria-hidden="true">&rarr;</span></a>
    </div>
  </aside>
</div>
<section class="section intel-related" aria-labelledby="rel-h">
  <div class="wrap">
    <h2 id="rel-h" class="intel-related-h">Related files</h2>
    <ol class="file-index">
${rel.map(s => '      ' + row(BY_SLUG.get(s))).join('\n')}
    </ol>
  </div>
</section>
${ASK}
</main>${tail}
</body>
</html>
`;
  return { html, rel, h1, title, description, faq: faq.length, read };
}

function buildHub() {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const inWords = n => (n < 20 ? words[n] : tens[Math.floor(n / 10)] + (n % 10 ? '-' + words[n % 10] : ''));
  const countWord = inWords(COUNT);
  const Count = countWord[0].toUpperCase() + countWord.slice(1);
  const path = '/intel/';
  const description = `${Count} plain-language files on UFO sightings, reported alien species, the UAP public record and first contact protocol, sorted by category and free to read.`;
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'The civilian intel archive', url: abs(path), description,
      isPartOf: { '@type': 'WebSite', name: 'DISCLOSURE', url: HOST + '/' },
      mainEntity: {
        '@type': 'ItemList', numberOfItems: COUNT,
        itemListElement: FILES.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/intel/${f.slug}/`), name: f.hubTitle })),
      },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: HOST + '/' },
        { '@type': 'ListItem', position: 2, name: 'Intel', item: abs(path) },
      ],
    },
  ];
  const groups = GROUPS.map(g => `    <section class="intel-group" data-cat="${g.id}" aria-labelledby="g-${g.id}">
      <div class="intel-group-head">
        <h2 id="g-${g.id}">${g.name}</h2>
        <p>${g.intro}</p>
      </div>
      <ol class="file-index">
${FILES.filter(f => f.catId === g.id).map(f => '        ' + row(f)).join('\n')}
      </ol>
    </section>`).join('\n');
  const html = `${head({
    title: 'UFO and UAP Intel Archive for Civilians', description, path,
    control: 'File INT-000 &middot; Intel archive &middot; Released in part', ogType: 'website',
    ogTitle: 'The civilian intel archive', ogDescription: `${Count} plain files for the first minute: sightings, species, the public record and what to do next.`,
    ogImage: '/og/intel.jpg', ogAlt: 'The DISCLOSURE intel archive.', css: 'intel', ld,
  })}
<body>
<!-- dx:header -->
<!-- /dx:header -->
<main id="main">
<header class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Intel</li></ol></nav>
    <h1>The civilian intel archive.</h1>
    <p class="lede">${Count} plain files on sightings, reported species, the public record and what people do when the signal arrives. Every file answers one question: what should a civilian do before the official briefing arrives?</p>
  </div>
</header>
<section class="section intel-archive" aria-label="All intel files">
  <div class="wrap">
    <div class="intel-filter" role="group" aria-label="Filter files by category" hidden>
      <button type="button" data-filter="all" aria-pressed="true">All files</button>
${GROUPS.map(g => `      <button type="button" data-filter="${g.id}" aria-pressed="false">${g.name}</button>`).join('\n')}
    </div>
    <p class="intel-count label" aria-live="polite">${COUNT} files</p>
${groups}
  </div>
</section>
${ASK}
</main>${tail}
<script>
(function () {
  var bar = document.querySelector('.intel-filter');
  if (!bar) return;
  var groups = [].slice.call(document.querySelectorAll('.intel-group'));
  var count = document.querySelector('.intel-count');
  var total = document.querySelectorAll('.intel-group li').length;
  bar.hidden = false;
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var v = b.getAttribute('data-filter'), n = 0;
    [].forEach.call(bar.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    groups.forEach(function (g) {
      var on = v === 'all' || g.getAttribute('data-cat') === v;
      g.hidden = !on;
      if (on) n += g.querySelectorAll('li').length;
    });
    count.textContent = v === 'all' ? total + ' files' : n + ' of ' + total + ' files';
  });
})();
</script>
</body>
</html>
`;
  return { html, description };
}

// ---------------------------------------------------------------------------
// 9. Run.
// ---------------------------------------------------------------------------
const articles = FILES.map(f => readArticle(f.slug));
buildCaseMap(articles.map(a => a.main));
const legacyInline = articles.reduce((s, a) => s + a.legacyStyles, 0);
const report = [];
for (const a of articles) {
  const r = buildArticle(a);
  writeFileSync(join(OUT, a.slug, 'index.html'), r.html);
  report.push({ no: BY_SLUG.get(a.slug).no, slug: a.slug, h1: r.h1, titleLen: r.title.length + 13, descLen: r.description.length, related: r.rel.length, faq: r.faq });
}
const hub = buildHub();
writeFileSync(join(OUT, 'index.html'), hub.html);

if (process.argv.includes('--table')) for (const r of report) console.log(`${r.no}  ${r.slug.padEnd(50)} t${r.titleLen} d${r.descLen} rel${r.related} faq${r.faq}  ${r.h1}`);
console.log(JSON.stringify({ written: report.length + 1, files: COUNT, legacyInlineStyleAttrs: legacyInline, hubDescLen: hub.description.length, ...stats, patchMisses: stats.patchMisses }, null, 2));
