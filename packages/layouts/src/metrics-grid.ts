/**
 * Layout: metrics-grid
 *
 * Rejilla de metricas sobre fondo oscuro: cards de cifra alternadas con tiles
 * de media (imagen o video) que rompen la retícula.
 *
 * Reusa feature-card: estas cards son feature-cards cuyo gancho es un numero
 * en vez de una imagen, y el tinte de cada una sale del mismo intent. No hace
 * falta un componente nuevo — hacia falta el slot __value.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 */

export const metricsGrid = {
  slug: 'metrics-grid',
  name: 'Metrics Grid',
  description:
    'Rejilla de metricas sobre fondo oscuro. Cada card lleva cifra, etiqueta y descripcion, con el acento de un intent del sistema; entre ellas se intercalan tiles de imagen o video. La cifra usa el par *-text del intent para que se lea sobre su propio tinte.',
  components: ['feature-card', 'typography'],
  html: `<!-- Layout: metrics-grid -->
<!-- Get component CSS: atom_uikit_source("feature-card") -->
<!--
  La cifra va en .feature-card__value y la etiqueta en el <h3>. Al reves seria
  lo intuitivo y es lo incorrecto: un numero no titula nada, y meterlo en un
  heading deja el esquema de encabezados de la pagina lleno de cifras sueltas
  para quien navegue por titulares.

  Los tiles de media son la MISMA card sin cuerpo: solo .feature-card__media.
  Asi comparten radio, sombra y tinte con las de cifra en vez de ser una caja
  aparte que hay que mantener a juego a mano.

  El video va muted + playsinline + loop porque es decorativo: sin muted no
  arranca solo en ningun navegador, y sin playsinline iOS lo abre a pantalla
  completa.
-->

<section class="l-metrics-grid" id="{{section_id}}">
  <div class="l-metrics-grid__header">
    <p class="l-metrics-grid__eyebrow">{{eyebrow}}</p>
    <h2 class="h2 l-metrics-grid__title" data-split="heading">{{heading}}</h2>
  </div>

  <div class="l-metrics-grid__list">
    <article class="feature-card l-metrics-grid__media-card">
      <div class="feature-card__media">
        <img src="{{media1_src}}" alt="{{media1_alt}}" loading="lazy" />
      </div>
    </article>

    <article class="feature-card feature-card--purple">
      <p class="feature-card__value">{{card1_value}}</p>
      <div class="feature-card__body">
        <h3 class="feature-card__title">{{card1_label}}</h3>
        <p class="feature-card__text">{{card1_text}}</p>
      </div>
    </article>

    <article class="feature-card feature-card--orange">
      <p class="feature-card__value">{{card2_value}}</p>
      <div class="feature-card__body">
        <h3 class="feature-card__title">{{card2_label}}</h3>
        <p class="feature-card__text">{{card2_text}}</p>
      </div>
    </article>

    <article class="feature-card feature-card--green">
      <p class="feature-card__value">{{card3_value}}</p>
      <div class="feature-card__body">
        <h3 class="feature-card__title">{{card3_label}}</h3>
        <p class="feature-card__text">{{card3_text}}</p>
      </div>
    </article>

    <article class="feature-card feature-card--blue">
      <p class="feature-card__value">{{card4_value}}</p>
      <div class="feature-card__body">
        <h3 class="feature-card__title">{{card4_label}}</h3>
        <p class="feature-card__text">{{card4_text}}</p>
      </div>
    </article>

    <article class="feature-card l-metrics-grid__media-card">
      <div class="feature-card__media">
        <video autoplay loop muted playsinline poster="{{media2_poster}}">
          <source src="{{media2_webm}}" type="video/webm" />
          <source src="{{media2_mp4}}" type="video/mp4" />
        </video>
      </div>
    </article>
  </div>
</section>`,
  css: `/* Layout: metrics-grid — structure only, pure DS tokens */
.l-metrics-grid {
  padding-block: var(--section-padding-l);
  padding-inline: var(--l-metrics-grid-gutter, 5%);
}

.l-metrics-grid__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-inline: auto;
  margin-block-end: var(--rhythm-s);
  max-width: var(--l-metrics-grid-container, 80rem);
}

.l-metrics-grid__eyebrow {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.l-metrics-grid__title {
  margin: 0;
}

.l-metrics-grid__list {
  display: grid;
  gap: var(--spacing-8);
  margin-inline: auto;
  max-width: var(--l-metrics-grid-container, 80rem);
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}

/* La card de cifra fija su ancho para tiras horizontales; en rejilla manda la
   columna. */
.l-metrics-grid__list .feature-card {
  width: auto;
  height: 100%;
}

/* El tile de media no lleva padding: la imagen sangra hasta el radio. */
.l-metrics-grid__media-card {
  padding: 0;
  overflow: hidden;
}

.l-metrics-grid__media-card .feature-card__media {
  border-radius: inherit;
  height: 100%;
}

.l-metrics-grid__media-card video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
`,
};
