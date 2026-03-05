import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SMTP_HOST = "smtp.hostinger.com";
const SMTP_PORT = 465;
const SMTP_USER = "team@getdisclosure.app";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";

const ARCHETYPES: Record<string, any> = {
  sentinel: {
    name: "SENTINEL", icon: "🛡️", role: "PRIMARY PROTECTOR",
    color: "#4AF626", subject: "Classification complete: Sentinel",
    tagline: "You were always going to be first through the door.",
    stat1: ["THREAT READ", "ACTIVE"], stat2: ["ROLE ONSET", "IMMEDIATE"],
    bar_lbl: "FIELD READINESS", bar_pct: "87%", bar_w: "87%",
    status: "🟢 THREAT ASSESSMENT: ACTIVE",
    share_txt: "I just got classified as a SENTINEL by Disclosure. Only 34% of people get this designation. What are you when they arrive? getdisclosure.app",
  },
  diplomat: {
    name: "DIPLOMAT", icon: "🤝", role: "DE-ESCALATION LEAD",
    color: "#22C55E", subject: "Classification complete: Diplomat",
    tagline: "The outcome depends on what you say in the first 30 seconds.",
    stat1: ["PROTOCOL", "ACTIVE"], stat2: ["THREAT RESPONSE", "DE-ESCALATE"],
    bar_lbl: "DIPLOMATIC RATING", bar_pct: "91%", bar_w: "91%",
    status: "🟢 DE-ESCALATION: READY",
    share_txt: "I just got classified as a DIPLOMAT by Disclosure. Only 28% of people get this designation. What are you when they arrive? getdisclosure.app",
  },
  scholar: {
    name: "SCHOLAR", icon: "🔬", role: "FIELD ANALYST",
    color: "#60A5FA", subject: "Classification complete: Scholar",
    tagline: "Your records will be the only verifiable account that survives.",
    stat1: ["ANALYSIS MODE", "CONTINUOUS"], stat2: ["DATA RETENTION", "TOTAL"],
    bar_lbl: "ANALYTICAL RATING", bar_pct: "94%", bar_w: "94%",
    status: "🔵 OBSERVATION: ACTIVE",
    share_txt: "I just got classified as a SCHOLAR by Disclosure. Only 22% of people get this designation. What are you when they arrive? getdisclosure.app",
  },
  survivor: {
    name: "SURVIVOR", icon: "🏃", role: "SELF-PRESERVATION SPECIALIST",
    color: "#F97316", subject: "Classification complete: Survivor",
    tagline: "You read the exit before you read the room.",
    stat1: ["ESCAPE VECTOR", "CALCULATED"], stat2: ["FAMILY PROTOCOL", "ACTIVE"],
    bar_lbl: "SURVIVAL RATING", bar_pct: "79%", bar_w: "79%",
    status: "🟠 EVACUATION: READY",
    share_txt: "I just got classified as a SURVIVOR by Disclosure. Only 16% of people get this designation. What are you when they arrive? getdisclosure.app",
  },
  "first-contact": {
    name: "FIRST CONTACT", icon: "⭐", role: "CLASSIFICATION UNKNOWN",
    color: "#FFD700", subject: "Classification complete: First Contact",
    tagline: "Less than 0.1% carry this designation. You know why.",
    stat1: ["ARCHETYPE", "████████████"], stat2: ["FIELD CONF", "NEVER"],
    bar_lbl: "UNLOCK STATUS", bar_pct: "<0.1%", bar_w: "0.1%",
    status: "⭐ NO CONFIRMED FIELD CONTACT",
    share_txt: "I just got classified as FIRST CONTACT by Disclosure. Less than 0.1% of people get this designation. getdisclosure.app",
  },
};

