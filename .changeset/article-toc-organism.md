---
"@atom-uikit/css": minor
"@atom-uikit/animations": minor
---

Organismo de documentación: `layout/article-toc` para documentos largos con índice lateral (legales, documentación, artículos de fondo). Se publica en tres piezas, como manda el pipeline de organismos.

`prose` (nuevo componente CSS) estiliza contenido largo POR ELEMENTO: el resto del DS tipografía por clase (`.h2`, `.body`), lo cual exige una clase por nodo e imposibilita servir un rich text de Webflow o un campo de CMS. Cubre h2-h6, párrafos, links, listas anidadas, cita, código, tabla de lectura y notas, con `--prose-measure` y `--prose-anchor-offset` como API. Sus headings van en sans, no en display: aquí son estructura densa (un legal puede traer 36) y aplica el mismo criterio que el DS ya usa para h3-h6.

`toc` (nuevo componente CSS) pinta el rail del índice: estado activo con acento de marca en 1.5px de borde, indentación por `[data-toc-depth]` y variante `--collapsible` para móvil sin JS.

`toc-animation` (nuevo behavior, `initTableOfContents`) genera los links clonando UN template por cada heading del contenido, inyecta ids slugificados (con acentos normalizados), marca la sección visible por ScrollTrigger y devuelve un cleanup que deja el DOM como estaba. Funcional, no decorativo: sin guarda de reduced-motion, la preferencia solo afecta al scroll del click. Soporta `data-toc-ignore`, el marcador `{skip}`, `data-toc-levels`, `data-toc-offset` y el Lenis del host si existe.

Nuevo par en el gate de contraste: `muted/foreground` (18.16:1 light, 16.67:1 dark), porque `prose code` pone el código a contraste pleno sobre la superficie muted en vez de usar `muted-foreground`, que dentro de un párrafo se lee apagado.
