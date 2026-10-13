// Plays every level in a real browser. For each level it asks the solver for the shortest route,
// presses those keys on a real keyboard (Tab, Shift+Tab, Enter, Space, arrows, Esc) and checks
// that the game says "won", counts exactly par presses and awards 3 stars.
// Run:  npm run e2e        (about a minute for all 175 levels)
const path = require('path');
const { loadGame, PLAYWRIGHT_KEYS, INDEX } = require('./lib');
const launch = require('./browser');

(async () => {
  const { L, solve, PARS_PRE } = loadGame();
  const browser = await launch();
  const page = await (await browser.newContext({ viewport: { width: 1000, height: 900 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + INDEX);
  await page.waitForTimeout(300);

  const bad = [];
  for (let i = 0; i < L.length; i++) {
    const route = solve(L[i], 80, true).path;
    await page.evaluate((n) => startLevel(n), i);
    for (const k of route) await page.keyboard.press(PLAYWRIGHT_KEYS[k]);
    const r = await page.evaluate(() => ({ mode, presses, star: stars[li], li }));
    if (r.mode !== 'won' || r.presses !== PARS_PRE[i] || r.star !== 3 || r.li !== i) bad.push({ level: i + 1, name: L[i].name, got: r });
    if ((i + 1) % 25 === 0) console.log(`  played ${i + 1} / ${L.length}`);
  }
  await browser.close();

  if (errors.length) console.error('Page errors:', errors);
  if (bad.length || errors.length) { console.error('Failed levels:', JSON.stringify(bad, null, 2)); process.exit(1); }
  console.log(`\nAll ${L.length} levels were won at par with real key presses.`);
})();
