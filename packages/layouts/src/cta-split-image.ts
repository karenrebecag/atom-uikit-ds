/**
 * Layout: cta-split-image
 *
 * CTA de dos columnas: titular + CTAs izquierda, imagen derecha. Mas calido que el banner.
 * Structure-only. References DS components by BEM class.
 */

export const ctaSplitImage = {
  slug: 'cta-split-image',
  name: 'CTA Split con Imagen',
  description:
    'CTA de dos columnas: titular + CTAs izquierda, imagen derecha. Mas calido que el banner. Structure only.',
  components: ['button', 'typography', 'image'],
  html: `<!-- Layout: cta-split-image -->
<section class="l-cta-split-image">
  <div class="l-cta-split-image__content">
    <h2 class="l-cta-split-image__headline">{{headline}}</h2>
    <p class="l-cta-split-image__subtitle">{{subtitle}}</p>
    <div class="l-cta-split-image__actions">
      <a href="#" class="button button--primary button--l">
        <span class="button__label">{{primaryCta}}</span>
      </a>
      <a href="#" class="button button--secondary button--m">
        <span class="button__label">{{secondaryCta}}</span>
      </a>
    </div>
  </div>
  <div class="l-cta-split-image__media">
    <img src="{{media}}" alt="" class="image" />
  </div>
</section>`,
  css: `/* Layout: cta-split-image — structure only */
.l-cta-split-image {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
  align-items: center;
}
@media (max-width: 768px) {
  .l-cta-split-image {
    grid-template-columns: 1fr;
  }
}
.l-cta-split-image__headline {
  font-size: var(--text-2xl);
}
.l-cta-split-image__subtitle {
  color: var(--muted-foreground);
}
.l-cta-split-image__actions {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}
.l-cta-split-image__media img {
  width: 100%;
  border-radius: var(--radius-lg);
}`,
};