const AARO = 'https://www.aaro.mil/Portals/136/PDFs/case_resolution_reports/AARO_Al_Taqaddam_Case_Resolution_Final.pdf';
const DVIDS = 'https://www.dvidshub.net/video/960331/al-taqaddum-object';
const XPOST = 'https://x.com/DoD_AARO/status/1917294137188995106';
const WEAP = 'https://www.weaponizedpodcast.com/news-1/the-jellyfish-uap';
const TMZ = 'https://www.tmz.com/2024/01/09/ufo-promo-tmz-documentary-ufo-transparency-threatened/';
const GLOBAL = 'https://globalnews.ca/news/10216527/jellyfish-ufo-iraq-video-uap/';
const FORTEAN = 'https://www.singularfortean.com/news/2024/1/9/jellyfish-ufo-reportedly-recorded-over-united-states-joint-operations-base-in-iraq';
const ARAB = 'https://www.arabnews.com/node/2442101/offbeat';
const HEARING = 'https://www.govinfo.gov/content/pkg/CHRG-119hhrg61718/html/CHRG-119hhrg61718.htm';

const a = (url, text) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`;

export default {
  slug: 'jellyfish-ufo-iraq', no: '002', year: '2017',
  crumb: 'The Jellyfish UFO',
  title: 'The Jellyfish UFO Video From Iraq Explained',
  h1: 'The Jellyfish UFO video explained',
  desc: 'The Jellyfish UFO video from Iraq explained: when it was filmed, who released it in 2024, the water claim, and why AARO concluded it was a cluster of balloons.',
  ogDesc: 'A thermal video from an Iraqi air base, a claim that it went into the water, and an AARO report that says balloons.',
  eventName: 'Al Taqaddum object ("Jellyfish UFO")', dateISO: '2017-10-23',
  placeFull: 'Al Taqaddum Air Base, Iraq', country: 'Iraq',
  lat: 33.34, lng: 43.60, coordsNote: 'Approximate: Al Taqaddum Air Base, west of Baghdad.',
  cardTitle: 'The Jellyfish UFO', cardLine: 'A thermal video from Iraq, a water claim, and an AARO balloon finding.',
  cardDate: 'Oct 2017', cardPlace: 'Al Taqaddum, Iraq', status: 'explained',
  lede: 'The Jellyfish video was filmed over Al Taqaddum Air Base in Iraq in October 2017 and leaked in January 2024. In September 2025 the Pentagon&rsquo;s UAP office, AARO, concluded with high confidence that it shows a cluster of balloons drifting with the wind. The claim that it went into the water is not shown in the full video.',
  statusReason: 'AARO matched the object to a balloon cluster moving with the wind and released the full video. The water claim has no support in it.',
  findingSource: AARO,
  sheet: {
    date: '23 October 2017, per AARO. Early press reports in 2024 gave 2018.',
    place: 'Al Taqaddum Air Base, Iraq.',
    witnesses: 'Base personnel watching a sensor feed. One former Marine controller at the base has spoken publicly about what he saw.',
    duration: 'The full video AARO released runs 17 minutes 27 seconds.',
    evidence: 'Thermal infrared video from a sensor on a force-protection aerostat, a tethered surveillance balloon, operating at 2,700 feet.',
    finding: `AARO case resolution, 8 September 2025: <q>AARO assesses with high confidence that the Al Taqaddum object did not exhibit anomalous behavior or capabilities.</q> <span class="src">(aaro.mil)</span>`,
  },
  happened: `<p>On 23 October 2017, a thermal camera watching over Al Taqaddum Air Base in Iraq recorded a dark, lumpy object with dangling shapes beneath it, drifting across the frame. The camera sat on a tethered surveillance balloon about 2,700 feet up. Those details come from ${a(AARO, 'AARO&rsquo;s case resolution')}.</p>
<p>Nobody outside the military saw the clip until January 2024. Filmmaker Jeremy Corbell and journalist George Knapp posted it on their ${a(WEAP, 'Weaponized site')} on 8 January 2024, and it aired in a TMZ documentary on Tubi from ${a(TMZ, '9 January')}. It was quickly nicknamed the Jellyfish. Press coverage at the time dated it to 2018.</p>
<p>Corbell claims the object made a controlled descent into water, stayed under for about 17 minutes, then left at speed. He calls it &ldquo;transmedium.&rdquo; A Department of Defense spokesperson told reporters in January 2024 that the department does not comment on the authenticity of allegedly leaked material.</p>
<p>AARO announced its answer on ${a(XPOST, '29 April 2025')}: balloons. The same day it posted the full ${a(DVIDS, '17-minute video')} on the Defense Visual Information Distribution Service, marked public domain. The written case resolution followed on 8 September 2025.</p>`,
  evidence: `<p>The evidence is one thermal video, now public in full. The ${a(DVIDS, 'official video page')} is the place to watch it. This file links to it instead of reproducing frames.</p>
