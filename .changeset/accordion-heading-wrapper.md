---
"@atom-uikit/css": patch
---

El accordion abre tambien cuando la pregunta va dentro de un heading.

El panel se abria con un selector de hermanos desde el trigger. Pero el marcado
accesible mete el trigger dentro de un <h3>, y ahi deja de ser hermano del panel:
el behavior alternaba aria-expanded y no pasaba nada, sin error en consola. La
regla nueva parte del item, que es el ancestro comun, asi que da igual cuanto se
anide el trigger.
