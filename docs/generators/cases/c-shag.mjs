const LAC_PAGE = 'https://web.archive.org/web/20110519132147/http://www.collectionscanada.gc.ca/ufo/002029-1500.01-e.html';
const LAC_MEMO_PAGE = 'https://web.archive.org/web/20110519211459/http://www.collectionscanada.gc.ca/ufo/002029-1501-e.html';
const LAC_MEMO = 'https://web.archive.org/web/20110519211523/http://www.collectionscanada.gc.ca/obj/002029/f1/e002996951.mo-vx.jpg';
const LAC_LIST = 'https://recherche-research.bac-lac.gc.ca/eng/public/list/43130';
const CBC26 = 'https://www.cbc.ca/news/canada/nova-scotia/shag-harbour-ufo-incident-oct-4-1967-laurie-wickens-nova-scotia-9.7292815';
const CP17 = 'https://www.ctvnews.ca/atlantic/article/canadas-best-documented-ufo-sighting-still-intrigues-50-years-on/';
const BARRINGTON = 'https://www.barringtonmunicipality.com/Visiting-Us/shag-harbour-ufo-incident';
const SKEPTOID = 'https://skeptoid.com/episodes/565';
const LEDGER = 'https://web.archive.org/web/2001/http://www3.ns.sympatico.ca:80/dledger/Shag_Harbour_article.html';
const LEDGER_DOCS = 'https://web.archive.org/web/2001/http://www3.ns.sympatico.ca:80/dledger/DO-Docs.html';
const BOOK = 'https://openlibrary.org/books/OL3964979M';
const COIN = 'https://www.cbc.ca/news/canada/nova-scotia/shag-harbour-ufo-coin-royal-canadian-mint-1.5304445';
const SOCIETY = 'https://www.shagharbourincident.ca/shag-harbour-ufo-incident-1967/';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;

