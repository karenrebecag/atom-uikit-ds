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

Intent-based aliases that reference primitives.

```json
{
  "bg": {
    "$type": "color",
    "primary": { "$value": "{color.neutral-0}" },
    "inverse-primary": { "$value": "{color.zinc-950}" }
  }
}
```

**Rules:**
- Every value is a reference to a primitive (never a literal)
- Named by intent: `bg-*`, `fg-*`, `border-*`, `brand-*`
- Dark mode overrides go in `themes/dark/` (same structure, overridden values only)

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
