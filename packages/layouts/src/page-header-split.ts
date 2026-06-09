/**
 * Layout: page-header-split
 *
 * Cabecera interior en dos columnas: titulo grande izquierda, descripcion derecha.
 * Structure-only. References DS components by BEM class.
 */

export const pageHeaderSplit = {
  slug: 'page-header-split',
  name: 'Page Header Split',
  description:
    'Cabecera interior en dos columnas: titulo grande izquierda, descripcion derecha. Structure only.',
  components: ['breadcrumb', 'typography'],
  html: `<!-- Layout: page-header-split -->
<header class="l-page-header-split">
  <div class="l-page-header-split__left">
    <nav class="breadcrumb">
      <a href="{{breadcrumb1_url}}" class="nav-link">{{breadcrumb1_label}}</a>
      <span>/</span>
      <a href="{{breadcrumb2_url}}" class="nav-link">{{breadcrumb2_label}}</a>
    </nav>
    <h1 class="l-page-header-split__headline">{{headline}}</h1>
  </div>
  <div class="l-page-header-split__right">
    <p class="l-page-header-split__description">{{description}}</p>
  </div>
</header>`,
  css: `/* Layout: page-header-split — structure only */
.l-page-header-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
  max-width: 960px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .l-page-header-split {
    grid-template-columns: 1fr;
  }
}
.l-page-header-split__left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
.l-page-header-split__headline {
  font-size: var(--text-4xl);
}
.l-page-header-split__right {
  display: flex;
  align-items: center;
}`,
};