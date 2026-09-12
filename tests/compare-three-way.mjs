// @ts-nocheck
// Focused browser contract for JID-024. Run against a built preview server.
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
  try { playwright = require(candidate); break; } catch { /* try next */ }
}
if (!playwright) throw new Error('Playwright is not installed');

const base = process.env.BASE_URL || 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await playwright.chromium.launch({ headless: true, ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}) });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const events = () => page.evaluate(() => window.dataLayer || []);

try {
  await page.goto(`${base}/compare/?ids=jp-tesla-model-3-2026-premium&ids=jp-tesla-model-y-2026-premium&ids=jp-toyota-crown-crossover-2026-rs-limited-matte-metal-4wd`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.compare-table thead th').count(), 4, '3台比較は4列');
  assert.equal(await page.locator('[data-compare-result] .vehicle-card').count(), 3, '3台の候補カード');
  assert.equal(await page.locator('[data-compare-select]').isHidden(), true, '結果表示後は選択フォームを畳む');
  assert.equal(await page.locator('[data-compare-change-wrap]').isVisible(), true, '比較対象の変更へ戻れる');
  assert.equal(await page.locator('.compare-table .compare-row-same:visible').count(), 0, '同値行は初期状態で畳む');
  const completeThree = (await events()).filter((event) => event.event === 'compare_complete').at(-1);
  assert.deepEqual({ vehicle_count: completeThree?.vehicle_count, definition: completeThree?.completion_definition }, { vehicle_count: 3, definition: 'comparison_result_rendered' }, '3台比較完了イベント');

  const sameRows = await page.locator('.compare-table .compare-row-same').count();
  assert.ok(sameRows > 0, '同値行を識別');
  await page.getByRole('button', { name: 'すべての項目を表示' }).click();
  assert.equal(await page.locator('.compare-table .compare-row-same:visible').count(), sameRows, '同値行を1操作で再表示');

  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator('[data-compare-result]').isVisible(), true, '390pxで結果を表示');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'ページ全体の横はみ出しなし');

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}/compare/?ids=jp-tesla-model-3-2026-premium&ids=jp-tesla-model-y-2026-premium`);
  await page.locator('[data-compare-result]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.compare-table thead th').count(), 3, '既存2台URLは3列');
  assert.equal(await page.locator('input[name="ids"]:checked').count(), 2, '既存2台URLの選択を維持');
  assert.equal(await page.locator('input[name="ids"]:not(:checked):not(:disabled)').count() > 0, true, '2台選択時は3台目を追加できる');
  assert.equal(await page.locator('.compare-table .compare-row-same:visible').count(), 0, '2台でも同値行を初期非表示');
  console.log('PASS: JID-024 focused browser checks 10/10');
} finally {
  await browser.close();
}
