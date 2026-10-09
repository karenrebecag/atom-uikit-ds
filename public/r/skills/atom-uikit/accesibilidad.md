# Accesibilidad

## Estructura

- Un solo `h1` por página, asignado por la página (ver [composicion](composicion.md)). El resto de titulares bajan de nivel sin saltarse ninguno: `h2` para secciones, `h3` dentro.
- Landmarks reales: la navegación en `nav`, el contenido en `main`, el pie en `footer`. Un bloque no los crea por ti.
- La pregunta de un accordion va dentro de un heading y el heading envuelve al botón; así entra al índice de encabezados.

## Controles

- Todo control tiene nombre accesible. Un botón de solo icono lleva `aria-label`.
- El foco se ve en teclado. No lo quites: el DS ya trae un anillo de `:focus-visible`.
- Un enlace dice a dónde va. Nunca un `href="#"` ni un control que no hace nada.
- Los iconos decorativos llevan `aria-hidden="true"`.
- Las imágenes llevan `alt` real. Una imagen decorativa lleva `alt=""` a propósito, no por olvido.

## Contraste

Los tokens semánticos del DS garantizan 4.5:1 en sus pares fondo/texto en light y dark. Eso cubre lo que
sale de los tokens; no cubre lo que escribes tú. Si pones texto sobre una imagen, o un color a mano,
el contraste es tuyo.

## Motion

`prefers-reduced-motion` lo respetan los behaviors del DS; no lo desactives. Nada parpadea más de tres veces por segundo.

## Revisión rápida

Navega la página solo con teclado de arriba abajo: debe poder alcanzarse y operarse todo, en orden lógico, con foco visible.
