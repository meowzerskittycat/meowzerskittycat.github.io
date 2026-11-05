---
name: Vivien
description: One polar night in pixel art; an alpine fjord, an aurora, one lit cabin, and a plain introduction below the waterline that ends on a snowy shore.
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
    fontSize: "87px"
    fontWeight: 400
    lineHeight: 0.9
  lineup:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.2
  statement:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.8vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.35
  headline:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.1
  lead:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 1vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
spacing:
  px: "4px"
  tight: "0.6em"
  gutter: "clamp(1rem, 6vw, 6rem)"
  sky-top: "clamp(5rem, 16vh, 10rem)"
  descent: "clamp(3.5rem, 9vh, 6rem)"
  section: "clamp(4rem, 11vh, 7rem)"
components:
  nameplate:
    textColor: "{colors.snow}"
    typography: "{typography.display}"
    padding: "clamp(5rem, 16vh, 10rem) clamp(1rem, 6vw, 6rem) 0"
    width: "44rem"
  role-line:
    textColor: "{colors.snow}"
    typography: "{typography.lead}"
  lead-sentence:
    textColor: "{colors.ink-soft}"
    typography: "{typography.statement}"
    width: "38rem"
  trade-word:
    textColor: "{colors.snow}"
    typography: "{typography.statement}"
  pixel-icon:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    size: "0.9em"
  section-title:
    textColor: "{colors.snow}"
    typography: "{typography.headline}"
  aside-line:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
  level-meter-bar:
    backgroundColor: "{colors.ice}"
    rounded: "{rounded.none}"
    width: "calc(var(--scene-px) * 3)"
  band-lineup:
    textColor: "{colors.snow}"
    typography: "{typography.lineup}"
    width: "64rem"
  lineup-divider:
    backgroundColor: "{colors.ridge}"
    height: "var(--scene-px)"
---

# Design System: Vivien

## Overview

**Creative North Star: "One Polar Night"**

