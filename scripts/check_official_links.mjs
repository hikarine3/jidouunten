import assert from 'node:assert/strict';
import fs from 'node:fs';

/** @typedef {{ maker: string, model: string, currentCatalogListed: boolean, availability: string, id: string }} Vehicle */
/** @typedef {{ maker: string, model: string, url: string, kind: 'product' | 'archive', checkedAt: string }} OfficialLink */
/** @type {Vehicle[]} */
const vehicles = JSON.parse(fs.readFileSync(new URL('../src/data/vehicles.json', import.meta.url), 'utf8'));
/** @type {OfficialLink[]} */
const links = JSON.parse(fs.readFileSync(new URL('../src/data/official-links.json', import.meta.url), 'utf8'));
/** @param {{ maker: string, model: string }} value */
const key = ({ maker, model }) => `${maker}\u0000${model}`;
const byModel = new Map(links.map((link) => [key(link), link]));

assert.equal(byModel.size, links.length, 'maker + model の公式導線は重複不可');
for (const link of links) {
  assert.match(link.url, /^https:\/\//, `${key(link)}: HTTPS URLが必要`);
  assert.ok(['product', 'archive'].includes(link.kind), `${key(link)}: kindが不正`);
  assert.match(link.checkedAt, /^\d{4}-\d{2}-\d{2}$/, `${key(link)}: checkedAtが不正`);
}

for (const vehicle of vehicles) {
  const link = byModel.get(key(vehicle));
  assert.ok(link, `${vehicle.id}: メーカー公式導線が未登録`);
  if (vehicle.currentCatalogListed) assert.equal(link.kind, 'product', `${vehicle.id}: 現行掲載車はproduct導線が必要`);
  if (vehicle.availability === 'unavailable') assert.equal(link.kind, 'archive', `${vehicle.id}: 現在利用不可の車両はarchive導線だけを許可`);
}

const uniqueUrls = new Set(links.map(({ url }) => url));
const current = vehicles.filter(({ currentCatalogListed }) => currentCatalogListed);
console.log(`PASS: 公式導線 ${links.length}モデル / ${uniqueUrls.size} URL / 全${vehicles.length}販売単位 / 現行${current.length}件product`);
