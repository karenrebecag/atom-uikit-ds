/**
 * Layout: navbar-mega
 *
 * Navbar con mega-dropdowns morficos (paneles de columnas + card promo).
 * Para sitios con arquitectura de contenido profunda. Structure-only.
 *
 * Citado del mega-nav de OSMO; misma pildora sticky de navbar-simple.
 * El MOTION completo (morph de altura, hover intent direccional, slide-over
 * movil) vive en el behavior `mega-nav-animation` (initMegaNav), enganchado
 * por los data-* de este markup — este css NO anima (ley: layouts sin motion).
 * Sin el behavior los paneles quedan cerrados: para maquetar en el Designer,
 * data-panel-state="active" en un panel lo fuerza visible (helper sin efecto
 * en runtime).
 *
 * Contrato de edicion (mismo criterio de navbar-simple, decision de Karen
 * 2026-07-30):
 *   EDITABLE  -> labels de grupos, links sueltos, columnas y sus items, card.
 *   FIJO      -> el logo (assets oficiales R2) y el CTA de demo. Sin slot =
 *                no editable.
 * Los paneles son composicion de codigo con slots numerados (g1c1_l1_...):
 * data-repeat no anida, igual que en navbar-dropdown.
 *
 * El burger es el atomo burger-icon con estado data-menu-button: el behavior
 * alterna el atributo y el CSS de menu-button hace burger-X (nivel 0). NO
 * lleva data-menu-button-animate — initMenuButton duplicaria el click.
 */

