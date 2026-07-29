---
"@atom-uikit/css": patch
---

embed.css: los selectores que empiezan con atributo emiten ambas formas (.atom-embed[attr] y .atom-embed [attr]). El scoping compound-only rompía estados de componente como [data-menu-button=close] — el burger nunca morfeaba en embeds porque la regla exigía el atributo en la raíz.
