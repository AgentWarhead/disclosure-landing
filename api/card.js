// GET /api/card/?f=<token>&kind=card|og|iris[&fmt=jpg]   (fmt=jpg: the card as a light JPEG for email)
// Draws a First Contact Card as a PNG from a card token (see assets/dx/iris.js encodeToken).
// The token carries the salt, the ten answers, the serial and the issue date. The role is recomputed
// from the answers, so a token cannot claim a role it did not earn. Output is deterministic, so it is
// cached for a year at the edge and in browsers. No personal data is involved.
const path = require("path");
const fs = require("fs");
const { createCanvas, GlobalFonts, Path2D, loadImage } = require("@napi-rs/canvas");
const IR = require("../assets/dx/iris.js");

const FONT_DIR = path.join(__dirname, "_fonts");
let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  GlobalFonts.registerFromPath(path.join(FONT_DIR, "PublicSans-Regular.ttf"), "Public Sans");
  GlobalFonts.registerFromPath(path.join(FONT_DIR, "PublicSans-ExtraBold.ttf"), "Public Sans");
  GlobalFonts.registerFromPath(path.join(FONT_DIR, "PublicSans-Black.ttf"), "Public Sans");
  GlobalFonts.registerFromPath(path.join(FONT_DIR, "SpaceMono-Bold.ttf"), "Space Mono");
  fontsReady = true;
}

let markPromise = null;
function wordmark() {
  if (!markPromise) {
    const p = path.join(__dirname, "..", "assets", "brand", "disclosure-wordmark.png");
    markPromise = fs.existsSync(p) ? loadImage(fs.readFileSync(p)).catch(() => null) : Promise.resolve(null);
  }
  return markPromise;
}

function iris(file, size) {
  const cv = createCanvas(size, size);
  IR.draw(cv.getContext("2d"), {
    size, dpr: size / 365, answers: file.answers, salt: file.salt, archetype: file.archetype,
    growth: 1, dilation: 0.35, Path2D,
  });
  return cv;
}

async function render(file, kind, jpg) {
  registerFonts();
  if (kind === "iris") return iris(file, 600).encode("png");
  const W = kind === "og" ? 1200 : 1080;
  const H = kind === "og" ? 630 : 1350;
  const cv = createCanvas(W, H);
  const mark = await wordmark();
  IR.drawCard(cv.getContext("2d"), kind, file, iris(file, kind === "og" ? 540 : 620), mark);
  return kind === "og" || jpg ? cv.encode("jpeg", 86) : cv.encode("png");
}

function fail(res, status, msg) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.end(msg);
}

async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") { res.setHeader("Allow", "GET, HEAD"); return fail(res, 405, "method not allowed"); }
  const url = new URL(req.url, "https://www.getdisclosure.app");
  const file = IR.decodeToken(url.searchParams.get("f") || "");
  if (!file) return fail(res, 400, "invalid card");
  const kindParam = url.searchParams.get("kind") || "card";
  const kind = ["card", "og", "iris"].includes(kindParam) ? kindParam : "card";
  try {
    const jpg = kind === "card" && url.searchParams.get("fmt") === "jpg";
    const buf = await render(file, kind, jpg);
    res.statusCode = 200;
    res.setHeader("Content-Type", kind === "og" || jpg ? "image/jpeg" : "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", `inline; filename="disclosure-${file.archetype}-${file.serial}.${kind === "og" || jpg ? "jpg" : "png"}"`);
    res.end(req.method === "HEAD" ? undefined : buf);
  } catch (e) {
    console.error("card: render failed");
    return fail(res, 500, "render failed");
  }
}

module.exports = handler;
module.exports._internal = { render };
