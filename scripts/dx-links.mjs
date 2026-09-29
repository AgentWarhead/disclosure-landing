// Link graph audit, counted inside <main> only (nav and footer excluded).
// Usage: node scripts/dx-links.mjs [--json]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules', 'docs', 'scripts', 'supabase', 'frames', '.claude', 'api', 'og', 'assets']);
function walk(d) { const o = []; for (const n of readdirSync(d)) { if (SKIP.has(n)) continue; const p = join(d, n); if (statSync(p).isDirectory()) o.push(...walk(p)); else if (n === 'index.html') o.push(p); } return o; }
const pathOf = f => '/' + relative(root, f).split(sep).join('/').replace(/index\.html$/, '');

const pages = walk(root).map(f => {
  const html = readFileSync(f, 'utf8');
  const m = html.match(/<main[\s\S]*?<\/main>/);
  const main = m ? m[0] : '';
  const out = [...new Set([...main.matchAll(/href="(\/[^"#?]*)/g)].map(x => x[1]).filter(h => h.endsWith('/')))];
  const title = (html.match(/<title>([^<|]*)/) || [])[1]?.trim() || '';
  return { path: pathOf(f), out, title };
});
const byPath = Object.fromEntries(pages.map(p => [p.path, p]));
for (const p of pages) p.in = [];
for (const p of pages) for (const h of p.out) if (byPath[h] && h !== p.path) byPath[h].in.push(p.path);

// click depth from home using main links only
const depth = { '/': 0 }; const q = ['/'];
while (q.length) { const c = q.shift(); for (const h of (byPath[c]?.out || [])) if (byPath[h] && depth[h] === undefined) { depth[h] = depth[c] + 1; q.push(h); } }

const rows = pages.map(p => ({ path: p.path, in: p.in.length, out: p.out.filter(h => byPath[h]).length, depth: depth[p.path] ?? 'unreachable', title: p.title }))
  .sort((a, b) => a.in - b.in);
if (process.argv.includes('--json')) { console.log(JSON.stringify(rows)); process.exit(0); }
const fam = p => p === '/' ? 'home' : p.startsWith('/intel/') && p !== '/intel/' ? 'intel article' : p.startsWith('/archetype/') ? 'dossier' : 'core';
console.log('Weakest inbound (inside <main>):');
rows.slice(0, 25).forEach(r => console.log(`  in ${String(r.in).padStart(2)}  out ${String(r.out).padStart(2)}  depth ${r.depth}  ${r.path}`));
const byFam = {};
rows.forEach(r => { const f = fam(r.path); (byFam[f] ||= []).push(r); });
console.log('\nBy family (median inbound, max depth, unreachable):');
for (const [f, rs] of Object.entries(byFam)) {
  const ins = rs.map(r => r.in).sort((a, b) => a - b);
  const depths = rs.map(r => r.depth).filter(d => d !== 'unreachable');
  console.log(`  ${f.padEnd(14)} n=${rs.length} medianIn=${ins[Math.floor(ins.length / 2)]} maxDepth=${Math.max(...depths)} unreachable=${rs.filter(r => r.depth === 'unreachable').length}`);
}
console.log('\nCore pages inbound:');
rows.filter(r => fam(r.path) !== 'intel article').sort((a, b) => a.path.localeCompare(b.path)).forEach(r => console.log(`  in ${String(r.in).padStart(2)}  depth ${r.depth}  ${r.path}`));
