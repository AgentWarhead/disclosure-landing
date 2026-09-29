const HIND = 'http://ufoevidence.org/Cases/case127.htm';
const MG = 'https://mg.co.za/article/2014-09-04-remembering-zimbabwes-great-alien-invasion/';
const SKEPTOID = 'https://skeptoid.com/episodes/4760';
const BBC = 'https://www.bbc.co.uk/news/av/stories-57749238';
const CALLI = 'http://johnemackinstitute.org/1995/03/exploring-african-and-other-alien-encounters/';
const WITNESS08 = 'http://www.johnemackinstitute.org/images/2008_0416_TheWitness_Ariel_School.pdf';
const WHYY = 'https://whyy.org/segments/documentary-explores-the-ufo-sighting-that-changed-the-course-of-62-childrens-lives/';
const REID = 'https://revue.comitepara.be/wp-content/uploads/2024/10/Scepticisme_Scientifique_12_2024_SI.pdf';
const SATOBS = 'http://www.satobs.org/reentry/Visually_Observed_Natural_Re-entries_latest_draft.pdf';
const DEBRIEF = 'https://thedebrief.org/ariel-phenomenon-documentary-a-journey-worth-taking/';
const VICE = 'https://www.vice.com/en/article/encounters-netflix-zimbabwe-ufo-sighting/';
const HALPERIN = 'https://www.davidhalperin.net/the-phenomenon-reflections-on-james-foxs-new-ufo-documentary-part-3-ufo-encounter-at-ariel-school/';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;

