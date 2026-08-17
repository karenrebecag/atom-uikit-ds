# Storybook QA — ATOM reskin (W5)

**Date:** 2026-07-28  
**Branch:** `feat/code-consumers-reskin`  
**How:** Storybook now imports `packages/tokens/build/css/{tokens,dark}.css` + `packages/css/src` (no local token snapshot).

## Expected visual language

| Token | Light value |
|---|---|
| background | `#fafafa` |
| foreground / primary | `#0a0a0a` |
| brand | `#ff6600` (text on brand: dark for AA) |
| success | `#25d366` |
| destructive | `#f84131` |
| sans | Inter Tight |
| display | Grift |

## Checklist (human pass)

| Component | Light OK | Dark OK | Notes |
|---|---|---|---|
| Button | | | primary = near-black fill, not zinc |
| IconButton | | | |
| LinkButton | | | uses info/sky, not blue-500 |
| ButtonGroup | | | |
| Input | | | borders neutral-200/300 |
| Textarea | | | |
| Select | | | |
| Checkbox | | | checked = primary |
| Tabs | | | |
| Toggle | | | |
| Tag / Badge | | | success/danger via forest/coral |
| Tooltip | | | neutral-900 surface |

## Known non-blockers

- Fonts in Storybook canvas: system fallback until foundation fonts loaded in app chrome (or open via foundation.css).
- Brand/destructive use dark text for WCAG AA (not white).
- Gradients: forest→brand (violet ramp removed).

## How to run

```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/storybook dev
# http://localhost:6006
```
