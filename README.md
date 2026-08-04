# atom-uikit-ds

> Design system monorepo for ATOM's marketing web layer — tokens, components, registry, and the distribution pipeline that makes vibecoded pages come out on-brand.

**Live:** [uikit.atomchat.io](https://uikit.atomchat.io) · [Storybook](https://atom-uikit-ds-storybook.vercel.app) · [Registry API](https://uikit.atomchat.io/api/r)

---

## Why this exists

Atom is an AI-first company where everyone vibecodes — marketing, founders, product. That culture ships fast and breaks brand consistency.

This repo is the source of truth for the marketing design system: a reinterpretation of Atom's product DS, optimized for two readers at once — the developer and the LLM. The goal is that whoever writes the code (human or agent) produces correct output on the first try, without a platform engineer reviewing every page.

→ Full write-up: [The Design System an AI Can't Hallucinate](https://karenrebecaortiz.com/en/articulos/design-system-that-ships-itself)

---

## Ecosystem

This DS is one of four coordinated repos:

| Repository | Role |
|---|---|
| **`atom-uikit-ds`** ← you are here | Tokens (3 layers), packages, registry pipeline |
| [`atom-uikit-docs`](https://github.com/karenrebecag/atom-uikit-docs) | Next.js docs site, Registry API (`/api/r`), Clerk auth, CLI token exchange |
| `atom-uikit-cms` | Payload CMS — component articles, MCP-readable docs, restricted content |
| `atom-uikit-db` | Hosted MCP server, OAuth 2.1, Supabase edge functions |

Distribution channels:
- **CLI** — `npx @atomchat.io/mcp-uikit` for engineers inside the editor
- **MCP over HTTP** — `https://uikit-mcp.vercel.app/mcp` for AI clients (Claude, Cursor)
- **Registry API** — shadcn-style JSON, copy source to your project
- **Webflow sync** — `pnpm sync:webflow` exports token-driven XML

---

## Architecture

### Token layers (3-tier, primitives → semantic → component)

```
primitives/        271 colors, base-4 spacing (13 steps), Major Third type scale
semantic/          112 light + 112 dark — every surface has a -foreground pair
component/         Scoped tokens for states (hover, pressed, disabled) only
```

**The rule that holds the whole building up:** a component token never references a primitive directly. It always goes through the semantic layer. That's what makes dark mode work without touching component CSS.

Tokens follow the [W3C Design Tokens Community Group](https://designtokens.org) format (`{ "$value": "...", "$type": "..." }`), consumed by Style Dictionary v4.

### Packages

| Package | What it ships |
|---|---|
| `@atom-uikit/tokens` | Token JSON → CSS custom properties + JS exports |
| `@atom-uikit/css` | Foundation CSS, utility classes, LightningCSS build |
| `@atom-uikit/components-react` | React components, tsup build |
| `@atom-uikit/components-astro` | Astro components, same token base |
| `@atom-uikit/animations` | CSS-only animation primitives |
| `@atom-uikit/layouts` | Layout composition patterns |
| `@atom-uikit/cli` | Auth + install CLI for local dev |
| `@atom-uikit/whatsapp` | WhatsApp widget — IIFE, Cloudflare Worker + R2 |

### Registry pipeline

Components are not on npm. They follow the [shadcn/ui registry model](https://ui.shadcn.com/docs/registry) — source is copied to consumer projects, not installed as a black box.

```
registry.json                  ← Internal AtomRegistryItem schema
scripts/extract-component-metadata.ts  ← Pulls variants, props, cssClasses from source
scripts/build-registry.mjs     ← Writes public/r/*.json (shadcn-compatible)
public/r/index.json            ← Discovery catalog for MCP warm start
public/r/{name}.json           ← Per-component files with full atom field
```

`pnpm build:registry` rebuilds the full catalog. `/public/r/` is not committed — it's derived at build time by the docs site to guarantee the registry and the source never diverge.

### Anti-hallucination split (MCP)

The MCP server enforces a deliberate separation between two tool classes:

| Class | Tools | What they return |
|---|---|---|
| Discovery | `atom_uikit_context`, `atom_uikit_component`, `atom_uikit_search`, `atom_uikit_list`, `atom_uikit_get`, `atom_uikit_install` | Metadata only — variants, props, install commands. No CSS. |
| Implementation | `atom_uikit_source`, `atom_uikit_validate` | Real CSS/React source. Requires auth. |

Discovery tools emit `implementationAccess: requires_atom_uikit_source` — the agent knows not to invent implementation, and the system won't let it anyway.

---

## Getting started

### Prerequisites

```bash
node >= 20
pnpm >= 10
```

### Install

```bash
pnpm install
```

### Dev

```bash
pnpm dev          # all packages in watch mode
pnpm --filter @atom-uikit/storybook dev  # Storybook only
```

### Build

```bash
pnpm build                # all packages
pnpm build:registry       # rebuild component registry
pnpm sync:webflow         # export token XML to Webflow
```

### Validate

```bash
pnpm validate             # token validator (must pass with 0 errors)
pnpm validate:contrast    # WCAG contrast checks
pnpm conformance          # architecture conformance rules
pnpm test                 # component unit tests
```

---

## Contributing

See [CONTRIBUTING-REGISTRY.md](./CONTRIBUTING-REGISTRY.md) for the component registry spec and [CLAUDE.md](./CLAUDE.md) for the full architectural rules — including token workflow, naming conventions, and distribution contracts.

> npm publishing is disabled. All distribution goes through private channels (registry API, MCP, Webflow sync). See `CLAUDE.md → Canales de distribución`.

---

## Design decisions

- **~350 tokens instead of ~500** — fewer options means fewer errors for humans and models alike
- **shadcn distribution, not npm** — source is always visible and modifiable; no black boxes
- **Multi-framework from one token base** — React, Astro, CSS, IIFE from the same primitives
- **Build-time sync, not committed JSONs** — anything derivable from source should be derived, not stored
- **Fail-closed MCP** — the correct outcome is the only available path, not a request for good behavior

---

*Part of the ATOM UIKit ecosystem · Built by [Karen Ortiz](https://karenrebecaortiz.com)*
