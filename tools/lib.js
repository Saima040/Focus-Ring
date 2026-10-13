// Shared helpers for the tools in this folder.
// The whole game lives in index.html. The pure game rules (the "engine") sit between the
// markers `// <engine>` and `// </engine>`, so we can run them in plain Node without a browser.
const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'index.html');

function readIndex() {
  return fs.readFileSync(INDEX, 'utf8');
}

// Returns { L, solve, step, newGame, stops, PARS_PRE, WORLDS }
function loadGame(html) {
  html = html || readIndex();
  const a = html.indexOf('// <engine>');
  const b = html.indexOf('// </engine>');
  if (a < 0 || b < 0) throw new Error('Could not find the engine markers in index.html');
  const engine = html.slice(a, b);
  const pre = /const PARS_PRE = (\[[^\]]*\]);/.exec(html);
  const worlds = /const WORLDS = (\[[\s\S]*?\n\]);/.exec(html);
  if (!pre || !worlds) throw new Error('Could not find PARS_PRE or WORLDS in index.html');
  const game = new Function(engine + '\nreturn { L, solve, step, newGame, stops };')();
  game.PARS_PRE = JSON.parse(pre[1]);
  game.WORLDS = new Function('return ' + worlds[1])();
  return game;
}

const KEY_NAMES = { T: 'Tab', S: 'Shift+Tab', E: 'Enter', P: 'Space', L: 'Left', R: 'Right', X: 'Esc' };
const KEY_SHORT = { T: 'Tab', S: '⇧Tab', E: 'Enter', P: 'Space', L: '←', R: '→', X: 'Esc' };
// How each engine key is sent to a real browser through Playwright.
const PLAYWRIGHT_KEYS = { T: 'Tab', S: 'Shift+Tab', E: 'Enter', P: ' ', L: 'ArrowLeft', R: 'ArrowRight', X: 'Escape' };

module.exports = { INDEX, readIndex, loadGame, KEY_NAMES, KEY_SHORT, PLAYWRIGHT_KEYS };
