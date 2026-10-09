# Ejemplo: landing de pauta

Brief: landing de pauta en español "Leads 24/7" para marketing y ventas de PyMEs en LATAM; conversión
solo por WhatsApp. Fuente de copy: la landing `leads-24-7` del CMS (`atom_lp_get`).

## Regiones, en orden

| # | Región | Bloque | Por qué este y no el vecino |
|---|---|---|---|
| 1 | promesa | `layout/hero-split` | hay una imagen que respalda la promesa; sin ella iría `layout/hero-centered` |
| 2 | beneficios | `layout/feature-grid` | tres beneficios paralelos y cortos, sin imagen por beneficio |
| 3 | prueba | `layout/metrics-grid` | cuatro cifras de resultado; con menos de cuatro iría una banda de cifras |
| 4 | objeciones | `layout/faq-accordion` | cinco preguntas cortas en una columna; con más de seis irían dos columnas |
| 5 | cierre | `layout/cta-banner` | una frase y un único botón |

El brief pedía CTA y cierre por separado. La ola 1 no tiene un bloque de cierre distinto del banner, y
dos bandas seguidas repetirían el mismo botón: el banner cubre las dos regiones.

## Decisiones de la skill (lo global)

- **h1**: asignado al hero de la región 1, que es el único bloque elegible de la página. Los demás titulares son `h2`.
- **Superficies**: las cinco secciones en `default`. Cero oscuras; el tema no es IA y el presupuesto permite 0.
- **Ritmo**: `section--hero` solo en el hero, `section` en el cuerpo y `section--compact` en el cierre.
- **Motion**: el de cada bloque, sin añadir ni suprimir. Animan 3 de 5 regiones (hero, beneficios y el accordion, que abre y cierra).
- **CTA**: el botón de WhatsApp en variante inline, una vez en el hero y una en el cierre; un primario por sección.

## Copy de referencia sustituida

- Hero: titular, apoyo y etiqueta del botón vienen del CMS, no del titular de referencia del bloque (era genérico de WhatsApp).
- Beneficios: los tres títulos salen de la sección de solución de la landing; se acortaron a una línea y dos líneas de apoyo.
- Cifras: +89% (agendamientos, automotriz), +86% (contactabilidad, educación), +40% (recuperación de leads, financiero) y +2.2x (lead calificado, automotriz). Las cuatro existen en el catálogo autorizado de cifras de landings con esa redacción; la etiqueta de industria va en la frase de apoyo porque las cifras son de industrias distintas.
- Objeciones: precio, requisitos, CRM, puesta en marcha y equipo, con las respuestas de referencia del bloque ajustadas a lo que Atom ya publica (precio cotizado, integración con CRM). El bloque trae cinco preguntas fijas; el brief pedía de tres a cuatro y se conservan las cinco.
- Cierre: titular y frase del cierre de la landing. Sin cuerpo de referencia.
- Se quitó el eyebrow en todos los bloques: la jerarquía sale del tamaño.

## Resultado del checklist

La mitad contable la corre `atom_uikit_finalize`, que vive en el conector y no se corrió al escribir este
ejemplo. Equivalentes comprobados en el navegador sobre la página armada: un `h1`, cero elementos de
formulario, cero marcadores sin resolver, tres enlaces a wa.me (hero, accordion, cierre), ninguna sección oscura.

Líneas incumplidas y declaradas:

- El número de WhatsApp es `00000000000`: el brief no trae un número confirmado. Con el real, el check de número queda cumplido.
- La imagen del hero es un recuadro con texto: falta generarla con `atom_uikit_image`. Sin ella el check de imágenes obligatorias falla.

## Captura

`docs/evidence/ejemplo-landing-pauta-1440.png`: la página a 1440 px. A 390 px no hay desborde propio (los 2 px de
scroll horizontal vienen del anillo de foco del botón de WhatsApp, medido en la prueba de los bloques).
