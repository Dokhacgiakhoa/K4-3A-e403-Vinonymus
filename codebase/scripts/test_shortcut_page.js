const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true,
  });

  await page.goto('https://aiia-notebook.vercel.app/?tab=shortcut');
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\8a799cc8-e2c3-4a77-8d0d-a20cf79477ab\\mobile_shortcut_real.png',
  });

  await browser.close();
})();
