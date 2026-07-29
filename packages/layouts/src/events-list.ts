/**
 * Layout: events-list
 *
 * Listado de eventos con encabezado, pestañas de categorías (visual), y filas de eventos con fecha destacada en caja, título linkeado, ubicación, descripción, estado opcional y botón de acción.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/events-list).
 */

export const eventsList = {
  slug: 'events-list',
  name: 'Eventos',
  description:
    'Listado de eventos con fecha en caja, título, ubicación, descripción y CTA. Incluye barra de pestañas de categorías (estática en template). Structure only.',
  components: ['button', 'typography'],
  html: `<!-- Layout: events-list -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-events-list" id="{{section_id}}">
  <div class="l-events-list__header">
    <p class="l-events-list__tagline">{{tagline}}</p>
    <h1 class="l-events-list__heading">{{heading}}</h1>
    <p class="l-events-list__description">{{description}}</p>
  </div>

  <div class="l-events-list__tabs">
    <button class="l-events-list__tab l-events-list__tab--active" type="button">{{tab1}}</button>
    <button class="l-events-list__tab" type="button">{{tab2}}</button>
    <button class="l-events-list__tab" type="button">{{tab3}}</button>
    <button class="l-events-list__tab" type="button">{{tab4}}</button>
    <button class="l-events-list__tab" type="button">{{tab5}}</button>
  </div>

  <div class="l-events-list__content">
    <!-- Event 1 -->
    <div class="l-events-list__event">
      <div class="l-events-list__date">
        <span>{{event1_weekday}}</span>
        <span class="l-events-list__day">{{event1_day}}</span>
        <span>{{event1_month}} {{event1_year}}</span>
      </div>
      <div class="l-events-list__info">
        <div class="l-events-list__title-row">
          <a href="{{event1_url}}" class="l-events-list__title">{{event1_title}}</a>
          <span class="l-events-list__status">{{event1_status}}</span>
        </div>
        <p class="l-events-list__location">{{event1_location}}</p>
        <p class="l-events-list__description">{{event1_description}}</p>
      </div>
      <div class="l-events-list__action">
        <a href="{{event1_url}}" class="button button--secondary">
          <span class="button__label">{{event1_cta}}</span>
        </a>
      </div>
    </div>

    <!-- Event 2 -->
    <div class="l-events-list__event">
      <div class="l-events-list__date">
        <span>{{event2_weekday}}</span>
        <span class="l-events-list__day">{{event2_day}}</span>
        <span>{{event2_month}} {{event2_year}}</span>
      </div>
      <div class="l-events-list__info">
        <div class="l-events-list__title-row">
          <a href="{{event2_url}}" class="l-events-list__title">{{event2_title}}</a>
          <span class="l-events-list__status">{{event2_status}}</span>
        </div>
        <p class="l-events-list__location">{{event2_location}}</p>
        <p class="l-events-list__description">{{event2_description}}</p>
      </div>
      <div class="l-events-list__action">
        <a href="{{event2_url}}" class="button button--secondary">
          <span class="button__label">{{event2_cta}}</span>
        </a>
      </div>
    </div>

    <!-- Event 3 -->
    <div class="l-events-list__event">
      <div class="l-events-list__date">
        <span>{{event3_weekday}}</span>
        <span class="l-events-list__day">{{event3_day}}</span>
        <span>{{event3_month}} {{event3_year}}</span>
      </div>
      <div class="l-events-list__info">
        <div class="l-events-list__title-row">
          <a href="{{event3_url}}" class="l-events-list__title">{{event3_title}}</a>
          <span class="l-events-list__status">{{event3_status}}</span>
        </div>
        <p class="l-events-list__location">{{event3_location}}</p>
        <p class="l-events-list__description">{{event3_description}}</p>
      </div>
      <div class="l-events-list__action">
        <a href="{{event3_url}}" class="button button--secondary">
          <span class="button__label">{{event3_cta}}</span>
        </a>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: events-list — structure only, pure DS tokens */
.l-events-list {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-events-list__header {
  max-width: 640px;
  margin-bottom: var(--spacing-12);
}

@media (min-width: 768px) {
  .l-events-list__header {
    margin-bottom: var(--spacing-18);
  }
}

@media (min-width: 1024px) {
  .l-events-list__header {
    margin-bottom: var(--spacing-20);
  }
}

.l-events-list__tagline {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--muted-foreground);
  margin-bottom: var(--spacing-3);
}

.l-events-list__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
  margin-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-events-list__heading {
    font-size: var(--font-size-5xl);
    line-height: var(--line-height-5xl);
    margin-bottom: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .l-events-list__heading {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-6xl);
  }
}

.l-events-list__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .l-events-list__description {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-lg);
  }
}

.l-events-list__tabs {
  display: flex;
  margin-bottom: var(--spacing-12);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  gap: 0;
}

@media (min-width: 768px) {
  .l-events-list__tabs {
    overflow-x: visible;
  }
}

.l-events-list__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  padding: 0.5rem 1rem;
  font-size: var(--font-size-base);
  cursor: pointer;
}

.l-events-list__tab--active {
  border-color: var(--border);
  background-color: transparent;
  color: var(--foreground);
}

.l-events-list__content {
  /* events listed vertically with borders */
}

.l-events-list__event {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  border-top: 1px solid var(--border);
  padding-block: var(--spacing-6);
  align-items: center;
}

.l-events-list__event:last-child {
  border-bottom: 1px solid var(--border);
}

@media (min-width: 768px) {
  .l-events-list__event {
    grid-template-columns: max-content 1fr max-content;
    gap: var(--spacing-8);
    padding-block: var(--spacing-8);
  }
}

.l-events-list__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border);
  background-color: var(--background);
  padding: 0.25rem 0.25rem 0.75rem;
  min-width: 7rem;
  text-align: center;
  font-size: var(--font-size-base);
}

.l-events-list__day {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

@media (min-width: 768px) {
  .l-events-list__day {
    font-size: var(--font-size-3xl);
  }
}

@media (min-width: 1024px) {
  .l-events-list__day {
    font-size: var(--font-size-4xl);
  }
}

.l-events-list__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.l-events-list__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

@media (min-width: 640px) {
  .l-events-list__title-row {
    margin-bottom: 0;
    gap: var(--spacing-4);
  }
}

.l-events-list__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
  text-decoration: none;
}

@media (min-width: 768px) {
  .l-events-list__title {
    font-size: var(--font-size-2xl);
  }
}

.l-events-list__status {
  display: inline-block;
  background-color: var(--muted);
  color: var(--foreground);
  padding: 0.25rem 0.5rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.l-events-list__location {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
  margin-bottom: var(--spacing-3);
}

@media (min-width: 768px) {
  .l-events-list__location {
    margin-bottom: var(--spacing-4);
  }
}

.l-events-list__description {
  font-size: var(--font-size-base);
  color: var(--foreground);
}

.l-events-list__action {
  display: flex;
  margin-top: var(--spacing-4);
}

@media (min-width: 768px) {
  .l-events-list__action {
    margin-top: 0;
  }
}`,
};