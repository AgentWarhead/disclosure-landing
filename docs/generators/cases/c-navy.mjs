const DOD = 'https://www.war.gov/News/Releases/Release/Article/2165713/statement-by-the-department-of-defense-on-the-release-of-historical-navy-videos/';
const GOFAST = 'https://www.aaro.mil/Portals/136/PDFs/case_resolution_reports/AARO_GoFast_Case_Resolution_Card_Methodology_Final.pdf';
const IMAGERY = 'https://www.aaro.mil/UAP-Cases/Official-UAP-Imagery/';
const NAVAIR = 'https://www.navair.navy.mil/foia/documents';
const NASA = 'https://science.nasa.gov/wp-content/uploads/2023/09/uap-independent-study-team-final-report.pdf';
const FRAVOR = 'https://www.congress.gov/118/meeting/house/116282/witnesses/HHRG-118-GO06-Wstate-FravorD-20230726.pdf';
const GRAVES = 'https://www.congress.gov/118/meeting/house/116282/witnesses/HHRG-118-GO06-Wstate-GravesR-20230726.pdf';
const GALLAUDET = 'https://www.congress.gov/event/118th-congress/house-event/LC73681/text';
const NYT = 'https://www.nytimes.com/2017/12/16/us/politics/pentagon-program-ufo-harry-reid.html';
const CNN18 = 'https://www.cnn.com/2018/03/12/politics/unidentified-aircraft-navy/index.html';
const NBC = 'https://www.nbcnews.com/news/us-news/navy-confirms-videos-did-capture-ufo-sightings-it-calls-them-n1056201';
const TBV = 'https://www.theblackvault.com/documentarchive/u-s-navy-releases-dates-of-three-officially-acknowledged-encounters-with-phenomena/';
const NYMAG = 'https://nymag.com/intelligencer/2019/12/tic-tac-ufo-video-q-and-a-with-navy-pilot-chad-underwood.html';
const CBS = 'https://www.cbsnews.com/news/navy-ufo-sighting-60-minutes-2021-05-16/';
const MB_GOFAST = 'https://www.metabunk.org/threads/go-fast-footage-from-tom-delonges-to-the-stars-academy-bird-balloon.9569/';
const MB_GIMBAL = 'https://www.metabunk.org/threads/nyt-gimbal-video-of-u-s-navy-jet-encounter-with-unknown-object.9333/';
const MB_FLIR = 'https://www.metabunk.org/threads/2004-uss-nimitz-tic-tac-ufo-flir-footage-flir1.9190/';
const ARXIV = 'https://arxiv.org/abs/2306.08773';
const DV_FLIR = 'https://www.dvidshub.net/video/955825/flir-uap';
const DV_GIMBAL = 'https://www.dvidshub.net/video/956955/gimbal-uap';
const DV_GOFAST = 'https://www.dvidshub.net/video/956683/gofast-uap';
const PURSUE = 'https://www.war.gov/UFO/';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;