export default {
  slug: 'shag-harbour-ufo-1967', no: '006', year: '1967',
  crumb: 'Shag Harbour',
  title: 'The Shag Harbour UFO Incident of 1967',
  h1: 'The Shag Harbour UFO incident',
  desc: 'Canada still classes the 1967 Shag Harbour sighting as unsolved. What the RCMP and National Defence records say, and what the navy dive search found.',
  eventName: 'Shag Harbour UFO incident', dateISO: '1967-10-04',
  placeFull: 'Shag Harbour, Nova Scotia, Canada', country: 'Canada',
  lat: 43.50, lng: -65.71, coordsNote: 'Approximate: the village of Shag Harbour. The object was reported entering the water a short distance offshore.',
  cardTitle: 'The Shag Harbour incident', cardLine: 'An RCMP corporal, a light on the water, and a dive search that found nothing.',
  cardDate: 'Oct 1967', cardPlace: 'Nova Scotia, Canada', status: 'unexplained',
  lede: 'National Defence classed the Shag Harbour sighting of 4 October 1967 as unsolved. Witnesses, including an RCMP corporal, saw a lit object come down into the sea off Nova Scotia, and navy divers found nothing.',
  statusReason: 'National Defence classed it as unsolved. Rescue officials ruled out a missing aircraft and flares, and the dive search found no debris.',
  findingSource: LAC_PAGE,
  sheet: {
    date: '4 October 1967, at night. Reports put the first calls to the RCMP around 11:00 pm and the object on the water around 11:20 pm.',
    place: 'Off Shag Harbour, on the south-west coast of Nova Scotia. The National Defence memo is filed as &ldquo;Lower Woods Harbour, N.S.&rdquo;',
    witnesses: 'An RCMP corporal and six other witnesses, per the National Defence memo. Later accounts count about a dozen people at the shore, plus fishermen. RCMP Const. Ron O&rsquo;Brien has spoken publicly.',
    duration: 'Minutes in the air. A light stayed on the water before it disappeared. The sea search ran through the night, and the navy dive search lasted about three days.',
    evidence: 'Police and National Defence records, witness statements, and a trail of yellowish foam that search crews reported on the water. No debris was recovered.',
    finding: `National Defence memo: divers <q>failed to locate any tangible evidence.</q> <span class="src">(Library and Archives Canada)</span> The archives&rsquo; exhibition adds that National Defence <q>identified this sighting as unsolved.</q>`,
  },
  happened: `<p>On the night of 4 October 1967, people around Shag Harbour, a fishing village on Nova Scotia&rsquo;s south-west coast, saw a row of lights in the sky. They said the lights came down toward the water. Several people phoned the RCMP, including a 17-year-old who called from a phone booth after watching four lights descend, ${a(CBC26, 'CBC reports')}.</p>
<p>A National Defence summary memo, now held by ${a(LAC_MEMO, 'Library and Archives Canada')}, records what came next. An RCMP corporal and six other witnesses saw an object about 60 feet long heading east. It descended into the water with a &ldquo;bright splash,&rdquo; and a single white light stayed on the surface. RCMP Const. Ron O&rsquo;Brien, one of the officers who went down to the shore, later described a light about 800 metres out that drifted on the tide and disappeared before a boat could reach it.</p>
<p>An officer called the Rescue Coordination Centre in Halifax, which sent a coast guard cutter. Local fishing boats went out too. They found no wreck, but search crews reported a wide trail of bubbling yellowish foam, according to ${a(CBC26, 'CBC')} and ${a(CP17, 'Canadian Press')}. On 6 October a navy diving team arrived, and divers searched the seabed for about three days. They found nothing.</p>`,
  evidence: `<p>Shag Harbour stands out because government paperwork exists. Library and Archives Canada put the ${a(LAC_MEMO_PAGE, 'National Defence memo')} online in its UFO exhibition, with the archival reference RG 24, accession 83-84/167, box 7523, file DRBS 3800-10-1. That exhibition page now survives only as an ${a(LAC_PAGE, 'archived copy')}. In 2024 the archives published a ${a(LAC_LIST, 'research list of Shag Harbour records')}, including National Research Council files on non-meteor sightings from 1967.</p>
<p>A second memo, dated 6 October 1967 and written by Col. W.W. Turner at National Defence headquarters, says the rescue centre ${a(CBC26, '&ldquo;discounted the possibilities&rdquo;')} of an aircraft, flares, floats or any other known object. CBC reproduces it and credits the image to the public archives. No online government copy of that memo was found for this file.</p>
<p>The archives&rsquo; own exhibition text says there is &ldquo;no trace of the RCMP reports of this sighting in the files.&rdquo; Researchers Chris Styles and Don Ledger later located RCMP telexes and wrote the book ${a(BOOK, '<em>Dark Object</em>')} (2001). Canadian Press also reported that the pilots of a Pan Am flight saw a similar row of lights over the Gulf of Maine that night, a sighting Styles traced years later.</p>`,
  explIntro: '<p>Officials at the time looked for an ordinary cause first and did not find one. These are the explanations raised since.</p>',
  explanations: [
    { h: 'A plane crash', src: { url: CBC26, label: 'CBC, with the Turner memo (cbc.ca, 2026)' },
      html: `<p>This was everyone&rsquo;s first thought that night, including the RCMP&rsquo;s. It was ruled out quickly: no civilian or military aircraft was missing, and the rescue centre discounted an aircraft.</p>` },
    { h: 'A meteor or marine flares', src: { url: SKEPTOID, label: 'Brian Dunning, Skeptoid episode 565 (skeptoid.com, 2017)' },
      html: `<p>Brian Dunning argues that a bright meteor or flares could explain the lights. He reads the memo as saying only that no evidence of flares was found, not that flares were impossible.</p>
<p>The counter: the Turner memo says the rescue centre discounted flares. Don Ledger says the ${a(LEDGER_DOCS, 'meteor idea was dropped')} because of how long the object stayed up and its regular pattern of lights.</p>` },
    { h: 'A submarine or a secret aircraft', src: { url: CP17, label: 'Canadian Press, 50th anniversary report (ctvnews.ca, 2017)' },
      html: `<p>Later theories suggested a Soviet submarine or an experimental aircraft. Canadian Press notes that Soviet submarines were known to operate off the East Coast. No record connects either idea to Shag Harbour, and Skeptoid argues against the secret-aircraft version.</p>` },
    { h: 'An unknown craft that moved underwater', src: { url: BOOK, label: 'Don Ledger and Chris Styles, Dark Object (2001)' },
      html: `<p>Ledger and Styles claim, on the word of unnamed military and diver sources, that the object moved underwater to a site near Shelburne. It is the most dramatic part of the story, and it has no documentary support. Canadian Press says there is ${a(CP17, '&ldquo;no hard evidence&rdquo;')} for the sources&rsquo; claims.</p>` },
  ],
  open: `<ul>
<li>What caused the lights, the foam and the floating light.</li>
<li>Where the full RCMP, rescue centre and National Defence files are. The archives say the RCMP reports are not in its files. Researchers say they found telexes.</li>
<li>Whether divers recovered anything. The official record says no. Some local accounts, collected by Styles, say otherwise.</li>
<li>The exact time and the exact number of witnesses. Sources differ, from seven to more than thirty.</li>
</ul>
<p>Canada treats the story as part of its history. The Royal Canadian Mint issued a ${a(COIN, 'Shag Harbour coin')} in 2019, and a local society runs an ${a(SOCIETY, 'interpretive centre')} in the village.</p>`,
  learn: `<p><strong>Call it in, and say what you see.</strong> Shag Harbour has records because people phoned the police that night and officers wrote it down. A report made in the first hour is worth more than a story told for fifty years. The ${a('/intel/how-to-report-a-ufo-sighting/', 'reporting file')} shows how to do it well.</p>
<p><strong>Mark where it went.</strong> The search crews had a place to look because witnesses on shore agreed on where the light went down. Note landmarks, direction and distance while you can still see them.</p>
<p><strong>Report even if you think someone already has.</strong> The Pan Am pilots who saw lights that night never filed a report. A researcher found them years later. If something comes down near you, the ${a('/intel/what-to-do-if-a-ufo-lands-nearby/', 'landing file')} covers the first minutes.</p>
<p>Few UFO cases have government records like these. One of the few is <a href="/cases/falcon-lake-ufo-1967/">the Falcon Lake case in Manitoba, the same year</a>, where two RCMP reports survive. <a href="/cases/ariel-school-ufo-1994/">The Ariel School case</a> rests on children&rsquo;s testimony with no adult witness, and <a href="/cases/travis-walton-abduction/">the Travis Walton story</a> never received an official finding at all.</p>`,
  ledgerLine: 'Shag Harbour predates the modern UAP record, but it is the Canadian case with the most government paperwork behind it.',
  fieldNote: 'Shag Harbour has records because someone picked up a phone. Know your job before the lights come down.',
  related: ['how-to-report-a-ufo-sighting', 'what-to-do-if-a-ufo-lands-nearby', 'project-blue-book-explained', 'government-ufo-programs-history'],
  askH: 'The records exist because someone called.',
  askP: 'A teenager in a phone booth started the best-documented UFO file in Canada. Ten questions tell you which job you would take that night.',
  sources: [
    { title: 'National Defence memo, &ldquo;UFO Report, Lower Woods Harbour, N.S.&rdquo; (scan, Library and Archives Canada, archived copy)', url: LAC_MEMO, domain: 'collectionscanada.gc.ca' },
    { title: 'Library and Archives Canada, Department of National Defence memo page (archived copy)', url: LAC_MEMO_PAGE, domain: 'collectionscanada.gc.ca', pub: '2005, updated 2007' },
    { title: 'Library and Archives Canada, Shag Harbour, Nova Scotia, October 4, 1967 (archived copy)', url: LAC_PAGE, domain: 'collectionscanada.gc.ca', pub: '2005, updated 2007' },
    { title: 'Library and Archives Canada research list, 1967 Shag Harbour UFO sighting and related research', url: LAC_LIST, domain: 'bac-lac.gc.ca', pub: '26 September 2024' },
    { title: 'Shag Harbour UFO incident, with the Turner memo', url: CBC26, domain: 'cbc.ca', pub: '2 August 2026' },
    { title: 'Canada&rsquo;s best-documented UFO sighting still intrigues 50 years on (Canadian Press)', url: CP17, domain: 'ctvnews.ca', pub: '21 September 2017' },
    { title: 'Shag Harbour UFO incident, visitor page', url: BARRINGTON, domain: 'barringtonmunicipality.com' },
    { title: 'Don Ledger, Shag Harbour article (archived copy)', url: LEDGER, domain: 'sympatico.ca', pub: '1997' },
    { title: 'Don Ledger, Dark Object documents (archived copy)', url: LEDGER_DOCS, domain: 'sympatico.ca' },
    { title: 'Don Ledger and Chris Styles, Dark Object (Dell, 2001), catalogue record', url: BOOK, domain: 'openlibrary.org' },
    { title: 'Brian Dunning, Skeptoid episode 565', url: SKEPTOID, domain: 'skeptoid.com', pub: '4 April 2017' },
    { title: 'Royal Canadian Mint Shag Harbour coin', url: COIN, domain: 'cbc.ca', pub: '1 October 2019' },
    { title: 'Shag Harbour UFO Incident Society', url: SOCIETY, domain: 'shagharbourincident.ca' },
  ],
};
