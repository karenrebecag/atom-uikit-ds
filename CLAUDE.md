# ATOM UIKit Design System

Monorepo for the ATOM UIKit component library. Publishes tokens, CSS, animations, and framework components to npm under `@atom-uikit/` scope. Documented at `uikit.atomchat.io`.

## Scope

Web development components for landing pages, web apps, and marketing sites. This is NOT the brand/visual design system (that lives in `ATOM_DS` under `@atomchat.io/`).

## Packages

| Package | npm | Purpose |
|---------|-----|---------|
| `packages/tokens` | `@atom-uikit/tokens` | W3C DTCG design tokens (3 layers) |
| `packages/css` | `@atom-uikit/css` | Pure CSS components + utilities |
| `packages/animations` | `@atom-uikit/animations` | GSAP animation modules |
| `packages/components-react` | `@atom-uikit/components-react` | React 19 components |
| `packages/components-astro` | `@atom-uikit/components-astro` | Astro components |

---

## Token Architecture (3 layers)

```
Primitives (raw values)
    |
Semantic (intent-based aliases)
    |
Component (scoped to UI components)
```

### Layer 1: Primitives (`packages/tokens/src/primitives/`)

Raw design values. No semantic meaning. Updated manually.

```json
{
  "color": {
    "$type": "color",
    "zinc-950": { "$value": "#09090b" },
    "zinc-50": { "$value": "#fafafa" }
  }
}
```

**Rules:**
- Flat namespace, no nesting beyond one level
- Every value is a literal (no references)
- File per category: `colors.json`, `spacing.json`, `typography.json`, `radius.json`, `opacity.json`, `motion.json`, `elevation.json`

### Layer 2: Semantic (`packages/tokens/src/semantic/`)

Intent-based aliases following shadcn/ui pairing convention. Every surface token has a `-foreground` companion.

```json
{
  "primary": { "$type": "color", "$value": "{Primitive.Zinc.900}" },
  "primary-foreground": { "$type": "color", "$value": "{Primitive.Zinc.50}" }
}
```

**Surface pairs (bg + text that sits on it):**

