# @atom-uikit/layout-converter

Módulo del DS (dev tool, **fuera** del workspace de pnpm y de la distribución). Genera
layouts **nativas del Atom UIKit** a partir de secciones TSX (estilo Relume): evalúa el TSX a
un IR neutro y, en vez de transliterar el estilo de origen, **compone el DS** — componentes +
roles tipográficos + un shell con CSS de solo posicionamiento, validado contra el contrato del
DS.

Duplicado y adaptado del converter TSX→Webflow (`webflow-converter`, repo público; **no se
toca**). Aquí el pipeline es el mismo (eval → IR → resolve Tailwind → cascade), pero el emisor
y la validación consumen los artefactos **reales** de este repo:

- `conformance/layout-contract.json` — el gate (structureOnly, classesExist, slots, deps).
- `public-dist/out/v1/tokens.css` — tokens reales (escala 16·1.25ⁿ, fluida sobre `--u`).
- `packages/layouts/src/*.ts` — catálogo de layouts a rellenar antes de crear una nueva.
- `docs/organism-pipeline.md` — proceso canónico para publicar una layout.

## Por qué existe (resumen de la auditoría 2026-10-14)

El emisor original era un **transliterador**: conservaba la estructura de Relume pero reescribía
su estilo en tokens de Atom (72 decls visuales en 6 layouts; una layout del DS lleva 0). Aplanaba
~49 primitivas sin aviso, descartaba todos los atributos salvo `class`, y duplicaba layouts que
ya existían en el catálogo. Veredicto: **rediseño del emisor, conservando el pipeline.**

## Estado (plan F0–F4)

- **F0 (hecho):** honestidad. `<slug>.report.json` (blocked / droppedAttrs / visualDecls / notes),
  fallo duro (exit 1) ante una primitiva sin mapa, manifiesto de slots completo (`*_href`), escala
  tipográfica real del DS.
- **F1 (hecho):** el contrato del DS como gate (allowlist de posicionamiento; roles `.h*` efectivos).
- **F2+F3 (hecho):** modelo Relume. `SectionModel` recupera la semántica del IR (tipo, titular,
  cuerpo, acciones, media, unidades repetidas: faq/metrics/features/logos); `catalog` liga el tipo
  al layout NATIVO del DS que lo realiza y rellena sus slots con nombre. El converter ya NO escribe
  HTML/CSS: el del layout del DS es la fuente. Camino primario = `emitFill`; sin layout en el
  catálogo (unknown) cae al emisor plano con el gate del contrato.
- **F4 (pendiente):** limpieza (extraer `assign` compartido, una sola tabla `ROLE`).

### Cómo funciona (como Relume)

```
TSX (sección Relume) → IR → SectionModel (qué ES la sección)
  → match en el catálogo del DS (packages/layouts/src) → rellenar sus {{slots}}
  → layout nativo del DS con el contenido (HTML/CSS del DS, sin tocar)
```

Verificado en crudo sobre 5 secciones reales: hero→`hero-split`, cta→`cta-split-image`,
faq→`faq-accordion`, logos→`logo-marquee`, metrics→`metrics-grid` (features→`feature-grid`).
Los slots sin contenido del origen quedan vacíos y se reportan (`emptySlots`); el excedente de
items sobre la capacidad del layout se reporta (`overflow`); nada se aplana en silencio.

## Uso

```bash
# deps (solo la primera vez; instalar deps es decisión de Karen):
#   cd tools/layout-converter && bun install
bun --no-install test                                   # suite del módulo
bun --no-install run scripts/to-atom.ts <sec.tsx> <slug> --out <dir>
```

El runner escribe `<slug>.{html,css,report.json}` y **falla** si el reporte trae bloqueos: una
primitiva sin mapa fiel al DS no produce un layout nativo.

## No confundir con el demo

La verificación se hace sobre la **salida cruda** del emisor, nunca sobre una página de demo que
añada reset, rellene slots en orden o inyecte `href` a mano (eso tapó los fallos una vez).
