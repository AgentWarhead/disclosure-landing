const RCMP_MAY = 'https://web.archive.org/web/20260525015727/https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Documents/1967-05-26.pdf';
const RCMP_AUG = 'https://web.archive.org/web/20250824094029/https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Documents/1967-08-10.pdf';
const LAC_PAGE = 'https://web.archive.org/web/20110519203417/http://www.collectionscanada.gc.ca/ufo/002029-1300.01-e.html';
const CONDON = 'http://files.ncas.org/condon/text/case22.htm';
const CBC17 = 'https://www.cbc.ca/news/canada/manitoba/falcon-lake-incident-book-anniversary-1.4121639';
const COIN = 'https://www.cbc.ca/news/canada/manitoba/falcon-lake-ufo-coin-royal-canadian-mint-1.4602786';
const IRON = 'http://www.theironskeptic.com/articles/michalak/michalak.htm';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;
const l = (path, text) => `<a href="${path}">${text}</a>`;

export default {
  slug: 'falcon-lake-ufo-1967', no: '007', year: '1967',
  crumb: 'Falcon Lake',
  title: 'The Falcon Lake Incident of 1967, Manitoba',
  h1: 'The Falcon Lake incident',
  desc: 'The Falcon Lake incident, Manitoba, 1967: what the RCMP files say about Stefan Michalak&rsquo;s burns, the radioactive rock, and whether the case was debunked.',
  ogDesc: 'A prospector with a grid of burns, a radioactive crack in the rock, and an RCMP file that closed without an answer.',
  og: '/og/share/ufo-lands-nearby.jpg', ogAlt: 'A craft on the ground at night and a lone figure nearby.',
  date: '2026-09-29', accessed: '2026-09-29',
  eventName: 'Falcon Lake incident', dateISO: '1967-05-20',
  placeFull: 'Falcon Lake, Whiteshell Provincial Park, Manitoba, Canada', country: 'Canada',
  lat: 49.70, lng: -95.30, coordsNote: 'Approximate: the Falcon Lake area. The RCMP placed the site about 2.5 miles due north of the Trans-Canada Highway at Falcon Beach.',
  cardTitle: 'The Falcon Lake incident', cardLine: 'One prospector, a grid of burns, and a radioactive crack in the rock.',
  cardDate: 'May 1967', cardPlace: 'Manitoba, Canada', status: 'disputed',
  lede: 'The Falcon Lake incident is the case of Stefan Michalak, a Winnipeg mechanic who said a landed craft burned his chest near Falcon Lake, Manitoba, on 20 May 1967. The RCMP could not account for his burns or resolve the gaps in his story. National Defence lists the case as unsolved.',
  statusReason: 'National Defence lists it as unsolved. The RCMP could not account for the burns, and it also recorded discrepancies it never resolved. There is no second witness.',
  findingSource: LAC_PAGE,
  sheet: {
    date: '20 May 1967, around midday by Michalak&rsquo;s accounts. He flagged down an RCMP highway patrol car on the Trans-Canada Highway at about 3:00 pm.',
    place: 'Bush north of Falcon Beach in Whiteshell Provincial Park, Manitoba, about 150 km east of Winnipeg. The RCMP later placed the site about 2.5 miles north of the highway.',
    witnesses: 'One: Stefan Michalak, 51, an industrial mechanic and weekend prospector. The University of Colorado investigator found that a nearby fire tower lookout saw nothing unusual.',
    duration: 'About half an hour or more on the ground by his accounts, then a sudden takeoff. The RCMP inquiry ran from 23 May to August 1967.',
    evidence: 'Burns to his chest and abdomen, a burned undershirt and melted cap, a 15-foot circle on the rock where moss was missing, and soil from a rock crack that tested radioactive.',
    finding: `RCMP, August 1967: some facts <q>cannot be denied and cannot be accounted for or explained away,</q> and the inconsistencies were never resolved. <span class="src">(RCMP file, Library and Archives Canada)</span> The archives&rsquo; exhibition says National Defence <q>identifies the Falcon Lake case as unsolved.</q>`,
  },
  happened: `<p>On Saturday 20 May 1967, Stefan Michalak, a Winnipeg industrial mechanic who prospected on weekends, was working a quartz vein in the bush north of Falcon Beach, Manitoba. By his account, a flock of geese startled him and he looked up to see two glowing objects descend. One landed on a flat rock and the other flew off. He sketched the landed craft for about half an hour, then walked up to it, heard what he took to be muffled voices and called out in several languages, ${a(CBC17, 'CBC reports')}.</p>
<p>He said a hatch closed, and when he touched the hull with a gloved hand the fingertips of the glove melted. As the craft turned, a blast of hot gas from a panel of holes set his shirt and cap on fire. He tore off the burning shirt and left it at the scene. That is his account, as summarized by ${a(LAC_PAGE, 'Library and Archives Canada')}.</p>
<p>At about 3:00 pm he flagged down an RCMP highway patrol constable. The constable&rsquo;s version, in the ${a(RCMP_MAY, 'RCMP report of 26 May 1967')}, is that Michalak said he had seen two space ships and been burned touching one, but refused to show his shirt or say where it happened. He took a bus to Winnipeg that evening, and his son took him to the Misericordia Hospital emergency department. He told the intern the burns came from aircraft exhaust because, he later told police, he expected no one would believe the truth.</p>`,
  evidence: `<p>Falcon Lake is unusual because the police file survives. Library and Archives Canada put two RCMP reports online, the ${a(RCMP_MAY, '26 May report')} and the ${a(RCMP_AUG, '10 August report')}, with Ottawa memos attached. The links here point to archived copies of those files.</p>
<ul>
<li><strong>The burns.</strong> On 23 May, two RCMP investigators saw a burn about a foot across on his abdomen, &ldquo;blotchy and with unburned areas inside the burned perimeter area.&rdquo; His family doctor found nothing wrong with him mentally, and enquiries at three psychiatric hospitals found no record.</li>
<li><strong>The clothing.</strong> His undershirt smelled of burned electrical wiring to both officers, and the front of his cap was melted. A Winnipeg clinic checked the undershirt, cap and burn and found no radioactive material.</li>
<li><strong>The site.</strong> A helicopter search on 25 May, guided by an area he marked on a map, and a search on foot with him on 1 June both failed to find it. On 25 June he returned with Gerald Hart, a man he said he had not met before, found the spot, and took away shirt remnants, a steel tape and soil, after the RCMP had asked him not to remove evidence.</li>
<li><strong>The radiation.</strong> Laboratory tests in Ottawa found that soil highly radioactive, and Health and Welfare sent radiation specialist Stuart Hunt. On 28 July, Hunt found radiation only in a crack in the rock across the centre of a 15-foot circle where the moss was missing. It was radium 226, and he judged the small quantity no danger to people passing through.</li>
</ul>
<p>The University of Colorado UFO study also sent an investigator. Its ${a(CONDON, 'Case 22 report')} records that a watchman in a nearby fire tower noticed nothing unusual that day.</p>`,
  explIntro: '<p>Has it been debunked? No official body has called it a hoax. National Defence lists it as unsolved, the RCMP closed its file without an explanation, and the Colorado study said it offered no probative information about unconventional craft. These are the explanations on the table.</p>',
  explanations: [
    { h: 'A craft nobody has identified', src: { url: CBC17, label: 'CBC, 50th anniversary report (cbc.ca, 2017)' },
      html: `<p>His son Stan says his father&rsquo;s story never changed, and researcher Chris Rutkowski calls it possibly Canada&rsquo;s best-documented UFO case. CBC notes the burns later formed raised sores in a grid-like pattern, and he had described a panel with a grid of holes on the craft.</p>
<p>The counter: there is one witness, the lookout saw nothing, and the Colorado investigator found &ldquo;many inconsistencies and incongruities.&rdquo;</p>` },
    { h: 'A secret military aircraft', src: { url: CBC17, label: 'CBC, 50th anniversary report (cbc.ca, 2017)' },
      html: `<p>This was Michalak&rsquo;s own belief. He called out to the &ldquo;Yankee boys&rdquo; and never claimed to have seen aliens, according to his son.</p>
<p>The counter: Stan Michalak, an aviation enthusiast, says nothing like it was in development anywhere in 1967, and no record ties any aircraft program to Falcon Lake.</p>` },
    { h: 'A story he made up', src: { url: IRON, label: 'The Iron Skeptic, Stefan Michalak&rsquo;s story (theironskeptic.com)' },
      html: `<p>The Iron Skeptic argues the burns prove only that he was burned, and that a prospector had reason to scare others away from his claims. The RCMP file lists the points it could not reconcile: the first constable thought he looked hung over, a motel bar operator said he drank about five beers the night before, which he denied, the site was found only with a stranger, evidence was removed after he was asked to leave it, and his compass bearing for the departing craft changed from 255 degrees to 020. His claim markers surrounded the landing site.</p>
<p>The counter: the ${a(RCMP_AUG, 'same RCMP report')} says his illness, weight loss, a change in his blood cell count, the burns and the circle on the rock could not be denied or explained away.</p>` },
    { h: 'Radioactive waste in the bush', src: { url: RCMP_AUG, label: 'Ottawa memorandum, 25 July 1967, in the RCMP file' },
      html: `<p>Radiation officials first wondered whether the Manitoba Cancer Clinic had once disposed of radioactive material in the area. That would explain the rock, though not the man&rsquo;s story. Hunt checked a known radioactive burial ground at East Braintree and found it undisturbed. A preliminary lab result suggested luminous paint containing radium 226, which an RCMP lab officer doubted. The RCMP file records no source.</p>` },
  ],
  open: `<ul>
<li>What burned him, and why the burns formed a grid.</li>
<li>Where the radium 226 in the rock crack came from.</li>
<li>Why the site took five weeks to find, and why it was found with a stranger.</li>
<li>What Hunt&rsquo;s September 1967 report and the National Defence letter add. The archives list both as related documents, and neither is summarized in the online files used here.</li>
</ul>
<p>Canada treats the case as part of its history. The Royal Canadian Mint issued a ${a(COIN, 'glow-in-the-dark Falcon Lake coin')} in 2018, limited to 4,000 pieces.</p>`,
  learn: `<p><strong>Show the police everything, the same day.</strong> Michalak refused to show the constable his shirt or name the place, and investigators spent weeks piecing together what he saw and where. The ${l('/intel/report-a-ufo-in-canada/', 'guide to reporting a sighting in Canada')} covers who to call.</p>
<p><strong>Do not walk up to it.</strong> Whatever was on that rock, the man who touched it spent weeks sick. The ${l('/intel/what-to-do-if-a-ufo-lands-nearby/', 'file on a landing nearby')} starts with distance.</p>
<p><strong>Leave the scene alone.</strong> The key evidence was picked up by the witness, a stranger and an amateur group before investigators saw it, so nobody can say where it had been. The ${l('/intel/ufo-evidence-checklist/', 'evidence checklist')} explains how to keep a chain of custody.</p>
<p><strong>Mark the spot while you are standing on it.</strong> At ${l('/cases/shag-harbour-ufo-1967/', 'Shag Harbour, five months later')}, witnesses agreed on where the light went down, and the search had a place to start. At Falcon Lake it took five weeks.</p>
<p>Marks left behind rarely settle a case. At ${l('/cases/westall-ufo-1966/', 'the Westall school sighting in Melbourne')}, a year earlier, students described a circle of flattened grass, but no photo of it has been found. In ${l('/cases/betty-and-barney-hill/', 'the Betty and Barney Hill case')}, the physical evidence is a dress whose damage is still argued over.</p>`,
  ledgerLine: 'Falcon Lake predates the modern UAP record. Its RCMP file shows how Canadian police handled a UFO report in 1967.',
  fieldNote: 'Michalak walked up to it and touched it. Know your job before you are that close.',
  related: ['what-to-do-if-a-ufo-lands-nearby', 'ufo-evidence-checklist', 'how-to-report-a-ufo-sighting', 'close-encounter-types-explained'],
  askH: 'He walked up and touched it.',
  askP: 'One man, alone in the bush, made every call himself. Ten questions tell you which job you would take in his place.',
  sources: [
    { title: 'RCMP report, Stefan Michalak, report of unidentified flying object, Falcon Beach, 26 May 1967 (Library and Archives Canada, archived copy)', url: RCMP_MAY, domain: 'bac-lac.gc.ca', pub: '26 May 1967' },
    { title: 'RCMP report, 10 August 1967, with Ottawa memoranda of 25 July 1967 (Library and Archives Canada, archived copy)', url: RCMP_AUG, domain: 'bac-lac.gc.ca', pub: '10 August 1967' },
    { title: 'Library and Archives Canada, Falcon Lake, Manitoba, May 20, 1967 (archived copy)', url: LAC_PAGE, domain: 'collectionscanada.gc.ca', pub: '2005, updated 2007' },
    { title: 'University of Colorado UFO study (Condon report), Case 22, text copy', url: CONDON, domain: 'files.ncas.org' },
    { title: 'Falcon Lake incident is Canada&rsquo;s &ldquo;best-documented UFO case,&rdquo; even 50 years later', url: CBC17, domain: 'cbc.ca', pub: '19 May 2017' },
    { title: 'Mint&rsquo;s newest coin showcases famous Falcon Lake UFO encounter in Manitoba', url: COIN, domain: 'cbc.ca', pub: '3 April 2018' },
    { title: 'The Iron Skeptic, Stefan Michalak&rsquo;s story: no aliens required', url: IRON, domain: 'theironskeptic.com' },
  ],
};
