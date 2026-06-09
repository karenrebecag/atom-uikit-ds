/**
 * Layout: page-header-centered
 *
 * Cabecera de pagina interior: breadcrumb + titulo + descripcion, centrado. Para blog, docs, pricing.
 * Structure-only. References DS components by BEM class.
 */

export const pageHeaderCentered = {
  slug: 'page-header-centered',
  name: 'Page Header Centered',
  description:
    'Cabecera de pagina interior: breadcrumb + titulo + descripcion, centrado. Para blog, docs, pricing. Structure only.',
  components: ['breadcrumb', 'typography', 'tag'],
  html: `<!-- Layout: page-header-centered -->
<header class="l-page-header-centered">
  <nav class="breadcrumb">
    <a href="{{breadcrumb1_url}}" class="nav-link">{{breadcrumb1_label}}</a>
    <span>/</span>
    <a href="{{breadcrumb2_url}}" class="nav-link">{{breadcrumb2_label}}</a>
  </nav>
  <span class="tag tag--s">{{eyebrow}}</span>
  <h1 class="l-page-header-centered__headline">{{headline}}</h1>
  <p class="l-page-header-centered__description">{{description}}</p>
</header>`,
  css: `/* Layout: page-header-centered — structure only */
.l-page-header-centered {
  text-align: center;
  padding: var(--spacing-12) var(--spacing-8);
  max-width: 720px;
  margin: 0 auto;
}
.l-page-header-centered__headline {
  font-size: var(--text-4xl);
  margin: var(--spacing-4) 0;
}
.l-page-header-centered__description {
  max-width: 520px;
  margin: 0 auto;
}`,
};