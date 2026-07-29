/**
 * Layout: navbar-dropdown
 *
 * Navbar con menus desplegables por grupo (Producto, Recursos...). Para sitios con muchas paginas.
 * Structure-only. References DS components by BEM class.
 */

export const navbarDropdown = {
  slug: 'navbar-dropdown',
  name: 'Navbar con dropdowns',
  description:
    'Navbar con menus desplegables por grupo (Producto, Recursos...). Para sitios con muchas paginas. Structure only.',
  components: ['nav-link', 'dropdown-menu', 'menu-button', 'button', 'burger-icon', 'image'],
  html: `<!-- Layout: navbar-dropdown -->
<nav class="l-navbar-dropdown">
  <div class="l-navbar-dropdown__logo">
    <img src="{{logo}}" alt="Logo" class="image" />
  </div>
  <div class="l-navbar-dropdown__menu">
    <div class="dropdown-menu">
      <button class="menu-button">Producto</button>
      <div class="dropdown-menu__content">
        <a href="{{link1_url}}" class="nav-link">{{link1_label}}</a>
        <a href="{{link2_url}}" class="nav-link">{{link2_label}}</a>
      </div>
    </div>
    <a href="{{link3_url}}" class="nav-link">{{link3_label}}</a>
    <div class="dropdown-menu">
      <button class="menu-button">Recursos</button>
      <div class="dropdown-menu__content">
        <a href="{{link4_url}}" class="nav-link">{{link4_label}}</a>
      </div>
    </div>
  </div>
  <div class="l-navbar-dropdown__cta">
    <a href="{{cta_url}}" class="button button--primary button--m">
      <span class="button__label">{{cta}}</span>
    </a>
  </div>
  <button class="l-navbar-dropdown__burger burger-icon" data-menu-button="burger" aria-label="Menu" aria-expanded="false">
    <span class="burger-icon__line"></span>
    <span class="burger-icon__line"></span>
    <span class="burger-icon__line"></span>
  </button>
</nav>`,
  css: `/* Layout: navbar-dropdown — structure only */
.l-navbar-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-8);
  border-bottom: 1px solid var(--border);
}
.l-navbar-dropdown__logo {
  flex-shrink: 0;
}
.l-navbar-dropdown__menu {
  display: flex;
  gap: var(--spacing-6);
  align-items: center;
}
.l-navbar-dropdown__cta {
  flex-shrink: 0;
}
.l-navbar-dropdown__burger {
  display: none;
}
@media (max-width: 768px) {
  .l-navbar-dropdown__menu,
  .l-navbar-dropdown__cta {
    display: none;
  }
  .l-navbar-dropdown__burger {
    display: block;
  }
}`,
};