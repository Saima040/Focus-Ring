<img width="1042" height="843" alt="image" src="https://github.com/user-attachments/assets/dfe0980a-642c-4333-8340-3b73b91e82d9" /># Focus Ring

A keyboard-only puzzle game. You are the focus ring, the outline that moves when you press Tab on a web page. Each level is a fake web page with a goal. Reach it using only the keyboard, in as few key presses as possible.

**Play:** https://focus-ring/


![Gameplay](docs/img/play-light.png)

- 50 worlds, 175 levels
- Light and dark theme, sound on/off
- Works on phones with an on-screen key row
- One HTML file, no dependencies, no server

## How to play

| Key | Action |
|---|---|
| Tab / Shift+Tab | Move to the next / previous element |
| Enter | Press a button or link, open menus and dialogs |
| Space | Tick checkboxes, flip switches, pick radio buttons, pick up and drop items |
| Left / Right (Up / Down) | Move inside a widget (menu bar, radio group, dial, tabs) |
| Esc | Close a popup or dialog, leave a toolbar (unlocked in world 2) |

On touch devices, tap the on-screen keys.

**Scoring.** Every key press counts, including useless ones. *Par* is the fewest presses that can win, computed by a solver.

| Presses | Stars |
|---|---|
| par or fewer | 3 |
| up to par + 3 | 2 |
| more | 1 |

One star unlocks the next level. Replaying keeps your best result. Some levels have a clock: the page closes after a set number of presses (always above par).

**Twists** that appear in levels: Tab running backwards, a broken key (Space, Enter or Tab), popups that steal focus every nth press, a chat widget that steals focus, a ring that drifts to the next element, focus traps, and clocks.

All levels with par, clock, goal and solutions: [docs/LEVELS.md](docs/LEVELS.md) ([CSV](docs/levels.csv)).

## Saving

No account or backend. Progress is stored in the browser's `localStorage` (`focusring-stars`, `focusring-best`, `focusring-theme`, `focusring-muted`). It stays on that browser and device, and is lost if site data is cleared.

## Run locally

Open `index.html` in a browser, or:

```bash
npm start        # http://localhost:8080  (PORT=3000 npm start to change)
```

## Tests

Requires Node.js 18+.

```bash
npm run verify   # solves all 175 levels, checks pars and clocks (no browser)
npm install      # once, for the browser test
npm run e2e      # replays every level at par with real key presses (Playwright)
npm test         # both
npm run levels   # regenerate docs/LEVELS.md and docs/levels.csv
npm run shots    # regenerate docs/img screenshots
```

If Playwright cannot download Chromium: `CHROMIUM_PATH=/path/to/chrome npm run e2e`.

## Project structure

```
index.html        the whole game (engine, levels, UI)
tools/            verify, e2e, serve, export-levels, screenshots
docs/             LEVELS.md, levels.csv, HOW_IT_WORKS.md, PUBLISHING.md, CHANGELOG.md, img/
.github/          workflows, issue templates, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY
LICENSE, package.json, README.md
```

The engine (pure logic, between `// <engine>` and `// </engine>` in `index.html`) is separate from the UI. A breadth-first solver finds each level's par; results are stored in `PARS_PRE`. Details: [docs/HOW_IT_WORKS.md](docs/HOW_IT_WORKS.md).

## Deploy

See [docs/PUBLISHING.md](docs/PUBLISHING.md) for GitHub and GitHub Pages steps. After deploying, replace `YOUR-USERNAME` here and make the `og:image` URL in `index.html` absolute.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md). New levels must be added at the end of the list so saved stars stay correct.

## License

[MIT](LICENSE)
