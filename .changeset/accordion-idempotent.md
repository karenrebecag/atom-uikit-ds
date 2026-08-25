---
"@atom-uikit/animations": patch
---

initAccordion aguanta que lo llamen de mas.

Llamarlo dos veces dejaba DOS listeners delegados sobre la misma raiz: el
primero abria y el segundo volvia a cerrar, asi que el accordion parecia muerto
sin ningun error en consola. Pasa con facilidad — el host puede inicializar a
nivel sitio y a nivel pagina sin darse cuenta, y es exactamente lo que ocurrio
en atomchat.io. La raiz se marca al engancharla y el cleanup suelta la marca.