function buildEmail(archetype: string, serial: string): string {
  const a = ARCHETYPES[archetype] ?? ARCHETYPES["diplomat"];
  const issued = new Date().toISOString().slice(0, 10);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><title>${a.subject}</title></head>
<body style="margin:0;padding:0;background:#000;font-family:'Courier New',Courier,monospace;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000;">
<tr><td align="center" style="padding:40px 20px 60px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

<tr><td style="text-align:center;padding-bottom:32px;">
  <p style="margin:0;font-size:10px;letter-spacing:6px;color:rgba(255,255,255,0.5);">DISCLOSURE PROTOCOL</p>
  <p style="margin:6px 0 0;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.6);">FIRST CONTACT READINESS PROGRAM</p>
</td></tr>

<tr><td style="text-align:center;padding-bottom:36px;">
  <p style="margin:0 0 10px;font-size:10px;letter-spacing:5px;color:${a.color};">ACCESS GRANTED</p>
  <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;color:#fff;line-height:1.2;">Your First Contact Card<br>has been issued.</p>
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;">${a.tagline}</p>
</td></tr>

<tr><td align="center" style="padding-bottom:36px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:400px;background:#060d06;border:1px solid ${a.color};">
  <tr><td style="padding:28px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:14px;margin-bottom:18px;">
      <tr><td style="font-size:8px;letter-spacing:4px;color:rgba(255,255,255,0.5);">DISCLOSURE</td>
          <td align="right" style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.7);">${serial}</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="text-align:center;padding:4px 0 14px;"><p style="margin:0;font-size:52px;line-height:1;">${a.icon}</p></td></tr>
      <tr><td style="text-align:center;padding-bottom:4px;"><p style="margin:0;font-size:17px;font-weight:700;letter-spacing:6px;color:${a.color};">${a.name}</p></td></tr>
      <tr><td style="text-align:center;padding-bottom:22px;"><p style="margin:0;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.6);">${a.role}</p></td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(255,255,255,0.05);">
      <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.75);">${a.stat1[0]}</td>
          <td align="right" style="font-size:9px;letter-spacing:2px;color:${a.color};">${a.stat1[1]}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.75);">${a.stat2[0]}</td>
          <td align="right" style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.5);">${a.stat2[1]}</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.75);">ISSUED</td>
          <td align="right" style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.7);">${issued}</td>
        </tr></table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 16px;">
      <tr><td style="padding-bottom:6px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.75);">${a.bar_lbl}</td>
          <td align="right" style="font-size:8px;letter-spacing:2px;color:${a.color};">${a.bar_pct}</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:rgba(255,255,255,0.07);height:3px;">
        <table width="${a.bar_w}" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:${a.color};height:3px;">&nbsp;</td>
        </tr></table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border:1px solid rgba(255,255,255,0.07);padding:10px;text-align:center;font-size:9px;letter-spacing:3px;color:${a.color};">${a.status}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:10px 28px 20px;text-align:center;">
    <p style="margin:0;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.38);">THIS CARD IS OFFICIAL ON LAUNCH DAY</p>
  </td></tr>
  </table>
  <p style="margin:10px 0 0;font-family:'Courier New',Courier,monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.45);text-align:center;">${serial} — EARLY ENROLLMENT PRIORITY — LOW SERIALS BOARD FIRST</p>
</td></tr>

<tr><td style="padding:40px 0;text-align:center;">
  <p style="margin:0 0 10px;font-size:10px;letter-spacing:5px;color:#4AF626;">■ INCOMING SIGNAL ■</p>
  <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#fff;line-height:1.3;">Your card is step one.<br>The training is what keeps you alive.</p>
  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;">A mobile training program is being deployed — designed to turn enrolled civilians into field-ready Citizen Diplomats.</p>
</td></tr>

<tr><td style="padding-bottom:36px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #EF4444;margin-bottom:8px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#EF4444;">STONE COLD DRILLS</p>
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">Can you hold still when it matters?</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Strobes. Alien audio. Your phone's gyroscope tracks every flinch. 10 escalating levels. Most people break at Level 4.</p>
    </td></tr>
    <tr><td style="height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #22C55E;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#22C55E;">SIGNAL LANGUAGE</p>
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">The gestures they'll understand.</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">20 universal hand gestures. Your front camera tracks your form. When your voice fails, your hands won't.</p>
    </td></tr>
    <tr><td style="height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:16px;background:rgba(255,255,255,0.03);border-left:3px solid #60A5FA;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;color:#60A5FA;">UNIVERSAL TRANSLATOR</p>
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#fff;">This is how we say hello.</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">Frequency tones and geometric light pulses broadcast from your phone. Point it at the sky. Press transmit.</p>
    </td></tr>
  </table>
</td></tr>

<tr><td style="text-align:center;padding:32px 0 48px;">
  <a href="https://getdisclosure.app" style="display:inline-block;background:#4AF626;color:#000;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:4px;padding:16px 40px;text-decoration:none;font-weight:700;">ACCESS YOUR BRIEFING →</a>
</td></tr>

<tr><td style="text-align:center;padding-top:32px;border-top:1px solid rgba(255,255,255,0.06);">
  <p style="margin:0 0 8px;font-size:8px;letter-spacing:3px;color:rgba(255,255,255,0.3);">DISCLOSURE PROTOCOL — CLASSIFIED CIVILIAN DISTRIBUTION</p>
  <p style="margin:0;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.2);">getdisclosure.app</p>
</td></tr>

</table></td></tr></table>
</body></html>`;
}

async function sendEmail(to: string, archetype: string, serial: string) {
  const a = ARCHETYPES[archetype] ?? ARCHETYPES["diplomat"];

  const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      tls: true,
      auth: { username: SMTP_USER, password: SMTP_PASS },
    },
  });

  await client.send({
    from: `Disclosure Protocol <${SMTP_USER}>`,
    to,
    subject: a.subject,
    html: buildEmail(archetype, serial),
  });
  await client.close();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" } });
  }

  try {
    const { record } = await req.json();
    const { email, archetype, serial_number } = record;

    if (!email || !archetype || !serial_number) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    await sendEmail(email, archetype.toLowerCase(), serial_number);
    console.log(`Card sent: ${email} | ${archetype} | ${serial_number}`);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Send failed:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
