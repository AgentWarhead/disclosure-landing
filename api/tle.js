// GET /api/tle
// Satellite orbital elements for the sky identifier (/tools/what-did-i-see/).
// Fetches CelesTrak GP data (OMM JSON) for a fixed set of groups, validates and trims every
// record, and returns one compact JSON document that Vercel's edge caches for two hours.
//
// CelesTrak usage policy (https://celestrak.org/usage-policy.php, read 2026-09-28):
//   "Only download the data you need, when you are going to use it, and only download data
//    once per update." GP data "updates are once every 2 hours."
//   "M2M (machine-to-machine) software should immediately stop querying when it receives any
//    non-HTTP 200 responses and report the results to a human for investigation."
//   Repeatedly ignoring the rules ends "sending your IP address to the firewall."
// How this function respects that:
//   - Cache-Control public, s-maxage=7200 (two hours, one GP update cycle) with
//     stale-while-revalidate=3600, so each Vercel edge region asks CelesTrak at most about once
//     per update cycle, however many people use the tool.
//   - Any non-200 from CelesTrak stops the run for that group, is logged for a human, and the
//     failure response is itself cached for 15 minutes so a broken upstream is not hammered.
//   - A warm instance also keeps its last good document in memory for two hours.
//
// Groups (fixed allowlist; no request input ever reaches the upstream URL):
//   stations      the crewed stations and their modules (ISS, Tiangong)          ~30 objects
//   visual        CelesTrak's "100 (or so) brightest"                            ~160 objects
//   last-30-days  every object launched in the last 30 days                       ~300 objects
// Starlink decision (measured 2026-09-28): the full "starlink" group is about 1.8 MB as TLE and
// larger as JSON, roughly 10,000 objects, and almost all of them are too faint to notice.
// The "line of lights" people report is a fresh launch batch still climbing to its final orbit,
// which is exactly what "last-30-days" carries. So the full Starlink group is never fetched.
//
// Response: { v, source, fetched, groups: {name: {ok, count}}, sats: [[...], ...] }
// Each sat row: [name, intlDesignator, noradId, epochISO, meanMotion, eccentricity, inclination,
//                raan, argPerigee, meanAnomaly, bstar, meanMotionDot, meanMotionDDot, groupCode]
// groupCode: "s" stations, "v" visual, "r" recent launch. The client rebuilds OMM objects for
// satellite.js json2satrec. No personal data is received, stored or logged.

const BASE = "https://celestrak.org/NORAD/elements/gp.php";
const GROUPS = [
  { name: "stations", code: "s", max: 200 },
  { name: "visual", code: "v", max: 400 },
  { name: "last-30-days", code: "r", max: 1500 },
];
const UPSTREAM_TIMEOUT_MS = 8000;
const MAX_BYTES = 3 * 1024 * 1024; // any one group larger than this is refused
const MEMORY_TTL_MS = 2 * 60 * 60 * 1000;
const CACHE_OK = "public, s-maxage=7200, stale-while-revalidate=3600";
const CACHE_PARTIAL = "public, s-maxage=900, stale-while-revalidate=600";
const CACHE_FAIL = "public, s-maxage=900";

let memo = null; // { at, body }

function finite(v, lo, hi) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= lo && n <= hi ? n : null;
}