| Token | Foreground | Usage |
|-------|-----------|-------|
| `background` | `foreground` | Default page |
| `card` | `card-foreground` | Elevated surfaces |
| `popover` | `popover-foreground` | Floating overlays |
| `primary` | `primary-foreground` | High-emphasis actions |
| `secondary` | `secondary-foreground` | Lower-emphasis actions |
| `muted` | `muted-foreground` | Subtle surfaces, disabled |
| `accent` | `accent-foreground` | Hover/focus highlights |
| `destructive` | `destructive-foreground` | Error, danger |
| `brand` | `brand-foreground` | Brand accent (#ff6600) |
| `success` | `success-foreground` | Success state |
| `warning` | `warning-foreground` | Warning state |
| `info` | `info-foreground` | Informational state |

**Utility tokens:** `border`, `input`, `ring`

**Dark mode:** Same token names with inverted values in `dark.json`. Applied via `[data-theme="dark"]` selector.

**Rules:**
- Every value is a reference to a primitive (never a literal)
- Surface token = background color. `-foreground` = text/icon color on that surface
- No interactive states here (hovered, pressed, focused) — those belong in component layer
- No product-specific tokens (inbox, notifications) — this is a generic web DS

### Layer 3: Component (`packages/tokens/src/components/`)

Scoped to a specific UI component. References semantic tokens.

```json
{
  "button": {
    "bg": {
      "primary-enabled": { "$value": "{bg.inverse-primary}" },
      "primary-hovered": { "$value": "{bg.inverse-secondary}" }
    }
  }
}
```

**Rules:**
- Every value references a semantic token (never a primitive, never a literal)
- Pattern: `{component}.{property}.{variant}-{state}`
- One file per component: `button.json`, `checkbox.json`, etc.

### Token naming

- W3C DTCG format: `{ "$value": "...", "$type": "..." }`
- kebab-case for all names
- CSS output: `--{layer}-{name}` e.g. `--button-bg-primary-enabled`

### Token update workflow

```
1. Edit JSON in src/primitives/, src/semantic/, or src/components/
2. Run `pnpm --filter @atom-uikit/tokens build`
3. Verify output in build/css/, build/js/
4. Test in Storybook
5. Commit + changeset
```

**No Figma sync.** All token updates are manual. This is intentional -- tokens are optimized for web development contexts, not mirrored from design files.

---

## Spacing

Base-4 geometric scale. 13 steps, each visually distinct.

| Token | px | Usage |
|-------|-----|-------|
| `spacing-0` | 0 | None |
| `spacing-1` | 4 | Hairline gaps, icon-to-text |
| `spacing-2` | 8 | Tight spacing, inline elements |
| `spacing-3` | 12 | Compact groups, form fields |
| `spacing-4` | 16 | Base unit, default gap |
| `spacing-5` | 20 | Comfortable spacing |
| `spacing-6` | 24 | Card padding, section inner |
| `spacing-8` | 32 | Card padding large, group gap |
| `spacing-10` | 40 | Section gap |
| `spacing-12` | 48 | Large section gap |
| `spacing-16` | 64 | Section padding |
| `spacing-20` | 80 | Hero spacing, page margin |
| `spacing-24` | 96 | Max spacing, hero padding |

**Rule:** Token number x 4 = pixel value. No exceptions.

---

## Radius

7 steps from sharp to full pill.

| Token | px | Usage |
|-------|-----|-------|
| `radius-none` | 0 | Sharp corners |
| `radius-sm` | 4 | Tags, badges |
| `radius-md` | 8 | Buttons, inputs, chips |
| `radius-lg` | 12 | Cards, dropdowns |
| `radius-xl` | 16 | Modals, large cards |
| `radius-2xl` | 24 | Hero elements, feature cards |
| `radius-full` | 9999 | Pills, circles, avatars |

---

## Opacity

8 steps. Perceptually distinct — no adjacent values that look the same.

| Token | Value | Usage |
|-------|-------|-------|
| `opacity-5` | 0.05 | Skeleton shimmer, ghost elements |
| `opacity-10` | 0.10 | Disabled backgrounds, faint tints |
| `opacity-20` | 0.20 | Hover overlays, subtle highlights |
| `opacity-30` | 0.30 | Backdrop light, soft overlays |
| `opacity-50` | 0.50 | Backdrop medium, placeholder text |
| `opacity-70` | 0.70 | Backdrop heavy, dimmed content |
| `opacity-80` | 0.80 | Modal overlay, focus backdrop |
| `opacity-90` | 0.90 | Near-opaque layers, frosted glass |

---

## Stroke

6 steps with semantic names. Covers dividers through decorative borders.

| Token | px | Usage |
|-------|-----|-------|
| `stroke-none` | 0 | No border |
| `stroke-hairline` | 1 | Dividers, subtle borders |
| `stroke-thin` | 1.5 | Input borders, cards |
| `stroke-medium` | 2 | Active states, focus rings |
| `stroke-thick` | 3 | Accent borders, emphasis |
| `stroke-heavy` | 4 | Decorative borders, nav indicators |

---

## Shadows

8 steps from invisible to dramatic. Based on Tailwind's shadow scale.

| Token | Usage |
|-------|-------|
| `shadow-none` | No shadow |
| `shadow-2xs` | Barely visible, subtle depth hint |
| `shadow-xs` | Inputs, small elements |
| `shadow-sm` | Cards, buttons on hover |
| `shadow-md` | Dropdowns, hover cards |
| `shadow-lg` | Popovers, floating panels |
| `shadow-xl` | Modals, dialogs |
| `shadow-2xl` | Full-screen overlays, hero elements |

---

## Z-index

8 layers with gaps of 10 for custom intermediate values.

| Token | Value | Usage |
|-------|-------|-------|
| `z-index-0` | 0 | Base layer |
| `z-index-10` | 10 | Sticky headers, raised elements |
| `z-index-20` | 20 | Dropdowns, select menus |
| `z-index-30` | 30 | Fixed navbars, sidebars |
| `z-index-40` | 40 | Modal backdrops, overlays |
| `z-index-50` | 50 | Modals, dialogs |
| `z-index-60` | 60 | Toasts, notifications |
| `z-index-70` | 70 | Tooltips, popovers (topmost) |

---

## Duration & Easing

### Duration

9 steps covering micro-interactions through long animations.

| Token | Value | Usage |
|-------|-------|-------|
| `duration-0` | 0ms | Instant |
| `duration-75` | 75ms | Checkbox, toggle |
| `duration-100` | 100ms | Button press, focus ring |
| `duration-150` | 150ms | Hover states, tooltips |
| `duration-200` | 200ms | Default — most UI interactions |
| `duration-300` | 300ms | Dropdowns, panels |
| `duration-500` | 500ms | Modals, page elements |
| `duration-700` | 700ms | Entrance animations, stagger |
| `duration-1000` | 1000ms | Skeleton shimmer, loaders |

### Easing

5 curves based on Tailwind + Material Design conventions.

| Token | Value | Usage |
|-------|-------|-------|
| `easing-linear` | `linear` | Progress bars |
| `easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting view |
| `easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering view |
| `easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default — most transitions |
| `easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful interactions |

---

## Typography & Scaling

### Type Scale: Major Third (1.25)

Base: 16px. Each step multiplies by 1.25.

| Token | px | rem | Line-height | Usage |
|-------|-----|-----|-------------|-------|
| `font-size-xs` | 10 | 0.625 | 16px | Labels, uppercase micro text |
| `font-size-sm` | 13 | 0.8125 | 20px | Captions, secondary text |
| `font-size-base` | 16 | 1 | 24px | Body text (default) |
| `font-size-lg` | 20 | 1.25 | 28px | Body large, h5 |
| `font-size-xl` | 25 | 1.5625 | 34px | h4 |
| `font-size-2xl` | 31 | 1.9375 | 40px | h3 |
| `font-size-3xl` | 39 | 2.4375 | 48px | h2 |
| `font-size-4xl` | 49 | 3.0625 | 57px | h1 |
| `font-size-5xl` | 61 | 3.8125 | 68px | Display large |
| `font-size-6xl` | 76 | 4.75 | 82px | Display XL |

### Fluid Scaling System

Typography scales fluidly across viewports. No abrupt breakpoint jumps for font sizes.

**How it works:**
1. A root `--size-font` variable is calculated from the viewport width relative to the design's ideal container size
2. `body { font-size: var(--size-font); }` sets the root size
3. All `rem` values scale proportionally through the root

**Breakpoints (container-based):**

| Viewport | Ideal design width | Container range |
|----------|-------------------|-----------------|
| Desktop | 1440px | 992px - 1920px |
| Tablet | 834px | 768px - 991px |
| Mobile Landscape | 550px | 480px - 767px |
| Mobile Portrait | 390px | 320px - 479px |

**Container usage:**
```css
.container { max-width: var(--size-container); }
.container-md { max-width: calc(var(--size-container) * 0.85); }
.container-sm { max-width: calc(var(--size-container) * 0.7); }
```

**Files:**
- `packages/tokens/src/primitives/typography.json` -- raw scale values
- `packages/css/src/foundation/scaling.css` -- fluid scaling system
- `packages/css/src/foundation/typography.css` -- type classes (.h1, .body, .label, etc.)

**Rules:**
- Token font sizes are defined in px (primitives are raw values)
- CSS consumes tokens via custom properties and scales through rem
- No separate mobile/desktop typography files -- scaling system handles responsive
- Line-heights are paired 1:1 with font sizes (not independent scales)
- Display sizes (5xl, 6xl) use tighter line-height (~1.1) than body (~1.5)

### Breakpoints — CSS concern, not tokens

Breakpoints are defined ONLY in `css/foundation/scaling.css`. They are NOT design tokens.

**Why:**
- `@media` queries cannot consume CSS custom properties (CSS spec limitation)
- Responsive behavior is layout logic, not a design value
- Tailwind, shadcn, Material — none publish breakpoints as JSON tokens

**Reference values** (defined in scaling.css):

| Viewport | Range | Ideal design width |
|----------|-------|-------------------|
| Desktop (default) | 992px - 1920px | 1440px |
| Tablet | 768px - 991px | 834px |
| Mobile Landscape | 480px - 767px | 550px |
| Mobile Portrait | 320px - 479px | 390px |

Components that need `@media` queries use these values directly as hardcoded px in their CSS. The source of truth is `scaling.css`.

---

## Component Sizing Convention

**Sizing follows shadcn/Radix convention: explicit height + padding per size.**

Each size defines `height`, `padding`, and `font-size` explicitly. This guarantees buttons align with inputs at the same size and heights are pixel-perfect across browsers.

Gap, radius, and icon-size use `em` so they scale with font-size.

```css
/* Explicit per-size: height, padding, font-size */
.button--m {
  height: 2.5rem;        /* 40px — matches input--m */
  padding: 0 1rem;       /* horizontal padding */
  font-size: var(--button-font-size-m);  /* 16px from tokens */
}

/* em-relative: scales with font-size */
.button {
  gap: 0.5em;
  border-radius: 0.625em;
}
.button__icon { width: 1em; height: 1em; }
```

**Size scale (uniform font-size, height + padding differentiate):**

| Size | Height | H-Padding | Font-size | Usage |
|------|--------|-----------|-----------|-------|
| xs | 28px | 8px | 13px | Inline actions, table rows |
| s | 32px | 12px | 13px | Compact actions, toolbars |
| m | 40px | 16px | 13px | Standard buttons |
| l | 48px | 24px | 13px | Prominent actions |
| xl | 52px | 32px | 13px | Hero CTAs |

Font-size is the same across all sizes. Differentiation comes from height and horizontal padding. xl uses wider padding for visual prominence. xs minimum 28px for touch target safety.

### Naming convention

Component and variant names MUST match Figma exactly. Internal token names can differ.

**Sizes:** `xs`, `s`, `m`, `l`, `xl` (not sm/default/lg)
**Variants:** `primary`, `secondary`, `tertiary`, `destructive-primary`, `destructive-secondary`, `destructive-tertiary`

Figma has a typo "Terceary" — we correct it to `tertiary` in code but the variant structure stays the same.

**Rules:**
- `height` in `rem` (matches other components at same size)
- `padding` in `rem` (consistent spacing)
- `font-size` from tokens (Major Third scale)
- `gap`, `radius`, `icon-size` in `em` (proportional to font-size)
- `line-height: 1` on interactive components
- `-webkit-tap-highlight-color: transparent` on all interactive elements
- `scale` for press feedback (composited, no layout shift)
- `prefers-reduced-motion: reduce` disables transitions and scale

---

## Build Pipeline

```
tokens -> css -> components-react, components-astro
                 animations (independent)
```

Enforced by Turborepo. Never build components before tokens + css.

### Per-package builds

| Package | Tool | Input | Output |
|---------|------|-------|--------|
| tokens | Style Dictionary v4 | `src/**/*.json` | `build/{css,js,scss,json}/` |
| css | Vite + LightningCSS | `src/index.css` | `dist/atom.css` |
| animations | TypeScript | `src/**/*.ts` | `dist/**/*.js` + `.d.ts` |
| components-react | tsup | `src/**/*.tsx` | `dist/` (ESM + CJS) |
| components-astro | None | `src/**/*.astro` | direct import |

---

## CSS Rules

- **ZERO hardcoded values** in component CSS. Every color, spacing, radius, timing, font = CSS custom property from tokens.
- **No CSS-in-JS.** No Tailwind in component source. Pure CSS with custom properties.
- **No scoped styles in components.** All visual styling lives in `@atom-uikit/css`.
- Components render CSS class names. CSS package provides the styles.
- Class naming: `.{component}--{variant}`, `.{component}--{size}`, `.{component}--{state}`

---

## Animation Rules

- Each module exports `init*(): CleanupFn`
- Components expose `data-*` attributes as animation hooks (e.g., `data-hover-rotate`)
- Always check `prefers-reduced-motion` before animating
- Support `data-motion-exempt` to skip animation per-element
- GSAP is a peer dependency, not bundled

---

## Publishing

```bash
pnpm changeset          # create changeset
pnpm changeset version  # bump versions
pnpm build              # build all
pnpm release            # publish to npm
```

Scope: `@atom-uikit/`. Access: public. Managed by Changesets.

---

## Dev Workflow

1. `pnpm install` at root
2. `pnpm dev` runs Storybook + watch mode on packages
3. Make changes in packages/
4. Preview in Storybook (apps/storybook/)
5. `pnpm build` to verify
6. `pnpm changeset` to document changes
7. Commit, PR, merge, release

---

## Prohibited

- Hardcoded hex, px, rem, or timing values in CSS or components
- CSS-in-JS (styled-components, emotion, etc.)
- Tailwind classes in component source
- Importing tokens as JS in CSS files (use CSS custom properties)
- Circular token references
- Skipping the semantic layer (component tokens must NOT reference primitives directly)
- Publishing without a changeset
- Modifying build output manually
