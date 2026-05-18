const RESEND_KEY = process.env.RESEND_KEY || "";
const FROM_EMAIL = "Disclosure Protocol <team@getdisclosure.app>";

const ARCHETYPES = {
  sentinel: {
    name: "SENTINEL", icon: "🛡️", role: "PRIMARY PROTECTOR", code: "ARCHETYPE 001",
    color: "#FA3E3E", glow: "rgba(250,62,62,0.42)", subject: "Your Sentinel file is active",
    preheader: "Classification issued. First Contact Card attached. The perimeter starts with you.",
    tagline: "You move before the crowd understands why movement is required.",
    reveal: "Your nervous system does not wait for permission. It creates a line, places itself on that line, and dares the unknown to cross it.",
    directive: "Hold position. Reduce civilian chaos. Do not escalate unless the contact event leaves you no other clean option.",
    protocol: "Your training path prioritizes perimeter discipline, light control, group positioning, and rules of engagement under impossible pressure.",
    stat1: ["THREAT READ", "ACTIVE"], stat2: ["ROLE ONSET", "IMMEDIATE"], stat3: ["PRIMARY RISK", "OVERESCALATION"],
    bar_lbl: "FIELD READINESS", bar_pct: "87%", bar_w: "87%", status: "PERIMETER INSTINCT CONFIRMED",
    modules: ["30-foot buffer", "Light discipline", "Contact ROE"], pct: "25%",
    share_txt: "I was classified as a Sentinel. If the sky opens, I am apparently the perimeter. Get your First Contact file: getdisclosure.app",
  },
  diplomat: {
    name: "DIPLOMAT", icon: "🤝", role: "DE-ESCALATION LEAD", code: "ARCHETYPE 002",
    color: "#22C55E", glow: "rgba(34,197,94,0.42)", subject: "Your Diplomat file is active",
    preheader: "Classification issued. First Contact Card attached. The first human signal may be yours.",
    tagline: "The outcome depends on what you say in the first 30 seconds.",
    reveal: "You read pressure before it turns into panic. Where other people raise volume, you search for timing, posture, and the one sentence that keeps contact human.",
    directive: "Slow the room. Calibrate tone. Speak only after the perimeter is stable and the signal is worth sending.",
    protocol: "Your training path prioritizes liaison timing, calming language, first-signal posture, and communication under anomalous pressure.",
    stat1: ["PROTOCOL", "ACTIVE"], stat2: ["THREAT RESPONSE", "DE-ESCALATE"], stat3: ["PRIMARY RISK", "EARLY CONTACT"],
    bar_lbl: "DIPLOMATIC RATING", bar_pct: "91%", bar_w: "91%", status: "CALM SIGNAL READY",
    modules: ["Liaison standard", "Tone calibration", "First signal timing"], pct: "30%",
    share_txt: "I was classified as a Diplomat. Apparently I am the person who speaks when everyone else forgets language. Get your First Contact file: getdisclosure.app",
  },
  scholar: {
    name: "SCHOLAR", icon: "🔬", role: "FIELD ANALYST", code: "ARCHETYPE 003",
    color: "#3B82F6", glow: "rgba(59,130,246,0.42)", subject: "Your Scholar file is active",
    preheader: "Classification issued. First Contact Card attached. Your record may be the only one that survives.",
    tagline: "Your records will be the only verifiable account that survives.",
    reveal: "You do not just witness the event. You preserve it. Sequence, sound, shape, contradiction, timing: the details panic tries to delete.",
    directive: "Observe without freezing. Document without contaminating. Convert the impossible into a record someone else can verify.",
    protocol: "Your training path prioritizes incident reporting, evidence discipline, pattern recognition, and memory protection under stress.",
    stat1: ["ANALYSIS MODE", "CONTINUOUS"], stat2: ["DATA RETENTION", "TOTAL"], stat3: ["PRIMARY RISK", "TUNNEL VISION"],
    bar_lbl: "ANALYTICAL RATING", bar_pct: "94%", bar_w: "94%", status: "OBSERVATION THREAD OPEN",
    modules: ["Incident reports", "Evidence protocol", "Pattern anomaly log"], pct: "15%",
    share_txt: "I was classified as a Scholar. If contact happens, I am apparently the one making sure history does not become rumor. Get your First Contact file: getdisclosure.app",
  },
  survivor: {
    name: "SURVIVOR", icon: "🏃", role: "EXTRACTION SPECIALIST", code: "ARCHETYPE 004",
    color: "#F97316", glow: "rgba(249,115,22,0.42)", subject: "Your Survivor file is active",
    preheader: "Classification issued. First Contact Card attached. You saw the exit before the room changed.",
    tagline: "You read the exit before you read the room.",
    reveal: "You are not running from the event. You are preserving continuity. You know who needs to move, where they move, and when waiting becomes negligence.",
    directive: "Extract civilians. Keep the group coherent. Leave spectacle to people with worse priorities.",
    protocol: "Your training path prioritizes family drills, route selection, blackout movement, and controlled withdrawal under uncertainty.",
    stat1: ["ESCAPE VECTOR", "CALCULATED"], stat2: ["FAMILY PROTOCOL", "ACTIVE"], stat3: ["PRIMARY RISK", "PANIC SPREAD"],
    bar_lbl: "SURVIVAL RATING", bar_pct: "79%", bar_w: "79%", status: "EVACUATION VECTOR READY",
    modules: ["Family drill mode", "Exit mapping", "Blackout movement"], pct: "30%",
    share_txt: "I was classified as a Survivor. Translation: I already know where the exits are. Get your First Contact file: getdisclosure.app",
  },
  "first-contact": {
    name: "FIRST CONTACT", icon: "⭐", role: "OUTSIDE CLASSIFICATION", code: "BLACK CHANNEL",
    color: "#FFD700", glow: "rgba(255,215,0,0.46)", subject: "Your Disclosure file is active",
    preheader: "Your rare First Contact designation surfaced. Open the field packet.",
    tagline: "Less than 0.1% carry this designation. You know why.",
    reveal: "This is not a normal result. The system flagged a signal anomaly and moved your file outside the standard civilian classification stack.",
    directive: "Do not treat this as a trophy. Treat it as a locked door noticing you first.",
    protocol: "Your training path remains restricted until launch. The app will expose the next layer when the black channel opens.",
    stat1: ["ARCHETYPE", "CLASSIFIED"], stat2: ["FIELD CONF", "ANOMALY"], stat3: ["PRIMARY RISK", "UNKNOWN"],
    bar_lbl: "UNLOCK STATUS", bar_pct: "&lt;0.1%", bar_w: "3%", status: "SIGNAL ANOMALY DETECTED",
    modules: ["Restricted file", "Level 5 protocol", "Black channel watch"], pct: "fewer than 0.1%",
    share_txt: "My Disclosure file returned a black-channel First Contact anomaly. Standard classification failed, which is either bad or extremely interesting. Open yours: getdisclosure.app",
  },
};

