---
"@atom-uikit/tokens": minor
"@atom-uikit/css": minor
---

Sistema de dimensiones fluidas: spacing, font-size y radius se emiten como calc(N * var(--u)), donde --u = size-font/16 es el "pixel de diseño" fluido declarado en scaling.css. Todo escala con el viewport como ATOM, sin la trampa del em (la unidad es absoluta, inmune al font-size local) e inmune al font-size del host en embeds. Stroke y radius-full quedan fijos a propósito. El canal JSON conserva px crudos (Webflow/MCP sin cambios).
