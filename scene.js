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

  const GLOW = pack([0x1f, 0x62, 0x8a]); // aurora on water: glacier sunk into the fjord, one quiet tone

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let W = 0, H = 0, horizon = 0, scale = 4;
  let img, buf, base; // base: static scene above the waterline (0 = sky)
  let stars = [];
  let aurStart = 0.28; // where the curtain may begin, kept clear of the name
  let nameBox = null; // the name's ink in art pixels, kept clear of stars
  let skyRows = null; // per sky row: the four dithered colours of the 4x4 cell, packed
  const start = performance.now();
  let cabin = null, moon = null;
  let shore = null; // { w, h, ctx, im, b, base, flakes }

  function layout() {
    const rect = canvas.parentElement.getBoundingClientRect();
    // 3 to 6 screen px per art pixel, so the scene keeps its composition on wide screens;
    // the name in CSS is set on this grid, the small text-layer marks stop growing at 4
    scale = rect.width >= 2400 ? 6 : rect.width >= 1760 ? 5 : Math.min(4, Math.max(3, Math.floor(rect.width / 320)));
    document.documentElement.style.setProperty("--scene-px", scale + "px");
    document.documentElement.style.setProperty("--ui-px", Math.min(4, scale) + "px");
    W = Math.max(80, Math.ceil(rect.width / scale));
    H = Math.max(80, Math.ceil(rect.height / scale));
    canvas.width = W;
    canvas.height = H;
    // whole screen pixels per art pixel: the canvas overhangs the hero by under one art pixel
    canvas.style.width = W * scale + "px";
    canvas.style.height = H * scale + "px";
    // portrait screens get a taller fjord so the name can sit on dark water
    const portrait = H > W * 1.15;
    canvas.parentElement.toggleAttribute("data-portrait", portrait);
    horizon = Math.round(H * (portrait ? 0.6 : 0.8));
    const name = document.querySelector(".nameplate h1");
    aurStart = 0.28;
    nameBox = null;
    if (name) {
      const ink = document.createRange();
      ink.selectNodeContents(name); // the word itself, not the block it sits in
      const r = ink.getBoundingClientRect();
      // no star may land in or right beside a letter, where it would read as a stray pixel of the name
      nameBox = { x0: (r.left - rect.left) / scale - 3, x1: (r.right - rect.left) / scale + 3, y0: (r.top - rect.top) / scale - 2, y1: (r.bottom - rect.top) / scale + 2 };
      if (!portrait) aurStart = Math.max(0.28, (r.right + 6 * scale - rect.left) / rect.width);
    }
    img = ctx.createImageData(W, H);
    buf = new Uint32Array(img.data.buffer);
    skyRows = new Array(horizon);
    // flat bands of night; where one band meets the next, two rows of checker and nothing more
    const lvl = (y) => Math.max(0, Math.min(4, Math.floor(skyV(y) * 4 + 0.5)));
    for (let y = 0; y < horizon; y++) {
      const L = lvl(y), row = new Uint32Array(4);
      const seam = y + 1 < horizon && lvl(y + 1) > L ? L + 1 : y > 0 && lvl(y - 1) < L ? L - 1 : -1;
      for (let x = 0; x < 4; x++) row[x] = pack(SKY[seam >= 0 && ((x + y) & 1) === (seam > L ? 1 : 0) ? seam : L]);
      skyRows[y] = row;
    }
    aurMask = new Uint8Array(W * horizon);
    aurCols = { env: [new Float32Array(W), new Float32Array(W)], bottom: [new Float32Array(W), new Float32Array(W)], len: [new Float32Array(W), new Float32Array(W)], rays: [new Float32Array(W), new Float32Array(W)] };
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

  // a spruce's half-widths from tip to foot: tiers hung on a cone, each flaring one pixel a
  // row to its own width, the next starting a pixel narrower, never back to the bare stem
  // (which would read as a cross)
  function spruce(h) {
    const m = h * 0.2 + 0.6, n = Math.max(2, Math.round(h / 3.2)), out = [0];
    let prev = 0;
    for (let i = 0; i < n; i++) {
      const L = Math.round((h * (i + 1)) / n) - Math.round((h * i) / n);
      const e = Math.max(1, Math.round(((i + 1) / n) * m));
      const s0 = Math.max(i === 0 ? 0 : Math.max(1, prev - 1), e - L + 1);
      for (let r = 0; r < L; r++) out.push(Math.min(e, s0 + r));
      prev = e;
    }
    return out;
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
            // a frost crest only above the snowline; lower ridges carry a quieter edge
            else if (y - far.top[x] < 1) c = y < sl ? C.frost : C.snowMid;
            else c = C.snowLit; // lit snow is one clean plane: no dotted texture
          } else c = lit ? C.farRock : C.farShade;
          // valley mist: the range's foot thins into haze above the foothills, so the planes part
          const md = hillTop[x] - y;
          if (md < 3 || (md < 5 && dither(x, y) < (5 - md) * 0.25)) c = C.haze;
        } else if (y >= haze.top[x]) {
          c = y < hz * 0.6 && y - haze.top[x] < 3 && dither(x, y) > 0.3 ? C.hazeSnow : C.haze;
        }
        if (c) base[y * W + x] = pack(c);
      }
    }

    // distant spruce along the foothill crests: small tapering spires, close-set in the
    // dense stretches so the crest reads as a serrated forest edge, never as posts
    const rh = rng(4321);
    for (let x = 1; x < W - 1; x++) {
      const dense = smooth(0.38, 0.62, fbm(nMid, x * 0.08 + 30, 2));
      if (rh() > 0.12 + 0.6 * dense) continue;
      const h = 3 + Math.floor(rh() * (2 + 3 * dense));
      for (let k = 0; k <= h; k++) {
        const hw = Math.floor(k * 0.5 + 0.25);
        for (let dx = -hw; dx <= hw; dx++) {
          const y = hillTop[x] - h + k + 1;
          if (y >= 0 && y < nearTop[x]) set(x + dx, y, C.hillTree);
        }
      }
      x += 1; // spires stand at least two pixels apart, so their tips stay distinct
    }

    // pines on the near shore, in stands and clearings
    const r = rng(1234);
    const cabinX = Math.round(W * 0.74);
    for (let x = 2; x < W - 2; x++) {
      if (Math.abs(x - cabinX) < 9) continue;
      if (r() > 0.08 + 0.55 * smooth(0.35, 0.7, fbm(nNear, x * 0.06 + 50, 2))) continue;
      const h = 4 + Math.floor(r() * (H > 160 ? 11 : 7));
      const top = nearTop[x] - h, rows = spruce(h);
      for (let k = 0; k <= h; k++) {
        const hw = rows[k];
        for (let dx = -hw; dx <= hw; dx++) {
          set(x + dx, top + k, C.pine);
        }
      }
    }

    // a thin rim of snow along the waterline, broken where the shore runs dark
    for (let x = 0; x < W; x++) {
      const v = fbm(nSnow, x * 0.15 + 70, 2);
      if (v > 0.5) set(x, horizon - 1, v > 0.62 ? C.hazeSnow : C.haze);
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

    // a crescent moon, in the clear sky between the name and the curtain, never overlapping either
    const mr = Math.max(3, Math.round(Math.min(W, H) * 0.028));
    const mx = W > H ? Math.round(aurStart * W + mr + 2) : Math.round(W * 0.22), my = Math.round(H * (W > H ? 0.12 : 0.08));
    moon = { x: mx, y: my, r: mr };
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
    const count = Math.round((W * H) / 300);
    for (let i = 0; i < count; i++) {
      const x = Math.floor(rs() * W), y = Math.floor(rs() * H * 0.6);
      if (base[y * W + x]) continue;
      if (moon && Math.hypot(x - moon.x, y - moon.y) < moon.r + 3) continue;
      if (nameBox && x >= nameBox.x0 && x <= nameBox.x1 && y >= nameBox.y0 && y <= nameBox.y1) continue;
      stars.push({ x, y, c: rs() > 0.8 ? C.frost : C.ice, tw: rs() > 0.7, ph: rs() * 6.28, big: rs() > 0.96 });
    }
  }

  // ---------------------------------------------------------------- sky

  // five flat steps of night, each pair of neighbours blended only in a narrow dithered seam
  const mid = (a, b) => a.map((v, i) => Math.round((v + b[i]) / 2));
  const SKY = [C.space, mid(C.space, C.night), C.night, mid(C.night, C.ridge), C.ridge];
  const AUR = [C.abyss, C.glacier, C.ice, C.frost];

  function ramp(steps, v, x, y) {
    const n = steps.length - 1;
    const p = Math.max(0, Math.min(n, v * n));
    const i = Math.min(n - 1, Math.floor(p));
    return p - i > dither(x, y) ? steps[i + 1] : steps[i];
  }

  const skyV = (y) => 0.05 + 0.95 * Math.pow(y / horizon, 1.3);
  let aurCols = null, aurMask = null, aurTop = 0, aurBot = 0;

  // everything about the curtain that depends only on the column, worked out once a frame
  function auroraPrep(t) {
    aurTop = Infinity; aurBot = -Infinity;
    for (let k = 0; k < 2; k++) {
      const env = aurCols.env[k], bottom = aurCols.bottom[k], len = aurCols.len[k], rays = aurCols.rays[k];
      for (let x = 0; x < W; x++) {
        const u = x / W;
        const e = k === 0
          ? smooth(aurStart, aurStart + 0.14, u) * (1 - smooth(0.92, 1.08, u))
          : smooth(aurStart + 0.18, aurStart + 0.36, u) * (1 - smooth(0.98, 1.2, u)) * 0.6;
        env[x] = e;
        if (e <= 0) continue;
        const bt = horizon * (k === 0 ? 0.44 : 0.32)
          + Math.sin(u * 6.0 + t * 0.3 + k * 2) * horizon * 0.08
          + Math.sin(u * 17.0 - t * 0.6) * horizon * 0.02;
        bottom[x] = bt;
        // a curtain: broad folds that sway slowly, hung with fine vertical rays that drift along
        // them; a bright ray reaches higher, so the top edge is a comb of streaks, not a haze
        const fold = nRay(u * 7 + t * 0.12 + k * 90);
        const ray = Math.pow(nRay(x * 0.55 + t * 0.35 + k * 30), 2.2);
        rays[x] = (0.35 + 0.65 * fold) * (0.3 + 0.7 * ray);
        len[x] = horizon * (0.05 + (0.1 + 0.17 * fold) * (0.25 + 0.75 * Math.sqrt(ray)));
        if (bt - horizon * 0.4 < aurTop) aurTop = bt - horizon * 0.4;
        if (bt + 1 > aurBot) aurBot = bt + 1;
      }
    }
  }

  function aurora(x, y) {
    let best = 0;
    for (let k = 0; k < 2; k++) {
      const env = aurCols.env[k][x];
      if (env <= 0) continue;
      const d = aurCols.bottom[k][x] - y;
      if (d < -1 || d > horizon * 0.4) continue;
      const len = aurCols.len[k][x];
      // light pools at the hem and thins upward, so the top dissolves into the sky
      const prof = d < 0 ? 0.4 : Math.max(0, 1 - d / len);
      // the lower hem is the brightest line of the curtain, one step brighter than its rays
      const hem = d >= 0 && d < 2 ? 0.45 : d >= 2 && d < 4 ? 0.15 : 0;
      const v = env * (aurCols.rays[k][x] * Math.pow(prof, 1.1) + hem) * (k === 0 ? 0.9 : 0.55);
      if (v > best) best = v;
    }
    return best;
  }

  function draw(t) {
    auroraPrep(t);
    for (let y = 0; y < horizon; y++) {
      const sky = skyRows[y], inAur = y >= aurTop && y <= aurBot;
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (base[i]) { buf[i] = base[i]; aurMask[i] = 0; continue; }
        const a = inAur ? aurora(x, y) : 0;
        // faint light breaks into short vertical dashes along the rays, never lone dots;
        // each column's dashes are offset so they never line up into rows
        const lit = a > 0.05 + dither(x + 1, (y + ((x * 7) % 5)) >> 2) * 0.22;
        aurMask[i] = lit ? 1 : 0;
        buf[i] = lit ? pack(ramp(AUR, (a - 0.05) / 0.85, x, y >> 1)) : sky[x & 3];
      }
    }
    // a lit pixel with no lit neighbour above or below is a lone dot, not part of a ray: drop it
    const y0 = Math.max(1, Math.floor(aurTop)), y1 = Math.min(horizon - 2, Math.ceil(aurBot));
    for (let y = y0; y <= y1; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (aurMask[i] && !aurMask[i - W] && !aurMask[i + W]) buf[i] = skyRows[y][x & 3];
      }
    }
    for (const s of stars) {
      const i = s.y * W + s.x;
      if (buf[i] !== skyRows[s.y][s.x & 3]) continue; // hidden by aurora
      if (s.tw && Math.sin(t * 2.2 + s.ph) < -0.55) continue;
      buf[i] = pack(s.c);
      if (s.big && Math.sin(t * 1.3 + s.ph) > 0.2) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const j = (s.y + dy) * W + s.x + dx;
          if (s.x + dx >= 0 && s.x + dx < W && s.y + dy >= 0 && !base[j]) buf[j] = pack(C.abyss);
        }
      }
    }

    // the fjord: a rippling mirror, fjord-tinted, settling into the page colour
    const depthRows = H - horizon;
    const mirror = Math.max(1.15, (horizon * 0.6) / (depthRows * 0.85));
    for (let y = horizon; y < H; y++) {
      const d = (y - horizon) / depthRows;
      const wob = Math.round(Math.sin((y - horizon) * 0.9 + t * 1.8) * (0.6 + d * 2.2));
      // a shallow fjord (wide screens) folds the mirror tighter so the peaks still reach it
      const sy = Math.max(0, horizon - 1 - Math.round((y - horizon) * mirror));
      // thin calm-water breaks drift down through the mirror: rows where the reflection gives way to the water
      const brk = nRay((y - horizon) * 0.8 - t * 0.6 + 300) > 0.7 ? 0.4 : 1;
      const fade = brk * (horizon < H * 0.7 ? 0.32 * Math.pow(1 - d, 1.1) : 0.5 * (1 - smooth(0.5, 0.88, d)));
      const tint = Math.pow(Math.max(0, 1 - d / 0.82), 0.6);
      const f1 = 1 - fade;
      const wr = (C.deep[0] + (C.fjord[0] - C.deep[0]) * tint) * f1;
      const wg = (C.deep[1] + (C.fjord[1] - C.deep[1]) * tint) * f1;
      const wb = (C.deep[2] + (C.fjord[2] - C.deep[2]) * tint) * f1;
      const row = y * W, src = sy * W;
      // the aurora's light keeps to a narrow band at the far shore, however deep the fjord is drawn
      const gd = (y - horizon) / Math.min(depthRows * 0.25, 9);
      const glowRow = gd < 1 && ((y - horizon) & 1) === 1 ? 1 - gd : 0;
      for (let x = 0; x < W; x++) {
        const sx = x + wob < 0 ? 0 : x + wob >= W ? W - 1 : x + wob;
        // read the mirror in pixel pairs: water carries no dither, so a checker seam above reflects as one flat band
        const s = buf[src + (sx & ~1)];
        const r = Math.round((s & 255) * fade + wr), g = Math.round(((s >> 8) & 255) * fade + wg), b = Math.round(((s >> 16) & 255) * fade + wb);
        buf[row + x] = (255 << 24) | (b << 16) | (g << 8) | r;
        // the aurora's light lies on the near water in broken ripple lines, rippling with it
        if (glowRow > 0) {
          const glow = (aurCols.env[0][sx] * aurCols.rays[0][sx] + 0.6 * aurCols.env[1][sx] * aurCols.rays[1][sx]) * glowRow * nRay(sx * 0.21 + y * 7.3 + t * 0.7);
          if (glow > 0.3) buf[row + x] = GLOW;
        }
      }
      const g = Math.floor(nRay(y * 3.1 + t * 0.8) * W * 1.3);
      if (g < W && d < 0.55) for (let k = 0; k < 2 + (y % 3); k++) if (g + k < W) buf[y * W + g + k] = pack(C.fjord);
    }

    // the moon's glade: thin broken dashes of cool light on the water below it
    if (moon) {
      const rows = Math.round(depthRows * 0.65);
      for (let y = horizon + 1; y < horizon + rows; y += 2) {
        const d = (y - horizon) / rows;
        if (nRay(y * 2.3 + t * 0.9) < 0.3 + d * 0.45) continue;
        const len = 1 + Math.round(nRay(y * 5.7 - t * 0.6) * (2 + moon.r * 0.5) * (1 - d * 0.5));
        const x0 = moon.x + Math.round(Math.sin(y * 0.9 + t * 1.8) * (0.6 + d * 2.2) + (nRay(y * 1.3 + 40) - 0.5) * moon.r) - (len >> 1);
        const c = d < 0.25 ? C.snowLit : d < 0.6 ? C.snowMid : C.snowShade;
        for (let k = 0; k < len; k++) if (x0 + k >= 0 && x0 + k < W) buf[y * W + x0 + k] = pack(c);
      }
    }

    // lamplight reflected beneath the cabin, and a thread of chimney smoke
    if (cabin) {
      // the lamp gutters now and then: one pane dips to ember for a frame or two
      if (nRay(t * 1.9 + 400) > 0.93) buf[cabin.wy * W + cabin.wx + (Math.floor(t * 3) & 1)] = pack(C.ember);
      for (let y = horizon + 1; y < Math.min(H, horizon + Math.round(depthRows * 0.3)); y += 2) {
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

    ctx.putImageData(img, 0, 0);
  }

  // ---------------------------------------------------------------- the shore (page foot)

  function drawShore() {
    if (!shoreCanvas) return;
    const rect = shoreCanvas.parentElement.getBoundingClientRect();
    const sw = Math.max(40, Math.ceil(rect.width / scale)), sh = Math.max(20, Math.ceil(rect.height / scale));
    shoreCanvas.width = sw; shoreCanvas.height = sh;
    shoreCanvas.style.width = sw * scale + "px";
    shoreCanvas.style.height = sh * scale + "px";
    const sctx = shoreCanvas.getContext("2d", { alpha: false });
    const im = sctx.createImageData(sw, sh);
    const b = new Uint32Array(im.data.buffer);
    // the bank rolls in low drifts; a second, lower crest catches the light here and there
    const ground = [], crest = [];
    for (let x = 0; x < sw; x++) {
      ground[x] = Math.round(sh * 0.7 - fbm(nNear, x * 0.045 + 200, 3) * sh * 0.16 - Math.sin(x * 0.11) * 1.2);
      crest[x] = ground[x] + 4 + Math.round(fbm(nSnow, x * 0.07 + 30, 2) * (sh - ground[x]) * 0.5);
      // a crest climbs or falls one pixel a column at most, so its line never breaks into a stub
      if (x > 0) crest[x] = Math.max(crest[x - 1] - 1, Math.min(crest[x - 1] + 1, crest[x]));
    }
    const SNOW = [C.snowLit, C.snowMid, C.snowShade];
    // page field above, a ridge-blue back hill, the snowbank
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      let c = C.deep;
      const hill = Math.round(sh * 0.5 - fbm(nMid, x * 0.02 + 90, 3) * sh * 0.22);
      if (y >= hill) c = C.ridge;
      const g = y - ground[x];
      if (g >= 0) {
        // moonlit on top, shading in clean bands toward the foot of the page; each band follows
        // the drift's own contour, so the layers read as packed snow, with no dotted seams
        const v = Math.pow((g - 1) / Math.max(1, sh - ground[x] - 1), 0.8) * 3.2;
        c = g === 0 ? C.frost : SNOW[Math.max(0, Math.min(2, Math.floor(v)))];
        // the drift crest: a lit lip, a shaded fall below it
        const cr = y - crest[x];
        if (crest[x] < sh - 2 && fbm(nSnow, x * 0.09 + 5, 2) > 0.48) {
          if (cr === 0) c = C.snowLit;
          else if (cr === 1) c = C.snowShade;
        }
      }
      b[y * sw + x] = pack(c);
    }
    // pines standing in the snow, each casting a short moon shadow down-slope to its right
    const r = rng(77);
    for (let x = 1; x < sw - 1; x++) {
      if (r() > 0.1 + 0.5 * smooth(0.35, 0.7, fbm(nNear, x * 0.05 + 9, 2))) continue;
      const h = 5 + Math.floor(r() * sh * 0.4);
      const top = ground[x] + 1 - h;
      for (let dx = 2; dx < 2 + Math.round(h * 0.35); dx++) {
        const px = x + dx;
        if (px < sw && b[ground[px] * sw + px] === pack(C.frost)) b[ground[px] * sw + px] = pack(C.snowShade);
      }
      const rows = spruce(h);
      for (let k = 0; k <= h; k++) {
        const hw = rows[k];
        for (let dx = -hw; dx <= hw; dx++) {
          const px = x + dx;
          if (px < 0 || px >= sw) continue;
          // the skirt reaches down to the drift under it, so no tree floats over a hollow
          const y1 = k === h ? Math.max(top + k, ground[px]) : top + k;
          for (let py = top + k; py <= y1 && py < sh; py++) if (py >= 0) b[py * sw + px] = pack(C.pine);
        }
      }
    }
    const rf = rng(808), fl = [];
    for (let i = 0, n = Math.round((sw * sh) / 260); i < n; i++) {
      const near = rf() > 0.7;
      fl.push({ x: rf() * sw, y: rf() * sh, sp: near ? 6 + rf() * 4 : 2 + rf() * 2.5, sw: 0.6 + rf() * 1.4, ph: rf() * 6.28, c: near ? C.frost : C.ice });
    }
    shore = { w: sw, h: sh, ctx: sctx, im, b, base: b.slice(), ground, flakes: fl };
    shoreFrame(reduceMotion.matches ? 4 : (performance.now() - start) / 1000);
  }

  // snow keeps falling over the shore, settling into the bank
  function shoreFrame(t) {
    if (!shore) return;
    const { w, h, b, base, ground, flakes: fl } = shore;
    b.set(base);
    for (const f of fl) {
      const y = Math.floor((f.y + t * f.sp) % h);
      const x = Math.floor(((f.x + Math.sin(t * 0.7 + f.ph) * f.sw * 2) % w + w) % w);
      if (y >= ground[x]) continue;
      if (b[y * w + x] === pack(C.pine) && f.c !== C.frost) continue; // far flakes pass behind the pines
      b[y * w + x] = pack(f.c);
    }
    shore.ctx.putImageData(shore.im, 0, 0);
  }

  // ---------------------------------------------------------------- loop: 10 fps, only while visible

  let visible = true, shoreVisible = false, raf = 0, last = 0;
  const FRAME = 100;

  function tick(now) {
    raf = 0;
    if (!(visible || shoreVisible) || reduceMotion.matches || document.hidden) return;
    if (now - last >= FRAME) {
      last = now;
      const t = (now - start) / 1000;
      if (visible) draw(t);
      if (shoreVisible) shoreFrame(t);
    }
    raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (!raf && (visible || shoreVisible) && !reduceMotion.matches && !document.hidden) raf = requestAnimationFrame(tick);
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

  if (shoreCanvas) new IntersectionObserver((entries) => {
    shoreVisible = entries[0].isIntersecting;
    kick();
  }).observe(shoreCanvas);

  document.addEventListener("visibilitychange", kick);
  reduceMotion.addEventListener?.("change", render);
  document.fonts?.ready.then(render);

  render();

  // the name wipes in on arrival when motion is welcome; nothing else is held back
  if (!reduceMotion.matches) document.documentElement.classList.add("reveal");
})();