// One OMM record in, one compact row out, or null if anything is off.
function trimRecord(o, code) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const name = typeof o.OBJECT_NAME === "string" ? o.OBJECT_NAME.replace(/[^A-Za-z0-9 ()\-\/.+#&]/g, "").trim().slice(0, 40) : "";
  const intl = typeof o.OBJECT_ID === "string" && /^\d{4}-\d{3}[A-Z]{0,3}$/.test(o.OBJECT_ID) ? o.OBJECT_ID : "";
  const norad = finite(o.NORAD_CAT_ID, 1, 999999999);
  const epochStr = typeof o.EPOCH === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?Z?$/.test(o.EPOCH) ? o.EPOCH : "";
  const epochMs = epochStr ? Date.parse(epochStr.endsWith("Z") ? epochStr : epochStr + "Z") : NaN;
  if (!name || !norad || !Number.isInteger(norad) || !Number.isFinite(epochMs)) return null;
  // SGP4 elements for near-Earth objects only: mean motion above 6 rev/day (period under 4 hours).
  const mm = finite(o.MEAN_MOTION, 6, 17.5);
  const ecc = finite(o.ECCENTRICITY, 0, 0.3);
  const inc = finite(o.INCLINATION, 0, 180);
  const raan = finite(o.RA_OF_ASC_NODE, 0, 360);
  const argp = finite(o.ARG_OF_PERICENTER, 0, 360);
  const ma = finite(o.MEAN_ANOMALY, 0, 360);
  const bstar = finite(o.BSTAR, -1, 1);
  const ndot = finite(o.MEAN_MOTION_DOT, -1, 1);
  const nddot = finite(o.MEAN_MOTION_DDOT, -1, 1);
  if ([mm, ecc, inc, raan, argp, ma, bstar, ndot, nddot].some((x) => x === null)) return null;
  const epoch = new Date(epochMs).toISOString();
  return [name, intl, norad, epoch, mm, ecc, inc, raan, argp, ma, bstar, ndot, nddot, code];
}

async function fetchGroup(group) {
  // The URL is built only from the fixed GROUPS table above.
  const url = BASE + "?GROUP=" + encodeURIComponent(group.name) + "&FORMAT=json";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "getdisclosure.app sky identifier (cached 2h at edge)" },
    });
    if (resp.status !== 200) {
      // Policy: stop on any non-200 and tell a human (Vercel logs).
      console.error("tle: CelesTrak returned " + resp.status + " for group " + group.name + ", stopping this group");
      return { ok: false, rows: [] };
    }
    const len = Number(resp.headers.get("content-length") || 0);
    if (len > MAX_BYTES) { console.error("tle: group " + group.name + " too large (" + len + " bytes)"); return { ok: false, rows: [] }; }
    const text = await resp.text();
    if (text.length > MAX_BYTES) { console.error("tle: group " + group.name + " too large"); return { ok: false, rows: [] }; }
    let data;
    try { data = JSON.parse(text); } catch (_) { console.error("tle: group " + group.name + " is not JSON"); return { ok: false, rows: [] }; }
    if (!Array.isArray(data)) return { ok: false, rows: [] };
    const rows = [];
    for (const o of data.slice(0, group.max)) {
      const r = trimRecord(o, group.code);
      if (r) rows.push(r);
    }
    return { ok: rows.length > 0, rows };
  } catch (_) {
    console.error("tle: CelesTrak unreachable for group " + group.name);
    return { ok: false, rows: [] };
  } finally {
    clearTimeout(timer);
  }
}

// Builds the document. Exported for the snapshot script and tests.
async function build() {
  const results = [];
  for (const g of GROUPS) results.push(await fetchGroup(g)); // one at a time, gentle on the upstream
  const seen = new Set();
  const sats = [];
  const groups = {};
  GROUPS.forEach((g, i) => {
    const res = results[i];
    groups[g.name] = { ok: res.ok, count: res.rows.length };
    for (const row of res.rows) {
      if (seen.has(row[2])) continue; // an object can sit in two groups; keep the first
      seen.add(row[2]);
      sats.push(row);
    }
  });
  return {
    v: 1,
    source: "CelesTrak GP data, celestrak.org",
    fetched: new Date().toISOString(),
    groups,
    sats,
  };
}

function send(res, status, cache, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Robots-Tag", "noindex");
  res.end(JSON.stringify(body));
}

async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return send(res, 405, "no-store", { ok: false, error: "method_not_allowed" });
  }
  // Query strings are ignored entirely: there is nothing a caller can choose.
  const now = Date.now();
  if (memo && now - memo.at < MEMORY_TTL_MS) return send(res, 200, CACHE_OK, memo.body);

  const body = await build();
  const okCount = Object.values(body.groups).filter((g) => g.ok).length;
  if (!body.sats.length) return send(res, 502, CACHE_FAIL, { ok: false, error: "upstream_unavailable" });
  if (okCount === GROUPS.length) {
    memo = { at: now, body };
    return send(res, 200, CACHE_OK, body);
  }
  return send(res, 200, CACHE_PARTIAL, body);
}

module.exports = handler;
module.exports._internal = { build, trimRecord, GROUPS, reset: () => { memo = null; } };
