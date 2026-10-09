# Marca

Todo lo que sigue es regla de marca aprobada. Lo que no esté aquí ni en el DS no existe: ante la duda,
pregunta en lugar de improvisar.

## Color y superficies

- El blanco es la base de la página (representa humanidad). Los fondos oscuros solo en secciones de IA o automatización, de 0 a 2 por página.
- El naranja de marca es solo acento: nunca fondo grande ni botón.
- Nunca negro puro en textos. Usa los tokens semánticos (`--foreground`, `--muted-foreground`), no valores a mano.
- Contraste mínimo 4.5:1 en light y dark. Sobre fondo oscuro, texto e iconos claros.
- Dark mode es `data-theme="dark"` en el elemento raíz; no dupliques paletas.

## Gradiente

El gradiente de marca es el elemento más expresivo y por eso se usa poco: solo en titulares de hero con
`.text-gradient` (máximo dos highlights; "Atom" siempre en naranja) y en los fondos de sección del DS.
Jamás en botones, iconos ni chips.

## Botones

Los botones salen del componente `button` (`.button--primary` oscuro, `.button--secondary` outline).
El CTA de contacto es el boton de WhatsApp, ver [conversion](conversion.md). Nunca inventes clases de botón (como un btn-brand).

## Logo

El logo es siempre el oficial de Atom, en todo lo que generes, aunque la página sea de un cliente. Su única
fuente es el recurso `atom://brand-assets`: no lo dibujes, no lo escribas como texto ni pegues otra URL.
Nunca uno generado con IA, nunca un wordmark de texto inventado, nunca un badge "powered by".
Mantén el logo sobre la base blanca; dentro de una sección oscura se omite. <!-- regla: logo-oficial -->

## Imágenes

Todo slot de imagen (hero, thumbnail, ilustración, avatar) se llena con la herramienta de imagen del
MCP, que busca primero una foto real. Nunca construyas mockups, teléfonos ni ilustraciones con divs y CSS.

## Tipografía

Se aplica por clases de rol (`.h1`, `.body-lg`), no con tamaños a mano. Las familias son las del DS:
no cargues otra.

## Tokens

Siempre `var(--spacing-4)`, `var(--duration-200)`, `var(--easing-in-out)`. Nunca un color, spacing, radius o
timing escrito a mano.
