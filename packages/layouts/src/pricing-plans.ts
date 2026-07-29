/**
 * Layout: pricing-plans
 *
 * Seccion de planes con la anatomia real de la card de Atom (lenguaje OSMO):
 * eyebrow mono, titulo display, precio, CTA, divider etiquetado y beneficios
 * con hairlines.
 *
 * Structure-only, pure DS: cada clase de aqui existe como componente publicado
 * (pricing-card, feature, divider, tag, section-header, button). Este archivo
 * NO define color, tipografia ni espaciado de componente: solo la rejilla de
 * la seccion. Todo lo demas llega por /v1/embed.css o por los CSS instalados
 * desde el registry.
 *
 * UNA sola anatomia de card (cardHtml), compuesta dos veces — no dos bloques
 * HTML escritos a mano. Antes de esto el layout declaraba dos <article> con
 * markup distinto (plan1 con el boton animado de WhatsApp, plan2 con boton
 * plano), lo que ataba el TIPO DE CTA a la POSICION del plan en vez de dejarlo
 * como decision de contenido. Corregido 2026-07-29 (Karen: "en principio
 * deberian ser exactamente la misma"). El CTA de WhatsApp con tracking WCI no
 * es parte de la anatomia de pricing-card — vive en su propio componente
 * (whatsapp-button) para usarse donde corresponda, fuera de esta card.
 *
 * Unica diferencia entre las dos posiciones: data-theme="dark" en la segunda,
 * que voltea los semantics del MISMO componente (mismo HTML, mismo CSS) — es
 * el mecanismo de theming del DS, no una card distinta.
 *
 * Slots repetibles: los elementos marcados con data-repeat contienen UNA fila
 * de ejemplo. En no-code se duplica la fila a mano; en codigo se clona el nodo
 * por cada item de datos. El atributo es solo una marca — no lo lee ningun CSS.
 */

const CHECK_PATH = 'M9.55 17.6 4.2 12.25l1.42-1.42 3.93 3.93 8.83-8.83 1.42 1.42z';

/** Unica fuente de la anatomia de la card. `theme` solo agrega data-theme —
 *  todo lo demas (clases, orden, slots) es identico entre instancias.
 *  JS plano a proposito (dynamic import sin paso de compilacion, ver
 *  build-registry.mjs) — el consumidor lo instala como .js, no .ts. */
function cardHtml(prefix, theme) {
  return `<article class="pricing-card"${theme ? ` data-theme="${theme}"` : ''}>
        <div class="pricing-card__inner">
          <div class="pricing-card__tag-row">
            <span class="tag tag--mono tag--inverse tag--s pricing-card__eyebrow">{{${prefix}_eyebrow}}</span>
          </div>
          <h3 class="pricing-card__title" data-split="heading">{{${prefix}_name}}</h3>
          <div class="pricing-card__price-row">
            <span class="pricing-card__price">
              <span>{{${prefix}_price}}</span>
              <span class="pricing-card__price-unit">{{${prefix}_priceUnit}}</span>
            </span>
            <p class="pricing-card__price-note body-sm">{{${prefix}_priceNote}}</p>
          </div>
          <div class="pricing-card__cta">
            <!-- CTA animado (anatomia de Button.tsx animated): data-button-animate
                 activa el hover-scale por CSS; el doble texto es el contrato del
                 text-swap — initButtonHover (hook button-hover del registry) lo
                 divide en caracteres con GSAP SplitText cargados como globales.
                 Sin JS degrada limpio: los dos textos identicos se superponen. -->
            <a class="button button--primary button--l" href="{{${prefix}_ctaHref}}" data-cta="{{${prefix}_ctaId}}" data-button-animate>
              <span class="button__label">
                <span class="button__label-inner">
                  <span class="button__text is--default" data-button-text>{{${prefix}_ctaLabel}}</span>
                  <span class="button__text is--hover" data-button-text aria-hidden="true">{{${prefix}_ctaLabel}}</span>
                </span>
              </span>
            </a>
          </div>
          <div class="divider divider--labeled pricing-card__divider">
            <span class="eyebrow">{{${prefix}_benefitsLabel}}</span>
          </div>
          <ul class="feature-list feature-list--divided" data-repeat="${prefix}_feature">
            <li class="feature">
              <span class="feature__label">
                <span class="feature__icon"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${CHECK_PATH}"/></svg></span>
                <span class="feature__text">{{feature_label}}</span>
              </span>
              <span class="tag tag--mono tag--inverse tag--s feature__value">{{feature_value}}</span>
            </li>
          </ul>
        </div>
      </article>`;
}

export const pricingPlans = {
  slug: 'pricing-plans',
  name: 'Pricing Plans',
  description:
    'Dos planes con la card de Atom: eyebrow, titulo display, precio, CTA, divider etiquetado y lista de beneficios. Misma card, superficie clara + oscura via data-theme. Structure only.',
  components: ['section-header', 'pricing-card', 'feature', 'divider', 'tag', 'button'],
  html: `<!-- Layout: pricing-plans -->
<section class="section l-pricing-plans">
  <div class="container">
    <header class="section-header section-header--center">
      <span class="eyebrow section-header__eyebrow">{{eyebrow}}</span>
      <h2 class="h2 section-header__title" data-split="heading">{{headline}}</h2>
      <p class="section-header__subtitle" data-split="heading">{{subtitle}}</p>
    </header>

    <div class="l-pricing-plans__grid">
      ${cardHtml('plan1')}
      ${cardHtml('plan2', 'dark')}
    </div>

    <p class="l-pricing-plans__footnote body-sm">{{footnote}}</p>
  </div>
</section>`,
  css: `/* Layout: pricing-plans — solo la rejilla de la seccion.
   El lateral lo gobierna .container con --container-padding; la card, su padding. */
.l-pricing-plans {
  padding-inline: 0;
}

.l-pricing-plans__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: var(--spacing-4);
  align-items: stretch;
}

.l-pricing-plans__footnote {
  max-width: 48rem;
  margin-block-start: var(--spacing-10);
  margin-inline: auto;
  color: var(--muted-foreground);
  text-align: center;
}

@media (max-width: 767px) {
  .l-pricing-plans__grid {
    grid-template-columns: 1fr;
  }
}`,
};
