const KLASS = 'https://rr0.org/time/1/9/7/6/06/WaltonAbductionCoverUpRevealed_UfoInvestigator/index.html';
const SI = 'https://cdn.centerforinquiry.org/wp-content/uploads/sites/29/1981/07/22165430/p49.pdf';
const GILSON = 'https://www.nicap.org/reports2/Cy_Gilson_Polygraph_Test_of_Travis_Walton.pdf';
const SHERMER1 = 'https://michaelshermer.com/articles/travis-waltons-alien-abduction-lie-detection-test/';
const SHERMER2 = 'https://michaelshermer.com/articles/the-muddle-of-truth/';
const WALTON = 'http://www.travis-walton.com/ordinary.html';
const FAQ = 'http://www.travis-walton.com/faq.html';
const WMI = 'https://www.wmicentral.com/news/snowflake_taylor/ufo-incident-makes-worldwide-headlines-in-1975/article_96495b2c-e695-5340-8958-d63def914388.html';
const AFI = 'https://catalog.afi.com/Catalog/moviedetails/59525';
const GRAIL = 'https://www.dailygrail.com/2015/09/fire-in-the-sky-the-inside-story-an-exclusive-excerpt-from-silver-screen-saucers/';
const KJZZ = 'https://www.kjzz.org/the-show/2025-07-03/his-arizona-ufo-abduction-story-became-legend-after-50-years-hes-sick-of-attempts-to-debunk-it';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;

