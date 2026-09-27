# AGENTS.md

Guide for AI coding agents (Claude Code, Codex, Copilot, Cursor…) and humans working on this site.

## What this is

A personal website for **meowzers**: a first-year engineering student who makes music as a hobby.
He doesn't publish his music, so the music page is about what he's making and his setup, not a track list. It has a soft, cute,
**Theme: a pink engineering notebook.** Pink graph-paper background, cream "paper" cards with torn-tape labels
numbered like figures (01, 02…), a header styled like the title block on an engineering drawing (drawn by / sheet /
rev. / scale), a ruler along the top, and a line-drawn cat with a bow as the portrait. It's cute but specific to him
(engineering + music + pink). Avoid generic Neocities tropes like gingham, macOS-style window buttons, marquees,
sparkle cursors and blinkies.

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
   `{{ '/music/' | relative_url }}` and `{{ '/assets/img/cat.svg' | relative_url }}`.
   A bare `href="/music/"` will break on GitHub Pages.
5. **Keep `theme: null`** in `_config.yml`. Otherwise GitHub's default theme adds its own `assets/css/style.css`.
   That's also why our stylesheet is called `cute.css`, not `style.css`.
6. Keep files small. GitHub rejects files over 100 MB and warns above 50 MB. Keep audio files under about 10 MB (or link out to SoundCloud/Bandcamp).
7. Only use images, GIFs and fonts the owner made or is allowed to use. Don't hotlink other people's Neocities GIFs.

## Where things live

| I want to change…                        | Edit this file                                  |
|------------------------------------------|-------------------------------------------------|
| name, tagline, mood/status, social links, guestbook link | `_config.yml` |
| music page: what he's making, setup, on repeat, optional links (also "making lately" on home) | `_data/music.yml` |
| the "updates" log on the home page       | `_data/updates.yml`                             |
| classes, to-do list, semester dates, study tips | `_data/uni.yml`                          |
| favorite things on the about page        | `_data/favorites.yml`                           |
| friends / cool links                     | `_data/links.yml`                               |
| about-me text (Markdown)                 | `about.md`                                      |
| home page text                           | `index.html`                                    |
| menu items (also sets the "sheet" numbers) | `_includes/nav-items.html`                    |
| sidebar (status, links)                  | `_includes/sidebar.html`                        |
| colors, fonts, everything visual         | `assets/css/cute.css` (colors are variables at the top, in `:root`) |
| semester progress bar                    | `assets/js/main.js`                             |
| page skeleton (`<head>`, fonts)          | `_layouts/default.html`                         |

Other files:
- `assets/img/` holds the original SVG drawings: `cat.svg` (portrait on the home page), `ribbon.svg` (bow on the header) and `favicon.svg`.
- `404.html` is the "page not found" page. GitHub Pages picks it up automatically.

## Common tasks

**Update the music page.** Edit the lists in `_data/music.yml`. If he ever wants to share tracks, add
`name` + `url` entries under `links:` and a "listen" box appears. Don't add fake releases or placeholder tracks.

**Add a page.**
1. Create `newpage.html` (or `.md`) at the repo root with front matter:
   ```
   ---
   layout: default
   title: my new page
   ---
   ```
2. Wrap content in the card markup used everywhere. The first card's label is the page's `<h1>`; the rest are `<h2>`.
   Labels are numbered automatically.
   ```html
   <section class="card">
     <h2 class="label">title</h2>
     …content…
   </section>
   ```
3. Add it to the menu in `_includes/nav-items.html`: `;/newpage/|label` (URL with trailing slash).

**Change colors.** Edit only the CSS variables in `:root` at the top of `assets/css/cute.css`.
Keep text readable: dark text on pastel backgrounds, not white text on pale pink.

**Use a real photo.** Add the image to `assets/img/`, then in `index.html` change the `src` and `alt` of the
image inside `<figure class="portrait">`.

**Useful CSS classes:** `card` + `label`, `note` (blue-tape sidebar card), `grid-2` (two columns that stack on phones),
`spec` / `spec spec-grid` (key/value spec sheet, use with `<dl>`), `plain-list`, `numbered`, `log`, `staff`
(music-staff divider), `btn`, `pill`, `tiny`, `center`.

## Style & tone

- **The visuals are cute; the writing is not corny.** Copy is lowercase, casual and plain, like a normal
  person talking. Avoid gushing, "hiii", strings of kaomoji, "soft boy", or overdone jokes. Put the cuteness in the
  design (colors, tape labels, drawings), not in the sentences.
- The owner uses he/him, is a feminine guy, and likes pink. Keep the site respectful of that without making a big deal of it.
- Don't invent facts about him. Use obvious `(placeholder)` text where real info is needed.
- No filler: don't add decorative buttons, badges, blinkies, stamps, fake widgets, window close buttons or links to
  placeholder URLs. Every button or link should go somewhere real. There's intentionally no footer.
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
