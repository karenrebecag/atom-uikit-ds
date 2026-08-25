/**
 * Layout: hero-industry
 *
 * Hero a sangre con art direction: una foto apaisada para desktop y una vertical
 * para movil, con scrim direccional que garantiza contraste sobre ambas.
 * Structure-only. References DS components by BEM class.
 *
 * Por que existe separado de hero-fullbleed: aquel resuelve UNA foto decorativa
 * como background de la seccion. Cuando la pieza necesita dos encuadres
 * distintos, meter la imagen en la clase obliga a duplicar la seccion entera
 * por breakpoint — el error que este layout viene a cerrar. Aqui la imagen es
 * slot (mismo precedente que Media Tile), asi que el texto existe una sola vez.
 */

export const heroIndustry = {
  slug: 'hero-industry',
  name: 'Hero Industry',
  description:
    'Hero a sangre con art direction (foto desktop + foto movil) y scrim direccional. Titular, entradilla y hasta 2 CTAs sobre la imagen. Structure only.',
  components: ['chip', 'button', 'link-button', 'typography'],
  html: `<!-- Layout: hero-industry -->
<!-- Get component CSS: atom_uikit_source("chip", ["css"]), atom_uikit_source("button", ["css"]) -->
<!-- data-theme="dark" no es decoracion: el contenido va sobre un scrim oscuro, asi
     que los componentes de dentro (chip, button) deben resolver sus tokens en modo
     oscuro. Sin el, el chip pinta borde oscuro sobre foto oscura. -->
<header class="l-hero-industry" data-theme="dark">
  <img class="l-hero-industry__media l-hero-industry__media--desktop" src="{{mediaDesktop}}" alt="{{mediaAlt}}" />
  <img class="l-hero-industry__media l-hero-industry__media--mobile" src="{{mediaMobile}}" alt="" />
  <div class="l-hero-industry__scrim"></div>
  <div class="l-hero-industry__content">
    <span class="chip chip--outlined chip--s">
      <span class="chip__label">{{eyebrow}}</span>
    </span>
    <h1 class="l-hero-industry__headline">{{headline}}</h1>
    <p class="l-hero-industry__subtitle">{{subtitle}}</p>
    <div class="l-hero-industry__actions">
      <a href="{{cta_primary_href}}" class="button button--primary button--l">
        <span class="button__label">{{primaryCta}}</span>
      </a>
      <a href="{{cta_secondary_href}}" class="link-button">
        <span class="link-button__text">{{secondaryCta}}</span>
      </a>
    </div>
  </div>
</header>`,
  css: `/* Layout: hero-industry — structure only */
.l-hero-industry {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: 100svh;
  padding: var(--spacing-20) var(--spacing-8);
  color: var(--foreground);
}

/* La foto es un elemento, no un background: asi el encuadre es dato del
   consumidor y el mismo bloque sirve para cualquier industria. */
.l-hero-industry__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.l-hero-industry__media--mobile {
  display: none;
}

.l-hero-industry__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(90deg, var(--overlay) 0%, transparent 78%);
}

.l-hero-industry__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-4);
  max-width: 40rem;
}

.l-hero-industry__headline {
  margin: 0;
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-5xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
}

.l-hero-industry__subtitle {
  margin: 0;
  max-width: 34rem;
  font-size: var(--font-size-lg);
  line-height: var(--line-height-lg);
}

.l-hero-industry__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-2);
}

/* El corte va en 991px, el mismo del breakpoint tablet de Webflow, para que el
   layout se pueda reproducir en el Designer sin inventar un media query. */
@media (max-width: 991px) {
  .l-hero-industry {
    padding: var(--spacing-16) var(--spacing-5);
    text-align: center;
  }

  .l-hero-industry__media--desktop {
    display: none;
  }

  .l-hero-industry__media--mobile {
    display: block;
  }

  /* Vertical, no horizontal: en el encuadre movil el sujeto ocupa el ancho
     completo y el texto se apoya abajo. */
  .l-hero-industry__scrim {
    background: linear-gradient(180deg, transparent 0%, var(--overlay) 55%, var(--overlay) 100%);
  }

  .l-hero-industry__content {
    align-items: center;
    margin-inline: auto;
  }

  .l-hero-industry__headline {
    font-size: var(--font-size-4xl);
    line-height: var(--line-height-4xl);
  }
}`,
};