export default {
  slug: 'navy-ufo-videos-gimbal-gofast-flir', no: '001', year: '2004',
  crumb: 'The Navy UFO videos',
  title: 'Gimbal, GoFast and FLIR UFO Videos Explained',
  h1: 'The Gimbal, GoFast and FLIR UFO videos explained',
  desc: 'The Gimbal, GoFast and FLIR Navy UFO videos explained: how they got out, what the Pentagon and AARO found, and the case for glare, parallax and distant jets.',
  ogDesc: 'Three Navy clips, one official release, one AARO resolution and two cases still listed as unresolved.',
  eventName: 'US Navy UAP videos (FLIR1, Gimbal, GoFast)', dateISO: '2004-11-14',
  placeFull: 'Pacific Ocean southwest of San Diego (FLIR1); off the US East Coast (Gimbal, GoFast)', country: 'United States',
  lat: 31.6, lng: -118.3, coordsNote: 'Approximate. FLIR1 only: about 100 miles southwest of San Diego per CBS News. Gimbal and GoFast were off the US East Coast; AARO gives the eastern coast of Florida for GoFast.',
  cardTitle: 'The Navy UFO videos', cardLine: 'FLIR1, Gimbal and GoFast: one resolved by AARO, two still listed as unresolved.',
  cardDate: 'Nov 2004 and Jan 2015', cardPlace: 'Pacific and Atlantic', status: 'disputed',
  lede: 'The three Navy videos are genuine military footage, and the Pentagon officially released them in April 2020. None of them is proof of an alien craft. In 2025 AARO found that GoFast showed an ordinary object at about 13,000 feet. FLIR1 and Gimbal are still listed as unresolved, and analysts argue both show distant jets.',
  statusReason: 'AARO resolved GoFast as ordinary in 2025. FLIR1 and Gimbal are still listed as unresolved, and the aircrews reject the leading explanations.',
  findingSource: GOFAST,
  sheet: {
    date: 'FLIR1: 14 November 2004. Gimbal and GoFast: January 2015. The Navy gave 21 January 2015 for both, in a statement carried by The Black Vault.',
    place: 'FLIR1: the Pacific, about 100 miles southwest of San Diego, USS Nimitz strike group. Gimbal and GoFast: off the US East Coast, USS Theodore Roosevelt strike group. AARO places GoFast off the eastern coast of Florida.',
    witnesses: 'Navy aircrews. Public figures: Cmdr. David Fravor and Lt. Cmdr. Alex Dietrich (the 2004 sighting), Chad Underwood (the pilot who filmed FLIR1) and Ryan Graves (who served in the Gimbal squadron).',
    duration: 'Short infrared clips. Longer recordings and the radar data have not been released.',
    evidence: 'Infrared targeting camera video with on-screen flight data and cockpit audio, plus aircrew testimony, some of it given under oath.',
    finding: `Department of Defense, 27 April 2020: the phenomena <q>remain characterized as &lsquo;unidentified.&rsquo;</q> <span class="src">(war.gov)</span> AARO, 6 February 2025, on GoFast: <q>the object did not move at anomalous speeds.</q> <span class="src">(aaro.mil)</span> FLIR1 and Gimbal are listed as unresolved.`,
  },
  happened: `<p>On 14 November 2004, Navy aircrews from the USS Nimitz strike group reported an object off southern California. Cmdr. David Fravor and Lt. Cmdr. Alex Dietrich described the encounter on ${a(CBS, '60 Minutes')} in 2021. About an hour after their sighting, another crew recorded a short infrared clip with a targeting camera. Chad Underwood has said he flew that second flight and coined the name ${a(NYMAG, '&ldquo;Tic Tac&rdquo;')}. That clip is the one now called FLIR1.</p>
<p>In January 2015, jets from the USS Theodore Roosevelt strike group were training off the US East Coast. Their cameras recorded two more clips, later named Gimbal and GoFast. The Navy has said those names are ${a(TBV, 'not official')}. In the Gimbal audio, one aviator says ${a(NYT, '&ldquo;There&rsquo;s a whole fleet of them.&rdquo;')}</p>
<p>The clips reached the public in stages. The Navy says FLIR1 was ${a(NBC, 'posted online by a crew member in 2007')}. The New York Times published FLIR1 and Gimbal on 16 December 2017, alongside its report on a Pentagon UFO program. To The Stars Academy released GoFast on 9 March 2018, as ${a(CNN18, 'CNN reported')}. In September 2019 a Navy spokesman said the three videos show &ldquo;unidentified aerial phenomena&rdquo; entering military training ranges. On 27 April 2020 the ${a(DOD, 'Department of Defense authorized their release')}, noting they had circulated after &ldquo;unauthorized releases in 2007 and 2017.&rdquo;</p>`,
  evidence: `<p>The evidence is three infrared clips from jet targeting cameras. Each frame carries flight data: the jet&rsquo;s altitude and speed, the camera angle and, in GoFast, a range to the target. Those numbers matter more than the shape on screen, because they let anyone check how far away the object was.</p>
<p>The official copies sit in the ${a(NAVAIR, 'Naval Air Systems Command FOIA reading room')}, which the Pentagon&rsquo;s 2020 statement points to. The Defense Visual Information Distribution Service also hosts ${a(DV_FLIR, 'FLIR')}, ${a(DV_GIMBAL, 'Gimbal')} and ${a(DV_GOFAST, 'GoFast')}, marked public domain and credited to Naval Air Systems Command. This file links to those pages instead of reproducing frames.</p>
<p>The rest of the record is testimony. Fravor and Graves gave written testimony to a House Oversight subcommittee on 26 July 2023. ${a(GRAVES, 'Graves wrote')} that the full Gimbal video and the radar data recorded by his squadron are still withheld. In November 2024, retired Rear Adm. Tim Gallaudet ${a(GALLAUDET, 'testified')} that GoFast was attached to a January 2015 email marked &ldquo;URGENT SAFETY OF FLIGHT ISSUE.&rdquo; He said the email vanished from inboxes the next day. That is his account, and no record of the email has been released.</p>`,
  explIntro: '<p>Each clip has its own leading explanation. Here is each one, the best source for it, and the strongest objection.</p>',
  explanations: [
    { h: 'GoFast: an ordinary object made fast by parallax', src: { url: GOFAST, label: 'AARO GoFast case resolution (aaro.mil, February 2025)' },
      html: `<p>GoFast looks like something racing low over the water. In March 2018 Mick West used the on-screen numbers to argue that it was ${a(MB_GOFAST, 'probably at about 13,000 feet')}, far above the sea. Seen against the water from a fast jet, a slow object seems to streak past. NASA&rsquo;s ${a(NASA, 'independent study team')} ran the same geometry in 2023 and got an average of about 40 mph, &ldquo;a typical wind speed at 13,000 feet.&rdquo; AARO reached the same answer in February 2025, with high confidence that the object showed no unusual performance. AARO also says it <q>cannot definitively identify the object</q>.</p>
<p>The objection: Gallaudet told Congress that a balloon answer for GoFast ignores the many other encounters during that exercise. That argues about context. It does not dispute the geometry.</p>` },
    { h: 'Gimbal: glare from a distant jet, turned by the camera mount', src: { url: MB_GIMBAL, label: 'Mick West, Metabunk Gimbal analysis (metabunk.org, from December 2017)' },
      html: `<p>In Gimbal the object seems to rotate in mid-air. Mick West argues that the shape is infrared glare from a hot engine, probably a distant jet, and that the rotation comes from the camera&rsquo;s own gimbal mount turning to keep the target in view. His ${a('https://www.metabunk.org/gimbal/', 'simulator')} reproduces the turn from the flight data.</p>
<p>The objection: a 2023 preprint by Yves Peings and Marik von Rennenkampff ${a(ARXIV, 'reconstructs possible flight paths')} at the range the aircrew reported. It finds a path that stops and reverses, as the aviators described. It has not been peer reviewed. Graves says the unreleased full video and radar data would settle the &ldquo;fleet&rdquo; question. No fleet appears in the released footage.</p>` },
    { h: 'FLIR1: a distant aircraft flying away', src: { url: MB_FLIR, label: 'Metabunk FLIR1 thread (metabunk.org, from October 2017)' },
      html: `<p>West and others argue that FLIR1 shows an ordinary aircraft many miles away, flying away from the camera, so that its engines appear as a small bright shape. The clip&rsquo;s own numbers do not include a range, which makes the distance hard to pin down either way.</p>
<p>The objection: Underwood has said he saw ${a(NYMAG, 'no sign of propulsion')} on his screen. The clip was also recorded on a later flight, so it does not capture the visual encounter Fravor ${a(FRAVOR, 'describes in his sworn testimony')}. His account stands or falls on its own.</p>` },
    { h: 'Something the military still cannot identify', src: { url: DOD, label: 'Department of Defense statement (war.gov, 27 April 2020)' },
      html: `<p>The aviators who were there say they saw objects they could not identify, and the Pentagon still calls FLIR1 and Gimbal unidentified. AARO&rsquo;s ${a(IMAGERY, 'Official UAP Imagery page')} lists both as &ldquo;Unresolved Case.&rdquo; Unidentified is a statement about missing data. No official body has said either clip shows technology that is not human.</p>` },
  ],
  open: `<ul>
<li>AARO has published no resolution for FLIR1 or Gimbal. Both stay listed as unresolved.</li>
<li>AARO settled GoFast&rsquo;s speed and height. It did not say what the object was: a balloon, a bird or something else.</li>
<li>The full Gimbal recording and the squadron&rsquo;s radar data are not public, according to Graves&rsquo;s sworn testimony.</li>
<li>The Navy has not released exact locations for the 2015 clips. The Gimbal date comes from a Navy statement carried by one outlet.</li>
<li>The Pentagon&rsquo;s 2026 file releases, published at ${a(PURSUE, 'war.gov/UFO')}, list no records named for these three videos, as of the September 2026 index.</li>
</ul>`,
  learn: `<p><strong>Keep the numbers.</strong> GoFast was solved because the flight data stayed burned into the frame. A phone clip with its original file and metadata carries the same kind of data. Never crop, filter or re-export before you save the original. The ${a('/intel/how-to-film-a-ufo-at-night/', 'night filming file')} covers the settings.</p>
<p><strong>Distance is the hardest judgment.</strong> Without a landmark, a slow object far away can look close and fast. Before you decide it moved impossibly, ask how you know how far away it was. The ${a('/intel/airplane-satellite-balloon-ufo-misidentification/', 'misidentification filter')} runs that check.</p>
<p><strong>Your memory and your video are separate records.</strong> The pilots&rsquo; accounts and the clips do not cover the same minutes. Write down what you saw before you watch your own footage or anyone else&rsquo;s. The ${a('/intel/how-to-evaluate-ufo-memory/', 'memory file')} explains why the order matters.</p>`,
  ledgerLine: 'The 2020 video release and AARO&rsquo;s 2025 GoFast resolution are both official events with dates and documents.',
  fieldNote: 'GoFast was solved by the numbers on the screen. Know your job before you need a camera.',
  related: ['nimitz-tic-tac-ufo-explained', 'aaro-explained', 'nasa-uap-report-explained', 'how-to-film-a-ufo-at-night'],
  askH: 'The footage outlived the argument.',
  askP: 'Three short clips are still being argued over twenty years on. Ten questions tell you which job you would take if the next one happens over your street.',
  sources: [
    { title: 'Statement by the Department of Defense on the release of historical Navy videos', url: DOD, domain: 'war.gov', pub: '27 April 2020' },
    { title: 'Naval Air Systems Command FOIA reading room (the official video files)', url: NAVAIR, domain: 'navair.navy.mil' },
    { title: 'FLIR UAP, official video page', url: DV_FLIR, domain: 'dvidshub.net', pub: 'posted March 2025' },
    { title: 'Gimbal UAP, official video page', url: DV_GIMBAL, domain: 'dvidshub.net', pub: 'posted March 2025' },
    { title: 'GoFast UAP, official video page', url: DV_GOFAST, domain: 'dvidshub.net', pub: 'posted March 2025' },
    { title: 'AARO case resolution: &ldquo;Go Fast&rdquo;', url: GOFAST, domain: 'aaro.mil', pub: '6 February 2025' },
    { title: 'AARO Official UAP Imagery', url: IMAGERY, domain: 'aaro.mil' },
    { title: 'NASA UAP Independent Study Team final report', url: NASA, domain: 'nasa.gov', pub: '14 September 2023' },
    { title: 'Written testimony of David Fravor, House Oversight hearing', url: FRAVOR, domain: 'congress.gov', pub: '26 July 2023' },
    { title: 'Written testimony of Ryan Graves, House Oversight hearing', url: GRAVES, domain: 'congress.gov', pub: '26 July 2023' },
    { title: 'Hearing transcript, &ldquo;Unidentified Anomalous Phenomena: Exposing the Truth&rdquo;', url: GALLAUDET, domain: 'congress.gov', pub: '13 November 2024' },
    { title: 'PURSUE: Department of War UAP file releases', url: PURSUE, domain: 'war.gov', pub: '2026' },
    { title: 'Glowing Auras and &lsquo;Black Money&rsquo;: The Pentagon&rsquo;s Mysterious U.F.O. Program', url: NYT, domain: 'nytimes.com', pub: '16 December 2017' },
    { title: 'CNN report on the GoFast release', url: CNN18, domain: 'cnn.com', pub: '12 March 2018' },
    { title: 'Navy confirms videos did capture UFO sightings', url: NBC, domain: 'nbcnews.com', pub: '19 September 2019' },
    { title: 'U.S. Navy releases dates of three officially acknowledged encounters', url: TBV, domain: 'theblackvault.com', pub: '11 September 2019' },
    { title: 'Q&amp;A with Navy pilot Chad Underwood', url: NYMAG, domain: 'nymag.com', pub: '19 December 2019' },
    { title: 'Navy pilots describe the 2004 encounter, 60 Minutes', url: CBS, domain: 'cbsnews.com', pub: '16 May 2021' },
    { title: 'Mick West, GoFast analysis thread', url: MB_GOFAST, domain: 'metabunk.org', pub: 'from March 2018' },
    { title: 'Mick West, Gimbal analysis thread', url: MB_GIMBAL, domain: 'metabunk.org', pub: 'from December 2017' },
    { title: 'FLIR1 analysis thread', url: MB_FLIR, domain: 'metabunk.org', pub: 'from October 2017' },
    { title: 'Peings and von Rennenkampff, Reconstruction of potential flight paths for the January 2015 Gimbal UAP (preprint)', url: ARXIV, domain: 'arxiv.org', pub: 'June 2023' },
  ],
};
