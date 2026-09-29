// Stamps the shared header and footer onto every page between markers.
//   <!-- dx:header -->...<!-- /dx:header -->   (add "over" for a transparent nav over a hero: <!-- dx:header over -->)
//   <!-- dx:footer -->...<!-- /dx:footer -->
// The footer control line reads <meta name="dx:control" content="...">.
// Usage: node scripts/dx-chrome.mjs [--check]
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const header = readFileSync(join(root, 'docs/partials/header.html'), 'utf8').trim();
const footer = readFileSync(join(root, 'docs/partials/footer.html'), 'utf8').trim();
const check = process.argv.includes('--check');
const SKIP = new Set(['.git', 'node_modules', 'docs', 'scripts', 'supabase', 'frames', '.claude', 'api']);

function pages(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...pages(p));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

function urlPath(file) {
  const rel = relative(root, file).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
}

let changed = 0, missing = [];
for (const file of pages(root)) {
  const src = readFileSync(file, 'utf8');
  const path = urlPath(file);
  let out = src;

  const h = out.match(/<!-- dx:header( over)? -->[\s\S]*?<!-- \/dx:header -->/);
  const f = out.match(/<!-- dx:footer -->[\s\S]*?<!-- \/dx:footer -->/);
  if (!h || !f) { missing.push(path); continue; }

  let hdr = header.replace('{{NAV_ATTR}}', h[1] ? ' data-over data-mode="over"' : '');
  hdr = hdr.replace(/<a href="([^"]+)">/g, (m, href) => {
    const current = href !== '/' && (path === href || (href.length > 1 && path.startsWith(href))
      || (href === '/archetypes/' && path.startsWith('/archetype/')));
    return current ? `<a href="${href}" aria-current="page">` : m;
  });
  const control = (out.match(/<meta name="dx:control" content="([^"]*)"/) || [])[1] || 'Released in part';
  const ftr = footer.replace('{{CONTROL}}', control);

  out = out.replace(h[0], `<!-- dx:header${h[1] || ''} -->\n${hdr}\n<!-- /dx:header -->`);
  out = out.replace(f[0], `<!-- dx:footer -->\n${ftr}\n<!-- /dx:footer -->`);
  if (out !== src) {
    changed++;
    if (!check) writeFileSync(file, out);
  }
}
console.log(`${check ? 'would change' : 'changed'} ${changed} page(s)`);
if (missing.length) console.log(`no markers (${missing.length}): ${missing.join(', ')}`);
if (check && changed) process.exitCode = 1;
