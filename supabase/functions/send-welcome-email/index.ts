const SMTP_HOST = "smtp.hostinger.com";
const SMTP_PORT = 465;
const SMTP_USER = "team@getdisclosure.app";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";

type ArchetypeEmail = {
  name: string;
  icon: string;
  role: string;
  code: string;
  color: string;
  glow: string;
  subject: string;
  preheader: string;
  tagline: string;
  reveal: string;
  directive: string;
  protocol: string;
  stat1: [string, string];
  stat2: [string, string];
  stat3: [string, string];
  bar_lbl: string;
  bar_pct: string;
  bar_w: string;
  status: string;
  modules: [string, string, string];
  share: string;
};

const ARCHETYPES: Record<string, ArchetypeEmail> = {
  sentinel: {
    name: "SENTINEL",
    icon: "🛡️",
    role: "PRIMARY PROTECTOR",
    code: "ARCHETYPE 001",
    color: "#4AF626",
    glow: "rgba(74,246,38,0.42)",
    subject: "Your Sentinel file is active",
    preheader: "Classification issued. First Contact Card attached. The perimeter starts with you.",
    tagline: "You move before the crowd understands why movement is required.",
    reveal: "Your nervous system does not wait for permission. It creates a line, places itself on that line, and dares the unknown to cross it.",
    directive: "Hold position. Reduce civilian chaos. Do not escalate unless the contact event leaves you no other clean option.",
    protocol: "Your training path prioritizes perimeter discipline, light control, group positioning, and rules of engagement under impossible pressure.",
    stat1: ["THREAT READ", "ACTIVE"],
    stat2: ["ROLE ONSET", "IMMEDIATE"],
    stat3: ["PRIMARY RISK", "OVERESCALATION"],
    bar_lbl: "FIELD READINESS",
    bar_pct: "87%",
    bar_w: "87%",
    status: "PERIMETER INSTINCT CONFIRMED",
    modules: ["30-foot buffer", "Light discipline", "Contact ROE"],
    share: "I was classified as a Sentinel. If the sky opens, I am apparently the perimeter. Get your First Contact file: getdisclosure.app",
  },
  diplomat: {
    name: "DIPLOMAT",
    icon: "🤝",
    role: "DE-ESCALATION LEAD",
    code: "ARCHETYPE 002",
    color: "#22C55E",
    glow: "rgba(34,197,94,0.42)",
    subject: "Your Diplomat file is active",
    preheader: "Classification issued. First Contact Card attached. The first human signal may be yours.",
    tagline: "The outcome depends on what you say in the first 30 seconds.",
    reveal: "You read pressure before it turns into panic. Where other people raise volume, you search for timing, posture, and the one sentence that keeps contact human.",
    directive: "Slow the room. Calibrate tone. Speak only after the perimeter is stable and the signal is worth sending.",
    protocol: "Your training path prioritizes liaison timing, calming language, first-signal posture, and communication under anomalous pressure.",
    stat1: ["PROTOCOL", "ACTIVE"],
    stat2: ["THREAT RESPONSE", "DE-ESCALATE"],
    stat3: ["PRIMARY RISK", "EARLY CONTACT"],
    bar_lbl: "DIPLOMATIC RATING",
    bar_pct: "91%",
    bar_w: "91%",
    status: "CALM SIGNAL READY",
    modules: ["Liaison standard", "Tone calibration", "First signal timing"],
    share: "I was classified as a Diplomat. Apparently I am the person who speaks when everyone else forgets language. Get your First Contact file: getdisclosure.app",
  },
  scholar: {
    name: "SCHOLAR",
    icon: "🔬",
    role: "FIELD ANALYST",
    code: "ARCHETYPE 003",
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.42)",
    subject: "Your Scholar file is active",
    preheader: "Classification issued. First Contact Card attached. Your record may be the only one that survives.",
    tagline: "Your records will be the only verifiable account that survives.",
    reveal: "You do not just witness the event. You preserve it. Sequence, sound, shape, contradiction, timing: the details panic tries to delete.",
    directive: "Observe without freezing. Document without contaminating. Convert the impossible into a record someone else can verify.",
    protocol: "Your training path prioritizes incident reporting, evidence discipline, pattern recognition, and memory protection under stress.",
    stat1: ["ANALYSIS MODE", "CONTINUOUS"],
    stat2: ["DATA RETENTION", "TOTAL"],
    stat3: ["PRIMARY RISK", "TUNNEL VISION"],
    bar_lbl: "ANALYTICAL RATING",
    bar_pct: "94%",
    bar_w: "94%",
    status: "OBSERVATION THREAD OPEN",
    modules: ["Incident reports", "Evidence protocol", "Pattern anomaly log"],
    share: "I was classified as a Scholar. If contact happens, I am apparently the one making sure history does not become rumor. Get your First Contact file: getdisclosure.app",
  },
  survivor: {
    name: "SURVIVOR",
    icon: "🏃",
    role: "EXTRACTION SPECIALIST",
    code: "ARCHETYPE 004",
    color: "#F97316",
    glow: "rgba(249,115,22,0.42)",
    subject: "Your Survivor file is active",
    preheader: "Classification issued. First Contact Card attached. You saw the exit before the room changed.",
    tagline: "You read the exit before you read the room.",
    reveal: "You are not running from the event. You are preserving continuity. You know who needs to move, where they move, and when waiting becomes negligence.",
    directive: "Extract civilians. Keep the group coherent. Leave spectacle to people with worse priorities.",
    protocol: "Your training path prioritizes family drills, route selection, blackout movement, and controlled withdrawal under uncertainty.",
    stat1: ["ESCAPE VECTOR", "CALCULATED"],
    stat2: ["FAMILY PROTOCOL", "ACTIVE"],
    stat3: ["PRIMARY RISK", "PANIC SPREAD"],
    bar_lbl: "SURVIVAL RATING",
    bar_pct: "79%",
    bar_w: "79%",
    status: "EVACUATION VECTOR READY",
    modules: ["Family drill mode", "Exit mapping", "Blackout movement"],
    share: "I was classified as a Survivor. Translation: I already know where the exits are. Get your First Contact file: getdisclosure.app",
  },
  "first-contact": {
    name: "FIRST CONTACT",
    icon: "⭐",
    role: "OUTSIDE CLASSIFICATION",
    code: "BLACK CHANNEL",
    color: "#FFD700",
    glow: "rgba(255,215,0,0.46)",
    subject: "Your Disclosure file is active",
    preheader: "Your rare First Contact designation surfaced. Open the field packet.",
    tagline: "Less than 0.1% carry this designation. You know why.",
    reveal: "This is not a normal result. The system flagged a signal anomaly and moved your file outside the standard civilian classification stack.",
    directive: "Do not treat this as a trophy. Treat it as a locked door noticing you first.",
    protocol: "Your training path remains restricted until launch. The app will expose the next layer when the black channel opens.",
    stat1: ["ARCHETYPE", "CLASSIFIED"],
    stat2: ["FIELD CONF", "ANOMALY"],
    stat3: ["PRIMARY RISK", "UNKNOWN"],
    bar_lbl: "UNLOCK STATUS",
    bar_pct: "&lt;0.1%",
    bar_w: "3%",
    status: "SIGNAL ANOMALY DETECTED",
    modules: ["Restricted file", "Level 5 protocol", "Black channel watch"],
    share: "My Disclosure file returned a black-channel First Contact anomaly. Standard classification failed, which is either bad or extremely interesting. Open yours: getdisclosure.app",
  },
};

