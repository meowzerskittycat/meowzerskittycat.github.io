# AGENTS.md

Guide for AI coding agents (Claude Code, Codex, Copilot, Cursor…) and humans working on this site.

## What this is

A personal website for **meowzers**: a music maker and university student. It has a soft, cute,
pastel "handmade web / Neocities" look with ribbons, gingham, little window boxes, blinkies, stamps and pixel fonts.

- Hosted on **GitHub Pages only**. No servers, databases, Node build steps, or paid services.
- Built with **Jekyll**, which GitHub Pages runs automatically on every push to `main`.
- Live URL: `https://meowzerskittycat.github.io/website/`

## Hard rules (GitHub Pages compatibility)

1. **Static only.** HTML, CSS, vanilla JS, images and audio. No backend code, no API keys, no form handlers.
2. **No custom Jekyll plugins.** Only plugins on the
   [GitHub Pages allow-list](https://pages.github.com/versions/) work. Don't add `_plugins/` and don't
   add gems to `Gemfile` other than `github-pages` and `webrick`.
3. **No npm/bundler build step.** Don't add React, Tailwind, Vite, Sass pipelines, etc. Write plain CSS in `assets/css/cute.css`.
4. **Always use `relative_url` for internal links and assets**, because the site lives under `/website/`:
   `{{ '/music/' | relative_url }}` and `{{ '/assets/img/heart.svg' | relative_url }}`.
   A bare `href="/music/"` will break on GitHub Pages.
5. **Keep `theme: null`** in `_config.yml`. Otherwise GitHub's default theme adds its own `assets/css/style.css`.
   That's also why our stylesheet is called `cute.css`, not `style.css`.
6. Keep files small. GitHub rejects files over 100 MB and warns above 50 MB. Keep audio files under about 10 MB (or link out to SoundCloud/Bandcamp).
7. Only use images, GIFs and fonts the owner made or is allowed to use. Don't hotlink other people's Neocities GIFs.

## Where things live

| I want to change…                        | Edit this file                                  |
|------------------------------------------|-------------------------------------------------|
| name, tagline, mood/status, socials, marquee text, guestbook link | `_config.yml` |
| songs on the music page (and "latest track" on home) | `_data/music.yml`                  |
| the "updates" log on the home page       | `_data/updates.yml`                             |
| classes, to-do list, semester dates, study tips | `_data/uni.yml`                          |
| favorite things on the about page        | `_data/favorites.yml`                           |
| friends / cool links                     | `_data/links.yml`                               |
| about-me text (Markdown)                 | `about.md`                                      |
| home page text                           | `index.html`                                    |
| menu items                               | `_includes/nav-items.html`                      |
| sidebar (status, socials, blinkies)      | `_includes/sidebar.html`                        |
| footer stamps                            | `_includes/footer.html`                         |
| colors, fonts, everything visual         | `assets/css/cute.css` (colors are variables at the top, in `:root`) |
| sparkle cursor trail, semester progress bar | `assets/js/main.js`                          |
| page skeleton (`<head>`, fonts)          | `_layouts/default.html`                         |

Other files:
- `_includes/track.html` renders one song. It's shared by the home and music pages.
- `assets/img/` holds the original SVG decorations (ribbon, heart, sparkle, default cover art, favicon).
  `assets/img/buttons/my-button.svg` is the site's 88×31 link-back button.
- `404.html` is the "page not found" page. GitHub Pages picks it up automatically.

## Common tasks

**Add a song.** Copy an entry in `_data/music.yml` and put it at the **top** (newest first). The fields are
explained in the comment at the top of that file. For an on-page player, set `embed:` to the *embed* URL
(for example `https://www.youtube.com/embed/ID` or the `w.soundcloud.com/player/?url=…` src from SoundCloud's
share → embed). A plain page URL won't work there. For cover art, put the image in `assets/img/covers/` and set
`cover: /assets/img/covers/name.jpg`.

**Add a page.**
1. Create `newpage.html` (or `.md`) at the repo root with front matter:
   ```
   ---
   layout: default
   title: my new page
   ---
   ```
2. Wrap content in the window box markup used everywhere:
   ```html
   <section class="window">
     <div class="window-bar"><span>♡ title</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
     <div class="window-body"> …content… </div>
   </section>
   ```
3. Add it to the menu in `_includes/nav-items.html`: `;/newpage/|label|emoji` (URL with trailing slash).

**Change colors.** Edit only the CSS variables in `:root` at the top of `assets/css/cute.css`.
Keep text readable: dark text on pastel backgrounds, not white text on pale pink.

**Use a real avatar.** In `index.html`, replace the `<div class="avatar">…</div>` with
`<img class="avatar" src="{{ '/assets/img/me.png' | relative_url }}" alt="…">`, and add the image file.

**Useful CSS classes:** `window`, `grid-2` (two columns that stack on phones), `btn`, `btn lav`, `pill`, `tag`,
`blinkie` (+ `lav`/`mint`), `stamp` (+ `lav`/`mint`/`butter`), `facts`, `tiny`, `center`.

## Style & tone

- Voice: lowercase, soft and friendly, with cute symbols like ♡ ✿ ✧ ♫ ✎ and kaomoji. Keep that tone in new copy.
- The owner uses he/him and is a feminine guy. Keep the site affirming ("pink is for everyone").
- Accessibility matters. Keep `alt` text on meaningful images, `alt=""` plus `aria-hidden` on decorations,
  enough color contrast, the `prefers-reduced-motion` block in the CSS, and a working layout at phone widths (under 760px).
- Keep it simple enough that a non-programmer can edit it. Prefer data files and comments over clever code.

## Previewing locally (optional)

You don't need this, because pushing to GitHub is enough. To preview locally with Ruby installed:

```sh
bundle install
bundle exec jekyll serve
# open http://localhost:4000/website/
```

If the build complains about "Invalid US-ASCII character", run `export LANG=C.UTF-8` first.

Before finishing a change, agents should run `bundle exec jekyll build` and make sure it succeeds without errors.
Then check that new internal links use `relative_url`.

## Deploying

GitHub repo → **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**,
branch **`main`**, folder **`/ (root)`**. After that, every push to `main` redeploys in about a minute.
If the repo is renamed to `meowzerskittycat.github.io` or a custom domain is added, set `baseurl: ""` in `_config.yml`.
