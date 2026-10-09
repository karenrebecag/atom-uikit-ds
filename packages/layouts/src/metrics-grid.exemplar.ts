/**
 * Bloque ejemplar: metrics-grid
 *
 * Declara la decision de composicion del layout hermano (metrics-grid.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * Las cifras son SOLO las del catalogo autorizado de atom-mcp (apps/webflow/src/core/lp-metrics.ts, industria educativa).
 */

export const metricsGridExemplar = {
  "slug": "metrics-grid",
  "whenToUse": [
    "Cuatro cifras de resultado de una industria, cada una con su etiqueta y una frase.",
    "Prueba social cuantitativa antes del cierre o después de explicar el producto."
  ],
  "whenNotToUse": [
    "Solo tienes una o dos cifras: usa layout/stats-band.",
    "La prueba es una opinión de cliente, no un número: usa layout/testimonial-spotlight."
  ],
  "rhythm": "section",
  "surface": "default",
  "motion": {
    "hook": null,
    "attrs": {}
  },
  "content": {
    "section_id": "resultados",
    "eyebrow": null,
    "heading": "Resultados de instituciones educativas con Atom",
    "media1_src": null,
    "media1_alt": null,
    "media2_poster": null,
    "media2_webm": null,
    "media2_mp4": null,
    "card1_value": "+86%",
    "card1_label": "aumento en contactabilidad",
    "card1_text": "Más aspirantes responden cuando la conversación empieza por WhatsApp.",
    "card2_value": "+70%",
    "card2_label": "aspirantes calificados",
    "card2_text": "Cada lead llega con la información que tu equipo necesita para avanzar.",
    "card3_value": "+51%",
    "card3_label": "crecimiento en matrículas",
    "card3_text": "Más conversaciones que terminan en una inscripción.",
    "card4_value": "89,5%",
    "card4_label": "ROI positivo",
    "card4_text": "La inversión en pauta se recupera con las conversaciones que genera."
  },
  "states": [
    "cifra larga (89,5%) en 390px: la tarjeta no desborda",
    "menos de 4 cifras: queda hueco en la rejilla, usa stats-band",
    "tiles de media omitidos: solo cifras"
  ],
  "a11y": {
    "carriesH1": false,
    "landmark": null
  },
  "related": [
    "layout/stats-band",
    "layout/testimonial-spotlight"
  ],
  "evidence": {
    "capture": "docs/evidence/metrics-grid-1440.png",
    "captureMobile": "docs/evidence/metrics-grid-390.png",
    "acceptance": "Cuatro tarjetas con cifra del catalogo autorizado (educativa), 0 slots sin resolver."
  }
};
