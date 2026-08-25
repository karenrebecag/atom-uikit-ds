---
"@atom-uikit/css": patch
---

El accordion declara su tipografia por token en vez de heredarla.

Usaba font-family: inherit, que depende de que el host haya tipografiado el
body. Hay hosts que no lo hacen, y entonces la FAQ sale en la fuente del sistema
dentro de un sitio tipografiado, sin que nada falle. El resto de componentes ya
la declaraban. Ademas la respuesta subio de --font-size-sm (12.8px, tamano de
pie de foto) a --font-size-base, y los line-height literales pasan a token.
