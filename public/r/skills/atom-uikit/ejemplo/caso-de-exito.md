# Ejemplo: caso de éxito

Brief: caso de éxito de Mi Dinerito, financiera mexicana de créditos vía nómina; audiencia: equipos de
marketing y ventas de financieras. Fuente de copy: el caso `mi-dinerito` del CMS (`atom_casos_get`).

## Regiones, en orden

| # | Región | Bloque | Por qué este y no el vecino |
|---|---|---|---|
| 1 | promesa | `layout/hero-split` | el caso trae imagen de cabecera |
| 2 | prueba | `layout/metrics-grid` | los resultados son el argumento: van antes de explicar cómo |
| 3 | beneficios | `layout/feature-grid` | tres piezas implementadas, paralelas y cortas |
| 4 | cierre | `layout/cta-banner` | una frase y un único botón |

Sin tabla de contenido ni cabecera de página: el caso es corto y no los necesita. La cita de la
trafficker de Mi Dinerito no tiene bloque en la ola 1 (el bloque de testimonio aún no tiene ejemplar):
hallazgo de catálogo, la región se recorta y la cita queda fuera de la página en vez de inventar markup.

## Decisiones de la skill (lo global)

- **h1**: asignado al hero; el titular es el del caso, tal cual.
- **Superficies**: las cuatro secciones en `default`. Cero oscuras.
- **Ritmo**: `section--hero` en el hero, `section` en el cuerpo, `section--compact` en el cierre.
- **Motion**: el de cada bloque, sin añadir ni suprimir. Animan 2 de 4 regiones.
- **Orden**: la prueba va antes que la solución porque el lector llega por el resultado; es el único cambio sobre el orden habitual y lo pedía el brief.
- **CTA**: el botón de WhatsApp inline en hero y cierre.

## Copy de referencia sustituida

- Hero: titular y apoyo del caso (intro resumida a una frase). El botón habla del lector, no de Atom.
- Cifras: 3x utilidad neta, 82% de leads calificados, 2x ventas con el mismo equipo y 40% de aumento en conversaciones. Son los resultados del caso publicado, no del catálogo de landings; se citan tal como el caso las publica.
- Beneficios: las tres piezas de la solución del caso (respuestas automáticas, calificación de prospectos, métricas de campañas), con su frase de apoyo original.
- Cierre: pregunta al lector con el mismo tono del caso.

## Resultado del checklist

`atom_uikit_finalize` no se corrió al escribir este ejemplo. Comprobado en el navegador: un `h1`, cero
elementos de formulario, cero marcadores sin resolver, dos enlaces a wa.me, ninguna sección oscura.

Líneas incumplidas y declaradas:

- El número de WhatsApp es `00000000000`: el brief no trae uno confirmado.
- La imagen del hero es un recuadro con texto; falta generarla con `atom_uikit_image`.
- Falta la cita del cliente por falta de bloque (hallazgo de catálogo, arriba).

## Captura

`docs/evidence/ejemplo-caso-de-exito-1440.png`: la página a 1440 px.
