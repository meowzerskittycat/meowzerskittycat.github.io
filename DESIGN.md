---
name: Vivien
description: One polar night in pixel art; an alpine fjord, an aurora, one lit cabin, and a plain ledger below the waterline that ends on a snowy shore.
colors:
  night: "#0f2b4c"
  space: "#071a31"
  ridge: "#1c3b5e"
  fjord: "#1e5568"
  snow: "#f3f3f3"
  ink-soft: "#c4d3e0"
  frost: "#e3f2fd"
  ice: "#90caf9"
  glacier: "#2196f3"
  abyss: "#0d47a1"
  lamp: "#f2b45a"
  ember: "#7a5531"
typography:
  display:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "131px"
    fontWeight: 400
    lineHeight: 0.9
  item:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "32.64px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "21.76px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "21.76px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.092em"
rounded:
  none: "0px"
spacing:
  px: "4px"
  glyph-gap: "0.45em"
  stack: "0.75rem"
  item-gap: "clamp(1.5rem, 4vw, 3rem)"
  label-gap: "clamp(2rem, 5vw, 4rem)"
  gutter: "clamp(1rem, 6vw, 6rem)"
  row: "clamp(1.5rem, 4vh, 2.25rem)"
  descent: "clamp(2.5rem, 7vh, 4.5rem)"
  foot: "clamp(3rem, 8vh, 5rem)"
  sky-top: "clamp(5rem, 16vh, 10rem)"
components:
  nameplate:
    textColor: "{colors.snow}"
    typography: "{typography.display}"
    padding: "clamp(5rem, 16vh, 10rem) clamp(1rem, 6vw, 6rem) 0"
    width: "44rem"
  scroll-cue:
    textColor: "{colors.ice}"
    size: "calc(var(--scene-px) * 7) x calc(var(--scene-px) * 4)"
  ledger:
    width: "64rem"
  ledger-row:
    padding: "clamp(1.5rem, 4vh, 2.25rem) 0"
  ledger-rule:
    backgroundColor: "{colors.ridge}"
    height: "var(--scene-px)"
  ledger-label:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    width: "11rem"
  ledger-item:
    textColor: "{colors.snow}"
    typography: "{typography.item}"
  ledger-note:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
  pixel-icon:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    size: "calc(var(--scene-px) * 9)"
  band-name:
    textColor: "{colors.snow}"
    typography: "{typography.item}"
  band-marker:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    size: "calc(var(--scene-px) * 2)"
  level-meter-bar:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    width: "calc(var(--scene-px) * 2)"
---

# Design System: Vivien

## Overview

**Creative North Star: "One Polar Night"**

