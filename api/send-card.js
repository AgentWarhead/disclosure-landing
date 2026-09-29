// POST /api/send-card  {email, archetype, serial, salt?, answers?, issued?}
// With salt, answers and issued the email carries the rendered card (api/card.js) and links to /card/<token>/.
// Sends the First Contact Card email through Resend (env RESEND_KEY, read at call time).
// Responses: {ok:true} or {ok:false, error}. Upstream errors and the key never reach the caller or the log.
const crypto = require("crypto");
const IR = require("../assets/dx/iris.js");

const SITE = "https://www.getdisclosure.app";
const FROM_EMAIL = "DISCLOSURE <team@getdisclosure.app>";
const REPLY_TO = "team@getdisclosure.app";
const RESEND_URL = "https://api.resend.com/emails";
const UNSUB_MAILTO = "mailto:team@getdisclosure.app?subject=unsubscribe";
const UNSUB_PAGE = SITE + "/privacy/#unsubscribe";
const PRIVACY_PAGE = SITE + "/privacy/";

// CASL requires a valid mailing address for the sender in every commercial email.
// TODO(boss): this is a stand-in until a Castlegar PO box exists; swap it in when it does.
const MAILING_ADDRESS = "DISCLOSURE, 1525 Aspen Lane, Castlegar BC V1N 4X8, Canada";

const ALLOWED_ORIGINS = new Set([
  "https://www.getdisclosure.app",
  "https://getdisclosure.app",
  "http://127.0.0.1:5177",
]);
const LOCALHOST_ORIGIN = /^http:\/\/localhost(:\d{1,5})?$/;

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;
const SERIAL_RE = /^(DSC|FC|DS)-[A-Z0-9-]{4,16}$/;

// Copy mirrors ROLES in assets/dx/classify.js. No percentages, no store or Wallet claims.
const ROLES = {
  sentinel: {
    name: "The Sentinel", role: "Primary protector",
    subject: "The Sentinel: your First Contact Card",
    line: "You put yourself between the unknown and everyone else, and you do it before anyone asks.",
    first: "In the first minute you count heads, find the gap, and stand in it. Your training is restraint: holding the line without starting a fight you cannot finish.",
    dossierLabel: "Read the Sentinel dossier",
    share: "I got The Sentinel. If something lands, I am the one standing between it and everyone else. Find your role:",
  },
  diplomat: {
    name: "The Diplomat", role: "De-escalation lead",
    subject: "The Diplomat: your First Contact Card",
    line: "You lower the temperature of every room you stand in, including this one.",
    first: "In the first minute you slow your breathing so others copy it. Your training is signal discipline: open hands, a quiet voice, and no sudden moves.",
    dossierLabel: "Read the Diplomat dossier",
    share: "I got The Diplomat. When the sky gets strange, I am the calm voice in the room. Find your role:",
  },
  scholar: {
    name: "The Scholar", role: "Field analyst",
    subject: "The Scholar: your First Contact Card",
    line: "While everyone else reacts, you record. Your account is the one that survives.",
    first: "In the first minute you note the time, the direction and the light. Your training is evidence: what you can prove, what you only saw, and the difference.",
    dossierLabel: "Read the Scholar dossier",
    share: "I got The Scholar. If it happens, I am the one writing down what actually happened. Find your role:",
  },
  survivor: {
    name: "The Survivor", role: "Self-preservation specialist",
    subject: "The Survivor: your First Contact Card",
    line: "You read the exit before you read the room, and your people are already moving.",
    first: "In the first minute you find cover and a way out. Your training is timing: knowing when leaving is the calm choice and not the panicked one.",
    dossierLabel: "Read the Survivor dossier",
    share: "I got The Survivor. I already know where the exits are. Find your role:",
  },
  "first-contact": {
    name: "First Contact", role: "Designation not issued",
    subject: "Your file came back sealed",
    line: "This designation is not assigned. It appears. You should not be seeing this.",
    first: "Your answers did not fit the four. The record has no instructions for you, only a serial.",
    dossierLabel: "Open the sealed file",
    share: "My DISCLOSURE file came back sealed. Find your role:",
  },
};

