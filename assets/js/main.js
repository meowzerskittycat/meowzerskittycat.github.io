/* ♡ little bits of magic ♡
   Everything here is optional ─ the site works fine without it. */

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── semester progress bar (uni page) ── */
  var wrap = document.querySelector(".progress-wrap");
  if (wrap) {
    var start = new Date(wrap.dataset.start + "T00:00:00");
    var end = new Date(wrap.dataset.end + "T23:59:59");
    var pct = Math.round(((Date.now() - start) / (end - start)) * 100);
    pct = Math.min(100, Math.max(0, isNaN(pct) ? 0 : pct));
    var label = pct >= 100 ? "done!! ✿" : pct <= 0 ? "not started yet ♡" : pct + "%";
    wrap.querySelector(".progress-text").textContent = label;
    wrap.querySelector(".progress").setAttribute("aria-valuenow", pct);
    requestAnimationFrame(function () {
      wrap.querySelector(".progress-fill").style.width = pct + "%";
    });
  }

  /* ── sparkle cursor trail ──
     To turn it off, change `true` to `false` on the next line. */
  var SPARKLES_ON = true;
  if (!SPARKLES_ON || reduceMotion || window.matchMedia("(hover: none)").matches) return;

  var symbols = ["✦", "✧", "♡", "⋆", "˚"];
  var colors = ["#d9668f", "#9b6fb3", "#ffb6cf", "#e8b84a"];
  var last = 0;

  document.addEventListener("mousemove", function (e) {
    var now = Date.now();
    if (now - last < 60) return; // don't make too many
    last = now;
    var s = document.createElement("span");
    s.className = "sparkle";
    s.setAttribute("aria-hidden", "true");
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = e.clientX + 6 + "px";
    s.style.top = e.clientY + 6 + "px";
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  });
})();
