# Product engineering — Atom UIKit DS

English product narrative for this monorepo. Operational detail remains in `CLAUDE.md`, `docs/AGENTS.md`, `docs/distribution-model.md`, and the runbook; this document answers **why the system exists**, **what success looks like**, and **what is deliberately unfinished**.

---

## Problem

Atom ships marketing UI in a culture where everyone vibecodes — humans and agents. Speed is a feature. Consistency is not automatic.

Without a single enforceable source of truth:

- every landing invents spacing and color,
- every agent invents markup that “looks similar,”
- Webflow, React, and embeds diverge within weeks,
- platform engineering becomes a permanent review bottleneck.

The product of this repository is not “a Storybook.” It is **brand integrity under generative speed**.

---

## Users

| User | Job to be done |
|------|----------------|
| **Marketing / Webflow** | Build and restyle pages without waiting on a hand-coded component each time. |
| **Engineers** | Reuse the same tokens and blocks in code consumers without forking brand. |
| **Agents (MCP)** | Discover components, pull real source, validate — without inventing CSS. |
| **DS owner (Karen)** | Change brand once; supervise agent-produced work; refuse channels that create second truths. |

Success for an agent is the same as success for a human: **correct on the first mergeable attempt**, measured by conformance, contrast, registry integrity, and organism acceptance — not by “it looked fine in the chat.”

---

## Product principles

1. **One truth, many projections**  
   Tokens are authored once. CSS, registry JSON, MCP payloads, and Webflow variables are projections. If a value is edited downstream, the system has already failed.

2. **Fail closed for agents**  
   Discovery without implementation access is intentional. The model should hit a wall when it lacks source, not improvise a button.

3. **Paint is live; structure is installed**  
   `/v1` carries look. Layouts carry anatomy. That split is how central rebrands stay possible without rewriting every published page’s DOM by surprise.

4. **Distributed means reproducible**  
   An organism is not “done in the author’s project.” It is done when a stranger (or a clean consumer repo) can install the layout, fill data, and match the original. See organism pipeline acceptance test.

5. **Fewer choices beat more tokens**  
   ~350 tokens, strict layers, scale laws (Major Third type/rhythm, base-4 spacing). Constraint is a product feature for both humans and models.

6. **No theater channels**  
   npm disconnected without public authorization. Astro frozen without a consumer. Motion features gated on an approved wave. Deprecated WhatsApp package left as reference, not maintained as a second product.

---

## System shape (product view)

```
Decision (brand, scale laws)
  → Tokens (DTCG)
  → Paint (CSS components + /v1)
  → Structure (layouts in registry)
  → Behavior (React + animations where needed)
  → Channels (MCP, registry/CLI, Webflow, embeds)
```

**Anti-hallucination contract (MCP)**

| Tool class | Returns | Requirement |
|------------|---------|-------------|
| Discovery | Names, variants, props, install hints | Enough to choose |
| Implementation | Real CSS / TSX source | Auth; no guessing |

**Organism contract**

| Piece | Ships |
|-------|--------|
| CSS component | Paint only |
| `layout/<slug>` | HTML anatomy + grid; slots/repeats; `registryDependencies` |

If the anatomy only lives in the first consumer repo, the third copy will already be a different design. That cost is why layouts exist.

---

## Key decisions (summary)

| ID | Decision | Product reason |
|----|----------|----------------|
| 002 | npm disconnected | Consumers are registry/MCP/Webflow/embeds; public npm was not authorized and would imply a support surface that does not match reality. |
| 003 | Webflow via official MCP / plan, not DIY REST | Variables have no REST Data API; inventing one is fiction. |
| 004 | Brand/destructive foregrounds stay dark | WCAG over aesthetic “white on orange.” |
| 005 | Motion deferred / gated | Unscoped GSAP becomes a second untokenized DS. |
| 006 | Scoped embed CSS | Global foundation styles poison host pages. |
| 007 | Single DS; legacy ATOM_DS archived | Two monorepos cannot be one brand. |
| 008 | Astro frozen | No consumer → no parallel maintenance. |
| 011 | Derived shadcn-compat channel | Interop without a second authoring source. |

Details: `docs/decisions/`.

---

## What “good” looks like in production

- A marketer or agent can compose a pricing section, FAQ, or hero from published layouts and get Atom/academy language without hand-tuning hex values.
- A token change can ship through `/v1` and update paint across embeds without reinstalling every block.
- A structural change requires reinstalling the layout — visible, intentional.
- `pnpm conformance` fails when someone introduces a new literal color, breaks scale laws, or publishes a layout that references missing classes.
- MCP cannot “almost” know a component: without `source`, it does not have implementation.

Evidence already baked into the system: embed leak tests, contrast gates, registry orphan cleanup, referential integrity checks, organism rebuild acceptance (e.g. pricing-plans).

---

## Status and gaps

### Working

- Token architecture and validators.
- Multi-channel distribution with explicit non-goals (npm, Shadow DOM, uncontrolled Web Components).
- Agent procedures mature enough for supervised implementation.
- Production coupling to Atom marketing workflows (including Webflow playbook).

### Open product risks

1. **Coverage gap** — Source catalog > fully documented + MCP-indexed + organism-published surface. Prefer publishing fewer complete organisms over many incomplete components.
2. **Legacy layouts** — Older layouts may still carry local anatomy; modernize on use, not as a rewrite project.
3. **Ops bus factor** — Throughput depends on one person who holds the map across four repos. Runbook helps; staffing and narrative still lag the technical system.
4. **Docs language** — Deep ops/agent docs are largely Spanish; English is being layered for portfolio and external clarity. Until translated, external collaborators hit a wall after the README.
5. **Changelog** — Root changelog is behind decisions and package history; treat ADRs + package changelogs as the accurate timeline until reconciled.

---

## Non-goals

- Becoming a general-purpose multi-framework kit (Vue/Angular/…) without a named consumer.
- Public npm as the primary channel.
- Letting agents edit generated artifacts or relax conformance baselines silently.
- Pixel-perfect Figma parity as the driver of tokens (web scales and WCAG win conflicts).
- Replacing Webflow with a fully code-only marketing stack in one leap.

---

## How this is built (process)

Work is **spec- and contract-driven**:

- Visual change → tokens (or explicit new token) → Storybook → conformance + contrast + tests.
- New component → `docs/component-agent-flow.md`.
- New section/organism → `docs/organism-pipeline.md` + acceptance rebuild.
- Release/ops → `docs/RUNBOOK.md`.
- Agents are implementers under those contracts; product judgment (what enters, what freezes, what deprecates) stays human.

That split is intentional: automation without a decision owner recreates vibecode at infrastructure scale.

---

## Related reading

- [`README.md`](../README.md) — entry point
- [`docs/DOCUMENTATION.md`](DOCUMENTATION.md) — documentation inventory and gaps
- [`docs/distribution-model.md`](distribution-model.md) — channel mechanics
- [`conformance/README.md`](../conformance/README.md) — why gates are data
