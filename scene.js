// Polar night: a procedural pixel-art fjord drawn into a low-resolution canvas
// and scaled up with crisp pixels. Same scene every visit (fixed seeds).
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  const shoreCanvas = document.getElementById("shore");

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const C = {
    space: hex("#071a31"),
    deep: hex("#0f2b4c"), // the page field below the waterline
    night: hex("#0f2b4c"),
    ridge: hex("#1c3b5e"),
    fjord: hex("#1e5568"),
    frost: hex("#e3f2fd"),
    ice: hex("#90caf9"),
    glacier: hex("#2196f3"),
    abyss: hex("#0d47a1"),
    haze: hex("#24496f"),
    hazeSnow: hex("#4a76a0"),
    snowLit: hex("#a4c5e2"),
    snowMid: hex("#7fa7cc"),
    snowShade: hex("#46719c"),
    farRock: hex("#1b3c60"),
    farShade: hex("#132e4e"),
    hill: hex("#0f2745"),
    hillTree: hex("#0b1f3a"),
    hillSnow: hex("#3f6a94"),
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
  const nRib = valueNoise(88), nCouloir = valueNoise(131), nSnow = valueNoise(57);
  function smooth(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  const pack = (c) => (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let W = 0, H = 0, horizon = 0, scale = 4;
  let img, buf, base; // base: static scene above the waterline (0 = sky)
  let stars = [], flakes = [];
  let cabin = null;

  function layout() {
    const rect = canvas.getBoundingClientRect();
    // 3 or 4 screen px per art pixel; the name in CSS is set on a 2-art-pixel grid from this
    scale = Math.min(4, Math.max(3, Math.floor(rect.width / 320)));
    document.documentElement.style.setProperty("--scene-px", scale + "px");
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

  // ---------------------------------------------------------------- terrain

  // Peaks with uneven spacing, mostly modest heights, a few tall ones, and
  // shoulders on their flanks so ridgelines step instead of running straight.
  function makePeaks(seed, o) {
    const r = rng(seed);
    const peaks = [];
    for (let x = -o.spacing; x < W + o.spacing; x += o.spacing * (0.45 + r() * 1.3)) {
      const h = o.minH + (o.maxH - o.minH) * Math.pow(r(), 1.7);
      const p = { x: Math.round(x), y: o.baseY - h, sl: o.slope[0] + r() * (o.slope[1] - o.slope[0]), sr: o.slope[0] + r() * (o.slope[1] - o.slope[0]) };
      peaks.push(p);
      if (o.shoulders && r() < 0.6) {
        const side = r() < 0.5 ? -1 : 1;
        const d = 4 + r() * o.spacing * 0.35;
        const s = side < 0 ? p.sl : p.sr;
        peaks.push({ x: Math.round(p.x + side * d), y: p.y + d * s - (2 + r() * 4), sl: p.sl * 1.15, sr: p.sr * 1.15 });
      }
    }
    if (o.horn) peaks.push(o.horn);
    return peaks;
  }

  function ridge(peaks, jagSeed, jagAmp) {
    const top = new Array(W), owner = new Array(W);
    for (let x = 0; x < W; x++) {
      let best = Infinity, who = peaks[0];
      for (const p of peaks) {
        const dx = x - p.x;
        const y = p.y + (dx < 0 ? -dx * p.sl : dx * p.sr);
        if (y < best) { best = y; who = p; }
      }
      // ragged crest: mostly small steps, occasional notches
      const j = fbm(nFar, x * 0.23 + jagSeed, 3) - 0.5;
      top[x] = Math.round(best + j * jagAmp + (nRib(x * 0.9 + jagSeed) > 0.85 ? 1 : 0));
      owner[x] = who;
    }
    return { top, owner };
  }

  function buildStatic() {
    base = new Uint32Array(W * H);
    const hz = horizon;
    const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < horizon) base[y * W + x] = pack(c); };

    // 0. a hazy back range, low contrast, for depth
    const haze = ridge(makePeaks(301, { spacing: Math.max(16, W * 0.05), minH: hz * 0.06, maxH: hz * 0.2, baseY: hz * 0.78, slope: [0.5, 0.9] }), 3, 3);

    // 1. the alpine range, anchored by one tall horn
    const hornX = Math.round(W * (W > H ? 0.63 : 0.7));
    const far = ridge(makePeaks(5, {
      spacing: Math.max(22, W * 0.075), minH: hz * 0.08, maxH: hz * 0.3, baseY: hz * 0.86,
      slope: [0.45, 1.25], shoulders: true,
      horn: { x: hornX, y: hz * 0.86 - hz * 0.42, sl: 1.35, sr: 0.95 },
    }), 11, 4);

    // 2. forested foothills
    const hillTop = [];
    for (let x = 0; x < W; x++) {
      const u = x / W * (W / 64);
      hillTop[x] = Math.round(hz * 0.95 - (0.35 + 0.65 * fbm(nMid, u * 1.4 + 4, 4)) * hz * 0.12);
    }

    // 3. the near shore
    const nearTop = [];
    for (let x = 0; x < W; x++) nearTop[x] = Math.round(hz - 2 - fbm(nNear, (x / W) * (W / 64) * 2.2, 3) * hz * 0.06);

    const snowline = (x) => hz * 0.67 + (fbm(nSnow, x * 0.06, 3) - 0.5) * hz * 0.1;

    for (let x = 0; x < W; x++) {
      const jag = (fbm(nMid, x * 0.4 + 7, 2) - 0.5) * 4;
      const sl = snowline(x);
      for (let y = 0; y < horizon; y++) {
        let c = null;
        if (y >= nearTop[x]) c = C.near;
        else if (y >= hillTop[x]) {
          c = C.hill;
        } else if (y >= far.top[x]) {
          const p = far.owner[Math.max(0, Math.min(W - 1, Math.round(x - (y - far.top[x]) * 0.6)))];
          const lit = x >= p.x - (y - p.y) * 0.4 + jag; // east faces catch the aurora
          const side = x >= p.x ? 1 : -1;
          // rock ribs run down the fall line; couloirs carry snow below the snowline
          const along = (x - p.x) - side * (y - p.y) * 0.75;
          const rib = nRib(along * 0.3 + p.x) > 0.8 && y - far.top[x] > 3 && y > p.y + (sl - p.y) * 0.35;
          const couloir = nCouloir(along * 0.35 + p.x * 0.3) > 0.78 && y < sl + hz * 0.07;
          const snowy = (y < sl && !rib) || couloir || (y - far.top[x] < 1 && y < sl + hz * 0.05);
          if (snowy) {
            if (!lit) c = C.snowShade;
            else if (y - far.top[x] < 1) c = C.frost;
            else c = dither(x, y) > 0.8 && nSnow(x * 0.3 + y * 0.2) > 0.5 ? C.snowMid : C.snowLit;
          } else c = lit ? C.farRock : C.farShade;
        } else if (y >= haze.top[x]) {
          c = y < hz * 0.6 && y - haze.top[x] < 3 && dither(x, y) > 0.3 ? C.hazeSnow : C.haze;
        }
        if (c) base[y * W + x] = pack(c);
      }
    }

    // a comb of small pines along the foothill crests
    const rh = rng(4321);
    for (let x = 1; x < W - 1; x++) {
      if (rh() > 0.15 + 0.5 * smooth(0.4, 0.65, fbm(nMid, x * 0.08 + 30, 2))) continue;
      const h = 2 + Math.floor(rh() * 3);
      for (let k = 0; k <= h; k++) {
        const hw = k >= h - 0 ? 1 : 0;
        for (let dx = -hw; dx <= hw; dx++) {
          const y = hillTop[x] - h + k;
          if (y >= 0 && y < nearTop[x]) set(x + dx, y, C.hillTree);
        }
      }
    }

    // pines on the near shore, in stands and clearings
    const r = rng(1234);
    const cabinX = Math.round(W * 0.74);
    for (let x = 2; x < W - 2; x++) {
      if (Math.abs(x - cabinX) < 9) continue;
      if (r() > 0.08 + 0.55 * smooth(0.35, 0.7, fbm(nNear, x * 0.06 + 50, 2))) continue;
      const h = 4 + Math.floor(r() * (H > 160 ? 11 : 7));
      const top = nearTop[x] - h;
      for (let k = 0; k <= h; k++) {
        const hw = Math.floor((k / h) * 2.6 + ((k % 3) === 0 ? 0 : 0.6));
        for (let dx = -hw; dx <= hw; dx++) {
          set(x + dx, top + k, C.pine);
        }
      }
    }

    // the cabin: dark timber, snow on the roof, one lit window
    const groundY = nearTop[cabinX];
    const bx = cabinX - 4, by = groundY - 5;
    cabin = { wx: cabinX - 1, wy: by + 2, chimney: [bx + 6, by - 7] };
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

    // a crescent moon
    const mr = Math.max(3, Math.round(Math.min(W, H) * 0.028));
    const mx = Math.round(W * (W > H ? 0.45 : 0.22)), my = Math.round(H * (W > H ? 0.12 : 0.08));
    for (let y = -mr - 1; y <= mr + 1; y++) for (let x = -mr - 1; x <= mr + 1; x++) {
      const inA = x * x + y * y <= mr * mr + mr * 0.4;
      const bx2 = x - mr * 0.6, by2 = y + mr * 0.3;
      const inB = bx2 * bx2 + by2 * by2 <= mr * mr;
      if (inA && !inB) {
        const rim = (x - 1) * (x - 1) + y * y > mr * mr - mr; // softer limb
        set(mx + x, my + y, rim ? C.ice : C.frost);
      }
    }

    // stars, only over open sky
    const rs = rng(99);
    stars = [];
    const count = Math.round((W * H) / 220);
    for (let i = 0; i < count; i++) {
      const x = Math.floor(rs() * W), y = Math.floor(rs() * H * 0.6);
      if (base[y * W + x]) continue;
      stars.push({ x, y, c: rs() > 0.8 ? C.frost : C.ice, tw: rs() > 0.7, ph: rs() * 6.28, big: rs() > 0.96 });
    }

    // snow, falling at two depths
    const rf = rng(512);
    flakes = [];
    const fc = Math.round((W * H) / 520);
    for (let i = 0; i < fc; i++) {
      const nearFlake = rf() > 0.7;
      flakes.push({ x: rf() * W, y: rf() * H, sp: nearFlake ? 7 + rf() * 5 : 2.5 + rf() * 3, sw: 0.6 + rf() * 1.6, ph: rf() * 6.28, c: nearFlake ? C.frost : C.ice });
    }
  }

  // ---------------------------------------------------------------- sky

  const SKY = [C.space, C.night, C.ridge];
  const AUR = [C.abyss, C.glacier, C.ice, C.frost];

  function ramp(steps, v, x, y) {
    const n = steps.length - 1;
    const p = Math.max(0, Math.min(n, v * n));
    const i = Math.min(n - 1, Math.floor(p));
    return p - i > dither(x, y) ? steps[i + 1] : steps[i];
  }

  function aurora(x, y, t) {
    const u = x / W;
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

  function draw(t) {
    for (let y = 0; y < horizon; y++) {
      const skyV = Math.pow(y / horizon, 1.3);
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (base[i]) { buf[i] = base[i]; continue; }
        const a = aurora(x, y, t);
        buf[i] = pack(a > 0.12 && a > dither(x + 1, y) * 0.3 ? ramp(AUR, (a - 0.12) / 0.8, x, y) : ramp(SKY, skyV, x, y));
      }
    }
    for (const s of stars) {
      const i = s.y * W + s.x;
      if (buf[i] !== pack(ramp(SKY, Math.pow(s.y / horizon, 1.3), s.x, s.y))) continue; // hidden by aurora
      if (s.tw && Math.sin(t * 2.2 + s.ph) < -0.55) continue;
      buf[i] = pack(s.c);
      if (s.big && Math.sin(t * 1.3 + s.ph) > 0.2) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const j = (s.y + dy) * W + s.x + dx;
          if (s.x + dx >= 0 && s.x + dx < W && s.y + dy >= 0 && !base[j]) buf[j] = pack(C.abyss);
        }
      }
    }

    // a shooting star every eleven seconds or so
    const cyc = Math.floor(t / 11), lt = t - cyc * 11;
    if (lt < 0.8) {
      const rr = rng(cyc * 7 + 3);
      const x0 = W * (0.15 + rr() * 0.6), y0 = H * (0.04 + rr() * 0.16);
      const p = lt / 0.8;
      for (let k = 0; k < 8; k++) {
        const x = Math.round(x0 + p * W * 0.12 - k), y = Math.round(y0 + (p * W * 0.12 - k) * 0.4);
        if (x < 0 || x >= W || y < 0 || y >= horizon || base[y * W + x]) continue;
        buf[y * W + x] = pack(k < 2 ? C.frost : k < 5 ? C.ice : C.glacier);
      }
    }

    // the fjord: a rippling mirror, fjord-tinted, settling into the page colour
    const depthRows = H - horizon;
    for (let y = horizon; y < H; y++) {
      const d = (y - horizon) / depthRows;
      const wob = Math.round(Math.sin((y - horizon) * 0.9 + t * 1.8) * (0.6 + d * 2.2));
      const sy = Math.max(0, horizon - 1 - Math.round((y - horizon) * 1.15));
      const fade = (horizon < H * 0.7 ? 0.3 : 0.4) * Math.pow(1 - d, 1.5);
      const tint = Math.pow(1 - d, 0.6);
      const water = [0, 1, 2].map((k) => C.deep[k] + (C.fjord[k] - C.deep[k]) * tint);
      for (let x = 0; x < W; x++) {
        const sx = Math.min(W - 1, Math.max(0, x + wob));
        const s = buf[sy * W + sx];
        const r = s & 255, g = (s >> 8) & 255, b = (s >> 16) & 255;
        let c = [r * fade + water[0] * (1 - fade), g * fade + water[1] * (1 - fade), b * fade + water[2] * (1 - fade)];
        if (d > 0.82 && (d - 0.82) / 0.18 > dither(x, y)) c = C.deep;
        buf[y * W + x] = pack(c.map(Math.round));
      }
      const g = Math.floor(nRay(y * 3.1 + t * 0.8) * W * 1.3);
      if (g < W && d < 0.55) for (let k = 0; k < 2 + (y % 3); k++) if (g + k < W) buf[y * W + g + k] = pack(C.fjord);
    }

    // lamplight reflected beneath the cabin, and a thread of chimney smoke
    if (cabin) {
      for (let y = horizon + 1; y < Math.min(H, horizon + Math.round(depthRows * 0.6)); y += 2) {
        if (Math.sin(y * 1.7 + t * 3) <= -0.2) continue;
        const x = cabin.wx + Math.round(Math.sin(y * 0.9 + t * 1.8) * 1.2);
        const c = (y - horizon) < depthRows * 0.25 ? C.lamp : C.ember;
        if (x >= 0 && x + 1 < W) { buf[y * W + x] = pack(c); if (y % 4 === 1) buf[y * W + x + 1] = pack(C.ember); }
      }
      const [cx, cy] = cabin.chimney;
      for (let k = 1; k < 14; k++) {
        const y = cy - k;
        const x = cx + Math.round(Math.sin(k * 0.5 - t * 1.2) * (k * 0.18) + k * 0.25);
        if (y < 0 || x < 0 || x >= W || (k + Math.floor(t * 4)) % 5 === 0) continue;
        if (k > 9 && dither(x, y) > 0.5) continue;
        buf[y * W + x] = pack(k < 6 ? C.snowShade : C.haze);
      }
    }

    // snowfall over everything above the deep water
    for (const f of flakes) {
      const y = Math.floor((f.y + t * f.sp) % H);
      const x = Math.floor(((f.x + Math.sin(t * 0.7 + f.ph) * f.sw * 2) % W + W) % W);
      if (y > H * 0.9) continue;
      buf[y * W + x] = pack(f.c);
    }

    ctx.putImageData(img, 0, 0);
  }

  // ---------------------------------------------------------------- the shore (page foot)

  function drawShore() {
    if (!shoreCanvas) return;
    const rect = shoreCanvas.getBoundingClientRect();
    const sw = Math.max(40, Math.ceil(rect.width / scale)), sh = Math.max(20, Math.ceil(rect.height / scale));
    shoreCanvas.width = sw; shoreCanvas.height = sh;
    const sctx = shoreCanvas.getContext("2d", { alpha: false });
    const im = sctx.createImageData(sw, sh);
    const b = new Uint32Array(im.data.buffer);
    const ground = [];
    for (let x = 0; x < sw; x++) ground[x] = Math.round(sh * 0.72 - fbm(nNear, x * 0.03 + 200, 3) * sh * 0.18);
    // page field above, a low snowbank, pines standing in it
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      let c = C.deep;
      const v = y / sh;
      if (v > 0.25 && (v - 0.25) * 1.6 > dither(x, y) + 0.3) c = C.night; // stays the page colour
      const hill = Math.round(sh * 0.5 - fbm(nMid, x * 0.02 + 90, 3) * sh * 0.22);
      if (y >= hill) c = C.ridge;
      if (y >= ground[x]) c = y - ground[x] < 1 ? C.frost : C.snowLit;
      if (y >= ground[x] + 3) c = C.snowMid;
      if (y >= ground[x] + 6) c = C.snowShade;
      b[y * sw + x] = pack(c);
    }
    const r = rng(77);
    for (let x = 1; x < sw - 1; x++) {
      if (r() > 0.1 + 0.5 * smooth(0.35, 0.7, fbm(nNear, x * 0.05 + 9, 2))) continue;
      const h = 5 + Math.floor(r() * sh * 0.4);
      const top = ground[x] + 1 - h;
      for (let k = 0; k <= h; k++) {
        const hw = Math.floor((k / h) * 3 + ((k % 3) === 0 ? 0 : 0.6));
        for (let dx = -hw; dx <= hw; dx++) {
          const px = x + dx, py = top + k;
          if (px < 0 || px >= sw || py < 0 || py >= sh) continue;
          b[py * sw + px] = pack(C.pine);
        }
      }
    }
    sctx.putImageData(im, 0, 0);
  }

  // ---------------------------------------------------------------- loop: 10 fps, only while visible

  let visible = true, raf = 0, last = 0;
  const start = performance.now();
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
    drawShore();
    kick();
  }

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 120);
  }).observe(document.body);

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    kick();
  }).observe(canvas);

  document.addEventListener("visibilitychange", kick);
  reduceMotion.addEventListener?.("change", render);

  render();

  // the ledger rows wipe in once each as they surface; nothing is hidden without motion
  if (!reduceMotion.matches) {
    document.documentElement.classList.add("reveal");
    const rows = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); rows.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".row").forEach((r) => rows.observe(r));
  }
})();
