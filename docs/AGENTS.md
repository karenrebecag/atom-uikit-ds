# Guía para agentes — Atom UIKit DS

Cómo usar este design system siendo un agente (Claude/LLM). Dos roles posibles; decide
cuál eres antes de tocar nada.

---

## Rol A — Consumes el DS (construyes UI en OTRO proyecto)

Nunca copies valores a mano ni inventes componentes. Consume por canal:

| Contexto | Canal | Cómo |
|---|---|---|
| Proyecto con MCP "UIKIT atom" conectado | MCP (canal preferido) | `atom_uikit_context` para bootstrap → `atom_uikit_search`/`component` para descubrir → `atom_uikit_source` para el código real → `atom_uikit_validate`/`audit` antes de entregar. El MCP es anti-alucinación: si no llamaste `source`, no conoces la implementación |
| Proyecto vanilla / Mount Point / HTML | CSS público | `<link rel="stylesheet" href="https://atom-web-ds.vercel.app/v1/foundation.css">` (tokens+tipografía+utilities) o `/v1/atom.css` (todo, con componentes BEM). Versionado: `/v1/` nunca rompe |
| Necesitas valores programáticos | JSON público | `fetch('https://atom-web-ds.vercel.app/v1/tokens.json')` (flat) o `/v1/tokens-nested.json` (jerárquico, resuelto) |
| Webflow | Variables nativas | Ya sincronizadas por el protocolo de `docs/webflow-playbook.md`. Estiliza SOLO con variables de la collection "Atom DS v1"; cero hex en el panel |

Reglas de consumo:

1. **npm NO existe como canal.** No hagas `npm install @atom-uikit/*` — los paquetes son
   privados y las versiones viejas en npm están abandonadas (ADR 002).
2. Usa variables **semánticas** (`--background`, `--primary`, `--brand`, `--link`), no
   primitives (`--color-neutral-500`) ni hex. Si un semantic no cubre tu caso, es un
   cambio al DS (rol B), no un hex inline.
3. Dark mode = `data-theme="dark"` en el elemento raíz. No dupliques paletas.
4. El lenguaje es OSMO/academy: neutral 13 pasos, acentos contados
   (green-electric/coral/sky/forest), brand `#ff6600` solo acento, Inter Tight/Grift.
   Botones brand y destructive llevan texto oscuro POR DISEÑO (WCAG, ADR 004) — no lo
   "corrijas" a blanco.

---

## Rol B — Modificas el DS (trabajas en ESTE repo)

Lee en este orden: `CLAUDE.md` (reglas duras y flujo), `docs/RUNBOOK.md` (operación),
`docs/decisions/` (por qué las cosas son como son). Resumen mínimo:

1. **Única puerta de entrada**: `packages/tokens/src/*.json` (DTCG) para valores;
   `packages/css/src/**` para estilos de componentes (que consumen SOLO semantics).
   Los directorios `build/`, `dist/`, `public/r/`, `public-dist/out/` son generados.
2. **Loop de trabajo**: editar → `pnpm --filter @atom-uikit/tokens build` → Storybook
   (`pnpm --filter @atom-uikit/storybook dev`, puerto 6006) → gates → PR.
3. **Gates que te van a atrapar** (córrelos antes de proponer nada):
   `pnpm validate && pnpm validate:contrast && pnpm build && pnpm build:registry && pnpm validate:published && pnpm test`
   - Texto nuevo sobre superficie → agrega el par a `scripts/check-contrast.mjs` (AA 4.5:1
     en light Y dark) o CI te rechaza.
   - Cambio visual intencional → regenera baselines (`pnpm test:visual:update`) y commitea
     los PNG en el mismo PR; sin eso, la regresión visual falla a propósito.
4. **Prohibiciones absolutas**: renombrar tokens semánticos (= major = `/v2`); hex/px/ms
   hardcodeados en CSS de componentes; publicar a npm (`pnpm release` está bloqueado);
   clientes REST para Webflow Variables (no existen — MCP only, ADR 003); animaciones
   GSAP nuevas sin spec W6 aprobado; fuentes nuevas sin licencia verificada.
5. **Release**: sigue `docs/RUNBOOK.md` §1 paso a paso — changeset manual, PR con merge
   commit, el deploy de `/v1` es automático al mergear; el re-skin de docs/MCP es un paso
   deliberado aparte (hook, con check F4 antes).
6. Si el RUNBOOK no cubre tu caso, eso es un hallazgo para reportar — no improvises un
   flujo paralelo.

---

## Anti-patrones vistos en producción (no los repitas)

- Cachear tareas de copia que alimentan canales públicos (turbo sirvió artefactos stale
  a `/v1`) — `public-dist#build` es `cache: false` por esto.
- Smoke tests sin cache-buster tras un deploy (validan el deploy ANTERIOR).
- Stories con assets remotos (snapshots no deterministas — el test-runner ahora bloquea
  requests externos).
- Tokens de Vercel creados en la cuenta equivocada (hay dos; ver RUNBOOK §0).
- `{info}` (sky claro) como color de TEXTO sobre fondo claro: 1.73:1. Para links existe
  `{link}`.
