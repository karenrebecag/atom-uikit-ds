/**
 * Layout: feature-stats-video
 *
 * Features section: left column with tagline, headline, description, 2 large stats,
 * and CTAs. Right side: video thumbnail (play button) that opens a modal player.
 * 
 * Structure-only. Uses DS tokens and components.
 */

export const featureStatsVideo = {
  slug: 'feature-stats-video',
  name: 'Feature Stats Video',
  description:
    'Seccion de features con 2 metricas grandes (stats) a la izquierda y thumbnail de video con play a la derecha que abre modal. Ideal para mostrar resultados + prueba visual.',
  components: ['button', 'typography', 'image'],
  html: `<!-- Layout: feature-stats-video -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->
<!-- Video modal: the trigger below opens a Dialog (atom_uikit_source("dialog")). The iframe src is supplied at render time. -->

<section class="l-feature-stats-video" id="{{section_id}}">
  <div class="container">
    <div class="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
      <div>
        <p class="l-feature-stats-video__eyebrow mb-3 font-semibold md:mb-4">{{tagline}}</p>
        <h2 class="l-feature-stats-video__heading mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          {{heading}}
        </h2>
        <p class="l-feature-stats-video__description mb-6 md:mb-8 md:text-md">
          {{description}}
        </p>
        <div class="l-feature-stats-video__stats grid grid-cols-1 gap-6 py-2 sm:grid-cols-2">
          <div class="l-feature-stats-video__stat">
            <h3 class="l-feature-stats-video__stat-value mb-2 text-5xl font-bold md:text-7xl lg:text-8xl">{{stat1_value}}</h3>
            <p class="l-feature-stats-video__stat-desc">{{stat1_description}}</p>
          </div>
          <div class="l-feature-stats-video__stat">
            <h3 class="l-feature-stats-video__stat-value mb-2 text-5xl font-bold md:text-7xl lg:text-8xl">{{stat2_value}}</h3>
            <p class="l-feature-stats-video__stat-desc">{{stat2_description}}</p>
          </div>
        </div>
        <div class="l-feature-stats-video__actions mt-6 flex flex-wrap items-center gap-4 md:mt-8">
          <a href="{{cta_primary_href}}" class="button button--secondary button--l">
            <span class="button__label">{{cta_primary}}</span>
          </a>
          <a href="{{cta_secondary_href}}" class="link-button">
            {{cta_secondary}}
            <span class="link-button__icon">→</span>
          </a>
        </div>
      </div>
      <button class="l-feature-stats-video__media relative flex w-full items-center justify-center" type="button">
        <img 
          src="{{image}}" 
          class="size-full object-cover" 
          alt="{{image_alt}}" 
        />
        <span class="l-feature-stats-video__overlay absolute inset-0 z-10"></span>
        <span class="l-feature-stats-video__play absolute z-20 flex size-16 items-center justify-center text-white">▶</span>
      </button>
    </div>
  </div>
</section>`,
  css: `/* Layout: feature-stats-video — structure only */
.l-feature-stats-video {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-feature-stats-video__eyebrow {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--muted-foreground);
}

.l-feature-stats-video__heading {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-feature-stats-video__heading {
    font-size: var(--font-size-4xl);
    line-height: var(--line-height-4xl);
  }
}

.l-feature-stats-video__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

.l-feature-stats-video__stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
  padding-block: var(--spacing-2);
}

@media (min-width: 640px) {
  .l-feature-stats-video__stats {
    grid-template-columns: 1fr 1fr;
  }
}

.l-feature-stats-video__stat {
  display: flex;
  flex-direction: column;
}

.l-feature-stats-video__stat-value {
  font-size: var(--font-size-5xl);
  line-height: 1;
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-feature-stats-video__stat-value {
    font-size: var(--font-size-7xl);
  }
}

@media (min-width: 1024px) {
  .l-feature-stats-video__stat-value {
    font-size: var(--font-size-8xl);
  }
}

.l-feature-stats-video__stat-desc {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
  line-height: 1.6;
}

.l-feature-stats-video__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-feature-stats-video__actions {
    margin-top: var(--spacing-8);
  }
}

.l-feature-stats-video__media {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.l-feature-stats-video__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
}

.l-feature-stats-video__play {
  position: absolute;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  line-height: 1;
}`,
};