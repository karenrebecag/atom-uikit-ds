/**
 * Layout: feature-icon-list
 *
 * Lista compacta de features en 2 columnas, icono + texto. Densidad alta, para paginas de producto.
 * Structure-only. References DS components by BEM class.
 */

export const featureIconList = {
  slug: 'feature-icon-list',
  name: 'Feature Icon List',
  description:
    'Lista compacta de features en 2 columnas, icono + texto. Densidad alta, para paginas de producto. Structure only.',
  components: ['item', 'typography'],
  html: `<!-- Layout: feature-icon-list -->
<section class="l-feature-icon-list">
  <div class="l-feature-icon-list__header">
    <h2 class="l-feature-icon-list__headline">{{headline}}</h2>
  </div>
  <div class="l-feature-icon-list__grid">
    <div class="l-feature-icon-list__item">
      <div class="l-feature-icon-list__icon"><!-- icon placeholder --></div>
      <h3 class="l-feature-icon-list__title">{{item1_title}}</h3>
      <p class="l-feature-icon-list__body">{{item1_body}}</p>
    </div>
    <div class="l-feature-icon-list__item">
      <div class="l-feature-icon-list__icon"><!-- icon placeholder --></div>
      <h3 class="l-feature-icon-list__title">{{item2_title}}</h3>
      <p class="l-feature-icon-list__body">{{item2_body}}</p>
    </div>
    <div class="l-feature-icon-list__item">
      <div class="l-feature-icon-list__icon"><!-- icon placeholder --></div>
      <h3 class="l-feature-icon-list__title">{{item3_title}}</h3>
      <p class="l-feature-icon-list__body">{{item3_body}}</p>
    </div>
    <div class="l-feature-icon-list__item">
      <div class="l-feature-icon-list__icon"><!-- icon placeholder --></div>
      <h3 class="l-feature-icon-list__title">{{item4_title}}</h3>
      <p class="l-feature-icon-list__body">{{item4_body}}</p>
    </div>
  </div>
</section>`,
  css: `/* Layout: feature-icon-list — structure only */
.l-feature-icon-list {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-feature-icon-list__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-feature-icon-list__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}
@media (max-width: 600px) {
  .l-feature-icon-list__grid {
    grid-template-columns: 1fr;
  }
}
.l-feature-icon-list__item {
  display: flex;
  gap: var(--spacing-3);
}
.l-feature-icon-list__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: var(--muted);
  border-radius: 50%;
}
.l-feature-icon-list__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin: 0;
}
.l-feature-icon-list__body {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
  margin: 0;
}`,
};