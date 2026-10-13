// Opens Chromium through Playwright. Set CHROMIUM_PATH if you want to use an existing browser.
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) {
  console.error('Playwright is not installed. Run:  npm install  and then  npx playwright install chromium');
  process.exit(1);
}
module.exports = function launch() {
  const opts = { args: ['--no-sandbox'] };
  if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
  return chromium.launch(opts);
};
