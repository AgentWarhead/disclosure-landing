// POST /api/send-card  {email, archetype, serial}
// Sends the First Contact Card email through Resend (env RESEND_KEY, read at call time).
// Responses: {ok:true} or {ok:false, error}. Upstream errors and the key never reach the caller or the log.
const crypto = require("crypto");

const SITE = "https://www.getdisclosure.app";
const FROM_EMAIL = "DISCLOSURE <team@getdisclosure.app>";
const REPLY_TO = "team@getdisclosure.app";
const RESEND_URL = "https://api.resend.com/emails";
const UNSUB_MAILTO = "mailto:team@getdisclosure.app?subject=unsubscribe";
const UNSUB_PAGE = SITE + "/privacy/#unsubscribe";
const PRIVACY_PAGE = SITE + "/privacy/";

// TODO(boss): CASL requires a valid mailing address for the sender in every commercial email.
// Add it to MAILING_ADDRESS below (one line, plain text) before any launch or batch mail goes out.
// Left empty on purpose: never invent one.
const MAILING_ADDRESS = "";

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

function links(key) {
  const r = ROLES[key];
  return {
    home: SITE + "/",
    dossier: SITE + "/archetype/" + encodeURIComponent(key) + "/",
    share: SITE + "/?share=x&text=" + encodeURIComponent(r.share + " " + SITE + "/"),
  };
}

/* ---------- the email ---------- */
const SANS = "'Public Sans',Arial,Helvetica,sans-serif";
const MONO = "'Space Mono','Courier New',Courier,monospace";
const C = { void: "#030504", panel: "#070b09", rule: "#1d2722", bone: "#d8dfda", dim: "#a3aea7", faint: "#7d8983", signal: "#4af626", ink: "#031002" };

function buildHtml(key, serial) {
  const r = ROLES[key];
  const u = links(key);
  const sealed = key === "first-contact";
  const label = (t, color) => `<p style="margin:0 0 10px;font-family:${MONO};font-size:12px;line-height:1.4;letter-spacing:2px;text-transform:uppercase;color:${color || C.faint};">${t}</p>`;
  const row = (k, v) => `<tr><td style="padding:12px 0;border-top:1px solid ${C.rule};font-family:${MONO};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${C.faint};">${k}</td><td align="right" style="padding:12px 0;border-top:1px solid ${C.rule};font-family:${MONO};font-size:13px;letter-spacing:1px;color:${C.bone};">${v}</td></tr>`;
  const address = MAILING_ADDRESS ? `<p style="margin:0 0 8px;">${esc(MAILING_ADDRESS)}</p>` : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
<title>${esc(r.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;800;900&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.void};color:${C.bone};font-family:${SANS};font-size:16px;line-height:1.6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(r.line)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.void};"><tr><td align="center" style="padding:28px 16px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

<tr><td style="padding:0 0 18px;border-bottom:1px solid ${C.rule};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="font-family:${SANS};font-size:15px;font-weight:900;letter-spacing:6px;color:${C.bone};"><a href="${u.home}" style="color:${C.bone};text-decoration:none;">DISCLOSURE</a></td>
    <td align="right" style="font-family:${MONO};font-size:12px;letter-spacing:1.5px;color:${C.faint};">SERIAL ${esc(serial)}</td>
  </tr></table>
</td></tr>

<tr><td style="padding:40px 0 8px;">
  ${label(sealed ? "First Contact Card &middot; Designation not issued" : "First Contact Card &middot; Designation issued")}
  <h1 style="margin:0;font-family:${SANS};font-size:46px;line-height:1.02;font-weight:800;letter-spacing:-1px;color:${C.bone};">${esc(r.name)}</h1>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 14px;"><tr><td style="width:56px;height:2px;background:${C.signal};font-size:0;line-height:0;">&nbsp;</td></tr></table>
  <p style="margin:0 0 18px;font-family:${MONO};font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${C.dim};">${esc(r.role)}</p>
  <p style="margin:0;font-family:${SANS};font-size:21px;line-height:1.45;font-weight:400;color:${C.bone};">${esc(r.line)}</p>
</td></tr>

<tr><td style="padding:28px 0 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.panel};border:1px solid ${C.rule};"><tr><td style="padding:22px 22px 20px;">
    ${label(sealed ? "The record" : "The first minute")}
    <p style="margin:0;font-family:${SANS};font-size:17px;line-height:1.6;color:${C.bone};">${esc(r.first)}</p>
  </td></tr></table>
</td></tr>

<tr><td style="padding:20px 0 4px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${row("Serial", esc(serial))}
    ${row("Designation", esc(r.name))}
    ${row("App status", "In development")}
  </table>
</td></tr>

<tr><td style="padding:26px 0 8px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${C.signal};border-radius:2px;">
    <a href="${esc(u.dossier)}" style="display:inline-block;padding:15px 24px;font-family:${SANS};font-size:16px;font-weight:800;color:${C.ink};text-decoration:none;">${esc(r.dossierLabel)} &rarr;</a>
  </td></tr></table>
  <p style="margin:18px 0 0;font-family:${MONO};font-size:13px;letter-spacing:1px;"><a href="${esc(u.share)}" style="color:${C.bone};text-decoration:underline;">Share your role on X</a></p>
</td></tr>

<tr><td style="padding:30px 0 30px;">
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

function buildText(key, serial) {
  const r = ROLES[key];
  const u = links(key);
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
    sealed ? "THE RECORD" : "THE FIRST MINUTE",
    r.first,
    "",
    "Serial: " + serial,
    "Designation: " + r.name,
    "App status: In development",
    "",
    r.dossierLabel + ": " + u.dossier,
    "Share your role on X: " + u.share,
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
        subject: ROLES[key].subject,
        html: buildHtml(key, serial),
        text: buildText(key, serial),
        headers: { "List-Unsubscribe": "<" + UNSUB_MAILTO + ">, <" + UNSUB_PAGE + ">" },
      }),
    });
    if (!resp.ok) {
      console.error("send-card: upstream status " + resp.status);
      return send(res, 502, { ok: false, error: "send_failed" });
    }
    emailSent.set(ek, now);
    console.log("send-card: sent, role " + key);
    return send(res, 200, { ok: true });
  } catch (_) {
    console.error("send-card: upstream unreachable");
    return send(res, 502, { ok: false, error: "send_failed" });
  }
}

module.exports = handler;
module.exports._internal = { buildHtml, buildText, ROLES, validEmail, reset: () => { ipHits.clear(); emailSent.clear(); } };
