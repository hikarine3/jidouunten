// @ts-nocheck
// Focused browser contract for JID-010. Run against a built preview server.
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
const shortcut = (level) => page.locator(`[data-level-shortcut="${level}"]`);
const visibleCards = () => page.locator('[data-vehicle-shell]:not([hidden])').count();
const events = () => page.evaluate(() => window.dataLayer || []);

try {
  await page.goto(`${base}/`);
  await shortcut(1).waitFor({ state: 'visible' });
  assert.equal(await page.locator('[data-level-shortcut]').count(), 5, 'Level 1〜5のショートカットを表示');

  for (const level of [1, 2]) {
    assert.equal(await shortcut(level).getAttribute('data-level-kind'), '運転支援', `Level ${level}を運転支援として表示`);
    assert.equal(await shortcut(level).getAttribute('data-level-status'), '現行掲載', `Level ${level}を現行掲載として表示`);
    assert.equal(await shortcut(level).isDisabled(), false, `Level ${level}は選択可能`);
  }
  assert.equal(await shortcut(3).getAttribute('data-level-kind'), '自動運転', 'Level 3を自動運転として表示');
  assert.equal(await shortcut(3).getAttribute('data-level-status'), '過去例のみ', 'Level 3は過去例のみと表示');
  assert.match(await shortcut(3).innerText(), /過去例 1件/, 'Level 3の過去例件数を表示');
  assert.equal(await shortcut(3).isDisabled(), false, 'Level 3の過去例へ移動可能');
  for (const level of [4, 5]) {
    assert.equal(await shortcut(level).getAttribute('data-level-kind'), '自動運転', `Level ${level}を自動運転として表示`);
    assert.equal(await shortcut(level).getAttribute('data-level-status'), '現在掲載なし', `Level ${level}を現在掲載なしとして表示`);
    assert.match(await shortcut(level).innerText(), /掲載なし/, `Level ${level}の未掲載状態を表示`);
    assert.equal(await shortcut(level).isDisabled(), true, `Level ${level}は候補がなく選択不可`);
  }
  assert.match(await shortcut(4).getAttribute('aria-label'), /市場に存在しない/, '未掲載を市場不存在と誤認させない説明を読み上げ');
  assert.match(await page.locator('.level-deck-head').innerText(), /運転支援[\s\S]*Level 1–2[\s\S]*自動運転[\s\S]*Level 3–5/, 'デスクトップに分類凡例を表示');

  const beforeEvents = await events();
  await shortcut(3).click();
  assert.equal(new URL(page.url()).searchParams.get('level'), '3', 'Level 3クリックをURLへ保存');
  assert.equal(new URL(page.url()).searchParams.get('availability'), 'all', 'Level 3は過去例を含む状態を明示');
  assert.equal(await visibleCards(), 1, 'Level 3過去例を1件表示');
  assert.equal(await shortcut(3).getAttribute('aria-pressed'), 'true', '選択状態を通知');
  const afterEvents = await events();
  assert.equal(afterEvents.filter((event) => event.event === 'select_level').length - beforeEvents.filter((event) => event.event === 'select_level').length, 0, 'ショートカット操作でselect_levelを重複送信しない');
  assert.equal(afterEvents.filter((event) => event.event === 'filter_results').length - beforeEvents.filter((event) => event.event === 'filter_results').length, 1, 'ショートカット操作でfilter_resultsを1回送信');

  await page.locator('[data-reset-shortcut]').click();
  assert.equal(new URL(page.url()).search, '', 'リセットでURL条件を消去');
  assert.equal(await visibleCards(), 475, 'リセットで現行カタログへ復帰');

  for (const width of [390, 520, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${width}pxで横はみ出しなし`);
    for (const level of [1, 3, 4, 5]) {
      assert.equal(await shortcut(level).isVisible(), true, `${width}pxでもLevel ${level}の分類を表示`);
      assert.ok((await shortcut(level).innerText()).includes(level <= 2 ? '運転支援' : '自動運転'), `${width}pxでもLevel ${level}の分類テキストを表示`);
    }
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${base}/`);
  await shortcut(2).focus();
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).searchParams.get('level'), '2', 'キーボードでLevel 2へ遷移');
  assert.equal(await shortcut(2).getAttribute('aria-pressed'), 'true', 'キーボード選択状態を通知');
  console.log('PASS: JID-010 focused browser checks 25/25');
} finally {
  await browser.close();
}
