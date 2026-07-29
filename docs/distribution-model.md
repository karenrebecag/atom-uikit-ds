# Modelo de distribución del DS — flujo completo y comparación con estándares

Estado: validado end-to-end 2026-07-29 (caso `pricing-card` + `layout/pricing-plans` +
`layout/navbar-simple` sobre `atom-pages`). Complementa `organism-pipeline.md` (el cómo
operativo); este documento es el porqué y el mapa.

## El flujo de datos, de bajo a alto nivel

```
NIVEL 0 · decisión de diseño
  packages/tokens/src/  primitives → semantic → components   (DTCG JSON, única fuente)
        │  Style Dictionary v4
        ▼
NIVEL 1 · valores resueltos
  build/css/*.css (custom properties) · build/json/tokens-nested.json
        │                     │                        │
        ▼                     ▼                        ▼
  packages/css          public/r/tokens-nested     Webflow Variables
  (componentes)         (MCP, fuente de verdad)    (plan compiler + MCP oficial)
        │
        ▼
NIVEL 2 · pintura — componentes CSS (button, tag, feature, icon, pricing-card…)
  · viajan COMPLETOS en /v1/embed.css (scopeado .atom-embed) y /v1/atom.css
  · viajan POR PIEZA como items del registry (framework: css → registry:component)
        │   referenciados por clase BEM, jamás redefinidos aguas arriba
        ▼
NIVEL 3 · plano — layouts (kind: layout → registry:block)
  packages/layouts/src/<slug>.ts  { html con {{slots}} + data-repeat, css de rejilla }
  publicado autodescriptivo: .ts + .html/.css planos + atom.layout {slots, repeats, components}
        │
        ▼
NIVEL 4 · contenido — consumidores
  · atom-pages: install-registry.mjs (deps transitivas + verificación contra embed.css)
    + renderLayout(html, {slots, repeats}) — datos puros, cero maquetación
  · no-code: copiar layouts/<slug>.html, editar textos, duplicar filas data-repeat
  · MCP/LLM: atom.layout le da el contrato sin parsear HTML
        │
        ▼
NIVEL 5 · hosts — Webflow / WordPress
  <script loader.js> + <div data-aa-mount> · el SDK WCI en attach engancha [data-atom-button]
```

Propiedades del grafo: **una sola dirección, sin ciclos**. Cada nivel consume solo el
inferior. Los tres canales (registry por copia, `/v1` vivo, Variables Webflow) son
proyecciones del mismo árbol — no hay verdades paralelas.

La división clave es **pintura vs plano**: un cambio de look (nivel 0-2) se propaga solo
a todo lo publicado vía `/v1/embed.css`, sin tocar consumidores; un cambio de anatomía
(nivel 3) es una reinstalación explícita del layout. Eso es deliberado: el look debe poder
evolucionar centralmente; la estructura de una página publicada no debe moverse sola.

## Comparación con los estándares del mundo

| Estándar | Qué distribuye | Cómo | Qué tomamos | Dónde divergimos y por qué |
|---|---|---|---|---|
| **shadcn/ui** | código fuente copiado (no dependencia) | registry JSON `files[].content`, `registryDependencies` en cascada, CLI `add`, `registry:ui`/`registry:block` | el modelo entero: schema (usamos su `$schema` literal), CLI, tiers. Nuestro `kind: layout` = su `registry:block` | shadcn congela también la pintura en el consumidor; nosotros solo la estructura — la pintura queda viva en `/v1` para re-skin central. shadcn transporta JSX; nosotros HTML con slots porque el consumidor primario es no-code |
| **Radix UI** | comportamiento (a11y, foco, teclado) por npm, unstyled | paquetes React | nada directamente: nuestro problema es el inverso (mucho look, poco comportamiento). El equivalente de comportamiento aquí es el SDK WCI y `packages/animations` | npm está desconectado como canal por decisión (2026-07-28) |
| **Tailwind Plus (ex UI)** | composiciones completas en HTML/React/Vue | copy-paste desde catálogo, sin registry | la validación de que **HTML plano es un formato de distribución serio** para bloques | ellos no tienen contrato de slots máquina-legible; `atom.layout` es nuestra extensión |
| **Flowbite / Preline** | bloques HTML sobre utilidades Tailwind | copy-paste | igual que Tailwind Plus | dependen de utilidades en el consumidor; nosotros de clases BEM + embed.css |
| **W3C DTCG** | formato de tokens (`$value`/`$type`) | spec | nuestros tokens son DTCG desde el origen | — |
| **Style Dictionary** | build multi-plataforma de tokens | transforms | pipeline entero de nivel 0→1, incluido el transform propio `size/fluid-u` | — |
| **Material / Fluent** | sistema completo por npm versionado | paquetes + theming por tokens | la disciplina de capas de tokens | modelo de dependencia npm: actualizar = bump de versión en cada consumidor. Descartado: sin autorización npm y con hosts no-code que no instalan paquetes |

