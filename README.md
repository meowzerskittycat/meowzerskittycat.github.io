# meowzers

A plain, text-first personal site (uni, music, things I like), in the spirit of suckless.org.
Hosted on GitHub Pages.

Live at: https://meowzerskittycat.github.io/website/

## Turning it on (one time)

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment**, choose **Source: Deploy from a branch**.
3. Pick branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Wait a minute or two, then visit the link above.

## Editing

Everything is plain text; you can edit it on github.com (open a file, click the pencil):

- `_config.yml`: name, tagline, status table, social links
- `index.md`, `about.md`: home and about page text
- `_data/music.yml`: the music page (what you're making, setup, what you listen to)
- `_data/uni.yml`: classes, to-do list, semester dates
- `_data/updates.yml`: the news list on the home page
- `assets/css/site.css`: colors (variables at the top)

See [AGENTS.md](AGENTS.md) for the full map of the site, how to add pages, and the rules for keeping it
simple and GitHub Pages–compatible. It's written so AI coding assistants can help you edit safely too.
