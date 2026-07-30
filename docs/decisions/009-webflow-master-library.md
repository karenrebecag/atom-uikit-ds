# 009 — Webflow: site maestro + Shared Library como canal oficial

- **Status:** accepted
- **Date:** 2026-07-30
- **Context:** El diseño original de W4 (ADR 003) aplicaba el plan de variables por MCP
  **site por site**. Eso escala N sites × M cambios de token: cada cambio exige una sesión
  técnica autorizada por cada site consumidor, y cualquier site que se salte un apply
  queda en drift silencioso. Atom va a empezar a producir sites de marketing sobre
  Webflow ya, con diseñadores/marketing operando sin un dev disponible por sync. El
  Workspace de Atom tiene plan de pago, que habilita Shared Libraries (variables +
  componentes + assets compartidos entre sites, con change management por site).
- **Decision:** El canal Webflow oficial es un **site maestro** ("Atom UIKit | Library",
  staging, sin dominio) + **Shared Library** del Workspace (publicada como "Atom UIKit"):
  - El apply del plan de `sync-webflow.mjs` por MCP se hace **solo contra el maestro**.
  - El maestro publica variables (colección "Atom DS v1", modo `dark`) y componentes
    core como Library; los sites consumidores la instalan y aceptan updates desde la UI
    nativa de Webflow.
  - El sync por site queda **deprecado**: ningún site consumidor recibe applies
    directos por MCP.
- **Consequences:**
  - Un cambio de token = un solo apply (maestro) + publicar update de Library. Los
    sites lo aceptan cuando quieren — consumo pull con control de versión, mismo modelo
    que el registry shadcn del DS.
  - La Library distribuye **anatomía además de pintura**: componentes Webflow con props
    (button, section, nav) son el equivalente de `layout/<slug>` en el registry
    (regla 8 de CLAUDE.md). Sin ellos cada diseñador reconstruye el markup a mano.
  - Checklist por site nuevo sin conocimiento técnico: instalar Library + `<link>` a
    `/v1/foundation.css` + subir las 4 fuentes (per-site por diseño de Webflow; en
    publicado las cubre el `@font-face` de foundation.css).
  - En sites consumidores está **prohibido** editar valores de variables a mano: el
    siguiente update de Library los pisa. Nuevos valores entran por JSON PR → sync
    maestro → Library update.
  - Los demás canales (registry `/api/r` + MCP UIKit, `/v1/*`, Storybook/docs) no
    cambian: este ADR solo agrega un nodo intermedio en la rama Webflow.
  - `sync-webflow.mjs` no cambia; ADR 003 sigue vigente (no existe REST API para
    variables — el apply es vía Webflow MCP).
  - La creación del site maestro y la publicación de la Library son acciones de
    dashboard/Designer (no API): las hace Karen una vez.
  - **GATE DE PLAN (verificado 2026-07-30):** compartir una Library exige plan de
    Workspace Growth/Agency/Enterprise. El Workspace de Atom no lo tiene hoy: el botón
    "Share with Workspace" aparece deshabilitado en el panel Libraries del maestro
    (que ya contiene 2 componentes, 103 variables y 4 fuentes, listo para compartir).
    Mientras no haya upgrade, el canal de consumo es el **fallback del ADR 003**: sync
    del plan por MCP directo contra el site consumidor. El maestro sigue siendo la
    fuente de verdad y este ADR sigue vigente como destino; solo se difiere el
    mecanismo de reparto. Nota de coste/beneficio: la Library paga su valor con N≥2
    sites consumidores, y hoy el Workspace tiene UNO (Atom Website).
