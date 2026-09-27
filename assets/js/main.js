/* Small bits of JavaScript. The site works fine without it. */

(function () {
  /* ── semester progress bar (uni page) ── */
  var wrap = document.querySelector(".progress-wrap");
  if (!wrap) return;

  var start = new Date(wrap.dataset.start + "T00:00:00");
  var end = new Date(wrap.dataset.end + "T23:59:59");
  var pct = Math.round(((Date.now() - start) / (end - start)) * 100);
  pct = Math.min(100, Math.max(0, isNaN(pct) ? 0 : pct));
  var label = pct >= 100 ? "done" : pct <= 0 ? "not started" : pct + "%";

  wrap.querySelector(".progress-text").textContent = label;
  wrap.querySelector(".progress").setAttribute("aria-valuenow", pct);
  requestAnimationFrame(function () {
    wrap.querySelector(".progress-fill").style.width = pct + "%";
  });
})();
