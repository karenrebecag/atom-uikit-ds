# F12-C1 — Inventario de derivabilidad

Fecha: 2026-08-02  
Fuente de la matriz de secciones: `atom-uikit-cms/CLAUDE.md` (estándar de 11 secciones).  
Export de los 74 docs de Payload: **bloqueado** — no hay `SUPABASE_*` en el env local del MCP/docs (solo `ATOM_REGISTRY_KEY`). Requiere sesión con acceso a `uikit-admin.atomchat.io` o edge `get-docs`.

## Clasificación por sección (aplica a todo doc component-shaped)

| # | Sección | Derivable | Notas |
|---|---------|-----------|--------|
| 1 | Instalación | **sí** | peerDeps + cssImports (`meta.derived.install`) |
| 2 | Uso básico | **sí** (parcial) | props + default story; usage conductual sigue en `meta.agent` |
| 3 | Props | **sí** | `atom.discovery.props` (ya en registry) |
| 4 | Variantes | **sí** | discovery + tokens/CSS |
| 5 | Tamaños (px) | **sí** | `meta.derived.tokens.sizes` cuando existen component tokens |
| 6 | Ejemplos | **no** | editorial — markdown en git (F12c) |
| 7 | Anatomía CSS (BEM) | **sí** | `meta.derived.anatomy` desde CSS |
| 8 | Tokens resueltos (hex) | **sí** | `meta.derived.tokens.resolved` vía `tokens.json` |
| 9 | CSS mínimo funcional | **sí** | `meta.derived.standaloneCss` (var→literal best-effort) |
| 10 | Animaciones | **sí** | `meta.derived.motion` |
| 11 | Accesibilidad | **no** | editorial |

**Resumen:** 9/11 derivables, 2/11 editoriales (ejemplos + a11y). Coincide con `F12/spec.md`.

## Conteos (sesión sin Payload API)

| Métrica | Valor |
|---------|-------|
| Docs Payload publicados (spec) | 74 (no re-exportados esta sesión) |
| Componentes registry | 120 |
| Con `meta.derived` + `sourceCommit` | **120** (F12a build) |
| Con tokens de componente en DS (`packages/tokens/src/components`) | 4: button, checkbox, link-button, nav-link |
| `meta.derived` sin `no-component-tokens` | 5 (button, checkbox, link-button, nav-link, button-hover) |
| Scripts CMS locales `scripts/content/*.json` | 23 (marca/guías — **no** component-shaped) |

## Editorial rescatable (pendiente export Payload)

Cuando exista el export de los 74 docs, marcar por slug:

- Secciones 6 y 11 (y cualquier prosa “cuándo no usar”) → `packages/*/docs/{slug}.md`
- Secciones 1–5, 7–10 → **no copiar**; el emisor las regenera

Hasta el export: F12c no arranca (gate de agentes.md).

## Baseline hex (C2) — CMS CLAUDE vs emisor

| Componente | Prop | Hex en CLAUDE.md CMS | Hex emitido (tokens.json) | Veredicto |
|------------|------|----------------------|---------------------------|-----------|
| Button | primary bg | `#18181b` (zinc-900) | `#0a0a0a` (neutral-950 / primary) | **DRIFT** — el DS es fuente de verdad; el CMS documenta un primitivo viejo |
| Button | primary fg | `#fafafa` (zinc-50) | `#fafafa` | match |
| Button | size m height | (documentado ~40px) | `40px` | match |
| Input | — | (en Payload id 71) | sin component tokens ricos | parcial |
| Select | — | (en Payload id 74) | sin component tokens | parcial |

**Hallazgo C2:** el emisor no se silencia ante la discrepancia. Payload/CMS CLAUDE aún enseña zinc-900; el DS resuelve `--primary` → `#0a0a0a`.
