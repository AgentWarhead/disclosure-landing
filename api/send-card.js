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

const EMAIL_COPY = {
  sentinel: {
    role: "THE ONE WHO MOVES FIRST",
    oneLine: "If people freeze, you get them moving.",
    directive: "Your job is to keep people back, spot the danger, and make the first safe move.",
    modules: ["Spot danger fast", "Keep people back", "Move without panic"],
    status: "YOU MOVE FIRST",
    share: "I got Sentinel. Apparently I am the one dragging everyone away from the glowing thing."
  },
  diplomat: {
    role: "THE ONE WHO KEEPS PEOPLE CALM",
    oneLine: "If everyone panics, you become the calm voice in the room.",
    directive: "Your job is to slow people down, choose the right words, and stop fear from taking over.",
    modules: ["Calm people fast", "Say the first words", "Keep the room together"],
    status: "STAY CALM. SPEAK CLEARLY.",
    share: "I got Diplomat. Apparently I am the person who has to keep everyone calm when the sky gets weird."
  },
  scholar: {
    role: "THE ONE WHO NOTICES DETAILS",
    oneLine: "If the impossible happens, you remember what everyone else misses.",
    directive: "Your job is to watch, record, and keep the facts straight while everyone else spirals.",
    modules: ["Notice what matters", "Record the event", "Separate facts from panic"],
    status: "REMEMBER WHAT HAPPENED",
    share: "I got Scholar. If something impossible happens, I am the one taking notes while everyone else loses it."
  },
  survivor: {
    role: "THE ONE WHO FINDS THE EXIT",
    oneLine: "If the room turns chaotic, you already know the way out.",
    directive: "Your job is to get yourself and your people away from danger before panic spreads.",
    modules: ["Find the safest exit", "Move your people", "Leave before it gets worse"],
    status: "GET OUT CLEAN",
    share: "I got Survivor. Translation: I already know where the exits are."
  },
  "first-contact": {
    role: "THE RARE ONE",
    oneLine: "Your result was not supposed to be common.",
    directive: "Your job is to stay sharp, pay attention, and be ready when the next layer opens.",
    modules: ["Watch for the signal", "Read the hidden file", "Wait for the next unlock"],
    status: "RARE RESULT FOUND",
    share: "My Disclosure result was First Contact. Standard classification failed, which feels either bad or extremely interesting."
  },
};

function emailCopyFor(archetype) {
  return EMAIL_COPY[archetype] || EMAIL_COPY.diplomat;
}

function buildPlainText(archetype, serial) {
  const a = ARCHETYPES[archetype] || ARCHETYPES["diplomat"];
  const e = emailCopyFor(archetype);
  const u = urlsFor(archetype, a.share_txt);
  return [
    `DISCLOSURE // YOUR ROLE IS READY`,
    `Serial: ${serial || "DS-2026-ISSUED"}`,
    `Result: ${a.name}`,
    `Role: ${e.role}`,
    ``,
    e.oneLine,
    ``,
    `IF CONTACT HAPPENS`,
    e.directive,
    ``,
    `YOU'RE ON THE LIST`,
    `Good move. When Disclosure launches on iPhone and Android, you will hear from us first. Launch day, new features, strange updates, and the next steps all go to this email.`,
    ``,
    `WHAT COMES NEXT`,
    `01 ${e.modules[0]}`,
    `02 ${e.modules[1]}`,
    `03 ${e.modules[2]}`,
    ``,
    `OPEN YOUR ${a.name} DOSSIER`,
    u.dossier,
    ``,
    `YOU ARE ONE STEP CLOSER TO BEING READY`,
    `Watch this inbox. We will send the launch signal when the app is ready.`,
    ``,
    `Challenge your group chat: ${u.share}`,
    `getdisclosure.app`,
  ].join("\n");
}

