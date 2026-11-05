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
    starDim: hex("#4a6f99"), // the faint majority of stars
    earthshine: hex("#193858"), // the moon's dark disc, just visible
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
  const pack = (c) => ((255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0; // unsigned, to match the Uint32Array buffers it is compared against


  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let W = 0, H = 0, horizon = 0, scale = 4;
  let img, buf, base; // base: static scene above the waterline (0 = sky)
  let stars = [];
  let nameEnd = 0; // the right edge of the name's ink, as a fraction of the width (landscape)
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
    nameEnd = 0;
    nameBox = null;
    if (name) {
      const ink = document.createRange();
      ink.selectNodeContents(name); // the word itself, not the block it sits in
      const r = ink.getBoundingClientRect();
      // no star may land in or right beside a letter, where it would read as a stray pixel of the name
      nameBox = { x0: (r.left - rect.left) / scale - 3, x1: (r.right - rect.left) / scale + 3, y0: (r.top - rect.top) / scale - 2, y1: (r.bottom - rect.top) / scale + 2 };
      if (!portrait) nameEnd = (r.right - rect.left) / rect.width;
    }
    img = ctx.createImageData(W, H);
    buf = new Uint32Array(img.data.buffer);
    skyRows = new Array(horizon);
    // flat bands of night; where one band meets the next, two rows of checker and nothing more
    const lvl = skyLvl;
    for (let y = 0; y < horizon; y++) {
      const L = lvl(y), row = new Uint32Array(4);
      const seam = y + 1 < horizon && lvl(y + 1) > L ? L + 1 : y > 0 && lvl(y - 1) < L ? L - 1 : -1;
      for (let x = 0; x < 4; x++) row[x] = pack(SKY[seam >= 0 && ((x + y) & 1) === (seam > L ? 1 : 0) ? seam : L]);
      skyRows[y] = row;
    }
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
      const jag = Math.round((fbm(nMid, x * 0.12 + 7, 2) - 0.5) * 5); // the light/shadow split meanders, no per-column notches
      const slx = snowline(x);
      for (let y = 0; y < horizon; y++) {
        let c = null;
        if (y >= nearTop[x]) c = C.near;
        else if (y >= hillTop[x]) {
          c = C.hill;
        } else if (y >= far.top[x]) {
          const p = far.owner[Math.max(0, Math.min(W - 1, Math.round(x - (y - far.top[x]) * 0.6)))];
          const lit = x <= p.x + Math.floor((y - p.y) * 0.5) + jag; // west faces catch the moon, which hangs to the west of the range
          const side = x >= p.x ? 1 : -1;
          // rock ribs run down the fall line at a clean 1:2 step, two pixels wide, so they read as
          // rock bands and never as a broken scratch; couloirs carry snow below the snowline
          const along = Math.floor(((x - p.x) - side * Math.floor((y - p.y) * 0.5)) / 2) * 2;
          // the cap's lower edge breaks into tongues down the fall line, never a flat cut
          const sl = slx + (nCouloir(along * 0.21 + p.x * 0.5 + 31) - 0.5) * hz * 0.1;
          const rib = nRib(along * 0.3 + p.x) > 0.8 && y - far.top[x] > 3 && y > p.y + (sl - p.y) * 0.35;
          // couloirs only hang from a real snowcap: on a low ridge with no cap they read as stray light beams
          const couloir = p.y < slx - hz * 0.08 && nCouloir(along * 0.35 + p.x * 0.3) > 0.78 && y < sl + hz * 0.06;
          const snowy = (y < sl && !rib) || couloir || (y - far.top[x] < 1 && y < sl + hz * 0.05);
          if (snowy) {
            if (!lit) c = C.snowShade;
            // a frost crest only above the snowline; lower ridges carry a quieter edge
            else if (y - far.top[x] < 1) c = y < sl ? C.frost : C.snowMid;
            else c = C.snowLit; // lit snow is one clean plane: no dotted texture
          } else c = lit ? C.farRock : C.farShade;
          // valley mist: the range's foot thins into haze above the foothills, so the planes part
          const md = hillTop[x] - y;
          if (md < 4) c = C.haze;
        } else if (y >= haze.top[x]) {
          c = y < hz * 0.62 && y - haze.top[x] < 1 ? C.hazeSnow : C.haze; // a clean snow edge on the highest back peaks
        }
        if (c) base[y * W + x] = pack(c);
      }
    }

    // no snow specks or floating shards: a patch of six pixels or fewer is noise, and a small
    // patch that never reaches the ridge crest hangs in the rock face with nothing holding it,
    // so either takes the rock colour beside it
    {
      const SNOWSET = new Set([C.frost, C.snowLit, C.snowMid, C.snowShade].map(pack));
      const seen = new Uint8Array(W * horizon);
      for (let i = 0; i < W * horizon; i++) {
        if (seen[i] || !SNOWSET.has(base[i])) continue;
        const comp = [i], stack = [i];
        let crest = false;
        seen[i] = 1;
        while (stack.length) {
          const j = stack.pop(), jx = j % W;
          if (Math.floor(j / W) - far.top[jx] < 1) crest = true;
          for (const n of [jx > 0 ? j - 1 : -1, jx < W - 1 ? j + 1 : -1, j - W, j + W]) {
            if (n < 0 || n >= W * horizon || seen[n] || !SNOWSET.has(base[n])) continue;
            seen[n] = 1; comp.push(n); stack.push(n);
          }
        }
        if (comp.length > 6 && (crest || comp.length >= 40)) continue;
        // each pixel takes the nearest rock along its own row, so a patch several pixels thick
        // fills right through instead of keeping a core whose neighbours are all snow
        const fill = comp.map((j) => {
          const row = j - (j % W);
          for (let d = 1; d < W; d++) {
            for (const n of [j - d, j + d]) {
              if (n >= row && n < row + W && base[n] && !SNOWSET.has(base[n])) return base[n];
            }
          }
          return base[j];
        });
        comp.forEach((j, k) => { base[j] = fill[k]; });
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
      const v = fbm(nSnow, x * 0.32 + 70, 2);
      if (v > 0.53) set(x, horizon - 1, v > 0.62 ? C.hazeSnow : C.haze);
    }

    // the cabin: dark timber, snow on the roof, one lit window
    const groundY = nearTop[cabinX];
    const bx = cabinX - 4, by = groundY - 5;
    cabin = { wx: cabinX - 1, wy: by + 2, chimney: [bx + 6, by - 7] };
    for (let y = by; y <= groundY + 1; y++) for (let x = bx; x < bx + 9; x++) set(x, y, C.cabin);
    for (let k = 0; k < 5; k++) {
      for (let x = bx - 1 + k; x < bx + 10 - k; x++) set(x, by - 1 - k, C.cabin);
      set(bx - 1 + k, by - 1 - k, C.frost);
      set(bx + 9 - k, by - 1 - k, C.snowMid); // the east slope turns from the moon
      set(bx - 2 + k, by - k, C.ice);
      set(bx + 10 - k, by - k, C.snowShade);
    }
    set(bx + 4, by - 5, C.frost);
    // a stone chimney, a step lighter than the timber so it does not vanish into the pines,
    // its snow cap sitting on it rather than floating above an unseen stack
    for (let y = by - 6; y < by - 3; y++) set(bx + 6, y, C.farRock);
    set(bx + 6, by - 7, C.snowMid);
    set(cabin.wx, cabin.wy, C.lamp); set(cabin.wx + 1, cabin.wy, C.lamp);
    set(cabin.wx, cabin.wy + 1, C.lamp); set(cabin.wx + 1, cabin.wy + 1, C.ember);

    // a crescent moon, in the open sky past the name, never crowding it: a lit crescent, the
    // rest of the disc faintly visible by earthshine, and a halo of two rings, each a step or
    // two up the sky's own ramp, so the glow is made of the night's colours
    const mr = Math.max(3, Math.round(Math.min(W, H) * 0.028));
    const mx = W > H ? Math.max(Math.round(W * 0.45), Math.round(nameEnd * W + 10 + mr)) : Math.round(W * 0.22), my = Math.round(H * (W > H ? 0.12 : 0.08));
    moon = { x: mx, y: my, r: mr };
    const hr = mr + Math.max(3, Math.round(mr * 0.8)), hr1 = mr + Math.max(1, Math.round(mr * 0.35));
    for (let y = -hr; y <= hr; y++) for (let x = -hr; x <= hr; x++) {
      const d2 = x * x + y * y;
      const inA = d2 <= mr * mr + mr * 0.4;
      const bx2 = x - mr * 0.6, by2 = y + mr * 0.3;
      const inB = bx2 * bx2 + by2 * by2 <= mr * mr;
      if (inA && !inB) {
        const rim = (x - 1) * (x - 1) + y * y > mr * mr - mr; // softer limb
        set(mx + x, my + y, rim ? C.ice : C.frost);
      } else if (inA) set(mx + x, my + y, C.earthshine);
      else if (d2 <= hr * hr + hr * 0.4) {
        const L = skyLvl(my + y), up = d2 <= hr1 * hr1 + hr1 * 0.4 ? 2 : 1;
        set(mx + x, my + y, SKY[Math.min(SKY.length - 1, L + up)]);
      }
    }

    // stars, only over open sky: mostly faint, fewer bright, a rare few with a cross of light;
    // thicker in a soft diagonal drift and thinning toward the horizon, never touching each
    // other, a ridge, the moon's halo or the name
    const rs = rng(99);
    stars = [];
    const taken = new Uint8Array(W * H);
    const count = Math.round((W * H) / 230);
    const clear = (x, y, r) => {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || xx >= W || yy < 0) continue;
        if (yy >= horizon || base[yy * W + xx] || taken[yy * W + xx]) return false;
      }
      return true;
    };
    for (let i = 0; i < count; i++) {
      const x = Math.floor(rs() * W), y = Math.floor(rs() * H * 0.62);
      const drift = smooth(0.35, 0.75, fbm(nSnow, (x + y * 0.8) * 0.05 + 11, 3));
      const fall = 1 - smooth(0.25, 1, y / horizon) * 0.75;
      const roll = rs(), tier = rs(), tw = rs(), ph = rs() * 6.28, big = rs();
      if (roll > (0.25 + 0.75 * drift) * fall) continue;
      if (!clear(x, y, 2)) continue;
      if (nameBox && x >= nameBox.x0 && x <= nameBox.x1 && y >= nameBox.y0 && y <= nameBox.y1) continue;
      const lvl = tier < 0.62 ? 0 : tier < 0.92 ? 1 : 2;
      const cross = lvl === 2 && big > 0.6 && clear(x, y, 3);
      stars.push({ x, y, lvl, tw: tw > 0.65 && lvl > 0, ph, big: cross });
      taken[y * W + x] = 1;
      if (cross) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) taken[(y + dy) * W + x + dx] = 1;
    }
  }

  // ---------------------------------------------------------------- sky

  // nine close steps of night from space down to the ridge glow, each so near its neighbour
  // that the two-row checker seam between them reads as a soft join, not a drawn line
  const lerp = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
  const SKY = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((f) => (f <= 1 ? lerp(C.space, C.night, f) : lerp(C.night, C.ridge, f - 1)));

  const skyV = (y) => 0.05 + 0.95 * Math.pow(y / horizon, 1.3);
  const skyLvl = (y) => Math.max(0, Math.min(SKY.length - 1, Math.floor(skyV(y) * (SKY.length - 1) + 0.5)));

  function draw(t) {
    for (let y = 0; y < horizon; y++) {
      const sky = skyRows[y];
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        buf[i] = base[i] || sky[x & 3];
      }
    }
    const STAR = [pack(C.starDim), pack(C.ice), pack(C.frost)];
    for (const s of stars) {
      // a twinkle dims a star one step for a moment; it never blinks out
      const dim = s.tw && Math.sin(t * 2.2 + s.ph) < -0.6 ? 1 : 0;
      if (s.lvl - dim < 0) continue;
      buf[s.y * W + s.x] = STAR[s.lvl - dim];
      if (s.big && Math.sin(t * 1.3 + s.ph) > -0.3) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) buf[(s.y + dy) * W + s.x + dx] = STAR[0];
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
      for (let x = 0; x < W; x++) {
        const sx = x + wob < 0 ? 0 : x + wob >= W ? W - 1 : x + wob;
        // read the mirror in pixel pairs: water carries no dither, so a checker seam above reflects as one flat band
        const s = buf[src + (sx & ~1)];
        const r = Math.round((s & 255) * fade + wr), g = Math.round(((s >> 8) & 255) * fade + wg), b = Math.round(((s >> 16) & 255) * fade + wb);
        buf[row + x] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
      // a glint: each row has its own fixed spot that brightens and fades slowly, never jumping about
      const g = Math.floor(nRay(y * 3.1 + 500) * W * 1.3);
      if (g < W && d < 0.55 && nRay(y * 1.9 + t * 0.5) > 0.62) for (let k = 0; k < 2 + (y % 3); k++) if (g + k < W) buf[y * W + g + k] = pack(C.fjord);
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
      // a column of short warm dashes under the window, rippling with the water rows they sit on;
      // two pixels wide like the window near the shore, narrowing and cooling to ember with depth
      const rows = Math.round(depthRows * 0.3);
      for (let y = horizon + 1; y < Math.min(H, horizon + rows); y += 2) {
        const d = (y - horizon) / rows;
        if (nRay(y * 2.1 + t * 0.7 + 60) < 0.2 + d * 0.5) continue;
        const x = cabin.wx + Math.round(Math.sin((y - horizon) * 0.9 + t * 1.8) * (0.6 + ((y - horizon) / depthRows) * 2.2));
        const c = pack(d < 0.5 ? C.lamp : C.ember);
        if (x >= 0 && x + 1 < W) { buf[y * W + x] = c; if (d < 0.4) buf[y * W + x + 1] = c; }
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
    // the bank rolls in low drifts
    const ground = [];
    for (let x = 0; x < sw; x++) {
      ground[x] = Math.round(sh * 0.7 - fbm(nNear, x * 0.045 + 200, 3) * sh * 0.16 - Math.sin(x * 0.11) * 1.2);
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
