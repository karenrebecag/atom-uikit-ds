/**
 * Layout: jobs-grid
 *
 * Encabezado con título, descripción, botones de acción y filtro (dots). Grid de tarjetas de empleo (logo, título, meta ubicación/tipo/remoto, descripción, timestamp con icono).
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/jobs-grid).
 */

export const jobsGrid = {
  slug: 'jobs-grid',
  name: 'Lista de trabajos en grid',
  description:
    'Encabezado con título, descripción, botones y filtro. Grid responsivo de tarjetas de empleo con logo, título, meta (ubicación • tipo • remoto), descripción y timestamp. 6 items.',
  components: ['button', 'typography', 'image'],
  html: `<!-- Layout: jobs-grid -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-jobs-grid" id="{{section_id}}">
  <div class="l-jobs-grid__header">
    <div class="l-jobs-grid__title-area">
      <h1 class="l-jobs-grid__heading">{{header_heading}}</h1>
      <p class="l-jobs-grid__description">{{header_description}}</p>
    </div>
    <div class="l-jobs-grid__actions">
      <div class="l-jobs-grid__buttons">
        <a href="{{header_cta1_href}}" class="button button--secondary">
          <span class="button__label">{{header_cta1}}</span>
        </a>
        <a href="{{header_cta2_href}}" class="button button--primary">
          <span class="button__label">{{header_cta2}}</span>
        </a>
      </div>
      <button class="l-jobs-grid__filter" type="button" aria-label="Filter options">
        <svg viewBox="0 0 24 24" fill="currentColor" class="l-jobs-grid__filter-icon">
          <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
        </svg>
      </button>
    </div>
  </div>

  <div class="l-jobs-grid__grid">
    <!-- Job 1 -->
    <div class="l-jobs-grid__card">
      <div class="l-jobs-grid__card-content">
        <div class="l-jobs-grid__logo-wrapper">
          <img src="{{job1_logo}}" alt="{{job1_logo_alt}}" class="l-jobs-grid__logo" />
        </div>
        <div class="l-jobs-grid__info">
          <div class="l-jobs-grid__meta">
            <h6 class="l-jobs-grid__title">{{job1_title}}</h6>
            <div class="l-jobs-grid__meta-row">
              <p class="l-jobs-grid__meta-item">{{job1_location}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job1_jobType}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job1_locationType}}</p>
            </div>
          </div>
          <p class="l-jobs-grid__description">{{job1_description}}</p>
        </div>
        <div class="l-jobs-grid__timestamp">
          <svg viewBox="0 0 24 24" class="l-jobs-grid__time-icon" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
          </svg>
          <p class="l-jobs-grid__time">{{job1_time}}</p>
        </div>
      </div>
    </div>

    <!-- Job 2 -->
    <div class="l-jobs-grid__card">
      <div class="l-jobs-grid__card-content">
        <div class="l-jobs-grid__logo-wrapper">
          <img src="{{job2_logo}}" alt="{{job2_logo_alt}}" class="l-jobs-grid__logo" />
        </div>
        <div class="l-jobs-grid__info">
          <div class="l-jobs-grid__meta">
            <h6 class="l-jobs-grid__title">{{job2_title}}</h6>
            <div class="l-jobs-grid__meta-row">
              <p class="l-jobs-grid__meta-item">{{job2_location}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job2_jobType}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job2_locationType}}</p>
            </div>
          </div>
          <p class="l-jobs-grid__description">{{job2_description}}</p>
        </div>
        <div class="l-jobs-grid__timestamp">
          <svg viewBox="0 0 24 24" class="l-jobs-grid__time-icon" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
          </svg>
          <p class="l-jobs-grid__time">{{job2_time}}</p>
        </div>
      </div>
    </div>

    <!-- Job 3 -->
    <div class="l-jobs-grid__card">
      <div class="l-jobs-grid__card-content">
        <div class="l-jobs-grid__logo-wrapper">
          <img src="{{job3_logo}}" alt="{{job3_logo_alt}}" class="l-jobs-grid__logo" />
        </div>
        <div class="l-jobs-grid__info">
          <div class="l-jobs-grid__meta">
            <h6 class="l-jobs-grid__title">{{job3_title}}</h6>
            <div class="l-jobs-grid__meta-row">
              <p class="l-jobs-grid__meta-item">{{job3_location}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job3_jobType}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job3_locationType}}</p>
            </div>
          </div>
          <p class="l-jobs-grid__description">{{job3_description}}</p>
        </div>
        <div class="l-jobs-grid__timestamp">
          <svg viewBox="0 0 24 24" class="l-jobs-grid__time-icon" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
          </svg>
          <p class="l-jobs-grid__time">{{job3_time}}</p>
        </div>
      </div>
    </div>

    <!-- Job 4 -->
    <div class="l-jobs-grid__card">
      <div class="l-jobs-grid__card-content">
        <div class="l-jobs-grid__logo-wrapper">
          <img src="{{job4_logo}}" alt="{{job4_logo_alt}}" class="l-jobs-grid__logo" />
        </div>
        <div class="l-jobs-grid__info">
          <div class="l-jobs-grid__meta">
            <h6 class="l-jobs-grid__title">{{job4_title}}</h6>
            <div class="l-jobs-grid__meta-row">
              <p class="l-jobs-grid__meta-item">{{job4_location}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job4_jobType}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job4_locationType}}</p>
            </div>
          </div>
          <p class="l-jobs-grid__description">{{job4_description}}</p>
        </div>
        <div class="l-jobs-grid__timestamp">
          <svg viewBox="0 0 24 24" class="l-jobs-grid__time-icon" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
          </svg>
          <p class="l-jobs-grid__time">{{job4_time}}</p>
        </div>
      </div>
    </div>

    <!-- Job 5 -->
    <div class="l-jobs-grid__card">
      <div class="l-jobs-grid__card-content">
        <div class="l-jobs-grid__logo-wrapper">
          <img src="{{job5_logo}}" alt="{{job5_logo_alt}}" class="l-jobs-grid__logo" />
        </div>
        <div class="l-jobs-grid__info">
          <div class="l-jobs-grid__meta">
            <h6 class="l-jobs-grid__title">{{job5_title}}</h6>
            <div class="l-jobs-grid__meta-row">
              <p class="l-jobs-grid__meta-item">{{job5_location}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job5_jobType}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job5_locationType}}</p>
            </div>
          </div>
          <p class="l-jobs-grid__description">{{job5_description}}</p>
        </div>
        <div class="l-jobs-grid__timestamp">
          <svg viewBox="0 0 24 24" class="l-jobs-grid__time-icon" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
          </svg>
          <p class="l-jobs-grid__time">{{job5_time}}</p>
        </div>
      </div>
    </div>

    <!-- Job 6 -->
    <div class="l-jobs-grid__card">
      <div class="l-jobs-grid__card-content">
        <div class="l-jobs-grid__logo-wrapper">
          <img src="{{job6_logo}}" alt="{{job6_logo_alt}}" class="l-jobs-grid__logo" />
        </div>
        <div class="l-jobs-grid__info">
          <div class="l-jobs-grid__meta">
            <h6 class="l-jobs-grid__title">{{job6_title}}</h6>
            <div class="l-jobs-grid__meta-row">
              <p class="l-jobs-grid__meta-item">{{job6_location}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job6_jobType}}</p>
              <span class="l-jobs-grid__meta-dot">•</span>
              <p class="l-jobs-grid__meta-item">{{job6_locationType}}</p>
            </div>
          </div>
          <p class="l-jobs-grid__description">{{job6_description}}</p>
        </div>
        <div class="l-jobs-grid__timestamp">
          <svg viewBox="0 0 24 24" class="l-jobs-grid__time-icon" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
          </svg>
          <p class="l-jobs-grid__time">{{job6_time}}</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: jobs-grid — structure only, pure DS tokens */
.l-jobs-grid {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-jobs-grid__header {
  display: grid;
  grid-template-columns: 1fr;
  align-items: end;
  gap: var(--spacing-4);
  padding-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-jobs-grid__header {
    grid-template-columns: 1fr max-content;
    gap: var(--spacing-6);
    padding-bottom: var(--spacing-6);
  }
}

.l-jobs-grid__title-area {
  max-width: 28rem;
}

.l-jobs-grid__heading {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-jobs-grid__heading {
    font-size: var(--font-size-2xl);
  }
}

.l-jobs-grid__description {
  margin-top: var(--spacing-2);
  font-size: var(--font-size-base);
  color: var(--muted-foreground);
}

.l-jobs-grid__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .l-jobs-grid__actions {
    justify-content: flex-start;
  }
}

.l-jobs-grid__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.l-jobs-grid__filter {
  border: 1px solid var(--border);
  padding: var(--spacing-2);
  background: none;
  cursor: pointer;
  color: var(--foreground);
}

.l-jobs-grid__filter-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.l-jobs-grid__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 1024px) {
  .l-jobs-grid__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.l-jobs-grid__card {
  border: 1px solid var(--border);
  padding: var(--spacing-6);
}

.l-jobs-grid__card-content {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-jobs-grid__card-content {
    grid-template-columns: max-content 1fr;
  }
}

.l-jobs-grid__logo-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .l-jobs-grid__logo-wrapper {
    margin-bottom: var(--spacing-6);
  }
}

.l-jobs-grid__logo {
  width: 4.5rem;
  height: 4.5rem;
  min-height: 4.5rem;
  min-width: 4.5rem;
  object-fit: cover;
}

.l-jobs-grid__info {
  display: flex;
  align-items: flex-start;
}

.l-jobs-grid__meta {
  flex: 1;
}

.l-jobs-grid__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-jobs-grid__title {
    font-size: var(--font-size-xl);
  }
}

.l-jobs-grid__meta-row {
  display: flex;
  align-items: center;
  margin-top: var(--spacing-1);
}

.l-jobs-grid__meta-item {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
}

.l-jobs-grid__meta-dot {
  margin: 0 var(--spacing-2);
  color: var(--muted-foreground);
}

.l-jobs-grid__description {
  margin-top: var(--spacing-3);
  font-size: var(--font-size-base);
  color: var(--foreground);
}

.l-jobs-grid__timestamp {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .l-jobs-grid__timestamp {
    position: static;
    margin-left: var(--spacing-6);
  }
}

.l-jobs-grid__time-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: var(--spacing-2);
  color: var(--foreground);
}

.l-jobs-grid__time {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
}`,
};