// @ts-nocheck
// Focused browser contract for JID-018. Run against a built preview server.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwrightCandidates = [process.env.PLAYWRIGHT_PATH, 'playwright', '/Users/hajimekurita/.cache/codex-playwright/node_modules/playwright'].filter(Boolean);
let playwright;
for (const candidate of playwrightCandidates) { try { playwright = require(candidate); break; } catch { /* try next */ } }
if (!playwright) throw new Error('Playwright is not installed');

const base = process.env.BASE_URL || 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await playwright.chromium.launch({ headless: true, ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}) });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const visibleCards = () => page.locator('[data-vehicle-shell]:not([hidden])').count();
const events = () => page.evaluate(() => window.dataLayer || []);

try {
  await page.goto(`${base}/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert.equal(await page.locator('[data-favorites-link]').count(), 1, 'ヘッダーにお気に入り導線を表示');
  assert.equal(await page.locator('[data-favorites-count]').innerText(), '0', '初期お気に入り件数は0');
  const firstToggle = page.locator('[data-favorite-toggle]').first();
  const firstId = await firstToggle.getAttribute('data-vehicle-id');
  const before = await events();
  await firstToggle.click();
  assert.equal(await page.locator('[data-favorites-count]').innerText(), '1', '一覧から追加すると件数を更新');
  assert.equal(await firstToggle.getAttribute('aria-pressed'), 'true', '追加済み状態をボタンで通知');
  assert.match(await firstToggle.innerText(), /お気に入り済み/, '追加済みラベルを表示');
  assert.equal(await page.locator('[data-favorites-link]').getAttribute('href'), '/?favorites=1', '件数があるとお気に入り一覧へリンク');
  const addEvents = (await events()).filter((event) => event.event === 'favorites_add');
  assert.equal(addEvents.length - before.filter((event) => event.event === 'favorites_add').length, 1, 'favorites_addを1回計測');
  const addPayload = Object.fromEntries(Object.entries(addEvents.at(-1)).filter(([key]) => key !== 'gtm.uniqueEventId'));
  assert.deepEqual(Object.keys(addPayload).sort(), ['event', 'favorite_count'], 'お気に入り計測は台数だけ');
  assert.equal(Object.prototype.hasOwnProperty.call(addEvents.at(-1), 'vehicle_id'), false, 'お気に入り計測に車両IDを送らない');

  await page.goto(`${base}/?favorites=1`);
  assert.equal(await visibleCards(), 1, 'お気に入り一覧は保存した1台だけ表示');
  assert.match(await page.locator('[data-selected-label]').innerText(), /お気に入り/, '選択中ラベルにお気に入りを表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden]) [data-vehicle-id]').getAttribute('data-vehicle-id'), firstId, '保存した車両を復元');
  const openEventsBefore = (await events()).filter((event) => event.event === 'favorites_open').length;
  await page.evaluate(() => { const link = document.querySelector('[data-favorites-link]'); link.addEventListener('click', (event) => event.preventDefault(), { once: true }); link.click(); });
  const openEvents = (await events()).filter((event) => event.event === 'favorites_open');
  assert.equal(openEvents.length - openEventsBefore, 1, 'お気に入りを開く操作を1回計測');
  const openPayload = Object.fromEntries(Object.entries(openEvents.at(-1)).filter(([key]) => key !== 'gtm.uniqueEventId'));
  assert.deepEqual(Object.keys(openPayload).sort(), ['event', 'favorite_count'], 'お気に入り表示計測は台数だけ');

  await page.goto(`${base}/cars/${firstId}/`);
  const detailToggle = page.locator('[data-favorite-toggle]');
  assert.equal(await detailToggle.getAttribute('aria-pressed'), 'true', '詳細ページでも保存状態を復元');
  await detailToggle.click();
  assert.equal(await page.locator('[data-favorites-count]').innerText(), '0', '詳細ページから解除すると件数を更新');
  assert.equal(await detailToggle.getAttribute('aria-pressed'), 'false', '解除状態をボタンで通知');
  await page.goto(`${base}/?favorites=1`);
  assert.equal(await visibleCards(), 0, '解除後のお気に入り一覧は空になる');
  assert.match(await page.locator('[data-empty-title]').innerText(), /保存したお気に入りはありません/, '空のお気に入りに理由を表示');

  await page.setViewportSize({ width: 390, height: 900 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '390pxで横はみ出しなし');
  await page.goto(`${base}/cars/?favorites=1`);
  assert.equal(await page.locator('[data-result-count]').innerText(), '0件', '車両一覧URLでもお気に入り条件を維持');
  console.log('PASS: JID-018 focused browser checks 18/18');
} finally {
  await browser.close();
}
