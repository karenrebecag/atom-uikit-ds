# 007 — Un solo DS: `ATOM_DS` (atom-ds) deprecado y archivado

- **Status:** accepted
- **Date:** 2026-07-29
- **Context:** Coexistían dos monorepos de design system: `atom-ds` (repo GitHub
  `karenrebecag/ATOM_DS`, scope `@atomchat.io/*`, lenguaje pre-ATOM con Inter como única
  tipografía, tokens Figma-sourced en 4 capas, wrappers React/Vue/Astro/Angular) y este
  repo. Dos fuentes de tokens y componentes paralelos son dos verdades de marca; el coste
  no escala. `atom-ds` llevaba sin commits desde 2026-04-26, sus escalas violan las leyes
  de conformance de este repo (Major Third 1.25, base-4) y las specs de unificación ATOM
  (2026-07-28) nunca lo contemplaron. Verificado contra registry.npmjs.org: ninguno de sus
  8 paquetes `@atomchat.io/*` fue publicado jamás — no existen consumidores externos
  posibles. Todo el ecosistema (uikit-atom-mcp, atom-uikit-docs, atom-uikit-db) consume
  exclusivamente el registry de este repo.
- **Decision:** este repo es el único design system de Atom, con varios canales de
  distribución (registry autenticado `/api/r`, CSS+JSON público `/v1`, Webflow Variables).
  `ATOM_DS` queda archivado en GitHub (read-only, banner de deprecación en su README) como
  referencia histórica. No hubo merge ni pipeline de sync: mergear importaría el lenguaje
  visual obsoleto y un sync mantendría dos verdades.
- **Consequences:**
  - Un cambio de marca = un PR en un solo sitio (aquí).
  - Si aparece un consumidor Vue/Angular real, el wrapper se crea como package de este
    monorepo consumiendo `@atom-uikit/tokens`; nunca se revive `atom-ds` (su skin pre-ATOM
    obligaría a reescribirlo de todas formas).
  - El asset `@atomchat.io/mcp-docs` vía jsDelivr nunca existió (404): los links en
    `apps/storybook/src/stories/ProgressNav.stories.tsx` y en `uikit-atom-mcp/src/server.ts`
    deben migrar a assets self-hosted (p. ej. `/v1/`).
