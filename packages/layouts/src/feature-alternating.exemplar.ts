/**
 * Bloque ejemplar: feature-alternating
 *
 * Declara la decision de composicion del layout hermano (feature-alternating.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * Imagenes de referencia: sustituir por las del generador. Eyebrows omitidos por A2.
 */

export const featureAlternatingExemplar = {
  "slug": "feature-alternating",
  "whenToUse": [
    "Explicar 2 a 4 capacidades en profundidad, cada una con su imagen, alternando lados.",
    "Es donde vive el argumento: del dolor del cliente a cómo lo resuelve Atom."
  ],
  "whenNotToUse": [
    "Los beneficios son cortos y paralelos, sin imagen: usa layout/feature-grid.",
    "Quieres que la persona elija entre vistas de un mismo producto: usa layout/feature-tabs."
  ],
  "rhythm": "section",
  "surface": "default",
  "motion": {
    "hook": null,
    "attrs": {}
  },
  "content": {
    "headline": "De la primera pregunta al cierre, en la misma conversación",
    "block1_eyebrow": null,
    "block1_title": "Atiende cada consulta sin dejar a nadie esperando",
    "block1_body": "Las respuestas automáticas resuelven lo repetitivo y tu equipo entra cuando la conversación lo pide, con todo el historial a la vista.",
    "block1_ctaLabel": "Hablar con el equipo",
    "block1_ctaHref": "https://wa.me/00000000000",
    "block1_image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f4f4f5'/%3E%3Crect x='40' y='40' width='720' height='520' rx='24' fill='%23e4e4e7'/%3E%3C/svg%3E",
    "block1_imageAlt": "Imagen generada a partir del brief",
    "block2_eyebrow": null,
    "block2_title": "Da seguimiento hasta que el lead se convierte",
    "block2_body": "Recordatorios y etiquetas para que ningún interesado se enfríe, y reportes para saber qué está funcionando.",
    "block2_ctaLabel": "Hablar con el equipo",
    "block2_ctaHref": "https://wa.me/00000000000",
    "block2_image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f4f4f5'/%3E%3Crect x='40' y='40' width='720' height='520' rx='24' fill='%23e4e4e7'/%3E%3C/svg%3E",
    "block2_imageAlt": "Imagen generada a partir del brief"
  },
  "states": [
    "una sola capacidad: el bloque pierde sentido, usa un hero-split",
    "imagen vertical: se recorta a la proporción de la columna",
    "390px: imagen debajo del texto en ambos bloques"
  ],
  "a11y": {
    "carriesH1": false,
    "landmark": null
  },
  "related": [
    "layout/feature-grid",
    "layout/feature-tabs"
  ],
  "evidence": {
    "capture": "docs/evidence/feature-alternating-1440.png",
    "captureMobile": "docs/evidence/feature-alternating-390.png",
    "acceptance": "Dos bloques alternados, 0 slots sin resolver, links a wa.me, 390px apilado."
  }
};
