const MARKER = 'https://www.hmdb.org/m.asp?m=74571';
const NHPR = 'https://www.nhpr.org/nh-news/2014-03-28/marking-history-the-betty-and-barney-hill-incident-in-lincoln';
const NICAP = 'https://www.nicap.org/reports/0450-74.htm';
const UNH = 'https://library.unh.edu/find/archives/collections/using-materials/using-betty-barney-hill-collection';
const AP04 = 'https://archive.seattletimes.com/archive/20041019/alienobit19/betty-hill-85-gained-fame-with-alien-abduction-tale';
const LITHUB = 'https://lithub.com/the-moment-the-myth-of-alien-abduction-was-born/';
const SKEPTOID = 'https://skeptoid.com/episodes/124';
const SHEAFFER = 'https://badufos.blogspot.com/2015/12/dr-simon-reveals-his-real-thoughts-on.html';
const MACDONALD = 'https://nielsenhayden.com/makinglight/archives/009378.html';
const ARMAGH = 'https://armaghplanet.com/betty-hills-ufo-star-map-the-truth.html';
const HOLMAN = 'https://airminded.org/2008/11/05/goodbye-zeta-reticuli/';
const DRESS = 'https://www.theblackvault.com/casefiles/analysis-dress-worn-betty-hill-september-19-1961-abduction-new-hampshire/';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;
const l = (path, text) => `<a href="${path}">${text}</a>`;

