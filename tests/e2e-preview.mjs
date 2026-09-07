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
  await page.goto(`${base}/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert.equal(await visibleCards(), 37, '既定カタログは現行確認37件');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla' }).count(), 2, 'Tesla Model 3 / Model Yを既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Volvo EX30' }).count(), 3, 'Volvo EX30の3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Suzuki e VITARA' }).count(), 3, 'Suzuki e VITARAの3販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Suzuki e VITARA' }).locator('.maker').first().innerText(), '現行仕様　X 2WD', 'e VITARAは現行仕様として表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Renault ARKANA' }).count(), 4, 'Renault ARKANAの4販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'MINI Countryman' }).count(), 8, 'MINI Countrymanの8販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Renault ARKANA' }).locator('.maker').first().innerText(), '現行仕様　esprit Alpine FULL HYBRID E-TECH', 'ARKANAは資料年ではなく現行仕様を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BMW 3シリーズ' }).count(), 9, 'BMW 3シリーズ通常カタログの9販売単位を既定一覧に表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BMW 3シリーズ セダン' }).locator('.maker').first().innerText(), 'G20　318i M Sport', 'BMWセダンは資料年ではなくG20世代を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BMW 3シリーズ ツーリング' }).locator('.maker').first().innerText(), 'G21　318i M Sport', 'BMWツーリングは資料年ではなくG21世代を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla Model 3' }).locator('.maker').first().innerText(), '現行仕様　Premium（日本向けページ掲載）', 'Teslaは資料年ではなく現行仕様を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Nissan セレナ' }).locator('.maker').first().innerText(), 'C28　e-POWER LUXION', 'Serenaは世代呼称を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Volvo EX30' }).locator('.maker').first().innerText(), '2027年モデル　Plus P5 Electric', 'Volvoはメーカー明示モデル年を表示');
  await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'Tesla Model 3' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${qaDir}/desktop-tesla-list.png`, fullPage: false });
  assert.equal(await page.locator('.hero, .road-art, .level-card').count(), 0, 'トップはLPヒーローではなく一覧');
  assert.equal(await page.locator('[data-vehicle-shell][data-availability="unavailable"]:visible').count(), 0, '過去車両は既定非表示');
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0, '同意前はGTMなし');
  assert.deepEqual(await events(), [], '同意前の初期表示ではイベントなし');
  assert.equal(analyticsRequests.length, 0, '同意前のAnalytics通信なし');
  await page.screenshot({ path: `${qaDir}/desktop-home.png`, fullPage: false });
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto(`${base}/`);
  const mobileFirstCard = await mobilePage.locator('[data-vehicle-shell]:not([hidden])').first().boundingBox();
  assert.ok(mobileFirstCard && mobileFirstCard.y <= 450, `モバイル初期カード上端が450px以内 (${mobileFirstCard?.y ?? 'none'}px)`);
  await mobilePage.screenshot({ path: `${qaDir}/mobile-home.png`, fullPage: false });
  await mobilePage.close();
  for (const width of [390, 520, 768, 1280]) {
    const widthPage = width === 1280 ? page : await browser.newPage({ viewport: { width, height: 844 } });
    await widthPage.goto(`${base}/`);
    const dimensions = await widthPage.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(dimensions.scrollWidth <= dimensions.innerWidth, `${width}pxで横スクロールなし (${dimensions.scrollWidth}/${dimensions.innerWidth})`);
    if (width !== 1280) await widthPage.close();
  }

  await page.goto(`${base}/?level=2&road=${encodeURIComponent('高速道路')}&handsOff=allowed_in_conditions`);
  assert.equal(await visibleCards(), 7, 'トップのLevel 2・高速・ハンズオフ条件は7件');
  assert.equal(await page.locator('[data-level2-notice]:visible').count(), 1, 'トップのLevel 2注意表示');
  assert.equal(new URL(page.url()).pathname, '/', 'トップの深いリンクはトップに留まる');

  await page.goto(`${base}/cars/?level=2&road=${encodeURIComponent('高速道路')}&handsOff=allowed_in_conditions`);
  assert.equal(await visibleCards(), 7, 'Level 2・高速・ハンズオフ条件は7件');
  assert.equal(await page.locator('[data-level2-notice]:visible').count(), 1, 'Level 2注意表示');
  assert.equal(new URL(page.url()).searchParams.get('level'), '2', '深いリンクのlevel復元');
  assert.equal(await page.locator('#vehicle-filters').getAttribute('action'), '/cars/', '旧一覧は現在のルートで送信');
  await page.getByRole('button', { name: '同意する' }).click({ noWaitAfter: true });
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 1, '同意後にGTM読み込み');
  await page.waitForTimeout(1000);
  assert.ok(analyticsRequests.some((url) => url.includes('googletagmanager')), '同意後のGTM通信');
  if (process.env.EXPECT_GA_COLLECT === '1') {
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
  assert.equal(await visibleCards(), 37, '戻る後の結果件数');

  await page.goto(`${base}/?level=3`);
  assert.equal(await visibleCards(), 0, '空結果を表示');
  await page.getByRole('link', { name: '条件をリセット' }).click();
  assert.equal(new URL(page.url()).pathname, '/', 'リセットでトップ一覧へ戻る');
  assert.equal(await visibleCards(), 37, 'リセット後に既定37件');

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
  assert.equal(await visibleCards(), 38, 'すべての状態で過去車両を含む38件');
  await page.goto(`${base}/compare/?ids=jp-honda-accord-2025-ehev-sensing360plus&ids=jp-subaru-levorg-layback-2023-limited-ex`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('input[name="ids"]:checked').count(), 2, '比較対象は2台');
  const compareText = await page.locator('[data-compare-result]').innerText();
  assert.match(compareText, /e:HEV Honda SENSING 360＋/);
  assert.match(compareText, /Limited EX/);
  assert.equal((await events()).filter((event) => event.event === 'compare_vehicles').length, 1, 'compare_vehiclesイベント');

  await page.goto(`${base}/cars/jp-honda-accord-2025-ehev-sensing360plus/`);
  assert.equal((await events()).filter((event) => event.event === 'view_vehicle').length, 1, 'view_vehicleイベント（同意後登録）');

  await page.goto(`${base}/cars/jp-tesla-model-3-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /Tesla[\s\S]*Model 3/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, '根拠URL・確認日は通常UIに出さない');
  await page.screenshot({ path: `${qaDir}/desktop-tesla-detail.png`, fullPage: false });

  await page.goto(`${base}/cars/jp-tesla-model-y-2026-premium/`);
  assert.match(await page.locator('main').innerText(), /Tesla[\s\S]*Model Y/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'Model Yでも内部根拠を通常UIに出さない');

  await page.goto(`${base}/compare/?ids=jp-tesla-model-3-2026-premium&ids=jp-tesla-model-y-2026-premium`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /Model 3[\s\S]*Model Y/);

  await page.goto(`${base}/cars/jp-volvo-ex30-my2027-plus-p5-electric/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 2027年モデル[\s\S]*Volvo[\s\S]*EX30[\s\S]*Plus P5 Electric/);
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
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|\"sources\"|volvocars\.com/, '比較ページHTMLへ内部時点・根拠URLを配信しない');

  await page.goto(`${base}/cars/jp-mini-countryman-u25-c-select/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 第3世代[\s\S]*MINI[\s\S]*Countryman[\s\S]*C SELECT/);
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-07|4,800,000|5,180,000|5,260,000|5,530,000|5,920,000|6,830,000|6,040,000|6,780,000|mini\.jp|sources|accessedAt/, 'MINI詳細に内部価格・根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|\"sources\"|MINI_COUNTRYMAN_EPL_2607|mini\.jp/, 'MINI詳細HTMLへ内部時点・根拠URLを配信しない');
  await page.goto(`${base}/compare/?ids=jp-mini-countryman-u25-c-select&ids=jp-mini-countryman-u25-se-all4`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /C SELECT[\s\S]*SE ALL4/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-07|4,800,000|6,780,000|mini\.jp|sources|accessedAt/, 'MINI比較に内部価格・根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|\"sources\"|MINI_COUNTRYMAN_EPL_2607|mini\.jp/, 'MINI比較HTMLへ内部時点・根拠URLを配信しない');

  await page.goto(`${base}/cars/jp-suzuki-e-vitara-2026-x-2wd/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Suzuki[\s\S]*e VITARA[\s\S]*X 2WD/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'e VITARA詳細に内部根拠を表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-01-16|suzuki\.co\.jp|sources|accessedAt/, 'e VITARA詳細に内部根拠URL・確認日を表示しない');

  await page.goto(`${base}/compare/?ids=jp-suzuki-e-vitara-2026-x-2wd&ids=jp-suzuki-e-vitara-2026-z-4wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /現行仕様[\s\S]*X 2WD[\s\S]*現行仕様[\s\S]*Z 4WD/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-01-16|suzuki\.co\.jp|sources|accessedAt/, 'e VITARA比較に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|\"sources\"|suzuki\.co\.jp/, 'e VITARA比較HTMLへ内部時点・根拠URLを配信しない');

  await page.goto(`${base}/cars/jp-renault-arkana-esprit-alpine-full-hybrid-e-tech/`);
  assert.match(await page.locator('main').innerText(), /JP \/ 現行仕様[\s\S]*Renault[\s\S]*ARKANA[\s\S]*esprit Alpine FULL HYBRID E-TECH/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'ARKANA詳細に内部根拠を表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2025-07|2025-09|renault\.jp|dcms\.renault|sources|accessedAt/, 'ARKANA詳細に内部根拠URL・確認日を表示しない');

  await page.goto(`${base}/compare/?ids=jp-renault-arkana-esprit-alpine-full-hybrid-e-tech&ids=jp-renault-arkana-techno-mild-hybrid`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /現行仕様[\s\S]*esprit Alpine FULL HYBRID E-TECH[\s\S]*現行仕様[\s\S]*techno MILD HYBRID/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2025-07|2025-09|renault\.jp|dcms\.renault|sources|accessedAt/, 'ARKANA比較に内部根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|\"sources\"|renault\.jp|dcms\.renault/, 'ARKANA比較HTMLへ内部時点・根拠URLを配信しない');

  await page.goto(`${base}/cars/jp-bmw-3-series-g20-sedan-318i-m-sport/`);
  assert.match(await page.locator('main').innerText(), /JP \/ G20[\s\S]*BMW[\s\S]*3シリーズ セダン[\s\S]*318i M Sport/);
  assert.equal(await page.getByRole('heading', { name: '根拠と更新日' }).count(), 0, 'BMW詳細に内部根拠を表示しない');
  assert.doesNotMatch(await page.locator('main').innerText(), /2026-07|6,880,000|bmw\.co\.jp|sources|accessedAt/, 'BMW詳細に内部価格・根拠URL・確認日を表示しない');

  await page.goto(`${base}/cars/jp-bmw-3-series-g21-touring-m340i-xdrive/`);
  assert.match(await page.locator('main').innerText(), /JP \/ G21[\s\S]*BMW[\s\S]*3シリーズ ツーリング[\s\S]*M340i xDrive/);

  await page.goto(`${base}/compare/?ids=jp-bmw-3-series-g20-sedan-318i-m-sport&ids=jp-bmw-3-series-g21-touring-m340i-xdrive`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.match(await page.locator('[data-compare-result]').innerText(), /G20[\s\S]*318i M Sport[\s\S]*G21[\s\S]*M340i xDrive/);
  assert.doesNotMatch(await page.locator('[data-compare-result]').innerText(), /2026-07|6,880,000|10,270,000|bmw\.co\.jp|sources|accessedAt/, 'BMW比較に内部価格・根拠URL・確認日を表示しない');
  assert.doesNotMatch(await page.content(), /catalogAsOf|salesUnitIntroducedAt|priceEffectiveAt|availabilityCheckedAt|lastReviewedAt|accessedAt|\"sources\"|bmw\.co\.jp/, 'BMW比較HTMLへ内部時点・根拠URLを配信しない');

  await page.goto(`${base}/privacy/`);
  page.on('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: '計測設定を取り消す' }).click({ noWaitAfter: true });
  await page.waitForTimeout(500);
  await page.goto(`${base}/privacy/`);
  assert.equal(await page.evaluate(() => localStorage.getItem('jidouunten-analytics-consent')), null, '撤回後は再選択可能');
  assert.equal(await page.locator('[data-consent]:visible').count(), 1, '撤回後に同意バナー再表示');
  await page.getByRole('button', { name: '拒否する' }).click({ noWaitAfter: true });
  assert.equal(await page.evaluate(() => localStorage.getItem('jidouunten-analytics-consent')), 'denied', '拒否状態を保存');
  await page.goto(`${base}/`);
  const beforeDenied = await events();
  await page.locator('select[name="level"]').selectOption('2');
  assert.equal((await events()).length, beforeDenied.length, '拒否後のイベント送信なし');
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0, '拒否後もGTMなし');
  console.log('E2E PASS: 1/1 scenario');
} finally {
  await browser.close();
}
