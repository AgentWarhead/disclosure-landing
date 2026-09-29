// Inbound links for new pages: a "See also" line at the end of each source article's body.
// Idempotent (replaces <!-- dx:inlink --> blocks). Anchors in [brackets] link to the target.
// Usage: node scripts/dx-inbound.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');

// [source page, target page, sentence with [anchor]]
const LINKS = [
  ['/intel/starlink-vs-ufo/', '/tools/what-did-i-see/', 'Saw a line of lights? [Check what was overhead at that minute] with real Starlink and satellite positions.'],
  ['/intel/airplane-satellite-balloon-ufo-misidentification/', '/tools/what-did-i-see/', 'Before you decide, [run your sighting through the sky identifier]: it checks satellites, planets and bright stars for your time and place.'],
  ['/intel/what-to-do-if-you-see-a-ufo/', '/tools/what-did-i-see/', 'Once you are safe, note the time and direction and [check what was actually in that part of the sky].'],
  ['/intel/what-are-orbs-in-the-sky/', '/tools/what-did-i-see/', 'A bright light that hangs still is often Venus or Jupiter; [the sky identifier shows which planet was there that night].'],
  ['/intel/drone-vs-ufo/', '/tools/what-did-i-see/', 'If it moved steadily and never blinked, [rule out a satellite first].'],
  ['/intel/how-to-report-a-ufo-sighting/', '/tools/report/', 'To write it up properly, use the [UFO sighting report form]: it scores how complete your report is and prints a clean PDF without uploading anything.'],
  ['/intel/ufo-evidence-checklist/', '/tools/report/', 'Once the checklist is done, put it into the [witness report form] and see how strong the record is.'],
  ['/intel/rio-scale-explained/', '/tools/report/', 'The same idea, judging the evidence rather than the excitement, drives the [report strength meter] on our sighting report form.'],
  ['/intel/how-to-film-a-ufo-at-night/', '/tools/report/', 'Keep the original file, then log it in the [sighting report form].'],
  ['/intel/fermi-paradox-explained/', '/tools/drake/', 'Run your own numbers in the [Drake equation calculator] and see how much of the paradox rests on guesses.'],
  ['/intel/are-we-alone-in-the-universe/', '/tools/drake/', 'Three terms of the answer are measured and four are guesses; try them in the [Drake equation calculator].'],
  ['/intel/seti-post-detection-protocol/', '/tools/drake/', 'For how many signals there might be to detect, see the [Drake equation calculator].'],
  ['/intel/disclosure-anxiety-explained/', '/intel/is-disclosure-day-real/', 'If a film set this off, see [is Disclosure Day real?] for what the record actually holds.'],
  ['/intel/what-would-first-contact-look-like/', '/intel/is-disclosure-day-real/', "Spielberg's version is fiction, and [Disclosure Day against the record] sets each scene beside what governments have released."],
  ['/intel/uap-disclosure-act-2026-timeline/', '/intel/is-disclosure-day-real/', 'The 2026 film shares the name but none of the facts: [is Disclosure Day real?]'],
  ['/intel/uap-disclosure-act-2026-timeline/', '/intel/did-trump-sign-a-ufo-executive-order/', 'The February 2026 announcement was a Truth Social post, not a signed order: [did Trump sign a UFO executive order?]'],
  ['/intel/aaro-explained/', '/intel/did-trump-sign-a-ufo-executive-order/', 'The 2026 file releases came from a presidential post, and no order was ever signed: [the executive order file] explains.'],
  ['/intel/uap-records-collection-explained/', '/intel/did-trump-sign-a-ufo-executive-order/', 'The 2026 Department of War releases run alongside this collection, and [no executive order created them].'],
  ['/intel/how-to-report-a-ufo-sighting/', '/intel/report-a-ufo-in-canada/', 'In Canada there is no federal office, so read [how to report a UFO sighting in Canada] before you file.'],
  ['/intel/ufo-evidence-checklist/', '/intel/report-a-ufo-in-canada/', 'Canadian witnesses can send the finished packet to the channels listed in [reporting a sighting in Canada].'],
  ['/intel/what-to-do-if-you-see-a-ufo/', '/intel/report-a-ufo-in-canada/', 'If you are in Canada, [here is where your report goes].'],
  ['/intel/ufo-vs-uap-difference/', '/glossary/', 'Every term on this page is defined in one line in [the UFO and UAP glossary].'],
  ['/intel/close-encounter-types-explained/', '/glossary/', 'CE1 to CE5, the Hynek scale and related terms are collected in [the glossary].'],
  ['/intel/uap-disclosure-act-2026-timeline/', '/record/', 'Every event on this page, and every one back to 1947, sits in [the Disclosure Ledger] with a verdict on what its source confirms.'],
  ['/intel/aaro-explained/', '/record/', "AARO's founding, its reports and the hearings where its directors testified are dated and sourced in [the Disclosure Ledger]."],
  ['/intel/nasa-uap-report-explained/', '/record/', "NASA's 2022 study announcement and its 2023 report sit beside every other official UAP event in [the Disclosure Ledger]."],
  ['/intel/government-ufo-programs-history/', '/record/', 'For every program here with its date and source, from Project Sign in 1947 to PURSUE in 2026, open [the Disclosure Ledger].'],
  ['/intel/project-blue-book-explained/', '/record/', "Blue Book's start, its end and the reviews around it are dated and sourced in [the Disclosure Ledger]."],
  ['/intel/uap-records-collection-explained/', '/record/pursue/', "The Department of War's 2026 releases are a separate program from this collection, and [the PURSUE UFO files] page sets out the difference."],
  ['/intel/uap-disclosure-act-2026-timeline/', '/record/pursue/', 'For the six Department of War releases one at a time, with what each held, see [the PURSUE UFO files].'],
  ['/intel/aaro-explained/', '/record/pursue/', 'AARO also helps prepare the files the Department of War publishes in [the PURSUE UFO releases].'],
  ['/intel/government-ufo-programs-history/', '/record/pursue/', 'The newest chapter is [PURSUE, the 2026 UFO file releases] at war.gov/UFO.'],
  ['/intel/roswell-ufo-incident-explained/', '/cases/', 'Six more famous cases, each labeled explained, disputed or unexplained, are in the [UFO case files].'],
  ['/intel/phoenix-lights-explained/', '/cases/', 'For other mass sightings checked against the record, open the [UFO case files].'],
  ['/intel/close-encounter-types-explained/', '/cases/', 'Real reports at each level, with their official findings, are in the [UFO case files].'],
  ['/intel/nimitz-tic-tac-ufo-explained/', '/cases/navy-ufo-videos-gimbal-gofast-flir/', 'The infrared clip from that day, and what AARO has said about it, is in [the Gimbal, GoFast and FLIR case file].'],
  ['/intel/how-to-evaluate-ufo-memory/', '/cases/navy-ufo-videos-gimbal-gofast-flir/', "The Navy pilots' accounts and their own footage cover different minutes, as [the Navy UFO videos file] shows."],
  ['/intel/drone-vs-ufo/', '/cases/jellyfish-ufo-iraq/', 'Balloons fool trained operators too, as [the Jellyfish UFO case] shows.'],
  ['/intel/nimitz-tic-tac-ufo-explained/', '/cases/jellyfish-ufo-iraq/', 'A later military video that AARO did resolve is [the Jellyfish UFO from Iraq].'],
  ['/intel/drone-vs-ufo/', '/cases/new-jersey-drones-2024/', 'For what happens when a whole state starts reporting drones, read [what the New Jersey drones were].'],
  ['/intel/black-triangle-ufo-explained/', '/cases/new-jersey-drones-2024/', 'Lights in formation over New Jersey in 2024 were matched to aircraft and drones in [the New Jersey drones case file].'],
  ['/intel/close-encounter-types-explained/', '/cases/ariel-school-ufo-1994/', 'The best-known group report of a close encounter involving children is [the Ariel School incident].'],
  ['/intel/how-to-evaluate-ufo-memory/', '/cases/ariel-school-ufo-1994/', "How questions shape a witness's memory is at the center of [the Ariel School case]."],
  ['/intel/missing-time-after-ufo-sighting/', '/cases/travis-walton-abduction/', 'The most famous missing-time claim, five days in 1975, is in [the Travis Walton case file].'],
  ['/intel/how-to-evaluate-ufo-memory/', '/cases/travis-walton-abduction/', 'Why polygraphs never settled a memory claim is shown in [the Travis Walton abduction story].'],
  ['/intel/rendlesham-forest-ufo-incident/', '/cases/shag-harbour-ufo-1967/', "Canada's best-documented case, with police and National Defence records, is [the Shag Harbour UFO incident]."],
  ['/intel/roswell-ufo-incident-explained/', '/cases/shag-harbour-ufo-1967/', 'For a crash-style case where the government file still says unsolved, read [the Shag Harbour incident of 1967].'],
];

const bySource = {};
for (const [src, target, sentence] of LINKS) {
  if (!existsSync(join(root, target, 'index.html'))) { console.log('skip, target missing:', target); continue; }
  (bySource[src] ||= []).push(sentence.replace(/\[([^\]]+)\]/, `<a href="${target}">$1</a>`));
}
let n = 0;
for (const [src, sentences] of Object.entries(bySource)) {
  const p = join(root, src, 'index.html');
  if (!existsSync(p)) { console.log('missing source', src); continue; }
  let s = readFileSync(p, 'utf8');
  s = s.replace(/\s*<!-- dx:inlink -->[\s\S]*?<!-- \/dx:inlink -->/g, '');
  const block = `\n<!-- dx:inlink --><p class="see-also"><span class="label">See also</span> ${sentences.join(' ')}</p><!-- /dx:inlink -->\n`;
  const at = s.indexOf('</article>');
  if (at < 0) { console.log('no article in', src); continue; }
  s = s.slice(0, at) + block + s.slice(at);
  writeFileSync(p, s); n++;
}
console.log(`see-also lines on ${n} pages`);