function enc(s) { return encodeURIComponent(s); }
function esc(value) {
  return String(value).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch] || ch));
}

function urlsFor(archetype, shareText) {
  const base = "https://getdisclosure.app";
  const dossierPath = archetype === "first-contact" ? "first-contact" : archetype;
  return {
    home: base,
    quiz: `${base}/#quiz`,
    access: `${base}/#access`,
    fieldKit: `${base}/#classified-tools`,
    simulator: `${base}/#protocol-simulator`,
    packet: `${base}/#transmission-packet`,
    archetypes: `${base}/archetypes`,
    dossier: `${base}/archetype/${dossierPath}`,
    intel: `${base}/intel`,
    signal: `${base}/#transmission-packet`,
    share: `${base}/?share=x&a=${archetype}&text=${enc(shareText)}`,
    group: `${base}/?ref=group-chat#quiz`,
    friend: `${base}/?ref=friend#quiz`,
  };
}

function buildPlainText(archetype, serial) {
  const a = ARCHETYPES[archetype] || ARCHETYPES["diplomat"];
  const u = urlsFor(archetype, a.share_txt);
  return [
    `DISCLOSURE // CLASSIFICATION ISSUED`,
    `Serial: ${serial || "DS-2026-ISSUED"}`,
    `Designation: ${a.name}`,
    `Role: ${a.role}`,
    `Status: ${a.status}`,
    ``,
    a.tagline,
    ``,
    `FIELD DIRECTIVE`,
    a.directive,
    ``,
    `TRAINING QUEUE`,
    `01 ${a.modules[0]}`,
    `02 ${a.modules[1]}`,
    `03 ${a.modules[2]}`,
    ``,
    `OPEN YOUR FULL ${a.name} DOSSIER`,
    u.dossier,
    ``,
    `CLAIM APP ACCESS`,
    u.access,
    ``,
    `SPREAD THE SIGNAL`,
    a.share_txt,
    ``,
    `getdisclosure.app`,
  ].join("\n");
}

