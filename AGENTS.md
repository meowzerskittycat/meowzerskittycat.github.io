# AGENTS.md

Guide for AI coding agents (Claude Code, Codex, Copilot, Cursor…) and humans working on this site.

## What this is

The personal website of **Vivien**, a first-year software engineering student who also makes music as a hobby.
The main part is a Markdown **blog** (`/blog/`), mostly about software, plus some music. Music lives there too, as
posts (there's no separate music page). He doesn't publish his music, so music posts are about what he's making and
how, not track listings.

Pages: home, about, status, blog and links.

**Style: an experimental, editorial layout in the [Nord](https://www.nordtheme.com) colour palette.**
- The header is a banded polar sky (Nord's Polar Night shades, fading to Frost blue at the horizon) with a faint
  aurora glow in the upper right, and three jagged mountain ridges along its bottom edge, all drawn in CSS.
  The nearest ridge is the page colour, so the page reads as snow (or as night, in dark mode).
- Everything is aligned to the left edge: menu, name, headings, text, labels and dates. Nothing is centred.
- Type is an editorial serif (system fonts only): a large italic name, italic headings, small uppercase labels
  and dates, and a drop cap at the start of the home page and each post.
- Light mode uses Snow Storm for the page; dark mode (automatic) uses Polar Night. Code blocks use Nord's own
  syntax colours.
- **Square corners everywhere** (`border-radius` is reset to 0; don't add rounded corners, pills, cards or shadows).
- No JavaScript, no web fonts, no icons or emoji. Images only where they carry information.

The page should still read fine with CSS turned off.

- Hosted on **GitHub Pages only**. No servers, databases, Node build steps, or paid services.
- Built with **Jekyll**, which GitHub Pages runs automatically on every push to `main`.
- Live at `https://meowzerskittycat.github.io/`, served from the root of the domain (`baseurl: ""`). See **Deploying**.

## Hard rules

1. **Static only.** Plain HTML and CSS. No JavaScript (don't add `<script>` tags), no backend code, no API keys,
   no form handlers, no trackers or analytics, no comment systems.
2. **No custom Jekyll plugins.** Only plugins on the
   [GitHub Pages allow-list](https://pages.github.com/versions/) work. The site uses `jekyll-feed` (for the Atom
   feed), which is on that list. Don't add `_plugins/` and don't add gems to `Gemfile` other than `github-pages` and
   `webrick`.
3. **No build step.** Don't add npm, React, Tailwind, Sass pipelines, etc. Plain CSS lives in `assets/css/site.css`;
   keep it short.
4. **Use `relative_url` for internal links and assets**, e.g. `{{ '/blog/' | relative_url }}`. `baseurl` is
   empty right now, so bare `/blog/` links would work too, but `relative_url` keeps things working if the site
   ever moves back into a sub-folder.
5. **Keep `theme: null`** in `_config.yml`. Otherwise GitHub's default theme adds its own `assets/css/style.css`.
   That's also why our stylesheet is called `site.css`, not `style.css`.
6. **No external requests** from the site's own pages. No Google Fonts, CDNs, embeds or hotlinked images.
7. Keep files small. GitHub rejects files over 100 MB and warns above 50 MB. Compress photos before adding them
   (a few hundred KB is plenty).

## Where things live

| I want to change…                        | Edit this file                                  |
|------------------------------------------|-------------------------------------------------|
| name, tagline, status table, menu-bar links, guestbook link | `_config.yml`               |
| home page text                           | `index.md`                                      |
| about page                               | `about.md` (+ `_data/favorites.yml` for "Things I like") |
| status page                              | `status.md` (table values are in `_config.yml`) |
| site updates list on the status page     | `_data/updates.yml`                             |
| **blog posts**                           | `_posts/` (one Markdown file per post)          |
| unfinished posts (not published)         | `_drafts/`                                      |
| the list of posts (the Blog page)        | `blog.md`                                       |
| how a single post looks                  | `_layouts/post.html`                            |
| images for posts                         | `assets/img/posts/<post-name>/`                 |
| links page                               | `links.md` + `_data/links.yml`                  |
| pages in the menu bar                    | `_includes/nav-items.html`                      |
| header + menu bar                        | `_includes/header.html`                         |
| page skeleton (`<head>`), plus small fixes to the Markdown output (labelled task-list boxes, footnote ids) | `_layouts/default.html` |
| colors and layout                        | `assets/css/site.css` (colors are variables at the top, in `:root`) |

`404.html` is the "page not found" page. GitHub Pages picks it up automatically.
The Atom feed is generated at `/feed.xml`.

## Writing a blog post

1. Create a file in `_posts/` named `YYYY-MM-DD-short-name.md`, for example `_posts/2026-10-04-json-parser.md`.
   The date in the name is the post date; the short name becomes the URL (`/blog/json-parser/`).
2. Start it with front matter:
   ```yaml
   ---
   title: "Writing a JSON parser"
   description: "One sentence shown under the title on the Blog page."
   ---
   ```
   `description` is optional. The layout and URL are filled in automatically.
3. Write the post in Markdown below that. `_posts/2026-09-27-lorem-ipsum.md` is a reference that uses every
   supported feature: headings, bold/italic/strikethrough, links, lists, task lists, quotes, code blocks with syntax
   highlighting, tables, images, definition lists, footnotes and horizontal rules.
4. Put images in `assets/img/posts/<short-name>/` and link them with a description as alt text:
   `![What the picture shows]({{ '/assets/img/posts/json-parser/diagram.png' | relative_url }})`
5. Commit and push. The post appears on the Blog page, on the home page as "Latest post", and in the feed.

Notes:
- Posts dated in the future aren't published until that date (the next build after it).
- To keep a post private while writing, put it in `_drafts/` without a date in the file name. Drafts are never
  published. Move it to `_posts/` with a date when it's ready. (Locally, `jekyll serve --drafts` shows them.)
- Math (LaTeX) isn't supported, because it would need JavaScript. Use code blocks or images for equations.
- The test post can be deleted once there are real posts.

## Other common tasks

**Add a page.**
1. Create `newpage.md` at the repo root:
   ```
   ---
   layout: default
   title: New page
   description: One sentence for search engines.
   ---
   # New page

   Text…
   ```
2. Add it to the menu in `_includes/nav-items.html`: `;/newpage/|newpage` (URL with trailing slash).

**Update the status page.** Change the values under `status:` in `_config.yml`. Add a line to `_data/updates.yml`
when something on the site changes.

**Music.** Music goes in regular blog posts, like any other topic. There's no separate music page.
Don't add fake releases or placeholder tracks.

**Add links to the menu bar** (social profiles, a guestbook). Use `socials:` / `guestbook_url` in `_config.yml`.
They're empty on purpose; only add real links he asks for.

**Change colours.** Edit only the variables at the top of `assets/css/site.css`. The 16 Nord colours are defined
once (`--nord0` to `--nord15`); the first `:root` block maps them to roles for light mode, and the block inside
`@media (prefers-color-scheme: dark)` does the same for dark mode. Keep every text colour at least 4.5:1 against its
background. Some Nord colours fail that on their own (for example `nord10` on `nord6`), which is why light-mode links
use a deeper shade of `nord10`.

## Style & tone

- **His name appears once per page: in the header** (it comes from `title` in `_config.yml`, and it's the `<h1>` on
  the home page). Don't repeat it in page text, post bylines or headings; pages are written in first person.
  He uses he/they (see the about page).
- He's a software engineering student. Keep examples and wording software-oriented rather than hardware.
- **Write professionally and plainly.** First person, complete sentences, normal capitalisation, no contractions in
  page text. Say what something is or does; don't sell it.
- **No em dashes or en dashes** used as punctuation. Use a comma, a colon, parentheses or a new sentence instead.
  (A hyphen inside a compound word, such as "first-year", is fine.)
- **Avoid buzzwords and typical AI phrasing.** For example: "passionate about", "journey", "dive into", "delve",
  "explore", "leverage", "seamless", "robust", "cutting-edge", "showcase", "unlock", "elevate", "in today's world",
  "whether you're X or Y", "it's not just X, it's Y", lists of three used for rhythm, and closing sentences that
  summarise what was just said. No hype, no emoji, no exclamation marks.
- Entries Vivien writes himself (status values, site updates, interests) are his; keep their meaning when editing.
- Don't invent facts about him. Use obvious `(placeholder)` text where real info is needed.
- No filler: no decorative buttons, badges, widgets, "back to top" buttons, footers, or links to placeholder URLs.
  Every link should go somewhere real.
- Use semantic HTML: headings in order, real lists and tables, `<th scope="row">` for row labels, alt text on images.
- Keep a working layout at phone widths (under 40em).
- Keep it simple enough that a non-programmer can edit it.

## Previewing locally (optional)

You don't need this, because pushing to GitHub is enough. To preview locally with Ruby installed:

```sh
bundle install
bundle exec jekyll serve          # add --drafts to include drafts
# open http://localhost:4000/
```

If the build complains about "Invalid US-ASCII character", run `export LANG=C.UTF-8` first.

Before finishing a change, agents should run `bundle exec jekyll build` and make sure it succeeds without errors.
Then check that new internal links use `relative_url` and that no `<script>` tags or external requests crept in.

## Deploying

The repository is named `meowzerskittycat.github.io`, so GitHub Pages serves the site at the root of
`https://meowzerskittycat.github.io/`. That's why `baseurl` in `_config.yml` is empty and `url` is that address.

Publishing: Settings → **Pages** → Build and deployment → Source: **Deploy from a branch**, branch **`main`**, folder
**`/ (root)`**. Every push to `main` redeploys in about a minute.

- **Custom domain:** add it under Settings → Pages → Custom domain, then set `url:` in `_config.yml` to it.
  `baseurl` stays empty.
- **Don't rename the repository.** Any other name moves the site into a sub-folder (`/<repo-name>/`), and
  `baseurl` would then have to be set to `"/<repo-name>"`.
