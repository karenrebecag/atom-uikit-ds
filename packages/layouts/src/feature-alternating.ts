/**
 * Layout: feature-alternating
 *
 * Bloques imagen + texto alternando lados. Para explicar 2-4 capacidades en profundidad.
 * Structure-only. References DS components by BEM class.
 */

export const featureAlternating = {
  slug: 'feature-alternating',
  name: 'Features Alternados',
  description:
    'Bloques imagen + texto alternando lados. Para explicar 2-4 capacidades en profundidad. Structure only.',
  components: ['chip', 'button', 'typography', 'image'],
  html: `<!-- Layout: feature-alternating -->
<section class="l-feature-alternating">
  <div class="l-feature-alternating__header">
    <h2 class="l-feature-alternating__headline">{{headline}}</h2>
  </div>
  <div class="l-feature-alternating__block">
    <div class="l-feature-alternating__content">
      <span class="chip chip--outlined chip--s">{{block1_eyebrow}}</span>
      <h3 class="l-feature-alternating__title">{{block1_title}}</h3>
      <p class="l-feature-alternating__body">{{block1_body}}</p>
      <a href="#" class="link-button">{{block1_ctaLabel}}</a>
    </div>
    <div class="l-feature-alternating__media">
      <img src="{{block1_image}}" alt="" class="image" />
    </div>
  </div>
  <div class="l-feature-alternating__block l-feature-alternating__block--reverse">
    <div class="l-feature-alternating__content">
      <span class="chip chip--outlined chip--s">{{block2_eyebrow}}</span>
      <h3 class="l-feature-alternating__title">{{block2_title}}</h3>
      <p class="l-feature-alternating__body">{{block2_body}}</p>
      <a href="#" class="link-button">{{block2_ctaLabel}}</a>
    </div>
    <div class="l-feature-alternating__media">
      <img src="{{block2_image}}" alt="" class="image" />
    </div>
  </div>
</section>`,
  css: `/* Layout: feature-alternating — structure only */
.l-feature-alternating {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-feature-alternating__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-feature-alternating__block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-8);
  align-items: center;
  margin-bottom: var(--spacing-8);
}
@media (max-width: 768px) {
  .l-feature-alternating__block {
    grid-template-columns: 1fr;
  }
}
.l-feature-alternating__block--reverse {
  direction: rtl;
}
.l-feature-alternating__block--reverse > * {
  direction: ltr;
}
.l-feature-alternating__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}
.l-feature-alternating__title {
  font-size: var(--text-2xl);
}
.l-feature-alternating__body {
  color: var(--muted-foreground);
}
.l-feature-alternating__media img {
  width: 100%;
  border-radius: var(--radius-lg);
}`,
};