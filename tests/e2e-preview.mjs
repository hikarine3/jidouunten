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

try {
  const rootHtml = await (await fetch(`${base}/`)).text();
  assert.equal(rootHtml.includes('\0'), false, '公開HTMLにNUL制御文字を含めない');
  await page.goto(`${base}/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert.equal(await visibleCards(), 84, '既定カタログは現行確認84件');
  assert.match(await page.locator('.catalog-command').innerText(), /同じLevel 2でも[\s\S]*できることは違う[\s\S]*84[\s\S]*条件内可[\s\S]*29[\s\S]*不可[\s\S]*54[\s\S]*未確認[\s\S]*1[\s\S]*車線変更支援[\s\S]*17/, 'トップ操作盤に能力差の実データ分布');
  assert.equal(await page.locator('[data-level-shortcut]').count(), 5, 'Level 1〜5を同時表示');
  assert.match(await page.locator('[data-level-shortcut="3"]').innerText(), /L3[\s\S]*条件付自動運転[\s\S]*過去例 1件/, 'Level 3の過去例を現行車と区別');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla' }).count(), 6, 'Tesla Model 3 / Model Yの6販売仕様を既定一覧に表示');
  await page.locator('[data-maker-shortcut="Tesla"]').click();
  assert.equal(new URL(page.url()).searchParams.get('maker'), 'Tesla', 'Teslaクイック絞り込みをURLへ保存');
  assert.equal(await visibleCards(), 6, 'Teslaクイック絞り込みは6件');
  await page.locator('[data-reset-shortcut]').click();
  await page.locator('[data-hands-off-shortcut="allowed_in_conditions"]').click();
  assert.equal(await visibleCards(), 29, '条件内ハンズオフは29件');
  await page.locator('[data-reset-shortcut]').click();
  await page.locator('[data-capability-shortcut="lane_change_support"]').click();
  assert.equal(await visibleCards(), 17, '車線変更支援は17件');
  await page.locator('[data-reset-shortcut]').click();
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Volvo EX30' }).count(), 3, 'Volvo EX30の3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Suzuki e VITARA' }).count(), 3, 'Suzuki e VITARAの3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Suzuki e VITARA' }).locator('.maker').first().innerText(), '現行仕様　X 2WD', 'e VITARAは現行仕様として表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Renault ARKANA' }).count(), 4, 'Renault ARKANAの4販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'MINI Countryman' }).count(), 8, 'MINI Countrymanの8販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Renault ARKANA' }).locator('.maker').first().innerText(), '現行仕様　esprit Alpine FULL HYBRID E-TECH', 'ARKANAは資料年ではなく現行仕様を表示');
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
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /日本向け84販売単位/, 'トップのdescription件数は公開データから生成');
  assert.doesNotMatch(await page.locator('meta[name="description"]').getAttribute('content'), /日本向け83販売単位/, '古い固定件数を残さない');
  assert.doesNotMatch(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), /72販売単位/, 'OG画像altに古い固定件数を残さない');
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image', 'X向けlarge card');
  assert.match(await page.locator('footer').innerText(), /自動運転\.jp[\s\S]*車を探す[\s\S]*レベルの定義[\s\S]*比較する[\s\S]*プライバシー[\s\S]*1st Class/, '共通フッターに主要導線と運営元');
  assert.equal(await page.locator('[data-vehicle-shell][data-availability="unavailable"]:visible').count(), 0, '過去車両は既定非表示');
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
  assert.equal(await levelMapPage.locator('[data-vehicle-shell]:not([hidden])').count(), 84, 'Level 2現行84件へ復帰');
  await levelMapPage.close();
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
  assert.equal(await visibleCards(), 14, 'トップのLevel 2・高速・ハンズオフ条件は14件');
  assert.equal(await page.locator('[data-level2-notice]:visible').count(), 1, 'トップのLevel 2注意表示');
  assert.equal(new URL(page.url()).pathname, '/', 'トップの深いリンクはトップに留まる');

  await page.goto(`${base}/?capability=lane_change_support&maker=Mazda`);
  assert.equal(await visibleCards(), 2, 'メーカーと能力をAND条件で絞り込む');
  assert.equal(await page.locator('select[name="capability"]').inputValue(), 'lane_change_support', '能力条件をURLから復元');

  await page.goto(`${base}/?sort=maker_asc`);
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').first().innerText(), /^LEVEL 2[\s\S]*BMW/, 'メーカー名順へ切替');
  assert.equal(await page.locator('[data-sort-label]').innerText(), 'メーカー名順', '現在の並び順を明示');

  await page.goto(`${base}/?sort=price_asc`);
  assert.match(await page.locator('[data-vehicle-shell]:not([hidden])').first().innerText(), /Mazda[\s\S]*CX-30[\s\S]*20G[\s\S]*約297万円/, '価格順は公式掲載の最小金額が安い販売単位から');
  assert.equal(await page.locator('[data-sort-label]').innerText(), '価格が安い順 · 価格要確認は末尾', '価格順の基準を明示');

  await page.goto(`${base}/cars/?level=2&road=${encodeURIComponent('高速道路')}&handsOff=allowed_in_conditions`);
  assert.equal(await visibleCards(), 14, 'Level 2・高速・ハンズオフ条件は14件');
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
  assert.equal(await visibleCards(), 84, '戻る後の結果件数');

  await page.goto(`${base}/?level=3`);
  assert.equal(await visibleCards(), 0, '空結果を表示');
  await page.getByRole('link', { name: '条件をリセット' }).click();
  assert.equal(new URL(page.url()).pathname, '/', 'リセットでトップ一覧へ戻る');
  assert.equal(await visibleCards(), 84, 'リセット後に既定84件');

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

  await page.goto(`${base}/cars/?availability=all`);
  assert.equal(await visibleCards(), 85, 'すべての状態で過去車両を含む85件');
  assert.equal(await page.locator('[data-selected-label]').innerText(), 'すべての状態', '全状態選択時の結果見出しを正しく表示');
  await page.goto(`${base}/cars/?availability=unavailable`);
  assert.equal(await visibleCards(), 1, '現在利用不可は過去車両1件');
  assert.equal(await page.locator('[data-selected-label]').innerText(), '現在利用不可', '販売状態選択時の結果見出しを正しく表示');
  await page.goto(`${base}/compare/?ids=jp-honda-accord-2025-ehev-sensing360plus&ids=jp-subaru-levorg-layback-2023-limited-ex`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('input[name="ids"]:checked').count(), 2, '比較対象は2台');
  const compareText = await page.locator('[data-compare-result]').innerText();
  assert.match(compareText, /e:HEV Honda SENSING 360＋/);
  assert.match(compareText, /Limited EX/);
  assert.equal((await events()).filter((event) => event.event === 'compare_vehicles').length, 1, 'compare_vehiclesイベント');

  await page.goto(`${base}/cars/jp-honda-accord-2025-ehev-sensing360plus/`);
  assert.equal((await events()).filter((event) => event.event === 'view_vehicle').length, 1, 'view_vehicleイベント');
  const detailOfficial = page.getByRole('link', { name: /公式サイトを開く/ });
  assert.equal(await detailOfficial.getAttribute('href'), 'https://www.honda.co.jp/ACCORD/', '詳細の販売単位に対応する公式リンク');
  await detailOfficial.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true, capture: true }));
  await detailOfficial.click();
  const detailOutbound = (await events()).filter((event) => event.event === 'outbound_manufacturer').at(-1);
  assert.deepEqual({ vehicle_id: detailOutbound.vehicle_id, manufacturer: detailOutbound.manufacturer, link_type: detailOutbound.link_type, placement: detailOutbound.placement }, { vehicle_id: 'jp-honda-accord-2025-ehev-sensing360plus', manufacturer: 'Honda', link_type: 'product', placement: 'vehicle_detail' }, '詳細の公式遷移イベント');

  await page.goto(`${base}/cars/jp-tesla-model-3-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /Tesla[\s\S]*Model 3/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*5,313,000円〜/, 'Tesla詳細に公式掲載価格');
  assert.doesNotMatch(await page.locator('main').innerText(), /adaptive_cruise_control|lane_centering|hands_off_highway|lane_change_support/, '内部capability IDを公開しない');
  assert.match(await page.locator('main').innerText(), /確認できた機能[\s\S]*追従走行（ACC）[\s\S]*車線中央維持/, '機能IDを平易な日本語で説明');
  assert.match(await page.locator('main').innerText(), /注文可否：未確認[\s\S]*メーカー公式サイトへの掲載は確認済み[\s\S]*新車で注文できるかは未確認/, '公式掲載と注文可否を分けて説明');
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, '根拠URL・確認日は通常UIに出さない');
  await page.screenshot({ path: `${qaDir}/desktop-tesla-detail.png`, fullPage: false });

  await page.goto(`${base}/cars/jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive/`);
  assert.match(await page.locator('main').innerText(), /Toyota[\s\S]*ノア[\s\S]*HYBRID S-Z 2WD/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,056,800円[\s\S]*ハンズオフ[\s\S]*条件内で可/, 'ノアの条件付きハンズオフを表示');
  assert.match(await page.locator('main').innerText(), /必要パッケージ[\s\S]*121,000円|Toyota Teammate アドバンスト ドライブ/, 'ノアの必要パッケージを表示');
  assert.doesNotMatch(await page.locator('main').innerText(), /noah_spec_202609|sources|accessedAt/, 'ノア詳細に内部根拠を表示しない');

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
  assert.equal((await page.locator('[data-compare-result]').getByText('メーカー公式サイトへの掲載は確認済みです。新車で注文できるかは未確認です。', { exact: true }).count()), 2, '比較でも公式掲載と注文可否を分けて説明');
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

  await page.goto(`${base}/cars/jp-honda-legend-2021-honda-sensing-elite/`);
  assert.match(await page.locator('.official-next').innerText(), /メーカー公式の過去資料で確認[\s\S]*現行車の見積・注文ページではなく/);
  assert.equal(await page.locator('[data-official-link]').getAttribute('data-link-kind'), 'archive', '過去車両は現行商品導線にしない');

  await page.goto(`${base}/cars/jp-volvo-ex30-my2027-plus-p5-electric/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 2027年モデル[\s\S]*Volvo[\s\S]*EX30[\s\S]*Plus P5 Electric/);
  assert.match(await page.locator('main').innerText(), /参考価格[\s\S]*4,790,000円/, 'Volvo詳細に公式掲載価格');
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'Volvoでも内部根拠を通常UIに出さない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-07|volvocars\.com|sources|accessedAt/, 'Volvo詳細に内部根拠URL・確認日を表示しない');
  await page.screenshot({ path: `${qaDir}/desktop-volvo-ex30-detail.png`, fullPage: false });

  await page.goto(`${base}/cars/jp-tesla-model-3-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Tesla[\s\S]*Model 3/);
  await page.goto(`${base}/cars/jp-nissan-serena-2026-e-power-luxion/`);
  assert.match(await page.locator('main').innerText(), /JP \/ C28[\s\S]*Nissan[\s\S]*セレナ/);

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
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-05|mazda\.co\.jp|sources|accessedAt/, 'CX-5 EX Package詳細に内部根拠URL・確認日を表示しない');
  await page.goto(`${base}/compare/?ids=jp-mazda-cx-80-xd-drive-edition&ids=jp-mazda-cx-30-25l`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /CX-80[\s\S]*XD Drive Edition[\s\S]*CX-30[\s\S]*25L/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-03|2026-07|mazda\.co\.jp|sources|accessedAt/, 'Mazda比較に内部時点・価格・根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|checkedAt|\"sources\"|cx-5_specification_202605/, 'Mazda比較HTMLへ内部時点・根拠資料URLを配信しない');

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