The whole page is a single night by a fjord. The first viewport is the place itself: a procedural pixel-art canvas of aurora under a clear starry sky, a crescent moon, a layered alpine range anchored by one tall horn peak, forested foothills, a pine shore with one lit cabin, and still water that reflects all of it. Nothing sits on top of the scene as a banner or card; the name is set straight into the sky (or, on portrait screens, onto the dark water at the scene's foot). Scrolling continues down into the water, which settles into the page field so the introduction reads as text under the waterline, and the page closes on a second, smaller canvas: a snowy pine bank, the far shore.

Below the waterline the introduction is one ledger: a few rows, each a small label beside its content, separated by rows of square pixel dots. One label column and one content edge hold every row, so the eye runs straight down. Small pixel marks drawn on the scene's grid (9x9 glyphs, square markers, a stepped level meter) give the text a little of the night's life. The atmosphere carries the personality: cold blues, hard pixel edges, ordered-dither tones, and exactly one warm light, which lives only in the scene. Hierarchy comes from size in one pixel face at one weight. There are no links, controls, borders, shadows-as-depth, or containers; the system is made of a field, two scenes, type, and a few pixel marks.

The direction contract still names a lamplight text mark; it was removed from the build at the user's request, and the build is the record here.

**Key Characteristics:**
- Canvas scenes drawn at a whole-number art-pixel scale (3 or 4 screen px per art pixel) and upscaled with crisp, pixelated edges; the hero scene opens the page and a shore canvas closes it.
- Dark fjord set as ground; the ice-blue set is light: the sky, plus a few small pixel marks in the text.
- One warm accent, the cabin's lamplight, and only inside the scene.
- One face (Pixelify Sans, 400) across every role; size is the main hierarchy lever.
- One ledger below the scene: a fixed label column, one content edge, pixel-dot rules between rows.
- Square everything: no radius, no card, no border; rules and markers are square pixels on the scene grid.
- Quiet, stepped motion (the scene at 10 frames a second, the meter by whole-pixel jumps), paused offscreen and frozen for reduced-motion users.

## Colors

A cold, low-light palette of fjord blues on deep navy, lit by ice-blue aurora and one amber window.

### Primary
- **Aurora Glacier** (glacier): the bright core of the aurora curtains and the tail of the shooting star. Lives only inside the scene.
- **Deep Aurora Abyss** (abyss): the faint outer edge of the aurora where the curtain fades into sky, and the cross-shaped halo on the largest stars.

### Secondary
- **Cabin Lamplight** (lamp): the one warm light. The cabin window and the near part of its broken reflection on the water. Scene-only; nothing in the text layer is warm.
- **Banked Ember** (ember): the dimmed lamplight; the window's shaded pixel and the far end of the lamp's reflection. Scene-only.

### Tertiary
- **Ice** (ice): in the scene, starlight, distant snowflakes on the shore, the crescent moon's limb, the lit edge under the cabin's roof snow, and the aurora's upper-bright step. In the text layer, the fill of the 9x9 pixel glyphs, the square marker before each band name, and the bars of the level meter.
- **Frost** (frost): the brightest snow crests, roof snow, the moon's face, near snowflakes on the shore, the brightest stars, the shooting star's head, the aurora's peak step, the top cap pixel of each meter bar, the shore's snow edge, and the text selection background.

### Neutral
- **Polar Night** (night): the page field and hero background, and the middle step of the sky ramp. The CSS also carries it as `--deep` (same value) for the field below the waterline; treat them as one color.
- **Upper Space** (space): the darkest sky at the top of the canvas. Scene-only.
- **Ridge Blue** (ridge): the sky's lowest step near the horizon, the back hill on the shore canvas, the pixel-dot rules between ledger rows, and the scrollbar thumb.
- **Fjord Water** (fjord): the water's tint at the shoreline (it shades toward night with depth) and the ice glints on the water.
- **Snow** (snow): primary ink; the name, the ledger items, and the band names.
- **Soft Frost Ink** (ink-soft): secondary ink for the ledger labels and the note above the bands (9.3:1 on night).

The scenes shade their terrain with in-between blues defined in `scene.js` and nowhere else: haze (#24496f) and haze snow (#4a76a0) for the back range; lit snow (#a4c5e2), mid snow (#7fa7cc) and shaded snow (#46719c) for the alpine faces, couloirs and the shore's snowbank; far rock (#1b3c60) and far shade (#132e4e) for the ribs; hill (#0f2745), hill tree (#0b1f3a) and hill snow (#3f6a94) for the forested foothills; near shore (#0a1e36), pine (#06152a) and cabin timber (#081829). Chimney smoke reuses shaded snow and haze. These are rendering shades of the palette, not page tokens; do not use them in CSS.

### Named Rules
**The One Warm Light Rule.** Lamplight amber and ember appear only in the cabin window and its reflection on the water. Every other color on the page, scene and text alike, is cold. A second warm element breaks the night.

**The Ice Is Light Rule.** The ice-blue set (frost, ice, glacier, abyss) is light, never ground. It belongs to the sky (aurora, stars, moon, shooting star, snow crests, glints, and the shore's snowfall) and, in the text layer, only to small pixel marks: the 9x9 glyphs, the band markers, and the level meter, with frost as the meter's cap pixel and the selection highlight. Words, labels, and surfaces stay in snow, ink-soft, and night.

## Typography

**Display Font:** Pixelify Sans (with ui-sans-serif, sans-serif), self-hosted woff2 in latin and latin-ext subsets, variable 400 to 700
**Body Font:** Pixelify Sans (same files)

**Character:** A single pixel face that shares the scene's grid, so the name looks drawn in the same night as the mountains. It stays at regular weight everywhere; the pixel grid already gives it all the weight it needs.

### Hierarchy
- **Display** (400, display size, 0.9): the name only. Sized from the scene scale, not a fluid clamp: `calc(var(--scene-px) * 32.64)`, so each glyph pixel lands on exactly three art pixels. That is the listed 131px at a 4px scene scale and about 98px at 3px. The name stands alone in the hero; what Vivien does is said once, in the ledger.
- **Item** (400, item size, 1.2): the content of each ledger row (the trades and the band names). The largest type below the hero; every row's content shares it so the rows read as equals. 32.64px from 46rem wide, 21.76px below.
- **Body** (400, body size, 1.5): default text and the note above the bands (the note drops to 16.32px below 46rem so it stays under the items).
- **Label** (400, label size, one glyph pixel of tracking, uppercase): the ledger's row labels only, in ink-soft. 21.76px from 46rem wide, 16.32px below.

**The Glyph Grid Rule.** Pixelify draws on a grid of about 0.092em, so `--g: 10.88px` is the size at which one glyph pixel is one CSS pixel. Every text size is a half-step multiple of it (1.5, 2, 3 for text; the name is locked to the scene instead), and tracking is whole glyph pixels, so letters land on whole device pixels and never smear. No fluid clamp sizes for text.

### Named Rules
**The One Face, One Weight Rule.** Every role is Pixelify Sans at 400. Hierarchy is made by size (and ink-soft versus snow), never by bold, italics, or a second family. Uppercase and tracking belong to the ledger label alone.

**The Name on the Grid Rule.** The display size is derived from the scene's pixel scale so the name's pixels align with the art's pixels. Never set the name in a free fluid size that breaks that lock.

## Layout

Everything is left-aligned inside a generous fluid gutter (`spacing.gutter`) on both sides; nothing is centered. The hero is 92svh (minimum 30rem) and holds the full-bleed scene canvas, with the nameplate starting `spacing.sky-top` down. Below it, `main` opens after `spacing.descent` and closes with `spacing.foot` before the shore. The page ends on a full-bleed shore canvas, clamp(7rem, 20vh, 12rem) tall, with no gap or rule above it.

The introduction is one ledger, at most 64rem wide. Each row has `spacing.row` above and below its content and a pixel-dot rule along its top edge; the first row has neither rule nor top padding, so the ledger starts flush under the descent. From 46rem wide each row is two columns: an 11rem label column and the content, with `spacing.label-gap` between, aligned on the baseline. Below 46rem the label stacks above its content with `spacing.stack` between.

Inside a row, items wrap side by side with 0.5rem between lines and `spacing.item-gap` between items. A glyph or marker sits `spacing.glyph-gap` before its word. A note above a list takes the full row width with 0.5rem under it. The band names form an even grid, three columns from 46rem, two below, and one under 23rem, at the same item gap with 0.35em between lines; a name never wraps. The level meter sits 0.9rem under its label.

The nameplate tops out at 44rem.

The scene's responsiveness lives in `scene.js`. The art scale is 4px per art pixel from a 1280px-wide hero up and 3px below; the shore canvas uses the same scale. When the hero is portrait (height over 1.15 times the width), the scene sets a portrait flag: the horizon drops from 80% to 60% of the height so the fjord is taller, the horn peak and moon shift to suit the narrow sky, and the nameplate leaves the sky and rests at the bottom of the hero on the dark water.

### Named Rules
**The One Edge Rule.** Every ledger row shares one label column and one content edge. New facts join the ledger as rows; they do not open a second layout.

## Elevation & Depth

Flat. Nothing on the page is lifted, layered, or shadowed. Depth is atmospheric and lives inside the scenes: a pale hazy back range, the brighter alpine range, darker forested foothills, a near-black shore; the water is a darkened, rippling mirror that fades with depth and dithers into the page field. On the page itself there is one plane, the night field, and type and pixel marks sit directly on it. The only `box-shadow` in the CSS is an unblurred inset that paints each meter bar's top pixel in frost; it is a pixel fill, not a shadow.

### Named Rules
**The Depth Is Distance Rule.** Separation comes from atmospheric value steps in the scene and from space on the page, never from drop shadows, overlays, or raised surfaces.

**The Dithered Sky Rule.** Sky, aurora, and haze tones change only through a 4x4 ordered (Bayer) dither between palette steps, at whole art pixels; never a smooth CSS or canvas gradient. The water is the one exception: its mirror blends the reflection into the fjord tint row by row, still on whole art pixels, and its last fifth dithers out into the night field.

## Shapes

Square and hard-edged throughout (`rounded.none`). Both canvases render with `image-rendering: pixelated`, so every edge in the art is a stair-stepped pixel edge. Small marks are made of square pixels sized in whole scene pixels: the glyphs are 9x9 grids of unit squares at nine scene pixels square, rendered with crisp edges; the band markers are two scene pixels square; the meter's bars are two scene pixels wide. The ledger's rules are a row of square dots (one scene pixel on, one off, one scene pixel tall) painted as a hard-stop repeating background, never a border. There are no borders, outlines, boxes, or clipped shapes in the layout.

## Components

The page has no buttons, inputs, navigation, or cards, by product decision (no links). The recurring pieces are scene, type, the ledger, and pixel marks.

### Pixel Night Scene (signature)
- **What:** a full-bleed canvas in the hero, drawn procedurally from fixed seeds so every visit shows the same place: stars, a crescent moon, two drifting aurora curtains, a hazy back range, an alpine range with one tall horn, shouldered peaks, an uneven snowline, rock ribs and snow couloirs, forested foothills with a comb of small pines, a pine shore, one cabin with roof snow, a lit window and a chimney, and the reflecting fjord. The sky is clear: no snow falls in the hero, so nothing crosses the name.
- **Rendering:** low-resolution buffer (about 320 art pixels across on desktop) upscaled by an exact whole number (the canvas element is sized to W x scale, overhanging its box by under one art pixel), so every art pixel is the same size; the art scale is published to CSS as `--scene-px`, and the nameplate's padding is rounded to it so the name's pixels sit on the art's. Per frame, the aurora's column terms are computed once and only its band of rows is evaluated; the sky's dither colours are precomputed per row (about 2ms a frame on desktop).
- **Aurora placement:** on landscape screens the curtain begins a few art pixels to the right of the name's ink, measured after the font loads, so the two never touch.
- **Motion:** slow aurora drift, star twinkle, a rare shooting star (about 0.8s, first after ~6s, then every ~29s), chimney smoke, water ripple, a short flickering lamp reflection, and the moon's glade (thin dashes that pale from lit to shaded snow with depth, broken across the water beneath the moon, never a solid column), stepped at 10 frames a second. The water fades fully into the page colour before the hero's edge, with no dither stripe. The shore canvas at the page foot keeps the snow falling at two depths, far flakes passing behind the pines, and runs only while it is on screen. It pauses when offscreen or the tab is hidden; with reduced motion it renders one still frame.
- **Arrival:** when motion is welcome, scene.js adds `.reveal` to the root: the name wipes in left to right in 6 whole steps and the cue follows. The ledger is never held back, so previews, print and full-page captures always show it. Without the class nothing is hidden.
- **Share preview:** `og.png`, a 1200x630 capture of the hero at rest, is the Open Graph and large Twitter card image.
- **Favicon:** `favicon.svg`, a 16x16 pixel peak (lit left flank in shaded snow, right flank in ridge, a stepped asymmetric snow cap) under an aurora band, on night; `apple-touch-icon.png` is the same art at 11x on 180px.
- **Browser chrome:** `theme-color` is the sky's top tone, #071a31, so a mobile browser bar meets the sky without a step.
- **Accessibility:** the canvas is `role="img"` with a one-sentence description of the scene.

### Shore
- A full-bleed canvas closing the page, in a plain `div` (not an empty footer landmark): the night field over a ridge-blue back hill, a snowbank stepped from frost through lit, mid, and shaded snow, and dark pines standing in it, with snow still falling over it at two depths (far flakes behind the pines). Animated only while on screen, decorative and hidden from assistive tech.

### Nameplate
- Display-size snow text, the name alone, set directly over the sky at the left. No role line, glyph, backing panel, or scrim. In portrait it moves to the hero's foot, over the dark water.

**Scroll Cue**
- A 7x4 ice pixel chevron centred at the foot of the hero, drawn at scene-pixel size, nudging down one scene pixel on a 1.4s `steps()` loop. Hidden in portrait (the name occupies the hero's foot there), still under reduced motion, decorative and hidden from assistive tech.

### Ledger (signature)
- A definition list of rows. Each row is an ink-soft uppercase label and snow item-size content, with a ridge-blue pixel-dot rule on every row but the first. Labels and contents line up in two columns from 46rem and stack below it. Content is either items (a glyph and a word each, wrapping side by side) or a body-size ink-soft note followed by a list.

### Pixel Glyph
- A 9x9 grid of unit squares in ice (gear, note, prompt), nine scene pixels square so each grid cell is one scene pixel, decorative and hidden from assistive tech. One glyph leads each ledger item; it names the word, it does not decorate the line.

### Band Grid
- An unstyled list of names at item size in snow, set as an even grid (three columns from 64rem, two below, one under 24rem), each name led by a two-scene-pixel ice square and never wrapping.

### Level Meter
- Seven ice bars under the Listening label, each two scene pixels wide with one scene pixel between, standing in a box ten scene pixels tall, each capped with a frost pixel. Each bar jumps between whole-pixel heights on its own 1.1 to 1.9s cycle with `steps()` timing, never easing. Under reduced motion the bars stand still at their resting heights. Decorative and hidden from assistive tech.

### Selection
- Frost background with night text: the single cool-white highlight state the page has.

## Do's and Don'ts

### Do:
- **Do** keep the page field night and every surface flat; the canvases are the only images.
- **Do** draw any new pixel art on the same whole-number art-pixel grid (3 or 4 screen px) with `image-rendering: pixelated`, and size small marks in multiples of the scene pixel.
- **Do** step sky, aurora, and haze tones with ordered dither between palette colors.
- **Do** set every text role in Pixelify Sans 400 and build hierarchy by size, using snow for primary text and ink-soft for secondary.
- **Do** keep layout left-aligned inside the fluid gutter, with generous viewport-scaled vertical space; add new facts as ledger rows on the shared label column.
- **Do** keep motion slow and stepped (10fps for the scene, `steps()` timing for CSS), pause it offscreen, and hold it still for reduced-motion users.
- **Do** draw rules as rows of square pixel dots in ridge blue.

### Don't:
- **Don't** use lamplight amber or ember anywhere beyond the cabin window and its reflection.
- **Don't** use the ice-blue set for words, labels, or surfaces; in the text layer it is only for small pixel marks.
- **Don't** round corners, add drop shadows, or put content in cards, panels, or bordered boxes.
- **Don't** use smooth gradients for sky, aurora, or haze tones.
- **Don't** draw rules with `border` or the browser's round dotted style.
- **Don't** add bold weights, italics, or a second typeface, or use uppercase tracking anywhere but the ledger label.
- **Don't** center the name over the scene or place it on a scrim; it sits on the sky (or, on portrait screens, on the water).
