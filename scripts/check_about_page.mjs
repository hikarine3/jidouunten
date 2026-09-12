// @ts-nocheck
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('dist/about/index.html');
assert.ok(fs.existsSync(file), '運営者情報ページのbuild成果物がありません');
const body = fs.readFileSync(file, 'utf8');
const visible = body
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ');

for (const [label, value] of [
  ['canonical', '<link rel="canonical" href="https://jidouunten.jp/about/">'],
  ['brand', '自動運転.jp'],
  ['operator', '株式会社1st Class'],
  ['contact', 'https://github.com/hikarine3/jidouunten/issues'],
  ['footer reachability', 'href="/about/"'],
]) {
  assert.ok(body.includes(value), `${label}がありません`);
}

for (const forbidden of ['GA4', 'GSC', 'Bing', 'KPI', 'market demand']) {
  assert.equal(visible.includes(forbidden), false, `内部計測情報が公開本文へ漏出: ${forbidden}`);
}

const jsonLd = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
const graph = jsonLd.flatMap((data) => data['@graph'] ?? [data]);
assert.equal(graph.filter((node) => node['@type'] === 'AboutPage').length, 1, 'AboutPageが1件ではありません');
assert.equal(graph.filter((node) => node['@type'] === 'Organization').length, 1, 'Organizationが1件ではありません');
assert.equal(graph.find((node) => node['@type'] === 'Organization')?.url, 'https://1stclass.co.jp/', 'Organization URLが不一致');

console.log('PASS: 運営者情報ページ 1/1（公開本文・canonical・導線・構造化データ・内部情報非漏出）');
