/**
 * Layout: navbar-simple
 *
 * Barra de navegacion: logo izquierda, links centro, CTA derecha. Colapsa a burger en mobile.
 * Structure-only. References DS components by BEM class.
 * Contrato de edicion (decision de Karen 2026-07-30):
 *   EDITABLE  -> los nav links: lista repetible via data-repeat (0..N), cada
 *                uno con {{link_label}} + {{link_url}}.
 *   FIJO      -> el logo (assets oficiales R2, literales) y el CTA de demo.
 *                Sin slot = no editable: el consumidor no puede tocarlos.
 *   Sin links -> sin burger ni panel (reglas :has en el css): la barra queda
 *                logo + CTA, y el CTA permanece visible en movil.
 * Dropdowns: son composicion de codigo (nav-link--dropdown + dropdown-menu),
 * no viajan en este layout — data-repeat no anida.
 */

export const navbarSimple = {
  slug: 'navbar-simple',
  name: 'Navbar Simple',
  description:
    'Barra de navegacion: logo izquierda, links centro, CTA derecha. Colapsa a burger en mobile. Structure only.',
  components: ['logo', 'nav-link', 'button', 'burger-icon'],
  html: `<!-- Layout: navbar-simple -->
<nav class="l-navbar-simple">
  <div class="l-navbar-simple__logo">
    <!-- Logo atom: dual light/dark, voltea con data-theme. URLs oficiales en
         packages/css/src/components/atoms/logo.css -->
    <!-- LOGO FIJO: assets oficiales, sin slots a proposito -->
    <a class="logo logo--m" href="https://atomchat.io" aria-label="Atom">
      <img class="logo__light" src="https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-light.svg" alt="Atom" />
      <img class="logo__dark" src="https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-dark.svg" alt="Atom" />
    </a>
  </div>
  <nav class="l-navbar-simple__links" aria-label="Principal" data-repeat="nav_link">
    <a href="{{link_url}}" class="nav-link nav-link--lg"><span class="nav-link__text">{{link_label}}</span></a>
  </nav>
  <div class="l-navbar-simple__cta">
    <!-- CTA FIJO de marca: sin slots a proposito -->
    <a href="https://atomchat.io/demo" class="button button--primary button--m">
      <span class="button__label">Agendar demo</span>
    </a>
  </div>
  <button class="l-navbar-simple__burger burger-icon" data-menu-button="burger" aria-label="Menu" aria-expanded="false" aria-controls="atom-nav-panel">
    <span class="burger-icon__line"></span>
    <span class="burger-icon__line"></span>
    <span class="burger-icon__line"></span>
  </button>
</nav>
<!-- Panel movil: hermano del nav (BEM nombra, no exige arbol). El toggle es el
     nivel 0 del contrato de motion: cambiar data-menu-button a "close" anima
     burger a X via CSS del DS, y quitar [hidden] muestra el panel. -->
<div class="l-navbar-simple__panel" id="atom-nav-panel" hidden>
  <nav class="l-navbar-simple__panel-links" aria-label="Principal" data-repeat="panel_link">
    <a href="{{link_url}}" class="nav-link l-navbar-simple__panel-link"><span class="nav-link__text">{{link_label}}</span></a>
  </nav>
  <a href="https://atomchat.io/demo" class="button button--primary button--m l-navbar-simple__panel-cta">
    <span class="button__label">Agendar demo</span>
  </a>
</div>`,
  css: `/* Layout: navbar-simple — structure only.
   Pildora flotante citada del nav-bar de OSMO: barra centrada sobre el
   contenido con radio 0.375em, contorno hairline translucido (su
   nav-bar__outline) y controles de 2.5em con padding 0.4375em. sticky, no
   fixed (fixed se rompe dentro de hosts con transform en un ancestro). El
   hide/show en scroll es el behavior nav-autohide, opt-in via
   data-nav-autohide — este css NO anima (ley: layouts sin motion). */
.l-navbar-simple {
  position: sticky;
  top: var(--spacing-5);
  /* offset natural en reposo (sticky top solo actua al scrollear) */
  margin-block-start: var(--spacing-5);
  z-index: var(--z-index-30);
  width: calc(100% - 2 * var(--container-padding));
  max-width: var(--size-container-content);
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: 0.4375em;
  background-color: var(--background);
  border: var(--stroke-hairline) solid var(--border);
  border-radius: 0.375em;
}
.l-navbar-simple__logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 2.5em;
  /* aire lateral del nav-logo de OSMO */
  padding-inline: 0.5em;
}
.l-navbar-simple__links {
  display: flex;
  gap: var(--spacing-6);
  align-items: center;
}
.l-navbar-simple__cta {
  flex-shrink: 0;
}
.l-navbar-simple__burger {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  padding: var(--spacing-2);
  background: none;
  border: 0;
  color: var(--foreground);
  cursor: pointer;
}
.l-navbar-simple__panel {
  /* mismo tratamiento de pildora; separado 0.375em (gap del nav-bar__width OSMO) */
  width: calc(100% - 2 * var(--container-padding));
  max-width: var(--size-container-content);
  margin-inline: auto;
  margin-block-start: 0.375em;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-8);
  background-color: var(--background);
  border: var(--stroke-hairline) solid var(--border);
  border-radius: 0.375em;
}
.l-navbar-simple__panel-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}
.l-navbar-simple__panel[hidden] {
  display: none;
}
/* Sin nav links no hay menu que colapsar: fuera burger y panel, y el CTA
   (fijo) permanece visible tambien en movil. */
.l-navbar-simple:not(:has(.l-navbar-simple__links .nav-link)) .l-navbar-simple__burger {
  display: none;
}
.l-navbar-simple__panel:not(:has(.nav-link)) {
  display: none;
}
.l-navbar-simple__panel-cta {
  align-self: start;
  margin-block-start: var(--spacing-2);
}
@media (max-width: 768px) {
  .l-navbar-simple__links,
  .l-navbar-simple__cta {
    display: none;
  }
  .l-navbar-simple:not(:has(.l-navbar-simple__links .nav-link)) .l-navbar-simple__cta {
    display: flex;
  }
  .l-navbar-simple__burger {
    /* flex, no block: es el display del atomo burger-icon — con block sus
       lineas (spans) pierden el contexto flex y colapsan a 0x0. Un layout
       muestra/oculta componentes; no les cambia el display propio. */
    display: flex;
  }
}
@media (min-width: 769px) {
  .l-navbar-simple__panel {
    display: none !important;
  }
}`,
};