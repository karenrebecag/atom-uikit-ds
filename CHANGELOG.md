# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-05-14

### Added

- Import design tokens from Figma (Tokens Studio export, 2026-05-14)
- Primitives layer: 245 colors (22 palettes), 27 spacing, 16 radius, 9 opacity, 3 stroke, 36 typography (mobile + desktop), 4 breakpoints, core dimensions
- Semantic layer: 112 light mode + 112 dark mode color tokens (bg, fg, border, brand, accent, status)
- Theme component tokens: button, card, box shadow, typography composites
- Token validator reports 11 known issues in semantic layer (partner colors, shadow/typography composites) — to be resolved incrementally

### Changed

- Typography: replaced asymmetric Figma scale with Major Third (1.25) from base 16px — 10 steps, paired line-heights
- Spacing: replaced linear +4 scale (27 tokens) with base-4 geometric scale (13 tokens)
- Radius: replaced linear +4 scale (16 tokens) with 7 purposeful steps (none through full)
- Stroke: replaced 2 tokens (with typo) with 6 semantic steps (hairline through heavy)
- Opacity: replaced %-named tokens (9) with numeric scale (8), added 5% step, removed duplicate from core.json
- Semantic colors: restructured following shadcn/ui pairing convention (bg + foreground pairs)
- Removed CRM-specific tokens (inbox, tipificacion, notifications) from semantic layer
- Removed interactive states from semantic layer (belong in component layer)
- Removed Figma $extensions metadata from all semantic tokens
- Removed duplicate color palette from core.json (source of truth is colors.json)
- Removed theme-components.json and themes/ (will be rebuilt in component layer)
- Validator now passes with 0 errors across all layers
- Removed separate mobile/desktop typography files — fluid scaling system handles responsive
- core.json: resolved self-references to literal values, removed redundant typography definitions

### Added

- Fluid scaling system in CSS foundation (viewport-proportional root font-size)
- Typography CSS classes: .display-xl, .display-lg, .h1-.h5, .body, .body-lg, .body-sm, .caption, .label, .code

## [0.0.0] - 2026-05-14

### Added

- Monorepo scaffold with Turborepo + pnpm workspaces
- Package structure: tokens, css, animations, components-react, components-astro
- 3-layer token architecture: primitives -> semantic -> component
- Style Dictionary v4 build config for tokens
- Vite + LightningCSS build for CSS package
- tsup build for React components
- Storybook 8 placeholder for local dev
- Changesets for automated versioning and publishing
- CLAUDE.md with full architectural rules and token workflow
