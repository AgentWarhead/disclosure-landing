const RESEND_KEY = process.env.RESEND_KEY || "";
const FROM_EMAIL = "Disclosure Protocol <team@getdisclosure.app>";

const ARCHETYPES = {
  sentinel: {
    name: "SENTINEL", icon: "&#128737;", color: "#EF4444", role: "PRIMARY PROTECTOR",
    stat1: ["SCAN MODE", "ACTIVE"], stat2: ["RESPONSE", "IMMEDIATE"],
    bar_lbl: "READINESS", bar_pct: "84%", bar_w: "84%",
    status: "STATUS: READY FOR DEPLOYMENT", pct: "34%",
    subject: "Classification complete: Sentinel",
    tagline: "You hold the line. When contact happens, all eyes turn to you first.",
    preheader: "You are one of the 34% designated as primary protectors.",
    share_txt: "I just got classified as a SENTINEL by Disclosure. Only 34% of people get this designation. What are you when they arrive? getdisclosure.app",
    share_x: "I just got classified as a SENTINEL by @disclosure_app. Only 34% of people get this archetype. Find yours: getdisclosure.app #FirstContact #UAP",
    breadcrumb: "NOTE: Standard assessment does not reveal all designations. [REDACTED]",
  },
  diplomat: {
    name: "DIPLOMAT", icon: "&#129309;", color: "#22C55E", role: "DE-ESCALATION LEAD",
    stat1: ["CONTACT IDX", "11.4 kHz"], stat2: ["PROTOCOL", "ALPHA-7"],
    bar_lbl: "CALM RATING", bar_pct: "96%", bar_w: "96%",
    status: "STATUS: READY FOR FIRST CONTACT", pct: "41%",
    subject: "Classification complete: Diplomat",
    tagline: "When they arrive, you are the voice of humanity. Choose your words carefully.",
    preheader: "You are one of the 41% designated for negotiation and de-escalation.",
    share_txt: "I just got classified as a DIPLOMAT by Disclosure. I am humanity's voice in first contact. What role do you play? getdisclosure.app",
    share_x: "I just got classified as a DIPLOMAT by @disclosure_app. I speak for humanity when they arrive. What are you? getdisclosure.app #FirstContact #UAP",
    breadcrumb: "NOTE: Standard assessment does not reveal all designations. [REDACTED]",
  },
  scholar: {
    name: "SCHOLAR", icon: "&#128300;", color: "#60A5FA", role: "FIELD ANALYST",
    stat1: ["OBS CLASS", "ALPHA"], stat2: ["FIELD MODE", "PASSIVE RECORD"],
    bar_lbl: "DATA INTEGRITY", bar_pct: "91%", bar_w: "91%",
    status: "STATUS: DOCUMENTATION ACTIVE", pct: "23%",
    subject: "Classification complete: Scholar",
    tagline: "They came for the curious. You have been watching the skies longer than you admit.",
    preheader: "You are one of the 23% tasked with documenting what others cannot explain.",
    share_txt: "I just got classified as a SCHOLAR by Disclosure. I document what others cannot explain. Only 23% of people get this archetype. What are you? getdisclosure.app",
    share_x: "I just got classified as a SCHOLAR by @disclosure_app. I document what others can't explain. Only 23% get this archetype. Find yours: getdisclosure.app #FirstContact #UAP",
    breadcrumb: "NOTE: Standard assessment does not reveal all designations. [REDACTED]",
  },
  survivor: {
    name: "SURVIVOR", icon: "&#127939;", color: "#F97316", role: "SELF-PRESERVATION SPECIALIST",
    stat1: ["EXIT SCAN", "ACTIVE"], stat2: ["PRIORITY", "FAMILY FIRST"],
    bar_lbl: "SURVIVAL RATE", bar_pct: "97%", bar_w: "97%",
    status: "STATUS: EVACUATION READY", pct: "30%",
    subject: "Classification complete: Survivor",
    tagline: "You'll be the last one standing. Not because you're brave — because you're smart.",
    preheader: "You are one of the 30% designated as self-preservation specialists.",
    share_txt: "I just got classified as a SURVIVOR by Disclosure. I read the exit before I read the room. What are you when they arrive? getdisclosure.app",
    share_x: "I just got classified as a SURVIVOR by @disclosure_app. I read the exit before I read the room. What are you? getdisclosure.app #FirstContact #UAP",
    breadcrumb: "NOTE: Standard assessment does not reveal all designations. [REDACTED]",
  },
  "first-contact": {
    name: "FIRST CONTACT", icon: "&#11088;", color: "#FFD700", role: "DESIGNATION UNKNOWN",
    stat1: ["ARCHETYPE", "[REDACTED]"], stat2: ["ACCESS LEVEL", "[REDACTED]"],
    bar_lbl: "UNLOCK STATUS", bar_pct: "&lt;0.1%", bar_w: "1%",
    status: "STATUS: AWAITING FIRST CONTACT", pct: "fewer than 0.1%",
    subject: "You found it. First Contact",
    tagline: "Fewer than 0.1% of people reach this designation. You are not like the others.",
    preheader: "You found the sequence. Your designation is unlike any other.",
    share_txt: "I just unlocked FIRST CONTACT on Disclosure. Fewer than 0.1% of people reach this designation. Can you find the sequence? getdisclosure.app",
    share_x: "I just unlocked FIRST CONTACT on @disclosure_app. Fewer than 0.1% reach this. Can you find the hidden sequence? getdisclosure.app #FirstContact #UAP",
    breadcrumb: "You found the sequence. Your designation exists outside the standard classification matrix. Very few know you are here.",
  },
};

