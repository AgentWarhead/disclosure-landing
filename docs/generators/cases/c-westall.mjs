const ABC26 = 'https://www.abc.net.au/news/2026-04-06/westall-ufo-mystery-witnesses-want-answers/106126614';
const KINGSTON = 'https://localhistory.kingston.vic.gov.au/articles/528';
const SKEPTOID = 'https://skeptoid.com/episodes/208';
const AUSSKEP = 'https://www.skeptics.com.au/the-westall-ufo-of-1966/';
const CHALKER = 'http://theozfiles.blogspot.com/2014/08/westall-66-ufo-or-hibal-answer-is.html';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;
const l = (path, text) => `<a href="${path}">${text}</a>`;

export default {
  slug: 'westall-ufo-1966', no: '009', year: '1966',
  crumb: 'Westall',
  title: 'The Westall UFO Sighting of 1966, Melbourne',
  h1: 'The Westall UFO sighting',
  desc: 'The Westall UFO sighting, Melbourne, 1966: what hundreds of students reported, what the school told them, and the balloon and towed-target explanations.',
  ogDesc: 'Hundreds of students, a circle in the grass, a principal who told them to stay quiet, and no government record.',
  og: '/og/share/witness-silence.jpg', ogAlt: 'A witness at a window at night, holding an unsent message.',
  date: '2026-09-29', accessed: '2026-09-29',
  eventName: 'Westall UFO sighting', dateISO: '1966-04-06',
  placeFull: 'Westall, Clayton South, Melbourne, Victoria, Australia', country: 'Australia',
  lat: -37.94, lng: 145.13, coordsNote: 'Approximate: Westall, in Clayton South. The Grange paddock was about 400 m from the high school.',
  cardTitle: 'The Westall sighting', cardLine: 'Hundreds of students, a circle in the grass, and an order to stay quiet.',
  cardDate: 'Apr 1966', cardPlace: 'Melbourne, Australia', status: 'disputed',
  lede: 'The Westall UFO sighting took place on the morning of 6 April 1966, when students and teachers at two schools in Clayton South, Melbourne, reported a silver disc that flew low over the grounds and seemed to come down in a nearby paddock. No official finding exists. Skeptics favour a balloon or a towed target.',
  statusReason: 'No official finding exists. Balloons and a towed target have real support, and many witnesses reject both and still describe a craft.',
  findingSource: null,
  sheet: {
    date: 'Wednesday 6 April 1966, mid-morning, during physical education classes and the recess that followed. Shane Ryan puts it at about 10:15 am, and other accounts say about 11:00 am.',
    place: 'Westall High School and the neighbouring Westall State School in Clayton South, south-east Melbourne, and a paddock called The Grange about 400 m away.',
    witnesses: 'About fifty students and two teachers at first, then hundreds as recess began. Researcher Shane Ryan says he has spoken with 142 people who saw the object or objects and 197 who saw the ground marks.',
    duration: 'Minutes. Accounts describe the object crossing the oval, dropping behind pine trees at The Grange, then rising and leaving at speed.',
    evidence: 'Witness accounts, most recorded decades later, and 1966 press coverage. Students described a swirled circle of flattened grass. The TV film and any photos of the circle have not been found.',
    finding: 'None. <em>The Age</em> reported at the time that the object might have been a weather balloon released at Laverton. Witnesses ask why no government records have surfaced. <span class="src">(ABC News, 2026)</span>',
  },
  happened: `<p>On Wednesday 6 April 1966, the day before the school term ended, two physical education classes were on the oval at Westall High School in Clayton South when students saw a silver, bowl-shaped object fly low over the field. Some saw one or two more objects higher up. As recess began, word spread, and about 300 of the school&rsquo;s 485 students gathered on and around the oval, according to researcher Shane Ryan&rsquo;s account for the ${a(KINGSTON, 'City of Kingston local history site')}.</p>
<p>Witnesses say the object moved toward The Grange, a paddock about 400 m away, dropped behind a stand of pine trees and later left at speed. Several recall small aircraft circling it. Moorabbin Airport was about four kilometres away. Students who ran to The Grange described a swirled circle of flattened, yellowed grass. Science teacher Andrew Greenwood told a colleague he had seen a craft that moved at &ldquo;unimaginable speeds vertically,&rdquo; ${a(ABC26, 'ABC News reports')}.</p>
<p>That afternoon a Channel Nine crew interviewed students at the school gate until a police officer arrived and told the journalists to leave. Principal Frank Samblebe called an assembly, told students there was no such thing as flying saucers, and told them not to talk about it. Some former students say unidentified men later spoke to them separately, suggested a weather balloon, and told them to stay quiet.</p>`,
  evidence: `<ul>
<li><strong>The 1966 press.</strong> <em>The Age</em> reported that the Weather Bureau had released a balloon at Laverton at 8:30 am and that the westerly wind could have carried it to the area. <em>The Dandenong Journal</em> led with the story two weeks running and interviewed Greenwood and a student, Marilyn Eastwood, Ryan writes.</li>
<li><strong>The film and photos.</strong> Channel Nine searched its Melbourne and Sydney archives and could not find the original news story. The paper&rsquo;s photographer believes he photographed the circle, but no photos were published, per Ryan.</li>
<li><strong>The testimony.</strong> Ryan has interviewed witnesses since 2005. He counts 142 people who saw objects in the sky, 197 who saw the ground marks and 77 who saw both. Greenwood said in a recorded interview before his death that he was told he would be prosecuted and that he had to keep quiet. That is his claim, and no document supports or refutes it.</li>
<li><strong>The records.</strong> Witnesses told the ABC they want to know why no government records document the day. Researcher Keith Basterfield searched archives for balloon launches, and Bill Chalker notes that the memo covering the April 1966 launches is ${a(CHALKER, 'missing from the file')}.</li>
</ul>`,
  explIntro: '<p>Has Westall been debunked? No explanation has been proven, and none has been officially adopted. Any explanation also has to deal with memory: most accounts were recorded decades later, after years of retelling.</p>',
  explanations: [
    { h: 'A weather balloon from Laverton', src: { url: AUSSKEP, label: 'Richard Saunders, Australian Skeptics (skeptics.com.au, 2026)' },
      html: `<p>This was the suggestion in <em>The Age</em> at the time. Richard Saunders of Australian Skeptics argues the forecast westerly winds would have carried a balloon launched at 8:30 am toward Westall by mid-morning.</p>
<p>The counter: Ryan says the wind data point to a more northerly track, and there is no record of a balloon being recovered, per ${a(ABC26, 'the ABC')}. In May 2026 Australian Skeptics added that it had new information that could rule the weather balloon out, still being verified.</p>` },
    { h: 'A runaway HIBAL research balloon', src: { url: CHALKER, label: 'Bill Chalker on Keith Basterfield&rsquo;s research (theozfiles.blogspot.com, 2014)' },
      html: `<p>A US and Australian program launched large silver balloons from Mildura to sample the upper atmosphere for radioactivity. Basterfield proposed that one went astray and came down near Westall. Richard Saunders notes a stray balloon could explain why officials reportedly arrived so quickly.</p>
<p>The counter: John Sutcliffe, a HIBAL team member in 1966, told the ABC he is nearly 100 per cent sure no HIBAL balloon was involved. No document ties a launch to Westall.</p>` },
    { h: 'A target drogue towed by an aircraft', src: { url: SKEPTOID, label: 'Brian Dunning, Skeptoid episode 208 (skeptoid.com, 2010)' },
      html: `<p>Brian Dunning argues the second phase of the sighting, with aircraft around an object that moved side to side and seemed to change size, fits a nylon target drogue towed by one plane for others to chase. He cites a former RAAF navigator who wrote that a witness&rsquo;s description was a reasonably accurate match for one.</p>
<p>The counter: witnesses describe the object outpacing and evading the aircraft, which a towed target cannot do.</p>` },
    { h: 'A secret military project', src: { url: ABC26, label: 'ABC News, 60 years on (abc.net.au, 2026)' },
      html: `<p>Retired Lieutenant Colonel Neil Smith, a military historian, believes the objects were part of a secret research project, most likely run by the US, that went off track. Former student Ken Stallard also thinks it was military. They point to the quick arrival of uniformed men.</p>
<p>The counter: no record of such a project has been found. The ABC notes the Jindivik target drone and the U-2 were considered and set aside, since both looked like aircraft.</p>` },
  ],
  open: `<ul>
<li>What the object or objects were.</li>
<li>Who the men who spoke to students were, and whether any file on the day exists.</li>
<li>What made the circle at The Grange.</li>
<li>Where the Channel Nine film and any photographs of the circle went.</li>
</ul>
<p>The local council built a Flying Saucer Playground at The Grange, and witnesses gathered there to mark the 60th anniversary in April 2026, the ${a(ABC26, 'ABC reports')}. Richard Saunders of Australian Skeptics told the ABC he does not doubt something happened that day.</p>`,
  learn: `<p><strong>If you are the adult on duty, record first and reassure second.</strong> At Westall the school&rsquo;s answer was an assembly telling students not to talk. Separate the witnesses, get each account in their own words, and date it. The ${l('/intel/ufo-sighting-family-protocol/', 'family protocol')} covers children, and the ${l('/cases/ariel-school-ufo-1994/', 'Ariel School case file')} shows the same problem at another school, 28 years later.</p>
<p><strong>Silence costs the record.</strong> Students told to stay quiet did, some for fifty years, so most of the record was gathered decades later. The ${l('/intel/why-ufo-witnesses-stay-silent/', 'file on why witnesses stay silent')} explains why it happens and what it loses.</p>
<p><strong>Check the ordinary first.</strong> Balloons and towed targets both fly over suburbs. The ${l('/intel/airplane-satellite-balloon-ufo-misidentification/', 'misidentification file')} lists what to rule out while it is still in view.</p>
<p>The ground marks put Westall beside ${l('/cases/falcon-lake-ufo-1967/', 'the Falcon Lake case in Manitoba')}, a year later, where a radiation specialist found a 15-foot circle on the rock with the moss missing.</p>`,
  ledgerLine: 'Westall predates the modern UAP record, and no Australian government finding on it has been published.',
  fieldNote: 'At Westall the answer was an assembly and an order to stay quiet. Know your job before the bell rings.',
  related: ['why-ufo-witnesses-stay-silent', 'ufo-sighting-family-protocol', 'how-to-evaluate-ufo-memory', 'airplane-satellite-balloon-ufo-misidentification'],
  askH: 'Hundreds saw it. They were told to forget it.',
  askP: 'At Westall the adults were busy keeping order. Ten questions tell you which job you would take on that oval.',
  sources: [
    { title: 'After 60 years, witnesses to Australia&rsquo;s biggest UFO sighting at Westall High School say it&rsquo;s time for answers', url: ABC26, domain: 'abc.net.au', pub: '6 April 2026' },
    { title: 'Shane Ryan, An ongoing mystery: the Westall flying saucer incident', url: KINGSTON, domain: 'localhistory.kingston.vic.gov.au', pub: '11 June 2012' },
    { title: 'Bill Chalker, Westall &rsquo;66: UFO or HIBAL?', url: CHALKER, domain: 'theozfiles.blogspot.com', pub: '10 August 2014' },
    { title: 'Richard Saunders, The Westall UFO of 1966', url: AUSSKEP, domain: 'skeptics.com.au', pub: '21 April 2026' },
    { title: 'Brian Dunning, Skeptoid episode 208: The Westall &rsquo;66 UFO', url: SKEPTOID, domain: 'skeptoid.com', pub: '1 June 2010' },
  ],
};
