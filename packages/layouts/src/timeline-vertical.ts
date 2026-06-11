/**
 * Layout: timeline-vertical
 *
 * Timeline vertical con introducción sticky a la izquierda (tagline, titular, descripción, CTAs) y columna derecha con eventos en tarjetas, línea vertical con dots y fade.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/timeline-vertical).
 */

export const timelineVertical = {
  slug: 'timeline-vertical',
  name: 'Timeline Vertical',
  description:
    'Timeline con columna izquierda sticky (encabezado + botones) y derecha con eventos fechados en tarjetas conectados por línea vertical con dots. 4 items.',
  components: ['button', 'typography'],
  html: `<!-- Layout: timeline-vertical -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-timeline-vertical" id="{{section_id}}">
  <div class="l-timeline-vertical__grid">
    <!-- Intro / sticky column -->
    <div class="l-timeline-vertical__intro">
      <p class="l-timeline-vertical__tagline">{{tagline}}</p>
      <h1 class="l-timeline-vertical__heading">{{heading}}</h1>
      <p class="l-timeline-vertical__description">{{description}}</p>
      <div class="l-timeline-vertical__actions">
        <a href="{{cta_primary_href}}" class="button button--secondary button--l">
          <span class="button__label">{{cta_primary}}</span>
        </a>
        <a href="{{cta_secondary_href}}" class="link-button">
          {{cta_secondary}}
          <span class="link-button__icon">→</span>
        </a>
      </div>
    </div>

    <!-- Vertical line (visual only) -->
    <div class="l-timeline-vertical__line" aria-hidden="true">
      <div class="l-timeline-vertical__line-fade-top"></div>
      <div class="l-timeline-vertical__line-bar"></div>
      <div class="l-timeline-vertical__line-fade-bottom"></div>
    </div>

    <!-- Timeline items -->
    <div class="l-timeline-vertical__items">
      <!-- Item 1 -->
      <div class="l-timeline-vertical__item">
        <div class="l-timeline-vertical__dot"></div>
        <div class="l-timeline-vertical__card">
          <h2 class="l-timeline-vertical__date">{{timeline1_date}}</h2>
          <h3 class="l-timeline-vertical__item-heading">{{timeline1_heading}}</h3>
          <p class="l-timeline-vertical__item-description">{{timeline1_description}}</p>
          <div class="l-timeline-vertical__item-actions">
            <a href="{{timeline1_cta_primary_href}}" class="button button--secondary">
              <span class="button__label">{{timeline1_cta_primary}}</span>
            </a>
            <a href="{{timeline1_cta_secondary_href}}" class="link-button">
              {{timeline1_cta_secondary}}
              <span class="link-button__icon">→</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="l-timeline-vertical__item">
        <div class="l-timeline-vertical__dot"></div>
        <div class="l-timeline-vertical__card">
          <h2 class="l-timeline-vertical__date">{{timeline2_date}}</h2>
          <h3 class="l-timeline-vertical__item-heading">{{timeline2_heading}}</h3>
          <p class="l-timeline-vertical__item-description">{{timeline2_description}}</p>
          <div class="l-timeline-vertical__item-actions">
            <a href="{{timeline2_cta_primary_href}}" class="button button--secondary">
              <span class="button__label">{{timeline2_cta_primary}}</span>
            </a>
            <a href="{{timeline2_cta_secondary_href}}" class="link-button">
              {{timeline2_cta_secondary}}
              <span class="link-button__icon">→</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Item 3 -->
      <div class="l-timeline-vertical__item">
        <div class="l-timeline-vertical__dot"></div>
        <div class="l-timeline-vertical__card">
          <h2 class="l-timeline-vertical__date">{{timeline3_date}}</h2>
          <h3 class="l-timeline-vertical__item-heading">{{timeline3_heading}}</h3>
          <p class="l-timeline-vertical__item-description">{{timeline3_description}}</p>
          <div class="l-timeline-vertical__item-actions">
            <a href="{{timeline3_cta_primary_href}}" class="button button--secondary">
              <span class="button__label">{{timeline3_cta_primary}}</span>
            </a>
            <a href="{{timeline3_cta_secondary_href}}" class="link-button">
              {{timeline3_cta_secondary}}
              <span class="link-button__icon">→</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Item 4 -->
      <div class="l-timeline-vertical__item">
        <div class="l-timeline-vertical__dot"></div>
        <div class="l-timeline-vertical__card">
          <h2 class="l-timeline-vertical__date">{{timeline4_date}}</h2>
          <h3 class="l-timeline-vertical__item-heading">{{timeline4_heading}}</h3>
          <p class="l-timeline-vertical__item-description">{{timeline4_description}}</p>
          <div class="l-timeline-vertical__item-actions">
            <a href="{{timeline4_cta_primary_href}}" class="button button--secondary">
              <span class="button__label">{{timeline4_cta_primary}}</span>
            </a>
            <a href="{{timeline4_cta_secondary_href}}" class="link-button">
              {{timeline4_cta_secondary}}
              <span class="link-button__icon">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: timeline-vertical — structure only, pure DS tokens */
.l-timeline-vertical {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-timeline-vertical__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-timeline-vertical__grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-24);
    align-items: start;
  }
}

@media (min-width: 1024px) {
  .l-timeline-vertical__grid {
    gap: var(--spacing-32);
  }
}

.l-timeline-vertical__intro {
  position: relative;
  z-index: 10;
}

@media (min-width: 768px) {
  .l-timeline-vertical__intro {
    position: sticky;
    top: var(--spacing-20);
    z-index: auto;
    padding-right: var(--spacing-4);
  }
}

.l-timeline-vertical__tagline {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--muted-foreground);
  margin-bottom: var(--spacing-3);
}

.l-timeline-vertical__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
  margin-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-timeline-vertical__heading {
    font-size: var(--font-size-5xl);
    line-height: var(--line-height-5xl);
    margin-bottom: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .l-timeline-vertical__heading {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-6xl);
  }
}

.l-timeline-vertical__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .l-timeline-vertical__description {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-lg);
  }
}

.l-timeline-vertical__actions {
  margin-top: var(--spacing-6);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .l-timeline-vertical__actions {
    margin-top: var(--spacing-8);
  }
}

.l-timeline-vertical__line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  width: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

@media (min-width: 768px) {
  .l-timeline-vertical__line {
    left: 50%;
    transform: translateX(-50%);
    width: 0.75rem;
  }
}

.l-timeline-vertical__line-fade-top {
  height: 4rem;
  width: 0.25rem;
  background: linear-gradient(to bottom, var(--background), transparent);
  flex-shrink: 0;
}

.l-timeline-vertical__line-bar {
  width: 3px;
  background-color: var(--border);
  flex: 1;
}

@media (min-width: 768px) {
  .l-timeline-vertical__line-bar {
    width: 3px;
  }
}

.l-timeline-vertical__line-fade-bottom {
  height: 4rem;
  width: 0.25rem;
  background: linear-gradient(to top, var(--background), transparent);
  flex-shrink: 0;
}

.l-timeline-vertical__items {
  position: relative;
  z-index: 10;
  display: grid;
  gap: var(--spacing-8) var(--spacing-12);
}

@media (min-width: 768px) {
  .l-timeline-vertical__items {
    gap: var(--spacing-20) var(--spacing-20);
  }
}

@media (min-width: 1024px) {
  .l-timeline-vertical__items {
    gap: var(--spacing-20) var(--spacing-32);
  }
}

.l-timeline-vertical__item {
  position: relative;
  padding-left: 3rem;
}

@media (min-width: 768px) {
  .l-timeline-vertical__item {
    padding-left: 0;
  }
}

.l-timeline-vertical__dot {
  position: absolute;
  left: 0;
  top: 1.75rem;
  width: 1rem;
  height: 1rem;
  border-radius: var(--radius-full);
  background-color: var(--border);
  box-shadow: 0 0 0 8px var(--background);
  z-index: 20;
}

@media (min-width: 768px) {
  .l-timeline-vertical__dot {
    left: -2.5rem;
  }
}

@media (min-width: 1024px) {
  .l-timeline-vertical__dot {
    left: -3rem;
  }
}

.l-timeline-vertical__card {
  border: 1px solid var(--border);
  padding: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-timeline-vertical__card {
    padding: var(--spacing-8);
  }
}

.l-timeline-vertical__date {
  font-size: var(--font-size-4xl);
  line-height: 1.2;
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
  margin-bottom: var(--spacing-3);
}

@media (min-width: 768px) {
  .l-timeline-vertical__date {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--spacing-4);
  }
}

@media (min-width: 1024px) {
  .l-timeline-vertical__date {
    font-size: var(--font-size-6xl);
  }
}

.l-timeline-vertical__item-heading {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
  margin-bottom: var(--spacing-3);
}

@media (min-width: 768px) {
  .l-timeline-vertical__item-heading {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-4);
  }
}

.l-timeline-vertical__item-description {
  font-size: var(--font-size-base);
  color: var(--foreground);
}

.l-timeline-vertical__item-actions {
  margin-top: var(--spacing-6);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .l-timeline-vertical__item-actions {
    margin-top: var(--spacing-8);
  }
}`,
};