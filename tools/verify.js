// Checks every level without a browser.
//  1. The level can be solved.
//  2. The shortest solution (the "par") matches the number saved in index.html (PARS_PRE).
//  3. Levels with a clock leave room: the limit is bigger than the par.
// Run:  npm run verify
const { loadGame } = require('./lib');

const game = loadGame();
const { L, solve, PARS_PRE, WORLDS } = game;
let problems = 0;
const started = Date.now();

if (PARS_PRE.length !== L.length) {
  console.error(`PARS_PRE has ${PARS_PRE.length} entries but there are ${L.length} levels.`);
  problems++;
}
if (WORLDS[0].s !== 0) { console.error('The first world must start at level 1.'); problems++; }
WORLDS.forEach((w, i) => { if (i && w.s <= WORLDS[i - 1].s) { console.error(`World ${i + 1} starts before world ${i}.`); problems++; } });

for (let i = 0; i < L.length; i++) {
  const lvl = L[i];
  const par = solve(lvl, 80);
  if (par == null) { console.error(`Level ${i + 1} (${lvl.name}) cannot be solved.`); problems++; continue; }
  if (par !== PARS_PRE[i]) { console.error(`Level ${i + 1} (${lvl.name}): solver says par ${par}, index.html says ${PARS_PRE[i]}.`); problems++; }
  if (lvl.limit && lvl.limit <= par) { console.error(`Level ${i + 1} (${lvl.name}): clock ${lvl.limit} is not bigger than par ${par}.`); problems++; }
  if (!lvl.name || !lvl.goal || !lvl.hint) { console.error(`Level ${i + 1} is missing a name, goal or hint.`); problems++; }
  if ((i + 1) % 25 === 0) console.log(`  checked ${i + 1} / ${L.length}`);
}

const secs = ((Date.now() - started) / 1000).toFixed(1);
if (problems) { console.error(`\n${problems} problem(s) found.`); process.exit(1); }
console.log(`\nAll ${L.length} levels are solvable and every par matches (${secs}s). Total par: ${PARS_PRE.reduce((a, b) => a + b, 0)}.`);