export default {
  slug: 'betty-and-barney-hill', no: '008', year: '1961',
  crumb: 'Betty and Barney Hill',
  title: 'Betty and Barney Hill: The 1961 Abduction Case',
  h1: 'The Betty and Barney Hill abduction',
  desc: 'Betty and Barney Hill, New Hampshire, 1961: the Air Force report, the hypnosis sessions, the Zeta Reticuli star map, and what their psychiatrist concluded.',
  ogDesc: 'A light over a mountain road, two lost hours, and the first abduction story most people ever heard. What the record holds.',
  og: '/og/share/ufo-follows-car.jpg', ogAlt: 'A mountain road at night seen from the driver&rsquo;s seat.',
  date: '2026-09-29', accessed: '2026-09-29',
  eventName: 'Betty and Barney Hill incident', dateISO: '1961-09-19',
  placeFull: 'US Route 3 near Lincoln, New Hampshire, United States', country: 'United States',
  lat: 44.085, lng: -71.684, coordsNote: 'The state historical marker on Route 3 in Lincoln, near Indian Head. The drive covered many miles of the White Mountains.',
  cardTitle: 'Betty and Barney Hill', cardLine: 'A light over a mountain road, two lost hours, and the first abduction story.',
  cardDate: 'Sep 1961', cardPlace: 'New Hampshire, USA', status: 'disputed',
  lede: 'Betty and Barney Hill were a New Hampshire couple who said that on the night of 19 to 20 September 1961, beings stopped their car on a mountain road and examined them aboard a craft. The abduction story emerged under hypnosis in 1964. The Air Force filed the sighting as insufficient data, and their psychiatrist did not accept the abduction.',
  statusReason: 'The Air Force never identified the light. The psychiatrist who hypnotized the Hills believed the abduction came from Betty&rsquo;s dreams, and a researcher has matched the light to a mountain beacon.',
  findingSource: NICAP,
  sheet: {
    date: 'Night of 19 to 20 September 1961. The Hills reached home in Portsmouth around 5:00 am, later than the drive should have taken.',
    place: 'US Route 3 in the White Mountains of New Hampshire, near Indian Head and Lincoln, on the drive home from Canada.',
    witnesses: 'Two: Betty Hill, a social worker for the state, and Barney Hill, who worked nights at a Boston post office.',
    duration: 'The light was watched over part of the drive. The state marker speaks of two hours of lost time. The abduction account came out in hypnosis sessions in 1964.',
    evidence: 'An Air Force report filed the next day, Betty&rsquo;s written dreams, recorded hypnosis sessions, a star map Betty drew, and the dress she wore that night.',
    finding: 'Project Blue Book first logged the sighting as an optical condition, then as an inversion, and finally as <q>insufficient data.</q> <span class="src">(Blue Book record card, as transcribed by NICAP)</span> No government body has ever ruled on the abduction.',
  },
  happened: `<p>In September 1961, Betty and Barney Hill of Portsmouth, New Hampshire, were driving home from a trip to Canada. Betty was a social worker for the state, and Barney worked the night shift at a Boston post office, according to historian ${a(LITHUB, 'David Halperin')}. Late on 19 September, on Route 3 in the White Mountains, they noticed a strange light moving in the sky. Near Indian Head they stopped the car to watch it. Barney looked through binoculars and later described a craft with a row of windows and figures looking out, ${a(SKEPTOID, 'Skeptoid notes')}.</p>
<p>They reached home around dawn, hours later than expected. The ${a(MARKER, 'state historical marker')} on Route 3 says they had a close encounter and two hours of &ldquo;lost&rdquo; time, and that they reported a brightly lit, cigar-shaped craft to the Air Force&rsquo;s Project Blue Book the next day.</p>
<p>About two weeks later, Betty began having nightmares in which the couple were stopped at a roadblock and taken aboard a craft. In December 1963 the Hills went to Boston psychiatrist Benjamin Simon for anxiety, and from February 1964 he treated them with hypnosis. Under hypnosis both described being taken aboard and examined, the ${a(AP04, 'Associated Press')} later reported. The story became public when the <em>Boston Traveler</em> printed it in 1965, and John G. Fuller&rsquo;s book <em>The Interrupted Journey</em> followed in 1966.</p>`,
  evidence: `<ul>
<li><strong>The Air Force record.</strong> The Blue Book record card for 20 September 1961 at Lincoln notes that <q>the Planet Jupiter was in the South West, at about 20 degrees elevation,</q> per a ${a(NICAP, 'NICAP transcription')}. Its conclusion moved from optical condition to inversion to insufficient data.</li>
<li><strong>Betty&rsquo;s dreams.</strong> For two years before hypnosis, Betty wrote and rewrote accounts of her dreams. Brian Dunning of ${a(SKEPTOID, 'Skeptoid')} argues that the medical examination details first appear there.</li>
<li><strong>The hypnosis sessions.</strong> Barney&rsquo;s first session was on 22 February 1964, per Halperin. In his sessions he gave the first description of grey-skinned beings with large bald heads and huge black eyes. An episode of <em>The Outer Limits</em>, &ldquo;The Bellero Shield,&rdquo; featuring a similar alien, had aired twelve days before that first session. The Hills denied having seen it, Dunning reports.</li>
<li><strong>The star map.</strong> Betty drew from memory a map she said she was shown on the craft. She wrote that she did not know whether eight background stars existed or whether she had added them, per the ${a(ARMAGH, 'Armagh Observatory and Planetarium')}. Teacher Marjorie Fish matched it to stars near Zeta Reticuli. Later satellite data put six of Fish&rsquo;s fifteen stars too far away to fit, ${a(HOLMAN, 'Brett Holman showed')}, and Fish herself later judged the match unlikely. The ${l('/intel/zeta-reticuli-grey-aliens/', 'Zeta Reticuli file')} covers what grew from that map.</li>
<li><strong>The dress.</strong> Betty&rsquo;s dress is in the ${a(UNH, 'Betty and Barney Hill Papers')} at the University of New Hampshire, with her journals and the star map correspondence. An analysis published by ${a(DRESS, 'The Black Vault')} reports a coating of mostly protein from an external source. Dunning says the damage fits forty years of moths, mites and mold.</li>
</ul>`,
  explIntro: '<p>The sighting and the abduction are separate claims. The light has ordinary candidates. The abduction rests on dreams and hypnosis, and each explanation below treats the two differently.</p>',
  explanations: [
    { h: 'An abduction by non-human beings', src: { url: MARKER, label: 'New Hampshire historical marker 224 (hmdb.org)' },
      html: `<p>This is the Hills&rsquo; account. The state of New Hampshire marked the site in 2011 and calls it the first widely reported UFO abduction report in the United States. A supporter who led the marker effort told ${a(NHPR, 'NHPR')} he is a believer.</p>
<p>The counter: nothing in the record from 1961 describes an abduction. It first appears in Betty&rsquo;s dreams and then under hypnosis more than two years later.</p>` },
    { h: 'A sighting, then a dream retold under hypnosis', src: { url: SHEAFFER, label: 'Robert Sheaffer, Dr. Simon&rsquo;s letters to Philip Klass (badufos.blogspot.com, 2015)' },
      html: `<p>This was the view of Benjamin Simon, the psychiatrist who hypnotized them. In letters to the skeptic Philip Klass in the 1970s, published by Robert Sheaffer, Simon wrote that he believed the Hills had a sighting, and that the abduction was a reproduction of Betty&rsquo;s dream.</p>
<p>The counter: Simon&rsquo;s view leaves the light itself unexplained, and it was given privately, years after the sessions.</p>` },
    { h: 'A beacon on Cannon Mountain', src: { url: MACDONALD, label: 'Jim Macdonald, Making Light (nielsenhayden.com, 2007)' },
      html: `<p>Jim Macdonald drove Route 3 at night and argues that the light was the aircraft warning beacon on the lookout tower on Cannon Mountain. He says its position, apparent motion and disappearance behind the mountain match the Hills&rsquo; description, and he puts the lost time down to fatigue after a long drive.</p>
<p>The counter: a fixed light does not account for the windows and figures Barney said he saw through binoculars.</p>` },
    { h: 'Culture in the room', src: { url: SKEPTOID, label: 'Brian Dunning, Skeptoid episode 124 (skeptoid.com, 2008)' },
      html: `<p>Dunning points to the timing of &ldquo;The Bellero Shield&rdquo; and to Betty&rsquo;s long interest in UFOs, including a sighting her sister reported in 1957. He argues the beings took shape from what the couple had already seen and heard.</p>
<p>The counter: the Hills denied seeing the episode, and no one has shown that they did.</p>` },
  ],
  open: `<ul>
<li>What the light over Route 3 was.</li>
<li>Whether hypnosis recovered memories of the drive or built them from the dreams.</li>
<li>What the coating on the dress is. The two readings of the same fabric have not been reconciled.</li>
<li>Whether Blue Book held more than the record card. Its final word was insufficient data.</li>
</ul>
<p>Barney Hill died in 1969 and Betty Hill in 2004, the ${a(AP04, 'AP obituary')} records. In later years Betty criticized how commercial and sensational UFO stories had become.</p>`,
  learn: `<p><strong>Write it down that night, before you sleep.</strong> The Hills&rsquo; account grew over two years of dreams, retelling and hypnosis, and no one can now separate the drive from what came after. A dated note made the same night would have settled a lot. The ${l('/intel/how-to-evaluate-ufo-memory/', 'memory file')} explains why the first version matters most.</p>
<p><strong>Be careful with anything recovered later.</strong> The Hills&rsquo; own psychiatrist did not treat what hypnosis produced as a record of events. If you have a gap in your night, the ${l('/intel/missing-time-after-ufo-sighting/', 'missing time file')} covers the ordinary causes to rule out first, and the ${l('/intel/sleep-paralysis-vs-alien-abduction/', 'sleep paralysis file')} covers night experiences that feel real.</p>
<p><strong>If a light follows your car, stop somewhere safe and note the mile marker.</strong> A fixed beacon can seem to chase a moving car on a mountain road. The ${l('/intel/what-to-do-if-a-ufo-follows-your-car/', 'car file')} walks through the first minutes.</p>
<p>The Hill case came fourteen years before ${l('/cases/travis-walton-abduction/', 'the Travis Walton case')}, which also turns on missing time. ${l('/cases/falcon-lake-ufo-1967/', 'The Falcon Lake case in Manitoba')}, from 1967, is a different kind of close encounter: one witness, and burns that RCMP investigators saw for themselves.</p>`,
  ledgerLine: 'The Hill case predates the modern UAP record. Its official trace is an Air Force Blue Book file closed as insufficient data.',
  fieldNote: 'The Hills kept no notes that night. Know your job before the light is keeping pace with your car.',
  related: ['missing-time-after-ufo-sighting', 'sleep-paralysis-vs-alien-abduction', 'zeta-reticuli-grey-aliens', 'what-to-do-if-a-ufo-follows-your-car'],
  askH: 'Two hours nobody wrote down.',
  askP: 'Everything after that night was built from memory. Ten questions tell you which job you would take in the car.',
  sources: [
    { title: 'Project Blue Book record card and radar reports for the Hill sighting, NICAP transcription', url: NICAP, domain: 'nicap.org' },
    { title: 'Betty and Barney Hill Incident, New Hampshire historical marker 224', url: MARKER, domain: 'hmdb.org', pub: 'erected 2011' },
    { title: 'Using the Betty and Barney Hill Collection, Milne Special Collections', url: UNH, domain: 'library.unh.edu' },
    { title: 'Marking History: The Betty and Barney Hill Incident in Lincoln', url: NHPR, domain: 'nhpr.org', pub: '28 March 2014' },
    { title: 'Betty Hill, 85, gained fame with alien-abduction tale (Associated Press)', url: AP04, domain: 'seattletimes.com', pub: '19 October 2004' },
    { title: 'David Halperin, The moment the myth of alien abduction was born (excerpt from Intimate Alien)', url: LITHUB, domain: 'lithub.com', pub: '26 March 2020' },
    { title: 'Brian Dunning, Skeptoid episode 124', url: SKEPTOID, domain: 'skeptoid.com', pub: '21 October 2008' },
    { title: 'Robert Sheaffer, Dr. Simon reveals his real thoughts on the Hill case', url: SHEAFFER, domain: 'badufos.blogspot.com', pub: '23 December 2015' },
    { title: 'Jim Macdonald, Alien abduction: Betty and Barney Hill', url: MACDONALD, domain: 'nielsenhayden.com', pub: '19 September 2007' },
    { title: 'Colin Johnston, The truth about Betty Hill&rsquo;s UFO star map', url: ARMAGH, domain: 'armaghplanet.com', pub: '19 August 2011' },
    { title: 'Brett Holman, Goodbye, Zeta Reticuli', url: HOLMAN, domain: 'airminded.org', pub: '5 November 2008' },
    { title: 'Analysis of the dress worn by Betty Hill', url: DRESS, domain: 'theblackvault.com', pub: '1 November 2016, updated 10 June 2020' },
  ],
};
