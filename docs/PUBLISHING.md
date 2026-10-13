# Put Focus Ring on GitHub and on the internet

This guide assumes you have never used Git. Pick **Path A** (no installs, only a browser) or **Path B** (the proper way, with Git). Both end the same way: a free public link anyone can play.

Replace `YOUR-USERNAME` with your GitHub name everywhere below.

---

## Step 0: Make a GitHub account

1. Go to <https://github.com> and click **Sign up**.
2. Pick a username, verify your email.

## Path A: Upload in the browser (easiest)

1. Click the **+** at the top right of GitHub, then **New repository**.
2. **Repository name:** `focus-ring`. Leave it **Public**. Do **not** tick "Add a README" (we already have one). Click **Create repository**.
3. On the next page click the link **uploading an existing file**.
4. Unzip `focus-ring.zip` on your computer. Open the unzipped folder.
5. **Select everything inside the folder** (including the hidden `.github` folder and `.nojekyll`, `.gitignore` and the others) and drag it into the GitHub page.
   - Hidden files: on Windows turn on *View, Show, Hidden items*. On Mac press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd> in Finder.
   - The folder structure (`docs`, `tools`, `.github`) must be kept. Dragging the folders keeps it.
   - If the browser upload refuses the `.github` folder, use Path B.
6. Scroll down, write a message like `First version`, and click **Commit changes**.

## Path B: With Git (the proper way)

### Install Git
- Windows: <https://git-scm.com/download/win>
- Mac: open Terminal and run `git --version` (it offers to install)
- Linux: `sudo apt install git`

### One-time setup (your name on commits)
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### Create the empty repo on GitHub
Same as Path A steps 1 and 2 (no README, public).

### Push the project
Open a terminal **inside** the unzipped `focus-ring` folder:

```bash
git init
git branch -M main
git add .
git commit -m "First version of Focus Ring"
git remote add origin https://github.com/YOUR-USERNAME/focus-ring.git
git push -u origin main
```

GitHub does not accept account passwords for pushing. When asked for a password, use a **Personal Access Token**: GitHub, your avatar, Settings, Developer settings, Personal access tokens, Tokens (classic), Generate new token, tick `repo` and `workflow`, copy it, paste it as the password. (Or install the GitHub CLI and run `gh auth login`.)

### Everyday commands afterwards
```bash
git status                         # what changed?
git add .                          # stage everything
git commit -m "Describe the change"
git push                           # upload
git pull                           # download changes from GitHub
git log --oneline                  # history
```

---

## Turn on GitHub Pages (the free website)

1. In your repo click **Settings**, then **Pages** (left menu).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Go to the **Actions** tab. The workflow *Publish the game (GitHub Pages)* runs by itself after your push (or click it and press **Run workflow**). Wait for the green tick, about a minute.
4. Your game is live at **`https://YOUR-USERNAME.github.io/focus-ring/`**

**Simpler alternative:** set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`. This works because the whole game is the root `index.html`. If you do this, the workflow file is not needed.

## Final touches after it is live

1. **Fix the placeholder links.** Search the README and CONTRIBUTING for `YOUR-USERNAME` and put your name in. (On GitHub: open the file, click the pencil.)
2. **Make the social preview image work.** In `index.html` find the `og:image` meta tag. It says `docs/img/social.png`. Social sites need a full address, so change it to
   `https://YOUR-USERNAME.github.io/focus-ring/docs/img/social.png`. Do the same for `og:url` if present.
3. **Repository description and topics.** On the repo main page click the gear next to *About*. Add the description, tick *Use your GitHub Pages website*, and add topics: `game`, `keyboard`, `accessibility`, `javascript`, `puzzle`, `html5`.
4. **Social card** (optional): Settings, General, *Social preview*, upload `docs/img/social.png`.
5. **Add a release** (optional): *Releases*, *Create a new release*, tag `v1.0.0`, copy text from docs/CHANGELOG.md.

## Common problems

| Problem | Fix |
|---|---|
| Page shows the README instead of the game | Pages source is wrong, or `index.html` is not in the repo root |
| 404 on the Pages link | Wait two minutes; check the Actions tab for a red cross |
| Pictures missing in README | The `docs/img` folder was not uploaded |
| `.github` folder missing | Hidden folders were not selected; use Path B |
| `git push` asks for a password and fails | Use a token (see above) |
| `failed to push some refs` | Run `git pull --rebase origin main`, then push again |
| Game works but the sound is silent | Browsers start sound only after a click or key press. Press a key |
| My stars disappeared after publishing | Progress is per web address. `localhost` and `github.io` are separate |
