/**
 * Layout: navbar-simple
 *
 * Barra de navegacion: logo izquierda, links centro, CTA derecha. Colapsa a burger en mobile.
 * Structure-only. References DS components by BEM class.
 * Slots from catalog: logo (image), links (item-list max6: label, url), cta.
 */

export const navbarSimple = {
  slug: 'navbar-simple',
  name: 'Navbar Simple',
  description:
    'Barra de navegacion: logo izquierda, links centro, CTA derecha. Colapsa a burger en mobile. Structure only.',
  components: ['nav-link', 'button', 'burger-icon', 'image'],
  html: `<!-- Layout: navbar-simple -->
<nav class="l-navbar-simple">
  <div class="l-navbar-simple__logo">
    <img src="{{logo}}" alt="Logo" class="image" />
  </div>
  <div class="l-navbar-simple__links">
    <a href="{{link1_url}}" class="nav-link">{{link1_label}}</a>
    <a href="{{link2_url}}" class="nav-link">{{link2_label}}</a>
    <a href="{{link3_url}}" class="nav-link">{{link3_label}}</a>
    <a href="{{link4_url}}" class="nav-link">{{link4_label}}</a>
  </div>
  <div class="l-navbar-simple__cta">
    <a href="{{cta_url}}" class="button button--primary button--m">
      <span class="button__label">{{cta}}</span>
    </a>
  </div>
  <button class="l-navbar-simple__burger burger-icon" aria-label="Menu">
    <span class="burger-icon__bar"></span>
    <span class="burger-icon__bar"></span>
    <span class="burger-icon__bar"></span>
  </button>
</nav>`,
  css: `/* Layout: navbar-simple — structure only */
.l-navbar-simple {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-8);
  border-bottom: 1px solid var(--border);
}
.l-navbar-simple__logo {
  flex-shrink: 0;
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
}
@media (max-width: 768px) {
  .l-navbar-simple__links,
  .l-navbar-simple__cta {
    display: none;
  }
  .l-navbar-simple__burger {
    display: block;
  }
}`,
};