/* ---------- best-effort rate limits ----------
   In memory, so they hold per warm serverless instance only. A cold start or a second instance
   starts fresh. They blunt casual abuse; they are not a hard guarantee.
   Per IP (x-forwarded-for, first hop): 3 requests per 10 minutes.
   Per email address: 1 sent card per 24 hours. */
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX = 3;
const EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;
const ipHits = new Map();
const emailSent = new Map();

function sweep(now) {
  if (ipHits.size + emailSent.size < 5000) return;
  for (const [k, list] of ipHits) if (!list.some((t) => now - t < IP_WINDOW_MS)) ipHits.delete(k);
  for (const [k, t] of emailSent) if (now - t >= EMAIL_WINDOW_MS) emailSent.delete(k);
}
function ipAllowed(ip, now) {
  const list = (ipHits.get(ip) || []).filter((t) => now - t < IP_WINDOW_MS);
  if (list.length >= IP_MAX) { ipHits.set(ip, list); return false; }
  list.push(now);
  ipHits.set(ip, list);
  return true;
}
function emailKey(email) {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
}

/* ---------- helpers ---------- */
function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
}
function clientIp(req) {
  const xff = String((req.headers && req.headers["x-forwarded-for"]) || "");
  const first = xff.split(",")[0].trim();
  return first || (req.socket && req.socket.remoteAddress) || "unknown";
}
function originAllowed(origin) {
  return ALLOWED_ORIGINS.has(origin) || LOCALHOST_ORIGIN.test(origin);
}
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
function readBody(req) {
  let b;
  try { b = req.body; } catch (_) { return null; } // Vercel throws on malformed JSON
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (_) { return null; } }
  if (Buffer.isBuffer(b)) { try { b = JSON.parse(b.toString("utf8")); } catch (_) { return null; } }
  return b && typeof b === "object" && !Array.isArray(b) ? b : null;
}
function validEmail(v) {
  if (typeof v !== "string") return false;
  if (v.length < 6 || v.length > 254) return false;
  if (/[\s\r\n\0]/.test(v)) return false;
  if ((v.match(/@/g) || []).length !== 1) return false;
  if (/\.\./.test(v)) return false;
  return EMAIL_RE.test(v);
}

function links(key, token) {
  const r = ROLES[key];
  const card = token ? SITE + "/card/" + encodeURIComponent(token) : ""; // no trailing slash: Vercel reads the dotted token as a file name
  const shareUrl = card || SITE + "/";
  return {
    home: SITE + "/",
    card,
    image: token ? SITE + "/api/card/?f=" + encodeURIComponent(token) + "&kind=card&fmt=jpg" : "",
    dossier: SITE + "/archetype/" + encodeURIComponent(key) + "/",
    share: "https://x.com/intent/post?text=" + encodeURIComponent(r.share) + "&url=" + encodeURIComponent(shareUrl),
  };
}

/* ---------- the email ----------
   The site's own furniture: the black banner marking, the wordmark, one role-coloured keyline and
   the card itself as the centrepiece. Every panel and button is light on dark on purpose: Gmail's
   dark mode repaints dark text sitting on a light ground, and leaves light on dark alone. */
const SANS = "'Public Sans',Arial,Helvetica,sans-serif";
const MONO = "'Space Mono','Courier New',Courier,monospace";
const C = {
  black: "#000000", void: "#030504", panel: "#070b09", rule: "#1d2722", bone: "#d8dfda", dim: "#a3aea7", faint: "#7d8983",
  signal: "#4af626",
};
const ROLE_COLOR = { sentinel: "#ef4444", diplomat: "#22c55e", scholar: "#60a5fa", survivor: "#f97316", "first-contact": "#ffd700" };

