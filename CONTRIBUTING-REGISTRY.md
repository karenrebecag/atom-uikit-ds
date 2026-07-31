# Registry Contribution Guide

How to add, update, and maintain components in the ATOM UIKit registry.

## Overview

Components are distributed via a private shadcn-style registry, not npm. The pipeline:

```
registry.json (internal) -> build:registry -> public/r/*.json (canónico Atom)
                                |
                    extract-component-metadata.ts
                    + emit-shadcn-registry.mjs
                                |
                    public/r/shadcn/{registry.json, <item>.json}
```

After `build:registry`, the deploy hook triggers the docs site rebuild, which syncs the JSONs (including `shadcn/`) and serves them via API. The MCP server fetches from that API.

## shadcn CLI channel (F5)

Derived channel for `npx shadcn add` (official schema). **Not** a second authoring
source — never edit `public/r/shadcn/*` by hand.

### components.json (consumer)

Point a private registry at the served path (same Bearer as the Atom registry):

```json
{
  "registries": {
    "@atom": {
      "url": "https://uikit.atomchat.io/api/r/shadcn/{name}.json",
      "headers": {
        "Authorization": "Bearer ${ATOM_REGISTRY_KEY}"
      }
    }
  }
}
```

Local filesystem (dev only):

```json
"url": "file:///absolute/path/to/atom-uikit-ds/public/r/shadcn/{name}.json"
```

```bash
npx shadcn add @atom/button
```

CSS lands under `styles/atom-uikit/*.css` with `target` set for **global** import
(BEM — do not convert to CSS Modules). Import those sheets from `app/globals.css`.

## Adding a new component

### 1. Create the component source

```
packages/css/src/components/{category}/{slug}.css
packages/components-react/src/{atoms|molecules}/{Name}.tsx
```

### 2. Add the entry to `registry.json`

```json
{
  "name": "my-component",
  "kind": "component",
  "framework": "react",
  "installGroup": "components",
  "title": "MyComponent",
  "description": "Short description for docs and MCP search",
  "registryDependencies": ["tokens", "foundation"],
  "files": [
    {
      "sourcePath": "packages/components-react/src/atoms/MyComponent.tsx",
      "outputPath": "components/atoms/MyComponent.tsx",
      "type": "registry:component"
    },
    {
      "sourcePath": "packages/css/src/components/{category}/my-component.css",
      "outputPath": "styles/components/my-component.css",
      "type": "registry:file"
    }
  ]
}
```

### 3. Build and verify

```bash
pnpm build:registry
cat public/r/my-component.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('atom:', 'atom' in d)"
```

### 4. Run tests

```bash
npx tsx scripts/test-extract-metadata.ts
```

## Required vs optional fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Component slug (kebab-case, e.g. `button-group`) |
| `kind` | Yes | `component`, `foundation`, or `hook` |
| `framework` | Yes | `react`, `css`, or `astro` |
| `installGroup` | Yes | `components`, `foundations`, or `hooks` |
| `title` | Yes | Display name (PascalCase, e.g. `ButtonGroup`) |
| `description` | Yes | Short description for docs search |
| `files` | Yes | Source file mappings (sourcePath, outputPath, type) |
| `registryDependencies` | No | Other registry items that must be installed first |
| `dependencies` | No | npm packages to install (e.g. `gsap`) |
| `cssClassPrefixes` | No | BEM root blocks when slug alone is insufficient |
| `composable` | No | Sub-component export names (manual list) |
| `variantProp` | No | Override when variant prop is not named `variant` |

## Manual metadata fields

These fields are NOT auto-extracted. Add them to `registry.json` when needed.

### `cssClassPrefixes`

When a component's CSS defines BEM root blocks that don't start with the slug:

```json
{ "name": "input", "cssClassPrefixes": ["input", "input-group"] }
```

Currently used by: `input`, `table`, `item`, `toast`, `sidebar`.

### `composable`

Sub-components that a composable component exports. Keep in sync with actual React exports:

```json
{ "name": "select", "composable": ["Select", "SelectTrigger", "SelectContent", "SelectItem", "SelectGroup", "SelectSeparator"] }
```

Currently used by: `button-group`, `select`, `toggle-group`, `slider`, `typography`.

### `variantProp`

When the component uses a prop other than `variant` for its style variants:

```json
{ "name": "chip", "variantProp": "type" }
```

Currently only used by: `chip` (uses `type` instead of `variant`).

## Auto-extracted metadata (atom field)

`extract-component-metadata.ts` automatically detects from source files:

| Field | Source | Location |
|-------|--------|----------|
| `variants` | React: `type XxxVariant = 'a' \| 'b'` | `atom.discovery` |
| `sizes` | React: `type XxxSize = 'xs' \| 's'` | `atom.discovery` |
| `props` | React: Props interface/type | `atom.discovery` |
| `defaultVariant` | React: `{ variant = 'primary' }` | `atom.discovery` |
| `defaultSize` | React: `{ size = 'm' }` | `atom.discovery` |
| `hasAnimation` | Animation slug map or import detection | `atom.discovery` |
| `ariaRequired` | React: required `aria-*` props (no `?`) | `atom.discovery` |
| `childrenType` | React: `children: string` vs ReactNode | `atom.discovery` |
| `baseClass` | CSS: primary BEM root block | `atom.implementation` |
| `cssClasses` | CSS: all BEM classes scoped to component | `atom.implementation` |
| `peerDeps` | Dependency detection (e.g. gsap) | `atom.implementation` |
| `category` | Inferred from CSS directory or override map | `atom.discovery` |

## Pipeline: DS -> Docs Site -> MCP

```
1. Edit component in packages/
2. pnpm build:registry
   -> Generates public/r/*.json with embedded source + atom metadata
   -> Triggers deploy hook (DOCS_DEPLOY_HOOK env var)
3. Docs site rebuilds
   -> sync-registry.ts copies fresh JSONs
   -> API serves at /api/r/[name].json
4. MCP fetches automatically (5min cache TTL)
```

No manual copy needed. No MCP code changes for existing components.

## Pre-merge checklist

- [ ] Component source exists in `packages/css/` and/or `packages/components-react/`
- [ ] Entry added to `registry.json` with all required fields
- [ ] `pnpm build:registry` succeeds with 0 errors
- [ ] `npx tsx scripts/test-extract-metadata.ts` passes
- [ ] `cat public/r/{slug}.json` shows `atom.discovery` with correct variants/sizes/props
- [ ] If composable: `composable` field lists all sub-component exports
- [ ] If non-standard variant prop: `variantProp` field set
- [ ] If multi-block CSS: `cssClassPrefixes` field set
- [ ] Description is clear and searchable (used by MCP `atom_uikit_search`)
