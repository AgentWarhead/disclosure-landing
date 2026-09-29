const CALL = 'https://bidenwhitehouse.archives.gov/briefing-room/press-briefings/2024/12/14/background-press-call-on-the-ongoing-response-to-reported-drone-sightings/';
const JOINT = 'https://www.faa.gov/newsroom/dhs-fbi-faa-dod-joint-statement-ongoing-response-reported-drone-sightings';
const JOINT_FBI = 'https://www.fbi.gov/news/press-releases/dhs-fbi-faa-and-dod-joint-statement-on-ongoing-response-to-reported-drone-sightings';
const DEC12 = 'https://www.fbi.gov/news/press-releases/joint-dhs-fbi-statement-on-reports-of-drones-in-new-jersey';
const JOINTSTAFF = 'https://www.war.gov/News/News-Stories/Article/Article/4002374/joint-staff-addresses-drones-over-new-jersey-military-installations/';
const SINGH = 'https://www.war.gov/News/Transcripts/Transcript/Article/3998124/deputy-pentagon-press-secretary-sabrina-singh-holds-a-press-briefing/';
const FAA = 'https://www.faa.gov/newsroom/statements/general-statements';
const KIRBY = 'https://bidenwhitehouse.archives.gov/briefing-room/speeches-remarks/2024/12/16/on-the-record-press-gaggle-by-white-house-national-security-communications-advisor-john-kirby-37/';
const LEAVITT = 'https://rollcall.com/factbase/trump/transcript/donald-trump-press-conference-briefing-karoline-leavitt-january-28-2025/';
const NBC = 'https://www.nbcnews.com/news/us-news/white-house-says-new-jersey-drones-authorized-faa-was-not-enemy-rcna189646';
const DHS_PAGE = 'https://www.dhs.gov/publication/unidentified-aerial-phenomena-uap-sightings-nj';
const DHS_PDF = 'https://www.dhs.gov/sites/default/files/2025-05/25_0428_2025-HQFO-01883%20Final%20Records_0.pdf';
const HEARING = 'https://homeland.house.gov/2024/12/12/unexplained-sighting-doj-fbi-cbp-witnesses-testify-on-ongoing-threats-posed-by-drones-discuss-current-counter-drone-authorities/';
const NJGOV = 'https://www.nj.gov/governor/news/news/562024/approved/20241223a.shtml';
const CNN = 'https://www.cnn.com/2024/12/12/us/new-jersey-drone-sightings/index.html';
const SCOOP = 'https://defensescoop.com/2024/12/16/new-jersey-drones-federal-assessments-suggest-not-uap-or-us-military-assets/';
const RYDER = 'https://www.war.gov/News/Transcripts/Transcript/Article/4005839/pentagon-press-secretary-maj-gen-pat-ryder-holds-an-off-camera-on-the-record-pr/';
const TWZ = 'https://www.twz.com/news-features/no-suspects-in-fbis-new-jersey-drone-scare-investigation-dozens-of-airspace-closures-just-expired';
const FEDREG = 'https://www.federalregister.gov/documents/2026/07/06/2026-13609/counter-uas-authority-for-state-local-tribal-and-territorial-law-enforcement-and-correctional';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;

