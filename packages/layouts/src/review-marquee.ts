/**
 * Layout: review-marquee
 *
 * Dos tiras de testimonios que avanzan en direcciones opuestas y se pueden
 * arrastrar.
 *
 * Existe porque la version a mano de este patron se hace mal de tres formas
 * concretas: se duplica la seccion para movil, las dos filas acaban con
 * contenidos distintos, y el movimiento se resuelve con una animacion CSS que
 * no se puede arrastrar ni se pausa fuera del viewport.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 */

export const reviewMarquee = {
  slug: 'review-marquee',
  name: 'Marquee de Reviews',
  description:
    'Dos tiras de testimonios en direcciones opuestas, con avance continuo y arrastre por puntero. Una sola maquetacion para todos los anchos: en movil el arrastre imanta al borde de card en vez de cambiar a un slider aparte.',
  components: ['review-card', 'marquee', 'marquee-draggable'],
  html: `<!-- Layout: review-marquee -->
<!-- Get component CSS: atom_uikit_source("review-card"), atom_uikit_source("marquee") -->
<!-- Behavior: atom_uikit_source("marquee-draggable") — requiere gsap + Observer + ScrollTrigger -->
<!-- Observer viaja DENTRO de ScrollTrigger.min.js desde GSAP 3.10: no se carga aparte. -->
<!--
  DOS FILAS, DIRECCIONES OPUESTAS. Es lo que hace que el bloque se lea como
  ambiente y no como un carrusel que exige atencion: nada se alinea nunca
  igual dos veces. data-direction lo fija en el arranque, y el modulo lo
  mantiene actualizado al arrastrar.

  UNA SOLA MAQUETACION para todos los anchos. La tentacion es duplicar la
  seccion y darle a movil un slider aparte; eso deja el mismo texto en dos
  sitios y se desincroniza. data-snap="auto" cubre el caso movil: mide cuantas
  cards entran y solo imanta cuando caben menos de dos, que es cuando soltar a
  media card se lee como un fallo de maquetacion.

  data-autoplay se queda en su valor por defecto (avanza solo): un testimonio
  es ambiente de fondo, nadie va a descubrir que se puede arrastrar. Y con
  autoplay el degradado lateral SI tiene sentido — insinua movimiento que de
  verdad existe — asi que aqui va marquee--fade, al reves que en la tira de
  features, que esta quieta.

  data-duration     segundos que tarda la tira en recorrerse entera
  data-multiplier   tope de velocidad que puede imprimir un arrastre
  data-sensitivity  cuanto pesa la velocidad del puntero
  data-lag          arrastre-retardo de las cards; 0 lo apaga

  Sin controles prev/next a proposito: en una tira de ambiente los botones
  prometen una navegacion ordenada que aqui no existe, porque el loop es
  infinito y no hay primer ni ultimo testimonio.
-->

<section class="l-review-marquee" id="{{section_id}}">
  <div class="l-review-marquee__header">
    <div class="l-review-marquee__eyebrow">{{eyebrow}}</div>
    <h2 class="h2 l-review-marquee__title" data-split="heading">{{heading}}</h2>
  </div>

  <div
    class="marquee marquee--draggable marquee--fade"
    data-draggable-marquee
    data-direction="right"
    data-duration="60"
    data-multiplier="30"
    data-sensitivity="0.01"
    data-lag="3"
    data-snap="auto"
  >
    <div class="marquee__collection" data-draggable-marquee-collection>
      <div class="marquee__list" data-draggable-marquee-list>

        <div class="marquee__item">
          <figure class="review-card">
            <blockquote class="review-card__quote">{{row1_quote_1}}</blockquote>
            <figcaption class="review-card__author">
              <div class="review-card__name">{{row1_name_1}}</div>
              <div class="review-card__role">{{row1_role_1}}</div>
            </figcaption>
          </figure>
        </div>

        <div class="marquee__item">
          <figure class="review-card">
            <blockquote class="review-card__quote">{{row1_quote_2}}</blockquote>
            <figcaption class="review-card__author">
              <div class="review-card__name">{{row1_name_2}}</div>
              <div class="review-card__role">{{row1_role_2}}</div>
            </figcaption>
          </figure>
        </div>

      </div>
    </div>
  </div>

  <div
    class="marquee marquee--draggable marquee--fade l-review-marquee__row"
    data-draggable-marquee
    data-direction="left"
    data-duration="60"
    data-multiplier="30"
    data-sensitivity="0.01"
    data-lag="3"
    data-snap="auto"
  >
    <div class="marquee__collection" data-draggable-marquee-collection>
      <div class="marquee__list" data-draggable-marquee-list>

        <div class="marquee__item">
          <figure class="review-card">
            <blockquote class="review-card__quote">{{row2_quote_1}}</blockquote>
            <figcaption class="review-card__author">
              <div class="review-card__name">{{row2_name_1}}</div>
              <div class="review-card__role">{{row2_role_1}}</div>
            </figcaption>
          </figure>
        </div>

        <div class="marquee__item">
          <figure class="review-card">
            <blockquote class="review-card__quote">{{row2_quote_2}}</blockquote>
            <figcaption class="review-card__author">
              <div class="review-card__name">{{row2_name_2}}</div>
              <div class="review-card__role">{{row2_role_2}}</div>
            </figcaption>
          </figure>
        </div>

      </div>
    </div>
  </div>
</section>`,
  css: `.l-review-marquee {
  overflow: hidden;
  padding-block: var(--section-padding-l);
}

.l-review-marquee__header {
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

.l-review-marquee__eyebrow {
  color: var(--muted-foreground);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.l-review-marquee__title {
  margin: 0;
}

.l-review-marquee__row {
  margin-block-start: var(--spacing-6);
}

/* Las cards se estiran a la altura de la fila para que las atribuciones queden
   alineadas entre si: con altura por contenido, cada pie cae donde acabe su
   cita y la fila se lee como un serrucho. */
.l-review-marquee .marquee__item {
  align-items: stretch;
  padding: var(--spacing-2);
  white-space: normal;
}`,
};