function buildHtml(key, serial, token, issued) {
  const r = ROLES[key];
  const u = links(key, token);
  const sealed = key === "first-contact";
  const accent = ROLE_COLOR[key];
  const label = (t, color, extra) => `<p style="margin:0 0 10px;font-family:${MONO};font-size:12px;line-height:1.4;letter-spacing:2px;text-transform:uppercase;color:${color || C.faint};${extra || ""}">${t}</p>`;
  const row = (k, v) => `<tr><td style="padding:11px 0;border-top:1px solid ${C.rule};font-family:${MONO};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${C.faint};">${k}</td><td align="right" style="padding:11px 0;border-top:1px solid ${C.rule};font-family:${MONO};font-size:13px;letter-spacing:1px;color:${C.bone};">${v}</td></tr>`;
  const button = (href, text) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.void}" style="background:${C.void};border:2px solid ${C.signal};border-radius:2px;"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font-family:${MONO};font-size:15px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.signal};text-decoration:none;">${text} &rarr;</a></td></tr></table>`;
  const address = MAILING_ADDRESS ? `<p style="margin:0 0 8px;">${esc(MAILING_ADDRESS)}</p>` : "";
  const cardAlt = `Your First Contact Card: ${r.name}, serial ${serial}. ${r.line} The iris on it was grown from your ${issued ? "ten answers" : "serial"}.`;

  const cardBlock = token ? `
<tr><td style="padding:30px 0 6px;" align="center">
  <a href="${esc(u.card)}" style="color:${C.bone};text-decoration:none;display:block;"><img src="${esc(u.image)}" width="440" alt="${esc(cardAlt)}" style="display:block;width:100%;max-width:440px;height:auto;border:1px solid ${C.rule};background:${C.void};color:${C.bone};font-family:${SANS};font-size:15px;line-height:1.5;"></a>
  <p style="margin:12px 0 0;font-family:${MONO};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${C.faint};">Iris print ${esc(serial)}. ${issued ? "No two sets of answers grow the same eye." : "Grown from your serial. No two serials grow the same eye."}</p>
</td></tr>
<tr><td style="padding:22px 0 4px;" align="center">
  ${button(u.card, "Open your card")}
  <p style="margin:14px 0 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${C.dim};">Save it as an image, or share the link and your eye shows up in the preview.</p>
</td></tr>` : "";

  const ctaBlock = token
    ? `<p style="margin:0;font-family:${MONO};font-size:13px;letter-spacing:1px;"><a href="${esc(u.dossier)}" style="color:${C.bone};text-decoration:underline;">${esc(r.dossierLabel)}</a> <span style="color:${C.faint};">&middot;</span> <a href="${esc(u.share)}" style="color:${C.bone};text-decoration:underline;">Share on X</a></p>`
    : `${button(u.dossier, esc(r.dossierLabel))}<p style="margin:18px 0 0;font-family:${MONO};font-size:13px;letter-spacing:1px;"><a href="${esc(u.share)}" style="color:${C.bone};text-decoration:underline;">Share your role on X</a></p>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
<title>${esc(r.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;800;900&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.void};color:${C.bone};font-family:${SANS};font-size:16px;line-height:1.6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(r.line)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.void};">
<tr><td align="center" style="background:${C.black};border-bottom:1px solid ${C.rule};padding:7px 16px;font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.signal};">Unclassified &middot; Civilian copy</td></tr>
<tr><td align="center" style="padding:26px 16px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

<tr><td style="padding:0 0 18px;border-bottom:1px solid ${C.rule};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle"><a href="${u.home}" style="color:${C.bone};text-decoration:none;font-family:${SANS};font-size:16px;font-weight:900;letter-spacing:6px;"><img src="${SITE}/assets/brand/disclosure-wordmark.png" width="170" height="34" alt="DISCLOSURE" style="display:block;border:0;color:${C.bone};font-family:${SANS};font-size:16px;font-weight:900;letter-spacing:6px;"></a></td>
    <td align="right" valign="middle" style="font-family:${MONO};font-size:12px;letter-spacing:1.5px;color:${C.faint};">FILE ${esc(serial)}</td>
  </tr></table>
</td></tr>

