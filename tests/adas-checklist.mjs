// @ts-nocheck
// Focused browser contract for JID-047. Run against a built preview server.
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
const events = () => page.evaluate(() => window.dataLayer || []);

try {
  await page.goto(`${base}/cars/jp-nissan-ariya-2026-b9/`);
  const checklist = page.locator('[data-adas-checklist]');
  assert.equal(await checklist.count(), 1, '試乗前チェックリストを表示');
  assert.equal(await checklist.locator('[data-checklist-item]').count(), 5, '確認項目を5件表示');
  assert.match(await checklist.innerText(), /道路/);
  assert.match(await checklist.innerText(), /速度/);
  assert.match(await checklist.innerText(), /ハンドル保持/);
  assert.match(await checklist.innerText(), /安全性や操作の保証ではありません/);
  const before = await events();
  for (const item of await checklist.locator('[data-checklist-item]').all()) await item.check();
  assert.equal(await checklist.locator('[data-checklist-progress]').innerText(), '5 / 5 確認', '全項目の進捗を表示');
  assert.equal(await checklist.locator('[data-checklist-complete]').isVisible(), true, '確認完了メッセージを表示');
  const after = await events();
  assert.equal(after.filter((event) => event.event === 'adas_checklist_open').length - before.filter((event) => event.event === 'adas_checklist_open').length, 1, 'adas_checklist_openを1回計測');
  assert.equal(after.filter((event) => event.event === 'adas_checklist_complete').length - before.filter((event) => event.event === 'adas_checklist_complete').length, 1, 'adas_checklist_completeを1回計測');
  assert.equal(await checklist.locator('[data-checklist-action][data-placement="vehicle_detail_checklist"]').count(), 1, 'チェック完了後の公式試乗導線を表示');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '390pxで横はみ出しなし');
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '1280pxで横はみ出しなし');
  console.log('PASS: JID-047 focused browser checks 12/12');
} finally {
  await browser.close();
}
