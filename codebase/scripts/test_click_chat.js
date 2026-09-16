const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  });
  
  await page.goto('https://aiia-notebook.vercel.app/');
  await page.waitForTimeout(2000);

  // Click Nút Hỏi K.AI ở giữa Bottom Nav
  const askAiBtn = page.locator('button:has-text("Hỏi K.AI")');
  if (await askAiBtn.count() > 0) {
    await askAiBtn.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\8a799cc8-e2c3-4a77-8d0d-a20cf79477ab\\mobile_chat_modal.png' });
    console.log('Saved screenshot mobile_chat_modal.png');
  } else {
    console.log('Ask AI button not found');
  }

  await browser.close();
})();
