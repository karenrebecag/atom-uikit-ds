# ADR 011 — shadcn-compat registry channel (`public/r/shadcn/`)

**Status:** Accepted  
**Date:** 2026-07-31  
**Feature:** F5

## Context

We already emit a shadcn-*shaped* per-item JSON under `public/r/`, but the catalog
is Atom-native (`index.json` with `kind`/`discovery`) and CSS files lack `target`,
so the official `npx shadcn add` CLI cannot install cleanly. F5 adds a **derived**
channel that matches official `registry.json` / `registry-item.json` schemas.

## Decision

1. **Output** — `public/r/shadcn/registry.json` + `public/r/shadcn/{name}.json`.
   Pure derivation from the canónico already written in the same `build:registry`
   run. No second authoring source.

2. **CSS BEM global (risk #1)** — Every CSS file is emitted as
   `type: "registry:file"` with
   `target: "styles/atom-uikit/<basename>.css"`.
   Never `registry:component` for CSS. `docs` on each item states: import CSS in a
   **global** stylesheet; do not convert to CSS Modules.

3. **React** — `type: "registry:component"`, path kept as published
   (`components/atoms/Button.tsx`, …). Content is byte-identical to the canónico.

4. **npm deps** — `dependencies[]` = union of registry `dependencies` and
   `atom.implementation.peerDeps` (e.g. `gsap`).

5. **registryDependencies** — Only names that are **also emitted** on the shadcn
   channel. Canónico deps on foundations not emitted here are dropped from the array
   and mentioned in `docs` (install tokens/foundation via MCP or full Atom setup).

6. **meta.agent** — Copied intact from canónico (`meta` bag). shadcn ignores it;
   agents that know F3 use it.

7. **Mappable kinds (wave 1)**  
   - **Include:** `kind: component` with at least one `.tsx`/`.jsx` file.  
   - **Exclude (logged with reason):** foundations, layouts, hooks, components
     without React source.

8. **Validation** — Lightweight required-field check aligned with the official
   schema fixture (no new AJV dependency). Build fails if any emitted item fails.

## Non-goals

- Public listing in shadcn’s registry index.
- Emitting layouts/hooks in this wave (can extend without changing the canónico).