function buildEmail(archetype, serial) {
  const a = ARCHETYPES[archetype] || ARCHETYPES["diplomat"];
  const issued = new Date().toISOString().slice(0, 10);
  const serialSafe = esc(serial || "DS-2026-ISSUED");
  const u = urlsFor(archetype, a.share_txt);
  const c = a.color;
  const glow = a.glow;
  const button = (label, href, filled = false) => `<a href="${href}" style="display:inline-block;width:100%;box-sizing:border-box;text-align:center;text-decoration:none;border-radius:999px;padding:15px 16px;font-family:'Courier New',Courier,monospace;font-size:15px;line-height:1.15;letter-spacing:1.6px;font-weight:900;${filled ? `background:linear-gradient(90deg,#dfff8c,#4AF626);color:#020302;border:1px solid #dfff8c;box-shadow:0 0 34px rgba(74,246,38,0.35);` : `background:rgba(255,255,255,0.045);color:#ffffff;border:1px solid rgba(255,255,255,0.18);`}">${label}</a>`;
  const moduleRows = a.modules.map((m, i) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
          <td style="width:38px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2px;color:${c};font-weight:900;">0${i + 1}</td>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;color:#ffffff;font-weight:800;">${esc(m)}</td>
          <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.8px;color:rgba(216,255,155,0.82);">QUEUED</td>
        </tr></table>
      </td>
    </tr>`).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${esc(a.subject)}</title></head>
<body style="margin:0;padding:0;background:#000000;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:16px;line-height:1.5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(a.preheader)}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#000000;background-image:radial-gradient(circle at 50% 0,${glow},transparent 34%),linear-gradient(180deg,#020604 0%,#000000 62%,#030603 100%);"><tr><td align="center" style="padding:24px 12px 42px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:620px;margin:0 auto;">
<tr><td style="padding:14px 0 20px;text-align:center;border-bottom:1px solid rgba(74,246,38,0.22);">
  <a href="${u.home}" style="text-decoration:none;"><img src="https://getdisclosure.app/logo-nav.png" width="206" alt="DISCLOSURE" style="display:block;margin:0 auto 12px;max-width:206px;height:auto;border:0;filter:drop-shadow(0 0 18px rgba(74,246,38,0.34));"/></a>
  <div style="display:inline-block;padding:8px 13px;border:1px solid rgba(216,255,155,0.24);border-radius:999px;background:rgba(0,0,0,0.55);font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.2;letter-spacing:2.4px;color:#DFFF8C;font-weight:900;">CLASSIFICATION ISSUED // ${serialSafe}</div>
</td></tr>
<tr><td style="padding:30px 0 18px;text-align:center;">
  <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.6px;color:${c};font-weight:900;">${esc(a.code)} // ${issued}</p>
  <h1 style="margin:0;font-size:48px;line-height:0.96;letter-spacing:-1.8px;color:#ffffff;font-weight:900;text-transform:uppercase;">${esc(a.name)}</h1>
  <p style="margin:14px auto 0;max-width:500px;font-size:21px;line-height:1.42;color:#ffffff;font-weight:900;">${esc(a.tagline)}</p>
</td></tr>
<tr><td align="center" style="padding:8px 0 26px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:470px;border:1px solid ${c};border-radius:28px;background:#061006;background-image:radial-gradient(circle at 50% 0,${glow},transparent 36%),linear-gradient(145deg,rgba(8,22,9,0.98),rgba(0,0,0,0.84));box-shadow:0 0 0 1px rgba(255,255,255,0.05),0 24px 80px rgba(0,0,0,0.66),0 0 62px ${glow};overflow:hidden;">
    <tr><td style="padding:22px 22px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2px;color:rgba(255,255,255,0.93);font-weight:900;">FIELD CREDENTIAL</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2px;color:#ffffff;">ACTIVE</td></tr></table></td></tr>
    <tr><td align="center" style="padding:20px 24px 20px;"><div style="font-size:56px;line-height:1;margin-bottom:12px;">${a.icon}</div><div style="font-family:'Courier New',Courier,monospace;font-size:28px;font-weight:900;letter-spacing:5px;color:${c};text-shadow:0 0 22px ${glow};">${esc(a.name)}</div><div style="margin-top:8px;font-family:'Courier New',Courier,monospace;font-size:14px;letter-spacing:2px;color:#ffffff;font-weight:900;">${esc(a.role)}</div></td></tr>
    <tr><td style="padding:0 24px 22px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(255,255,255,0.08);">
        ${[[a.stat1[0], a.stat1[1], c], [a.stat2[0], a.stat2[1], '#ffffff'], [a.stat3[0], a.stat3[1], '#FFD66B']].map(([l,v,col]) => `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.8px;color:rgba(255,255,255,0.94);font-weight:900;">${esc(l)}</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.8px;color:${col};font-weight:900;">${esc(v)}</td></tr></table></td></tr>`).join('')}
      </table>
      <div style="margin-top:14px;border:1px solid rgba(216,255,155,0.28);border-radius:16px;padding:12px;text-align:center;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.8px;color:${c};font-weight:900;background:rgba(74,246,38,0.06);">${esc(a.status)}</div>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:0 0 20px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(216,255,155,0.20);border-radius:24px;background:rgba(0,0,0,0.54);box-shadow:inset 0 0 42px rgba(74,246,38,0.045);"><tr><td style="padding:22px 24px;"><p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.4px;color:${c};font-weight:900;">FIELD DIRECTIVE</p><p style="margin:0;font-size:18px;line-height:1.5;color:#ffffff;font-weight:800;">${esc(a.directive)}</p></td></tr></table></td></tr>
<tr><td style="padding:0 0 22px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(255,255,255,0.12);border-radius:24px;background:linear-gradient(135deg,rgba(7,18,9,0.95),rgba(0,0,0,0.72));"><tr><td style="padding:20px 24px 6px;"><p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.4px;color:#DFFF8C;font-weight:900;">APP TRAINING QUEUE</p></td></tr>${moduleRows}</table></td></tr>
<tr><td align="center" style="padding:0 0 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:6px;">${button(`OPEN YOUR FULL ${a.name} DOSSIER`, u.dossier, true)}</td></tr><tr><td style="padding:6px;">${button('CLAIM APP ACCESS', u.access)}</td></tr></table>
</td></tr>
<tr><td style="padding:18px 20px;border:1px solid rgba(255,255,255,0.14);border-radius:22px;background:rgba(255,255,255,0.04);text-align:center;">
  <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.4px;color:#FFD66B;font-weight:900;">SOCIAL CHALLENGE</p>
  <p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#ffffff;font-weight:800;">Post your classification. Challenge the group chat. Find out who gets perimeter, who speaks first, and who runs.</p>
  ${button('OPEN SHAREABLE FIELD FILE', u.share)}
</td></tr>
<tr><td style="padding:22px 0 0;text-align:center;border-top:1px solid rgba(255,255,255,0.08);"><p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2px;color:rgba(255,255,255,0.95);">BLACK CHANNEL FIELD PACKET</p><p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:rgba(255,255,255,0.88);">Most civilians will not know their role until the signal is already overhead.</p><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.82);"><a href="${u.home}" style="color:rgba(255,255,255,0.92);text-decoration:none;">getdisclosure.app</a> &nbsp;•&nbsp; <a href="https://getdisclosure.app?unsub=1" style="color:rgba(255,255,255,0.82);text-decoration:none;">unsubscribe</a></p></td></tr>
</table></td></tr></table>
</body></html>`;
}
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, max-age=0");
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
    const text = buildPlainText(key, serial);

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
        text: text,
        reply_to: "team@getdisclosure.app",
        headers: {
          "List-Unsubscribe": "<https://getdisclosure.app?unsub=1>",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        },
      }),
    });

    const detailText = await resp.text();
    let detail = null;
    try { detail = JSON.parse(detailText); } catch (_) { detail = detailText; }

    if (!resp.ok) {
      return res.status(500).json({ error: "Resend failed", detail });
    }

    return res.status(200).json({ ok: true, to: email, archetype: key, provider: "resend", detail });
  } catch (err) {
    console.error("Send failed:", err);
    return res.status(500).json({ error: err.message });
  }
};
