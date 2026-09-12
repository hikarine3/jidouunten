// @ts-nocheck
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwrightCandidates = [
  process.env.PLAYWRIGHT_PATH,
  'playwright',
  '/Users/hajimekurita/.cache/codex-playwright/node_modules/playwright',
].filter(Boolean);
let playwright;
for (const candidate of playwrightCandidates) {
  try { playwright = require(candidate); break; } catch { /* try the next locally installed copy */ }
}
if (!playwright) throw new Error('Playwright is not installed. Set PLAYWRIGHT_PATH to an installed local package.');

const base = process.env.BASE_URL || 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await playwright.chromium.launch({ headless: true, ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}) });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const qaDir = '.cache/list-home';
fs.mkdirSync(qaDir, { recursive: true });
const analyticsRequests = [];
const analyticsResponses = [];
page.on('request', (request) => { if (/googletagmanager|google-analytics|analytics\.google/i.test(request.url())) analyticsRequests.push(request.url()); });
page.on('response', (response) => { if (/collect|google-analytics/i.test(response.url())) analyticsResponses.push({ url: response.url(), status: response.status() }); });
const visibleCards = () => page.locator('[data-vehicle-shell]:not([hidden])').count();
const events = () => page.evaluate(() => window.dataLayer || []);
const structuredGraph = (html) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1])['@graph'] || []);

