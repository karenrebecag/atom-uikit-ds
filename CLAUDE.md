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
