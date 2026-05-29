/**
 * Layout: feature-grid
 *
 * Section heading + 3-column grid of feature cards.
 * Structure-only. References DS components by BEM class.
 */

export const featureGrid = {
  slug: 'feature-grid',
  name: 'Feature Grid',
  description:
    'Section heading + 3-column grid of feature cards with icon, title, description. Collapses to 1 column on mobile. Structure only.',
  components: ['badge'],
  html: `<!-- Layout: feature-grid -->
<section class="l-feature-grid">
  <div class="l-feature-grid__header">
    <span class="badge badge--filled badge--brand badge--s">{{eyebrow}}</span>
    <h2 class="l-feature-grid__heading">{{heading}}</h2>
    <p class="l-feature-grid__body">{{body}}</p>
  </div>
  <div class="l-feature-grid__grid">
    <div class="l-feature-grid__card">
      <div class="l-feature-grid__icon"><!-- SVG icon --></div>
      <h3 class="l-feature-grid__card-title">{{feature_1_title}}</h3>
      <p class="l-feature-grid__card-body">{{feature_1_body}}</p>
    </div>
    <div class="l-feature-grid__card">
      <div class="l-feature-grid__icon"><!-- SVG icon --></div>
      <h3 class="l-feature-grid__card-title">{{feature_2_title}}</h3>
      <p class="l-feature-grid__card-body">{{feature_2_body}}</p>
    </div>
    <div class="l-feature-grid__card">
      <div class="l-feature-grid__icon"><!-- SVG icon --></div>
      <h3 class="l-feature-grid__card-title">{{feature_3_title}}</h3>
      <p class="l-feature-grid__card-body">{{feature_3_body}}</p>
    </div>
  </div>
</section>`,

  css: `/* Layout: feature-grid — structure only */
.l-feature-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  padding: var(--spacing-20) var(--spacing-8);
}
.l-feature-grid__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-3);
}
.l-feature-grid__heading { max-width: 560px; }
.l-feature-grid__body { max-width: 480px; }
.l-feature-grid__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
}
@media (max-width: 768px) {
  .l-feature-grid__grid { grid-template-columns: 1fr; }
}
.l-feature-grid__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}
.l-feature-grid__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
};