export default {
  slug: 'new-jersey-drones-2024', no: '003', year: '2024',
  crumb: 'The New Jersey drones',
  title: 'New Jersey Drones 2024: What They Were',
  h1: 'What were the New Jersey drones?',
  desc: 'What were the New Jersey drones of 2024? The FBI, DHS, FAA and Pentagon statements, the White House answer in January 2025, and the questions nobody closed.',
  ogDesc: 'Thousands of reports, 22 flight bans, one White House answer, and two military bases with drones nobody traced.',
  eventName: 'New Jersey drone sightings', dateISO: '2024-11-18',
  placeFull: 'New Jersey, United States, mainly Morris and Somerset counties', country: 'United States',
  lat: 40.86, lng: -74.54, coordsNote: 'Approximate centre of Morris County, where the FAA says the first reports came from.',
  cardTitle: 'The New Jersey drones', cardLine: 'Thousands of reports, a joint federal statement and a White House answer.',
  cardDate: 'Nov to Dec 2024', cardPlace: 'New Jersey, US', status: 'explained',
  lede: 'Federal agencies traced the New Jersey drone reports of late 2024 to lawful drones, manned aircraft and even stars, and found nothing anomalous. In January 2025 the White House said the drones had been authorized by the FAA for research. Drones confirmed over two military bases were never publicly traced to an operator.',
  statusReason: 'Federal agencies matched the reports to drones, aircraft and stars. The operators of drones confirmed over two bases were never publicly named.',
  findingSource: JOINT,
  sheet: {
    date: 'First reports 18 November 2024, per the FAA and FBI. Picatinny Arsenal police logged reports from 13 November. Reports peaked in December 2024.',
    place: 'New Jersey, mainly Morris and Somerset counties, including Picatinny Arsenal and Naval Weapons Station Earle. Reports spread to New York and other states.',
    witnesses: 'Residents, police and trained security staff at two military bases. The FBI received more than 5,000 tips.',
    duration: 'About six weeks of reports, from mid November to late December 2024.',
    evidence: 'Tips, phone video and visual reports. Federal agencies said electronic detection did not back up the visual sightings.',
    finding: `DHS, FBI, FAA and DoD, December 2024: <q>We have not identified anything anomalous.</q> <span class="src">(faa.gov)</span> White House, 28 January 2025: the drones <q>were authorized to be flown by the FAA for research and various other reasons.</q> <span class="src">(rollcall.com transcript)</span>`,
  },
  happened: `<p>On 18 November 2024, people in Morris County began reporting drones near critical infrastructure. The ${a(CALL, 'FAA and the FBI')} both date the first reports to that day, and FBI Newark opened an investigation on 20 November. Police at Picatinny Arsenal had already logged evening drone reports from 13 November, ${a(CNN, 'CNN reported')}. People described drones &ldquo;the size of bicycles or small cars&rdquo; flying in clusters at night.</p>
<p>The FAA barred drone flights over Picatinny Arsenal and over the Bedminster golf club in late November, &ldquo;at the request of federal security partners.&rdquo; In December the reports multiplied. The FAA ${a(FAA, 'published 22 flight restrictions')} over New Jersey infrastructure on 19 December and 30 more over New York the next day. On 13 December it briefly slowed traffic at New York Stewart International Airport because of reported drones.</p>
<p>Officials answered in stages. The Pentagon said on 11 December that ${a(SINGH, '&ldquo;These are not US military drones.&rdquo;')} On 14 December the Joint Staff ${a(JOINTSTAFF, 'confirmed sightings')} by trained security staff at Picatinny Arsenal and Naval Weapons Station Earle. It added that it had not located the operators or where they launched from. On 16 December the DHS, FBI, FAA and Department of Defense issued a ${a(JOINT, 'joint statement')} saying they had found nothing anomalous. On 28 January 2025 White House press secretary Karoline Leavitt, relaying the President, said the drones ${a(LEAVITT, 'had been authorized by the FAA')} for research, and added, &ldquo;This was not the enemy.&rdquo;</p>`,
  evidence: `<p>The evidence is mostly reports. The FBI received more than 5,000 tips. On the 14 December call an FBI official said fewer than 100 of those led to leads worth further work. The joint statement puts the figure at &ldquo;approximately 100.&rdquo;</p>
<p>Two pieces of evidence carry more weight than the rest. First, the Joint Staff&rsquo;s confirmation that trained security staff saw drones over two military sites. Second, a set of Transportation Security Administration slides from 18 December 2024, released by ${a(DHS_PAGE, 'DHS under FOIA')} in 2025. The ${a(DHS_PDF, 'slides')} match specific viral reports to known aircraft. One reported drone over a nuclear plant was a Cessna and a Black Hawk helicopter. Drones &ldquo;coming in off the ocean&rdquo; were airliners turning toward JFK.</p>
<p>The record also contradicts itself. On 12 December the ${a(DEC12, 'DHS and FBI said')} there were &ldquo;no reported or confirmed drone sightings in any restricted air space.&rdquo; Two days later the Joint Staff confirmed sightings over two bases. The 16 December statement acknowledged a limited number of sightings &ldquo;within restricted air space.&rdquo;</p>`,
  explIntro: '<p>Officials offered several explanations at once, because the reports were not one thing. Each has a source and a limit.</p>',
  explanations: [
    { h: 'Manned aircraft mistaken for drones', src: { url: DHS_PDF, label: 'TSA slides released by DHS under FOIA (dhs.gov, 2025)' },
      html: `<p>The FBI said the density of reports ${a(CALL, '&ldquo;matches the approach patterns&rdquo;')} for Newark, JFK and LaGuardia. The DHS slides show it report by report, including airliners on approach that witnesses took for hovering drones.</p>
<p>The limit: aircraft do not explain the drones that trained staff confirmed over Picatinny and Earle.</p>` },
    { h: 'Lawful drones and stars', src: { url: JOINT, label: 'Joint DHS, FBI, FAA and DoD statement (faa.gov, December 2024)' },
      html: `<p>The joint statement assessed the sightings as a mix of lawful commercial, hobbyist and law-enforcement drones, manned planes and helicopters, and stars mistakenly reported as drones. The Pentagon press secretary noted that ${a(RYDER, 'more than 8,000 drones')} are flown lawfully in the US every day.</p>
<p>The limit: no operator was publicly identified and no drone was recovered, ${a(TWZ, 'an FBI spokesperson said')}. At a House hearing on 10 December an FBI official told members, ${a(HEARING, '&ldquo;we just don&rsquo;t know, and that&rsquo;s the concerning part.&rdquo;')}</p>` },
    { h: 'Drones authorized by the FAA for research', src: { url: LEAVITT, label: 'White House briefing transcript (rollcall.com, 28 January 2025)' },
      html: `<p>This is the White House answer. Leavitt said that after &ldquo;research and study&rdquo; the drones over New Jersey were FAA-authorized, that many were hobbyists, and that ${a(NBC, '&ldquo;it got worse due to curiosity.&rdquo;')}</p>
<p>The limit: the statement named no program, operator or FAA document. No FAA statement confirming it was found for this file. The December assessments never mentioned research flights.</p>` },
    { h: 'A wave of reporting', src: { url: NJGOV, label: 'New Jersey drone working group announcement (nj.gov, 23 December 2024)' },
      html: `<p>Once the story was on the news, more ordinary lights got reported. The ${a(DHS_PDF, 'TSA slides')} note that reports rose after local media coverage. The FBI described later activity that may not have been connected to the first reports. New Jersey State Police and Rutgers set up a working group, citing &ldquo;public speculation, and the spread of conspiracy theories.&rdquo;</p>
<p>The limit: the first reports, logged by base police from 13 November, came before the media wave.</p>` },
  ],
  open: `<ul>
<li>Who flew the drones that trained staff confirmed over Picatinny Arsenal and Naval Weapons Station Earle. The Joint Staff said it had not located the operators.</li>
<li>Which flights, if any, were the FAA-authorized research drones the White House described.</li>
<li>What the roughly 100 follow-up leads found. No outcome has been made public.</li>
<li>Whether a final report exists. None had been published as of September 2026.</li>
</ul>
<p>Two things are closed. A Pentagon spokesperson said the UAP office had ${a(SCOOP, 'received no reports of UAP')} tied to the drone flights. Congress later gave trained state and local police limited counter-drone powers, under a ${a(FEDREG, 'rule published in July 2026')}. That rule does not mention New Jersey.</p>`,
  learn: `<p><strong>A crowd of reports is not a crowd of objects.</strong> Five thousand tips produced about a hundred leads. Once a story is on the news, every airliner on approach becomes a candidate. Check the sky against the flight paths before you add to the pile. The ${a('/intel/drone-vs-ufo/', 'drone or UFO file')} lists the checks.</p>
<p><strong>Lights lie about distance.</strong> A plane turning toward you looks like it is hovering. Watch for two full minutes before you decide it stopped. Note which way it went and when.</p>
<p><strong>Report what you saw, not what you heard.</strong> Write the time, direction, sound and number of lights before you read anyone else&rsquo;s account. The ${a('/intel/how-to-report-a-ufo-sighting/', 'reporting file')} shows what investigators need.</p>`,
  ledgerLine: 'The joint federal statement of December 2024 and the White House answer of January 2025 are both official events.',
  fieldNote: 'Five thousand tips, about a hundred leads. Know your job before the sky gets crowded.',
  related: ['drone-vs-ufo', 'airplane-satellite-balloon-ufo-misidentification', 'how-to-report-a-ufo-sighting', 'mass-panic-first-contact'],
  askH: 'Panic spreads faster than drones.',
  askP: 'New Jersey showed how quickly a sky full of ordinary lights becomes a story. Ten questions tell you which job you would take when the calls start.',
  sources: [
    { title: 'DHS, FBI, FAA and DoD joint statement on the ongoing response to reported drone sightings', url: JOINT, domain: 'faa.gov', pub: '17 December 2024' },
    { title: 'The same joint statement, FBI copy', url: JOINT_FBI, domain: 'fbi.gov', pub: '16 December 2024' },
    { title: 'Joint DHS and FBI statement on reports of drones in New Jersey', url: DEC12, domain: 'fbi.gov', pub: '12 December 2024' },
    { title: 'Background press call on the response to reported drone sightings', url: CALL, domain: 'bidenwhitehouse.archives.gov', pub: '14 December 2024' },
    { title: 'Joint Staff addresses drones over New Jersey military installations', url: JOINTSTAFF, domain: 'war.gov', pub: '14 December 2024' },
    { title: 'Deputy Pentagon Press Secretary Sabrina Singh press briefing', url: SINGH, domain: 'war.gov', pub: '11 December 2024' },
    { title: 'Pentagon Press Secretary Maj. Gen. Pat Ryder press briefing', url: RYDER, domain: 'war.gov', pub: '16 December 2024' },
    { title: 'FAA general statements (flight restrictions over New Jersey and New York)', url: FAA, domain: 'faa.gov', pub: 'December 2024' },
    { title: 'Press gaggle by John Kirby', url: KIRBY, domain: 'bidenwhitehouse.archives.gov', pub: '16 December 2024' },
    { title: 'Unidentified Aerial Phenomena (UAP) sightings in NJ, FOIA release', url: DHS_PAGE, domain: 'dhs.gov', pub: 'updated May 2025' },
    { title: 'TSA slides, New Jersey drones, 18 December 2024 (FOIA records)', url: DHS_PDF, domain: 'dhs.gov', pub: 'posted April 2025' },
    { title: 'House Homeland Security hearing on counter-drone authorities', url: HEARING, domain: 'homeland.house.gov', pub: '12 December 2024' },
    { title: 'New Jersey drone working group announcement', url: NJGOV, domain: 'nj.gov', pub: '23 December 2024' },
    { title: 'Counter-UAS authority for state, local, tribal and territorial law enforcement (interim final rule)', url: FEDREG, domain: 'federalregister.gov', pub: '6 July 2026' },
    { title: 'Press briefing by Karoline Leavitt, transcript', url: LEAVITT, domain: 'rollcall.com', pub: '28 January 2025' },
    { title: 'White House says New Jersey drones were authorized by the FAA', url: NBC, domain: 'nbcnews.com', pub: '28 January 2025' },
    { title: 'New Jersey drone sightings', url: CNN, domain: 'cnn.com', pub: '12 December 2024' },
    { title: 'Federal assessments suggest New Jersey drones are not UAP or US military assets', url: SCOOP, domain: 'defensescoop.com', pub: '16 December 2024' },
    { title: 'No suspects in FBI&rsquo;s New Jersey drone investigation', url: TWZ, domain: 'twz.com', pub: 'January 2025' },
  ],
};
