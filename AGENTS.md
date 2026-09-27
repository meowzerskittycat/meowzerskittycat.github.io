# AGENTS.md

Guide for AI coding agents (Claude Code, Codex, Copilot, Cursor…) and humans working on this site.

## What this is

A personal website for **meowzers**: a first-year engineering student who makes music as a hobby.
He doesn't publish his music, so the music page is about what he's making and his setup, not a track list.

**Theme: an old-school imageboard ("NEET" / soyjak vibe).** It's styled after the classic tan "yotsuba" imageboard look:
- a `[home / about / …]` board list at the top, a 300×100 banner and a `/mz/ - meowzers` board title
- pages written as threads: an opening post (OP) with a picture, then reply posts in tan boxes with `>>` arrows
- post header lines with subject, name, date and `No.1234567`, plus greentext (`>be me`)
- MS Paint-style drawings, including an original soyjak-style guy with glasses and headphones (`soy.svg`)
- a status table styled like a post form, a "blotter" for site updates, and a Windows-98-style progress bar

It's a friendly homage. Keep it that way: no slurs, no edgy or hateful meme content, nothing aimed at real people.
The site isn't girly: no pink palette, bows or frills.

- Hosted on **GitHub Pages only**. No servers, databases, Node build steps, or paid services.
- Built with **Jekyll**, which GitHub Pages runs automatically on every push to `main`.
- Live URL: `https://meowzerskittycat.github.io/website/`

## Hard rules (GitHub Pages compatibility)

1. **Static only.** HTML, CSS, vanilla JS, images and audio. No backend code, no API keys, no form handlers.
   The site only *looks* like an imageboard; there's no real posting.
2. **No custom Jekyll plugins.** Only plugins on the
   [GitHub Pages allow-list](https://pages.github.com/versions/) work. Don't add `_plugins/` and don't
   add gems to `Gemfile` other than `github-pages` and `webrick`.
3. **No npm/bundler build step.** Don't add React, Tailwind, Vite, Sass pipelines, etc. Write plain CSS in `assets/css/site.css`.
4. **Always use `relative_url` for internal links and assets**, because the site lives under `/website/`:
   `{{ '/music/' | relative_url }}` and `{{ '/assets/img/soy.svg' | relative_url }}`.
   A bare `href="/music/"` will break on GitHub Pages.
5. **Keep `theme: null`** in `_config.yml`. Otherwise GitHub's default theme adds its own `assets/css/style.css`.
   That's also why our stylesheet is called `site.css`, not `style.css`.
6. Keep files small. GitHub rejects files over 100 MB and warns above 50 MB. Keep audio files under about 10 MB (or link out to SoundCloud/Bandcamp).
7. Only use images and fonts the owner made or is allowed to use. Don't hotlink or copy wojak/soyjak images from
   boorus or other sites (unknown authors, and often unpleasant content). Draw new ones instead, as simple SVGs.

## Where things live

| I want to change…                        | Edit this file                                  |
|------------------------------------------|-------------------------------------------------|
| name, board code (`/mz/`), tagline, status table, social links, guestbook link | `_config.yml` |
| greentext + intro in the first post on the home page | `_data/home.yml`                    |
| music page: what he's making, setup, on repeat, optional links (also the "wip" post on home) | `_data/music.yml` |
| the update "blotter" on the home page    | `_data/updates.yml`                             |
| classes, to-do list, semester dates, study tips | `_data/uni.yml`                          |
| "things i like" on the about page        | `_data/favorites.yml`                           |
| friends / cool links                     | `_data/links.yml`                               |
| about-me text (Markdown)                 | `about.md`                                      |
| home page layout                         | `index.html`                                    |
| menu items                               | `_includes/nav-items.html`                      |
| board list, banner, title                | `_includes/header.html`                         |
| post header line (subject / name / date / No.) | `_includes/post-head.html`                |
| colors, fonts, everything visual         | `assets/css/site.css` (colors are variables at the top, in `:root`) |
| semester progress bar                    | `assets/js/main.js`                             |
| page skeleton (`<head>`, `[top]` link)   | `_layouts/default.html`                         |

Other files:
- `assets/img/` holds the original drawings: `soy.svg` (OP picture on the home page), `banner.svg` (300×100 banner)
  and `favicon.svg`. They're drawn with jagged edges (`shape-rendering="crispEdges"`) on purpose, to look like MS Paint.
- `_includes/greentext.html` turns a list of lines into greentext (it adds the `>`).
- `_includes/quote-op.html` prints a `>>1234567 (OP)` link back to the first post.
- `404.html` is the "page not found" page. GitHub Pages picks it up automatically.

## Common tasks

**Update the music page.** Edit the lists in `_data/music.yml`. If he ever wants to share tracks, add
`name` + `url` entries under `links:` and a "listen" post appears. Don't add fake releases or placeholder tracks.

**Add a post to a page.** Posts look like this. The first post on a page uses `op=true` (it has no box and its subject
is the page's `<h1>`); every other post is a reply:
```html
<article class="post reply">
  {% include post-head.html subject="title here" %}
  <blockquote class="post-body">
    normal text<br>
    <span class="quote">&gt;greentext line</span><br>
  </blockquote>
</article>
```
Dates and `No.` numbers are generated from the build time; don't hard-code them.

**Add a page.**
1. Create `newpage.html` (or `.md`) at the repo root with front matter:
   ```
   ---
   layout: default
   title: my new page
   ---
   ```
2. Start it with an OP post (`<article class="post op">` and `{% include post-head.html op=true subject="…" %}`),
   then add replies as above.
3. Add it to the menu in `_includes/nav-items.html`: `;/newpage/|label` (URL with trailing slash).

**Change colors.** Edit only the CSS variables in `:root` at the top of `assets/css/site.css`.
Keep text readable (at least 4.5:1 contrast). The classic greentext green is too light on the tan boxes, which is
why it's a bit darker here.

**Use a real photo or a new drawing.** Add the image to `assets/img/`, then in `index.html` change the `src`, `alt`
and the `File:` line in the OP's `<div class="file">`.

**Useful CSS classes:** `post op` / `post reply`, `post-body`, `quote` (greentext), `quotelink`, `file` + `file-info` +
`file-thumb` (OP picture), `postform` (status table), `blotter`, `spec` (key/value list, use with `<dl>`),
`plain-list`, `numbered`, `todo`, `muted`, `pixel`.

## Style & tone

- **Write like a normal person on an imageboard, not like a meme page.** Lowercase, short and dry. Greentext is fine
  in small doses. Avoid forced memes, "hiii", strings of kaomoji, and anything cringe or mean.
- The owner uses he/him.
- Don't invent facts about him. Use obvious `(placeholder)` text where real info is needed.
- No filler: don't add decorative buttons, badges, blinkies, stamps, fake widgets, fake "reply"/"report" buttons or
  links to placeholder URLs. Every button or link should go somewhere real. `[top]` at the bottom is the only footer.
- Accessibility matters. Keep `alt` text on meaningful images, `alt=""` on decorations, enough color contrast,
  and a working layout at phone widths (under 600px).
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
