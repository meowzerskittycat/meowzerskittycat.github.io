# Vivien

Vivien's personal site and blog. Plain HTML in the spirit of suckless.org,
hosted on GitHub Pages.

Live at https://meowzerskittycat.github.io/

## Publishing

GitHub Pages builds the site from **`main`** (Settings → Pages → Deploy from a branch, folder **`/ (root)`**).
Every push to `main` goes live in about a minute. Keep the repository name as `meowzerskittycat.github.io`;
that's what puts the site at the root of the address.

## Writing a post

Add a Markdown file to `_posts/` named like `2026-10-04-my-post.md`:

```markdown
---
title: "My post"
description: "One sentence shown on the Blog page."
---

Text goes here.
```

Push it and it shows up on the Blog page. `_posts/2026-09-27-lorem-ipsum.md` shows every Markdown feature the
site supports. Music goes in posts too. Unfinished posts can go in `_drafts/`, which is never published.

## Editing everything else

Everything is plain text; you can edit it on github.com (open a file, click the pencil):

- `_config.yml`: name, tagline, status table
- `index.md`, `about.md`, `status.md`: page text
- `_data/updates.yml`: the site updates list on the status page
- `_data/favorites.yml`, `_data/links.yml`: lists on the about and links pages
- `assets/css/site.css`: colors (variables at the top)

See [AGENTS.md](AGENTS.md) for the full map of the site and the rules for keeping it simple and
GitHub Pages–compatible. It's written so AI coding assistants can help you edit safely too.