export default {
  slug: 'ariel-school-ufo-1994', no: '004', year: '1994',
  crumb: 'Ariel School',
  title: 'The Ariel School UFO Incident of 1994',
  h1: 'The Ariel School UFO incident',
  desc: 'About 60 children at a Zimbabwe school reported a craft in 1994 and no adult saw it. Who interviewed them, what they say now, and what skeptics argue.',
  og: '/og/share/close-encounter-types.jpg', ogAlt: "Four framed images: a bright light over a field, a scorched mark on the ground, a silhouette and a cracked clock.",
  eventName: 'Ariel School sighting', dateISO: '1994-09-16',
  placeFull: 'Ariel School, Ruwa, Zimbabwe', country: 'Zimbabwe',
  lat: -17.89, lng: 31.24, coordsNote: 'Approximate: the town of Ruwa, about 20 km from Harare.',
  cardTitle: 'The Ariel School incident', cardLine: 'About sixty children, one field, and no adult who saw it.',
  cardDate: 'Sep 1994', cardPlace: 'Ruwa, Zimbabwe', status: 'disputed',
  lede: 'About sixty children at Ariel School in Zimbabwe reported a craft and a small figure on 16 September 1994. No adult saw it, no trace was found, and skeptics point to suggestion, though many of the children still stand by what they reported.',
  statusReason: 'Many former pupils stand by their accounts. Skeptics argue suggestion shaped them, and no physical trace or adult witness exists.',
  findingSource: null,
  sheet: {
    date: '16 September 1994, during the mid-morning break, about 10:00 to 10:15 am.',
    place: 'Ariel School, a private primary school in Ruwa, about 20 km from Harare, Zimbabwe. The children pointed to rough bush about 100 m beyond the playing field.',
    witnesses: 'About 60 children, 62 in most accounts, aged roughly 6 to 12. No adult saw it: the teachers were in a staff meeting.',
    duration: 'Accounts vary. A 1995 summary by Mack&rsquo;s research associate gives about 15 minutes.',
    evidence: 'Children&rsquo;s accounts recorded days to weeks later, drawings collected by the headmaster, filmed interviews. An instrument check of the site found nothing.',
    finding: 'None. No government, police or military investigation or finding was found. The only investigators were a UFO researcher, a journalist and a psychiatrist.',
  },
  happened: `<p>On Friday 16 September 1994, children at Ariel School were outside for their morning break. Some reported silver objects in the sky. They said one came down in rough, out-of-bounds bush beyond the playing field, and that a small figure in a tight black suit with very large eyes appeared near it. Then the object left. The teachers were in a staff meeting, so no adult saw what the children described. That summary comes from investigator ${a(HIND, 'Cynthia Hind&rsquo;s 1994 report')}.</p>
<p>About 250 pupils were on the playground, and most reported seeing nothing, as ${a(SKEPTOID, 'Skeptoid notes')}. The number who did report something is usually given as 62. Some sources, including the ${a(BBC, 'BBC')}, say about 60.</p>
<p>Two nights earlier, on 14 September, a Soviet rocket stage re-entered the atmosphere over southern Africa. It was seen as a fireball from Botswana to Zimbabwe, including over Harare, according to a ${a(SATOBS, 're-entry catalogue')} that cites Hind&rsquo;s own case files. Locally, it was first described as a meteor shower.</p>`,
  evidence: `<p>Everything in this case is testimony from children, gathered by adults over the following weeks. The order matters.</p>
<ul>
<li><strong>Within days.</strong> BBC correspondent Tim Leach filmed interviews at the school. In archival tape used in a later documentary, he says, ${a(WHYY, '&ldquo;I could handle war zones, but I could not handle this UFO thing.&rdquo;')}</li>
<li><strong>20 September.</strong> Cynthia Hind, a UFO researcher, interviewed about 10 to 12 older children. A technician checked the site with instruments and ${a(HIND, 'found no reading')}. At her suggestion the headmaster had the children draw what they saw, and she kept copies of the clearest drawings.</li>
<li><strong>November.</strong> Harvard psychiatrist John Mack and research associate Dominique Callimanopulos interviewed children one at a time. ${a(CALLI, 'Callimanopulos wrote')} that they spoke with 12 over two days. Mack told parents he believed the children were describing a physical event.</li>
<li><strong>2008 to 2022.</strong> Filmmaker Randall Nickerson tracked down former pupils for the documentary <em>Ariel Phenomenon</em> (2022). He ${a(WITNESS08, 'said in 2008')} that their stories had not changed, and ${a(DEBRIEF, 'told The Debrief')} he found no one at Ariel who said it did not happen.</li>
</ul>
<p>Some children later said the beings conveyed a message that people were harming the Earth. That theme appears in Mack&rsquo;s interviews and not in Hind&rsquo;s September record, ${a(SKEPTOID, 'Skeptoid')} and a ${a(REID, '2024 skeptical review')} both point out.</p>`,
  explIntro: '<p>These witnesses were children, and every explanation below should be read with that in mind. None of them requires anyone to have lied.</p>',
  explanations: [
    { h: 'Something physical that the children saw', src: { url: WHYY, label: 'WHYY on the documentary Ariel Phenomenon (whyy.org, 2023)' },
      html: `<p>Mack believed the children described a real event, and the headmaster told him he believed they saw something, though he could not say what. Former pupils interviewed as adults have largely stood by their accounts, and supporters point to the similar drawings.</p>
<p>The counter: no adult witness and no physical trace. Reviewers who read the full set of accounts document wide variation in the details.</p>` },
    { h: 'Suggestion and group dynamics', src: { url: SKEPTOID, label: 'Brian Dunning, Skeptoid episode 4760 (skeptoid.com, 2020)' },
      html: `<p>Skeptics argue that a story passed between excited children in a group, then was shaped by adults who asked the questions. Hind interviewed children together, Mack arrived two months later, and the children retold the story to media many times. Brian Dunning calls this the explanation with the most academic support.</p>
<p>The counter: Mack&rsquo;s team interviewed the children separately, and the adults&rsquo; accounts decades later stayed close to their early ones, per ${a(WHYY, 'WHYY')}.</p>` },
    { h: 'A country primed by a fireball', src: { url: SATOBS, label: 'Visually observed re-entries catalogue (satobs.org)' },
      html: `<p>The rocket re-entry two nights earlier had people across Zimbabwe talking about lights in the sky. Skeptics argue that this primed the children to read something ordinary as a craft.</p>
<p>The counter: Hind knew of the rocket explanation at the time and rejected it, per ${a(WITNESS08, 'a 2008 report')}.</p>` },
    { h: 'A prank', src: { url: VICE, label: 'Vice on the Netflix series Encounters (vice.com, 2023)' },
      html: `<p>In the 2023 Netflix series <em>Encounters</em>, one former pupil said he had made the story up. Vice reports that his claim could not be independently verified, and classmates in the same episode disputed it.</p>
<p>A 2024 review by ${a(REID, 'Gideon Reid')} offers another ordinary idea: costumed performers from a touring education show. He says it is unproven.</p>` },
  ],
  open: `<ul>
<li>What, if anything, the children saw. There is no adult witness and no physical trace.</li>
<li>Whether the message about the environment came from the children or from how they were asked. Mack&rsquo;s full recordings have not been released.</li>
<li>How consistent the accounts are. Supporters stress how alike the drawings are. Skeptical reviewers document many differences.</li>
<li>No official body has ever looked at the case, so there is no finding to weigh.</li>
</ul>
<p>Historian of religion David Halperin ${a(HALPERIN, 'puts one view')} this way: the experience was real to the children, even if what they experienced is uncertain. Both sides can agree on the first half.</p>`,
  learn: `<p><strong>If a child tells you they saw something, write down their words first.</strong> Ask what happened, then stop talking. Do not suggest shapes, colours or meanings. Every question an adult asked at Ariel is now part of the argument. The ${a('/intel/ufo-sighting-family-protocol/', 'family protocol')} covers what to do with children present.</p>
<p><strong>Separate the witnesses before they compare notes.</strong> A group that talks first remembers together. Get each account alone, and date it.</p>
<p><strong>Retelling changes a memory.</strong> It happens to children and adults alike. The ${a('/intel/how-to-evaluate-ufo-memory/', 'memory file')} explains how to keep your first version intact.</p>
<p>The closest parallel is <a href="/cases/westall-ufo-1966/">the Westall school sighting in Melbourne</a>, where students reported a craft in 1966 and were told not to talk about it. Like <a href="/cases/travis-walton-abduction/">the Travis Walton case</a>, Ariel rests on witnesses who have stood by their accounts for decades with no physical evidence. <a href="/cases/shag-harbour-ufo-1967/">The Shag Harbour incident</a> is the other kind of file, with Canadian government records behind it.</p>`,
  ledgerLine: 'This case has no official finding. The ledger tracks what government bodies have actually said about UAP.',
  fieldNote: 'At Ariel every adult question became part of the record. Know your job before a child asks you what they saw.',
  related: ['ufo-sighting-family-protocol', 'how-to-evaluate-ufo-memory', 'close-encounter-types-explained', 'experiencer-support-after-ufo-encounter'],
  askH: 'Someone has to stay calm for the kids.',
  askP: 'At Ariel no adult was on the field. Ten questions tell you which job you would take if you were the one who was.',
  sources: [
    { title: 'Cynthia Hind, &ldquo;The Children of Ariel School,&rdquo; UFO Afrinews, reprinted', url: HIND, domain: 'ufoevidence.org', pub: 'original 1994' },
    { title: 'Dominique Callimanopulos, Exploring African and other alien encounters', url: CALLI, domain: 'johnemackinstitute.org', pub: '1995' },
    { title: 'The Witness (Pietermaritzburg) on the Ariel School follow-up, scan', url: WITNESS08, domain: 'johnemackinstitute.org', pub: '16 April 2008' },
    { title: 'BBC Witness History: the Ariel School sighting', url: BBC, domain: 'bbc.co.uk', pub: '10 July 2021' },
    { title: 'Remembering Zimbabwe&rsquo;s great alien invasion', url: MG, domain: 'mg.co.za', pub: '4 September 2014' },
    { title: 'Documentary explores the UFO sighting that changed the course of 62 children&rsquo;s lives', url: WHYY, domain: 'whyy.org', pub: '23 October 2023' },
    { title: 'Ariel Phenomenon documentary review', url: DEBRIEF, domain: 'thedebrief.org', pub: '20 May 2022' },
    { title: 'Netflix Encounters and the Zimbabwe UFO sighting', url: VICE, domain: 'vice.com', pub: '6 October 2023' },
    { title: 'Brian Dunning, Skeptoid episode 4760', url: SKEPTOID, domain: 'skeptoid.com', pub: '29 December 2020' },
    { title: 'Gideon Reid, Scepticisme Scientifique vol. 2', url: REID, domain: 'revue.comitepara.be', pub: '2024' },
    { title: 'Ted Molczan, visually observed natural re-entries (catalogue)', url: SATOBS, domain: 'satobs.org', pub: 'compiled 2025' },
    { title: 'David Halperin on the Ariel School encounter', url: HALPERIN, domain: 'davidhalperin.net', pub: '13 November 2020' },
  ],
};
