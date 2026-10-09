<!-- GENERADO por scripts/build-skill-blocks.mjs desde los .exemplar.ts. No editar a mano. -->

# Bloques ejemplares

Cada region de la pagina sale de un bloque. Elige por `Cuando si` y `Cuando no`, no por el nombre:
el segundo dice a que hermano irte. Instala el bloque y pega su `layouts/<slug>.exemplar.html`;
toda la copy que trae es de referencia y se sustituye con la del brief.

## hero

| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |
|---|---|---|---|---|---|
| `layout/hero-split` | La promesa principal de la página y hay una imagen o video que la respalda a la derecha. Landing de pauta: un titular, una frase de apoyo y un único CTA a WhatsApp. | No hay media que mostrar o el titular es muy largo: usa layout/hero-centered. Página de una industria con prueba social integrada: usa layout/hero-industry. | `.section--hero` | `hook:text-reveal` | elegible |
| `layout/hero-centered` | Promesa corta sin imagen, con prueba social (avatares) y etiquetas de beneficios debajo. Primera región de una página de producto cuando el titular carga todo el peso. | Tienes una imagen o video que debe verse en el primer pantallazo: usa layout/hero-split. La pagina es de una industria concreta y necesita su propia prueba: usa layout/hero-industry. | `.section--hero` | `hook:text-reveal` | elegible |

## beneficios

| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |
|---|---|---|---|---|---|
| `layout/feature-grid` | Tres beneficios paralelos que se leen de un vistazo, justo después del hero. Cuando cada beneficio cabe en un titulo corto y dos líneas de apoyo. | Necesitas explicar una capacidad en profundidad con imagen: usa layout/feature-alternating. Son más de tres elementos o llevan datos: usa layout/feature-icon-list o layout/metrics-grid. | `.section` | `hook:scroll-reveal` | no |
| `layout/feature-alternating` | Explicar 2 a 4 capacidades en profundidad, cada una con su imagen, alternando lados. Es donde vive el argumento: del dolor del cliente a cómo lo resuelve Atom. | Los beneficios son cortos y paralelos, sin imagen: usa layout/feature-grid. Quieres que la persona elija entre vistas de un mismo producto: usa layout/feature-tabs. | `.section` | ninguno | no |

## prueba

| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |
|---|---|---|---|---|---|
| `layout/metrics-grid` | Cuatro cifras de resultado de una industria, cada una con su etiqueta y una frase. Prueba social cuantitativa antes del cierre o después de explicar el producto. | Solo tienes una o dos cifras: usa layout/stats-band. La prueba es una opinión de cliente, no un número: usa layout/testimonial-spotlight. | `.section` | ninguno | no |

## planes

| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |
|---|---|---|---|---|---|
| `layout/pricing-plans` | Mostrar los dos planes de Atom (Profesional destacado y Enterprise) con beneficios e integraciones. Después de explicar el producto y antes de las preguntas frecuentes. | Necesitas comparar muchos planes fila por fila: usa layout/pricing-comparison. Aún no hay planes definidos: no inventes precios, usa layout/cta-banner. | `.section` | `hook:text-reveal` | no |

## objeciones

| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |
|---|---|---|---|---|---|
| `layout/faq-accordion` | Resolver las objeciones típicas justo antes del cierre, en una sola columna. Cinco preguntas o menos, con respuestas de una o dos frases. | Hay más de seis preguntas o necesitan dos columnas: usa layout/faq-two-col. La objeción es de precio y necesita comparar planes: usa layout/pricing-plans. | `.section` | `hook:accordion-animation` | no |

## cierre

| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |
|---|---|---|---|---|---|
| `layout/cta-banner` | Cierre de la página: una frase y un único botón a WhatsApp. Franja intermedia que repite la acción después de una sección larga. | El cierre necesita una imagen que lo acompañe: usa layout/cta-split-image. Quieres capturar un correo: Atom no usa formularios, el canal es WhatsApp. | `.section--compact` | ninguno | no |
