# How Focus Ring works

This page explains the insides. You do not need it to play.

## One file

Everything is in [`../index.html`](../index.html): markup, CSS, JavaScript. No bundler, no framework. Open it with a double click and it runs.

Rough layout of the file, top to bottom:

1. `<head>`: title, description, theme color, social preview tags, an inline SVG favicon, font links.
2. `<style>`: the look. Colors are CSS variables on `:root` (light) and redefined for dark mode.
3. The page body: header (title, theme switch, speaker button), three screens (worlds, levels, play) and the on-screen key row.
4. `<script>`: the engine, the level list, the renderer.

## The engine (pure logic)

Between the comments `// <engine>` and `// </engine>` there is no DOM code at all. That is deliberate. The same code runs in the browser and in Node (the `tools/` folder pulls it out of `index.html` and runs it with `new Function`).

A **level** is a plain object:

| Field | Meaning |
|---|---|
| `name`, `url`, `goal`, `hint`, `trick` | Texts shown to the player |
| `init()` | Returns the starting state of the page (what is ticked, what is open) |
| `els` | The elements: `{ kind: 'button' \| 'link' \| 'check' \| 'toggle' \| 'radio', label, act(s, g), val(s), disabled(s) }` |
| `order(s)` | The Tab order right now (can change with the state) |
| `groups` | Sets of elements that share one Tab stop and use arrows (radio groups, menu bars) |
| `onArrow`, `onEsc`, `onFocus`, `after` | Optional hooks for custom behavior |
| `sections` | How to draw the page |
| `limit`, `rev`, `dead`, `drift`, `every` | Twist settings |

The game state is `{ focus, s, k, won, failed, ... }`: where the ring is, the page state `s`, and `k`, the number of key presses so far.

`step(level, state, key)` is the only way state changes. Keys are `T` (Tab), `S` (Shift+Tab), `E` (Enter), `P` (Space), `L`, `R` (arrows), `X` (Esc). `step` never mutates its input; it returns a new state. That makes search easy.

## The solver and par

`solve(level, maxDepth, wantPath)` is a **breadth-first search**. It starts from `newGame(level)`, tries all seven keys, and repeats on every new state it has not seen before (states are compared by their JSON). The first time any state is `won`, the depth is the shortest possible solution. That depth is the **par**. With `wantPath` it also returns the key sequence, which is how `docs/LEVELS.md` gets its solutions.

Because states include the press counter modulo a level's repeating period (`kmod`), things that happen on a beat (popups, drift, thieves) are searched correctly without exploding the search.

Searching takes a moment on big levels, so the results are saved in `PARS_PRE`, an array with one number per level. The game reads it at load time. `npm run verify` re-solves everything and complains if a number is stale.

## Stars

```
presses <= par        -> 3 stars
presses <= par + 3    -> 2 stars
otherwise (won)       -> 1 star
```

Stars and best press counts are saved per level number. A level unlocks when the previous level has at least one star, and a world opens with its first level.

## Clocks

A level with `limit` fails (`failed`) when the press count passes the limit. `limit = par + plus`. Computing a limit needs the par, and computing the par needs to know the limit applies, so the numbers were found in two passes and the final limits are frozen in the `LIM` table. `verify` checks `limit > par` for every clocked level.

## Twists

| Twist | Implemented as |
|---|---|
| Backwards Tab | `rev`: Tab and Shift+Tab swap |
| Broken key | `dead: ['P']` etc.: the key is ignored but still counts as a press |
| Drift | every `drift` presses, focus moves to the next stop |
| Popups | every `every` presses, a popup appears and takes focus; `Esc` closes it |
| Focus thief | every `every` presses, focus jumps to the chat widget |

## The renderer

`renderAll()` turns `{ level, state }` into HTML for the fake page, then `placeRing()` moves the glowing, funny-faced ring to the focused element with a short animation. A live region announces messages like "Toolbar open. Esc leaves." so screen reader users get the same story.

Other UI pieces:

- **Worlds and levels screens:** cards with star counts and a lock state.
- **Theme:** `data-theme="light|dark"` on `<html>`, saved as `focusring-theme`. With nothing saved, `prefers-color-scheme` decides, and a listener follows system changes.
- **Sound:** WebAudio oscillators, no files. Mute is saved as `focusring-muted`.
- **Storage:** every `localStorage` call is wrapped in `try/catch`, so private mode never breaks the game.

## The tools

| File | What it does |
|---|---|
| `tools/lib.js` | `loadGame()` pulls `L`, `solve`, `step`, `newGame`, `stops`, `PARS_PRE`, `WORLDS` out of `index.html` |
| `tools/verify.js` | solve everything, compare to `PARS_PRE`, check clocks |
| `tools/e2e.js` | open the page in Chromium, start each level, press the solver's keys with real keyboard events, expect `won`, exactly par presses, 3 stars |
| `tools/export-levels.js` | write `docs/LEVELS.md` and `docs/levels.csv` |
| `tools/screenshots.js` | take the pictures in `docs/img` |
| `tools/serve.js` | a 20-line static server |
