---
name: Vivien
description: One polar night in pixel art; a fjord, an aurora, one lit cabin, and a plain introduction below the waterline.
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
    lineHeight: 1.12
  headline:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.1
  lead:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 1vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Pixelify Sans, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
spacing:
  px: "4px"
  gap: "0.75rem"
  gutter: "clamp(1rem, 6vw, 6rem)"
  section: "clamp(5rem, 16vh, 10rem)"
components:
  nameplate:
    textColor: "{colors.snow}"
    typography: "{typography.display}"
    padding: "clamp(5rem, 16vh, 10rem) clamp(1rem, 6vw, 6rem) 0"
    width: "44rem"
  band-lineup:
    textColor: "{colors.snow}"
    typography: "{typography.lineup}"
  section-title:
    textColor: "{colors.snow}"
    typography: "{typography.headline}"
  aside-line:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
  lamp-mark:
    backgroundColor: "{colors.lamp}"
    rounded: "{rounded.none}"
    size: "8px"
---

# Design System: Vivien

## Overview

**Creative North Star: "One Polar Night"**

The whole page is a single night by a fjord. The first viewport is the place itself: a procedural pixel-art canvas of aurora, layered snowy ridges, a pine shore with one lit cabin, and still water that reflects all of it. Nothing sits on top of the scene as a banner or card; the name is set straight into the sky (or, on portrait screens, onto the dark water at the scene's foot). Scrolling continues down into the water, which settles into the page field so the introduction below reads as text under the waterline, not as a separate section.

Density is very low and the copy is plain. The atmosphere carries the personality: cold blues, hard pixel edges, ordered-dither tones, and exactly one warm light. Hierarchy comes from size alone in one pixel face at one weight. There are no links, controls, borders, shadows, or containers; the system is made of a field, a scene, and type.

**Key Characteristics:**
- A canvas scene drawn at a whole-number art-pixel scale (3 or 4 screen px per art pixel) and upscaled with crisp, pixelated edges.
- Dark fjord set as ground; ice-blue set reserved for aurora, frost, starlight and glints.
- One warm accent, the cabin's lamplight, plus a single matching text mark.
- One face (Pixelify Sans, 400) across every role; size is the only hierarchy lever.
- Square everything: no radius, no shadow, no card, no border.
- Quiet motion at 10 frames a second, paused offscreen and frozen for reduced-motion users.

## Colors

A cold, low-light palette of fjord blues on deep navy, lit by ice-blue aurora and one amber window.

### Primary
- **Aurora Glacier** (glacier): the bright core of the aurora curtains. Lives only inside the scene's aurora ramp (abyss, glacier, ice, frost, dithered between steps).
- **Deep Aurora Abyss** (abyss): the faint outer edge of the aurora, where the curtain fades into sky.

### Secondary
- **Cabin Lamplight** (lamp): the one warm light. The cabin window, its broken reflection on the water, and the small square mark beside the closing line. Nowhere else.
- **Banked Ember** (ember): the dimmed lamplight; the window's shaded pixel and the far end of the lamp's reflection. Scene-only.

### Tertiary
- **Ice** (ice): starlight, the lit edge under the cabin's snowy roof, and the aurora's upper-bright step.
- **Frost** (frost): the brightest snow crest pixels, roof snow, brightest stars, the aurora's peak step, and the text selection background.

### Neutral
- **Polar Night** (night): the page field and the hero background, and the middle step of the sky ramp. The CSS also carries it as `--deep` (same value) for the field below the waterline; treat them as one color.
- **Upper Space** (space): the darkest sky at the top of the canvas. Scene-only.
- **Ridge Blue** (ridge): the sky's lowest step near the horizon and the scrollbar thumb.
- **Fjord Water** (fjord): the water's tint at the shoreline (it shades toward night with depth) and the ice glints on the water.
- **Snow** (snow): primary ink; the name, section title, and band lineup.
- **Soft Frost Ink** (ink-soft): secondary ink for the lead sentence, asides, and the closing line (9.3:1 on night).

The scene also shades its mountains with in-between blues (lit snow, shaded snow, far and mid rock, near shore, pine, cabin timber) defined in `scene.js`. They are rendering shades of this palette, not page tokens; do not use them in CSS.

### Named Rules
**The One Warm Light Rule.** Lamplight amber appears in exactly two places: the cabin window (with its reflection) and one small text mark. Every other color on the page is cold. A second warm element breaks the night.

**The Ice Stays in the Sky Rule.** The ice-blue set (frost, ice, glacier, abyss) belongs to aurora, stars, snow crests, and glints. Text and page surfaces use snow, ink-soft, and night; ice blue is never a text or fill color in the layout. Frost's one CSS use is the selection highlight.

## Typography

**Display Font:** Pixelify Sans (with ui-sans-serif, sans-serif), self-hosted woff2, variable 400 to 700
**Body Font:** Pixelify Sans (same file)

**Character:** A single pixel face that shares the scene's grid, so the name looks drawn in the same night as the mountains. It stays at regular weight everywhere; the pixel grid already gives it all the weight it needs.

### Hierarchy
- **Display** (400, display size, 0.9): the name only. Sized from the scene scale, not a fluid clamp: `calc(var(--scene-px) * 21.76)`, so each glyph pixel lands on exactly two art pixels. That is the listed 87px at a 4px scene scale and about 65px at 3px.
- **Lineup** (400, lineup size, 1.12): the five band names, one per line, set like a festival lineup poster. Deliberately the largest type below the hero, larger than the section title.
- **Headline** (400, headline size, 1.1): section titles.
- **Lead** (400, lead size, 1.2 to 1.25): the role line under the name and the opening sentence below the waterline; the lead sentence uses ink-soft, balanced wrapping, and a 34rem measure.
- **Body** (400, body size, 1.5): asides and default text.
- **Label** (400, 1rem): the closing line beside the lamp mark, in ink-soft.

### Named Rules
**The One Face, One Weight Rule.** Every role is Pixelify Sans at 400. Hierarchy is made by size (and ink-soft versus snow), never by bold, italics, caps, tracking, or a second family.

**The Name on the Grid Rule.** The display size is derived from the scene's pixel scale so the name's pixels align with the art's pixels. Never set the name in a free fluid size that breaks that lock.

## Layout

A single left-aligned column with a generous fluid gutter (`spacing.gutter`) on both sides; nothing is centered. The hero is 92svh (minimum 30rem) and holds the full-bleed canvas. Below it, `main` opens with large section padding (`spacing.section` at the top, a slightly smaller clamp at the bottom), so the descent from the scene into the text feels like sinking into the water.

Measures are narrow: the nameplate tops out at 44rem, the lead sentence at 34rem, the music section at 60rem. Small vertical steps use `spacing.gap` and 1.25rem; larger gaps use viewport-scaled clamps (2 to 3.5rem). Lists are unstyled; each band name is its own line and is never left to wrap.

Responsive behavior lives in the scene, not in media queries. The art scale is 4px per art pixel from a 1280px-wide hero up, and 3px below that. When the hero is portrait (height over 1.15 times the width), the scene sets a portrait flag: the horizon drops from 80% to 60% of the height so the fjord is taller, and the nameplate leaves the sky and rests at the bottom of the hero on the dark water.

## Elevation & Depth

Flat. No shadows exist in this system, and none should be added. Depth is atmospheric and lives inside the scene: farther ridges are lighter and bluer, nearer ones darker, the shore near-black; the water is a darkened, rippling mirror that fades with depth and dithers into the page field. On the page itself there is one plane, the night field, and type sits directly on it.

### Named Rules
**The Depth Is Distance Rule.** Separation comes from atmospheric value steps in the scene and from space on the page, never from shadows, overlays, or raised surfaces.

**The Dithered Sky Rule.** Sky and aurora tones change only through a 4x4 ordered (Bayer) dither between palette steps, at whole art pixels; never a smooth CSS or canvas gradient. The water is the one exception: its mirror blends the reflection into the fjord tint row by row, still on whole art pixels, and its last fifth dithers out into the night field.

## Shapes

Square and hard-edged throughout (`rounded.none`). The canvas renders with `image-rendering: pixelated`, so every edge in the art is a stair-stepped pixel edge. Sizes of small marks are multiples of the 4px pixel unit (`spacing.px`): the lamp mark is 2 units square. There are no borders, outlines, dividers, or clipped shapes in the layout.

## Components

The page has no buttons, inputs, navigation, or cards, by product decision (no links). The recurring pieces are scene and type.

### Pixel Night Scene (signature)
- **What:** a full-bleed canvas in the hero, drawn procedurally from a fixed seed so every visit shows the same place: stars, two drifting aurora curtains, far and mid ridges with lit east faces, a pine shore, one cabin with snow on the roof and a lit window, and the reflecting fjord.
- **Rendering:** low-resolution buffer (about 320 art pixels across on desktop) upscaled with crisp pixels; the art scale is published to CSS as `--scene-px`.
- **Motion:** aurora drift, star twinkle, water ripple, and a flickering lamp reflection, stepped at 10 frames a second. It pauses when offscreen or the tab is hidden; with reduced motion it renders one still frame.
- **Accessibility:** the canvas is `role="img"` with a one-sentence description of the scene.

### Nameplate
- Display-size snow text set directly over the sky at the left, with the lead-size role line beneath (1.25rem gap). No backing panel or scrim. In portrait it moves to the hero's foot, over the dark water.

### Band Lineup
- An unstyled list in snow at lineup size, one name per line, sitting under a headline and a one-line ink-soft aside.

### Lamp Mark
- A square of lamplight (2 by 2 pixel units) beside the closing line in ink-soft label type, with a 0.75rem gap. Decorative and hidden from assistive tech. It is the only warm thing outside the scene and echoes the cabin window.

### Selection
- Frost background with night text: the single cool-white highlight state the page has.

## Do's and Don'ts

### Do:
- **Do** keep the page field night and every surface flat; the scene is the only image.
- **Do** draw any new pixel art on the same whole-number art-pixel grid (3 or 4 screen px) with `image-rendering: pixelated`, and size small marks in multiples of the 4px unit.
- **Do** step sky and aurora tones with ordered dither between palette colors.
- **Do** set every text role in Pixelify Sans 400 and build hierarchy by size, using snow for primary text and ink-soft for secondary.
- **Do** keep layout left-aligned in one column inside the fluid gutter, with generous viewport-scaled vertical space.
- **Do** keep motion slow and stepped (10fps), pause it offscreen, and render a still frame for reduced-motion users.

### Don't:
- **Don't** use lamplight amber anywhere beyond the cabin window, its reflection, and the single text mark.
- **Don't** use the ice-blue set for text, fills, or layout elements; it belongs to the sky.
- **Don't** round corners, add shadows, or put content in cards, panels, or bordered boxes.
- **Don't** use smooth gradients for sky or aurora tones.
- **Don't** add bold weights, italics, uppercase tracking, or a second typeface.
- **Don't** center the name over the scene or place it on a scrim; it sits on the sky (or, on portrait screens, on the water).
