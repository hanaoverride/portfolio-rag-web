const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const evidenceDir = '/home/hana/문서/작업물/portfolio/.sisyphus/evidence';
fs.mkdirSync(evidenceDir, { recursive: true });

const urls = [
  { url: 'http://localhost:3000/', name: 'home' },
  { url: 'http://localhost:3000/category/web-dev', name: 'category-web-dev' },
  { url: 'http://localhost:3000/category/typescript', name: 'category-typescript' },
  { url: 'http://localhost:3000/category/programming', name: 'category-programming' },
  { url: 'http://localhost:3000/search', name: 'search' },
  { url: 'http://localhost:3000/search?q=test', name: 'search-query' },
  { url: 'http://localhost:3000/bookmark', name: 'bookmark' },
  { url: 'http://localhost:3000/profile', name: 'profile' },
  { url: 'http://localhost:3000/nonexistent-path', name: 'nonexistent-path' }
];

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/hana/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome'
  });
  const results = [];

  for (const { url, name } of urls) {
    let page;
    try {
      page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      const headerCount = await page.evaluate(() => document.querySelectorAll('header').length);
      const footerCount = await page.evaluate(() => document.querySelectorAll('footer').length);

      const passed = headerCount === 1 && footerCount === 1;
      results.push({ name, url, headerCount, footerCount, passed });

      const screenshotPath = path.join(evidenceDir, `fix-double-layout-task4-${name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}: headers=${headerCount}, footers=${footerCount} -> ${screenshotPath}`);
    } catch (err) {
      results.push({ name, url, headerCount: null, footerCount: null, passed: false, error: err.message });
      console.log(`[ERROR] ${name}: ${err.message}`);
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }

  await browser.close();

  console.log('\n========== SUMMARY ==========');
  console.log(`Total: ${results.length} | Passed: ${results.filter(r => r.passed).length} | Failed: ${results.filter(r => !r.passed).length}`);
  console.log('');
  for (const r of results) {
    const status = r.passed ? 'PASS' : (r.error ? 'ERROR' : 'FAIL');
    console.log(`${status.padEnd(6)} | ${r.name.padEnd(20)} | headers=${r.headerCount ?? 'N/A'}, footers=${r.footerCount ?? 'N/A'} | ${r.url}`);
  }
  console.log('=============================');

  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
})();