<p>AARO&rsquo;s analysis puts the object between 850 and 2,200 feet, moving 4 to 14 mph from east to west, within the range of the wind that day. It describes the shape as consistent with a cluster of fully and partly inflated balloons with visible dangling strings. The object shifts between dark and light in the video. AARO attributes that to the camera readjusting its grayscale, not to the object changing.</p>
<p>The rest is testimony. Former Marine Michael Cincoski, who worked as a surveillance controller at the base, said the object ${a(FORTEAN, 'never shot out of the lake')} or into the sky, as ${a(ARAB, 'Arab News')} also reported. No record found for this file shows the video was presented to Congress. The transcript of the ${a(HEARING, 'September 2025 House task force hearing')} does not mention it.</p>`,
  explIntro: '<p>Two explanations have been argued. One is now the official finding.</p>',
  explanations: [
    { h: 'A cluster of balloons', src: { url: AARO, label: 'AARO Al Taqaddum case resolution (aaro.mil, 8 September 2025)' },
      html: `<p>AARO concluded with high confidence that the object is consistent with party-style balloons, some fully and some partly inflated, drifting with the wind. Before the report, Mick West at Metabunk argued in January 2024 for balloons a few thousand feet up, and for the camera, not the object, causing the dark-to-light switching. AARO&rsquo;s report describes the same grayscale effect.</p>
<p>The counter: Corbell&rsquo;s claim that the object entered and left water. The full video AARO released does not show that, and AARO&rsquo;s report does not address water at all.</p>` },
    { h: 'A transmedium craft', src: { url: WEAP, label: 'Weaponized, The Jellyfish UAP (weaponizedpodcast.com, January 2024)' },
      html: `<p>Corbell presents the object as something that can move through air and water. Physicist Matthew Szydagis told ${a(GLOBAL, 'Global News')} in January 2024 that the colour changes were unexplained.</p>
<p>The counter: the only witness who has spoken on record said the object did not come out of the water, and the full video shows drift consistent with the wind.</p>` },
  ],
  open: `<ul>
<li>Whether any longer footage exists. Corbell describes more than was released. No official source addresses it.</li>
<li>Corbell&rsquo;s claim that the military formally designated the object a UAP has not been confirmed by any official source.</li>
<li>The Pentagon&rsquo;s 2026 file releases list no record by this name, as far as this file could check. That does not prove it is absent from them.</li>
</ul>`,
  learn: `<p><strong>A leak is not the whole record.</strong> The clip that went viral was a slice. The full 17 minutes, released later, told a plainer story. If you film something, keep the whole file, from before it appears to after it leaves.</p>
<p><strong>Cameras change the picture.</strong> Thermal and night modes readjust brightness on their own, so a target can seem to glow, fade or flip colour. Note your camera settings with your clip. The ${a('/intel/how-to-film-a-ufo-at-night/', 'night filming file')} covers the settings that matter.</p>
<p><strong>Balloons fool trained people.</strong> They drift, tumble and hang strings that look like limbs. The ${a('/intel/airplane-satellite-balloon-ufo-misidentification/', 'misidentification filter')} starts with the wind.</p>`,
  ledgerLine: 'AARO&rsquo;s April 2025 announcement and its September 2025 case resolution are both official events.',
  fieldNote: 'The full video told a plainer story than the leak. Know your job before you hit record.',
  related: ['aaro-explained', 'airplane-satellite-balloon-ufo-misidentification', 'how-to-film-a-ufo-at-night', 'ufo-evidence-checklist'],
  askH: 'Seventeen minutes settled it.',
  askP: 'The Jellyfish was solved by the footage nobody shared at first. Ten questions tell you which job you would take when your own camera is running.',
  sources: [
    { title: 'AARO case resolution: Al Taqaddum object', url: AARO, domain: 'aaro.mil', pub: '8 September 2025' },
    { title: 'Al Taqaddum object, full video (AARO)', url: DVIDS, domain: 'dvidshub.net', pub: '29 April 2025' },
    { title: 'AARO announcement of the balloon finding', url: XPOST, domain: 'x.com', pub: '29 April 2025' },
    { title: 'Hearing transcript, &ldquo;Restoring Public Trust Through UAP Transparency and Whistleblower Protection&rdquo;', url: HEARING, domain: 'govinfo.gov', pub: '9 September 2025' },
    { title: 'The Jellyfish UAP', url: WEAP, domain: 'weaponizedpodcast.com', pub: '8 January 2024' },
    { title: 'TMZ documentary promotion', url: TMZ, domain: 'tmz.com', pub: '9 January 2024' },
    { title: 'Jellyfish UFO video from Iraq', url: GLOBAL, domain: 'globalnews.ca', pub: 'January 2024' },
    { title: 'Jellyfish UFO reportedly recorded over a US joint operations base in Iraq', url: FORTEAN, domain: 'singularfortean.com', pub: '9 January 2024' },
    { title: 'Arab News report on the Jellyfish video', url: ARAB, domain: 'arabnews.com', pub: 'January 2024' },
  ],
};