export const navbarMega = {
  slug: 'navbar-mega',
  name: 'Navbar Mega',
  description:
    'Navbar con mega-dropdowns morficos: paneles multi-columna, quick links y card promo. Motion en el behavior mega-nav-animation. Structure only.',
  components: ['logo', 'nav-link', 'button', 'burger-icon', 'item', 'dropdown-menu', 'image'],
  html: `<!-- Layout: navbar-mega -->
<nav class="l-navbar-mega" data-menu-wrap data-menu-open="false">
  <div class="l-navbar-mega__bar">
    <div class="l-navbar-mega__row">
      <!-- LOGO FIJO: assets oficiales, sin slots a proposito -->
      <a data-menu-logo class="logo logo--m l-navbar-mega__logo" href="https://atomchat.io" aria-label="Atom">
        <img class="logo__light" src="https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-light.svg" alt="Atom" />
        <img class="logo__dark" src="https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-dark.svg" alt="Atom" />
      </a>
      <div data-nav-list data-mobile-nav class="l-navbar-mega__inner">
        <ul class="l-navbar-mega__list" aria-label="Principal">
          <li data-nav-list-item class="l-navbar-mega__list-item">
            <button data-dropdown-toggle="grupo1" aria-expanded="false" aria-haspopup="true" class="nav-link nav-link--default nav-link--dropdown">
              <span class="nav-link__text">{{group1_label}}</span>
              <span class="nav-link__caret"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.6665 8.3335L9.99984 11.6668L13.3332 8.3335" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </button>
          </li>
          <li data-nav-list-item class="l-navbar-mega__list-item">
            <button data-dropdown-toggle="grupo2" aria-expanded="false" aria-haspopup="true" class="nav-link nav-link--default nav-link--dropdown">
              <span class="nav-link__text">{{group2_label}}</span>
              <span class="nav-link__caret"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.6665 8.3335L9.99984 11.6668L13.3332 8.3335" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </button>
          </li>
          <li data-nav-list-item class="l-navbar-mega__list-item">
            <a href="{{link1_url}}" class="nav-link nav-link--default"><span class="nav-link__text">{{link1_label}}</span></a>
          </li>
          <!-- El CTA vive DENTRO de la lista: en movil comparte la estructura y
               la alineacion de los links en vez de flotar aparte. -->
          <li data-nav-list-item class="l-navbar-mega__list-item l-navbar-mega__list-item--cta">
            <!-- CTA FIJO de marca: sin slots a proposito -->
            <a href="https://atomchat.io/demo" class="button button--primary button--m">
              <span class="button__label">Agendar demo</span>
            </a>
          </li>
        </ul>
      </div>
      <button data-burger-toggle class="l-navbar-mega__burger burger-icon" data-menu-button="burger" aria-label="Menu" aria-expanded="false">
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
      </button>
      <div data-mobile-back class="l-navbar-mega__back">
        <button aria-label="Volver al menu" class="nav-link nav-link--default">
          <span class="nav-link__caret"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M11.6665 6.6665L8.33317 9.99984L11.6665 13.3332" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span class="nav-link__text">Volver</span>
        </button>
      </div>
    </div>
  </div>
  <div data-dropdown-wrapper class="l-navbar-mega__drop">
    <div data-dropdown-container class="l-navbar-mega__drop-clip">
      <div data-dropdown-bg class="l-navbar-mega__drop-bg"></div>
      <div data-panel-state data-nav-content="grupo1" role="region" aria-label="{{group1_label}}" class="l-navbar-mega__panel">
        <div class="l-navbar-mega__panel-row">
          <div data-menu-fade class="l-navbar-mega__col">
            <span class="dropdown-menu__label">{{g1c1_label}}</span>
            <ul class="l-navbar-mega__links">
              <li data-menu-fade>
                <a href="{{g1c1_l1_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g1c1_l1_title}}</span>
                    <span class="item__description">{{g1c1_l1_desc}}</span>
                  </span>
                </a>
              </li>
              <li data-menu-fade>
                <a href="{{g1c1_l2_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g1c1_l2_title}}</span>
                    <span class="item__description">{{g1c1_l2_desc}}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div data-menu-fade class="l-navbar-mega__col">
            <span class="dropdown-menu__label">{{g1c2_label}}</span>
            <ul class="l-navbar-mega__links">
              <li data-menu-fade>
                <a href="{{g1c2_l1_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g1c2_l1_title}}</span>
                    <span class="item__description">{{g1c2_l1_desc}}</span>
                  </span>
                </a>
              </li>
              <li data-menu-fade>
                <a href="{{g1c2_l2_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g1c2_l2_title}}</span>
                    <span class="item__description">{{g1c2_l2_desc}}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div data-menu-fade class="l-navbar-mega__col l-navbar-mega__col--tinted">
            <span class="dropdown-menu__label">{{g1c3_label}}</span>
            <ul class="l-navbar-mega__links">
              <li data-menu-fade>
                <a href="{{g1c3_l1_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g1c3_l1_title}}</span>
                  </span>
                </a>
              </li>
              <li data-menu-fade>
                <a href="{{g1c3_l2_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g1c3_l2_title}}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div data-panel-state data-nav-content="grupo2" role="region" aria-label="{{group2_label}}" class="l-navbar-mega__panel">
        <div class="l-navbar-mega__panel-row">
          <div data-menu-fade class="l-navbar-mega__col">
            <span class="dropdown-menu__label">{{g2c1_label}}</span>
            <ul class="l-navbar-mega__links">
              <li data-menu-fade>
                <a href="{{g2c1_l1_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g2c1_l1_title}}</span>
                    <span class="item__description">{{g2c1_l1_desc}}</span>
                  </span>
                </a>
              </li>
              <li data-menu-fade>
                <a href="{{g2c1_l2_url}}" class="item item--sm">
                  <span class="item__content">
                    <span class="item__title">{{g2c1_l2_title}}</span>
                    <span class="item__description">{{g2c1_l2_desc}}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div data-menu-fade class="l-navbar-mega__col l-navbar-mega__col--tinted l-navbar-mega__col--card">
            <div class="l-navbar-mega__card">
              <div class="l-navbar-mega__card-media">
                <img class="image" src="{{card_img}}" alt="{{card_alt}}" loading="lazy" />
              </div>
              <div class="l-navbar-mega__card-body">
                <span class="item__content">
                  <span class="item__title">{{card_title}}</span>
                  <span class="item__description">{{card_desc}}</span>
                </span>
                <a href="{{card_url}}" class="button button--primary button--s">
                  <span class="button__label">{{card_cta}}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>`,
  css: `/* Layout: navbar-mega — structure only.
   Misma pildora sticky de navbar-simple (radio 0.375em, hairline, controles
   2.5em). Los paneles nacen ocultos (estado estructural); TODO el motion vive
   en el behavior mega-nav-animation via data-attrs — este css NO anima.
   --l-nm-bar: alto de la barra, referencia para anclar el drop movil. */
.l-navbar-mega {
  --l-nm-bar: 3.375em;
  position: sticky;
  top: var(--spacing-5);
  margin-block-start: var(--spacing-5);
  z-index: var(--z-index-30);
  width: calc(100% - 2 * var(--container-padding));
  max-width: var(--size-container-content);
  margin-inline: auto;
}
.l-navbar-mega__bar {
  position: relative;
  z-index: 3;
  background-color: var(--background);
  border: var(--stroke-hairline) solid var(--border);
  border-radius: 0.375em;
}
.l-navbar-mega__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  min-height: var(--l-nm-bar);
  padding: 0.4375em;
}
.l-navbar-mega__logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 2.5em;
  padding-inline: 0.5em;
  margin-inline-end: var(--spacing-6);
}
.l-navbar-mega__inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-4);
}
.l-navbar-mega__list {
  display: flex;
  align-items: center;
  flex: 1;
  gap: var(--spacing-5);
  list-style: none;
  margin: 0;
  padding: 0;
}
/* El CTA es el ultimo item de la lista; auto lo empuja al extremo derecho sin
   sacarlo de la estructura. */
.l-navbar-mega__list-item--cta {
  margin-inline-start: auto;
  flex-shrink: 0;
}
.l-navbar-mega__burger {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  padding: var(--spacing-2);
  background: none;
  border: 0;
  color: var(--foreground);
  cursor: pointer;
}
.l-navbar-mega__back {
  position: absolute;
  left: 0.5em;
  z-index: 2;
  opacity: 0;
  visibility: hidden;
}
/* ---- Dropdown (desktop): clip + fondo + paneles apilados ----
   AUTO-CONTENIDO: el clip no ocupa el ancho de la barra; el behavior le fija
   width/x medidos del panel para que quede bajo su trigger y del tamano de su
   contenido. El wrapper SI cubre la barra completa a proposito: es el puente de
   hover entre el trigger y el panel (sin el, cruzar el hueco cierra el menu). */
.l-navbar-mega__drop {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 2;
  pointer-events: none;
}
.l-navbar-mega__drop-clip {
  position: absolute;
  top: 0.375em;
  left: 0;
  width: 0;
  overflow: hidden;
}
.l-navbar-mega__drop-bg {
  position: absolute;
  inset: 0;
  background-color: var(--popover);
  border: var(--stroke-hairline) solid var(--border);
  border-radius: 0.375em;
  box-shadow: var(--shadow-lg);
}
.l-navbar-mega__panel {
  position: absolute;
  top: 0;
  left: 0;
  /* max-content: el panel se mide por su contenido, no por el clip — que es
     justo lo que el behavior esta animando. Sin esto la medicion es circular. */
  width: max-content;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
/* Helper de Designer: forzar un panel visible para maquetar sin el behavior */
.l-navbar-mega__panel[data-panel-state="active"] {
  position: static;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.l-navbar-mega__panel-row {
  display: flex;
}
.l-navbar-mega__col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* auto, no flex:1: las columnas se dimensionan por su contenido para que el
     panel tenga un ancho natural. max-width acota descripciones largas. */
  flex: 0 0 auto;
  min-width: 12em;
  max-width: 18em;
  gap: var(--spacing-4);
  padding: var(--spacing-6) var(--spacing-4);
  border-right: var(--stroke-hairline) solid var(--border);
}
.l-navbar-mega__col:last-of-type {
  border-right: 0;
}
.l-navbar-mega__col--tinted {
  background-color: var(--muted);
}
.l-navbar-mega__col--card {
  padding: var(--spacing-4);
}
.l-navbar-mega__links {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}
.l-navbar-mega__card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  background-color: var(--card);
  border: var(--stroke-hairline) solid var(--border);
  border-radius: var(--radius-lg);
}
.l-navbar-mega__card-media {
  width: 100%;
  height: 10em;
}
.l-navbar-mega__card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.l-navbar-mega__card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-5);
}
/* ---- Movil (<=991px, borde tablet de scaling.css; el behavior usa el mismo corte) ---- */
@media (max-width: 991px) {
  .l-navbar-mega {
    top: 0;
    width: 100%;
    max-width: none;
    margin-block-start: 0;
  }
  .l-navbar-mega__bar {
    border-radius: 0;
    border-inline: 0;
    border-top: 0;
  }
  .l-navbar-mega__inner {
    position: fixed;
    inset: var(--l-nm-bar) 0 0 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    gap: var(--spacing-8);
    padding: var(--spacing-8) var(--spacing-6);
    background-color: var(--background);
    overflow: auto;
    opacity: 0;
    visibility: hidden;
  }
  /* Helper de Designer: forzar la lista movil visible para maquetar */
  .l-navbar-mega__inner[data-mobile-nav="active"] {
    opacity: 1;
    visibility: visible;
  }
  .l-navbar-mega__list {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-5);
  }
  .l-navbar-mega__list-item--cta {
    margin-inline-start: 0;
    margin-block-start: var(--spacing-5);
  }
  .l-navbar-mega__burger {
    /* flex = display propio del atomo burger-icon; con block sus lineas colapsan a 0x0 */
    display: flex;
  }
  .l-navbar-mega__drop {
    position: fixed;
    inset: var(--l-nm-bar) 0 0 0;
    z-index: 4;
  }
  /* Movil: el drop vuelve a ser full-screen; el behavior limpia el width/x
     inline que puso en desktop. */
  .l-navbar-mega__drop-clip {
    position: static;
    width: auto;
    height: 100%;
    overflow: auto;
  }
  .l-navbar-mega__drop-bg {
    display: none;
  }
  .l-navbar-mega__panel {
    inset: 0;
    width: auto;
    background-color: var(--background);
    overflow: auto;
  }
  .l-navbar-mega__col {
    max-width: none;
  }
  .l-navbar-mega__panel-row {
    flex-direction: column;
  }
  .l-navbar-mega__col {
    border-right: 0;
    border-bottom: var(--stroke-hairline) solid var(--border);
    padding: var(--spacing-6) var(--spacing-4);
  }
}`,
};
