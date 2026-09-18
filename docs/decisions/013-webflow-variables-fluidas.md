# 013 — Webflow Variables: dimensiones fluidas sobre `--u`

- **Status:** accepted
- **Date:** 2026-09-18
- **Context:** `sync-webflow.mjs` emitía las dimensiones en px fijos. En atomchat.io
  eso partía la página en dos escalas: las clases atadas a variables de Webflow
  (títulos, ritmo de sección) se quedaban fijas, y los componentes `ds-*` del canal
  `/v1` escalaban con `--u`. Medido el 2026-09-18: a 1024 px el texto del DS bajaba a
  11.4 px con el H1 en 61 px; a 1920 px el texto subía a 21 px con el H1 en 61 px. La
  constitución de escala (CLAUDE.md) dice que tipografía y ritmo son fluidos sobre `--u`.
- **Decision:** el plan emite font-size, section-padding, gap, spacing y radius como
  `calc(N * var(--u, 1px))` (`custom_value` en `data_variable_tool`). Stroke queda en
  px porque el DS tampoco lo escala.
- **Consequences:**
  - El fallback `1px` existe solo para el canvas del Designer, que no carga el custom
    code del sitio: ahí se ve el valor exacto a 1440. Es la misma excepción de canvas
    que ya usan las variantes de `Stat Card` (`var(--token, literal)`).
  - Un sitio consumidor tiene que definir `--u`. Con `foundation.css` viene incluido;
    un sitio con CSS propio copia la curva de `scaling.css` (atomchat.io lo hace en
    `AtomWebflow_2026Site/src/css/base/tokens.css`).
  - El apply cambia el tamaño de todo lo que use estas variables fuera de 1440 px.
    Aplicar primero el plan y después liberar el `--u` del sitio, en el mismo publish.