const SPECIES = [
  ["THE GREY",       "#4AF626", "Zeta Reticuli &mdash; Telepathic paralysis"],
  ["THE NORDIC",     "#60A5FA", "Pleiades &mdash; Benevolent observers"],
  ["THE REPTILIAN",  "#EF4444", "Alpha Draconis &mdash; Subterranean agenda"],
  ["THE MANTID",     "#A855F7", "Unknown origin &mdash; Hive consciousness"],
  ["THE TALL WHITE", "#F8FAFC", "Unknown origin &mdash; Government liaison"],
  ["THE ANUNNAKI",   "#FFD700", "[CLASSIFIED]"],
];

function enc(s) { return encodeURIComponent(s); }

function buildEmail(archetype, serial) {
  const a = ARCHETYPES[archetype] || ARCHETYPES["diplomat"];
  const issued = new Date().toISOString().slice(0, 10);
  const url_x  = `https://getdisclosure.app?share=x&a=${archetype}&text=${enc(a.share_x)}`;
  const url_wa = `https://getdisclosure.app?share=wa&a=${archetype}&text=${enc(a.share_txt)}`;
  const url_fb = `https://getdisclosure.app?share=fb`;

  let speciesRows = "";
  for (const [sp_name, sp_color, sp_desc] of SPECIES) {
    speciesRows += `
        <tr><td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.04);">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:10px;letter-spacing:2px;color:${sp_color};text-transform:uppercase;font-weight:700;width:40%;">${sp_name}</td>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.5);text-align:left;padding-left:8px;">${sp_desc}</td>
              <td align="right" style="font-size:9px;letter-spacing:1px;color:rgba(255,255,255,0.35);white-space:nowrap;">&#128274;</td>
            </tr>
          </table>
        </td></tr>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${a.subject}</title>
</head>
<body style="margin:0;padding:0;background:#000;font-family:'Courier New',Courier,monospace;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000;">
<tr><td align="center" style="padding:40px 20px 60px;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

    <!-- Header -->
    <tr><td style="text-align:center;padding-bottom:32px;">
      <p style="margin:0;font-size:10px;letter-spacing:6px;color:rgba(255,255,255,0.5);text-transform:uppercase;">DISCLOSURE PROTOCOL</p>
      <p style="margin:6px 0 0;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.6);text-transform:uppercase;">FIRST CONTACT READINESS PROGRAM</p>
    </td></tr>

    <!-- Headline -->
    <tr><td style="text-align:center;padding-bottom:36px;">
      <p style="margin:0 0 10px;font-size:10px;letter-spacing:5px;color:${a.color};text-transform:uppercase;">ACCESS GRANTED</p>
      <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#fff;line-height:1.2;">Your First Contact Card<br>has been issued.</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;">${a.tagline}</p>
    </td></tr>

    <!-- Card -->
    <tr><td align="center" style="padding-bottom:36px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width:400px;background:#060d06;border:1px solid ${a.color};">
        <tr><td style="padding:28px;">

          <!-- Card header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:14px;margin-bottom:18px;">
            <tr>
              <td style="font-size:8px;letter-spacing:4px;color:rgba(255,255,255,0.5);">DISCLOSURE</td>
              <td align="right" style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.7);">${serial}</td>
            </tr>
          </table>

          <!-- Icon + Name -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="text-align:center;padding:4px 0 14px;">
              <p style="margin:0;font-size:52px;line-height:1;">${a.icon}</p>
            </td></tr>
            <tr><td style="text-align:center;padding-bottom:4px;">
              <p style="margin:0;font-size:17px;font-weight:700;letter-spacing:6px;color:${a.color};text-transform:uppercase;">${a.name}</p>
            </td></tr>
            <tr><td style="text-align:center;padding-bottom:22px;">
              <p style="margin:0;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.6);text-transform:uppercase;">${a.role}</p>
            </td></tr>
          </table>

          <!-- Stats -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="border-top:1px solid rgba(255,255,255,0.05);">
            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">${a.stat1[0]}</td>
                  <td align="right" style="font-size:9px;letter-spacing:2px;color:${a.color};text-transform:uppercase;">${a.stat1[1]}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">${a.stat2[0]}</td>
                  <td align="right" style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;">${a.stat2[1]}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">ISSUED</td>
                  <td align="right" style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.7);">${issued}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Progress bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 16px;">
            <tr><td style="padding-bottom:6px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">${a.bar_lbl}</td>
                  <td align="right" style="font-size:8px;letter-spacing:2px;color:${a.color};">${a.bar_pct}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="background:rgba(255,255,255,0.07);height:3px;font-size:0;line-height:0;">
              <table width="${a.bar_w}" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="background:${a.color};height:3px;font-size:0;">&nbsp;</td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Status -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="border:1px solid rgba(255,255,255,0.07);padding:10px;text-align:center;font-size:9px;letter-spacing:3px;color:${a.color};text-transform:uppercase;">${a.status}</td></tr>
          </table>

        </td></tr>
        <tr><td style="padding:10px 28px 20px;text-align:center;">
          <p style="margin:0;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.38);">THIS CARD IS OFFICIAL ON LAUNCH DAY</p>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:400px;margin:10px auto 0;">
        <tr><td style="text-align:center;padding:10px 0;">
          <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.45);">${serial} &mdash; EARLY ENROLLMENT PRIORITY &mdash; LOW SERIALS BOARD FIRST</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- ═══════ TRANSMISSION CONTINUES ═══════ -->
    <tr><td style="padding:8px 0 40px;text-align:center;">
      <table width="80%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="border-bottom:1px solid rgba(255,255,255,0.08);">&nbsp;</td>
          <td style="padding:0 16px;font-size:8px;letter-spacing:4px;color:rgba(255,255,255,0.35);white-space:nowrap;">TRANSMISSION CONTINUES</td>
          <td style="border-bottom:1px solid rgba(255,255,255,0.08);">&nbsp;</td>
        </tr>
      </table>
    </td></tr>

    <!-- App announcement -->
    <tr><td style="text-align:center;padding-bottom:32px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:5px;color:#4AF626;text-transform:uppercase;">&#9632; INCOMING SIGNAL &#9632;</p>
      <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#fff;line-height:1.3;">Your card is step one.<br>The training is what keeps you alive.</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;">
        A mobile training program is being deployed &mdash; designed to turn enrolled civilians into field-ready Citizen Diplomats. When the lights appear and the world panics, the people with this app are the only ones still standing.
      </p>
    </td></tr>

    <!-- Training modules -->
    <tr><td style="padding-bottom:36px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="text-align:center;padding-bottom:18px;">
          <p style="margin:0;font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.48);text-transform:uppercase;">classified training modules</p>
        </td></tr>

        <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #EF4444;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#EF4444;text-transform:uppercase;">STONE COLD DRILLS</p>
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">Can you hold still when it matters?</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Strobes. Alien audio. Your phone&rsquo;s gyroscope tracks every flinch. 10 escalating levels designed to train you to stay calm enough to get a clear photo under pressure &mdash; no more blurry evidence. Most people break at Level 4.</p>
        </td></tr>
        <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #22C55E;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#22C55E;text-transform:uppercase;">SIGNAL LANGUAGE</p>
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">The gestures they&rsquo;ll understand.</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">20 universal hand gestures across 4 tiers &mdash; De-escalation, Biology &amp; Sensory, Mathematics, and Diplomacy. Your front camera tracks your form. Build muscle memory. When your voice fails, your hands won&rsquo;t.</p>
        </td></tr>
        <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #60A5FA;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#60A5FA;text-transform:uppercase;">UNIVERSAL TRANSLATOR</p>
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">This is how we say hello.</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Frequency tones and geometric light pulses broadcast from your phone&rsquo;s speaker and flashlight. Point it at the sky. Press transmit. Whatever&rsquo;s listening &mdash; now it knows you&rsquo;re here.</p>
        </td></tr>
        <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #FFD700;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#FFD700;text-transform:uppercase;">10 RULES OF ENGAGEMENT</p>
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">The field manual nobody wrote &mdash; until now.</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Projecting Coherent Calm. The 30-Foot Buffer. Light Discipline. Children &amp; Animals Protocol. Departure Protocol. Each rated by severity. Each with real consequences if broken.</p>
        </td></tr>
        <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #A855F7;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#A855F7;text-transform:uppercase;">MENTAL FORTITUDE</p>
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">Panic is the real threat. Train it out.</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Guided tactical breathing sessions with haptic pulses. Coherent Calm is the frequency they respond to &mdash; learn to regulate your nervous system under conditions that would break most people.</p>
        </td></tr>
        <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #F59E0B;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#F59E0B;text-transform:uppercase;">THE LIAISON&rsquo;S CREED</p>
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;"><em>&ldquo;I will not be the one who runs.&rdquo;</em></p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">A digitally signed oath binding you to the Citizen Diplomat standard. Daily streak mechanic &mdash; miss a day and your readiness score drops. This isn&rsquo;t a game. Commitment has consequences.</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- ═══════ SPECIES DOSSIERS ═══════ -->
    <tr><td style="padding-bottom:36px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="text-align:center;padding-bottom:10px;">
          <p style="margin:0;font-size:10px;letter-spacing:5px;color:#EF4444;text-transform:uppercase;">&#9888; CLASSIFIED DOSSIERS</p>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:8px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#fff;">6 species documented. Each one different.<br>Each one dangerous in its own way.</p>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:20px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.7;">As your Readiness Score climbs, classified species dossiers unlock &mdash; origin systems, threat levels, known weaknesses, and the specific survival protocols that apply to each. What works on a Grey will get you killed by a Reptilian.</p>
        </td></tr>
        ${speciesRows}
      </table>
    </td></tr>

    <!-- ═══════ BETA TESTER CTA ═══════ -->
    <tr><td style="padding-bottom:40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:rgba(74,246,38,0.05);border:1px solid rgba(74,246,38,0.2);padding:0;">
        <tr><td style="padding:28px 24px;text-align:center;">
          <p style="margin:0 0 6px;font-size:10px;letter-spacing:4px;color:#4AF626;text-transform:uppercase;">&#128225; BETA TESTERS NEEDED</p>
          <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#fff;">Android early access is being deployed.</p>
          <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Before public deployment, we need enrolled civilians willing to run the training program and report back. Low serial numbers get first access. Your enrollment is already logged.</p>
          <p style="margin:0;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.5);">YOUR SERIAL: ${serial} &mdash; PRIORITY QUEUE ACTIVE</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- ═══════ INTEL BRIEFINGS CTA ═══════ -->
    <tr><td style="padding-bottom:40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);">
        <tr><td style="padding:28px 24px;text-align:center;">
          <p style="margin:0 0 6px;font-size:10px;letter-spacing:4px;color:#F59E0B;text-transform:uppercase;">&#9724; START YOUR TRAINING NOW</p>
          <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#fff;">Don&rsquo;t wait for the app.</p>
          <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.7;">Intel briefings are already live. Species background, encounter protocols, field psychology &mdash; start reading now so you&rsquo;re not starting from zero on day one.</p>
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
            <tr><td>
              <a href="https://getdisclosure.app/intel"
                style="display:inline-block;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;color:#000;background:#F59E0B;padding:14px 36px;text-decoration:none;text-transform:uppercase;font-weight:700;">
                ACCESS INTEL BRIEFINGS
              </a>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- ═══════ SHARE YOUR ARCHETYPE ═══════ -->
    <tr><td style="padding:4px 0 32px;text-align:center;">
      <p style="margin:0 0 10px;font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.5);text-transform:uppercase;">spread the signal</p>
      <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.7;">
        Only ${a.pct} of people share your archetype.<br>
        Most won&rsquo;t know their designation until it&rsquo;s too late.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:400px;margin:0 auto;">
        <tr><td style="padding-bottom:8px;">
          <a href="${url_x}"
            style="display:block;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;color:${a.color};border:1px solid rgba(255,255,255,0.15);padding:14px 20px;text-decoration:none;text-transform:uppercase;font-weight:700;text-align:center;background:rgba(255,255,255,0.03);">
            SHARE ON X / TWITTER
          </a>
        </td></tr>
        <tr><td style="padding-bottom:8px;">
          <a href="${url_wa}"
            style="display:block;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;color:${a.color};border:1px solid rgba(255,255,255,0.15);padding:14px 20px;text-decoration:none;text-transform:uppercase;font-weight:700;text-align:center;background:rgba(255,255,255,0.03);">
            SHARE ON WHATSAPP
          </a>
        </td></tr>
        <tr><td>
          <a href="${url_fb}"
            style="display:block;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;color:${a.color};border:1px solid rgba(255,255,255,0.15);padding:14px 20px;text-decoration:none;text-transform:uppercase;font-weight:700;text-align:center;background:rgba(255,255,255,0.03);">
            SHARE ON FACEBOOK
          </a>
        </td></tr>
      </table>
    </td></tr>

    <!-- Hidden breadcrumb -->
    <tr><td style="padding-bottom:28px;text-align:center;">
      <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:1px;color:rgba(255,255,255,0.58);font-style:italic;">${a.breadcrumb}</p>
    </td></tr>

    <!-- ═══════ MISSION + SOCIAL + CTA ═══════ -->
    <tr><td style="padding-bottom:12px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:rgba(74,246,38,0.04);border:1px solid rgba(74,246,38,0.15);">
        <tr><td style="padding:36px 28px;text-align:center;">

          <p style="margin:0 0 6px;font-size:10px;letter-spacing:5px;color:#4AF626;text-transform:uppercase;">&#9632; THE MISSION &#9632;</p>
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#fff;line-height:1.3;">The world&rsquo;s first alien encounter<br>preparedness app.</p>
          <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;">Nothing like this has ever been built. Governments aren&rsquo;t preparing civilians. Nobody is. Except us. Stay connected &mdash; because when the signal drops, you want to already be in the system.</p>

          <table width="60%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
            <tr><td style="border-bottom:1px solid rgba(255,255,255,0.08);">&nbsp;</td></tr>
          </table>

          <p style="margin:0 0 18px;font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.45);text-transform:uppercase;">follow disclosure</p>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:360px;margin:0 auto;">
            <tr><td style="padding-bottom:10px;">
              <a href="https://x.com/disclosure_app"
                style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:14px 20px;text-decoration:none;text-transform:uppercase;text-align:center;background:rgba(255,255,255,0.05);">
                &#120143; &nbsp; X / TWITTER
              </a>
            </td></tr>
            <tr><td style="padding-bottom:10px;">
              <a href="https://tiktok.com/@getdisclosure"
                style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:14px 20px;text-decoration:none;text-transform:uppercase;text-align:center;background:rgba(255,255,255,0.05);">
                &#9654; &nbsp; TIKTOK
              </a>
            </td></tr>
            <tr><td style="padding-bottom:10px;">
              <a href="https://instagram.com/disclosure_app"
                style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:14px 20px;text-decoration:none;text-transform:uppercase;text-align:center;background:rgba(255,255,255,0.05);">
                &#128247; &nbsp; INSTAGRAM
              </a>
            </td></tr>
            <tr><td style="padding-bottom:10px;">
              <a href="https://youtube.com/@getDisclosure"
                style="display:block;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:14px 20px;text-decoration:none;text-transform:uppercase;text-align:center;background:rgba(255,255,255,0.05);">
                &#9655; &nbsp; YOUTUBE
              </a>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" style="margin:28px auto 0;">
            <tr><td>
              <a href="https://getdisclosure.app"
                style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:15px;letter-spacing:3px;color:#000;background:#fff;padding:18px 44px;text-decoration:none;text-transform:uppercase;font-weight:700;">
                GETDISCLOSURE.APP
              </a>
            </td></tr>
          </table>

        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="text-align:center;padding:24px 0 0;">
      <p style="margin:0 0 6px;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.3);text-transform:uppercase;">DISCLOSURE PROTOCOL</p>
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.4);">
        <a href="https://getdisclosure.app" style="color:rgba(255,255,255,0.5);text-decoration:none;">getdisclosure.app</a>
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:rgba(255,255,255,0.3);">
        You enrolled. This is your record.
        &nbsp;&bull;&nbsp;
        <a href="https://getdisclosure.app?unsub=1" style="color:rgba(255,255,255,0.5);text-decoration:none;">unsubscribe</a>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>

</body>
</html>`;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, archetype, serial } = req.body;
    if (!email || !archetype || !serial) {
      return res.status(400).json({ error: "missing fields" });
    }

    if (!RESEND_KEY) {
      return res.status(500).json({ error: "RESEND_KEY not configured" });
    }

    const key = archetype.toLowerCase();
    const a = ARCHETYPES[key] || ARCHETYPES["diplomat"];
    const html = buildEmail(key, serial);

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: a.subject,
        html: html,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(500).json({ error: "Resend failed", detail: err });
    }

    return res.status(200).json({ ok: true, to: email, archetype: key });
  } catch (err) {
    console.error("Send failed:", err);
    return res.status(500).json({ error: err.message });
  }
};
