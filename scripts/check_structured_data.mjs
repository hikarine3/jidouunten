// @ts-nocheck
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const siteOrigin = 'https://jidouunten.jp';
const vehicles = JSON.parse(fs.readFileSync(new URL('../src/data/vehicles.json', import.meta.url), 'utf8'));
const vehicleByUrl = new Map(vehicles.map((vehicle) => [`${siteOrigin}/cars/${vehicle.id}/`, vehicle]));

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

assert.ok(fs.existsSync(distDir), 'distがありません。npm run buildを先に実行してください');
const files = htmlFiles(distDir);
assert.ok(files.length > 0, '検査対象HTMLが0件');
let breadcrumbPages = 0;
let vehiclePages = 0;
let itemListPages = 0;
let itemListEntries = 0;

for (const file of files) {
  const body = fs.readFileSync(file, 'utf8');
  const scripts = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const graph = scripts.flatMap((data) => data['@graph'] ?? [data]);
  const canonical = body.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.ok(canonical, `${file}: canonicalがありません`);
  const websites = graph.filter((node) => node['@type'] === 'WebSite');
  const webpages = graph.filter((node) => node['@type'] === 'WebPage');
  const breadcrumbs = graph.filter((node) => node['@type'] === 'BreadcrumbList');
  assert.equal(websites.length, 1, `${file}: WebSite重複または欠落`);
  assert.equal(webpages.length, 1, `${file}: WebPage重複または欠落`);
  assert.equal(webpages[0].url, canonical, `${file}: WebPage URL不一致`);
  assert.equal(breadcrumbs.length, 1, `${file}: BreadcrumbList重複または欠落`);
  const breadcrumbItems = breadcrumbs[0].itemListElement;
  assert.ok(Array.isArray(breadcrumbItems) && breadcrumbItems.length > 0, `${file}: BreadcrumbListが空`);
  assert.deepEqual(breadcrumbItems.map((item) => item.position), breadcrumbItems.map((_, index) => index + 1), `${file}: breadcrumb position不連続`);
  assert.equal(breadcrumbItems.at(-1).item, canonical, `${file}: 最終breadcrumb URL不一致`);
  breadcrumbPages += 1;

  const vehicleNodes = graph.filter((node) => node['@type'] === 'Car' || node['@type'] === 'Vehicle');
  if (canonical.includes('/cars/jp-')) {
    assert.equal(vehicleNodes.length, 1, `${file}: 車両構造化データが1件ではありません`);
    const vehicle = vehicleByUrl.get(canonical);
    assert.ok(vehicle, `${file}: 正本にない車両URL`);
    const node = vehicleNodes[0];
    assert.equal(node.url, canonical, `${file}: 車両URL不一致`);
    assert.equal(node.brand?.name, vehicle.maker, `${file}: brand不一致`);
    assert.equal(node.model, vehicle.model, `${file}: model不一致`);
    assert.equal(node.vehicleConfiguration, vehicle.grade, `${file}: grade不一致`);
    assert.equal(node.name, `${vehicle.maker} ${vehicle.model} ${vehicle.grade}`, `${file}: 車両name不一致`);
    if (vehicle.modelYear) assert.equal(node.modelDate, vehicle.modelYear, `${file}: modelDate不一致`);
    else assert.equal('modelDate' in node, false, `${file}: modelYear未確認なのにmodelDateを出力`);
    assert.equal('aggregateRating' in node, false, `${file}: aggregateRatingを出力`);
    assert.equal('automationLevel' in node, false, `${file}: automationLevelを評価値として出力`);
    vehiclePages += 1;
  }

  const itemLists = graph.filter((node) => node['@type'] === 'ItemList');
  if (canonical === `${siteOrigin}/` || canonical === `${siteOrigin}/cars/`) {
    assert.equal(itemLists.length, 1, `${file}: ItemList欠落または重複`);
    const itemList = itemLists[0];
    assert.equal(itemList.url, `${siteOrigin}/cars/`, `${file}: ItemList URL不一致`);
    assert.equal(itemList.itemListElement.length, itemList.numberOfItems, `${file}: ItemList件数不一致`);
    assert.ok(itemList.itemListElement.length > 0, `${file}: ItemListが空`);
    itemList.itemListElement.forEach((item, index) => {
      assert.equal(item.position, index + 1, `${file}: ItemList position不連続`);
      const vehicle = vehicleByUrl.get(item.url);
      assert.ok(vehicle?.currentCatalogListed && (vehicle.availability === 'new_order_available' || vehicle.availability === 'unknown'), `${file}: 非可視車両をItemListへ掲載`);
      assert.equal(item.name, `${vehicle.maker} ${vehicle.model} ${vehicle.grade}`, `${file}: ItemList name不一致`);
    });
    itemListPages += 1;
    itemListEntries += itemList.itemListElement.length;
  } else {
    assert.equal(itemLists.length, 0, `${file}: 一覧以外にItemListを出力`);
  }

  assert.equal(/new_order_available|inventory_only|used_only|service_available|trial_or_research|availabilityCheckedAt|salesUnitIntroducedAt/.test(body), false, `${file}: 内部enum/内部時点キーが公開HTMLへ漏出`);
}

console.log(`PASS: ${files.length} HTML中 BreadcrumbList${breadcrumbPages}件 / 車両Car${vehiclePages}件 / ItemList${itemListPages}ページ・${itemListEntries}項目を検証`);
