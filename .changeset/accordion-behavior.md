---
"@atom-uikit/animations": minor
"@atom-uikit/components-react": patch
"@atom-uikit/css": patch
---

initAccordion: el accordion plano ya abre en HTML estatico.

El componente publicaba pintura pero nadie movia el estado fuera de React, asi
que en Webflow el CSS existia y no abria nada. El estado va en aria-expanded, no
en una clase: un accordion lo necesita igual por accesibilidad, y una clase
paralela seria una segunda fuente de verdad. El heading pasa a envolver al
disparador para que la pregunta entre en el indice de encabezados.
