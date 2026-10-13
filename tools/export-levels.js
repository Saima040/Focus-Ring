// Writes docs/LEVELS.md (every level, grouped by world, with par, clock and a spoiler-hidden solution)
// and docs/levels.csv (the same data for spreadsheets).
// Run:  npm run levels
const fs = require('fs');
const path = require('path');
const { loadGame, KEY_SHORT } = require('./lib');

const { L, solve, WORLDS } = loadGame();
const worldOf = (i) => { let w = 0; WORLDS.forEach((W, j) => { if (i >= W.s) w = j; }); return w; };

function twists(lvl) {
  const t = [];
  let rev = false; try { rev = !!(lvl.rev && lvl.rev({})); } catch (e) {}
  if (rev) t.push('mirrored Tab');
  if (lvl.dead) t.push('broken ' + lvl.dead.map((k) => ({ T: 'Tab', S: 'Shift+Tab', E: 'Enter', P: 'Space' }[k] || k)).join(' and '));
  if (lvl.drift) t.push('focus drifts every ' + lvl.drift);
  if (lvl.els && lvl.els.pa && lvl.els.pb) t.push('popups');
  if (lvl.els && lvl.els.hj) t.push('chat thief');
  if (lvl.limit) t.push('clock: ' + lvl.limit);
  return t;
}
const esc = (s) => String(s).replace(/\|/g, '\\|');
const csv = (s) => '"' + String(s).replace(/"/g, '""') + '"';

const rows = L.map((lvl, i) => {
  const r = solve(lvl, 80, true);
  return { n: i + 1, world: worldOf(i) + 1, name: lvl.name, url: lvl.url, par: r.d, limit: lvl.limit || '', goal: lvl.goal, hint: lvl.hint, trick: lvl.trick || '', twists: twists(lvl), keys: r.path.split('') };
});

let md = '# Every level, listed\n\n';
md += `All **${L.length} levels** in **${WORLDS.length} worlds**, in play order. *Par* is the fewest key presses that can win the level, found by a computer search, so three stars always means a perfect route. *Clock* is the number of key presses you get before the page closes (a dash means no clock). Solutions are hidden behind a click so you can try first.\n\n`;
md += '**Key shorthand in the solutions:** `Tab` Tab, `⇧Tab` Shift+Tab, `Enter`, `Space`, `←` and `→` the arrow keys, `Esc`.\n\n';
md += '| World | Name | Levels | Par total |\n|---:|---|---|---:|\n';
WORLDS.forEach((W, w) => {
  const mine = rows.filter((r) => r.world === w + 1);
  md += `| ${w + 1} | [${W.n}](#world-${w + 1}-${W.n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}) | ${mine[0].n}-${mine[mine.length - 1].n} | ${mine.reduce((a, r) => a + r.par, 0)} |\n`;
});
md += `\nTotal par across the whole game: **${rows.reduce((a, r) => a + r.par, 0)}** key presses.\n`;

WORLDS.forEach((W, w) => {
  const mine = rows.filter((r) => r.world === w + 1);
  md += `\n## World ${w + 1}: ${W.n}\n\n*${W.t}*\n\n`;
  md += '| # | Level | Par | Clock | Goal | Twists |\n|---:|---|---:|---:|---|---|\n';
  mine.forEach((r) => { md += `| ${r.n} | ${esc(r.name)} | ${r.par} | ${r.limit || '-'} | ${esc(r.goal)} | ${esc(r.twists.join(', ') || '-')} |\n`; });
  md += '\n<details><summary>Show the solutions for this world</summary>\n\n';
  mine.forEach((r) => { md += `- **${r.n}. ${r.name}** (${r.par}): ${r.keys.map((k) => '`' + KEY_SHORT[k] + '`').join(' ')}\n`; });
  md += '\n</details>\n';
});

fs.mkdirSync(path.join(__dirname, '..', 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'LEVELS.md'), md);
let c = 'level,world,world_name,name,url,par,clock,goal,hint,new_trick,twists,solution\n';
rows.forEach((r) => { c += [r.n, r.world, csv(WORLDS[r.world - 1].n), csv(r.name), csv(r.url), r.par, r.limit, csv(r.goal), csv(r.hint), csv(r.trick), csv(r.twists.join('; ')), csv(r.keys.map((k) => KEY_SHORT[k]).join(' '))].join(',') + '\n'; });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'levels.csv'), c);
console.log(`Wrote docs/LEVELS.md (${rows.length} levels) and docs/levels.csv`);
