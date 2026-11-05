# meowzerskittycat.github.io

Vivien's personal introduction page, served by GitHub Pages.

Plain static files, no build step:

- `index.html` – the page
- `style.css` – type, colour and layout
- `scene.js` – draws the pixel-art polar night (mountains, fjord, aurora, moonlit water, cabin) and the snowy shore at the page foot; animates at 10 fps, wipes the name in on arrival, and stays still for visitors who prefer reduced motion
- `og.png` – the link preview image (a capture of the hero)
- `tools/og.js` – regenerates `og.png` and its cache-busting `?v=` hash in `index.html`; run `node tools/og.js` after any visual change (needs Playwright)
- `favicon.svg`, `apple-touch-icon.png` – a pixel peak under the aurora
- `fonts/` – Pixelify Sans, self-hosted (SIL Open Font License, see `fonts/OFL.txt`)

Preview locally with any static server, e.g. `python3 -m http.server`.