The whole page is a single night by a fjord. The first viewport is the place itself: a procedural pixel-art canvas of aurora, a crescent moon, falling snow, a layered alpine range anchored by one tall horn peak, forested foothills, a pine shore with one lit cabin, and still water that reflects all of it. Nothing sits on top of the scene as a banner or card; the name is set straight into the sky (or, on portrait screens, onto the dark water at the scene's foot). Scrolling continues down into the water, which settles into the page field so the introduction reads as text under the waterline, and the page closes on a second, smaller canvas: a snowy pine bank, the far shore.

Density is low but no longer bare: the copy is plain, and small pixel marks drawn on the same grid as the scene (three 9x9 glyphs and a stepped level meter) give the text a little of the night's life. The atmosphere carries the personality: cold blues, hard pixel edges, ordered-dither tones, and exactly one warm light, which now lives only in the scene. Hierarchy comes from size in one pixel face at one weight. There are no links, controls, borders, shadows-as-depth, or containers; the system is made of a field, two scenes, type, and a few pixel marks.

The direction contract still names a lamplight text mark and a closing political line; both were removed from the build at the user's request, and the build is the record here.

**Key Characteristics:**
- Canvas scenes drawn at a whole-number art-pixel scale (3 or 4 screen px per art pixel) and upscaled with crisp, pixelated edges; the hero scene opens the page and a shore canvas closes it.
- Dark fjord set as ground; the ice-blue set is light: the sky, plus a few small pixel marks in the text.
- One warm accent, the cabin's lamplight, and only inside the scene.
- One face (Pixelify Sans, 400) across every role; size is the main hierarchy lever.
- Square everything: no radius, no card, no border; dividers are rows of square pixel dots.
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
- **Ice** (ice): in the scene, starlight, distant snowflakes, the crescent moon's limb, the lit edge under the cabin's roof snow, and the aurora's upper-bright step. In the text layer, the fill of the 9x9 pixel glyphs and the bars of the level meter.
- **Frost** (frost): the brightest snow crests, roof snow, the moon's face, near snowflakes, the brightest stars, the shooting star's head, the aurora's peak step, the top cap pixel of each meter bar, the shore's snow edge, and the text selection background.

### Neutral
- **Polar Night** (night): the page field and hero background, and the middle step of the sky ramp. The CSS also carries it as `--deep` (same value) for the field below the waterline; treat them as one color.
- **Upper Space** (space): the darkest sky at the top of the canvas. Scene-only.
- **Ridge Blue** (ridge): the sky's lowest step near the horizon, the back hill on the shore canvas, the square-dot dividers between band names, and the scrollbar thumb.
- **Fjord Water** (fjord): the water's tint at the shoreline (it shades toward night with depth) and the ice glints on the water.
- **Snow** (snow): primary ink; the name, the role line, the trade words in the lead sentence, the section title, and the band lineup.
- **Soft Frost Ink** (ink-soft): secondary ink for the lead sentence and the aside (9.3:1 on night).

The scenes shade their terrain with in-between blues defined in `scene.js` and nowhere else: haze (#24496f) and haze snow (#4a76a0) for the back range; lit snow (#a4c5e2), mid snow (#7fa7cc) and shaded snow (#46719c) for the alpine faces, couloirs and the shore's snowbank; far rock (#1b3c60) and far shade (#132e4e) for the ribs; hill (#0f2745), hill tree (#0b1f3a) and hill snow (#3f6a94) for the forested foothills; near shore (#0a1e36), pine (#06152a) and cabin timber (#081829). Chimney smoke reuses shaded snow and haze. These are rendering shades of the palette, not page tokens; do not use them in CSS.

### Named Rules
**The One Warm Light Rule.** Lamplight amber and ember appear only in the cabin window and its reflection on the water. Every other color on the page, scene and text alike, is cold. A second warm element breaks the night.

**The Ice Is Light Rule.** The ice-blue set (frost, ice, glacier, abyss) is light, never ground. It belongs to the sky (aurora, stars, moon, snowfall, shooting star, snow crests, glints) and, in the text layer, only to small pixel marks: the 9x9 glyphs and the level meter, with frost as the meter's cap pixel and the selection highlight. Words, headings, and surfaces stay in snow, ink-soft, and night.

## Typography

**Display Font:** Pixelify Sans (with ui-sans-serif, sans-serif), self-hosted woff2 in latin and latin-ext subsets, variable 400 to 700
**Body Font:** Pixelify Sans (same files)

**Character:** A single pixel face that shares the scene's grid, so the name looks drawn in the same night as the mountains. It stays at regular weight everywhere; the pixel grid already gives it all the weight it needs.

### Hierarchy
- **Display** (400, display size, 0.9): the name only. Sized from the scene scale, not a fluid clamp: `calc(var(--scene-px) * 21.76)`, so each glyph pixel lands on exactly two art pixels. That is the listed 87px at a 4px scene scale and about 65px at 3px.
- **Lineup** (400, lineup size, 1.2): the five band names, one per line, set like a festival lineup poster. The largest type below the hero.
- **Statement** (400, statement size, 1.35): the lead sentence below the waterline, in ink-soft with snow trade words, balanced wrapping, and a 38rem measure. Deliberately a step above the section title so the page opens on a sentence, not a heading.
- **Headline** (400, headline size, 1.1): section titles.
- **Lead** (400, lead size, 1.2): the role line under the name.
- **Body** (400, body size, 1.5): the aside and default text.

### Named Rules
**The One Face, One Weight Rule.** Every role is Pixelify Sans at 400. Hierarchy is made by size (and ink-soft versus snow), never by bold, italics, caps, tracking, or a second family.

**The Name on the Grid Rule.** The display size is derived from the scene's pixel scale so the name's pixels align with the art's pixels. Never set the name in a free fluid size that breaks that lock.

## Layout

Everything is left-aligned inside a generous fluid gutter (`spacing.gutter`) on both sides; nothing is centered. The hero is 92svh (minimum 30rem) and holds the full-bleed scene canvas, with the nameplate starting `spacing.sky-top` down. Below it, `main` opens after `spacing.descent` and separates its blocks by `spacing.section`, so the descent from the scene into the text feels like sinking into the water. The page ends on a full-bleed shore canvas, clamp(7rem, 20vh, 12rem) tall, with no gap or rule above it.

Measures stay narrow: the nameplate tops out at 44rem, the lead sentence at 38rem, the music section at 64rem. Small gaps inside a line or block use `spacing.tight` (0.6em between a glyph and its words, 0.6rem under the section title); the level meter sits 1.75rem below the aside.

The music section is the one place with two columns: from 52rem wide it splits into a head column (minmax(14rem, 20rem)) holding the title, aside, and meter, and a lineup column taking the rest, with a clamp(3rem, 8vw, 8rem) column gap. Below 52rem it stacks. Lists are unstyled; each band name is its own line and is never left to wrap.

The scene's responsiveness lives in `scene.js`. The art scale is 4px per art pixel from a 1280px-wide hero up and 3px below; the shore canvas uses the same scale. When the hero is portrait (height over 1.15 times the width), the scene sets a portrait flag: the horizon drops from 80% to 60% of the height so the fjord is taller, the horn peak and moon shift to suit the narrow sky, and the nameplate leaves the sky and rests at the bottom of the hero on the dark water.

## Elevation & Depth

Flat. Nothing on the page is lifted, layered, or shadowed. Depth is atmospheric and lives inside the scenes: a pale hazy back range, the brighter alpine range, darker forested foothills, a near-black shore; the water is a darkened, rippling mirror that fades with depth and dithers into the page field. On the page itself there is one plane, the night field, and type and pixel marks sit directly on it. The only `box-shadow` in the CSS is an unblurred inset that paints each meter bar's top pixel in frost; it is a pixel fill, not a shadow.

### Named Rules
**The Depth Is Distance Rule.** Separation comes from atmospheric value steps in the scene and from space on the page, never from drop shadows, overlays, or raised surfaces.

**The Dithered Sky Rule.** Sky, aurora, and haze tones change only through a 4x4 ordered (Bayer) dither between palette steps, at whole art pixels; never a smooth CSS or canvas gradient. The water is the one exception: its mirror blends the reflection into the fjord tint row by row, still on whole art pixels, and its last fifth dithers out into the night field.

## Shapes

Square and hard-edged throughout (`rounded.none`). Both canvases render with `image-rendering: pixelated`, so every edge in the art is a stair-stepped pixel edge. Small marks are made of square pixels: the glyphs are 9x9 grids of unit squares rendered with crisp edges, the meter's bars are whole multiples of the scene pixel, and the lineup's dividers are a row of square dots (one scene pixel on, one off, one scene pixel tall) painted as a repeating background, never a border. There are no borders, outlines, boxes, or clipped shapes in the layout.

## Components

The page has no buttons, inputs, navigation, or cards, by product decision (no links). The recurring pieces are scene, type, and pixel marks.

### Pixel Night Scene (signature)
- **What:** a full-bleed canvas in the hero, drawn procedurally from fixed seeds so every visit shows the same place: stars, a crescent moon, two drifting aurora curtains, a hazy back range, an alpine range with one tall horn, shouldered peaks, an uneven snowline, rock ribs and snow couloirs, forested foothills with a comb of small pines, a pine shore, one cabin with roof snow, a lit window and a chimney, and the reflecting fjord.
- **Rendering:** low-resolution buffer (about 320 art pixels across on desktop) upscaled with crisp pixels; the art scale is published to CSS as `--scene-px`.
- **Motion:** aurora drift, star twinkle, snowfall at two depths, a shooting star of about 0.8s roughly every 11s, chimney smoke, water ripple, and a flickering lamp reflection, stepped at 10 frames a second. It pauses when offscreen or the tab is hidden; with reduced motion it renders one still frame.
- **Accessibility:** the canvas is `role="img"` with a one-sentence description of the scene.

### Shore
- A full-bleed canvas closing the page: the night field dithering down onto a ridge-blue back hill, a snowbank stepped from frost through lit, mid, and shaded snow, and dark pines standing in it. Drawn once at the scene's art scale, decorative and hidden from assistive tech.

### Nameplate
- Display-size snow text set directly over the sky at the left, with the lead-size role line beneath (1.25rem gap), led by the gear glyph. No backing panel or scrim. In portrait it moves to the hero's foot, over the dark water.

### Pixel Glyph
- A 9x9 grid of unit squares in ice (gear, note, prompt), decorative and hidden from assistive tech. 0.9em square beside the role line, 0.72em inline before each trade word in the lead sentence, where the trade word itself turns snow and never wraps away from its glyph. One glyph per role or trade; it names the word, it does not decorate the line.

### Level Meter
- Nine ice bars, each three scene pixels wide with one scene pixel between, standing in a box twelve scene pixels tall, each capped with a frost pixel. Each bar jumps between whole-pixel heights on its own 1.1 to 1.9s cycle with `steps()` timing, never easing. Under reduced motion the bars stand still at their resting heights. Decorative and hidden from assistive tech.

### Band Lineup
- An unstyled list in snow at lineup size, one name per line, separated by ridge-blue square-dot rows (none under the last). Sits in the second column beside the section title, aside, and meter on wide screens; stacks beneath them on narrow ones.

### Selection
- Frost background with night text: the single cool-white highlight state the page has.

## Do's and Don'ts

### Do:
- **Do** keep the page field night and every surface flat; the canvases are the only images.
- **Do** draw any new pixel art on the same whole-number art-pixel grid (3 or 4 screen px) with `image-rendering: pixelated`, and size small marks in multiples of the scene pixel.
- **Do** step sky, aurora, and haze tones with ordered dither between palette colors.
- **Do** set every text role in Pixelify Sans 400 and build hierarchy by size, using snow for primary text and ink-soft for secondary.
- **Do** keep layout left-aligned inside the fluid gutter, with generous viewport-scaled vertical space; split into two columns only where a heading and its list sit side by side.
- **Do** keep motion slow and stepped (10fps for the scene, `steps()` timing for CSS), pause it offscreen, and hold it still for reduced-motion users.
- **Do** draw dividers as rows of square pixel dots in ridge blue.

### Don't:
- **Don't** use lamplight amber or ember anywhere beyond the cabin window and its reflection.
- **Don't** use the ice-blue set for words, headings, or surfaces; in the text layer it is only for small pixel marks.
- **Don't** round corners, add drop shadows, or put content in cards, panels, or bordered boxes.
- **Don't** use smooth gradients for sky, aurora, or haze tones.
- **Don't** draw dividers with `border` or the browser's round dotted style.
- **Don't** add bold weights, italics, uppercase tracking, or a second typeface.
- **Don't** center the name over the scene or place it on a scrim; it sits on the sky (or, on portrait screens, on the water).