<tr><td style="padding:34px 0 0;">
  ${label(sealed ? "First Contact Card &middot; Designation not issued" : "First Contact Card &middot; Designation issued")}
  <h1 style="margin:0;font-family:${SANS};font-size:44px;line-height:1.02;font-weight:900;letter-spacing:-1px;color:${C.bone};">${esc(r.name)}</h1>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 12px;"><tr><td style="width:56px;height:3px;background:${accent};font-size:0;line-height:0;">&nbsp;</td></tr></table>
  <p style="margin:0 0 14px;font-family:${MONO};font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${C.dim};">${esc(r.role)}</p>
  ${token ? "" : `<p style="margin:0;font-family:${SANS};font-size:20px;line-height:1.45;color:${C.bone};">${esc(r.line)}</p>`}
</td></tr>
${cardBlock}
<tr><td style="padding:30px 0 6px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.rule};"><tr><td bgcolor="${C.panel}" style="padding:20px 22px 20px;border-left:3px solid ${accent};background:${C.panel};">
    ${label(sealed ? "The record" : "The first minute")}
    <p style="margin:0;font-family:${SANS};font-size:17px;line-height:1.6;color:${C.bone};">${esc(r.first)}</p>
  </td></tr></table>
</td></tr>

<tr><td style="padding:18px 0 4px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${row("Serial", esc(serial))}
    ${row("Designation", esc(r.name))}
    ${issued ? row("Issued", esc(issued).replace(/-/g, "-&zwnj;")) : ""}
    ${row("App status", "In development")}
  </table>
</td></tr>

<tr><td style="padding:24px 0 6px;">
  ${ctaBlock}
</td></tr>

<tr><td style="padding:28px 0 30px;">
  ${label("What happens next")}
  <p style="margin:0;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.dim};">DISCLOSURE is an app in development for iOS and Android. When it opens, this address hears first. Until then, nothing else arrives from us.</p>
</td></tr>

<tr><td style="padding:22px 0 0;border-top:1px solid ${C.rule};font-family:${SANS};font-size:13px;line-height:1.6;color:${C.faint};">
  <p style="margin:0 0 8px;">You are getting this because this address was entered at getdisclosure.app to receive a First Contact Card. To stop all email from DISCLOSURE, reply with the word unsubscribe or <a href="${esc(UNSUB_MAILTO)}" style="color:${C.dim};text-decoration:underline;">email team@getdisclosure.app</a>. <a href="${esc(PRIVACY_PAGE)}" style="color:${C.dim};text-decoration:underline;">Privacy</a>.</p>
  ${address}<p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">DISCLOSURE &middot; getdisclosure.app &middot; Not affiliated with any government agency.</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

function buildText(key, serial, token, issued) {
  const r = ROLES[key];
  const u = links(key, token);
  const sealed = key === "first-contact";
  return [
    "DISCLOSURE",
    sealed ? "First Contact Card. Designation not issued." : "First Contact Card. Designation issued.",
    "",
    r.name.toUpperCase(),
    r.role,
    "",
    r.line,
    "",
    ...(u.card ? [(issued ? "Your card, with the iris grown from your answers: " : "Your card, with the iris grown from your serial: ") + u.card, ""] : []),
    sealed ? "THE RECORD" : "THE FIRST MINUTE",
    r.first,
    "",
    "Serial: " + serial,
    "Designation: " + r.name,
    ...(issued ? ["Issued: " + issued] : []),
    "App status: In development",
    "",
    r.dossierLabel + ": " + u.dossier,
    "Share on X: " + u.share,
    "",
    "WHAT HAPPENS NEXT",
    "DISCLOSURE is an app in development for iOS and Android. When it opens, this address hears first. Until then, nothing else arrives from us.",
    "",
    "--",
    "You are getting this because this address was entered at getdisclosure.app to receive a First Contact Card.",
    "To stop all email from DISCLOSURE, reply with the word unsubscribe or email team@getdisclosure.app.",
    "Privacy: " + PRIVACY_PAGE,
    ...(MAILING_ADDRESS ? [MAILING_ADDRESS] : []),
    "Not affiliated with any government agency.",
  ].join("\n");
}

