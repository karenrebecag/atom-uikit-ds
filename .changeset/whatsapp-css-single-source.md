---
"@atom-uikit/css": patch
---

whatsapp-button.css es ahora un archivo GENERADO desde su fuente única de verdad
(atom-whatsapp-buttons.vercel.app/v1/styles.css, repo AtomGrowth/atom_whatsapp_buttons) vía
`sync:whatsapp`. Incluye los fixes desplegados: blindaje contra site kits de Elementor
(especificidad sobre `.elementor-kit-N a:hover`), icono a la izquierda en botones sin animación
con padding reflejado, y el modificador `.atom-wa-btn--left` para flotantes anclados a la
izquierda.
