# 006 — `embed.css`: el DS publica su propia variante scopeada

- **Status:** accepted
- **Date:** 2026-07-28
- **Context:** Atom distribuye páginas de marketing como embed codes de Webflow y shortcodes
  de WordPress. `foundation.css` y `atom.css` no sirven ahí: llevan una regla global
  `body { font-family; font-size; color; … }` que reestiliza la página anfitriona. Las
  alternativas de la industria para widgets de terceros (Shadow DOM, iframe) están
  descartadas: rompen la indexación SEO del contenido y `querySelector` no penetra el shadow
  root, lo que dejaría ciegos a los píxeles de tracking y al SDK de WCI que Atom ya usa.
- **Decision:** el DS publica `/v1/embed.css` — el mismo contenido de `atom.css` (tokens +
  foundation + layout + componentes) con cada selector scopeado bajo `.atom-embed`,
  generado desde el source con el visitor AST de LightningCSS, más un reset scopeado. El
  transform vive en el productor, como una entrada más del build (el patrón de
  `bootstrap-reboot.css`), no en cada consumidor.
- **Consequences:**
  - Un proyecto de embeds nuevo es un `<link>`; no reimplementa el post-proceso ni congela
    los tokens hasta su propio rebuild.
  - Incluye componentes a propósito: un embed es una isla autocontenida y no puede asumir
    que el host provee nada.
  - `.atom-embed` pinta su propio `background-color`/`color`: sin eso, `data-theme="dark"`
    dejaría texto claro sobre el fondo claro del host.
  - No se usa `@scope` pese a estar soportado en la toolchain — su Baseline es dic-2025 y en
    un navegador sin soporte el embed quedaría completamente sin estilos; el prefijado
    degrada mejor.
  - Prohibido post-procesar con regex el CSS compilado del DS para scopearlo; si hace falta
    otra variante, se agrega una entrada al build.
  - Gates propios (`validate:embed`, `test:embed-leak`): los baselines visuales solo cubren
    los artefactos light-DOM y no verían una regresión de scoping.
