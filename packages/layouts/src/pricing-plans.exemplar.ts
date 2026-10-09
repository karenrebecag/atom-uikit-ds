/**
 * Bloque ejemplar: pricing-plans
 *
 * Declara la decision de composicion del layout hermano (pricing-plans.ts) y su copy de
 * referencia. No escribe CSS ni HTML: el .exemplar.html publicado sale de aplicar
 * `content` al html del layout. Formato: EXEMPLAR.md.
 * Sin cifras de precio inventadas: los valores se cotizan. La tarjeta destacada es oscura por data-theme propio del componente, no por surface.
 */

export const pricingPlansExemplar = {
  "slug": "pricing-plans",
  "whenToUse": [
    "Mostrar los dos planes de Atom (Profesional destacado y Enterprise) con beneficios e integraciones.",
    "Después de explicar el producto y antes de las preguntas frecuentes."
  ],
  "whenNotToUse": [
    "Necesitas comparar muchos planes fila por fila: usa layout/pricing-comparison.",
    "Aún no hay planes definidos: no inventes precios, usa layout/cta-banner."
  ],
  "rhythm": "section",
  "surface": "default",
  "motion": {
    "hook": "text-reveal",
    "attrs": {
      "data-split": "heading"
    }
  },
  "content": {
    "eyebrow": null,
    "headline": "Un plan para cada etapa de tu equipo",
    "subtitle": "Empieza con lo esencial y crece cuando lo necesites.",
    "footnote": "Los valores se cotizan según tu volumen de conversaciones y canales.",
    "plan1_eyebrow": "Más elegido",
    "plan1_name": "Profesional",
    "plan1_price": "A tu medida",
    "plan1_priceUnit": "",
    "plan1_priceNote": "Cotizamos según tu volumen de conversaciones.",
    "plan1_channelsLabel": "Canales incluidos: WhatsApp, Instagram y Messenger",
    "plan1_ctaHref": "https://wa.me/00000000000",
    "plan1_ctaId": "plan-profesional",
    "plan1_ctaLabel": "Cotizar por WhatsApp",
    "plan1_benefitsLabel": "Incluye",
    "plan1_crmLabel": "Se integra con tu CRM",
    "plan2_eyebrow": "Para equipos grandes",
    "plan2_name": "Enterprise",
    "plan2_price": "A tu medida",
    "plan2_priceUnit": "",
    "plan2_priceNote": "Condiciones y soporte acordados contigo.",
    "plan2_channelsLabel": "Canales incluidos: WhatsApp, Instagram, Messenger y Telegram",
    "plan2_ctaHref": "https://wa.me/00000000000",
    "plan2_ctaId": "plan-enterprise",
    "plan2_ctaLabel": "Hablar con ventas",
    "plan2_benefitsLabel": "Todo lo de Profesional, más",
    "plan2_crmLabel": "Integraciones a la medida"
  },
  "repeats": {
    "plan1_feature": [
      {
        "feature_label": "Bandeja compartida para tu equipo",
        "feature_value": "Incluido"
      },
      {
        "feature_label": "Respuestas automáticas",
        "feature_value": "Incluido"
      },
      {
        "feature_label": "Reportes de conversaciones",
        "feature_value": "Incluido"
      }
    ],
    "plan2_feature": [
      {
        "feature_label": "Acompañamiento dedicado",
        "feature_value": "Incluido"
      },
      {
        "feature_label": "Integraciones a la medida",
        "feature_value": "Incluido"
      },
      {
        "feature_label": "Soporte prioritario",
        "feature_value": "Incluido"
      }
    ]
  },
  "states": [
    "plan con 3 beneficios y plan con 5: las tarjetas conservan la misma altura",
    "390px: tarjetas apiladas, la destacada primero",
    "sin precio público: el precio es una frase, nunca una cifra inventada"
  ],
  "a11y": {
    "carriesH1": false,
    "landmark": null
  },
  "related": [
    "layout/pricing-comparison"
  ],
  "evidence": {
    "capture": "docs/evidence/pricing-plans-1440.png",
    "captureMobile": "docs/evidence/pricing-plans-390.png",
    "acceptance": "Dos tarjetas (una oscura por data-theme), 0 slots sin resolver, CTA a wa.me."
  }
};
