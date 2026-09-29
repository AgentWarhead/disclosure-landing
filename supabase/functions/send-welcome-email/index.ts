const SMTP_HOST = "smtp.hostinger.com";
const SMTP_PORT = 465;
const SMTP_USER = "team@getdisclosure.app";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";
// Optional shared secret. When set, callers (the database webhook) must send it in the
// x-webhook-secret header. Set it in the function's secrets and in the webhook's headers.
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

// NOTE: this function duplicates api/send-card.js (Resend, deployed with the site). If both are wired,
// a signup gets two emails. Keep one sender. This file is not deployed from the site repo; deploy by hand.
// TODO(boss): CASL needs the sender's mailing address in every commercial email. Add it before use.

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;
const SERIAL_RE = /^[A-Z0-9-]{4,24}$/;
const UNSUB_MAILTO = "mailto:team@getdisclosure.app?subject=unsubscribe";
const UNSUB_PAGE = "https://www.getdisclosure.app/privacy/#unsubscribe";

/** Removes CR, LF and other control characters so a value can never start a new SMTP line or header. */
function headerSafe(value: string): string {
  return String(value).replace(/[\r\n\x00-\x1f\x7f]/g, "");
}

function validEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value.length < 6 || value.length > 254) return false;
  if (/[\s\x00-\x1f\x7f]/.test(value)) return false;
  if ((value.match(/@/g) || []).length !== 1) return false;
  if (value.includes("..")) return false;
  return EMAIL_RE.test(value);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

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
    tagline: "This designation is not assigned. It appears.",
    reveal: "This is not a normal result. The system flagged a signal anomaly and moved your file outside the standard civilian classification stack.",
    directive: "Do not treat this as a trophy. Treat it as a locked door noticing you first.",
    protocol: "Your training path remains restricted until launch. The app will expose the next layer when the black channel opens.",
    stat1: ["ARCHETYPE", "CLASSIFIED"],
    stat2: ["FIELD CONF", "ANOMALY"],
    stat3: ["PRIMARY RISK", "UNKNOWN"],
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
  <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:2px;color:rgba(255,255,255,0.96);">getdisclosure.app</p>
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:rgba(255,255,255,0.8);">You are getting this because this address was entered at getdisclosure.app. To stop all email from DISCLOSURE, reply with the word unsubscribe or <a href="${UNSUB_MAILTO}" style="color:#ffffff;">email team@getdisclosure.app</a>. Not affiliated with any government agency.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

async function smtpSend(toRaw: string, subjectRaw: string, html: string) {
  const to = headerSafe(toRaw);
  const subject = headerSafe(subjectRaw);
  if (!validEmail(to)) throw new Error("invalid recipient");
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
  await read();

  // EHLO
  await write("EHLO getdisclosure.app");
  await read();

  // AUTH PLAIN (single step, more reliable than AUTH LOGIN)
  const authStr = btoa(`\0${SMTP_USER}\0${SMTP_PASS}`);
  await write(`AUTH PLAIN ${authStr}`);
  const authResp = await read();
  if (!authResp.startsWith("235")) {
    throw new Error("SMTP auth failed: " + authResp.slice(0, 3));
  }

  // MAIL FROM
  await write(`MAIL FROM:<${SMTP_USER}>`);
  const fromResp = await read();
  if (!fromResp.startsWith("250")) throw new Error("SMTP MAIL FROM " + fromResp.slice(0, 3));

  // RCPT TO
  await write(`RCPT TO:<${to}>`);
  const rcptResp = await read();
  if (!rcptResp.startsWith("25")) throw new Error("SMTP RCPT " + rcptResp.slice(0, 3));

  // DATA
  await write("DATA");
  const dataResp = await read();
  if (!dataResp.startsWith("354")) throw new Error("SMTP DATA " + dataResp.slice(0, 3));

  // Send message content
  const msgId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@getdisclosure.app>`;
  const message = [
    `Message-ID: ${msgId}`,
    `Date: ${new Date().toUTCString()}`,
    `From: Disclosure Protocol <${SMTP_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `List-Unsubscribe: <${UNSUB_MAILTO}>, <${UNSUB_PAGE}>`,
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
  if (!sendResp.startsWith("250")) {
    throw new Error("SMTP send failed: " + sendResp.slice(0, 3));
  }

  // QUIT
  await write("QUIT");
  try { await read(); } catch (_) {}
  try { conn.close(); } catch (_) {}
}

Deno.serve(async (req: Request) => {
  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  if (req.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
  if (WEBHOOK_SECRET && !safeEqual(req.headers.get("x-webhook-secret") ?? "", WEBHOOK_SECRET)) {
    return json(401, { ok: false, error: "unauthorized" });
  }

  let record: Record<string, unknown> | undefined;
  try {
    record = (await req.json())?.record;
  } catch (_) {
    return json(400, { ok: false, error: "invalid_body" });
  }
  if (!record || typeof record !== "object") return json(400, { ok: false, error: "invalid_body" });

  const email = typeof record.email === "string" ? record.email.trim() : "";
  const archetype = typeof record.archetype === "string" ? record.archetype.trim().toLowerCase() : "";
  const serial = typeof record.serial_number === "string" ? record.serial_number.trim() : "";

  // Validate before the address goes anywhere near an SMTP command or header.
  if (!validEmail(email)) return json(400, { ok: false, error: "invalid_email" });
  if (!Object.prototype.hasOwnProperty.call(ARCHETYPES, archetype)) return json(400, { ok: false, error: "invalid_archetype" });
  if (!SERIAL_RE.test(serial)) return json(400, { ok: false, error: "invalid_serial" });

  try {
    await smtpSend(email, ARCHETYPES[archetype].subject, buildEmail(archetype, serial));
    console.log("Card sent: role " + archetype); // never log the address
    return json(200, { ok: true });
  } catch (err) {
    console.error("Send failed:", err instanceof Error ? err.message : "unknown");
    return json(500, { ok: false, error: "send_failed" });
  }
});
