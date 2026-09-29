// GET /card/<token>  (no trailing slash; vercel.json rewrites it here as ?f=<token>)
// Serves card/index.html with this card filled in: the image, the role, and share tags that point
// at this card's own preview image, so a pasted link unfurls with the person's iris.
const path = require("path");
const fs = require("fs");
const IR = require("../assets/dx/iris.js");

const SITE = "https://www.getdisclosure.app";
let template = null;
function page() {
  if (!template) template = fs.readFileSync(path.join(__dirname, "..", "card", "index.html"), "utf8");
  return template;
}
function esc(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" content=")[^"]*(")`);
  return html.replace(re, `$1${esc(value)}$2`);
}

function fill(file, token) {
  const role = IR.ROLES[file.archetype];
  const color = IR.COLORS[file.archetype];
  const q = "f=" + encodeURIComponent(token);
  const pageUrl = `${SITE}/card/${encodeURIComponent(token)}`;
  const img = `/api/card/?${q}&kind=card`;
  const og = `${SITE}/api/card/?${q}&kind=og`;
  const sealed = file.archetype === "first-contact";
  const grown = file.issued ? "ten answers" : "its serial"; // role cards (r1 tokens) carry no answers and no date
  const title = sealed ? "A sealed First Contact Card" : `${role.name}: a First Contact Card`;
  const desc = `${role.line} Serial ${file.serial}. An iris print grown from ${grown}. Find your own role at DISCLOSURE.`;
  const shareText = sealed ? "My DISCLOSURE file came back sealed." : `I was classified ${role.name} (${role.role.toLowerCase()}).`;
  const dossier = sealed ? "Open the sealed file" : `Read the ${role.name.replace("The ", "")} dossier`;

  let html = page();
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)} | DISCLOSURE</title>`);
  html = setMeta(html, "name", "description", desc);
  html = setMeta(html, "property", "og:url", pageUrl);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", desc);
  html = setMeta(html, "property", "og:image", og);
  html = setMeta(html, "property", "og:image:alt", `A First Contact Card for ${role.name}, with an iris print grown from ${grown}.`);
  html = setMeta(html, "name", "twitter:image", og);
  html = html.replace(/(<meta name="dx:control" content=")[^"]*(")/, `$1Card ${esc(file.serial)} &middot; ${esc(role.name)} ${file.issued ? " &middot; Issued " + esc(file.issued) : ""}$2`);

  const body = `<!-- dx:card -->
  <section class="wrap cardpage" aria-labelledby="card-h" style="--card-color:${color};--card-glow:${color}55">
    <figure class="cardpage-img">
      <img src="${esc(img)}" alt="First Contact Card for ${esc(role.name)}, serial ${esc(file.serial)}, ${file.issued ? "issued " + esc(file.issued) + ", " : ""}with an iris print grown from ${grown}." width="1080" height="1350" fetchpriority="high">
      <figcaption class="label">Iris print ${esc(file.serial)}. ${file.issued ? "No two sets of answers grow the same eye." : "Grown from its serial. No two serials grow the same eye."}</figcaption>
    </figure>
    <div>
      <p class="label kicker">First Contact Card &middot; ${esc(role.role)}</p>
      <h1 id="card-h">${esc(role.name)}</h1>
      <p class="lede">${esc(role.line)}</p>
      <p class="first">${esc(role.first)}</p>
      <p class="label meta"><span>Serial ${esc(file.serial)}</span>${file.issued ? "<span>Issued " + esc(file.issued) + "</span>" : ""}</p>
      <div class="actions">
        <a class="btn" href="${esc(img)}" download="disclosure-${esc(file.archetype)}-${esc(file.serial)}.png">Save the card</a>
        <button class="btn btn-ghost" type="button" data-card-share="${esc(shareText)}">Share it</button>
        <a class="link" href="${esc(role.url)}">${esc(dossier)}</a>
      </div>
      <p class="cardpage-msg" aria-live="polite"></p>
      <p class="note">A First Contact Card is a keepsake from a preparedness game, not an ID or a credential. The eye on it was grown from ${grown}.</p>
    </div>
  </section>
  <!-- /dx:card -->`;
  return html.replace(/<!-- dx:card -->[\s\S]*?<!-- \/dx:card -->/, body);
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, SITE);
  const fromPath = url.pathname.match(/^\/card\/([^/]+)\/?$/);
  const token = url.searchParams.get("f") || (fromPath ? decodeURIComponent(fromPath[1]) : "");
  const file = IR.decodeToken(token);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!file) {
    res.statusCode = token ? 404 : 200;
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.end(page());
  }
  res.statusCode = 200;
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400");
  return res.end(fill(file, token));
};
module.exports._internal = { fill };
