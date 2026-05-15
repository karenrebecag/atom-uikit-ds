# @atom-uikit/tokens

Design tokens for the ATOM UIKit design system -- W3C DTCG format, built with Style Dictionary v4.

## Install

```bash
pnpm add @atom-uikit/tokens
```

## Token Architecture (3 layers)

```
Primitives  (raw values: colors, spacing, typography, radius, etc.)
    |
Semantic    (intent-based aliases: primary, muted, destructive, etc.)
    |
Component   (scoped to UI: button-bg-primary-enabled, etc.)
```

**Primitives** -- flat raw values with no semantic meaning. One file per category: colors, spacing, typography, radius, opacity, motion, elevation.

**Semantic** -- intent-based aliases referencing primitives. Follows the shadcn/ui surface-pair convention where every background token has a `-foreground` companion (e.g., `primary` / `primary-foreground`).

**Component** -- scoped to a specific UI component with variant and state qualifiers. Always references semantic tokens.

## Usage

### CSS custom properties (recommended)

```css
/* All tokens */
@import '@atom-uikit/tokens/css';

/* Or import individual layers */
@import '@atom-uikit/tokens/css/primitives';
@import '@atom-uikit/tokens/css/semantic';
@import '@atom-uikit/tokens/css/components';

/* Dark mode overrides */
@import '@atom-uikit/tokens/css/dark';
```

```css
.card {
  background: var(--card);
  color: var(--card-foreground);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}
```

### JavaScript / TypeScript

```ts
import tokens from '@atom-uikit/tokens';
```

### SCSS

```scss
@use '@atom-uikit/tokens/scss' as *;
```

### Raw JSON

```ts
import tokens from '@atom-uikit/tokens/json';
```

## Exports

| Specifier | Path | Format |
|-----------|------|--------|
| `@atom-uikit/tokens` | `build/js/tokens.js` | ESM / CJS / TypeScript |
| `@atom-uikit/tokens/css` | `build/css/tokens.css` | CSS custom properties |
| `@atom-uikit/tokens/css/primitives` | `build/css/primitives.css` | Primitives only |
| `@atom-uikit/tokens/css/semantic` | `build/css/semantic.css` | Semantic only |
| `@atom-uikit/tokens/css/components` | `build/css/components.css` | Component only |
| `@atom-uikit/tokens/css/dark` | `build/css/dark.css` | Dark mode overrides |
| `@atom-uikit/tokens/scss` | `build/scss/_tokens.scss` | SCSS variables |
| `@atom-uikit/tokens/json` | `build/json/tokens.json` | Raw JSON |

## Token Categories

- **Colors** -- primitive palette + semantic surface pairs (12 pairs including brand, success, warning, info)
- **Spacing** -- base-4 geometric scale (0--96px, 13 steps)
- **Typography** -- Major Third (1.25) type scale with fluid viewport scaling
- **Radius** -- 7 steps from `none` (0) to `full` (9999px)
- **Opacity** -- 8 perceptually distinct steps (0.05--0.90)
- **Stroke** -- 6 border-width steps from `none` to `heavy`
- **Shadows** -- 8 elevation levels from `none` to `2xl`
- **Z-index** -- 8 layers with gaps of 10
- **Duration** -- 9 timing steps (0--1000ms)
- **Easing** -- 5 curves (linear, in, out, in-out, spring)

## Dark Mode

Dark mode tokens use the same names with inverted values, applied via:

```css
[data-theme="dark"] { /* dark overrides */ }
```

Import `@atom-uikit/tokens/css/dark` to include the dark theme.

## License

MIT
