/**
 * Layout: navbar-banner
 *
 * Navbar simple con barra de anuncio encima (lanzamiento, promo, evento).
 * Structure-only. References DS components by BEM class.
 */

export const navbarBanner = {
  slug: 'navbar-banner',
  name: 'Navbar con announcement',
  description:
    'Navbar simple con barra de anuncio encima (lanzamiento, promo, evento). Structure only.',
  components: ['nav-link', 'button', 'burger-icon', 'tag', 'image'],
  html: `<!-- Layout: navbar-banner -->
<div class="l-navbar-banner__announcement">
  <a href="{{announcementUrl}}">{{announcement}}</a>
</div>
<nav class="l-navbar-banner">
  <div class="l-navbar-banner__logo">
    <img src="{{logo}}" alt="Logo" class="image" />
  </div>
  <div class="l-navbar-banner__links">
    <a href="{{link1_url}}" class="nav-link">{{link1_label}}</a>
    <a href="{{link2_url}}" class="nav-link">{{link2_label}}</a>
    <a href="{{link3_url}}" class="nav-link">{{link3_label}}</a>
  </div>
  <div class="l-navbar-banner__cta">
    <a href="{{cta_url}}" class="button button--primary button--m">
      <span class="button__label">{{cta}}</span>
    </a>
  </div>
  <button class="l-navbar-banner__burger burger-icon" data-menu-button="burger" aria-label="Menu" aria-expanded="false">
    <span class="burger-icon__line"></span>
    <span class="burger-icon__line"></span>
    <span class="burger-icon__line"></span>
  </button>
</nav>`,
  css: `/* Layout: navbar-banner — structure only */
.l-navbar-banner__announcement {
  background: var(--muted);
  text-align: center;
  padding: 4px;
  font-size: var(--text-sm);
}
.l-navbar-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-8);
  border-bottom: 1px solid var(--border);
}
.l-navbar-banner__logo {
  flex-shrink: 0;
}
.l-navbar-banner__links {
  display: flex;
  gap: var(--spacing-6);
  align-items: center;
}
.l-navbar-banner__cta {
  flex-shrink: 0;
}
.l-navbar-banner__burger {
  display: none;
}
@media (max-width: 768px) {
  .l-navbar-banner__links,
  .l-navbar-banner__cta {
    display: none;
  }
  .l-navbar-banner__burger {
    display: block;
  }
}`,
};