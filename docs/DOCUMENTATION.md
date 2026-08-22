# Documentation map and gaps

Inventory of what this repo documents, who it is for, and where coverage is thin relative to the **current** production system. Prefer updating this file when a major doc is added, translated, or retired.

---

## North-star docs (English, human / portfolio)

| Document | Role | Status |
|----------|------|--------|
| [README.md](../README.md) | Public entry: problem, thesis, architecture sketch, channels, honest status | **Rewritten** (product-engineering narrative) |
| [docs/PRODUCT.md](PRODUCT.md) | Product principles, users, decisions summary, non-goals, risks | **New** |
| [docs/DOCUMENTATION.md](DOCUMENTATION.md) | This map | **New** |

These are the documents a hiring manager, peer eng lead, or future teammate should read first.

---

## Agent and operator docs (depth; largely Spanish)

| Document | Role | Language | Gap |
|----------|------|----------|-----|
| [CLAUDE.md](../CLAUDE.md) | Hard rules, token laws, packages, release, prohibitions | Mixed / ES-heavy | Needs English twin or progressive translation for external agents |
| [docs/AGENTS.md](AGENTS.md) | Role A consume vs Role B modify | Spanish | English version for MCP consumers outside the core team |
| [docs/component-agent-flow.md](component-agent-flow.md) | Step-by-step component work for agents | Spanish | Same |
| [docs/organism-pipeline.md](organism-pipeline.md) | How a section becomes distributable | Spanish | Critical product concept; English summary partially in PRODUCT/README |
| [docs/distribution-model.md](distribution-model.md) | Full channel graph and standards comparison | Spanish | Highest-value eng doc still not English |
| [docs/RUNBOOK.md](RUNBOOK.md) | Release, deploy, Webflow, access | Spanish | Ops risk if only one person can follow it fluently |
| [docs/webflow-playbook.md](webflow-playbook.md) | Webflow variable sync protocol | Spanish | Marketing-critical path |
| [CONTRIBUTING-REGISTRY.md](../CONTRIBUTING-REGISTRY.md) | Registry contribution rules | English-oriented | Keep aligned with `build:registry` reality |
| [conformance/README.md](../conformance/README.md) | Executable contracts explained | Spanish | English abstract exists in README gates section |

**Pattern:** the system is more mature than its English documentation. Agent throughput depends on Spanish operating manuals. Portfolio clarity depends on English product docs. Both are required; only one side was historically complete.

---

## Decisions (ADRs)

Location: [docs/decisions/](decisions/).

| Strength | Gap |
|----------|-----|
| Real decisions with dates and consequences (npm off, single DS, embed scope, Astro freeze, shadcn channel) | Mixed language; some ADRs are short stubs, some are full |
| Linked from CLAUDE and RUNBOOK | No single English index of ADRs inside PRODUCT beyond the summary table |

When adding an ADR: write **English** going forward unless the audience is strictly internal ops.

---

## What is under-documented relative to reality

### 1. End-to-end “happy path” for a stranger

We document pieces (MCP tools, `/v1` URLs, Webflow playbook). We do not yet have one short English guide:

> “You are marketing / you are an agent / you are an engineer — here is the minimum path to a correct page.”

**Suggestion:** `docs/GETTING-STARTED.md` (English), three short paths, linking to AGENTS roles.

### 2. Catalog completeness

CLAUDE still lists components missing CMS + MCP manifest entries. There is no living English dashboard of:

- published in registry,
- has layout,
- has CMS article,
- has visual baseline,
- used in production.

**Suggestion:** generate or maintain `docs/CATALOG-STATUS.md` (even a manually updated table beats tribal knowledge).

### 3. Changelog / timeline

Root [CHANGELOG.md](../CHANGELOG.md) stops reflecting the system that exists post–July 2026 decisions (single DS, conformance suite, organism pipeline, embed channel, etc.).

**Suggestion:** either revive root changelog from ADRs + package changelogs, or state in README that ADRs are the historical source of truth (already partially true).

### 4. Multi-repo mental model

README names sibling repos. There is no English one-pager on deploy order, which secret lives where, and what breaks if docs sync fails.

**Suggestion:** extract a one-page English section from RUNBOOK into `docs/ECOSYSTEM.md`.

### 5. Storybook / visual QA expectations

Interactive story patterns are specified deeply in CLAUDE. Easy to miss for a human reviewer.

**Suggestion:** short English `docs/STORYBOOK.md` pointing at the shared layout utilities and required controls pattern.

### 6. Security and auth surface

Triple auth on `/api/r`, MCP OAuth, deploy hooks, PATs — mentioned in ops docs, not in a security-oriented English summary for reviewers.

**Suggestion:** `docs/SECURITY.md` (scopes, what is public vs private, rotation notes without secret values).

---

## What does *not* need more prose

- Token layer rules — already enforced by validate + conformance.
- “Please don’t hardcode hex” — gates already fail the build.
- Duplicate architecture essays in every package README — link up to PRODUCT/README instead.

Prefer **contracts and gates** over repeating rules in five files. Prefer **one English product spine** over translating every line of CLAUDE on day one.

---

## Recommended documentation sequence

1. **Done in this pass:** README, PRODUCT.md, DOCUMENTATION.md (English spine).
2. **Next:** `GETTING-STARTED.md` (three audiences) + English summary of distribution-model (or full translation).
3. **Then:** `CATALOG-STATUS.md` and changelog reconciliation.
4. **Ongoing:** new ADRs and agent-flow updates in English; translate highest-traffic Spanish ops docs as capacity allows (`organism-pipeline`, `AGENTS`, `RUNBOOK` §release).

---

## Ownership

Product narrative and prioritization of gaps: DS owner.  
Agent-procedure accuracy: whoever changes the pipeline must update the matching flow doc in the same PR.  
Conformance messages and contracts: treat as documentation that executes — a gate that never fails is not documentation, it is comfort.
