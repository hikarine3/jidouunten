// @ts-nocheck
// Focused browser contract for JID-003. Run against a built preview server.
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
  try { playwright = require(candidate); break; } catch { /* try next locally installed copy */ }
}
if (!playwright) throw new Error('Playwright is not installed. Set PLAYWRIGHT_PATH to an installed local package.');

const base = process.env.BASE_URL || 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await playwright.chromium.launch({ headless: true, ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}) });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const visibleCards = () => page.locator('[data-vehicle-shell]:not([hidden])').count();
const events = () => page.evaluate(() => window.dataLayer || []);

try {
  await page.goto(`${base}/`);
  const statusSelect = page.locator('select[name="factStatus"]');
  await statusSelect.waitFor({ state: 'visible' });
  assert.deepEqual(await statusSelect.locator('option').evaluateAll((options) => options.map((option) => option.value)), ['', 'verified', 'attention'], '情報状態の公開選択肢を固定');
  const defaultCount = await visibleCards();
  assert.ok(defaultCount > 0, '既定の現行候補を表示');
  const before = await events();
  await statusSelect.selectOption('attention');
  await page.getByRole('button', { name: 'この条件で探す' }).click();
  await page.waitForURL((url) => url.searchParams.get('factStatus') === 'attention');
  const attentionCount = await visibleCards();
  assert.ok(attentionCount > 0, '要確認・競合の候補を表示');
  assert.equal(await page.locator('[data-vehicle-shell]:not([hidden])[data-fact-status="verified"]').count(), 0, '要確認・競合フィルターに確認済みを混ぜない');
  assert.ok(await page.locator('[data-vehicle-shell]:not([hidden])').filter({ hasText: 'BYD ATTO 3' }).count() > 0, '情報競合のATTO 3へ到達');
  assert.match(await page.locator('[data-selected-label]').innerText(), /要確認・競合/, '現在の情報状態を結果見出しへ反映');
  const after = await events();
  const filterEvents = after.filter((event) => event.event === 'filter_results');
  assert.equal(filterEvents.length - before.filter((event) => event.event === 'filter_results').length, 1, '情報状態の送信でfilter_resultsを1回');
  assert.match(filterEvents.at(-1)?.filter_value || '', /attention/, 'filter_resultsに固定fact_status値を含める');

  await page.goBack();
  await page.waitForURL((url) => !url.searchParams.has('factStatus'));
  assert.equal(await visibleCards(), defaultCount, '戻るで既定候補へ復帰');
  await page.goto(`${base}/?factStatus=verified`);
  assert.equal(await visibleCards(), defaultCount - attentionCount, '確認済みフィルターは要確認・競合を除外');
  await page.setViewportSize({ width: 390, height: 900 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '390pxで情報状態フィルターの横はみ出しなし');
  assert.equal(await page.locator('select[name="factStatus"]').inputValue(), 'verified', '情報状態条件をURLから復元');
  console.log('PASS: JID-003 focused browser checks 12/12');
} finally {
  await browser.close();
}
