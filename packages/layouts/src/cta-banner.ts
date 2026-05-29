/**
 * Layout: cta-banner
 *
 * Compact horizontal CTA strip: heading left, buttons right.
 * Structure-only. References DS components by BEM class.
 */

export const ctaBanner = {
  slug: 'cta-banner',
  name: 'CTA Banner',
  description:
    'Compact horizontal banner: heading + body left, CTA buttons right. Collapses to stacked on mobile. Structure only.',
  components: ['button'],
  html: `<!-- Layout: cta-banner -->
<section class="l-cta-banner">
  <div class="l-cta-banner__content">
    <h2 class="l-cta-banner__heading">{{heading}}</h2>
    <p class="l-cta-banner__body">{{body}}</p>
  </div>
  <div class="l-cta-banner__actions">
    <a href="{{cta_primary_href}}" class="button button--primary button--l">
      <span class="button__label">{{cta_primary}}</span>
    </a>
    <a href="{{cta_secondary_href}}" class="button button--secondary button--m">
      <span class="button__label">{{cta_secondary}}</span>
    </a>
  </div>
</section>`,

  css: `/* Layout: cta-banner — structure only */
.l-cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-8);
  padding: var(--spacing-10) var(--spacing-8);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}
@media (max-width: 640px) {
  .l-cta-banner {
    flex-direction: column;
    text-align: center;
  }
}
.l-cta-banner__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  max-width: 480px;
}
.l-cta-banner__actions {
  display: flex;
  gap: var(--spacing-3);
  flex-shrink: 0;
  flex-wrap: wrap;
}`,
};