/* The card token, when the quiz sent its answers. The role comes from the answers, never from the
   caller, so the email always matches the card it links to. Anything malformed means no card image,
   not a failed send. */
function cardFile(body, serial, key) {
  const salt = typeof body.salt === "string" ? body.salt.trim() : "";
  const answers = typeof body.answers === "string" ? body.answers.trim() : "";
  const issued = typeof body.issued === "string" ? body.issued.trim() : "";
  if (salt && /^[0-3]{10}$/.test(answers) && /^\d{4}-\d{2}-\d{2}$/.test(issued)) {
    const token = IR.encodeToken({ salt, answers: answers.split("").map(Number), serial, issued });
    const file = IR.decodeToken(token);
    if (file) return { token, file };
  }
  // No usable answers (the waitlist batch, an old client, a bad token): a role card grown from the serial.
  const token = IR.roleToken(key, serial);
  const file = IR.decodeToken(token);
  return file ? { token, file } : null;
}

/* ---------- handler ---------- */
async function handler(req, res) {
  const origin = String((req.headers && req.headers.origin) || "");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (origin) {
    if (!originAllowed(origin)) return send(res, 403, { ok: false, error: "forbidden" });
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
  }
  // Preflight from an allowed origin only (a disallowed one was refused above).
  if (req.method === "OPTIONS" && origin) { res.statusCode = 204; return res.end(); }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const now = Date.now();
  sweep(now);
  if (!ipAllowed(clientIp(req), now)) return send(res, 429, { ok: false, error: "too_many_requests" });

  const body = readBody(req);
  if (!body) return send(res, 400, { ok: false, error: "invalid_body" });

  const email = typeof body.email === "string" ? body.email.trim() : body.email;
  const key = typeof body.archetype === "string" ? body.archetype.trim().toLowerCase() : "";
  const serial = typeof body.serial === "string" ? body.serial.trim() : "";

  if (!validEmail(email)) return send(res, 400, { ok: false, error: "invalid_email" });
  if (!Object.prototype.hasOwnProperty.call(ROLES, key)) return send(res, 400, { ok: false, error: "invalid_archetype" });
  if (!SERIAL_RE.test(serial)) return send(res, 400, { ok: false, error: "invalid_serial" });

  const card = cardFile(body, serial, key);
  const role = card ? card.file.archetype : key;
  const token = card ? card.token : "";
  const issued = card ? card.file.issued : "";

  const ek = emailKey(email);
  const last = emailSent.get(ek);
  if (last && now - last < EMAIL_WINDOW_MS) return send(res, 429, { ok: false, error: "too_many_requests" });

  const apiKey = process.env.RESEND_KEY || "";
  if (!apiKey) {
    console.error("send-card: RESEND_KEY missing");
    return send(res, 503, { ok: false, error: "unavailable" });
  }

  try {
    const resp = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        // Resend drops a repeat of the same email and serial within 24 hours, across every instance.
        "Idempotency-Key": "card-" + crypto.createHash("sha256").update(ek + "|" + serial).digest("hex").slice(0, 48),
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        reply_to: REPLY_TO,
        subject: ROLES[role].subject,
        html: buildHtml(role, serial, token, issued),
        text: buildText(role, serial, token, issued),
        headers: { "List-Unsubscribe": "<" + UNSUB_MAILTO + ">, <" + UNSUB_PAGE + ">" },
      }),
    });
    if (!resp.ok) {
      console.error("send-card: upstream status " + resp.status);
      return send(res, 502, { ok: false, error: "send_failed" });
    }
    emailSent.set(ek, now);
    console.log("send-card: sent, role " + role + (token ? ", with card" : ""));
    return send(res, 200, { ok: true });
  } catch (_) {
    console.error("send-card: upstream unreachable");
    return send(res, 502, { ok: false, error: "send_failed" });
  }
}

module.exports = handler;
module.exports._internal = { buildHtml, buildText, cardFile, ROLES, validEmail, reset: () => { ipHits.clear(); emailSent.clear(); } };
