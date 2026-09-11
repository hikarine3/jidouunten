import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const expectedGtmId = 'GTM-PV9QVMJV';
const forbiddenIds = ['GTM-TEST', 'G-TEST'];

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.name.endsWith('.html') ? [target] : [];
  });
}

const files = htmlFiles(distDir);
const failures = [];
if (files.length === 0) failures.push('distにHTMLがありません。実IDでnpm run buildを先に実行してください');

for (const file of files) {
  const body = fs.readFileSync(file, 'utf8');
  const relative = path.relative(process.cwd(), file);
  const gtmCount = body.split(expectedGtmId).length - 1;
  if (gtmCount !== 1) failures.push(`${relative}: ${expectedGtmId} が${gtmCount}件（1件必須）`);
  for (const forbiddenId of forbiddenIds) {
    if (body.includes(forbiddenId)) failures.push(`${relative}: テスト計測ID ${forbiddenId} が残っています`);
  }
}

if (failures.length > 0) {
  console.error(`FAIL: release build measurement guard (${failures.length}件)`);
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`PASS: 実ID ${expectedGtmId} を${files.length} HTMLへ各1件、テスト計測ID0件`);
