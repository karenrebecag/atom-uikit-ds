/**
 * Layout: comparison-table
 *
 * Tabla de comparación de 3 productos: encabezado con iconos/nombres/descripciones, filas de features con valores o iconos check/x, filas alternadas, botones al final.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/comparison-table).
 */

export const comparisonTable = {
  slug: 'comparison-table',
  name: 'Tabla de comparación',
  description:
    'Comparación de productos con grid de 3 columnas, encabezado de productos, filas de features con valores/checks, y CTAs. Structure only.',
  components: ['button', 'typography', 'image'],
  html: `<!-- Layout: comparison-table -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-comparison-table" id="{{section_id}}">
  <div class="l-comparison-table__header">
    <p class="l-comparison-table__tagline">{{tagline}}</p>
    <h1 class="l-comparison-table__heading">{{heading}}</h1>
    <p class="l-comparison-table__description">{{description}}</p>
  </div>

  <div class="l-comparison-table__products">
    <div class="l-comparison-table__product-label">
      <h2 class="l-comparison-table__product-label-text">{{product_label}}</h2>
    </div>
    <div class="l-comparison-table__product">
      <img src="{{prod1_icon}}" alt="{{prod1_icon_alt}}" class="l-comparison-table__product-icon" />
      <h3 class="l-comparison-table__product-name">{{prod1_name}}</h3>
      <p class="l-comparison-table__product-desc">{{prod1_desc}}</p>
    </div>
    <div class="l-comparison-table__product">
      <img src="{{prod2_icon}}" alt="{{prod2_icon_alt}}" class="l-comparison-table__product-icon" />
      <h3 class="l-comparison-table__product-name">{{prod2_name}}</h3>
      <p class="l-comparison-table__product-desc">{{prod2_desc}}</p>
    </div>
    <div class="l-comparison-table__product">
      <img src="{{prod3_icon}}" alt="{{prod3_icon_alt}}" class="l-comparison-table__product-icon" />
      <h3 class="l-comparison-table__product-name">{{prod3_name}}</h3>
      <p class="l-comparison-table__product-desc">{{prod3_desc}}</p>
    </div>
  </div>

  <div class="l-comparison-table__features">
    <!-- Feature row 1 (text values) -->
    <div class="l-comparison-table__row l-comparison-table__row--alt">
      <p class="l-comparison-table__feature-label">{{feature1_label}}</p>
      <div class="l-comparison-table__feature-value"><span>{{feature1_val1}}</span></div>
      <div class="l-comparison-table__feature-value"><span>{{feature1_val2}}</span></div>
      <div class="l-comparison-table__feature-value"><span>{{feature1_val3}}</span></div>
    </div>

    <!-- Feature row 2 (checks) -->
    <div class="l-comparison-table__row">
      <p class="l-comparison-table__feature-label">{{feature2_label}}</p>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
    </div>

    <!-- Feature row 3 -->
    <div class="l-comparison-table__row l-comparison-table__row--alt">
      <p class="l-comparison-table__feature-label">{{feature3_label}}</p>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
    </div>

    <!-- Feature row 4 (mixed) -->
    <div class="l-comparison-table__row">
      <p class="l-comparison-table__feature-label">{{feature4_label}}</p>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__x" fill="currentColor"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
      </div>
    </div>

    <!-- Feature row 5 (mixed) -->
    <div class="l-comparison-table__row l-comparison-table__row--alt">
      <p class="l-comparison-table__feature-label">{{feature5_label}}</p>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__check" fill="currentColor"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__x" fill="currentColor"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
      </div>
      <div class="l-comparison-table__feature-value">
        <svg viewBox="0 0 24 24" class="l-comparison-table__x" fill="currentColor"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
      </div>
    </div>
  </div>

  <div class="l-comparison-table__actions">
    <a href="{{cta_primary_href}}" class="button button--secondary">
      <span class="button__label">{{cta_primary}}</span>
    </a>
    <a href="{{cta_secondary_href}}" class="link-button">
      {{cta_secondary}}
      <span class="link-button__icon">→</span>
    </a>
  </div>
</section>`,
  css: `/* Layout: comparison-table — structure only, pure DS tokens */
.l-comparison-table {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-comparison-table__header {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: var(--spacing-12);
}

@media (min-width: 768px) {
  .l-comparison-table__header {
    margin-bottom: var(--spacing-18);
  }
}

@media (min-width: 1024px) {
  .l-comparison-table__header {
    margin-bottom: var(--spacing-20);
  }
}

.l-comparison-table__tagline {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--muted-foreground);
  margin-bottom: var(--spacing-3);
}

.l-comparison-table__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
  margin-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-comparison-table__heading {
    font-size: var(--font-size-5xl);
    line-height: var(--line-height-5xl);
    margin-bottom: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .l-comparison-table__heading {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-6xl);
  }
}

.l-comparison-table__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .l-comparison-table__description {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-lg);
  }
}

.l-comparison-table__products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: var(--spacing-4);
}

@media (min-width: 768px) {
  .l-comparison-table__products {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }
}

.l-comparison-table__product-label {
  display: none;
}

@media (min-width: 768px) {
  .l-comparison-table__product-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: var(--spacing-4) var(--spacing-4) var(--spacing-4) 0;
  }
}

.l-comparison-table__product-label-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
}

@media (min-width: 768px) {
  .l-comparison-table__product-label-text {
    font-size: var(--font-size-xl);
  }
}

.l-comparison-table__product {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-4) var(--spacing-2);
}

@media (min-width: 768px) {
  .l-comparison-table__product {
    padding: var(--spacing-4) var(--spacing-4);
  }
}

@media (min-width: 1024px) {
  .l-comparison-table__product {
    padding: var(--spacing-6);
  }
}

.l-comparison-table__product-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: var(--spacing-2);
}

.l-comparison-table__product-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
  margin-bottom: var(--spacing-1);
}

@media (min-width: 768px) {
  .l-comparison-table__product-name {
    font-size: var(--font-size-xl);
  }
}

.l-comparison-table__product-desc {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
}

.l-comparison-table__features {
  /* rows below */
}

.l-comparison-table__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
}

@media (min-width: 768px) {
  .l-comparison-table__row {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }
}

.l-comparison-table__row--alt {
  background-color: var(--background-secondary);
}

.l-comparison-table__feature-label {
  grid-column: 1 / -1;
  padding: var(--spacing-4);
  font-size: var(--font-size-base);
}

@media (min-width: 768px) {
  .l-comparison-table__feature-label {
    grid-column: 1;
    padding: var(--spacing-4) var(--spacing-6);
  }
}

.l-comparison-table__feature-value {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4) var(--spacing-2);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
}

@media (min-width: 768px) {
  .l-comparison-table__feature-value {
    padding: var(--spacing-4) var(--spacing-6);
  }
}

.l-comparison-table__check,
.l-comparison-table__x {
  width: 1.5rem;
  height: 1.5rem;
}

.l-comparison-table__actions {
  margin-top: var(--spacing-12);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .l-comparison-table__actions {
    margin-top: var(--spacing-18);
  }
}

@media (min-width: 1024px) {
  .l-comparison-table__actions {
    margin-top: var(--spacing-20);
  }
}`,
};