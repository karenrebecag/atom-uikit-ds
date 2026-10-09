/**
 * Bloque ejemplar: hero-split
 *
 * Declara la decision de composicion del layout hermano (hero-split.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * El h1 lo asigna la skill: este bloque solo es elegible (a11y.carriesH1).
 */

export const heroSplitExemplar = {
  "slug": "hero-split",
  "whenToUse": [
    "La promesa principal de la página y hay una imagen o video que la respalda a la derecha.",
    "Landing de pauta: un titular, una frase de apoyo y un único CTA a WhatsApp."
  ],
  "whenNotToUse": [
    "No hay media que mostrar o el titular es muy largo: usa layout/hero-centered.",
    "Página de una industria con prueba social integrada: usa layout/hero-industry."
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
    "heading": "Convierte tus conversaciones de WhatsApp en ventas",
    "body": "Atom junta a tu equipo, tus automatizaciones y tu CRM en un solo lugar para que cada conversación avance hasta el cierre.",
    "cta_primary_href": "https://wa.me/00000000000",
    "cta_primary": "Habla con nosotros por WhatsApp",
    "cta_secondary_href": null,
    "cta_secondary": null,
    "media": "Imagen generada a partir del brief"
  },
  "states": [
    "sin media: la columna derecha conserva su recuadro",
    "titular de 3 líneas",
    "solo un CTA, el secundario se omite"
  ],
  "a11y": {
    "carriesH1": true,
    "landmark": null
  },
  "related": [
    "layout/hero-centered",
    "layout/hero-industry"
  ],
  "evidence": {
    "capture": "docs/evidence/hero-split-1440.png",
    "captureMobile": "docs/evidence/hero-split-390.png",
    "acceptance": "Instalado desde el canal, sin editar: hero con rhythm section--hero, 0 slots sin resolver, 390px sin desborde, dark legible."
  }
};