Síntesis: **somos shadcn en la mecánica, Tailwind Plus en el formato de bloques, DTCG/SD
en los tokens — con una desviación propia**: la pintura no se copia, se enlaza viva. Esa
desviación existe porque nuestros consumidores finales (Webflow/WordPress embeds) no
tienen pipeline de build ni pueden "reinstalar" un cambio de marca sitio por sitio.

## Qué NO adoptamos, con razón registrada

- **Shadow DOM** (el estándar de widgets de terceros): rompe SEO del contenido y ciega a
  `querySelector` — el SDK de WCI engancha `[data-atom-button]` desde el documento.
  Scoping por clase (`.atom-embed`) + gate `validate:embed` en su lugar.
- **@scope CSS**: Baseline dic-2025; un navegador sin soporte dejaría el embed
  completamente sin estilos. El prefijado degrada mejor.
- **npm**: decisión de negocio (sin autorización de consumo público). `pnpm release`
  bloqueado; changesets solo para versionado interno.
- **Web Components**: mismo problema de Shadow DOM, más peso de runtime en hosts que no
  controlamos.

## Gates que mantienen el modelo honesto

| Gate | Protege |
|---|---|
| `pnpm conformance` (suite de contrato, `conformance/*.json`) | leyes de escala (tercera mayor, base-4), CSS de componentes sin literales/!important (ratchet), layouts structure-only con clases existentes y contrato de slots, espejo del registry, budgets de peso. Ver `conformance/README.md` |
| `validate:embed` | ningún selector sin `.atom-embed` en embed.css |
| `test:embed-leak` (8 checks) | ni fuga hacia el host ni del host hacia adentro |
| `validate:contrast` | WCAG AA en light y dark |
| limpieza de huérfanos en `build:registry` | `public/r/` = espejo de `registry.json` (pasó: 60 `comp-N` sirviéndose meses después de borrados) |
| verificación del installer (atom-pages) | cada componente del contrato del layout existe en embed.css |
| baselines visuales por plataforma | regresión de pintura pre-merge |
| prueba de aceptación (`organism-pipeline.md` §7) | replicabilidad: reconstruir sin mirar el repo de origen |

## Coste del modelo

- **Infraestructura**: ~cero marginal. Son JSON y CSS estáticos en Vercel; el registry se
  regenera en segundos; sin base de datos nueva, sin servicio nuevo.
- **Por componente nuevo (átomo/molécula)**: NADA cambia — mismo flujo de siempre
  (css + entrada en registry + story/baseline).
- **Por organismo nuevo**: UN archivo más (`packages/layouts/src/<slug>.ts`) + su story.
  Todo lo demás (html/css planos, contrato de slots, categoría, index) lo genera
  `build:registry` solo.
- **Deuda existente**: los 46 layouts del catálogo ya viajan por el canal nuevo
  automáticamente, pero muchos son pre-OSMO y definen anatomías propias en vez de
  consumir componentes (el patrón `pricing-tiers`). Se migran **bajo demanda** — cuando
  un layout se vaya a usar de verdad, se moderniza como se hizo con pricing — no en un
  big-bang.
- **El coste evitado es el argumento**: sin plano publicado, cada sección se re-maqueta a
  mano por sitio, y a la tercera copia hay tres diseños divergiendo en producción. Ese
  coste es recurrente y crece con cada página; el del modelo se paga una vez por organismo.
