// @ts-nocheck
// Focused browser contract for JID-028. Run against a built preview server.
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
let checks = 0;
const check = (condition, message) => { checks += 1; assert.ok(condition, message); };

try {
  const pagePaths = ['/', '/cars/', '/levels/', '/compare/', '/privacy/', '/about/'];
  for (const path of pagePaths) {
    const response = await page.goto(`${base}${path}`);
    check(response?.status() === 200, `${path}: HTTP 200`);
    check(await page.locator('a[href="/about/"]').count() === 1, `${path}: footerから運営者情報へ到達`);
    check((await page.locator('body').innerText()).includes('自動運転.jp'), `${path}: 表示ブランドが自動運転.jp`);
  }

  await page.goto(`${base}/about/`);
  check(await page.getByRole('heading', { name: '誰が、どう調べているか。' }).count() === 1, '運営者ページの見出し');
  check(await page.getByText('株式会社1st Class（1st Class）').count() === 1, '運営主体を表示');
  check(await page.locator('a[href="https://github.com/hikarine3/jidouunten/issues"]').count() === 1, 'GitHub Issuesへ到達');
  check(await page.locator('link[rel="canonical"][href="https://jidouunten.jp/about/"]').count() === 1, 'canonicalを固定');
  const visible = await page.locator('body').innerText();
  for (const forbidden of ['GA4', 'GSC', 'Bing', 'KPI', 'market demand']) check(!visible.includes(forbidden), `内部計測情報を非表示: ${forbidden}`);
  await page.setViewportSize({ width: 390, height: 844 });
  check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '390pxで横はみ出しなし');
  console.log(`PASS: JID-028 focused browser checks ${checks}/${checks}`);
} finally {
  await browser.close();
}
