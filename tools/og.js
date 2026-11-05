// Regenerates og.png (the link preview) from the live scene and stamps its hash
// into index.html's og:image URL, so sites that cache previews by URL refetch it.
// Run from the repo root after any visual change:  node tools/og.js
// Needs Playwright with Chromium available to Node.
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };

const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split("?")[0]).replace(/\/$/, "/index.html"));
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(0, async () => {
  const browser = await chromium.launch();
  // 1280 wide gives the scene its 4-screen-pixel grid; 686 tall makes the hero (92vh) fill 630.
  // Reduced motion renders the scene's fixed still frame, so the image is the same every run.
  const page = await browser.newPage({ viewport: { width: 1280, height: 686 }, reducedMotion: "reduce" });
  // Mark the session as seen so the first-visit loading hold is skipped, then wait for the
  // page to lift .wait anyway: the capture must be the scene, never the loader.
  await page.addInitScript(() => { try { sessionStorage.setItem("seen", "1"); } catch (x) {} });
  await page.goto(`http://localhost:${server.address().port}/`);
  await page.addStyleTag({ content: ".cue { display: none !important; }" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => !document.documentElement.classList.contains("wait"), null, { timeout: 10000 });
  await page.waitForTimeout(500);
  const out = path.join(root, "og.png");
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  server.close();

  const hash = crypto.createHash("sha256").update(fs.readFileSync(out)).digest("hex").slice(0, 8);
  const index = path.join(root, "index.html");
  fs.writeFileSync(index, fs.readFileSync(index, "utf8").replace(/og\.png(\?v=[0-9a-f]+)?"/g, `og.png?v=${hash}"`));
  console.log(`og.png written, og:image now ?v=${hash}`);
});
