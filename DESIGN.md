---
name: Vivien
description: One polar night in pixel art; an alpine fjord under a crescent moon, one lit cabin, and a plain ledger below the waterline that ends on a snowy shore.
colors:
  night: "#0f2b4c"
  space: "#071a31"
  ridge: "#1c3b5e"
  fjord: "#1e5568"
  snow: "#f3f3f3"
  ink-soft: "#c4d3e0"
  frost: "#e3f2fd"
  ice: "#90caf9"
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
    height: "var(--ui-px)"
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
    size: "calc(var(--ui-px) * 9)"
  band-name:
    textColor: "{colors.snow}"
    typography: "{typography.item}"
  band-marker:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    size: "calc(var(--ui-px) * 2)"
  level-meter-bar:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    width: "calc(var(--ui-px) * 2)"
---

# Design System: Vivien

## Overview

**Creative North Star: "One Polar Night"**

The whole page is a single night by a fjord. The first viewport is the place itself: a procedural pixel-art canvas of a clear starry sky, a crescent moon, a layered alpine range anchored by one tall horn peak, forested foothills, a pine shore with one lit cabin, and still water that reflects all of it. Nothing sits on top of the scene as a banner or card; the name is set straight into the sky (or, on portrait screens, onto the dark water at the scene's foot). Scrolling continues down into the water, which settles into the page field so the introduction reads as text under the waterline, and the page closes on a second, smaller canvas: a snowy pine bank, the far shore.

Below the waterline the introduction is one ledger: a few rows, each a small label beside its content, separated by rows of square pixel dots. One label column and one content edge hold every row, so the eye runs straight down. Small pixel marks drawn on the scene's grid (9x9 glyphs, square markers, a stepped level meter) give the text a little of the night's life. The atmosphere carries the personality: cold blues, hard pixel edges, ordered-dither tones, and exactly one warm light, which lives only in the scene. Hierarchy comes from size in one pixel face at one weight. There are no links, controls, borders, shadows-as-depth, or containers; the system is made of a field, two scenes, type, and a few pixel marks.

The direction contract still names a lamplight text mark; it was removed from the build at the user's request, and the build is the record here.

**Key Characteristics:**
- Canvas scenes drawn at a whole-number art-pixel scale (3 or 4 screen px per art pixel, 5 from 1760px wide and 6 from 2400px so wide screens keep the same composition) and upscaled with crisp, pixelated edges; the hero scene opens the page and a shore canvas closes it.
- Dark fjord set as ground; the ice-blue set is light: the sky, plus a few small pixel marks in the text.
- One warm accent, the cabin's lamplight, and only inside the scene.
- One face (Pixelify Sans, 400) across every role; size is the main hierarchy lever.
- One ledger below the scene: a fixed label column, one content edge, pixel-dot rules between rows.
- Square everything: no radius, no card, no border; rules and markers are square pixels on the scene grid.
- Quiet, stepped motion (the scene at 10 frames a second, the meter by whole-pixel jumps), paused offscreen and frozen for reduced-motion users. The CSS loops (meter, scroll cue) move by transform only, never height, so they cost no layout, and scene.js pauses each one while it is out of view.
- On paper the night drops away: print shows the name and the ledger dark on white, with no canvases, cue or meter.

## Colors

A cold, low-light palette of fjord blues on deep navy, lit by ice-blue starlight and snow and one amber window.

### Primary

### Secondary
- **Cabin Lamplight** (lamp): the one warm light. The cabin window and the near part of its broken reflection on the water. Scene-only; nothing in the text layer is warm.
- **Banked Ember** (ember): the dimmed lamplight; the window's shaded pixel and the far end of the lamp's reflection. Scene-only.

### Tertiary
- **Ice** (ice): in the scene, starlight, distant snowflakes on the shore, the crescent moon's limb, the lit west edge under the cabin's roof snow. In the text layer, the fill of the 9x9 pixel glyphs, the square marker before each band name, and the bars of the level meter.
- **Frost** (frost): the brightest snow crests, roof snow, the moon's face, near snowflakes on the shore, the brightest stars, the top cap pixel of each meter bar, the shore's snow edge, and the text selection background.

### Neutral
- **Polar Night** (night): the page field and hero background, and the middle step of the sky ramp. The CSS also carries it as `--deep` (same value) for the field below the waterline; treat them as one color.
- **Upper Space** (space): the darkest sky at the top of the canvas. Scene-only.
- **Ridge Blue** (ridge): the sky's lowest step near the horizon, the back hill on the shore canvas, the pixel-dot rules between ledger rows, and the scrollbar thumb.
- **Fjord Water** (fjord): the water's tint at the shoreline (it shades toward night with depth).
- **Snow** (snow): primary ink; the name, the ledger items, and the band names.
- **Soft Frost Ink** (ink-soft): secondary ink for the ledger labels and the note above the bands (9.3:1 on night).

The scenes shade their terrain with in-between blues defined in `scene.js` and nowhere else: haze (#24496f) and haze snow (#4a76a0) for the back range; lit snow (#a4c5e2), mid snow (#7fa7cc) and shaded snow (#46719c) for the alpine faces, couloirs and the shore's snowbank; far rock (#1b3c60) and far shade (#0e2645) for the lit and shaded rock faces (the shade sits a clear step below the night sky, so a shaded flank never melts into the sky behind it); hill (#0f2745), hill tree (#0b1f3a) and hill snow (#3f6a94) for the forested foothills; near shore (#0a1e36), pine (#06152a) and cabin timber (#081829); dim star (#4a6f99) for the faint majority of stars and the arms of the rare crossed star; earthshine (#193858) for the moon's dark disc. Chimney smoke reuses shaded snow and haze; the moon's halo is two rings taken from the sky's own ramp, one and two steps up from the night behind them. These are rendering shades of the palette, not page tokens; do not use them in CSS.

### Named Rules
**The One Warm Light Rule.** Lamplight amber and ember appear only in the cabin window and its reflection on the water. Every other color on the page, scene and text alike, is cold. A second warm element breaks the night.

**The Ice Is Light Rule.** The ice-blue set (frost, ice) is light, never ground. It belongs to the sky (stars, moon, snow crests, and the shore's snowfall) and, in the text layer, only to small pixel marks: the 9x9 glyphs, the band markers, and the level meter, with frost as the meter's cap pixel and the selection highlight. Words, labels, and surfaces stay in snow, ink-soft, and night.

## Typography

**Display Font:** Pixelify Sans (with ui-sans-serif, sans-serif), self-hosted woff2 in latin and latin-ext subsets, variable 400 to 700
**Body Font:** Pixelify Sans (same files)

**Character:** A single pixel face that shares the scene's grid, so the name looks drawn in the same night as the mountains. It stays at regular weight everywhere; the pixel grid already gives it all the weight it needs.

### Hierarchy
- **Display** (400, display size, 0.9): the name only. Sized from the scene scale, not a fluid clamp: `calc(var(--scene-px) * 32.64)`, so each glyph pixel lands on exactly three art pixels. That is the listed 131px at a 4px scene scale, about 98px at 3px, and up to 196px on very wide screens. The name stands alone in the hero; what Vivien does is said once, in the ledger.
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

Inside a row, items wrap side by side with 0.5rem between lines and `spacing.item-gap` between items. A glyph or marker sits `spacing.glyph-gap` before its word. A note above a list takes the full row width with 0.5rem under it. The band names form an even grid, three columns from 72rem, two below, and one under 24rem, at the same item gap with 0.35em between lines; a name never wraps. The level meter sits 0.9rem under its label when rows are two columns; when they stack (phones) it stands beside the label on its baseline, so it doesn't take a line of its own.

The nameplate tops out at 44rem. The name is 3 scene pixels a letter pixel; below 300px (a folded Fold is 280px) it drops to 2 so it fits, still on the grid.

The scene's responsiveness lives in `scene.js`. The art scale is 3px per art pixel below a 1280px-wide hero, 4px from 1280px, 5px from 1760px and 6px from 2400px, so the composition holds on wide screens; the shore canvas uses the same scale. When the hero is portrait (height over 1.15 times the width), the scene sets a portrait flag: the horizon drops from 80% to 60% of the height so the fjord is taller, the horn peak and moon shift to suit the narrow sky (on landscape screens the moon sits in the open sky at least a few art pixels past the name, so it never crowds it), and the nameplate leaves the sky and rests at the bottom of the hero on the dark water.

### Named Rules
**The One Edge Rule.** Every ledger row shares one label column and one content edge. New facts join the ledger as rows; they do not open a second layout.

## Elevation & Depth

Flat. Nothing on the page is lifted, layered, or shadowed. Depth is atmospheric and lives inside the scenes: a pale hazy back range, the brighter alpine range, darker forested foothills, a near-black shore; the water is a darkened, rippling mirror that steps down through a few fixed depth bands into the page colour. On the page itself there is one plane, the night field, and type and pixel marks sit directly on it. The only `box-shadow` in the CSS is an unblurred inset that paints each meter bar's top pixel in frost; it is a pixel fill, not a shadow.

### Named Rules
**The Depth Is Distance Rule.** Separation comes from atmospheric value steps in the scene and from space on the page, never from drop shadows, overlays, or raised surfaces.

**The Spruce Rule.** Every pine, in the hero and on the shore, is drawn from one tiered silhouette: a one-pixel tip, then tiers that flare a pixel a row and start each next tier a pixel narrower, never stepping back to the bare stem (which reads as a cross).

**The Dithered Sky Rule.** Sky and haze tones change only in flat steps joined by a narrow ordered dither seam, at whole art pixels; never a smooth CSS or canvas gradient, and never dither spread across a whole field as texture. The sky is nine close flat bands from space through night to ridge, each a quarter step from its neighbour, whose seams are exactly two rows of 50% checker, so each join reads as a soft change rather than a drawn line; lit snow is one clean plane. The water is the one exception: it reads the mirror in pixel pairs, so a checker seam above reflects as one flat band rather than a dotted line, and blends the reflection into the fjord tint row by row, still on whole art pixels, and fades out into the night field. Nothing else is laid on it: no glints, no drifting lines, no noise.

## Shapes

Square and hard-edged throughout (`rounded.none`). Both canvases render with `image-rendering: pixelated`, so every edge in the art is a stair-stepped pixel edge. Small marks are made of square pixels sized in whole scene pixels: the glyphs are 9x9 grids of unit squares at nine scene pixels square, rendered with crisp edges; the band markers are two scene pixels square; the meter's bars are two scene pixels wide. The ledger's rules are a row of square dots (one scene pixel on, one off, one scene pixel tall) painted as a hard-stop repeating background, never a border. There are no borders, outlines, boxes, or clipped shapes in the layout.

## Components

The page has no buttons, inputs, navigation, or cards, by product decision (no links). The recurring pieces are scene, type, the ledger, and pixel marks.

### Pixel Night Scene (signature)
- **What:** a full-bleed canvas in the hero, drawn procedurally from fixed seeds so every visit shows the same place: stars, a crescent moon (its dark disc faintly visible by earthshine, inside a two-ring halo), a hazy back range with a clean one-pixel snow edge on its highest peaks, an alpine range with one tall horn (lit on its west faces, toward the moon), shouldered peaks, an uneven snowline whose lower edge breaks into tongues down the fall line (never a flat cut), rock ribs two pixels wide at a clean 1:2 step, and snow couloirs that only hang from a real snowcap, forested foothills edged with small distant spruce (tapering spires, close-set where the forest is dense, so the crest is a serrated forest edge), valley mist where the range's foot meets the foothills (a clean solid haze band, so the planes part), a pine shore with a faint broken snow rim along the waterline, one cabin with roof snow (lit on the west slope, shaded on the east), a lit window and a stone chimney a step lighter than the timber with its snow cap sitting on it, and the reflecting fjord: a mirror of the whole range, its rows folded tighter on wide screens (where the fjord is shallow) so the peaks and their snow still reach the water, fading into the page colour by the hero's foot. The sky is clear: no snow falls in the hero, so nothing crosses the name.
- **Rendering:** low-resolution buffer (about 320 art pixels across on desktop) upscaled by an exact whole number (the canvas element is sized to W x scale, overhanging its box by under one art pixel), so every art pixel is the same size; the art scale is published to CSS as `--scene-px` (and as `--ui-px`, capped at 4px, for the icons, meter, band markers and row rules so they stay in proportion to the text), and the nameplate's padding is rounded to it so the name's pixels sit on the art's. Per frame, the sky's colours are precomputed per row and every colour the loops write is packed once, so each frame is little more than copying rows and the water.
- **Stars:** three tiers: mostly dim, some ice, a few frost, and a rare frost star with a cross of dim light. They gather in a soft diagonal drift and thin toward the horizon, never touch each other, and keep two pixels clear of the terrain and the moon's halo; never in or right beside the name's letters, where a lone pixel would read as a flaw in the type. A twinkle dims a star one step; it never blinks out.
- **Motion:** star twinkle, chimney smoke (its gaps climb with it, four rows a second), water ripple (a slow swell rolling toward the viewer in bands that thicken with depth; each band slides as one and never more than a pixel either way, as still water does, so the mirror never tears row by row), a short column of fixed lamp dashes under the window that ride the swell and cool from lamp to ember with depth, a cabin lamp that gutters one pane to ember for about a fifth of a second, roughly once every eight seconds, and the moon's glade (a straight column of fixed broken dashes beneath the moon, which never blink, narrow at the far shore and widening toward the viewer as a glitter path does, paling from lit to shaded snow with depth, riding the same swell as the water, never a solid column), stepped at 10 frames a second. The water fades fully into the page colour before the hero's edge, with no dither stripe. The shore canvas at the page foot keeps the snow falling at two depths, far flakes passing behind the pines, and runs only while it is on screen. It pauses when offscreen or the tab is hidden; with reduced motion it renders one still frame.
- **Arrival:** when motion is welcome, one line in the page head adds `.reveal` to the root before first paint, so the name never flashes in and then vanishes: the name (a box exactly as wide as the word) wipes in left to right in 6 steps, about a letter each, and the cue follows; the clip lifts when the wipe ends. The ledger is never held back, so previews, print and full-page captures always show it. Without the class nothing is hidden.
- **Share preview:** `og.png`, a 1200x630 capture of the hero at rest, is the Open Graph and large Twitter card image. It is captured at a 1280px viewport (the 4px grid, so the name is large and every pixel even), at the reduced-motion still frame, without the scroll cue. After every visual change run `node tools/og.js`: it rewrites og.png and sets the `?v=` query on `og:image` to the image's hash, so platforms that cache previews by URL fetch the new one.
- **Favicon:** `favicon.svg`, a 16x16 pixel peak (lit left flank in shaded snow, right flank in ridge, a stepped asymmetric snow cap) under a crescent moon and three stars, on night; `apple-touch-icon.png` is the same art at 11x on 180px.
- **Browser chrome:** `theme-color` is the sky's top tone, #071a31, so a mobile browser bar meets the sky without a step.
- **Accessibility:** the canvas is `role="img"` with a one-sentence description of the scene.

### Shore
- A full-bleed canvas closing the page, in a plain `div` (not an empty footer landmark): the night field over a ridge-blue back hill, a snowbank rolling in low drifts (a frost edge, then lit, mid, and shaded snow in clean bands that follow the drift's own contour, with no dithered seams), dark pines standing in it with their skirts reaching the drift beneath and a short shaded-snow moon shadow to their right, with snow still falling over it at two depths (far flakes behind the pines). Animated only while on screen, decorative and hidden from assistive tech.

### Nameplate
- Display-size snow text, the name alone, set directly over the sky at the left. No role line, glyph, backing panel, or scrim. In portrait it moves to the hero's foot, over the dark water, clamp(1.5rem, 5vh, 3rem) above it, so the name stays close to the first ledger row.

**Scroll Cue**
- A 7x4 ice pixel chevron centred at the foot of the hero, drawn at scene-pixel size, nudging down one scene pixel on a 1.4s `steps()` loop. Hidden in portrait (the name occupies the hero's foot there), still under reduced motion, decorative and hidden from assistive tech.

### Ledger (signature)
- A definition list of rows. Each row is an ink-soft uppercase label and snow item-size content, with a ridge-blue pixel-dot rule on every row but the first. Labels and contents line up in two columns from 46rem and stack below it. Content is either items (a glyph and a word each, wrapping side by side) or a body-size ink-soft note followed by a list.

### Pixel Glyph
- A 9x9 grid of unit squares in ice (gear, note, prompt), nine scene pixels square so each grid cell is one scene pixel, decorative and hidden from assistive tech. One glyph leads each ledger item; it names the word, it does not decorate the line.

### Band Grid
- An unstyled list of names at item size in snow, set as an even grid (three columns from 72rem, where they still end inside the row rule; two below, one under 24rem), each name led by a two-scene-pixel ice square and never wrapping.

### Level Meter
- Seven ice bars under the Listening label (beside it when rows stack), each two scene pixels wide with one scene pixel between, standing in a box ten scene pixels tall, each capped with a frost pixel. Each bar jumps between whole-pixel heights on its own 1.1 to 1.9s cycle with `steps()` timing, never easing. Under reduced motion the bars stand still at their resting heights. Decorative and hidden from assistive tech.

### Selection
- Frost background with night text: the single cool-white highlight state the page has.

## Do's and Don'ts

### Do:
- **Do** keep the page field night and every surface flat; the canvases are the only images.
- **Do** draw any new pixel art on the same whole-number art-pixel grid (3 to 6 screen px) with `image-rendering: pixelated`, and size small text-layer marks in multiples of `--ui-px` (the scene pixel, capped at 4px).
- **Do** step sky and haze tones in flat bands, with ordered dither only in the narrow seam between two of them.
- **Do** set every text role in Pixelify Sans 400 and build hierarchy by size, using snow for primary text and ink-soft for secondary.
- **Do** keep layout left-aligned inside the fluid gutter, with generous viewport-scaled vertical space; add new facts as ledger rows on the shared label column.
- **Do** keep motion slow and stepped (10fps for the scene, `steps()` timing for CSS), pause it offscreen, and hold it still for reduced-motion users.
- **Do** draw rules as rows of square pixel dots in ridge blue.
- **Do** keep the water clean: the swell is its only motion and the glade and lamp dashes only ride it; never add glints, sparkles, drifting lines or per-pixel noise, which read as choppy or broken at this scale.
- **Do** keep the fjord on a fixed palette: the water is six depth bands (the last one exactly the page colour), and each reflected pixel takes one of six colours per band by what it reflects (dark shore, shaded rock, sky and lit rock, haze, shaded snow, lit snow); what each water pixel reflects is worked out once, since the mirror never changes. Never blend reflections continuously; that mints dozens of one-off colours. The mirror is true to size at the shoreline and folds tighter with depth (source rows u + a·u²); on portrait screens it settles to calm water just above the name, so the letters never sit on reflected snow; and the pines reflect as a dark band and the peaks still reach the water; where it folds several rows into one, the brightest of them wins, so ribs and snow tongues never alias into specks. The dark shore reflects 1.8 times as strongly as the sky, so the water under the pines reads as their reflection.
- **Do** keep ridgelines clean: the crest's ruggedness lives at the scale of shoulders and dips (low-frequency noise), so each stretch of slope keeps an even stair-step of one- and two-pixel runs that change gradually, never a column-by-column stutter; no one-column notches, a summit ends in a single tip pixel, the frost crest covers every pixel the sky touches from above or from the west so it runs unbroken down steep steps, and the light/shadow split starts exactly at the summit.
- **Do** keep the snow free of orphans: a snow patch of six pixels or fewer, or a small patch that never reaches the ridge crest, is noise and takes the rock colour beside it; likewise a rock speck of three pixels or fewer walled in by snow takes the snow beside it.
- **Do** light the terrain from the moon's side: lit faces and the pines' shadows agree with where the moon hangs. The pines stay clean dark silhouettes, with no snow or rim pixels on their tiers, which read as speckle in dense stands.

### Don't:
- **Don't** use lamplight amber or ember anywhere beyond the cabin window and its reflection.
- **Don't** use the ice-blue set for words, labels, or surfaces; in the text layer it is only for small pixel marks.
- **Don't** round corners, add drop shadows, or put content in cards, panels, or bordered boxes.
- **Don't** use smooth gradients for sky or haze tones, or spread dither over a whole surface as texture; it reads as noise and leaves orphan pixels.
- **Don't** draw rules with `border` or the browser's round dotted style.
- **Don't** add bold weights, italics, or a second typeface, or use uppercase tracking anywhere but the ledger label.
- **Don't** center the name over the scene or place it on a scrim; it sits on the sky (or, on portrait screens, on the water).
