# Ejemplo: página de producto

Brief: página de producto "IA transaccional y Cortex" para equipos comerciales que venden por WhatsApp.
Fuente: el documento `ia-transaccional-y-cortex` de product marketing (`atom_productmarketing_get`).

Límite del material: la herramienta devolvió solo el título y la descripción del documento, no su cuerpo.
La copy de capacidades de esta página se limita a lo que esa descripción afirma; antes de publicar hay que
contrastarla con el cuerpo real.

## Regiones, en orden

| # | Región | Bloque | Por qué este y no el vecino |
|---|---|---|---|
| 1 | promesa | `layout/hero-centered` | el titular carga todo el peso y no hay imagen |
| 2 | beneficios | `layout/feature-grid` | tres capacidades paralelas y cortas |
| 3 | profundidad | `layout/feature-alternating` | dos capacidades explicadas a fondo, con imagen |
| 4 | prueba | `layout/metrics-grid` | cuatro cifras de resultado |
| 5 | planes | `layout/pricing-plans` | los dos planes de Atom, sin precio publicado |
| 6 | objeciones | `layout/faq-accordion` | cinco preguntas cortas en una columna |
| 7 | cierre | `layout/cta-banner` | una frase y un único botón |

## Decisiones de la skill (lo global)

- **h1**: asignado al hero centrado, titular propio del documento. Es el único elegible de la página.
- **Superficies**: las siete secciones en `default`. La tarjeta destacada de los planes es oscura por el componente, no por la sección; el presupuesto de la página sigue en 0 secciones oscuras.
- **Ritmo**: `section--hero` solo en el hero; `section` en el cuerpo; `section--compact` en el cierre.
- **Motion**: el de cada bloque, sin añadir ni suprimir. Animan 4 de 7 regiones (hero, beneficios, titular de planes y accordion).
- **CTA**: el botón de WhatsApp inline en hero, cada plan, accordion y cierre, un primario por sección. Los de los planes antes eran botones genéricos a wa.me; ahora son el mismo botón de WhatsApp que el resto.

## Copy de referencia sustituida

- Hero: titular y apoyo del documento. La franja de prueba social dice a quién va dirigida la página, no cuántos clientes tiene; las tres etiquetas salen del título del documento.
- Capacidades: tres frases que solo reformulan la descripción del documento (conversación de punta a punta, cerebro comercial, medición).
- Cifras: +82%, +40%, -30% y +5x, de financieras, tal como existen en el catálogo autorizado. Se eligió una sola industria para que la sección cuente una historia.
- Planes: los planes y beneficios de referencia ya son los de Atom, sin cifras de precio ("a tu medida"); solo cambió el titular.
- Profundidad: dos secciones con las mismas dos ideas del documento (conversación de punta a punta y Cortex); las imágenes son recuadros de referencia, por generar.
- Objeciones: las cinco preguntas del bloque con sus respuestas de referencia, que ya hablan de lo que Atom publica (precio cotizado, CRM, puesta en marcha).
- Cierre: se conserva el titular de referencia, que ya cumple el tono.

## Resultado del checklist

`atom_uikit_finalize` no se corrió al escribir este ejemplo. Comprobado en el navegador: un `h1`, cero
elementos de formulario, cero marcadores sin resolver, siete enlaces a wa.me (hero, dos secciones de profundidad, dos planes, accordion, cierre).

Líneas incumplidas y declaradas:

- El número de WhatsApp es `00000000000`: el brief no trae uno confirmado.
- Las capacidades dependen del cuerpo del documento, que no se pudo leer (arriba).

## Captura

`docs/evidence/ejemplo-pagina-de-producto-1440.png`: la página a 1440 px. A 390 px la página pelada
desborda 20 px porque el contenedor no trae reinicio de caja fuera del host; no es de los bloques (medido en la prueba de bloques).
