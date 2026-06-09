/**
 * Layout: pricing-tiers
 *
 * 2-4 planes en cards verticales: nombre, precio, features, CTA. Plan destacado opcional.
 * Structure-only. References DS components by BEM class.
 */

export const pricingTiers = {
  slug: 'pricing-tiers',
  name: 'Pricing Tiers',
  description:
    '2-4 planes en cards verticales: nombre, precio, features, CTA. Plan destacado opcional. Structure only.',
  components: ['button', 'badge', 'divider', 'typography', 'item'],
  html: `<!-- Layout: pricing-tiers -->
<section class="l-pricing-tiers">
  <div class="l-pricing-tiers__header">
    <h2 class="l-pricing-tiers__headline">{{headline}}</h2>
    <p class="l-pricing-tiers__subtitle">{{subtitle}}</p>
  </div>
  <div class="l-pricing-tiers__grid">
    <!-- Tier 1 -->
    <div class="l-pricing-tiers__card {{tier1_highlight === 'featured' ? 'l-pricing-tiers__card--featured' : ''}}">
      <div class="l-pricing-tiers__card-header">
        <h3 class="l-pricing-tiers__tier-name">{{tier1_name}}</h3>
        <div class="l-pricing-tiers__price">
          <span class="l-pricing-tiers__price-value">{{tier1_price}}</span>
          <span class="l-pricing-tiers__price-period">{{tier1_period}}</span>
        </div>
        <p class="l-pricing-tiers__tier-desc">{{tier1_description}}</p>
      </div>
      <div class="l-pricing-tiers__features">
        <div class="item">{{tier1_feature1}}</div>
        <div class="item">{{tier1_feature2}}</div>
        <div class="item">{{tier1_feature3}}</div>
        <div class="item">{{tier1_feature4}}</div>
      </div>
      <div class="l-pricing-tiers__cta">
        <a href="#" class="button button--primary button--m">
          <span class="button__label">{{tier1_ctaLabel}}</span>
        </a>
      </div>
    </div>
    <!-- Tier 2 (middle, often featured) -->
    <div class="l-pricing-tiers__card l-pricing-tiers__card--featured">
      <div class="l-pricing-tiers__card-header">
        <div class="badge badge--brand">Más popular</div>
        <h3 class="l-pricing-tiers__tier-name">{{tier2_name}}</h3>
        <div class="l-pricing-tiers__price">
          <span class="l-pricing-tiers__price-value">{{tier2_price}}</span>
          <span class="l-pricing-tiers__price-period">{{tier2_period}}</span>
        </div>
        <p class="l-pricing-tiers__tier-desc">{{tier2_description}}</p>
      </div>
      <div class="l-pricing-tiers__features">
        <div class="item">{{tier2_feature1}}</div>
        <div class="item">{{tier2_feature2}}</div>
        <div class="item">{{tier2_feature3}}</div>
        <div class="item">{{tier2_feature4}}</div>
      </div>
      <div class="l-pricing-tiers__cta">
        <a href="#" class="button button--primary button--m">
          <span class="button__label">{{tier2_ctaLabel}}</span>
        </a>
      </div>
    </div>
    <!-- Tier 3 -->
    <div class="l-pricing-tiers__card">
      <div class="l-pricing-tiers__card-header">
        <h3 class="l-pricing-tiers__tier-name">{{tier3_name}}</h3>
        <div class="l-pricing-tiers__price">
          <span class="l-pricing-tiers__price-value">{{tier3_price}}</span>
          <span class="l-pricing-tiers__price-period">{{tier3_period}}</span>
        </div>
        <p class="l-pricing-tiers__tier-desc">{{tier3_description}}</p>
      </div>
      <div class="l-pricing-tiers__features">
        <div class="item">{{tier3_feature1}}</div>
        <div class="item">{{tier3_feature2}}</div>
        <div class="item">{{tier3_feature3}}</div>
        <div class="item">{{tier3_feature4}}</div>
      </div>
      <div class="l-pricing-tiers__cta">
        <a href="#" class="button button--primary button--m">
          <span class="button__label">{{tier3_ctaLabel}}</span>
        </a>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: pricing-tiers — structure only */
.l-pricing-tiers {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
}
.l-pricing-tiers__header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}
.l-pricing-tiers__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
  align-items: start;
}
@media (max-width: 900px) {
  .l-pricing-tiers__grid {
    grid-template-columns: 1fr;
  }
}
.l-pricing-tiers__card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  background: var(--background);
}
.l-pricing-tiers__card--featured {
  border-color: var(--accent);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transform: scale(1.02);
}
.l-pricing-tiers__card-header {
  text-align: center;
  margin-bottom: var(--spacing-4);
}
.l-pricing-tiers__tier-name {
  font-size: var(--text-xl);
  font-weight: 600;
}
.l-pricing-tiers__price {
  margin: var(--spacing-2) 0;
}
.l-pricing-tiers__price-value {
  font-size: var(--text-3xl);
  font-weight: 700;
}
.l-pricing-tiers__features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin: var(--spacing-4) 0;
  flex: 1;
}
.l-pricing-tiers__cta {
  margin-top: auto;
  text-align: center;
}`,
};