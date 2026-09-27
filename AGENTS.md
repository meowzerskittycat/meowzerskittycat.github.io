# AGENTS.md

Guide for AI coding agents (Claude Code, Codex, Copilot, Cursor…) and humans working on this site.

## What this is

A personal website for **meowzers**: a first-year engineering student who makes music as a hobby.
He doesn't publish his music, so the music page is about what he's making and his setup, not a track list.

**Style: minimal and text-first, in the spirit of [suckless.org](https://suckless.org).**
- a plain header (site name + tagline), a grey menu bar with the pages on the left and external links on the right
- a small left-hand list of links to the sections on the current page
- black text on white, the browser's default `sans-serif`, underlined blue links with a different visited color
- no JavaScript, no web fonts, no images (apart from the favicon), no animation, no icons or emoji, no cards or shadows

When in doubt, remove things. The page should read fine with CSS turned off.

- Hosted on **GitHub Pages only**. No servers, databases, Node build steps, or paid services.
- Built with **Jekyll**, which GitHub Pages runs automatically on every push to `main`.
- Live URL: `https://meowzerskittycat.github.io/website/`

## Hard rules

1. **Static only.** Plain HTML and CSS. No JavaScript (don't add `<script>` tags), no backend code, no API keys,
   no form handlers, no trackers or analytics.
2. **No custom Jekyll plugins.** Only plugins on the
   [GitHub Pages allow-list](https://pages.github.com/versions/) work. Don't add `_plugins/` and don't
   add gems to `Gemfile` other than `github-pages` and `webrick`.
3. **No build step.** Don't add npm, React, Tailwind, Sass pipelines, etc. Plain CSS lives in `assets/css/site.css`;
   keep it short.
4. **Always use `relative_url` for internal links and assets**, because the site lives under `/website/`:
   `{{ '/music/' | relative_url }}`. A bare `href="/music/"` will break on GitHub Pages.
5. **Keep `theme: null`** in `_config.yml`. Otherwise GitHub's default theme adds its own `assets/css/style.css`.
   That's also why our stylesheet is called `site.css`, not `style.css`.
6. **No external requests.** No Google Fonts, CDNs or embeds. Everything the page loads comes from this repo.
7. Keep files small. GitHub rejects files over 100 MB and warns above 50 MB.

## Where things live

| I want to change…                        | Edit this file                                  |
|------------------------------------------|-------------------------------------------------|
| name, tagline, status table, social links, guestbook link | `_config.yml`                  |
| home page text                           | `index.md`                                      |
| about page text                          | `about.md`                                      |
| music page: working on, on repeat, setup, optional links | `_data/music.yml`                |
| the "News" list on the home page         | `_data/updates.yml`                             |
| classes, to-do list, semester dates, study tips | `_data/uni.yml`                          |
| "Things I like" on the about page        | `_data/favorites.yml`                           |
| friends / other sites                    | `_data/links.yml`                               |
| pages in the menu bar                    | `_includes/nav-items.html`                      |
| header + menu bar                        | `_includes/header.html`                         |
| page skeleton (`<head>`, left nav)       | `_layouts/default.html`                         |
| colors and layout                        | `assets/css/site.css` (colors are variables at the top, in `:root`) |

`404.html` is the "page not found" page. GitHub Pages picks it up automatically.

## Common tasks

**Edit a page.** Pages are Markdown (`index.md`, `about.md`, `music.md`, `uni.md`, `links.md`). Headings with `##`
become sections. Lists that come from data files are written as small Liquid loops; edit the data file, not the loop.

**The left nav.** Each page's front matter can list its sections:
```yaml
sections: [Classes, To-do, Things that help]
```
Each entry links to the `##` heading with the same text, so keep the names identical. Leave `sections` out and the
page has no left nav (like `links.md`). If you add a section that only shows up sometimes (for example "Listen" on
the music page, or "Friends" on the links page), don't list it in `sections`.

**Add a page.**
1. Create `newpage.md` at the repo root:
   ```
   ---
   layout: default
   title: New page
   sections: [First section, Second section]
   ---
   # New page

   ## First section
   …
   ```
2. Add it to the menu in `_includes/nav-items.html`: `;/newpage/|newpage` (URL with trailing slash).

**Update the music page.** Edit `_data/music.yml`. If he ever wants to share tracks, add `name` + `url` entries under
`links:` and a "Listen" section appears. Don't add fake releases or placeholder tracks.

**Change colors.** Edit only the variables in `:root` at the top of `assets/css/site.css`. Keep it black-on-white
or close to it, with enough contrast (at least 4.5:1).

## Style & tone

- Write plainly: short sentences, normal capitalization, no hype, no jokes for the sake of jokes, no emoji.
- The owner uses he/him.
- Don't invent facts about him. Use obvious `(placeholder)` text where real info is needed.
- No filler: no decorative buttons, badges, widgets, "back to top" buttons, footers, or links to placeholder URLs.
  Every link should go somewhere real.
- Use semantic HTML: headings in order, real lists and tables, `<th scope="row">` for row labels.
- Keep a working layout at phone widths (under 40em). The left nav turns into a row of links there.
- Keep it simple enough that a non-programmer can edit it.

## Previewing locally (optional)

You don't need this, because pushing to GitHub is enough. To preview locally with Ruby installed:

```sh
bundle install
bundle exec jekyll serve
# open http://localhost:4000/website/
```

If the build complains about "Invalid US-ASCII character", run `export LANG=C.UTF-8` first.

Before finishing a change, agents should run `bundle exec jekyll build` and make sure it succeeds without errors.
Then check that new internal links use `relative_url` and that no `<script>` tags or external requests crept in.

## Deploying

GitHub repo → **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**,
branch **`main`**, folder **`/ (root)`**. After that, every push to `main` redeploys in about a minute.
If the repo is renamed to `meowzerskittycat.github.io` or a custom domain is added, set `baseurl: ""` in `_config.yml`.
