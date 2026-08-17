/**
 * Layout: marquee-features
 *
 * Tira horizontal de feature-cards que avanza sola y se puede arrastrar.
 *
 * Publica la anatomia del behavior `marquee-draggable`, que hasta ahora existia
 * como modulo sin layout: sin esto cada consumidor reescribia el markup a mano
 * y a la tercera vez ya eran tres estructuras distintas.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 */

export const marqueeFeatures = {
  slug: 'marquee-features',
  name: 'Marquee de Features',
  description:
    'Tira horizontal de feature-cards con avance continuo y arrastre por puntero (GSAP Observer). Cada card lleva media, titulo y texto, y su acento de color sale de un intent del sistema. Pausa sola al salir del viewport.',
  components: ['feature-card', 'marquee', 'marquee-draggable'],
  html: `<!-- Layout: marquee-features -->
<!-- Get component CSS: atom_uikit_source("feature-card"), atom_uikit_source("marquee") -->
<!-- Behavior: atom_uikit_source("marquee-draggable") — requiere gsap + Observer + ScrollTrigger -->
<!-- Observer viaja DENTRO de ScrollTrigger.min.js desde GSAP 3.10: no se carga aparte. -->
<!--
  data-duration     segundos que tarda la lista en recorrerse entera (velocidad base)
  data-multiplier   tope de velocidad que puede imprimir un arrastre
  data-sensitivity  cuanto pesa la velocidad del puntero (mas alto = mas nervioso)
  data-direction    sentido inicial; el modulo lo mantiene actualizado al arrastrar
  data-autoplay     "false" = la tira arranca quieta y solo se mueve al arrastrar.
                    Quitarlo devuelve el avance continuo.

  Sin el modificador marquee--fade a proposito: el degradado lateral se ve raro
  cuando la tira esta quieta, porque insinua un movimiento que no hay. Con
  autoplay si tiene sentido, y entonces se anade.
-->

<section class="l-marquee-features" id="{{section_id}}">
  <div class="l-marquee-features__header">
    <div class="l-marquee-features__eyebrow">{{eyebrow}}</div>
    <h2 class="h2 l-marquee-features__title" data-split="heading">{{heading}}</h2>
  </div>

  <div
    class="marquee marquee--draggable"
    data-draggable-marquee
    data-direction="left"
    data-duration="20"
    data-multiplier="35"
    data-sensitivity="0.01"
    data-autoplay="false"
  >
    <div class="marquee__collection" data-draggable-marquee-collection>
      <div class="marquee__list" data-draggable-marquee-list>
        <div class="marquee__item">
          <article class="feature-card feature-card--green">
            <!-- draggable="false" + eager: sin esto el navegador arranca su propio
                 drag de imagen y se come el gesto del marquee -->
            <div class="feature-card__media"><img src="{{card1_image}}" alt="{{card1_alt}}" draggable="false" loading="eager"></div>
            <div class="feature-card__body">
              <h3 class="feature-card__title">{{card1_title}}</h3>
              <p class="feature-card__text">{{card1_text}}</p>
            </div>
          </article>
        </div>
        <div class="marquee__item">
          <article class="feature-card feature-card--purple">
            <div class="feature-card__media"><img src="{{card2_image}}" alt="{{card2_alt}}" draggable="false" loading="eager"></div>
            <div class="feature-card__body">
              <h3 class="feature-card__title">{{card2_title}}</h3>
              <p class="feature-card__text">{{card2_text}}</p>
            </div>
          </article>
        </div>
        <div class="marquee__item">
          <article class="feature-card feature-card--orange">
            <div class="feature-card__media"><img src="{{card3_image}}" alt="{{card3_alt}}" draggable="false" loading="eager"></div>
            <div class="feature-card__body">
              <h3 class="feature-card__title">{{card3_title}}</h3>
              <p class="feature-card__text">{{card3_text}}</p>
            </div>
          </article>
        </div>
        <div class="marquee__item">
          <article class="feature-card feature-card--blue">
            <div class="feature-card__media"><img src="{{card4_image}}" alt="{{card4_alt}}" draggable="false" loading="eager"></div>
            <div class="feature-card__body">
              <h3 class="feature-card__title">{{card4_title}}</h3>
              <p class="feature-card__text">{{card4_text}}</p>
            </div>
          </article>
        </div>
        <div class="marquee__item">
          <article class="feature-card feature-card--green">
            <div class="feature-card__media"><img src="{{card5_image}}" alt="{{card5_alt}}" draggable="false" loading="eager"></div>
            <div class="feature-card__body">
              <h3 class="feature-card__title">{{card5_title}}</h3>
              <p class="feature-card__text">{{card5_text}}</p>
            </div>
          </article>
        </div>
      </div>
      <!-- El behavior clona esta lista las veces que hagan falta para cubrir el
           ancho del viewport. No duplicar a mano: los clones llevan
           data-draggable-marquee-clone y aria-hidden. -->
    </div>
  </div>
</section>`,
  css: `/* Layout: marquee-features — structure only, pure DS tokens */
.l-marquee-features {
  overflow: hidden;
  padding-block: var(--section-padding-l);
}

.l-marquee-features__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  align-items: center;
  text-align: center;
  margin-inline: auto;
  margin-block-end: var(--rhythm-s);
  padding-inline: var(--spacing-6);
  max-width: 42rem;
}

.l-marquee-features__eyebrow {
  color: var(--muted-foreground);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.l-marquee-features__title {
  margin: 0;
}

/* La tira sangra a todo el ancho aunque la seccion tenga container: parte de
   la gracia es que las cards salgan por los bordes. */
.l-marquee-features .marquee__item {
  padding: var(--spacing-2);
  white-space: normal;
}`,
};
