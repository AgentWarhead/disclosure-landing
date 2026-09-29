// Writes assets/data/ledger.csv from assets/data/ledger.json: one row per ledger entry, oldest first,
// numbered the same way as /record/ (chronological, oldest = 1). Run after editing ledger.json:
//   node scripts/dx-ledger-csv.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const here = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'assets', 'data');
const data = JSON.parse(readFileSync(join(here, 'ledger.json'), 'utf8'));
const entries = data.entries.slice().sort((a, b) => a.date.localeCompare(b.date) || (a.order || 0) - (b.order || 0));

const cell = v => {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const head = ['entry', 'id', 'date', 'type', 'verdict', 'text', 'note', 'sources', 'link'];
const lines = [head.join(',')];
entries.forEach((e, i) => {
  lines.push([
    i + 1, e.id, e.date, e.type, e.verdict, e.text, e.note || '',
    (e.sources || []).map(s => s.url).join(' '),
    'https://www.getdisclosure.app/record/#e-' + e.id
  ].map(cell).join(','));
});
// UTF-8 with a byte order mark so spreadsheet apps read the curly quotes correctly
writeFileSync(join(here, 'ledger.csv'), '﻿' + lines.join('\r\n') + '\r\n');
console.log(`ledger.csv: ${entries.length} entries`);
