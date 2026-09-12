// @ts-nocheck
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist/cars');
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html' && full !== path.join(root, 'index.html')) files.push(full);
  }
};
walk(root);
const failures = [];
for (const file of files) {
  const body = fs.readFileSync(file, 'utf8');
  const items = body.match(/data-checklist-item=/g) || [];
  if (items.length !== 5) failures.push(`${file}: checklist items ${items.length}/5`);
  if (!body.includes('adas_checklist_open') || !body.includes('adas_checklist_complete')) failures.push(`${file}: checklist events missing`);
  if (!body.includes('安全性や操作の保証ではありません')) failures.push(`${file}: safety disclaimer missing`);
}
if (files.length === 0 || failures.length) {
  console.error(`FAIL: ADAS checklist ${failures.length} errors across ${files.length} detail pages`);
  failures.slice(0, 20).forEach((failure) => console.error(failure));
  process.exit(1);
}
console.log(`PASS: ADAS checklist ${files.length} detail pages / ${files.length * 5} items / events and disclaimer present`);
