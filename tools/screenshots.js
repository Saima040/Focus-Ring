// Takes the pictures used in the README (docs/img). Needs Playwright.
// Run:  npm run shots
const fs = require('fs');
const path = require('path');
const { INDEX } = require('./lib');
const launch = require('./browser');
const out = path.join(__dirname, '..', 'docs', 'img');
fs.mkdirSync(out, { recursive: true });

async function open(browser, w, h, scheme, seed) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
  if (seed) await ctx.addInitScript((n) => { try { if (!localStorage.getItem('seeded')) { localStorage.setItem('seeded', '1'); localStorage.setItem('focusring-stars', JSON.stringify(Array(n).fill(3))); } } catch (e) {} }, seed);
  const page = await ctx.newPage();
  await page.goto('file://' + INDEX);
  await page.waitForTimeout(500);
  return { ctx, page };
}

(async () => {
  const browser = await launch();
  for (const scheme of ['light', 'dark']) {
    // laptop
    let { ctx, page } = await open(browser, 1280, 800, scheme, 30);
    await page.screenshot({ path: path.join(out, `worlds-${scheme}.png`) });
    await page.evaluate(() => showLevels(5));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(out, `levels-${scheme}.png`) });
    await page.evaluate(() => startLevel(15));            // Help desk style page
    await page.waitForTimeout(150);
    for (const k of ['Tab', 'Tab', 'Tab']) await page.keyboard.press(k);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(out, `play-${scheme}.png`), fullPage: true });
    await ctx.close();
    // phone
    ({ ctx, page } = await open(browser, 390, 844, scheme, 30));
    await page.evaluate(() => startLevel(120));
    await page.waitForTimeout(150);
    for (const k of ['Tab', 'Tab']) await page.keyboard.press(k);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(out, `phone-play-${scheme}.png`), fullPage: true });
    await ctx.close();
  }
  // social preview card (1280x640)
  const { ctx, page } = await open(browser, 1280, 640, 'light', 0);
  await page.evaluate(() => startLevel(13));
  for (const k of ['Tab', 'Tab']) await page.keyboard.press(k);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, 'social.png') });
  await ctx.close();
  await browser.close();
  console.log('Pictures saved in docs/img');
})();
