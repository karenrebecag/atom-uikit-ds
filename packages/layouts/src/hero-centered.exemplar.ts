/**
 * Bloque ejemplar: hero-centered
 *
 * Declara la decision de composicion del layout hermano (hero-centered.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * El h1 lo asigna la skill: este bloque solo es elegible (a11y.carriesH1).
 */

export const heroCenteredExemplar = {
  "slug": "hero-centered",
  "whenToUse": [
    "Promesa corta sin imagen, con prueba social (avatares) y etiquetas de beneficios debajo.",
    "Primera región de una página de producto cuando el titular carga todo el peso."
  ],
  "whenNotToUse": [
    "Tienes una imagen o video que debe verse en el primer pantallazo: usa layout/hero-split.",
    "La pagina es de una industria concreta y necesita su propia prueba: usa layout/hero-industry."
  ],
  "rhythm": "section--hero",
  "surface": "default",
  "motion": {
    "hook": "text-reveal",
    "attrs": {
      "data-split": "heading"
    }
  },
  "content": {
    "eyebrow": null,
    "heading": "Vende por WhatsApp sin perder ninguna conversación",
    "body": "Responde más rápido, da seguimiento a cada lead y mide qué campaña trae clientes de verdad.",
    "cta_primary_href": "https://wa.me/00000000000",
    "cta_primary": "Habla con nosotros por WhatsApp",
    "cta_secondary_href": null,
    "cta_secondary": null,
    "proof_text": "Equipos comerciales que ya conversan con Atom",
    "tag_1": "WhatsApp Business API",
    "tag_2": "Integración con tu CRM",
    "tag_3": "Automatizaciones"
  },
  "states": [
    "titular de 2 líneas en 390px",
    "solo un CTA, el secundario se omite",
    "sin etiquetas: la franja inferior se elimina en la adopcion, no aqui"
  ],
  "a11y": {
    "carriesH1": true,
    "landmark": null
  },
  "related": [
    "layout/hero-split",
    "layout/hero-industry"
  ],
  "evidence": {
    "capture": "docs/evidence/hero-centered-1440.png",
    "captureMobile": "docs/evidence/hero-centered-390.png",
    "acceptance": "Hero centrado completo, 0 slots sin resolver, 390px sin desborde."
  }
};
