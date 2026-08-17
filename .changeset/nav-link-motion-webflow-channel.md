---
"@atom-uikit/css": patch
---

nav-link: el subrayado animado viaja al canal de Webflow.

El DS define un nav link con subrayado que crece desde la izquierda y se retrae
hacia la derecha, pero ese motion no llegaba a Webflow: el canal
(`entries/webflow.css`) solo llevaba el text-swap del boton, el boton de
WhatsApp y el reset anti-FOUC. Sin el, ningun componente de Webflow podia
consumirlo — el MegaNav_DS acabo reimplementando el link con una clase de
etiqueta propia y se quedo sin animacion.

Cumple el criterio declarado del canal al pie de la letra: el panel de estilos
de Webflow no declara pseudo-elementos ni estados de ancestro (`:hover > hijo`),
y este subrayado necesita los dos.

Diferencia deliberada con `nav-link.css`: el indicador se ancla al propio
`__text` (`position: relative`) en vez de al link. Anclarlo al link subrayaria
tambien el caret de un mega-nav y obligaria al host a declarar `position` en el
padre; anclado al texto, el host no declara nada.
