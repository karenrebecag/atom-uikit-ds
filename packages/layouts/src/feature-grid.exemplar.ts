/**
 * Bloque ejemplar: feature-grid
 *
 * Declara la decision de composicion del layout hermano (feature-grid.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * Los iconos son SVG propios en currentColor (rawSlots); el eyebrow se omite por A2.
 */

export const featureGridExemplar = {
  "slug": "feature-grid",
  "whenToUse": [
    "Tres beneficios paralelos que se leen de un vistazo, justo después del hero.",
    "Cuando cada beneficio cabe en un titulo corto y dos líneas de apoyo."
  ],
  "whenNotToUse": [
    "Necesitas explicar una capacidad en profundidad con imagen: usa layout/feature-alternating.",
    "Son más de tres elementos o llevan datos: usa layout/feature-icon-list o layout/metrics-grid."
  ],
  "rhythm": "section",
  "surface": "default",
  "motion": {
    "hook": "scroll-reveal",
    "attrs": {
      "data-reveal": ""
    }
  },
  "content": {
    "eyebrow": null,
    "heading": "Todo lo que tu equipo necesita para vender por chat",
    "body": "Tres piezas que trabajan juntas desde el primer mensaje hasta el cierre.",
    "feature_1_icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.6-.8L3 20l1-4.6A8.4 8.4 0 1 1 21 11.5Z\"/></svg>",
    "feature_1_title": "Una bandeja para todo el equipo",
    "feature_1_body": "Cada conversación en un solo lugar, con responsable y contexto del cliente.",
    "feature_2_icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M13 2 4 14h7l-1 8 9-12h-7l1-8Z\"/></svg>",
    "feature_2_title": "Respuestas automáticas que suenan humanas",
    "feature_2_body": "Atiende a cualquier hora y pasa a una persona cuando importa.",
    "feature_3_icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/></svg>",
    "feature_3_title": "Resultados que puedes medir",
    "feature_3_body": "Mira qué campaña trae conversaciones y cuáles terminan en venta."
  },
  "rawSlots": [
    "feature_1_icon",
    "feature_2_icon",
    "feature_3_icon"
  ],
  "states": [
    "texto de 3 líneas en una tarjeta: las demás se estiran a la misma altura",
    "390px: una columna",
    "solo 2 beneficios: usa feature-alternating, no esta rejilla"
  ],
  "a11y": {
    "carriesH1": false,
    "landmark": null
  },
  "related": [
    "layout/feature-alternating",
    "layout/feature-icon-list"
  ],
  "evidence": {
    "capture": "docs/evidence/feature-grid-1440.png",
    "captureMobile": "docs/evidence/feature-grid-390.png",
    "acceptance": "Tres tarjetas con icono, 0 slots sin resolver, 390px una columna."
  }
};