try {
  const rootHtml = await (await fetch(`${base}/`)).text();
  assert.equal(rootHtml.includes('\0'), false, '公開HTMLにNUL制御文字を含めない');
  const rootGraph = structuredGraph(rootHtml);
  assert.deepEqual(rootGraph.map((entry) => entry['@type']), ['WebSite', 'WebPage', 'ItemList', 'BreadcrumbList'], 'トップJSON-LDにWebSite/WebPage/ItemList/BreadcrumbList');
  const rootItemList = rootGraph.find((entry) => entry['@type'] === 'ItemList');
  assert.equal(rootItemList.numberOfItems, 455, 'トップItemListは初期可視455件');
  assert.equal(rootItemList.itemListElement.length, 455, 'トップItemList要素数は初期可視455件');
  assert.deepEqual(rootItemList.itemListElement.map(({ position }) => position), Array.from({ length: 455 }, (_, index) => index + 1), 'トップItemList positionを連番で出力');
  assert.equal(rootGraph.filter((entry) => entry['@type'] === 'BreadcrumbList').length, 1, 'トップBreadcrumbListは重複しない');
  await page.goto(`${base}/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert.equal(await visibleCards(), 455, '既定カタログは現行確認455件');
  const listImages = page.locator('.vehicle-card-image img');
  const listImageSources = await listImages.evaluateAll((elements) => [...new Set(elements.map((element) => element.getAttribute('src')))]);
  assert.deepEqual(listImageSources.sort(), ['/vehicles/tesla-model-3.webp', '/vehicles/tesla-model-y.webp', '/vehicles/toyota-prius.webp'], '一覧の登録済み参考写真は3種類');
  assert.equal(await listImages.first().getAttribute('loading'), 'lazy', '一覧画像を遅延読み込み');
  assert.equal(await listImages.first().getAttribute('decoding'), 'async', '一覧画像を非同期デコード');
  assert.match(await listImages.first().getAttribute('sizes'), /33vw/, '一覧画像にレスポンシブsizesを指定');
  const listImageBox = await listImages.first().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height, objectFit: getComputedStyle(element).objectFit };
  });
  assert.ok(listImageBox.height >= 88 && listImageBox.height <= 118, `一覧画像の高さをサムネイル範囲に収める: ${listImageBox.height}`);
  assert.equal(listImageBox.objectFit, 'cover', '一覧画像はcoverでカード内に収める');
  assert.match(await page.locator('.vehicle-card-image figcaption').first().innerText(), /Wikimedia Commons/, '一覧画像の帰属表示');
  assert.match(await page.locator('.catalog-command').innerText(), /同じLevel 2でも[\s\S]*できることは違う[\s\S]*455[\s\S]*条件内可[\s\S]*70[\s\S]*不可[\s\S]*384[\s\S]*未確認[\s\S]*1[\s\S]*車線変更支援[\s\S]*68/, 'トップ操作盤に能力差の実データ分布');
  assert.equal(await page.locator('[data-level-shortcut]').count(), 5, 'Level 1〜5を同時表示');
  assert.match(await page.locator('[data-level-shortcut="1"]').innerText(), /L1[\s\S]*29件/, 'Level 1の現行29件を表示');
  assert.equal(await page.locator('[data-level-shortcut="1"]').isDisabled(), false, '現行車があるLevel 1を絞り込み可能にする');
  assert.match(await page.locator('.level-scope-note').innerText(), /Level 1[\s\S]*29件/, '車両一覧のLevel 1取り扱い件数を明記');
  assert.match(await page.locator('[data-level-shortcut="3"]').innerText(), /L3[\s\S]*条件付自動運転[\s\S]*過去例 1件/, 'Level 3の過去例を現行車と区別');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla' }).count(), 6, 'Tesla Model 3 / Model Yの6販売仕様を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Hyundai IONIQ 5' }).count(), 4, 'Hyundai IONIQ 5の4グレードを既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota MIRAI' }).count(), 2, 'Toyota MIRAIのZ/G 2販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Land Rover Discovery Sport' }).count(), 3, 'Land Rover Discovery Sportの3グレードを既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Land Rover Discovery Sport' }).filter({ hasText: 'Dynamic S' }).innerText(), /LEVEL 2[\s\S]*約724万円[\s\S]*ハンズオフ：不可[\s\S]*車線中央維持/, 'Discovery Sport Dynamic Sの価格・Level 2・手保持条件を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota MIRAI' }).filter({ hasText: 'Z（2WD・5人乗り）' }).innerText(), /LEVEL 2[\s\S]*約822万円[\s\S]*ハンズオフ：条件内で可[\s\S]*車線変更支援/, 'MIRAI Zの価格・条件内ハンズオフ・車線変更支援を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Audi A5' }).count(), 6, 'Audi A5 / A5 Avantの6販売単位を既定一覧に表示');
  const audiA5Cards = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3').filter({ hasText: /^Audi A5$/ }) });
  const audiA5AvantCards = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3').filter({ hasText: /^Audi A5 Avant$/ }) });
  assert.match(await audiA5Cards.filter({ hasText: 'TFSI 110kW' }).first().innerText(), /LEVEL 2[\s\S]*約617万円[\s\S]*ハンズオフ：不可[\s\S]*車線変更支援/, 'Audi A5の価格・Level 2・車線変更支援を表示');
  assert.match(await audiA5AvantCards.filter({ hasText: 'TDI quattro 150kW' }).innerText(), /LEVEL 2[\s\S]*約760万円[\s\S]*ハンズオフ：不可[\s\S]*車線変更支援/, 'Audi A5 Avantの価格・Level 2・車線変更支援を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mercedes-Benz GLC' }).count(), 5, 'Mercedes-Benz GLCの5販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mercedes-Benz C-Class Sedan' }).count(), 6, 'Mercedes-Benz C-Class Sedanの6販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mercedes-Benz GLC' }).filter({ hasText: '220 d 4MATIC Core' }).innerText(), /LEVEL 2[\s\S]*約829万円[\s\S]*ハンズオフ：不可[\s\S]*車線中央維持/, 'GLC Coreの価格・Level 2・手保持条件を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'SUBARU フォレスター' }).count(), 7, 'SUBARU フォレスターの7グレードを既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'SUBARU フォレスター' }).filter({ hasText: 'Premium S:HEV EX' }).innerText(), /LEVEL 2[\s\S]*約464万円[\s\S]*ハンズオフ：条件内で可[\s\S]*車線変更支援/, 'フォレスター EyeSight Xの価格・条件内ハンズオフ・車線変更支援を表示');
  const foresterTouringCard = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3 a').filter({ hasText: /^SUBARU フォレスター$/ }) }).filter({ has: page.locator('.maker').filter({ hasText: /Touring$/ }) });
  assert.match(await foresterTouringCard.innerText(), /LEVEL 2[\s\S]*約385万円[\s\S]*ハンズオフ：不可/, 'フォレスター標準EyeSightの価格・ハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan エクストレイル' }).count(), 14, '日産エクストレイルの14販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan エクストレイル' }).filter({ hasText: 'X e-4ORCE [2列]' }).innerText(), /LEVEL 2[\s\S]*約439万円[\s\S]*ハンズオフ：不可[\s\S]*車線中央維持/, 'エクストレイル X e-4ORCEの価格・Level 2・ハンズオフ不可を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan エクストレイル' }).filter({ hasText: 'NISMO e-4ORCE' }).innerText(), /約575万円[\s\S]*ハンズオフ：不可/, 'エクストレイル NISMOの価格・ハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan キックス' }).count(), 12, '日産キックスのP16現行12販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan キックス' }).filter({ hasText: 'X シンプルパッケージ' }).innerText(), /LEVEL 2[\s\S]*約300万円[\s\S]*ハンズオフ：不可[\s\S]*車線中央維持/, 'キックスの価格・Level 2・ハンズオン条件を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda ZR-V' }).count(), 4, 'Honda ZR-Vの4販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda ZR-V' }).filter({ hasText: 'e:HEV X〈FF〉' }).innerText(), /LEVEL 2[\s\S]*約371万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'ZR-V X FFの価格・Level 2・手保持条件を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda ZR-V' }).filter({ hasText: 'e:HEV Z〈4WD〉' }).innerText(), /約453万円[\s\S]*ハンズオフ：不可/, 'ZR-V Z 4WDの価格と手保持条件を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota クラウン スポーツ' }).count(), 4, 'Toyota クラウン スポーツの4販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota クラウン（クロスオーバー）' }).count(), 4, 'Toyota クラウン（クロスオーバー）の4販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota クラウン（クロスオーバー）' }).filter({ hasText: 'CROSSOVER RS（ハイブリッド車）' }).first().innerText(), /LEVEL 2[\s\S]*約674万円[\s\S]*ハンズオフ：条件内で可[\s\S]*車線変更支援/, 'クラウン クロスオーバー RSの価格・条件内ハンズオフ・車線変更支援を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota クラウン（クロスオーバー）' }).filter({ hasText: 'CROSSOVER G（ハイブリッド車）' }).innerText(), /LEVEL 2[\s\S]*約518万円[\s\S]*ハンズオフ：不可/, 'クラウン クロスオーバー Gの価格・ハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda ステップ ワゴン' }).count(), 10, 'Honda ステップ ワゴンの10販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda ステップ ワゴン' }).filter({ hasText: 'AIR〈FF〉' }).innerText(), /LEVEL 2[\s\S]*約335万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'ステップ ワゴン AIRの価格・Level 2・渋滞支援を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda ステップ ワゴン' }).filter({ hasText: 'e:HEV SPADA PREMIUM LINE〈FF〉' }).innerText(), /LEVEL 2[\s\S]*約427万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'ステップ ワゴン上位e:HEVの価格・能力差を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda フリード' }).count(), 8, 'Honda フリード CROSSTARの8販売単位を既定一覧に表示');
  const freedCards = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3').filter({ hasText: /^Honda フリード$/ }) });
  assert.match(await freedCards.filter({ has: page.locator('.maker').filter({ hasText: /現行仕様　CROSSTAR〈FF・5人乗り〉$/ }) }).innerText(), /LEVEL 2[\s\S]*約293万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'フリード CROSSTARの価格・Level 2・渋滞支援を表示');
  assert.match(await freedCards.filter({ has: page.locator('.maker').filter({ hasText: /現行仕様　e:HEV CROSSTAR〈4WD・6人乗り〉$/ }) }).innerText(), /約360万円[\s\S]*ハンズオフ：不可/, 'フリード e:HEV CROSSTAR上位単位の価格と手保持条件を表示');
  const civicCards = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3').filter({ hasText: /^Honda CIVIC$/ }) });
  assert.equal(await civicCards.count(), 5, 'CIVICは2026年6月発売の5タイプを既定一覧に表示');
  assert.match(await civicCards.filter({ hasText: 'e:HEV LX' }).innerText(), /LEVEL 2[\s\S]*約413万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'CIVIC e:HEV LXの価格・Level 2・渋滞支援を表示');
  assert.match(await civicCards.filter({ hasText: 'RS' }).filter({ hasText: '約449万円' }).innerText(), /LEVEL 2[\s\S]*約449万円[\s\S]*ハンズオフ：不可/,'CIVICガソリンRSの価格・Level 2・手保持条件を表示');
  assert.doesNotMatch(await civicCards.filter({ hasText: 'RS' }).filter({ hasText: '約449万円' }).innerText(), /渋滞時運転支援/, 'CIVICガソリンRSはトラフィックジャムアシストを誤表示しない');
  const nboxCards = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3').filter({ hasText: /^Honda N-BOX$/ }) });
  assert.equal(await nboxCards.count(), 34, 'Honda N-BOXは現行17タイプ×FF/4WDの34販売単位を既定一覧に表示');
  assert.match(await nboxCards.filter({ hasText: 'N-BOX〈FF〉' }).innerText(), /LEVEL 2[\s\S]*約177万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'N-BOX FFの価格・Level 2・渋滞時支援を表示');
  assert.match(await nboxCards.filter({ hasText: 'N-BOX CUSTOM〈4WD〉' }).innerText(), /約214万円[\s\S]*ハンズオフ：不可/, 'N-BOX CUSTOM 4WDの価格と手保持条件を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota クラウン スポーツ' }).filter({ hasText: 'SPORT RS（プラグインハイブリッド車）' }).innerText(), /LEVEL 2[\s\S]*約778万円[\s\S]*ハンズオフ：条件内で可[\s\S]*車線変更支援[\s\S]*渋滞時運転支援/, 'クラウン スポーツ RSの価格・条件内ハンズオフ・能力差を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota クラウン スポーツ' }).filter({ hasText: 'SPORT G（ハイブリッド車）' }).innerText(), /LEVEL 2[\s\S]*約533万円[\s\S]*ハンズオフ：不可/, 'クラウン スポーツ Gの価格・ハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota アクア' }).count(), 9, 'Toyota アクアの9販売単位を既定一覧に表示');
  const yarisCards = page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('h3').filter({ hasText: /^Toyota ヤリス$/ }) });
  assert.equal(await yarisCards.count(), 17, 'Toyota ヤリスの17販売単位を既定一覧に表示');
  assert.match(await yarisCards.filter({ hasText: 'X（ガソリン車 1.0L・CVT・2WD）' }).innerText(), /LEVEL 1[\s\S]*約170万円[\s\S]*ハンズオフ：不可/, 'ヤリス1.0LはLevel 1・価格・手保持条件を表示');
  assert.doesNotMatch(await yarisCards.filter({ hasText: 'X（ガソリン車 1.0L・CVT・2WD）' }).innerText(), /車線中央維持/, 'ヤリス1.0Lは車線中央維持を誤表示しない');
  assert.match(await yarisCards.filter({ hasText: 'Z（ハイブリッド車 1.5L・E-Four）' }).innerText(), /LEVEL 2[\s\S]*約288万円[\s\S]*渋滞時運転支援/, 'ヤリス ハイブリッドはLevel 2・価格・渋滞時支援を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3').filter({ hasText: /^Toyota カローラ$/ }).count(), 6, 'Toyota カローラの6販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota カローラ スポーツ' }).count(), 3, 'Toyota カローラ スポーツの3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota カローラ ツーリング' }).count(), 6, 'Toyota カローラ ツーリングの6販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota アクア' }).filter({ hasText: 'Z（2WD）' }).innerText(), /約286万円[\s\S]*ハンズオフ：不可/, 'アクアZの価格・手保持条件を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BYD DOLPHIN' }).count(), 2, 'BYD DOLPHINの2販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BYD ATTO 3' }).count(), 1, 'BYD ATTO 3を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3').filter({ hasText: /^BYD SEAL$/ }).count(), 2, 'BYD SEALのRWD/AWDを既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3').filter({ hasText: /^BYD SEALION 6$/ }).count(), 2, 'BYD SEALION 6のFWD/AWDを既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BYD DOLPHIN' }).filter({ hasText: 'Baseline' }).innerText(), /約299万円[\s\S]*ハンズオフ：不可[\s\S]*車線変更支援/, 'DOLPHIN Baselineの価格・手保持・車線変更支援を表示');
  assert.doesNotMatch(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BYD SEALION 6' }).filter({ hasText: 'FWD' }).innerText(), /車線変更支援/, 'SEALION 6は自動車線変更支援を表示しない');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mitsubishi アウトランダーPHEV' }).count(), 9, 'Mitsubishi OUTLANDER PHEVの9販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mitsubishi アウトランダーPHEV' }).filter({ hasText: 'M 4WD（5人乗り）' }).innerText(), /約537万円[\s\S]*ハンズオフ：不可/, 'OUTLANDER PHEV Mの価格・手保持条件を表示');
  assert.doesNotMatch(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mitsubishi アウトランダーPHEV' }).filter({ hasText: 'M 4WD（5人乗り）' }).innerText(), /車線変更支援/, 'OUTLANDER PHEVのLCA警告を自動車線変更支援と誤表示しない');
  const hyundaiVoyageLCard = page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Hyundai IONIQ 5' }).filter({ hasText: 'Voyage L' });
  assert.match(await hyundaiVoyageLCard.innerText(), /約499万円[\s\S]*ハンズオフ：不可/, 'IONIQ 5 Voyage LはHDA・ハンズオフ不可を表示');
  assert.doesNotMatch(await hyundaiVoyageLCard.innerText(), /車線変更支援/, 'IONIQ 5 Voyage LはHDAのみで車線変更支援を表示しない');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Hyundai IONIQ 5' }).filter({ hasText: 'Lounge AWD' }).innerText(), /約614万円[\s\S]*車線変更支援/, 'IONIQ 5 Lounge AWDはHDA2の車線変更支援を表示');
  await page.locator('[data-maker-shortcut="Tesla"]').click();
  assert.equal(new URL(page.url()).searchParams.get('maker'), 'Tesla', 'Teslaクイック絞り込みをURLへ保存');
  assert.equal(await visibleCards(), 6, 'Teslaクイック絞り込みは6件');
  await page.locator('[data-save-search]').click();
  assert.equal(await page.locator('[data-saved-resume]').isVisible(), true, '検索条件を保存すると共通の再開バーを表示');
  assert.match(await page.locator('[data-saved-resume]').innerText(), /検索条件:[\s\S]*Tesla/, '保存した検索のラベルを表示');
  const changedResumeId = await page.evaluate(() => {
    const key = 'jidouunten:saved-resume:v1';
    const state = JSON.parse(localStorage.getItem(key));
    state.search.snapshot.entries[0].fingerprint = '00000000';
    state.search.snapshot.entries[0].signals.price = '00000000';
    localStorage.setItem(key, JSON.stringify(state));
    return state.search.snapshot.entries[0].id;
  });
  await page.reload();
  assert.match(await page.locator('[data-saved-resume]').innerText(), /判断材料の変更 1件（価格）/, '保存時点から価格という意味のある判断材料が変わったことを表示');
  assert.equal(await page.locator('[data-saved-resume-changes]').count(), 1, '意味のある変更には確認導線を表示');
  assert.equal(await page.locator('[data-saved-resume-changed-link]').first().getAttribute('href'), `/cars/${changedResumeId}/`, '変更車両の詳細へ直接戻れる');
  await page.goto(`${base}/cars/jp-tesla-model-3-2026-premium/`);
  await page.goto(`${base}/`);
  await page.locator('[data-saved-resume-open="search"]').click();
  await page.waitForURL((url) => url.pathname === '/' && url.searchParams.get('maker') === 'Tesla');
  assert.equal(await visibleCards(), 6, '再開リンクで保存したTesla条件を復元');
  await page.locator('[data-saved-resume-delete="search"]').click();
  assert.equal(await page.locator('[data-saved-resume]').isVisible(), false, '検索条件を削除すると再開バーを隠す');
  await page.locator('[data-reset-shortcut]').click();
  assert.deepEqual(await page.locator('[data-status-shortcut]').allTextContents(), ['新車注文可48', '注文可否 未確認407', '現在利用不可1'], '販売状態の内訳を一覧の操作盤に表示');
  await page.locator('[data-status-shortcut="uncertain"]').click();
  assert.equal(new URL(page.url()).searchParams.get('availability'), 'unknown', '注文可否未確認のクイック絞り込みをURLへ保存');
  assert.equal(await visibleCards(), 407, '注文可否未確認は407販売単位');
  await page.locator('[data-reset-shortcut]').click();
  await page.locator('[data-hands-off-shortcut="conditional"]').click();
  assert.equal(await visibleCards(), 70, '条件内ハンズオフは70件');
  await page.locator('[data-reset-shortcut]').click();
  await page.locator('[data-capability-shortcut="lane_change"]').click();
  assert.equal(await visibleCards(), 68, '車線変更支援は68件');
  await page.locator('[data-reset-shortcut]').click();
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Volvo EX30' }).count(), 3, 'Volvo EX30の3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Suzuki e VITARA' }).count(), 3, 'Suzuki e VITARAの3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Suzuki e VITARA' }).locator('.maker').first().innerText(), '現行仕様　X 2WD', 'e VITARAは現行仕様として表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Renault ARKANA' }).count(), 4, 'Renault ARKANAの4販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'MINI Countryman' }).count(), 8, 'MINI Countrymanの8販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Renault ARKANA' }).locator('.maker').first().innerText(), '現行仕様　esprit Alpine FULL HYBRID E-TECH', 'ARKANAは資料年ではなく現行仕様を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota アルファード' }).count(), 4, 'アルファードは乗車定員・駆動方式別の4販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Honda VEZEL' }).count(), 2, 'VEZELはFF/4WDの2販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ヴェルファイア' }).count(), 7, 'ヴェルファイアは電動化・駆動方式別の7販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ヴォクシー' }).count(), 6, 'ヴォクシーは駆動方式・定員別の6販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota カローラ クロス' }).count(), 7, 'カローラ クロスはグレード・駆動方式別の7販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota カローラ クロス' }).filter({ hasText: 'S（2WD）' }).innerText(), /約298万円[\s\S]*ハンズオフ：不可[\s\S]*車線変更支援/, 'カローラ クロスSは価格・手保持・車線変更時の補助を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ヤリス クロス' }).count(), 20, 'ヤリス クロスは現行20販売単位を一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ヤリス クロス' }).filter({ hasText: 'X（ガソリン車・2WD）' }).innerText(), /約213万円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'ヤリス クロスXは価格・手保持・渋滞時支援を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ヴォクシー' }).filter({ hasText: 'S-G 2WD（7人乗り）' }).innerText(), /条件付き支援パッケージ[\s\S]*\+78,100円[\s\S]*装着時のみ条件内で可/, 'ヴォクシー一覧カードにオプション必要条件と追加価格を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ノア' }).count(), 8, 'ノアはS-Z/S-G/S-Xと駆動方式・定員別の8販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ノア' }).filter({ hasText: 'HYBRID S-G 2WD（7人乗り）' }).innerText(), /約370万円[\s\S]*条件付き支援パッケージ[\s\S]*\+78,100円[\s\S]*装着時のみ条件内で可/, 'ノア一覧カードにグレード別オプション価格を表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota ノア' }).filter({ hasText: 'HYBRID S-X 2WD（7人乗り）' }).innerText(), /約326万円[\s\S]*ハンズオフ：不可/, 'ノアS-XはAdvanced Driveなし・ハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota シエンタ' }).count(), 18, 'シエンタは動力・駆動方式・定員別の18販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Toyota シエンタ' }).filter({ hasText: 'Z（ハイブリッド車・2WD・7人乗り）' }).innerText(), /約318万円[\s\S]*ハンズオフ：不可/, 'シエンタ一覧カードに価格とハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Lexus LM' }).count(), 2, 'Lexus LMの4人/6人2販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Lexus UX300h' }).count(), 6, 'Lexus UX300hの6グレード・駆動方式別販売単位を既定一覧に表示');
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Lexus UX300h' }).filter({ hasText: 'Shining Essence” 2WD' }).innerText(), /約521万円[\s\S]*ハンズオフ：不可/, 'UX300h一覧カードに価格とハンズオフ不可を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BMW 3シリーズ' }).count(), 9, 'BMW 3シリーズ通常カタログの9販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BMW 3シリーズ セダン' }).locator('.maker').first().innerText(), 'G20　318i M Sport', 'BMWセダンは資料年ではなくG20世代を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BMW 3シリーズ ツーリング' }).locator('.maker').first().innerText(), 'G21　318i M Sport', 'BMWツーリングは資料年ではなくG21世代を表示');
  assert.deepEqual((await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla Model 3' }).locator('.maker').allTextContents()).sort(), [
    '現行仕様　Performance',
    '現行仕様　Premium RWD',
    '現行仕様　Premium ロングレンジAWD',
  ].sort(), 'Tesla Model 3は資料年ではなく3つの現行販売仕様を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan セレナ' }).locator('.maker').first().innerText(), 'C28　e-POWER LUXION', 'Serenaは世代呼称を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Volvo EX30' }).locator('.maker').first().innerText(), '2027年モデル　Plus P5 Electric', 'Volvoはメーカー明示モデル年を表示');
  await page.screenshot({ path: `${qaDir}/desktop-home.png`, fullPage: false });
  await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla Model 3' }).first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${qaDir}/desktop-tesla-list.png`, fullPage: false });
  assert.equal(await page.locator('.hero, .road-art, .level-card').count(), 0, 'トップはLPヒーローではなく一覧');
  assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), 'https://jidouunten.jp/og.png', 'OG画像は絶対URL');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index,follow,max-image-preview:large', '検索ロボット向け指示を設定');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://jidouunten.jp/', 'トップのcanonicalを本体URLへ固定');
  assert.equal(await page.locator('link[rel="alternate"][hreflang="ja-JP"]').getAttribute('href'), 'https://jidouunten.jp/', '日本語alternateを本体URLへ固定');
  const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
  assert.deepEqual(structuredData['@graph'].map((entry) => entry['@type']), ['WebSite', 'WebPage', 'ItemList', 'BreadcrumbList'], 'トップJSON-LDにWebSite/WebPage/ItemList/BreadcrumbListを出力');
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /日本で選べる自動運転・Level 1\/2運転支援車455販売単位/, 'トップのdescription件数は公開データから生成');
  assert.doesNotMatch(await page.locator('meta[name="description"]').getAttribute('content'), /日本向け173販売単位|日本向け157販売単位|日本向け139販売単位/, '古い固定件数を残さない');
  assert.doesNotMatch(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), /72販売単位/, 'OG画像altに古い固定件数を残さない');
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image', 'X向けlarge card');
  assert.match(await page.locator('footer').innerText(), /自動運転\.jp[\s\S]*車を探す[\s\S]*レベルの定義[\s\S]*比較する[\s\S]*プライバシー[\s\S]*1st Class/, '共通フッターに主要導線と運営元');
  assert.equal(await page.locator('[data-vehicle-shell][data-availability="closed"]:visible').count(), 0, '過去車両は既定非表示');
  assert.equal(await page.locator('[data-consent]').count(), 0, 'Analytics同意バナーを表示しない');
  assert.equal(await page.locator('script[src*="/gtm.js?id="]').count(), 1, 'サイト自身のGTM bootstrapを1回だけ通常読み込み');
  const levelMapPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await levelMapPage.goto(`${base}/`);
  await levelMapPage.locator('[data-level-shortcut="3"]').click();
  assert.equal(new URL(levelMapPage.url()).searchParams.get('level'), '3', 'レベルマップでLevel 3をURLへ保存');
  assert.equal(new URL(levelMapPage.url()).searchParams.get('availability'), 'all', '過去例は全状態を明示して表示');
  assert.equal(await levelMapPage.locator('[data-vehicle-shell]:not([hidden])').count(), 1, 'Level 3過去例を1件表示');
  assert.equal(await levelMapPage.locator('[data-level-shortcut="3"]').getAttribute('aria-pressed'), 'true', '選択レベルを通知');
  await levelMapPage.locator('[data-level-shortcut="2"]').click();
  assert.equal(new URL(levelMapPage.url()).searchParams.get('level'), '2', 'レベルマップでLevel 2へ切替');
  assert.equal(new URL(levelMapPage.url()).searchParams.has('availability'), false, '現行Level 2では既定掲載状態へ戻す');
  assert.equal(await levelMapPage.locator('[data-vehicle-shell]:not([hidden])').count(), 426, 'Level 2現行426件へ復帰');
  await levelMapPage.close();
  await page.goto(`${base}/levels/`);
  assert.match(await page.locator('.level-1').innerText(), /現行掲載 29件[\s\S]*このレベルの車両/, 'Level 1の現行掲載をレベル解説にも明記');
  const level3Link = page.locator('.level-3 a');
  assert.match(await level3Link.getAttribute('href'), /level=3&availability=all/, 'Level 3は過去例を含む一覧へ遷移');
  await level3Link.click();
  await page.waitForURL((url) => url.pathname === '/cars/' && url.searchParams.get('level') === '3' && url.searchParams.get('availability') === 'all');
  assert.equal(await visibleCards(), 1, 'Level 3導線は過去例1件へ到達');
  await page.goto(`${base}/`);
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto(`${base}/`);
  const mobileFirstCard = await mobilePage.locator('[data-vehicle-shell]:not([hidden])').first().boundingBox();
  await mobilePage.screenshot({ path: `${qaDir}/mobile-home.png`, fullPage: false });
  assert.ok(mobileFirstCard && mobileFirstCard.y <= 450, `モバイル初期カード上端が450px以内 (${mobileFirstCard?.y ?? 'none'}px)`);
  await mobilePage.close();
  for (const width of [390, 520, 768, 1280]) {
    const widthPage = width === 1280 ? page : await browser.newPage({ viewport: { width, height: 844 } });
    await widthPage.goto(`${base}/`);
    const dimensions = await widthPage.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(dimensions.scrollWidth <= dimensions.innerWidth, `${width}pxで横スクロールなし (${dimensions.scrollWidth}/${dimensions.innerWidth})`);
    if (width !== 1280) await widthPage.close();
  }

  await page.goto(`${base}/?level=2&road=${encodeURIComponent('高速道路')}&handsOff=allowed_in_conditions`);
  assert.equal(await visibleCards(), 61, 'トップのLevel 2・高速・ハンズオフ条件は61件（フォレスター5グレードとMIRAI 2グレードを含む）');
  assert.equal(await page.locator('[data-level2-notice]:visible').count(), 1, 'トップのLevel 2注意表示');
  assert.equal(new URL(page.url()).pathname, '/', 'トップの深いリンクはトップに留まる');

  await page.goto(`${base}/?capability=lane_change_support&maker=Mazda`);
  assert.equal(await visibleCards(), 2, 'メーカーと能力をAND条件で絞り込む');
  assert.equal(await page.locator('input[name="capability"][value="lane_change"]').isChecked(), true, '能力条件をURLから復元');
  await page.goto(`${base}/?capability=traffic_jam_assist&capability=hands_off_highway`);
  assert.equal(await visibleCards(), 65, '能力チェックは複数選択をAND条件で適用');
  assert.equal(await page.locator('input[name="capability"]:checked').count(), 2, '能力チェックを2つ選択');
  await page.evaluate(() => localStorage.clear());
  await page.locator('[data-save-search]').click();
  assert.equal(await page.locator('[data-saved-resume]').isVisible(), true, '複数能力の検索条件を保存できる');
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('jidouunten:saved-resume:v1')).search.href), '/?capability=traffic_jam_assist&capability=hands_off_highway', '複数能力を重複queryのまま保存');
  await page.goto(`${base}/`);
  await page.locator('[data-saved-resume-open="search"]').click();
  await page.waitForURL((url) => url.searchParams.getAll('capability').length === 2);
  assert.deepEqual(new URL(page.url()).searchParams.getAll('capability'), ['traffic_jam_assist', 'hands_off_highway'], '保存した複数能力を再開');
  assert.equal(await visibleCards(), 65, '保存したAND条件の再開結果');
  await page.locator('[data-saved-resume-delete="search"]').click();
  assert.equal(await page.locator('[data-saved-resume]').isVisible(), false, '複数能力の保存を削除');
  await page.goto(`${base}/?capability=%22`);
  assert.equal(await visibleCards(), 0, '不正な能力値でも画面を壊さず0件表示');
  await page.goto(`${base}/`);
  const guideButton = page.locator('[data-guide="traffic-hands-off"]');
  assert.equal(await guideButton.isVisible(), true, '使い方ガイドを表示');
  await guideButton.click();
  assert.equal(new URL(page.url()).searchParams.get('level'), '2', '使い方ガイドがLevel 2を設定');
  assert.equal(new URL(page.url()).searchParams.get('handsOff'), 'allowed_in_conditions', '使い方ガイドがハンズオフ条件を設定');
  assert.equal(new URL(page.url()).searchParams.get('capability'), 'traffic_jam_assist', '使い方ガイドが必要能力を設定');
  assert.equal(await visibleCards(), 56, '使い方ガイドが高速道路・渋滞・条件内ハンズオフへ絞り込む');

  await page.goto(`${base}/?sort=maker_asc`);
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').first().innerText(), /^LEVEL 2[\s\S]*Audi/, 'メーカー名順へ切替');
  assert.equal(await page.locator('[data-sort-label]').innerText(), 'メーカー名順', '現在の並び順を明示');

  await page.goto(`${base}/?sort=price_asc`);
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').first().innerText(), /Daihatsu[\s\S]*タント[\s\S]*L 2WD[\s\S]*約150万円/, '価格順は公式掲載の最小金額が安い販売単位から');
  assert.equal(await page.locator('[data-sort-label]').innerText(), '価格が安い順 · 価格要確認は末尾', '価格順の基準を明示');

  await page.goto(`${base}/?budget=under_300`);
  assert.equal(await visibleCards(), 161, '本体価格の開始値が300万円未満の候補へ絞り込む');
  assert.equal(await page.locator('select[name="budget"]').inputValue(), 'under_300', '価格帯条件をURLから復元');
  assert.match(await page.locator('[data-selected-label]').innerText(), /〜300万円/, '価格帯を結果見出しへ明示');

  await page.goto(`${base}/cars/?level=2&road=${encodeURIComponent('高速道路')}&handsOff=allowed_in_conditions`);
  assert.equal(await visibleCards(), 61, 'Level 2・高速・ハンズオフ条件は61件（フォレスター5グレードとMIRAI 2グレードを含む）');
  assert.equal(await page.locator('[data-level2-notice]:visible').count(), 1, 'Level 2注意表示');
  assert.equal(new URL(page.url()).searchParams.get('level'), '2', '深いリンクのlevel復元');
  assert.equal(await page.locator('#vehicle-filters').getAttribute('action'), '/cars/', '旧一覧は現在のルートで送信');
  await page.waitForTimeout(1000);
  assert.ok(analyticsRequests.some((url) => url.includes('googletagmanager')), 'GTM通信');
  if (process.env.EXPECT_GA_COLLECT === '1') {
    const deadline = Date.now() + 5000;
    while (!analyticsResponses.some(({ url }) => /collect|google-analytics/i.test(url)) && Date.now() < deadline) {
      await page.waitForTimeout(250);
    }
    const collectResponses = analyticsResponses.filter(({ url }) => /collect|google-analytics/i.test(url));
    assert.ok(collectResponses.length > 0, 'GA collect通信');
    assert.ok(collectResponses.some(({ url }) => decodeURIComponent(url).includes('G-Q58GM7BVB6')), 'GA collectが正しいMeasurement ID宛て');
    console.log(`GA collect responses: ${collectResponses.map(({ status, url }) => `${status} ${url.split('?')[0]}`).join(' | ')}`);
  }

  await page.goto(`${base}/`);
  await page.locator('select[name="level"]').selectOption('3');
  await page.locator('select[name="availability"]').selectOption('all');
  await page.getByRole('button', { name: 'この条件で探す' }).click({ noWaitAfter: true });
  await page.waitForTimeout(100);
  assert.equal(new URL(page.url()).pathname, '/', 'トップのフォーム操作はトップに留まる');
  assert.equal(new URL(page.url()).searchParams.get('level'), '3', 'フォーム操作でURL更新');
  assert.equal(await page.locator('[data-result-count]').innerText(), '1件', '絞り込み後件数');
  assert.equal((await events()).filter((event) => event.event === 'filter_results').length, 1, 'filter_resultsはフォーム操作時のみ1回');
  assert.equal((await events()).filter((event) => event.event === 'select_level').length, 1, 'select_levelは一覧レベル操作時に1回');
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, '/', '戻るでトップ一覧を復元');
  assert.equal(await visibleCards(), 455, '戻る後の結果件数');

  await page.goto(`${base}/?level=3`);
  assert.equal(await visibleCards(), 0, '空結果を表示');
  assert.match(await page.locator('[data-empty]').innerText(), /掲載データに一致する候補がない/, '0件時に市場不存在と断定しない');
  assert.equal(await page.locator('[data-empty-relax]').count(), 1, '0件時に候補が出る緩和だけを提示');
  assert.match(await page.locator('[data-empty-relax]').first().innerText(), /Level 3の条件を外す[\s\S]*455件/, 'Level条件を外した実データ件数を提示');
  assert.ok((await events()).some((event) => event.event === 'filter_empty_results'), '0件到達イベントをdataLayerへ送る');
  assert.ok((await events()).some((event) => event.event === 'filter_relaxation_shown'), '緩和候補表示イベントをdataLayerへ送る');
  await page.locator('[data-empty-relax]').first().click();
  assert.equal(new URL(page.url()).searchParams.has('level'), false, '緩和ボタンでLevel条件をURLから外す');
  assert.equal(await visibleCards(), 455, '緩和ボタンで候補455件を表示');
  assert.ok((await events()).some((event) => event.event === 'filter_relaxation_apply' && event.relaxation_filter === 'level'), '緩和適用イベントをdataLayerへ送る');
  await page.goto(`${base}/?level=3`);
  await page.getByRole('link', { name: '条件をリセット' }).click();
  assert.equal(new URL(page.url()).pathname, '/', 'リセットでトップ一覧へ戻る');
  await page.waitForFunction(() => document.querySelectorAll('[data-vehicle-shell]:not([hidden])').length === 455);
  assert.equal(await visibleCards(), 455, 'リセット後に既定455件');

  await page.locator('input[name="ids"]').nth(0).check();
  await page.locator('input[name="ids"]').nth(1).check();
  assert.equal(await page.locator('[data-compare-count]').innerText(), '2台選択中（最大2台）', '比較選択数を表示');
  assert.equal(await page.locator('input[name="ids"]').nth(2).isDisabled(), true, '3台目は最大2台制限で選択不可');
  assert.match(await page.locator('[data-compare-link]').getAttribute('href'), /ids=.+&ids=.+/, '比較リンクに2台のID');
  await page.locator('select[name="level"]').selectOption('3');
  await page.locator('select[name="availability"]').selectOption('all');
  await page.getByRole('button', { name: 'この条件で探す' }).click({ noWaitAfter: true });
  assert.equal(await page.locator('[data-compare-count]').innerText(), '0台選択中（最大2台）', '非表示になった比較選択を自動解除');
  await page.getByRole('link', { name: 'リセット' }).click();
  await page.locator('input[name="ids"]').nth(0).check();
  await page.locator('input[name="ids"]').nth(1).check();
  await page.locator('[data-compare-link]').click();
  await page.waitForURL((url) => url.pathname === '/compare/' && url.searchParams.getAll('ids').length === 2);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.equal(new URL(page.url()).pathname, '/compare/', '一覧から比較へ遷移');
  assert.equal(await page.locator('input[name="ids"]:checked').count(), 2, '一覧選択が比較画面へ反映');
  await page.locator('[data-save-compare]').click();
  assert.match(await page.locator('[data-save-compare-note]').innerText(), /比較を保存しました/, '比較を保存したことを通知');
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('jidouunten:saved-resume:v1')).compare.snapshot.entries.length), 2, '比較保存に2台分の判断材料snapshotを保持');
  assert.equal(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('jidouunten:saved-resume:v1')).compare.snapshot.entries[0].signals).length), 6, '比較保存に6カテゴリの判断材料signalsを保持');
  await page.goto(`${base}/`);
  assert.equal(await page.locator('[data-saved-resume]').isVisible(), true, '比較保存も共通の再開バーに表示');
  assert.match(await page.locator('[data-saved-resume]').innerText(), /比較:/, '保存した比較の種別を表示');
  await page.locator('[data-saved-resume-open="compare"]').click();
  await page.waitForURL((url) => url.pathname === '/compare/' && url.searchParams.getAll('ids').length === 2);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  await page.locator('[data-saved-resume-delete="compare"]').click();
  assert.equal(await page.locator('[data-saved-resume]').isVisible(), false, '比較保存を削除すると再開バーを隠す');

  await page.goto(`${base}/cars/?availability=all`);
  assert.equal(await visibleCards(), 456, 'すべての状態で過去車両を含む456件');
  assert.equal(await page.locator('[data-selected-label]').innerText(), 'すべての状態', '全状態選択時の結果見出しを正しく表示');
  await page.goto(`${base}/cars/?availability=unavailable`);
  assert.equal(await visibleCards(), 1, '現在利用不可は過去車両1件');
  assert.equal(await page.locator('[data-selected-label]').innerText(), '現在利用不可', '販売状態選択時の結果見出しを正しく表示');
  await page.goto(`${base}/cars/?availability=new_order_available`);
  assert.equal(await visibleCards(), 48, '新車注文可は販売単位の公式購入予約・注文導線を確認できた48件');
  assert.equal(await page.locator('[data-selected-label]').innerText(), '新車注文可', '新車注文可の結果見出しを正しく表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla' }).count(), 6, '新車注文可フィルタはTesla 6件に絞り込む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Mitsubishi アウトランダーPHEV' }).count(), 9, '新車注文可フィルタはMitsubishi 9件を含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan 日産アリア' }).count(), 1, '新車注文可フィルタは日産アリアB6 1件を含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Volvo EX30' }).count(), 3, '新車注文可フィルタはVolvo EX30 3グレードを含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('.maker').filter({ hasText: /　Voyage$/ }) }).count(), 1, '新車注文可フィルタはIONIQ 5 Voyageを含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ has: page.locator('.maker').filter({ hasText: /　Lounge$/ }) }).count(), 1, '新車注文可フィルタはIONIQ 5 Loungeを含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3 a').filter({ hasText: /^Mitsubishi eKクロス$/ }).count(), 8, '新車注文可フィルタはeKクロス8単位を含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3 a').filter({ hasText: /^Mitsubishi eKクロス EV$/ }).count(), 3, '新車注文可フィルタはeKクロス EV 3単位を含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3 a').filter({ hasText: /^Mitsubishi デリカミニ$/ }).count(), 12, '新車注文可フィルタはデリカミニ12単位を含む');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) h3 a').filter({ hasText: /^Mitsubishi eKスペース$/ }).count(), 4, '新車注文可フィルタはeKスペース4単位を含む');
  await page.goto(`${base}/compare/?ids=jp-honda-accord-2025-ehev-sensing360plus&ids=jp-subaru-levorg-layback-2023-limited-ex`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('[data-compare-select]').isVisible(), false, '比較URLは選択フォームを畳み結果を先に見せる');
  assert.equal(await page.locator('[data-compare-change]').isVisible(), true, '比較フォームを開く変更導線を表示');
  const directCompareResult = await page.locator('[data-compare-result]').boundingBox();
  assert.ok(directCompareResult && directCompareResult.y < 1800, `比較結果が早く表示される (${directCompareResult?.y ?? 'none'}px)`);
  await page.locator('[data-compare-change]').click();
  assert.equal(await page.locator('[data-compare-select]').isVisible(), true, '比較変更ボタンで選択フォームを再表示');
  assert.equal(await page.locator('input[name="ids"]:checked').count(), 2, '比較対象は2台');
  const compareText = await page.locator('[data-compare-result]').innerText();
  assert.match(compareText, /e:HEV Honda SENSING 360＋/);
  assert.match(compareText, /Limited EX/);
  assert.equal((await events()).filter((event) => event.event === 'compare_vehicles').length, 1, 'compare_vehiclesイベント');

  await page.goto(`${base}/cars/jp-honda-accord-2025-ehev-sensing360plus/`);
  const detailGraph = structuredGraph(await page.content());
  assert.deepEqual(detailGraph.map((entry) => entry['@type']), ['WebSite', 'WebPage', 'Product', 'Car', 'BreadcrumbList'], '詳細JSON-LDに既存ProductとCar/BreadcrumbList');
  const detailCar = detailGraph.find((entry) => entry['@type'] === 'Car');
  assert.deepEqual({ model: detailCar.model, modelDate: detailCar.modelDate, vehicleConfiguration: detailCar.vehicleConfiguration, brand: detailCar.brand.name }, { model: 'ACCORD', modelDate: '2025', vehicleConfiguration: 'e:HEV Honda SENSING 360＋', brand: 'Honda' }, '詳細Carは正本のモデル・年・グレード・ブランド');
  assert.equal('aggregateRating' in detailCar, false, '詳細CarにaggregateRatingを付与しない');
  assert.equal('automationLevel' in detailCar, false, '詳細CarにautomationLevelを評価値として付与しない');
  assert.equal(detailGraph.filter((entry) => entry['@type'] === 'BreadcrumbList').length, 1, '詳細BreadcrumbListは重複しない');
  assert.equal((await events()).filter((event) => event.event === 'view_vehicle').length, 1, 'view_vehicleイベント');
  const detailOfficial = page.getByRole('link', { name: /公式サイトを開く/ });
  assert.equal(await detailOfficial.getAttribute('href'), 'https://www.honda.co.jp/ACCORD/', '詳細の販売単位に対応する公式リンク');
  await detailOfficial.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true, capture: true }));
  await detailOfficial.click();
  const detailOutbound = (await events()).filter((event) => event.event === 'outbound_manufacturer').at(-1);
  assert.deepEqual({ vehicle_id: detailOutbound.vehicle_id, manufacturer: detailOutbound.manufacturer, link_type: detailOutbound.link_type, placement: detailOutbound.placement }, { vehicle_id: 'jp-honda-accord-2025-ehev-sensing360plus', manufacturer: 'Honda', link_type: 'product', placement: 'vehicle_detail' }, '詳細の公式遷移イベント');
  assert.equal(await page.locator('[data-purchase-action]').count(), 4, 'Honda ACCORD詳細に見積り・試乗・販売店・カタログ導線');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => ({ kind: link.dataset.actionType, href: link.getAttribute('href') }))), [
    { kind: 'test_drive', href: 'https://www.honda.co.jp/democar/accord/?from=car_action_link' },
    { kind: 'dealer', href: 'https://www.honda.co.jp/dealerlocator/auto/accord/?from=car_action_link' },
    { kind: 'estimate', href: 'https://www.honda.co.jp/CYBERMALL/accord/estimate/?from=car_action_link' },
    { kind: 'catalog', href: 'https://www.honda.co.jp/ACCORD/catalog/?from=car_action_link' },
  ], 'Honda ACCORDの公式アクションURLを保持');

  await page.goto(`${base}/cars/jp-honda-stepwgn-2026-air-ff/`);
  assert.match(await page.title(), /^Honda ステップ ワゴン AIR〈FF〉｜Level 2・価格・機能｜自動運転\.jp$/, 'ステップ ワゴン販売単位を含む詳細title');
  assert.match(await page.locator('main').innerText(), /Honda[\s\S]*ステップ ワゴン[\s\S]*AIR〈FF〉[\s\S]*Level 2[\s\S]*3,348,400円[\s\S]*ハンズオフ：不可[\s\S]*渋滞時運転支援/, 'ステップ ワゴン詳細に価格・Level 2・能力差');
  assert.equal(await page.locator('[data-purchase-action]').count(), 4, 'ステップ ワゴン詳細に4種の公式次アクション');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => link.dataset.actionType)), ['test_drive', 'dealer', 'estimate', 'catalog'], 'ステップ ワゴンの公式アクション種別');
  await page.goto(`${base}/compare/?ids=jp-honda-stepwgn-2026-air-ff&ids=jp-honda-stepwgn-2026-ehev-spada-premium-line-ff`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /ステップ ワゴン[\s\S]*AIR〈FF〉[\s\S]*e:HEV SPADA PREMIUM LINE〈FF〉[\s\S]*3,348,400円[\s\S]*4,268,000円/, 'ステップ ワゴン比較に価格差を表示');

  await page.goto(`${base}/cars/jp-audi-a5-2026-tfsi-110kw/`);
  assert.match(await page.title(), /^Audi A5 TFSI 110kW｜Level 2・価格・機能｜自動運転\.jp$/, '販売単位を含む詳細title');
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /Audi A5 TFSI 110kWのLevel 2運転支援.*6,170,000円.*追従走行/, '詳細descriptionにグレード・価格・能力差');
  const audiStructuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
  assert.deepEqual(audiStructuredData['@graph'].map((entry) => entry['@type']), ['WebSite', 'WebPage', 'Product', 'Car', 'BreadcrumbList'], '詳細JSON-LDにProductとCar/BreadcrumbList');
  assert.equal(audiStructuredData['@graph'].find((entry) => entry['@type'] === 'Product').offers.price, 6170000, 'Product JSON-LDへ公式価格を反映');
  const audiDetailText = await page.locator('main').innerText();
  assert.match(audiDetailText, /Audi[\s\S]*A5[\s\S]*TFSI 110kW/, 'Audi詳細に販売単位名');
  assert.match(audiDetailText, /6,170,000円/, 'Audi詳細に公式価格');
  assert.match(audiDetailText, /Level 2/ , 'Audi詳細にLevel 2');
  assert.match(audiDetailText, /ハンズオフ：不可[\s\S]*車線変更支援/, 'Audi詳細にハンズオフと車線変更支援');
  await page.goto(`${base}/cars/jp-toyota-corolla-sport-2026-g-z-2wd/`);
  assert.match(await page.title(), /^Toyota カローラ スポーツ G“Z” 2WD｜Level 2・価格・機能｜自動運転\.jp$/, 'カローラ スポーツ販売単位を含む詳細title');
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /カローラ スポーツ G“Z” 2WDのLevel 2運転支援.*3,220,200円.*追従走行/, 'カローラ スポーツ詳細descriptionにグレード・価格・能力差');
  const corollaSportDetailText = await page.locator('main').innerText();
  assert.match(corollaSportDetailText, /Toyota[\s\S]*カローラ スポーツ[\s\S]*G“Z” 2WD/, 'カローラ スポーツ詳細に販売単位名');
  assert.match(corollaSportDetailText, /3,220,200円[\s\S]*ハンズオフ：不可/, 'カローラ スポーツ詳細に価格・手保持条件');
  assert.equal(await page.locator('[data-purchase-action]').count(), 1, 'カローラ スポーツ詳細に公式見積り導線');
  await page.goto(`${base}/cars/jp-toyota-corolla-touring-2026-w-b-2wd/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*カローラ ツーリング[\s\S]*W×B 2WD[\s\S]*3,179,000円[\s\S]*ハンズオフ：不可/, 'カローラ ツーリング詳細に販売単位・価格・手保持条件');
  await page.goto(`${base}/compare/?ids=jp-toyota-corolla-sport-2026-g-z-2wd&ids=jp-toyota-corolla-touring-2026-w-b-2wd`);
  assert.match(await page.locator('[data-compare-result]').innerText(), /カローラ スポーツ[\s\S]*カローラ ツーリング[\s\S]*3,220,200円[\s\S]*3,179,000円/, 'カローラ2車種比較へ価格を表示');

  await page.goto(`${base}/cars/jp-tesla-model-3-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /Tesla[\s\S]*Model 3/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*5,313,000円〜/, 'Tesla詳細に公式掲載価格');
  assert.doesNotMatch(await page.locator('main').innerText(), /adaptive_cruise_control|lane_centering|hands_off_highway|lane_change_support/, '内部capability IDを公開しない');
  assert.match(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, '機能IDを平易な日本語で説明');
  assert.match(await page.locator('main').innerText(), /新車注文可[\s\S]*注文後の納車時期・在庫・ソフトウェア提供条件は個別確認が必要/, 'Tesla公式の注文導線と個別確認事項を表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 2, 'Tesla詳細に注文・試乗の公式次アクションを表示');
  assert.deepEqual(await page.locator('[data-purchase-action]').allTextContents(), ['今すぐ注文 ↗', '試乗を予約する ↗'], '次アクションの日本語ラベル');
  const detailPurchase = page.locator('[data-purchase-action]').first();
  await detailPurchase.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true, capture: true }));
  await detailPurchase.click();
  const detailPurchaseEvent = (await events()).filter((event) => event.event === 'outbound_purchase_action').at(-1);
  assert.deepEqual({ vehicle_id: detailPurchaseEvent.vehicle_id, action_type: detailPurchaseEvent.action_type, placement: detailPurchaseEvent.placement }, { vehicle_id: 'jp-tesla-model-3-2026-premium', action_type: 'order', placement: 'vehicle_detail' }, '詳細の購入アクション計測');
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, '根拠URL・確認日は通常UIに出さない');
  await page.screenshot({ path: `${qaDir}/desktop-tesla-detail.png`, fullPage: false });

  await page.goto(`${base}/cars/jp-peugeot-e3008-2026-gt/`);
  assert.match(await page.title(), /^Peugeot E-3008 GT｜Level 2・価格・機能｜自動運転\.jp$/, 'Peugeot E-3008販売単位を含む詳細title');
  const peugeotDetailText = await page.locator('main').innerText();
  assert.match(peugeotDetailText, /Peugeot[\s\S]*E-3008[\s\S]*GT[\s\S]*Level 2[\s\S]*7,600,000円〜[\s\S]*ハンズオフ：不可/, 'Peugeot E-3008詳細に価格・Level 2・手保持条件');
  assert.match(peugeotDetailText, /追従走行（ACC）[\s\S]*車線中央維持/, 'Peugeot E-3008詳細に平易な能力名');
  assert.equal(await page.locator('[data-purchase-action]').count(), 1, 'Peugeot E-3008詳細に公式見積り導線');
  assert.equal(await page.locator('[data-purchase-action]').first().getAttribute('href'), 'https://www.peugeot.co.jp/links/configurator.html', 'Peugeot見積り導線を公式コンフィギュレーターへ固定');
  await page.goto(`${base}/compare/?ids=jp-peugeot-e3008-2026-gt&ids=jp-tesla-model-3-2026-premium`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /Peugeot[\s\S]*E-3008[\s\S]*GT[\s\S]*LEVEL 2[\s\S]*7,600,000円〜/, 'Peugeot E-3008比較に価格・Levelを表示');

  await page.goto(`${base}/cars/jp-jeep-commander-2026-limited-4wd/`);
  assert.match(await page.title(), /^Jeep Commander Limited（4WD・7人乗り）｜Level 2・価格・機能｜自動運転\.jp$/, 'Jeep Commander販売単位を含む詳細title');
  const commanderDetailText = await page.locator('main').innerText();
  assert.match(commanderDetailText, /Jeep[\s\S]*Commander[\s\S]*Limited（4WD・7人乗り）[\s\S]*Level 2[\s\S]*6,190,000円〜[\s\S]*ハンズオフ：不可/, 'Jeep Commander詳細に価格・Level 2・手保持条件');
  assert.match(commanderDetailText, /追従走行（ACC）[\s\S]*車線中央維持/, 'Jeep Commander詳細に平易な能力名');
  assert.equal(await page.locator('[data-purchase-action]').count(), 3, 'Jeep Commander詳細に見積り・試乗・販売店導線');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="estimate"]').getAttribute('href'), 'https://krs.bz/pcj/m/jeep-estimate', 'Jeep Commander見積り導線を公式入口へ固定');
  await page.goto(`${base}/cars/jp-land-rover-discovery-sport-2026-dynamic-s/`);
  assert.match(await page.title(), /^Land Rover Discovery Sport Dynamic S｜Level 2・価格・機能｜自動運転\.jp$/, 'Discovery Sport販売単位を含む詳細title');
  const discoveryDetailText = await page.locator('main').innerText();
  assert.match(discoveryDetailText, /Land Rover[\s\S]*Discovery Sport[\s\S]*Dynamic S[\s\S]*Level 2[\s\S]*7,240,000円〜[\s\S]*ハンズオフ：不可/, 'Discovery Sport詳細に価格・Level 2・手保持条件');
  assert.match(discoveryDetailText, /追従走行（ACC）[\s\S]*車線中央維持/, 'Discovery Sport詳細に平易な能力名');
  assert.equal(await page.locator('[data-purchase-action]').count(), 3, 'Discovery Sport詳細に見積り・試乗・リテイラー導線');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="estimate"]').getAttribute('href'), 'https://www.landrover.co.jp/build-your-own/index.html', 'Discovery Sport見積り導線を公式コンフィギュレーターへ固定');
  await page.goto(`${base}/compare/?ids=jp-land-rover-discovery-sport-2026-dynamic-s&ids=jp-land-rover-discovery-sport-2026-landmark`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /Discovery Sport[\s\S]*Dynamic S[\s\S]*Landmark[\s\S]*7,240,000円〜[\s\S]*8,230,000円〜[\s\S]*Level 2/, 'Discovery Sport比較にグレード別価格・Levelを表示');
  await page.goto(`${base}/cars/jp-suzuki-fronx-2024-2wd/`);
  assert.match(await page.title(), /^Suzuki FRONX 2WD・6AT｜Level 2・価格・機能｜自動運転\.jp$/, 'Suzuki FRONX販売単位を含む詳細title');
  const fronxDetailText = await page.locator('main').innerText();
  assert.match(fronxDetailText, /Suzuki[\s\S]*FRONX[\s\S]*2WD・6AT[\s\S]*Level 2[\s\S]*2,541,000円[\s\S]*ハンズオフ：不可/, 'Suzuki FRONX詳細に価格・Level 2・手保持条件');
  assert.match(fronxDetailText, /監視条件は不明[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, 'Suzuki FRONX詳細に能力と監視条件の不明表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 1, 'Suzuki FRONX詳細に見積り導線');
  assert.equal(await page.locator('[data-purchase-action]').first().getAttribute('href'), 'https://www.suzuki.co.jp/car/fronx/detail/', 'Suzuki FRONX見積り導線を公式入口へ固定');
  await page.goto(`${base}/compare/?ids=jp-suzuki-fronx-2024-2wd&ids=jp-suzuki-fronx-2024-4wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /LEVEL 2[\s\S]*Suzuki[\s\S]*FRONX[\s\S]*2,541,000円[\s\S]*2,739,000円/, 'Suzuki FRONX 2WD/4WD比較に価格・Levelを表示');

  await page.goto(`${base}/cars/jp-byd-dolphin-baseline/`);
  assert.equal(await page.locator('[data-purchase-action]').count(), 3, 'BYD DOLPHIN詳細に試乗・販売店・カタログ導線');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), [
    'https://prod.byd.com/jp/lineup/dolphin',
    'https://dealer.bydauto.co.jp/hp/search/car/index.xhtml',
    'https://prod.byd.com/material/byd-site/jp/lineup/dolphin/catalog/BYD_DOLPHIN_catalog_260402.pdf',
  ], 'BYD DOLPHINの現行公式導線URLを保持');

  await page.goto(`${base}/cars/jp-nissan-ariya-2026-b6/`);
  assert.match(await page.locator('main').innerText(), /Nissan[\s\S]*日産アリア[\s\S]*B6/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*6,675,900円[\s\S]*新車注文可/, '日産アリアB6の価格と注文受付状態を表示');
  assert.match(await page.locator('main').innerText(), /日産各店の注文受付を確認済み[\s\S]*在庫・納期・契約条件/, '日産アリアB6の注文後確認事項を表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 4, '日産アリアB6に既存4種の公式次アクションを表示');
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, '日産アリアB6でも内部根拠を通常UIに出さない');

  await page.goto(`${base}/cars/jp-nissan-kicks-2026-x-simple-2wd/`);
  assert.match(await page.title(), /^Nissan キックス X シンプルパッケージ｜Level 2・価格・機能｜自動運転\.jp$/, 'キックス販売単位を含む詳細title');
  assert.match(await page.locator('main').innerText(), /Nissan[\s\S]*キックス[\s\S]*X シンプルパッケージ[\s\S]*Level 2[\s\S]*2,999,700円[\s\S]*ハンズオフ：不可[\s\S]*車線中央維持/, 'キックス詳細に価格・Level 2・ハンズオン条件');
  assert.equal(await page.locator('[data-purchase-action]').count(), 4, 'キックス詳細に4種の公式次アクション');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => link.dataset.actionType)), ['test_drive', 'dealer', 'estimate', 'catalog'], 'キックスの公式アクション種別');
  await page.goto(`${base}/compare/?ids=jp-nissan-kicks-2026-x-simple-2wd&ids=jp-nissan-kicks-2026-g-e4orce-4wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /キックス[\s\S]*X シンプルパッケージ[\s\S]*G e-4ORCE[\s\S]*2,999,700円[\s\S]*4,248,200円/, 'キックス比較に2WD/e-4ORCEの価格差を表示');

  await page.goto(`${base}/cars/jp-mitsubishi-outlander-phev-2026-m-4wd-5seater/`);
  assert.match(await page.locator('main').innerText(), /Mitsubishi[\s\S]*アウトランダーPHEV[\s\S]*M 4WD（5人乗り）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*5,369,100円[\s\S]*ハンズオフ[\s\S]*不可/, 'OUTLANDER PHEV Mの公式価格と手保持条件を表示');
  assert.match(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, 'OUTLANDER PHEVのMI-PILOT能力を平易に表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /確認できた機能[\s\S]*車線変更支援/, 'OUTLANDER PHEVのLCA警告を自動車線変更支援と誤表示しない');
  assert.match(await page.locator('main').innerText(), /新車注文可[\s\S]*販売店別の在庫・納期は未確認/, 'OUTLANDER PHEVの購入予約と個別確認事項を表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 5, 'OUTLANDER PHEV詳細に5種の公式次アクションを表示');
  assert.deepEqual(await page.locator('[data-purchase-action]').allTextContents(), ['購入予約（グレードを選択） ↗', '展示車・試乗車を検索（車種選択） ↗', 'オンライン見積り ↗', '販売店を探す ↗', 'カタログを見る ↗'], 'OUTLANDER PHEVの公式アクションラベル');
  assert.equal(await page.locator('[data-purchase-action]').first().getAttribute('href'), 'https://try.mitsubishi-motors.co.jp/olm/EGP0002.do?model=274&skp=1', 'OUTLANDER PHEVの購入予約は9グレードを選べる公式入口');

  await page.goto(`${base}/cars/jp-mitsubishi-ek-cross-2026-g-premium-2wd/`);
  assert.match(await page.title(), /^Mitsubishi eKクロス G Premium 2WD｜Level 2・価格・機能｜自動運転\.jp$/, 'eKクロス販売単位を含む詳細title');
  assert.match(await page.locator('main').innerText(), /Mitsubishi[\s\S]*eKクロス[\s\S]*G Premium 2WD[\s\S]*Level 2[\s\S]*1,999,800円[\s\S]*ハンズオフ：不可[\s\S]*車線中央維持/, 'eKクロス MI-PILOT標準グレードの価格・Level 2・能力差を表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 5, 'eKクロス詳細に購入予約を含む5種の公式次アクション');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => ({ kind: link.dataset.actionType, href: link.getAttribute('href') }))), [
    { kind: 'order', href: 'https://mirsvr.mitsubishi-motors.co.jp/eq2/EQ2G00.do?model=259&sourceId=EQ2' },
    { kind: 'test_drive', href: 'https://mirsvr.mitsubishi-motors.co.jp/eq2/EQ2G00.do?sourceId=EQ2&model=259' },
    { kind: 'estimate', href: 'https://try.mitsubishi-motors.co.jp/olm/EGP0002.do?name=ek_x' },
    { kind: 'dealer', href: 'https://map.mitsubishi-motors.co.jp/search/listHansha.do' },
    { kind: 'catalog', href: 'https://www.mitsubishi-motors.co.jp/lineup/ek_x/pdf_view.html' },
  ], 'eKクロスの公式アクションURLを保持');
  await page.goto(`${base}/cars/jp-mitsubishi-ek-cross-2026-g-2wd/`);
  assert.match(await page.locator('main').innerText(), /eKクロス[\s\S]*G 2WD[\s\S]*Level 1[\s\S]*1,856,800円[\s\S]*車線逸脱抑制/, 'eKクロス標準GはLevel 1・価格・車線逸脱抑制のみを表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, 'eKクロス標準GはMI-PILOT非搭載として表示');
  await page.goto(`${base}/cars/jp-mitsubishi-ek-cross-ev-2026-p-2wd-advanced-safety-comfort/`);
  assert.match(await page.locator('main').innerText(), /eKクロス EV[\s\S]*P 2WD（先進安全快適パッケージ）[\s\S]*Level 2[\s\S]*3,214,200円[\s\S]*追加パッケージ[\s\S]*110,000円[\s\S]*参考総額[\s\S]*3,324,200円/, 'eKクロス EVはパッケージ込みの参考総額を表示');
  await page.goto(`${base}/compare/?ids=jp-mitsubishi-ek-cross-2026-g-2wd&ids=jp-mitsubishi-ek-cross-2026-g-premium-2wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /eKクロス[\s\S]*G 2WD[\s\S]*G Premium 2WD[\s\S]*1,856,800円[\s\S]*1,999,800円[\s\S]*Level 1[\s\S]*Level 2[\s\S]*車線中央維持/, 'eKクロス比較にグレード別価格・能力差を表示');

  await page.goto(`${base}/cars/jp-mitsubishi-delica-mini-2025-g-2wd/`);
  assert.match(await page.title(), /^Mitsubishi デリカミニ G 2WD｜Level 1・価格・機能｜自動運転\.jp$/, 'デリカミニLevel 1販売単位を含む詳細title');
  assert.match(await page.locator('main').innerText(), /Mitsubishi[\s\S]*デリカミニ[\s\S]*G 2WD[\s\S]*Level 1[\s\S]*1,964,600円[\s\S]*車線逸脱抑制/, 'デリカミニGはLevel 1・価格・LDPを表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, 'デリカミニGはMI-PILOT非搭載として表示');
  await page.goto(`${base}/cars/jp-mitsubishi-delica-mini-2025-t-premium-2wd/`);
  assert.match(await page.title(), /^Mitsubishi デリカミニ T Premium 2WD｜Level 2・価格・機能｜自動運転\.jp$/, 'デリカミニLevel 2販売単位を含む詳細title');
  assert.match(await page.locator('main').innerText(), /デリカミニ[\s\S]*T Premium 2WD[\s\S]*Level 2[\s\S]*2,219,800円[\s\S]*車線中央維持/, 'デリカミニPremiumはMI-PILOT・価格・Level 2を表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 5, 'デリカミニ詳細に購入予約を含む5種の公式次アクション');
  await page.goto(`${base}/cars/jp-mitsubishi-ek-space-2025-m-2wd/`);
  assert.match(await page.title(), /^Mitsubishi eKスペース M 2WD｜Level 1・価格・機能｜自動運転\.jp$/, 'eKスペース販売単位を含む詳細title');
  assert.match(await page.locator('main').innerText(), /Mitsubishi[\s\S]*eKスペース[\s\S]*M 2WD[\s\S]*Level 1[\s\S]*1,749,000円[\s\S]*車線逸脱抑制/, 'eKスペースMはLevel 1・価格・LDPを表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, 'eKスペース現行主要装備にMI-PILOTを誤表示しない');
  await page.goto(`${base}/compare/?ids=jp-mitsubishi-delica-mini-2025-g-2wd&ids=jp-mitsubishi-delica-mini-2025-t-premium-2wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /デリカミニ[\s\S]*G 2WD[\s\S]*T Premium 2WD[\s\S]*1,964,600円[\s\S]*2,219,800円[\s\S]*Level 1[\s\S]*Level 2/, 'デリカミニ比較にグレード別価格・能力差を表示');

  await page.goto(`${base}/cars/jp-hyundai-ioniq5-2025-voyage-l/`);
  assert.match(await page.locator('main').innerText(), /Hyundai[\s\S]*IONIQ 5[\s\S]*Voyage L/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,994,000円[\s\S]*ハンズオフ[\s\S]*不可/, 'IONIQ 5 Voyage Lの公式価格と手保持条件を表示');
  assert.match(await page.locator('main').innerText(), /HDA[\s\S]*車線中央維持/, 'IONIQ 5 Voyage LのHDA機能を平易に表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /HDA2|車線変更支援/, 'IONIQ 5 Voyage LにHDA2・車線変更支援を誤表示しない');
  assert.equal(await page.locator('[data-purchase-action]').count(), 3, 'IONIQ 5詳細に試乗・見積り・カタログ導線');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => ({ kind: link.dataset.actionType, href: link.getAttribute('href') }))), [
    { kind: 'test_drive', href: 'https://www.hyundai.com/jp/purchase/test-drive' },
    { kind: 'estimate', href: 'https://www.hyundai.com/jp/purchase/estimation/ioniq5/result?code=BFB&environment=indoor' },
    { kind: 'catalog', href: 'https://www.hyundai.com/jp/purchase/downFile/ioniq5' },
  ], 'IONIQ 5の公式アクションURLを保持');

  await page.goto(`${base}/compare/?ids=jp-hyundai-ioniq5-2025-voyage-l&ids=jp-hyundai-ioniq5-2025-lounge-awd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const hyundaiCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(hyundaiCompare, /IONIQ 5[\s\S]*Voyage L[\s\S]*Lounge AWD/);
  assert.match(hyundaiCompare, /4,994,000円[\s\S]*6,138,000円[\s\S]*車線変更支援/, 'IONIQ 5比較にグレード別価格とHDA/HDA2能力差');
  assert.equal(await page.locator('[data-compare-result] [data-action-type="estimate"]').count(), 2, 'IONIQ 5比較に両車の公式見積り導線');
  assert.doesNotMatch(hyundaiCompare, /sources|accessedAt|allowed_in_conditions|not_allowed/, 'IONIQ 5比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ノア[\s\S]*HYBRID S-Z 2WD/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,056,800円[\s\S]*参考総額[\s\S]*4,178,900円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'ノアの参考総額と条件付きハンズオフを表示');
  assert.match(await page.locator('main').innerText(), /追加パッケージ[\s\S]*122,100円[\s\S]*必要パッケージ[\s\S]*Toyota Teammate アドバンスト ドライブ[\s\S]*T-Connect[\s\S]*コネクティッドナビ契約/, 'ノアS-Zの追加価格・契約条件と必要パッケージを表示');
  assert.match(await page.locator('main').innerText(), /Advanced Drive[\s\S]*0〜約40km\/h[\s\S]*LCA[\s\S]*約85〜130km\/h/, 'ノアS-ZはAdvanced DriveとLCAの速度域を分けて表示');
  assert.match(await page.locator('main').innerText(), /公式の検討・購入導線[\s\S]*検討用[\s\S]*公式で見積り/, '注文可否未確認でもToyotaの公式見積り導線を表示');
  const noahEstimate = page.locator('[data-purchase-action][data-action-type="estimate"]');
  assert.equal(await noahEstimate.getAttribute('href'), 'https://toyota.jp/service/estimate/grades?car_name_en=NOAH', 'ノアのモデル別見積りURL');
  await noahEstimate.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true, capture: true }));
  await noahEstimate.click();
  const noahEstimateEvent = (await events()).filter((event) => event.event === 'outbound_purchase_action').at(-1);
  assert.deepEqual({ vehicle_id: noahEstimateEvent.vehicle_id, action_type: noahEstimateEvent.action_type, placement: noahEstimateEvent.placement }, { vehicle_id: 'jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive', action_type: 'estimate', placement: 'vehicle_detail' }, '見積りアクションを購入導線イベントで計測');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="order"]').count(), 0, '注文可否未確認のノアに注文CTAを表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /121,000円/, 'ノアS-ZにAdvanced Parkの価格を誤表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /noah_spec_202609|sources|accessedAt/, 'ノア詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-yaris-cross-2026-x-gas-2wd/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ヤリス クロス[\s\S]*X（ガソリン車・2WD）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*2,126,300円[\s\S]*ハンズオフ[\s\S]*不可[\s\S]*渋滞時運転支援/, 'ヤリス クロス詳細に価格・手保持・渋滞時支援を表示');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="estimate"]').getAttribute('href'), 'https://toyota.jp/service/estimate/grades?car_name_en=YARIS+CROSS', 'ヤリス クロスの公式見積りURL');
  assert.doesNotMatch(await page.locator('main').innerText(), /grades59\.json|sources|accessedAt|not_allowed/, 'ヤリス クロス詳細に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/compare/?ids=jp-toyota-yaris-cross-2026-x-gas-2wd&ids=jp-toyota-yaris-cross-2026-z-adventure-hev-e-four`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const yarisCrossCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(yarisCrossCompare, /ヤリス クロス[\s\S]*X（ガソリン車・2WD）[\s\S]*Z“Adventure”（ハイブリッド車・E-Four）/);
  assert.match(yarisCrossCompare, /2,126,300円[\s\S]*3,355,000円[\s\S]*ハンズオフ：不可/, 'ヤリス クロス比較に価格と手保持条件を表示');
  assert.equal(await page.locator('[data-compare-result] [data-action-type="estimate"]').count(), 2, 'ヤリス クロス比較に両車の公式見積り導線');
  assert.doesNotMatch(yarisCrossCompare, /grades59\.json|sources|accessedAt|not_allowed/, 'ヤリス クロス比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-toyota-yaris-2026-x-gas-1l-cvt-2wd/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ヤリス[\s\S]*X（ガソリン車 1.0L・CVT・2WD）/);
  assert.match(await page.locator('main').innerText(), /Level 1[\s\S]*参考価格[\s\S]*1,697,300円[\s\S]*ハンズオフ[\s\S]*不可/, 'ヤリス1.0L詳細に価格・Level 1・手保持条件を表示');
  assert.doesNotMatch(await page.locator('.capability-detail-list').innerText(), /車線中央維持/, 'ヤリス1.0L詳細の確認済み機能に車線中央維持を誤表示しない');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="estimate"]').getAttribute('href'), 'https://toyota.jp/service/estimate/grades?car_name_en=YARIS', 'ヤリスの公式見積りURL');
  assert.doesNotMatch(await page.locator('main').innerText(), /grades53\.json|sources|accessedAt|not_allowed/, 'ヤリス1.0L詳細に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-toyota-yaris-2026-z-hev-e-four/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ヤリス[\s\S]*Z（ハイブリッド車 1.5L・E-Four）/);
  assert.match(await page.locator('main').innerText(), /Level 2[\s\S]*参考価格[\s\S]*2,884,200円[\s\S]*渋滞時運転支援/, 'ヤリス ハイブリッド詳細に価格・Level 2・渋滞時支援を表示');

  await page.goto(`${base}/compare/?ids=jp-toyota-yaris-2026-x-gas-1l-cvt-2wd&ids=jp-toyota-yaris-2026-z-hev-e-four`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const yarisCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(yarisCompare, /ヤリス[\s\S]*X（ガソリン車 1.0L・CVT・2WD）[\s\S]*Z（ハイブリッド車 1.5L・E-Four）/);
  assert.match(yarisCompare, /1,697,300円[\s\S]*2,884,200円[\s\S]*Level 1[\s\S]*Level 2/, 'ヤリス比較に価格・Level差を表示');
  assert.equal(await page.locator('[data-compare-result] [data-action-type="estimate"]').count(), 2, 'ヤリス比較に両車の公式見積り導線');
  assert.doesNotMatch(yarisCompare, /grades53\.json|sources|accessedAt|not_allowed/, 'ヤリス比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-toyota-voxy-2026-sz-2wd-7seater/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ヴォクシー[\s\S]*S-Z 2WD（7人乗り）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,127,200円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'ヴォクシーS-Zの価格と条件付きハンズオフを表示');
  assert.match(await page.locator('main').innerText(), /追加パッケージ[\s\S]*122,100円/, 'ヴォクシーS-Zの追加パッケージ価格を表示');
  assert.match(await page.locator('main').innerText(), /アドバンスト ドライブ（渋滞時支援）[\s\S]*0〜約40km\/h[\s\S]*LCAは約85〜130km\/h/, 'ヴォクシーの支援速度差を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /voxy_spec_202609|sources|accessedAt/, 'ヴォクシー詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-sienta-2026-z-hev-2wd-7seater/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*シエンタ[\s\S]*Z（ハイブリッド車・2WD・7人乗り）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*3,183,400円[\s\S]*ハンズオフ[\s\S]*不可/, 'シエンタの公式価格と手保持条件を表示');
  assert.match(await page.locator('main').innerText(), /全車速追従ACC[\s\S]*LTA[\s\S]*ステアリングを持ち続ける/, 'シエンタの能力差と手保持条件を日本語で表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /sienta_spec_202608|sources|accessedAt/, 'シエンタ詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-corolla-cross-2026-z-2wd/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*カローラ クロス[\s\S]*Z（2WD）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*3,613,500円[\s\S]*ハンズオフ[\s\S]*不可[\s\S]*ステアリングを常に保持/, 'カローラ クロスZの公式価格と手保持条件を表示');
  assert.match(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持[\s\S]*渋滞時運転支援[\s\S]*車線変更支援/, 'カローラ クロスの能力差を平易な日本語で表示');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="estimate"]').getAttribute('href'), 'https://toyota.jp/service/estimate/grades?car_name_en=COROLLA%20CROSS', 'カローラ クロスの公式見積りURL');
  assert.doesNotMatch(await page.locator('main').innerText(), /grades61\.json|sources|accessedAt|not_allowed/, 'カローラ クロス詳細に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/compare/?ids=jp-toyota-corolla-cross-2026-z-2wd&ids=jp-toyota-corolla-cross-2026-s-e-four`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const corollaCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(corollaCompare, /カローラ クロス[\s\S]*Z（2WD）[\s\S]*S（E-Four）/);
  assert.match(corollaCompare, /3,613,500円[\s\S]*3,239,500円[\s\S]*車線変更支援/, 'カローラ クロス比較にグレード・駆動方式別価格と能力差');
  assert.equal(await page.locator('[data-compare-result] [data-action-type="estimate"]').count(), 2, 'カローラ クロス比較に両車の公式見積り導線');
  assert.doesNotMatch(corollaCompare, /grades61\.json|sources|accessedAt|not_allowed/, 'カローラ クロス比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/compare/?ids=jp-toyota-sienta-2026-z-hev-2wd-7seater&ids=jp-toyota-sienta-2026-x-gas-2wd-5seater`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const sientaCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(sientaCompare, /シエンタ[\s\S]*Z（ハイブリッド車・2WD・7人乗り）[\s\S]*X（ガソリン車・2WD・5人乗り）/);
  assert.match(sientaCompare, /3,183,400円[\s\S]*2,146,100円/, 'シエンタ比較に動力・定員別価格');
  assert.equal(await page.locator('[data-compare-result] [data-action-type="estimate"]').count(), 2, 'Toyota比較に両車の公式見積り導線');
  assert.match(sientaCompare, /公式の検討用導線[\s\S]*公式で見積り/, '比較でも注文可否と分離した見積り導線を表示');
  assert.equal(await page.locator('[data-compare-result] [data-action-type="order"]').count(), 0, '注文可否未確認のToyota比較に注文CTAを表示しない');
  assert.doesNotMatch(sientaCompare, /sienta_spec_202608|sources|accessedAt/, 'シエンタ比較に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-lexus-lm-2026-lm500h-executive-awd-4seater/`);
  assert.match(await page.locator('main').innerText(), /Lexus[\s\S]*LM[\s\S]*LM500h EXECUTIVE（4人乗り）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*20,300,000円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'LM EXECUTIVEの価格と条件付きハンズオフを表示');
  assert.match(await page.locator('main').innerText(), /LCA[\s\S]*Advanced Drive|車線変更支援[\s\S]*渋滞時運転支援/, 'LMの車線変更・渋滞時支援を表示');
  assert.match(await page.locator('main').innerText(), /0〜約40km\/h[\s\S]*ドライバーモニター/, 'LMの作動速度と監視条件を表示');
  assert.match(await page.locator('main').innerText(), /G-Link契約[\s\S]*3年間無料[\s\S]*その後有料/, 'LMのG-Link契約条件を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /equipmentlist\.pdf|specificationslist\.pdf|sources|accessedAt|allowed_in_conditions/, 'LM詳細に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/compare/?ids=jp-lexus-lm-2026-lm500h-executive-awd-4seater&ids=jp-lexus-lm-2026-lm500h-version-l-awd-6seater`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const lmCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(lmCompare, /LM[\s\S]*LM500h EXECUTIVE（4人乗り）[\s\S]*LM500h version L（6人乗り）/);
  assert.match(lmCompare, /20,300,000円[\s\S]*15,200,000円/, 'LM比較に4人/6人の価格差');
  assert.match(lmCompare, /条件内ハンズオフ|車線変更支援/, 'LM比較に能力差を表示');
  assert.match(lmCompare, /G-Link契約[\s\S]*3年間無料[\s\S]*その後有料/, 'LM比較にG-Link契約条件を表示');
  assert.doesNotMatch(lmCompare, /equipmentlist\.pdf|specificationslist\.pdf|sources|accessedAt|allowed_in_conditions/, 'LM比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-lexus-ux-2026-ux300h-shining-essence-2wd/`);
  assert.match(await page.locator('main').innerText(), /Lexus[\s\S]*UX300h[\s\S]*Shining Essence[\s\S]*2WD/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*5,210,000円[\s\S]*ハンズオフ[\s\S]*不可/, 'UX300hの価格とハンズオフ不可を表示');
  assert.match(await page.locator('main').innerText(), /ステアリングを常に保持[\s\S]*2027年2月生産終了予定/, 'UX300hの保持条件と生産終了予定を表示');
  assert.equal(await page.locator('[data-purchase-action]').count(), 4, 'Lexus UX300h詳細に見積り・試乗・販売店・カタログ導線');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => ({ kind: link.dataset.actionType, href: link.getAttribute('href') }))), [
    { kind: 'test_drive', href: 'https://lexus.jp/request/trial/service/dealerselect?seriesCode=UX' },
    { kind: 'dealer', href: 'https://lexus.jp/dealership/' },
    { kind: 'estimate', href: 'https://lexus.jp/request/estimate_sim/version?car_name_en=UX300h' },
    { kind: 'catalog', href: 'https://lexus.jp/models/ux/pdf/ux_catalog.pdf' },
  ], 'Lexus UX300hの公式アクションURLを保持');
  assert.doesNotMatch(await page.locator('main').innerText(), /equipmentlist\.pdf|specificationslist\.pdf|sources|accessedAt|not_allowed/, 'UX300h詳細に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/compare/?ids=jp-lexus-ux-2026-ux300h-shining-essence-2wd&ids=jp-lexus-lm-2026-lm500h-version-l-awd-6seater`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const lexusContrast = await page.locator('[data-compare-result]').innerText();
  assert.match(lexusContrast, /UX300h[\s\S]*LM500h version L/);
  assert.match(lexusContrast, /5,210,000円[\s\S]*15,200,000円[\s\S]*ハンズオフ：不可[\s\S]*条件内で可/, '同一Lexus内の価格・ハンズオフ差を比較');
  assert.doesNotMatch(lexusContrast, /equipmentlist\.pdf|specificationslist\.pdf|sources|accessedAt|not_allowed|allowed_in_conditions/, 'Lexus比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/compare/?ids=jp-toyota-voxy-2026-sz-2wd-7seater&ids=jp-toyota-voxy-2026-sg-2wd-8seater`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const voxyCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(voxyCompare, /ヴォクシー[\s\S]*S-Z 2WD（7人乗り）[\s\S]*S-G 2WD（8人乗り）/);
  assert.match(voxyCompare, /122,100円[\s\S]*78,100円/, 'ヴォクシー比較にグレード別追加パッケージ価格');
  assert.doesNotMatch(voxyCompare, /voxy_spec_202609|sources|accessedAt/, 'ヴォクシー比較に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ノア[\s\S]*HYBRID S-Z 2WD（7人乗り）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,056,800円[\s\S]*追加パッケージ[\s\S]*122,100円[\s\S]*ハンズオフ[\s\S]*条件内で可[\s\S]*T-Connect[\s\S]*コネクティッドナビ契約/, 'ノアS-Zの車両価格・追加パッケージ・契約条件を表示');
  assert.match(await page.locator('main').innerText(), /Advanced Drive[\s\S]*0〜約40km\/h[\s\S]*LCA[\s\S]*約85〜130km\/h/, 'ノアS-Z詳細でAdvanced DriveとLCAの速度域を分ける');
  assert.match(await page.locator('main').innerText(), /LCA|車線変更支援/);
  assert.doesNotMatch(await page.locator('main').innerText(), /noah_spec_202609|sources|accessedAt|allowed_in_conditions/, 'ノア詳細に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-toyota-noah-2026-hybrid-sx-2wd-7seater/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ノア[\s\S]*HYBRID S-X 2WD（7人乗り）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*3,261,500円[\s\S]*ハンズオフ[\s\S]*不可/, 'ノアS-Xの価格とハンズオフ不可を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /条件付き支援パッケージ/, 'ノアS-Xに存在しない追加パッケージを表示しない');

  await page.goto(`${base}/compare/?ids=jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive&ids=jp-toyota-noah-2026-hybrid-sx-2wd-7seater`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const noahCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(noahCompare, /ノア[\s\S]*HYBRID S-Z 2WD（7人乗り）[\s\S]*HYBRID S-X 2WD（7人乗り）/);
  assert.match(noahCompare, /4,056,800円[\s\S]*3,261,500円[\s\S]*122,100円[\s\S]*参考総額[\s\S]*4,178,900円[\s\S]*算出不可[\s\S]*ハンズオフ：条件内で可[\s\S]*ハンズオフ：不可/, 'ノア比較にS-Z/S-Xの参考総額・価格・能力差');
  const noahReferenceTotalRow = page.locator('[data-compare-row="reference-total"]');
  assert.equal(await noahReferenceTotalRow.getAttribute('class').then((value) => value.includes('compare-row-unconfirmed')), true, 'ノアの算出不可総額は優劣から分離');
  assert.equal(await noahReferenceTotalRow.getAttribute('class').then((value) => value.includes('compare-row-diff')), false, 'ノアの算出不可総額を確認済み差分に数えない');
  assert.doesNotMatch(noahCompare, /noah_spec_202609|sources|accessedAt|allowed_in_conditions|not_allowed/, 'ノア比較に内部根拠や内部enumを表示しない');

  await page.goto(`${base}/cars/jp-lexus-rz-2026-rz500e-version-l-awd/`);
  assert.match(await page.locator('main').innerText(), /Lexus[\s\S]*RZ[\s\S]*RZ500e/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*8,500,000円[\s\S]*ハンズオフ[\s\S]*未確認/, 'RZの未確認条件を明示');
  assert.doesNotMatch(await page.locator('main').innerText(), /rz\/features|sources|accessedAt/, 'RZ詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-prius-2026-z-2wd/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*プリウス[\s\S]*Z（2WD）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*3,998,500円[\s\S]*ハンズオフ[\s\S]*不可/, 'プリウスの公式価格と手保持条件を表示');

  await page.goto(`${base}/cars/jp-lexus-nx-2026-nx350h-version-l-2wd/`);
  assert.match(await page.locator('main').innerText(), /Lexus[\s\S]*NX[\s\S]*NX350h/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*6,376,000円[\s\S]*ハンズオフ[\s\S]*不可/, 'NXの公式価格と手保持条件を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /nx\/features|sources|accessedAt/, 'NX詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-crown-crossover-2026-rs-limited-matte-metal-4wd/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*クラウン（クロスオーバー）[\s\S]*THE LIMITED-MATTE METAL/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*7,590,000円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'クラウンの条件付きハンズオフと価格を表示');
  assert.match(await page.locator('main').innerText(), /渋滞時支援[\s\S]*0〜約40km\/h|車線変更支援/, 'クラウンの能力差を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /crowncrossover\/safety|sources|accessedAt/, 'クラウン詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-lexus-lbx-2026-bespoke-build-2wd/`);
  assert.match(await page.locator('main').innerText(), /Lexus[\s\S]*LBX[\s\S]*Bespoke Build/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*5,500,000円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'LBXの条件付きハンズオフと価格を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /models\/lbx|sources|accessedAt/, 'LBX詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-lexus-rx-2026-rx500h-f-sport-performance-awd/`);
  assert.match(await page.locator('main').innerText(), /Lexus[\s\S]*RX[\s\S]*RX500h[\s\S]*F SPORT Performance/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*9,030,000円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'RXの条件付きハンズオフと価格を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /models\/rx|sources|accessedAt/, 'RX詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-toyota-bz4x-2026-z-fwd-advanced-drive/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*bZ4X[\s\S]*Z（FWD）/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*5,500,000円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'bZ4Xの条件付きハンズオフと価格を表示');
  assert.match(await page.locator('main').innerText(), /渋滞時支援[\s\S]*0〜約40km\/h|車線変更支援/, 'bZ4Xの能力差を表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /bz4x\/safety|sources|accessedAt/, 'bZ4X詳細に内部根拠を表示しない');

  await page.goto(`${base}/cars/jp-tesla-model-y-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /Tesla[\s\S]*Model Y/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'Model Yでも内部根拠を通常UIに出さない');

  await page.goto(`${base}/compare/?ids=jp-tesla-model-3-2026-premium&ids=jp-tesla-model-y-2026-premium`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /Model 3[\s\S]*Model Y/);
  assert.equal((await page.locator('[data-compare-result]').getByText('新車注文可', { exact: true }).count()), 2, '比較でもTeslaの注文可状態を表示');
  assert.match(await page.locator('[data-compare-diff-count]').getAttribute('data-compare-diff-count').catch(() => ''), /./, '比較の確認済み差分件数を保持');
  assert.ok(await page.locator('.compare-row-diff').count() > 0, '比較で意味のある既知差分を強調');
  assert.ok(await page.locator('.compare-row-unconfirmed').count() > 0, '比較で未確認項目を優劣から分離');
  const sameRows = page.locator('.compare-table .compare-row-same');
  const sameRowCount = await sameRows.count();
  assert.ok(sameRowCount > 0, '同値項目を識別');
  await page.getByRole('button', { name: '同じ項目を隠す' }).click();
  assert.equal(await page.locator('.compare-table .compare-row-same:visible').count(), 0, '同値項目を隠せる');
  await page.getByRole('button', { name: 'すべての項目を表示' }).click();
  assert.equal(await page.locator('.compare-table .compare-row-same:visible').count(), sameRowCount, '同値項目を1操作で再表示');
  assert.match(await page.locator('[data-compare-result]').innerText(), /確認できた機能[\s\S]*確認済み/, '比較で機能を平易な日本語で表示');
  assert.equal(await page.locator('[data-compare-result] [data-purchase-action]').count(), 4, '比較でも2台の注文・試乗アクションを表示');
  const comparePurchase = page.locator('[data-compare-result] [data-purchase-action]').first();
  await comparePurchase.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true, capture: true }));
  await comparePurchase.click();
  const comparePurchaseEvent = (await events()).filter((event) => event.event === 'outbound_purchase_action').at(-1);
  assert.deepEqual({ vehicle_id: comparePurchaseEvent.vehicle_id, action_type: comparePurchaseEvent.action_type, placement: comparePurchaseEvent.placement }, { vehicle_id: 'jp-tesla-model-3-2026-premium', action_type: 'order', placement: 'comparison' }, '比較の購入アクション計測');
  assert.equal(await page.locator('[data-compare-result] [data-official-link]').count(), 2, '比較後に2台それぞれの公式確認出口');
  const compareOfficial = page.locator('[data-compare-result] [data-official-link]').first();
  await compareOfficial.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true, capture: true }));
  await compareOfficial.click();
  const compareOutbound = (await events()).filter((event) => event.event === 'outbound_manufacturer').at(-1);
  assert.deepEqual({ vehicle_id: compareOutbound.vehicle_id, manufacturer: compareOutbound.manufacturer, link_type: compareOutbound.link_type, placement: compareOutbound.placement }, { vehicle_id: 'jp-tesla-model-3-2026-premium', manufacturer: 'Tesla', link_type: 'product', placement: 'comparison' }, '比較の公式遷移イベント');

  await page.goto(`${base}/compare/?ids=jp-toyota-crown-crossover-2026-rs-limited-matte-metal-4wd&ids=jp-lexus-rx-2026-rx500h-f-sport-performance-awd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const crownRxCompare = await page.locator('[data-compare-result]').innerText();
  assert.match(crownRxCompare, /クラウン（クロスオーバー）[\s\S]*RX500h[\s\S]*9,030,000円/);
  assert.match(crownRxCompare, /ハンズオフ：条件内で可/);
  assert.equal(await page.locator('[data-compare-result] [data-official-link]').count(), 2, 'クラウンとRXの比較に公式確認出口');
  assert.doesNotMatch(crownRxCompare, /crowncrossover\/safety|models\/rx|sources|accessedAt/, 'クラウンとRX比較に内部根拠を表示しない');
  await page.goto(`${base}/compare/?ids=jp-toyota-harrier-2026-g-2wd&ids=jp-tesla-model-3-2026-premium`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const unknownMonitoringRow = page.locator('[data-compare-row="driver-monitoring"]');
  assert.equal(await unknownMonitoringRow.getAttribute('class').then((value) => value.includes('compare-row-unconfirmed')), true, '監視条件不明は既知の差分扱いしない');
  assert.equal(await unknownMonitoringRow.getAttribute('class').then((value) => value.includes('compare-row-diff')), false, '監視条件不明を差分バッジで強調しない');

  await page.goto(`${base}/cars/jp-honda-legend-2021-honda-sensing-elite/`);
  assert.match(await page.locator('.official-next').innerText(), /メーカー公式の過去資料で確認[\s\S]*現行車の見積・注文ページではなく/);
  assert.equal(await page.locator('[data-official-link]').getAttribute('data-link-kind'), 'archive', '過去車両は現行商品導線にしない');

  await page.goto(`${base}/cars/jp-volvo-ex30-my2027-plus-p5-electric/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 2027年モデル[\s\S]*Volvo[\s\S]*EX30[\s\S]*Plus P5 Electric/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,790,000円/, 'Volvo詳細に公式掲載価格');
  assert.match(await page.locator('main').innerText(), /新車注文可/, 'Volvo EX30詳細は公式オンライン契約を注文可として表示');
  assert.equal(await page.locator('[data-purchase-action][data-action-type="order"]').count(), 1, 'Volvo EX30に公式オンライン注文導線');
  assert.match(await page.locator('[data-purchase-action][data-action-type="order"]').innerText(), /オンラインで注文[\s\S]*↗/, 'Volvo EX30の注文導線ラベル');
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'Volvoでも内部根拠を通常UIに出さない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-07|volvocars\.com|sources|accessedAt/, 'Volvo詳細に内部根拠URL・確認日を表示しない');
  await page.screenshot({ path: `${qaDir}/desktop-volvo-ex30-detail.png`, fullPage: false });

  await page.goto(`${base}/cars/jp-tesla-model-3-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Tesla[\s\S]*Model 3/);
  await page.goto(`${base}/cars/jp-nissan-serena-2026-e-power-luxion/`);
  assert.match(await page.locator('main').innerText(), /JP \/ C28[\s\S]*Nissan[\s\S]*セレナ/);
  assert.equal(await page.locator('[data-purchase-action]').count(), 4, '日産セレナ詳細に見積り・試乗・販売店・カタログ導線');
  assert.deepEqual(await page.locator('[data-purchase-action]').evaluateAll((links) => links.map((link) => ({ kind: link.dataset.actionType, href: link.getAttribute('href') }))), [
    { kind: 'test_drive', href: 'https://www3.nissan.co.jp/carsindealers.html#/search!modelName=%E3%82%BB%E3%83%AC%E3%83%8A' },
    { kind: 'dealer', href: 'https://www3.nissan.co.jp/dealers.html' },
    { kind: 'estimate', href: 'https://www3.nissan.co.jp/vehicles/new/serena/sim.html' },
    { kind: 'catalog', href: 'https://www.nissan.co.jp/CATALOG/SERENA/' },
  ], '日産セレナの公式アクションURLを保持');

  await page.goto(`${base}/compare/?ids=jp-volvo-ex30-my2027-plus-p5-electric&ids=jp-volvo-ex30-my2027-ultra-p8-awd-electric`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /2027年モデル[\s\S]*Plus P5 Electric[\s\S]*2027年モデル[\s\S]*Ultra P8 AWD Electric/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-07|volvocars\.com|sources|accessedAt/, '比較結果に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|MY27_EX30_Ver2_W29/, '比較ページHTMLへ内部時点・根拠資料URLを配信しない');

  await page.goto(`${base}/cars/jp-mini-countryman-u25-c-select/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 第3世代[\s\S]*MINI[\s\S]*Countryman[\s\S]*C SELECT/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,800,000円/, 'MINI詳細に公式掲載価格');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-07|mini\.jp|sources|accessedAt/, 'MINI詳細に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|MINI_COUNTRYMAN_EPL_2607/, 'MINI詳細HTMLへ内部時点・根拠資料URLを配信しない');
  await page.goto(`${base}/compare/?ids=jp-mini-countryman-u25-c-select&ids=jp-mini-countryman-u25-se-all4`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /C SELECT[\s\S]*SE ALL4/);
  assert.match(await page.locator('[data-compare-result]').innerText(), /参考価格[\s\S]*4,800,000円[\s\S]*6,780,000円/, 'MINI比較に公式掲載価格');
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-07|mini\.jp|sources|accessedAt/, 'MINI比較に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|MINI_COUNTRYMAN_EPL_2607/, 'MINI比較HTMLへ内部時点・根拠資料URLを配信しない');

  await page.goto(`${base}/cars/jp-suzuki-e-vitara-2026-x-2wd/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Suzuki[\s\S]*e VITARA[\s\S]*X 2WD/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'e VITARA詳細に内部根拠を表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-01-16|suzuki\.co\.jp|sources|accessedAt/, 'e VITARA詳細に内部根拠URL・確認日を表示しない');

  await page.goto(`${base}/compare/?ids=jp-suzuki-e-vitara-2026-x-2wd&ids=jp-suzuki-e-vitara-2026-z-4wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /現行仕様[\s\S]*X 2WD[\s\S]*現行仕様[\s\S]*Z 4WD/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-01-16|suzuki\.co\.jp|sources|accessedAt/, 'e VITARA比較に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|evitara_26MC_DSBS2-4/, 'e VITARA比較HTMLへ内部時点・根拠資料URLを配信しない');

  await page.goto(`${base}/cars/jp-renault-arkana-esprit-alpine-full-hybrid-e-tech/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Renault[\s\S]*ARKANA[\s\S]*esprit Alpine FULL HYBRID E-TECH/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'ARKANA詳細に内部根拠を表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2025-07|2025-09|renault\.jp|dcms\.renault|sources|accessedAt/, 'ARKANA詳細に内部根拠URL・確認日を表示しない');

  await page.goto(`${base}/compare/?ids=jp-renault-arkana-esprit-alpine-full-hybrid-e-tech&ids=jp-renault-arkana-techno-mild-hybrid`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /現行仕様[\s\S]*esprit Alpine FULL HYBRID E-TECH[\s\S]*現行仕様[\s\S]*techno MILD HYBRID/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2025-07|2025-09|renault\.jp|dcms\.renault|sources|accessedAt/, 'ARKANA比較に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|ARKANA_ea_webspec|dcms\.renault/, 'ARKANA比較HTMLへ内部時点・根拠資料URLを配信しない');

  await page.goto(`${base}/cars/jp-mazda-cx-80-xd-drive-edition/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Mazda[\s\S]*CX-80[\s\S]*XD Drive Edition/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'Mazda詳細に内部根拠を表示しない');
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,781,700円/, 'Mazda詳細に公式掲載価格');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-03|mazda\.co\.jp|sources|accessedAt/, 'Mazda詳細に内部根拠URL・確認日を表示しない');
  await page.goto(`${base}/cars/jp-mazda-mazda3-fastback-25s-6mt/`);
  assert.match(await page.locator('main').innerText(), /MAZDA3 FASTBACK[\s\S]*25S（6MT）[\s\S]*MRCC・CTS/);
  assert.doesNotMatch(await page.locator('main').innerText(), /全車速追従機能付/, 'MAZDA3 6MTを全車速追従仕様として表示しない');
  await page.goto(`${base}/cars/jp-mazda-cx-5-g-ex-package/`);
  assert.match(await page.locator('main').innerText(), /新型 CX-5[\s\S]*G（EX Package）[\s\S]*ハンズオフアシスト/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*3,520,000〜3,756,500円/, 'CX-5 EX Package詳細に公式掲載価格');
  assert.match(await page.locator('main').innerText(), /追加パッケージ[\s\S]*EX Package \+227,700円/, 'CX-5 EX Package詳細に追加価格');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-05|mazda\.co\.jp|sources|accessedAt/, 'CX-5 EX Package詳細に内部根拠URL・確認日を表示しない');
  await page.goto(`${base}/compare/?ids=jp-mazda-cx-80-xd-drive-edition&ids=jp-mazda-cx-30-25l`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /CX-80[\s\S]*XD Drive Edition[\s\S]*CX-30[\s\S]*25L/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-03|2026-07|mazda\.co\.jp|sources|accessedAt/, 'Mazda比較に内部時点・価格・根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|cx-5_specification_202605/, 'Mazda比較HTMLへ内部時点・根拠資料URLを配信しない');
  await page.goto(`${base}/compare/?ids=jp-mazda-cx-5-g&ids=jp-mazda-cx-5-g-ex-package`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  const cx5PackageCompare = page.locator('[data-compare-result]');
  assert.match(await cx5PackageCompare.innerText(), /追加パッケージ[\s\S]*EX Package \+227,700円/, '比較にオプション価格を表示');
  assert.equal(await cx5PackageCompare.locator('[data-compare-row="optional-package"]').getAttribute('class').then((value) => value.includes('compare-row-unconfirmed')), true, '片側未確認の追加価格は差分扱いしない');

  await page.goto(`${base}/cars/jp-bmw-3-series-g20-sedan-318i-m-sport/`);
  assert.match(await page.locator('main').innerText(), /JP \/ G20[\s\S]*BMW[\s\S]*3シリーズ セダン[\s\S]*318i M Sport/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'BMW詳細に内部根拠を表示しない');
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*6,880,000円/, 'BMW詳細に公式掲載価格');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-07|bmw\.co\.jp|sources|accessedAt/, 'BMW詳細に内部根拠URL・確認日を表示しない');

  await page.goto(`${base}/cars/jp-bmw-3-series-g21-touring-m340i-xdrive/`);
  assert.match(await page.locator('main').innerText(), /JP \/ G21[\s\S]*BMW[\s\S]*3シリーズ ツーリング[\s\S]*M340i xDrive/);

  await page.goto(`${base}/compare/?ids=jp-bmw-3-series-g20-sedan-318i-m-sport&ids=jp-bmw-3-series-g21-touring-m340i-xdrive`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /G20[\s\S]*318i M Sport[\s\S]*G21[\s\S]*M340i xDrive/);
  assert.match(await page.locator('[data-compare-result]').innerText(), /参考価格[\s\S]*6,880,000円[\s\S]*10,270,000円/, 'BMW比較に公式掲載価格');
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-07|bmw\.co\.jp|sources|accessedAt/, 'BMW比較に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|3series_Sedan_EPL_202607/, 'BMW比較HTMLへ内部時点・根拠資料URLを配信しない');

  await page.goto(`${base}/levels/`);
  const levelsText = await page.locator('main').innerText();
  assert.match(levelsText, /Level 4と5の違い[\s\S]*LEVEL 4[\s\S]*条件の中で完結[\s\S]*LEVEL 5[\s\S]*条件を限定しない/, 'Level 4と5を作動条件の有無で明確に区別');
  assert.match(levelsText, /限定されたエリア[\s\S]*条件外を自力で走れるとは限りません/, 'Level 4は限定条件内で完結すると説明');
  assert.match(levelsText, /走行エリアや天候などを限定せず[\s\S]*人が運転できる道路・状況全般/, 'Level 5は条件を限定しないと説明');

  await page.goto(`${base}/privacy/`);
  assert.equal(await page.locator('[data-consent]').count(), 0, 'privacyページにも同意バナーなし');
  assert.equal(await page.getByRole('button', { name: '計測設定を取り消す' }).count(), 0, '存在しないサイト内撤回UIを案内しない');
  assert.equal(await page.getByRole('link', { name: 'Google Analytics オプトアウト アドオン' }).count(), 1, '外部オプトアウト手段を案内');
  console.log('E2E PASS: 1/1 scenario');
} finally {
  await browser.close();
}
