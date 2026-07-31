# ADR 010 — `meta.agent` on registry items

**Status:** Accepted  
**Date:** 2026-07-31  
**Feature:** F3 (distribution specs)

## Context

Agents need safe tuning ranges, integration gotchas, and a minimal usage snippet
per component. annnimate ships this as `attributes.json`; we keep a single DS
registry as source of truth and reshape it in the MCP.

## Decision

1. **Shape** — Optional `meta.agent` on each registry item (shadcn free-form `meta`).
   Subfields: `configurables[]`, `gotchas[]`, `usage` string. See F3 spec contract;
   this ADR does not widen that shape.

2. **Source** — Authored on the item in `registry.json` (`meta.agent`). Optional
   field on `AtomRegistryItem`. No separate per-file manifests for the pilot wave.

3. **Emit** — `build-registry.mjs` copies `item.meta` onto the published
   `public/r/{name}.json` unchanged (passthrough). Index stays discovery-only;
   agent meta lives only on per-item JSON (payload size).

4. **Validate** — After metadata extraction, `validate-agent-meta.mjs` runs per
   item that declares `meta.agent`. Build exits non-zero on:
   - configurable `prop` not in extracted discovery props
   - `number` missing min/max/step/unit
   - `select`/`multiselect` missing non-empty `options` or default ∉ options
   - missing `what`/`how`, invalid gotcha `context`, empty `usage`
   Error messages always include slug and prop (when prop-scoped).

5. **MCP** — Adapter reshapes only; never invents `meta.agent` when absent.
   `getComponentInfo` merges configurables onto props; `getImplementationData`
   exposes `gotchas` + `usage` for later F2.

## Pilot content (wave 1)

- `button` (animated, high use)
- `badge` (simple, high use)

Further components fill by later waves; missing `meta.agent` is valid.