function buildEmail(archetype, serial) {
  const a = ARCHETYPES[archetype] || ARCHETYPES["diplomat"];
  const e = emailCopyFor(archetype);
  const issued = new Date().toISOString().slice(0, 10);
  const serialSafe = esc(serial || "DS-2026-ISSUED");
  const u = urlsFor(archetype, a.share_txt);
  const c = a.color;
  const glow = a.glow;
  const button = (label, href, filled = false) => `<a href="${href}" style="display:inline-block;width:100%;box-sizing:border-box;text-align:center;text-decoration:none;border-radius:999px;padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.15;letter-spacing:0.8px;font-weight:900;text-transform:uppercase;${filled ? `background:linear-gradient(90deg,#ecff7a,#4AF626);color:#020302;border:1px solid #ecff7a;box-shadow:0 0 38px rgba(74,246,38,0.42);` : `background:rgba(255,255,255,0.055);color:#ffffff;border:1px solid rgba(255,255,255,0.20);`}">${label}</a>`;
  const moduleRows = e.modules.map((m, i) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.09);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
          <td style="width:36px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.8px;color:${c};font-weight:900;">0${i + 1}</td>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.35;color:#ffffff;font-weight:900;">${esc(m)}</td>
        </tr></table>
      </td>
    </tr>`).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${esc(a.subject)}</title></head>
<body style="margin:0;padding:0;background:#000000;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:16px;line-height:1.5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(a.preheader)}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#000000;background-image:radial-gradient(circle at 50% 0,${glow},transparent 34%),radial-gradient(circle at 100% 16%,rgba(255,215,0,0.14),transparent 28%),linear-gradient(180deg,#020604 0%,#000000 62%,#030603 100%);"><tr><td align="center" style="padding:22px 12px 42px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:640px;margin:0 auto;">
<tr><td style="padding:14px 0 22px;text-align:center;border-bottom:1px solid rgba(74,246,38,0.24);">
  <a href="${u.home}" style="text-decoration:none;"><img src="https://getdisclosure.app/logo-nav.png" width="210" alt="DISCLOSURE" style="display:block;margin:0 auto 12px;max-width:210px;height:auto;border:0;filter:drop-shadow(0 0 18px rgba(74,246,38,0.36));"/></a>
  <div style="display:inline-block;padding:8px 13px;border:1px solid rgba(216,255,155,0.28);border-radius:999px;background:rgba(0,0,0,0.62);font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.2;letter-spacing:2px;color:#DFFF8C;font-weight:900;">YOUR ROLE IS READY // ${serialSafe}</div>
</td></tr>
<tr><td style="padding:32px 0 20px;text-align:center;">
  <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.4px;color:${c};font-weight:900;">${esc(a.code)} // ${issued}</p>
  <h1 style="margin:0;font-size:54px;line-height:0.92;letter-spacing:-2px;color:#ffffff;font-weight:900;text-transform:uppercase;text-shadow:0 0 30px rgba(255,255,255,0.12);">${esc(a.name)}</h1>
  <p style="margin:15px auto 0;max-width:520px;font-size:23px;line-height:1.28;color:#ffffff;font-weight:900;">${esc(e.oneLine)}</p>
</td></tr>
<tr><td align="center" style="padding:8px 0 26px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:500px;border:1px solid ${c};border-radius:30px;background:#061006;background-image:radial-gradient(circle at 50% 0,${glow},transparent 38%),linear-gradient(145deg,rgba(8,22,9,0.98),rgba(0,0,0,0.84));box-shadow:0 0 0 1px rgba(255,255,255,0.05),0 26px 88px rgba(0,0,0,0.72),0 0 76px ${glow};overflow:hidden;">
    <tr><td style="padding:22px 22px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2px;color:rgba(255,255,255,0.9);font-weight:900;">RESULT CARD</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2px;color:#ffffff;">ACTIVE</td></tr></table></td></tr>
    <tr><td align="center" style="padding:20px 24px 22px;"><div style="font-size:58px;line-height:1;margin-bottom:12px;">${a.icon}</div><div style="font-family:Arial,Helvetica,sans-serif;font-size:34px;font-weight:900;letter-spacing:1px;color:${c};text-shadow:0 0 24px ${glow};text-transform:uppercase;">${esc(a.name)}</div><div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;letter-spacing:1.1px;color:#ffffff;font-weight:900;text-transform:uppercase;">${esc(e.role)}</div></td></tr>
    <tr><td style="padding:0 24px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(255,255,255,0.10);">
        <tr><td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.09);"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.6px;color:rgba(255,255,255,0.90);font-weight:900;">WHAT YOU DO</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.6px;color:${c};font-weight:900;">${esc(e.status)}</td></tr></table></td></tr>
        <tr><td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.09);"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.6px;color:rgba(255,255,255,0.90);font-weight:900;">APP STATUS</td><td align="right" style="font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:1.6px;color:#DFFF8C;font-weight:900;">COMING SOON</td></tr></table></td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:0 0 20px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(216,255,155,0.20);border-radius:24px;background:rgba(0,0,0,0.56);box-shadow:inset 0 0 42px rgba(74,246,38,0.05);"><tr><td style="padding:22px 24px;"><p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.2px;color:${c};font-weight:900;">IF CONTACT HAPPENS</p><p style="margin:0;font-size:19px;line-height:1.45;color:#ffffff;font-weight:900;">${esc(e.directive)}</p></td></tr></table></td></tr>
<tr><td style="padding:0 0 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(74,246,38,0.40);border-radius:30px;background:#031006;background-image:radial-gradient(circle at 50% 0,rgba(74,246,38,0.30),transparent 42%),radial-gradient(circle at 92% 22%,${glow},transparent 32%),linear-gradient(145deg,rgba(7,28,11,0.98),rgba(0,0,0,0.82));box-shadow:0 0 82px rgba(74,246,38,0.20),inset 0 0 48px rgba(255,215,0,0.05);overflow:hidden;">
    <tr><td style="padding:26px 24px 24px;text-align:center;">
      <div style="display:inline-block;margin:0 0 12px;padding:7px 12px;border-radius:999px;background:rgba(74,246,38,0.12);border:1px solid rgba(74,246,38,0.36);font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2.3px;color:#4AF626;font-weight:900;">COMING SOON TO iPHONE + ANDROID</div>
      <h2 style="margin:0 0 12px;font-size:40px;line-height:0.94;letter-spacing:-1.8px;color:#ffffff;font-weight:900;text-transform:uppercase;">You made the right call.</h2>
      <p style="margin:0 auto 18px;max-width:530px;font-size:18px;line-height:1.48;color:#ffffff;font-weight:900;">Most people will wait until the sky gets weird. You are already one step closer to being ready. When Disclosure launches, this inbox gets the signal first.</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;"><tr>
        <td style="padding:5px;"><div style="border:1px solid rgba(255,255,255,0.18);border-radius:16px;padding:13px 8px;text-align:center;background:rgba(0,0,0,0.48);font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.6px;color:#ffffff;font-weight:900;text-transform:uppercase;">iPhone<br/><span style="color:#DFFF8C;">you are on the list</span></div></td>
        <td style="padding:5px;"><div style="border:1px solid rgba(255,255,255,0.18);border-radius:16px;padding:13px 8px;text-align:center;background:rgba(0,0,0,0.48);font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.6px;color:#ffffff;font-weight:900;text-transform:uppercase;">Android<br/><span style="color:#DFFF8C;">you are on the list</span></div></td>
      </tr></table>
      <div style="border:1px solid rgba(216,255,155,0.24);border-radius:18px;padding:13px 14px;background:rgba(74,246,38,0.07);font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;color:#DFFF8C;font-weight:900;">You are on the list. We will send launch day, app updates, and the next Disclosure drops here first.</div>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:0 0 22px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(255,255,255,0.12);border-radius:24px;background:linear-gradient(135deg,rgba(7,18,9,0.95),rgba(0,0,0,0.72));"><tr><td style="padding:20px 24px 6px;"><p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.2px;color:#DFFF8C;font-weight:900;">WHAT YOU GET FIRST</p></td></tr>${moduleRows}</table></td></tr>
<tr><td align="center" style="padding:0 0 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:6px;">${button(`OPEN MY ${a.name} DOSSIER`, u.dossier, true)}</td></tr><tr><td style="padding:6px;">${button('SEND THIS TO A FRIEND', u.share)}</td></tr></table>
</td></tr>
<tr><td style="padding:18px 20px;border:1px solid rgba(255,255,255,0.14);border-radius:22px;background:rgba(255,255,255,0.04);text-align:center;">
  <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:13px;letter-spacing:2.2px;color:#FFD66B;font-weight:900;">SEND THIS TO THE GROUP CHAT</p>
  <p style="margin:0 0 14px;font-size:16px;line-height:1.45;color:#ffffff;font-weight:800;">Make them take the quiz. Someone gets calm voice. Someone gets exit plan. Someone gets the weird result.</p>
  ${button('SHARE MY RESULT', u.share)}
</td></tr>
<tr><td style="padding:22px 0 0;text-align:center;border-top:1px solid rgba(255,255,255,0.08);"><p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:12px;letter-spacing:2px;color:rgba(255,255,255,0.95);">DISCLOSURE FIELD FILE</p><p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:rgba(255,255,255,0.88);">Most people wait until things get strange. You do not have to.</p><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.82);"><a href="${u.home}" style="color:rgba(255,255,255,0.92);text-decoration:none;">getdisclosure.app</a> &nbsp;•&nbsp; <a href="https://getdisclosure.app?unsub=1" style="color:rgba(255,255,255,0.82);text-decoration:none;">unsubscribe</a></p></td></tr>
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