function esc(value: string): string {
  return String(value).replace(/[&<>\"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch] ?? ch));
}

function buildEmail(archetype: string, serial: string): string {
  const a = ARCHETYPES[archetype] ?? ARCHETYPES["diplomat"];
  const issued = new Date().toISOString().slice(0, 10);
  const serialSafe = esc(serial || "DS-2026-ISSUED");
  const briefingUrl = "https://getdisclosure.app/#quiz";
  const dossierUrl = `https://getdisclosure.app/archetype/${archetype === "first-contact" ? "first-contact" : archetype}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(a.share + " #FirstContact #Disclosure")}`;
  const quizUrl = "https://getdisclosure.app/#quiz";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(a.share)}`;
  const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgetdisclosure.app";
  const mailFriendUrl = `mailto:?subject=${encodeURIComponent("Get your First Contact classification")}&body=${encodeURIComponent(a.share)}`;
  const moduleRows = a.modules.map((m, i) => `
    <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="width:42px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:${a.color};">0${i + 1}</td>
        <td style="font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.35;color:#ffffff;font-weight:800;">${esc(m)}</td>
        <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:rgba(255,255,255,0.9);">QUEUED</td>
      </tr></table>
    </td></tr>`).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${esc(a.subject)}</title></head>
<body style="margin:0;padding:0;background:#000000;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:17px;line-height:1.55;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(a.preheader)}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#000000;background-image:radial-gradient(circle at 50% 0,${a.glow},transparent 34%),radial-gradient(circle at 90% 18%,rgba(255,215,0,0.12),transparent 26%),linear-gradient(180deg,#020604 0%,#000000 58%,#030603 100%);"><tr><td align="center" style="padding:26px 12px 46px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:640px;margin:0 auto;">
<tr><td style="padding:16px 0 24px;text-align:center;border-bottom:1px solid rgba(74,246,38,0.22);">
  <div style="display:inline-block;padding:9px 14px;border:1px solid rgba(216,255,155,0.24);border-radius:999px;background:rgba(0,0,0,0.5);box-shadow:0 0 30px ${a.glow};font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:900;letter-spacing:2px;color:#4AF626;line-height:1;">DISCLOSURE <span style="font-size:20px;letter-spacing:2px;color:#ffffff;vertical-align:middle;">LIVE</span></div>
  <p style="margin:12px 0 0;font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2.5px;color:rgba(255,255,255,0.95);">FIRST CONTACT READINESS PROGRAM</p>
</td></tr>

<tr><td style="padding:34px 0 24px;text-align:center;">
  <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:${a.color};font-weight:800;">CLASSIFICATION ISSUED</p>
  <h1 style="margin:0;font-size:42px;line-height:0.98;letter-spacing:-1.6px;color:#ffffff;font-weight:900;text-transform:uppercase;">Your ${esc(a.name)} file<br/>is active.</h1>
  <p style="margin:18px auto 0;max-width:500px;font-size:20px;line-height:1.65;color:#ffffff;font-weight:800;">${esc(a.reveal)}</p>
</td></tr>

<tr><td align="center" style="padding:8px 0 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:470px;border:1px solid ${a.color};border-radius:26px;background:#061006;background-image:radial-gradient(circle at 50% 0,${a.glow},transparent 36%),linear-gradient(145deg,rgba(8,22,9,0.98),rgba(0,0,0,0.82));box-shadow:0 0 0 1px rgba(255,255,255,0.05),0 30px 90px rgba(0,0,0,0.66),0 0 70px ${a.glow};overflow:hidden;">
    <tr><td style="padding:24px 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:rgba(255,255,255,0.93);">${esc(a.code)}</td>
        <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:#ffffff;">${serialSafe}</td>
      </tr></table>
    </td></tr>
    <tr><td align="center" style="padding:22px 24px 20px;">
      <div style="font-size:56px;line-height:1;margin-bottom:12px;">${a.icon}</div>
      <div style="font-family:'Courier New',Courier,monospace;font-size:26px;font-weight:900;letter-spacing:7px;color:${a.color};text-shadow:0 0 22px ${a.glow};">${esc(a.name)}</div>
      <div style="margin-top:8px;font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:#ffffff;">${esc(a.role)}</div>
      <p style="margin:18px auto 0;max-width:350px;font-size:17px;line-height:1.55;color:#ffffff;font-weight:800;">${esc(a.tagline)}</p>
    </td></tr>
    <tr><td style="padding:0 24px 22px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-top:1px solid rgba(255,255,255,0.08);">
        <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:rgba(255,255,255,0.96);">${esc(a.stat1[0])}</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:${a.color};font-weight:900;">${esc(a.stat1[1])}</td></tr></table></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:rgba(255,255,255,0.96);">${esc(a.stat2[0])}</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:#ffffff;font-weight:900;">${esc(a.stat2[1])}</td></tr></table></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:rgba(255,255,255,0.96);">${esc(a.stat3[0])}</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:#FFD66B;font-weight:900;">${esc(a.stat3[1])}</td></tr></table></td></tr>
        <tr><td style="padding:10px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:rgba(255,255,255,0.96);">ISSUED</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:#ffffff;">${issued}</td></tr></table></td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:16px 0 14px;"><tr><td style="padding-bottom:7px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:#ffffff;">${esc(a.bar_lbl)}</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:${a.color};font-weight:900;">${a.bar_pct}</td></tr></table></td></tr><tr><td style="background:rgba(255,255,255,0.11);height:9px;border-radius:999px;overflow:hidden;"><table width="${a.bar_w}" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:linear-gradient(90deg,${a.color},#FFD700);height:9px;box-shadow:0 0 20px ${a.glow};">&nbsp;</td></tr></table></td></tr></table>
      <div style="border:1px solid rgba(216,255,155,0.28);border-radius:16px;padding:12px;text-align:center;font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:${a.color};font-weight:900;background:rgba(74,246,38,0.06);">${esc(a.status)}</div>
    </td></tr>
  </table>
  <p style="margin:12px 0 0;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:rgba(255,255,255,0.96);text-align:center;">${serialSafe} // EARLY ENROLLMENT PRIORITY</p>
</td></tr>

<tr><td style="padding:2px 0 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid rgba(216,255,155,0.20);border-radius:24px;background:rgba(0,0,0,0.52);box-shadow:inset 0 0 45px rgba(74,246,38,0.045);">
    <tr><td style="padding:24px;">
      <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2.5px;color:${a.color};font-weight:900;">FIELD DIRECTIVE</p>
      <p style="margin:0;font-size:20px;line-height:1.55;color:#ffffff;font-weight:800;">${esc(a.directive)}</p>
      <p style="margin:16px 0 0;font-size:17px;line-height:1.7;color:#ffffff;font-weight:800;">${esc(a.protocol)}</p>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:0 0 28px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid rgba(255,255,255,0.12);border-radius:24px;background:linear-gradient(135deg,rgba(7,18,9,0.95),rgba(0,0,0,0.72));">
    <tr><td style="padding:22px 24px 8px;"><p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2.5px;color:#DFFF8C;font-weight:900;">LIVE MODULE STACK</p></td></tr>
    ${moduleRows}
  </table>
</td></tr>

<tr><td style="padding:0 0 28px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(74,246,38,0.34);border-radius:28px;background:#051006;background-image:radial-gradient(circle at 50% 0,rgba(74,246,38,0.22),transparent 42%),linear-gradient(135deg,rgba(7,24,10,0.98),rgba(0,0,0,0.78));box-shadow:0 0 60px rgba(74,246,38,0.14);">
    <tr><td style="padding:28px 24px;text-align:center;">
      <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2.5px;color:#4AF626;font-weight:900;">MOBILE APP INCOMING</p>
      <h2 style="margin:0 0 14px;font-size:32px;line-height:1.02;letter-spacing:-1px;color:#ffffff;font-weight:900;text-transform:uppercase;">Your card is step one.<br/>The app is the real training.</h2>
      <p style="margin:0 auto 18px;max-width:520px;font-size:20px;line-height:1.68;color:#ffffff;font-weight:800;">Disclosure is actively being built now and launching soon. The mobile app turns your archetype into drills, protocols, signal tools, species briefings, and a First Contact Card you can carry when the room goes quiet.</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0;">
        <tr>
          <td style="padding:10px;border:1px solid rgba(216,255,155,0.26);border-radius:16px;background:rgba(74,246,38,0.08);"><p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:#DFFF8C;font-weight:900;">ANDROID TEST ACCESS</p><p style="margin:7px 0 0;font-size:17px;line-height:1.45;color:#ffffff;font-weight:800;">Early testing opportunities will open before public launch.</p></td>
        </tr>
        <tr><td style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:10px;border:1px solid rgba(255,215,0,0.28);border-radius:16px;background:rgba(255,215,0,0.08);"><p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;color:#FFD66B;font-weight:900;">LOW SERIALS BOARD FIRST</p><p style="margin:7px 0 0;font-size:17px;line-height:1.45;color:#ffffff;font-weight:800;">You are already in the queue. Friends who classify now enter before the signal gets loud.</p></td>
        </tr>
      </table>
    </td></tr>
  </table>
</td></tr>

<tr><td align="center" style="padding:0 0 36px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:0 0 14px;"><a href="${briefingUrl}" style="display:inline-block;background:#4AF626;color:#020302;font-family:'Courier New',Courier,monospace;font-size:20px;letter-spacing:2px;padding:18px 34px;text-decoration:none;font-weight:900;border-radius:999px;box-shadow:0 0 38px rgba(74,246,38,0.42);">ACCESS YOUR BRIEFING</a></td></tr>
    <tr><td align="center" style="padding:0 0 20px;"><a href="${dossierUrl}" style="font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:#DFFF8C;text-decoration:none;font-weight:900;">OPEN ARCHETYPE DOSSIER</a></td></tr>
    <tr><td style="padding:20px;border:1px solid rgba(255,255,255,0.16);border-radius:22px;background:rgba(255,255,255,0.045);text-align:center;">
      <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2.5px;color:#FFD66B;font-weight:900;">SPREAD THE SIGNAL</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.55;color:#ffffff;font-weight:800;">Post your classification. Challenge your group chat. Make them find out who they become when the sky stops pretending.</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:5px;"><a href="${shareUrl}" style="display:block;border:1px solid rgba(216,255,155,0.35);border-radius:999px;padding:13px 12px;color:#DFFF8C;text-decoration:none;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;font-weight:900;background:rgba(74,246,38,0.08);">POST ON X</a></td></tr>
        <tr><td style="padding:5px;"><a href="${whatsappUrl}" style="display:block;border:1px solid rgba(34,197,94,0.35);border-radius:999px;padding:13px 12px;color:#ffffff;text-decoration:none;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;font-weight:900;background:rgba(34,197,94,0.08);">SEND TO GROUP CHAT</a></td></tr>
        <tr><td style="padding:5px;"><a href="${facebookUrl}" style="display:block;border:1px solid rgba(96,165,250,0.35);border-radius:999px;padding:13px 12px;color:#ffffff;text-decoration:none;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;font-weight:900;background:rgba(96,165,250,0.08);">SHARE ON FACEBOOK</a></td></tr>
        <tr><td style="padding:5px;"><a href="${mailFriendUrl}" style="display:block;border:1px solid rgba(255,215,0,0.35);border-radius:999px;padding:13px 12px;color:#FFD66B;text-decoration:none;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;font-weight:900;background:rgba(255,215,0,0.08);">TELL A FRIEND</a></td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:22px 0 0;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
  <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:rgba(255,255,255,0.95);">BLACK CHANNEL FIELD PACKET // DO NOT IGNORE SKYBORNE ANOMALIES</p>
  <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:rgba(255,255,255,0.96);">getdisclosure.app</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

async function smtpSend(to: string, subject: string, html: string) {
  const conn = await Deno.connectTls({ hostname: SMTP_HOST, port: SMTP_PORT });

  const write = async (data: string) => {
    const w = conn.writable.getWriter();
    await w.write(enc.encode(data + "\r\n"));
    w.releaseLock();
  };

  const read = async (): Promise<string> => {
    const buf = new Uint8Array(4096);
    const n = await conn.read(buf);
    return n ? dec.decode(buf.subarray(0, n)) : "";
  };

  // Read greeting
  const greeting = await read();
  console.log("SMTP greeting:", greeting.trim());

  // EHLO
  await write("EHLO getdisclosure.app");
  const ehlo = await read();
  console.log("EHLO resp:", ehlo.substring(0, 100));

  // AUTH PLAIN (single step, more reliable than AUTH LOGIN)
  const authStr = btoa(`\0${SMTP_USER}\0${SMTP_PASS}`);
  await write(`AUTH PLAIN ${authStr}`);
  const authResp = await read();
  console.log("AUTH resp:", authResp.trim());
  if (!authResp.startsWith("235")) {
    throw new Error("SMTP auth failed: " + authResp.trim());
  }

  // MAIL FROM
  await write(`MAIL FROM:<${SMTP_USER}>`);
  const fromResp = await read();
  console.log("MAIL FROM resp:", fromResp.trim());

  // RCPT TO
  await write(`RCPT TO:<${to}>`);
  const rcptResp = await read();
  console.log("RCPT TO resp:", rcptResp.trim());

  // DATA
  await write("DATA");
  const dataResp = await read();
  console.log("DATA resp:", dataResp.trim());

  // Send message content
  const msgId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@getdisclosure.app>`;
  const message = [
    `Message-ID: ${msgId}`,
    `Date: ${new Date().toUTCString()}`,
    `From: Disclosure Protocol <${SMTP_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    html.replace(/\r?\n\.\r?\n/g, "\r\n..\r\n"),  // escape lone dots
    ``,
    `.`,
  ].join("\r\n");

  const w = conn.writable.getWriter();
  await w.write(enc.encode(message + "\r\n"));
  w.releaseLock();

  const sendResp = await read();
  console.log("SEND resp:", sendResp.trim());
  if (!sendResp.startsWith("250")) {
    throw new Error("SMTP send failed: " + sendResp.trim());
  }

  // QUIT
  await write("QUIT");
  try { await read(); } catch (_) {}
  try { conn.close(); } catch (_) {}
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" } });
  }

  try {
    const { record } = await req.json();
    const { email, archetype, serial_number } = record;
    if (!email || !archetype || !serial_number) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    const a = ARCHETYPES[archetype.toLowerCase()] ?? ARCHETYPES["diplomat"];
    const html = buildEmail(archetype.toLowerCase(), serial_number);
    await smtpSend(email, a.subject, html);

    console.log(`Card sent: ${email} | ${archetype} | ${serial_number}`);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Send failed:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
