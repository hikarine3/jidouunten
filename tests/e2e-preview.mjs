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
const qaDir = '.cache/jidouunten-qa';
fs.mkdirSync(qaDir, { recursive: true });
const analyticsRequests = [];
page.on('request', (request) => { if (/googletagmanager|google-analytics|analytics\.google/i.test(request.url())) analyticsRequests.push(request.url()); });
const visibleCards = () => page.locator('[data-vehicle-shell]:not([hidden])').count();
const events = () => page.evaluate(() => window.dataLayer || []);

try {
  await page.goto(`${base}/cars/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert.equal(await visibleCards(), 8, '既定カタログは現行確認8件');
  assert.equal(await page.locator('[data-vehicle-shell][data-availability="unavailable"]:visible').count(), 0, '過去車両は既定非表示');
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0, '同意前はGTMなし');
  assert.deepEqual(await events(), [], '同意前の初期表示ではイベントなし');
  assert.equal(analyticsRequests.length, 0, '同意前のAnalytics通信なし');
  await page.screenshot({ path: `${qaDir}/desktop-cars.png`, fullPage: false });
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto(`${base}/`);
  await mobilePage.screenshot({ path: `${qaDir}/mobile-home.png`, fullPage: false });
  await mobilePage.close();

  await page.goto(`${base}/cars/?level=2&road=${encodeURIComponent('高速道路')}&handsOff=allowed_in_conditions`);
  assert.equal(await visibleCards(), 7, 'Level 2・高速・ハンズオフ条件は7件');
  assert.equal(await page.locator('[data-level2-notice]:visible').count(), 1, 'Level 2注意表示');
  assert.equal(new URL(page.url()).searchParams.get('level'), '2', '深いリンクのlevel復元');
  await page.getByRole('button', { name: '同意する' }).click({ noWaitAfter: true });
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 1, '同意後にGTM読み込み');
  await page.waitForTimeout(300);
  assert.ok(analyticsRequests.some((url) => url.includes('googletagmanager')), '同意後のGTM通信');
  if (process.env.EXPECT_GA_COLLECT === '1') assert.ok(analyticsRequests.some((url) => /collect|google-analytics/i.test(url)), 'GA collect通信');

  await page.locator('select[name="level"]').selectOption('3');
  await page.locator('select[name="availability"]').selectOption('all');
  await page.getByRole('button', { name: 'この条件で探す' }).click({ noWaitAfter: true });
  await page.waitForTimeout(100);
  assert.equal(new URL(page.url()).searchParams.get('level'), '3', 'フォーム操作でURL更新');
  assert.equal(await page.locator('[data-result-count]').innerText(), '1件', '絞り込み後件数');
  assert.equal((await events()).filter((event) => event.event === 'filter_results').length, 1, 'filter_resultsはフォーム操作時のみ1回');
  await page.goBack();
  assert.equal(new URL(page.url()).searchParams.get('level'), '2', '戻るで前の絞り込みを復元');
  assert.equal(await visibleCards(), 7, '戻る後の結果件数');

  await page.goto(`${base}/cars/?availability=all`);
  assert.equal(await visibleCards(), 9, 'すべての状態で過去車両を含む9件');
  await page.goto(`${base}/compare/?ids=jp-honda-accord-2025-ehev-sensing360plus&ids=jp-subaru-levorg-layback-2023-limited-ex`);
  assert.equal(await page.locator('input[name="ids"]:checked').count(), 2, '比較対象は2台');
  const compareText = await page.locator('[data-compare-result]').innerText();
  assert.match(compareText, /e:HEV Honda SENSING 360＋/);
  assert.match(compareText, /Limited EX/);
  assert.equal((await events()).filter((event) => event.event === 'compare_vehicles').length, 1, 'compare_vehiclesイベント');

  await page.goto(`${base}/`);
  const levelLink = page.getByRole('link', { name: /2 運転支援/ });
  await levelLink.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await levelLink.click();
  assert.equal((await events()).filter((event) => event.event === 'select_level').length, 1, 'select_levelイベント');
  await page.goto(`${base}/cars/jp-honda-accord-2025-ehev-sensing360plus/`);
  assert.equal((await events()).filter((event) => event.event === 'view_vehicle').length, 1, 'view_vehicleイベント（同意後登録）');
  const manufacturerLink = page.locator('[data-source-type="manufacturer"]').first();
  await manufacturerLink.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await manufacturerLink.click();
  assert.equal((await events()).filter((event) => event.event === 'outbound_manufacturer').length, 1, 'outbound_manufacturerイベント');

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
  await page.getByRole('link', { name: /2 運転支援/ }).click();
  assert.equal((await events()).length, beforeDenied.length, '拒否後のイベント送信なし');
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0, '拒否後もGTMなし');
  console.log('E2E PASS: 9 checks');
} finally {
  await browser.close();
}
