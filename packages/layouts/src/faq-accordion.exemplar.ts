/**
 * Bloque ejemplar: faq-accordion
 *
 * Declara la decision de composicion del layout hermano (faq-accordion.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * Motion: accordion-animation (estado en aria-expanded).
 */

export const faqAccordionExemplar = {
  "slug": "faq-accordion",
  "whenToUse": [
    "Resolver las objeciones típicas justo antes del cierre, en una sola columna.",
    "Cinco preguntas o menos, con respuestas de una o dos frases."
  ],
  "whenNotToUse": [
    "Hay más de seis preguntas o necesitan dos columnas: usa layout/faq-two-col.",
    "La objeción es de precio y necesita comparar planes: usa layout/pricing-plans."
  ],
  "rhythm": "section",
  "surface": "default",
  "motion": {
    "hook": "accordion-animation",
    "attrs": {
      "data-accordion": ""
    }
  },
  "content": {
    "headline": "Preguntas frecuentes",
    "contactHref": "https://wa.me/00000000000",
    "contactCta": "Pregúntanos por WhatsApp",
    "faq1_question": "¿Qué necesito para empezar con Atom?",
    "faq1_answer": "Una cuenta de WhatsApp Business y tus canales de atención. Te acompañamos en la conexión.",
    "faq2_question": "¿Pueden responder mi equipo y la automatización al mismo tiempo?",
    "faq2_answer": "Sí. La automatización atiende lo repetitivo y pasa la conversación a una persona cuando hace falta.",
    "faq3_question": "¿Se conecta con mi CRM?",
    "faq3_answer": "Atom se integra con los CRM más usados para que cada conversación quede registrada donde ya trabajas.",
    "faq4_question": "¿Cómo sé qué campañas funcionan?",
    "faq4_answer": "Cada conversación conserva su origen, así que ves qué anuncios traen clientes y no solo mensajes.",
    "faq5_question": "¿Cuánto tarda la puesta en marcha?",
    "faq5_answer": "Depende de tus canales e integraciones. Escríbenos y te damos una estimación para tu caso."
  },
  "states": [
    "respuesta de 5 líneas: el panel crece sin saltos",
    "390px: la pregunta hace salto de línea sin tapar el ícono",
    "todo cerrado al cargar; abrir uno cierra los demás"
  ],
  "a11y": {
    "carriesH1": false,
    "landmark": null
  },
  "related": [
    "layout/faq-two-col"
  ],
  "evidence": {
    "capture": "docs/evidence/faq-accordion-1440.png",
    "captureMobile": "docs/evidence/faq-accordion-390.png",
    "acceptance": "Accordion con aria-expanded, 5 preguntas, 0 slots sin resolver, CTA a wa.me."
  }
};