export default {
  slug: 'travis-walton-abduction', no: '005', year: '1975',
  crumb: 'Travis Walton',
  title: 'Travis Walton Abduction Story: The Case File',
  h1: 'The Travis Walton abduction story',
  desc: 'The Travis Walton abduction story, checked: the 1975 Arizona claim, the crew, every polygraph and why each is disputed, the film, and what the record shows.',
  ogDesc: 'A forest crew, a man missing for five days, and fifty years of polygraphs that never settled it.',
  eventName: 'Travis Walton abduction claim', dateISO: '1975-11-05',
  placeFull: 'Apache-Sitgreaves National Forest near Heber, Arizona', country: 'United States',
  lat: 34.43, lng: -110.59, coordsNote: 'Approximate: the town of Heber, Arizona. The Turkey Springs work site was in the forest nearby.',
  cardTitle: 'The Travis Walton abduction', cardLine: 'Five days missing, six co-workers, and polygraphs on both sides.',
  cardDate: 'Nov 1975', cardPlace: 'Heber, Arizona', status: 'disputed',
  lede: 'Travis Walton says a craft took him from an Arizona forest on 5 November 1975 and that he woke aboard it. He was missing for about five days. Six co-workers say they saw a beam strike him. No physical evidence was ever produced, and the polygraph record cuts both ways. No official body issued a finding.',
  statusReason: 'Walton and his crew stood by the account for decades. A skeptic argued it was a hoax to escape a work contract, and the lie-detector results conflict.',
  findingSource: null,
  sheet: {
    date: '5 November 1975, about 6:15 pm. Walton phoned family from Heber just after midnight on 11 November. One local paper gives 10 November.',
    place: 'Apache-Sitgreaves National Forest near Heber, Arizona, on the Turkey Springs forest thinning contract.',
    witnesses: 'A seven-man Forest Service thinning crew: Walton, foreman Mike Rogers and five others. Walton and Rogers are public figures.',
    duration: 'The crew described a sighting of moments. Walton was missing for about five days.',
    evidence: 'Crew testimony, Walton&rsquo;s own account and a series of polygraph tests with conflicting results. No physical evidence.',
    finding: 'None found. The Navajo County Sheriff&rsquo;s Office investigated, but no closing report or finding was located, and there was no federal inquiry.',
  },
  happened: `<p>On the evening of 5 November 1975, a seven-man crew was driving home from a Forest Service thinning job near Heber, Arizona. The crew says they saw a strange object near the road, and that a beam struck Walton. The others drove off in fear, came back, and could not find him. That is ${a(WALTON, 'Walton&rsquo;s own summary')} of the crew&rsquo;s story.</p>
<p>The crew reported it to the sheriff&rsquo;s office in Heber, and deputies searched the forest. A reporter who was there recalled that Sheriff Marlin Gillespie called the story a hoax and wanted everyone tested on a lie detector, according to a ${a(SI, '1981 Skeptical Inquirer account')}.</p>
<p>About five days later Walton phoned his family from a phone booth in Heber. He said he had woken on a table in a small room with three short beings with large dark eyes, and later met a human-looking figure before waking beside the road. That description comes from his account to the examiner in his ${a(GILSON, '1993 polygraph')}. Walton published a book, <em>The Walton Experience</em>, in 1978. In 1993 Paramount released the film ${a(AFI, '<em>Fire in the Sky</em>')}, directed by Robert Lieberman from a screenplay by Tracy Tormé.</p>`,
  evidence: `<p>There is no physical evidence. The case rests on testimony and on lie-detector tests, and the tests are where most of the argument lives.</p>
<ul>
<li><strong>10 November 1975, the crew.</strong> An Arizona Department of Public Safety examiner tested six crew members while Walton was still missing. Five passed and one was inconclusive. The test was built to find out whether Walton had been harmed. The examiner told skeptic Philip Klass that the one UFO question was added at the sheriff&rsquo;s request, and that it ${a(KLASS, 'did not make the test valid')} for the UFO claim.</li>
<li><strong>15 November 1975, Walton.</strong> A test arranged by a UFO group and paid for by the National Enquirer. The examiner&rsquo;s written report said Walton was ${a(KLASS, '&ldquo;attempting to perpetrate a UFO hoax.&rdquo;')} The result was not disclosed to Enquirer readers at the time, per the ${a(SI, 'Skeptical Inquirer')}.</li>
<li><strong>7 February 1976, Walton and his brother.</strong> Both passed a second test. Klass reported that Walton supplied the questions, and that the head of the examiner&rsquo;s firm later said the test should be invalidated.</li>
<li><strong>4 February 1993, Walton.</strong> The original state examiner tested him again and ${a(GILSON, 'judged him truthful')}.</li>
<li><strong>2008, a television game show.</strong> Walton answered yes when asked if he was abducted, and the show&rsquo;s polygraph called the answer false, per ${a(SHERMER1, 'Michael Shermer')}. Walton ${a(SHERMER2, 'rejected the show&rsquo;s methods')}.</li>
</ul>
<p>Each side can point to a test it likes. That is why no single result has settled the case.</p>`,
  explIntro: '<p>Three explanations have been argued seriously. Each is a claim, and each has a counter.</p>',
  explanations: [
    { h: 'An abduction, as Walton describes it', src: { url: GILSON, label: 'Cy Gilson polygraph letter, 1993 (nicap.org)' },
      html: `<p>Walton and the crew have held to the account for decades. Five of six crew members passed the first test, and the 1993 retest found Walton truthful. In ${a(KJZZ, 'a 2025 interview')} Walton said he still stands by it.</p>
<p>The counter: the first test of Walton was failed and kept quiet, the 1976 pass is disputed, and no physical evidence supports the account.</p>` },
    { h: 'A hoax to escape a work contract', src: { url: KLASS, label: 'Philip Klass interview, UFO Investigator, June 1976 (transcribed at rr0.org)' },
      html: `<p>Klass argued that foreman Mike Rogers was behind on his Forest Service contract and facing a deadline he could not meet. A UFO scare, he said, gave the crew a reason not to go back. He also pointed to reports that Walton had a long interest in UFOs.</p>
<p>The counter: five crew members passed a test designed around foul play, and later retests of Walton and two crew members came out truthful, per ${a(GILSON, 'the 1993 examiner')}. No one has shown direct evidence of a plan.</p>` },
    { h: 'A real light, then something in the mind', src: { url: SI, label: 'Jeff Wells, Skeptical Inquirer, 1981 (centerforinquiry.org)' },
      html: `<p>Psychiatrists hired by the National Enquirer at the time suggested, as Jeff Wells reported, that Walton may have seen a real light and then experienced something that felt real to him. This view does not require anyone to have lied.</p>
<p>The counter: it does not explain where Walton was for five days.</p>` },
  ],
  open: `<ul>
<li>Where Walton was for five days. No source reviewed for this file gives physical evidence either way.</li>
<li>What the sheriff&rsquo;s office concluded. No closing report was found.</li>
<li>How much of the story the film changed. Tormé has said a studio executive demanded a new abduction sequence, per a ${a(GRAIL, 'book excerpt')}. Walton wrote that those changes were not his to ${a(FAQ, '&ldquo;approve or disapprove.&rdquo;')} Many people know the film, not the account.</li>
</ul>`,
  learn: `<p><strong>A test is not a witness.</strong> This case has more polygraphs than evidence. A clean record needs things that can be checked: times, places, photos, and statements written down the same night.</p>
<p><strong>Write it down before anyone pays for it.</strong> Walton&rsquo;s account was shaped by interviews, a newspaper deal, a book and a film. Your first written notes are the version nobody else touched. The ${a('/intel/how-to-evaluate-ufo-memory/', 'memory file')} shows how to separate what you saw from what you added later.</p>
<p><strong>Lost time needs care, not a story.</strong> If you or someone near you loses track of hours after a strange event, get safe, write down the gap, and talk to someone you trust. The ${a('/intel/missing-time-after-ufo-sighting/', 'missing time file')} covers the first steps.</p>`,
  ledgerLine: 'This case has no official finding. The ledger tracks what government bodies have actually said about UAP.',
  fieldNote: 'Polygraphs split this case for fifty years. Notes written the same night would not have.',
  related: ['missing-time-after-ufo-sighting', 'how-to-evaluate-ufo-memory', 'sleep-paralysis-vs-alien-abduction', 'close-encounter-types-explained'],
  askH: 'The first night decides the file.',
  askP: 'Walton&rsquo;s case turned on who said what in the first hours. Ten questions tell you which job you would take if you were in that truck.',
  sources: [
    { title: 'Philip J. Klass interview, &ldquo;Walton abduction cover-up revealed,&rdquo; UFO Investigator (NICAP), transcribed', url: KLASS, domain: 'rr0.org', pub: 'June 1976' },
    { title: 'Jeff Wells, &ldquo;Profitable Nightmare of a Very Unreal Kind,&rdquo; Skeptical Inquirer', url: SI, domain: 'centerforinquiry.org', pub: 'Summer 1981' },
    { title: 'Cy Gilson, letter on the 1993 polygraph of Travis Walton', url: GILSON, domain: 'nicap.org', pub: '4 February 1993' },
    { title: 'Michael Shermer, Travis Walton&rsquo;s alien abduction lie detection test', url: SHERMER1, domain: 'michaelshermer.com', pub: '14 August 2012' },
    { title: 'The Muddle of Truth, Walton&rsquo;s reply', url: SHERMER2, domain: 'michaelshermer.com', pub: '21 August 2012' },
    { title: 'Travis Walton, an ordinary day', url: WALTON, domain: 'travis-walton.com' },
    { title: 'Travis Walton, frequently asked questions', url: FAQ, domain: 'travis-walton.com' },
    { title: 'UFO incident makes worldwide headlines in 1975', url: WMI, domain: 'wmicentral.com', pub: '4 November 2005' },
    { title: '<em>Fire in the Sky</em> (1993), catalog entry', url: AFI, domain: 'catalog.afi.com' },
    { title: 'Fire in the Sky: the inside story, book excerpt', url: GRAIL, domain: 'dailygrail.com', pub: '29 September 2015' },
    { title: 'His Arizona UFO abduction story became legend', url: KJZZ, domain: 'kjzz.org', pub: '3 July 2025' },
  ],
};
