/**
 * Bloque ejemplar: cta-banner
 *
 * Declara la decision de composicion del layout hermano (cta-banner.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * CTA = whatsapp-button a wa.me; el secundario se omite (un CTA primario por superficie).
 */

export const ctaBannerExemplar = {
  "slug": "cta-banner",
  "whenToUse": [
    "Cierre de la página: una frase y un único botón a WhatsApp.",
    "Franja intermedia que repite la acción después de una sección larga."
  ],
  "whenNotToUse": [
    "El cierre necesita una imagen que lo acompañe: usa layout/cta-split-image.",
    "Quieres capturar un correo: Atom no usa formularios, el canal es WhatsApp."
  ],
  "rhythm": "section--compact",
  "surface": "default",
  "motion": {
    "hook": null,
    "attrs": {}
  },
  "content": {
    "heading": "Hablemos de tus conversaciones",
    "body": "Cuéntanos cómo vendes hoy y te mostramos cómo Atom lo hace más simple.",
    "cta_primary_href": "https://wa.me/00000000000",
    "cta_primary": "Escríbenos por WhatsApp",
    "cta_secondary_href": null,
    "cta_secondary": null
  },
  "states": [
    "titular de 2 líneas",
    "390px: apilado y centrado",
    "sin cuerpo: el titular solo"
  ],
  "a11y": {
    "carriesH1": false,
    "landmark": null
  },
  "related": [
    "layout/cta-split-image"
  ],
  "evidence": {
    "capture": "docs/evidence/cta-banner-1440.png",
    "captureMobile": "docs/evidence/cta-banner-390.png",
    "acceptance": "Franja con CTA whatsapp-button a wa.me, 0 slots sin resolver, 390px apilado."
  }
};
