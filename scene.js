// Polar night: a procedural pixel-art fjord drawn into a low-resolution canvas
// and scaled up with crisp pixels. Same scene every visit (fixed seed).
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const C = {
    space: hex("#071a31"),
    deep: hex("#0a2240"),
    night: hex("#0f2b4c"),
    ridge: hex("#1c3b5e"),
    fjord: hex("#1e5568"),
    frost: hex("#e3f2fd"),
    ice: hex("#90caf9"),
    glacier: hex("#2196f3"),
    abyss: hex("#0d47a1"),
    snow: hex("#f3f3f3"),
    snowLit: hex("#86aed2"),
    snowShade: hex("#3b6590"),
    farRock: hex("#1f4266"),
    farShade: hex("#163252"),
    midRock: hex("#13304f"),
    midSnow: hex("#5a86ae"),
    midShade: hex("#2c5479"),
    near: hex("#0a1e36"),
    pine: hex("#06152a"),
    cabin: hex("#081829"),
    lamp: hex("#f2b45a"),
    ember: hex("#7a5531"),
  };

  // 4x4 Bayer matrix, normalised to (0,1)
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  const dither = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];

  // Deterministic noise
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function valueNoise(seed, n = 256) {
    const r = rng(seed);
    const v = Array.from({ length: n }, r);
    return (x) => {
      const i = Math.floor(x), f = x - i;
      const a = v[((i % n) + n) % n], b = v[(((i + 1) % n) + n) % n];
      const s = f * f * (3 - 2 * f);
      return a + (b - a) * s;
    };
  }
  const fbm = (noise, x, oct) => {
    let sum = 0, amp = 0.5, freq = 1, norm = 0;
    for (let o = 0; o < oct; o++) { sum += amp * noise(x * freq); norm += amp; amp *= 0.5; freq *= 2.03; }
    return sum / norm;
  };
  const nFar = valueNoise(7), nMid = valueNoise(19), nNear = valueNoise(41), nRay = valueNoise(73);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let W = 0, H = 0, horizon = 0, scale = 4;
  let img, buf, base; // base: static scene above the waterline (0 = sky)
  let stars = [];
  let cabin = null;

  function layout() {
    const rect = canvas.getBoundingClientRect();
    // aim for roughly 320 art pixels across on desktop, never smaller than 3 screen px each
    scale = Math.max(3, Math.round(rect.width / 320));
    W = Math.max(80, Math.ceil(rect.width / scale));
    H = Math.max(80, Math.ceil(rect.height / scale));
    canvas.width = W;
    canvas.height = H;
    // portrait screens get a taller fjord so the name can sit on dark water
    const portrait = H > W * 1.15;
    canvas.parentElement.toggleAttribute("data-portrait", portrait);
    horizon = Math.round(H * (portrait ? 0.6 : 0.8));
    img = ctx.createImageData(W, H);
    buf = new Uint32Array(img.data.buffer);
    buildStatic();
  }

  const pack = (c) => (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];

  function buildStatic() {
    base = new Uint32Array(W * H);
    const span = W / 64; // noise units across the width, stable as the window resizes

    const hz = horizon;

    // a range is a set of peaks; each column belongs to whichever peak stands tallest there
    function range(seed, spacing, minH, maxH, baseY, rightBias) {
      const r = rng(seed);
      const peaks = [];
      for (let x = -spacing * 0.5; x < W + spacing; x += spacing * (0.6 + r() * 0.8)) {
        const lean = rightBias ? 0.6 + 0.4 * smooth(0, 0.85, x / W) : 1;
        peaks.push({
          x: Math.round(x),
          y: baseY - (minH + r() * (maxH - minH)) * lean,
          sl: 0.55 + r() * 0.5, // left slope
          sr: 0.55 + r() * 0.5, // right slope
        });
      }
      const top = new Array(W), owner = new Array(W);
      for (let x = 0; x < W; x++) {
        let best = Infinity, who = peaks[0];
        for (const p of peaks) {
          const dx = x - p.x;
          const y = p.y + (dx < 0 ? -dx * p.sl : dx * p.sr);
          if (y < best) { best = y; who = p; }
        }
        top[x] = Math.round(best + (fbm(nFar, x * 0.21 + seed, 2) - 0.5) * 3);
        owner[x] = who;
      }
      return { top, owner };
    }

    const far = range(5, Math.max(26, W * 0.09), hz * 0.14, hz * 0.34, hz * 0.84, true);
    const mid = range(23, Math.max(18, W * 0.06), hz * 0.04, hz * 0.13, hz * 0.94, false);
    const nearTop = [];
    for (let x = 0; x < W; x++) nearTop[x] = Math.round(hz - 2 - fbm(nNear, (x / W) * span * 2.2, 3) * hz * 0.07);

    for (let x = 0; x < W; x++) {
      const pf = far.owner[x], pm = mid.owner[x];
      const litFar = x >= pf.x; // east faces catch the aurora
      const litMid = x >= pm.x;
      const farH = hz * 0.84 - pf.y;
      const snowDepth = Math.max(0, (farH - hz * 0.08) * 0.75) + (fbm(nNear, x * 0.37, 2) - 0.5) * 7;
      const midH = hz * 0.94 - pm.y;
      const midCap = Math.max(0, (midH - hz * 0.07) * 0.6) + (fbm(nMid, x * 0.5, 2) - 0.5) * 3;
      for (let y = 0; y < horizon; y++) {
        let c = null;
        if (y >= nearTop[x]) c = C.near;
        else if (y >= mid.top[x]) {
          const depth = y - pm.y - Math.abs(x - pm.x) * 0.15;
          c = depth < midCap ? (litMid ? C.midSnow : C.midShade) : C.midRock;
        } else if (y >= far.top[x]) {
          const depth = y - pf.y - Math.abs(x - pf.x) * 0.25;
          if (depth < snowDepth) c = litFar ? (y - far.top[x] < 1 ? C.frost : C.snowLit) : C.snowShade;
          else c = litFar ? C.farRock : C.farShade;
        }
        if (c) base[y * W + x] = pack(c);
      }
    }

    // pines on the near shore
    const r = rng(1234);
    const cabinX = Math.round(W * 0.74);
    for (let x = 2; x < W - 2; x++) {
      if (Math.abs(x - cabinX) < 9) continue;
      if (r() > 0.36) continue;
      const h = 4 + Math.floor(r() * (H > 160 ? 11 : 7));
      const top = nearTop[x] - h;
      for (let k = 0; k <= h; k++) {
        const hw = Math.floor((k / h) * 2.6 + ((k % 3) === 0 ? 0 : 0.6));
        for (let dx = -hw; dx <= hw; dx++) {
          const px = x + dx, py = top + k;
          if (px >= 0 && px < W && py >= 0 && py < horizon) base[py * W + px] = pack(C.pine);
        }
      }
    }

    // the cabin: dark timber, snow on the roof, one lit window
    const groundY = nearTop[cabinX];
    const bx = cabinX - 4, by = groundY - 5;
    cabin = { wx: cabinX - 1, wy: by + 2 };
    const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < horizon) base[y * W + x] = pack(c); };
    for (let y = by; y <= groundY + 1; y++) for (let x = bx; x < bx + 9; x++) set(x, y, C.cabin);
    for (let k = 0; k < 5; k++) {
      for (let x = bx - 1 + k; x < bx + 10 - k; x++) set(x, by - 1 - k, C.cabin);
      set(bx - 1 + k, by - 1 - k, C.frost);
      set(bx + 9 - k, by - 1 - k, C.frost);
      set(bx - 2 + k, by - k, C.ice);
      set(bx + 10 - k, by - k, C.ice);
    }
    set(bx + 4, by - 5, C.frost);
    for (let y = by - 6; y < by - 2; y++) set(bx + 6, y, C.cabin); // chimney
    set(bx + 6, by - 7, C.frost);
    set(cabin.wx, cabin.wy, C.lamp); set(cabin.wx + 1, cabin.wy, C.lamp);
    set(cabin.wx, cabin.wy + 1, C.lamp); set(cabin.wx + 1, cabin.wy + 1, C.ember);

    // stars, only over open sky
    const rs = rng(99);
    stars = [];
    const count = Math.round((W * H) / 260);
    for (let i = 0; i < count; i++) {
      const x = Math.floor(rs() * W), y = Math.floor(rs() * H * 0.55);
      if (base[y * W + x]) continue;
      stars.push({ x, y, c: rs() > 0.8 ? C.frost : C.ice, tw: rs() > 0.75, ph: rs() * 6.28 });
    }
  }

  // sky ramp: space -> night -> ridge, dithered between steps
  const SKY = [C.space, C.night, C.ridge];
  // aurora ramp from faint to bright
  const AUR = [C.abyss, C.glacier, C.ice, C.frost];

  function ramp(steps, v, x, y) {
    const n = steps.length - 1;
    const p = Math.max(0, Math.min(n, v * n));
    const i = Math.min(n - 1, Math.floor(p));
    return p - i > dither(x, y) ? steps[i + 1] : steps[i];
  }

  function aurora(x, y, t) {
    const u = x / W;
    // two curtains drifting across the right two thirds of the sky
    let best = 0;
    for (let k = 0; k < 2; k++) {
      const env = k === 0 ? smooth(0.28, 0.5, u) * (1 - smooth(0.92, 1.08, u)) : smooth(0.5, 0.7, u) * (1 - smooth(0.98, 1.2, u)) * 0.6;
      if (env <= 0) continue;
      const bottom = horizon * (k === 0 ? 0.44 : 0.32)
        + Math.sin(u * 6.0 + t * 0.3 + k * 2) * horizon * 0.08
        + Math.sin(u * 17.0 - t * 0.6) * horizon * 0.02;
      const d = bottom - y;
      if (d < -1 || d > horizon * 0.4) continue;
      const len = horizon * (0.2 + 0.14 * nRay(u * 9 + k * 40 + t * 0.15));
      const rays = 0.3 + 0.7 * Math.pow(nRay(x * 0.45 + t * 1.1 + k * 90), 1.4);
      const prof = d < 0 ? 0.5 : d < 2 ? 1 : Math.max(0, 1 - d / len);
      const hem = d >= 0 && d < 2 ? 0.35 : 0;
      const v = env * (rays * prof * prof + hem) * (k === 0 ? 0.8 : 0.55);
      if (v > best) best = v;
    }
    return best;
  }
  function smooth(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  function draw(t) {
    // sky, aurora and the static land above the waterline
    for (let y = 0; y < horizon; y++) {
      const skyV = Math.pow(y / horizon, 1.3);
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (base[i]) { buf[i] = base[i]; continue; }
        const a = aurora(x, y, t);
        if (a > 0.12 && a > dither(x + 1, y) * 0.3) {
          buf[i] = pack(ramp(AUR, (a - 0.12) / 0.8, x, y));
        } else {
          buf[i] = pack(ramp(SKY, skyV, x, y));
        }
      }
    }
    for (const s of stars) {
      const i = s.y * W + s.x;
      if (buf[i] !== pack(ramp(SKY, Math.pow(s.y / horizon, 1.3), s.x, s.y))) continue; // hidden by aurora
      if (s.tw && Math.sin(t * 2.2 + s.ph) < -0.55) continue;
      buf[i] = pack(s.c);
    }

    // the fjord: a darkened, rippling mirror that settles into the page colour
    const depthRows = H - horizon;
    for (let y = horizon; y < H; y++) {
      const d = (y - horizon) / depthRows;
      const wob = Math.round(Math.sin((y - horizon) * 0.9 + t * 1.8) * (0.6 + d * 2.2));
      const sy = Math.max(0, horizon - 1 - Math.round((y - horizon) * 1.15));
      const fade = (horizon < H * 0.7 ? 0.45 : 0.6) - d * 0.35;
      for (let x = 0; x < W; x++) {
        const sx = Math.min(W - 1, Math.max(0, x + wob));
        const s = buf[sy * W + sx];
        const r = s & 255, g = (s >> 8) & 255, b = (s >> 16) & 255;
        let c = [
          r * fade + C.deep[0] * (1 - fade) * 0.9 + C.fjord[0] * 0.08,
          g * fade + C.deep[1] * (1 - fade) * 0.9 + C.fjord[1] * 0.08,
          b * fade + C.deep[2] * (1 - fade) * 0.9 + C.fjord[2] * 0.08,
        ];
        // bottom rows dissolve into the page colour so the night flows into the text
        if (d > 0.75 && (d - 0.75) / 0.25 > dither(x, y)) c = C.deep;
        buf[y * W + x] = pack(c.map(Math.round));
      }
      // a few ice glints on the water
      const g = Math.floor(nRay(y * 3.1 + t * 0.8) * W * 1.3);
      if (g < W && d < 0.7) for (let k = 0; k < 2 + (y % 3); k++) if (g + k < W) buf[y * W + g + k] = pack(C.ridge);
    }

    // lamplight reflected beneath the cabin
    if (cabin) {
      for (let y = horizon + 1; y < Math.min(H, horizon + Math.round(depthRows * 0.6)); y += 2) {
        const flick = Math.sin(y * 1.7 + t * 3) > -0.2;
        if (!flick) continue;
        const x = cabin.wx + Math.round(Math.sin(y * 0.9 + t * 1.8) * 1.2);
        const c = (y - horizon) < depthRows * 0.25 ? C.lamp : C.ember;
        if (x >= 0 && x + 1 < W) { buf[y * W + x] = pack(c); if (y % 4 === 1) buf[y * W + x + 1] = pack(C.ember); }
      }
    }

    ctx.putImageData(img, 0, 0);
  }

  // ---- loop: 10 frames a second, only while visible ----
  let visible = true, raf = 0, last = 0, start = performance.now();
  const FRAME = 100;

  function tick(now) {
    raf = 0;
    if (!visible || reduceMotion.matches || document.hidden) return;
    if (now - last >= FRAME) { last = now; draw((now - start) / 1000); }
    raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (!raf && visible && !reduceMotion.matches && !document.hidden) raf = requestAnimationFrame(tick);
  }

  function render() {
    layout();
    draw(reduceMotion.matches ? 4 : (performance.now() - start) / 1000);
    kick();
  }

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 120);
  }).observe(canvas);

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    kick();
  }).observe(canvas);

  document.addEventListener("visibilitychange", kick);
  reduceMotion.addEventListener?.("change", render);

  render();
})();
