/**
 * Layout: feature-split-image
 *
 * Split features section: left column with header (tagline, headline, description),
 * two sub-features (icon + title + body), and buttons.
 * Right side: full image.
 * 
 * Structure-only. Uses DS tokens and components.
 */

export const featureSplitImage = {
  slug: 'feature-split-image',
  name: 'Feature Split Image',
  description:
    'Seccion de features dividida: texto a la izquierda con encabezado y dos sub-features, imagen a la derecha. Ideal para resaltar capacidades clave con visual. Structure only.',
  components: ['button', 'typography', 'image'],
  html: `<!-- Layout: feature-split-image -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-feature-split-image" id="{{section_id}}">
  <div class="container">
    <div class="grid grid-cols-1 gap-y-12 md:grid-flow-row md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
      <div>
        <p class="l-feature-split-image__eyebrow mb-3 font-semibold md:mb-4">{{tagline}}</p>
        <h2 class="l-feature-split-image__headline mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          {{heading}}
        </h2>
        <p class="l-feature-split-image__description mb-6 md:mb-8 md:text-md">
          {{description}}
        </p>
        <div class="l-feature-split-image__subfeatures grid grid-cols-1 gap-6 py-2 sm:grid-cols-2">
          <div class="l-feature-split-image__subfeature">
            <div class="l-feature-split-image__icon mb-3 md:mb-4">
              <img src="{{sub1_icon}}" class="size-12" alt="{{sub1_icon_alt}}" />
            </div>
            <h3 class="l-feature-split-image__subfeature-title mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
              {{sub1_title}}
            </h3>
            <p class="l-feature-split-image__subfeature-body">
              {{sub1_body}}
            </p>
          </div>
          <div class="l-feature-split-image__subfeature">
            <div class="l-feature-split-image__icon mb-3 md:mb-4">
              <img src="{{sub2_icon}}" class="size-12" alt="{{sub2_icon_alt}}" />
            </div>
            <h3 class="l-feature-split-image__subfeature-title mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
              {{sub2_title}}
            </h3>
            <p class="l-feature-split-image__subfeature-body">
              {{sub2_body}}
            </p>
          </div>
        </div>
        <div class="l-feature-split-image__actions mt-6 flex flex-wrap items-center gap-4 md:mt-8">
          <a href="{{cta_primary_href}}" class="button button--secondary button--l">
            <span class="button__label">{{cta_primary}}</span>
          </a>
          <a href="{{cta_secondary_href}}" class="link-button">
            {{cta_secondary}}
            <span class="link-button__icon">→</span>
          </a>
        </div>
      </div>
      <div class="l-feature-split-image__media">
        <img 
          src="{{image}}" 
          class="w-full object-cover" 
          alt="{{image_alt}}" 
        />
      </div>
    </div>
  </div>
</section>`,

  css: `/* Layout: feature-split-image — structure only */
.l-feature-split-image {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-feature-split-image__eyebrow {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--muted-foreground);
}

.l-feature-split-image__headline {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-feature-split-image__headline {
    font-size: var(--font-size-4xl);
    line-height: var(--line-height-4xl);
  }
}

.l-feature-split-image__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

.l-feature-split-image__subfeatures {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
  padding-block: var(--spacing-2);
}

@media (min-width: 640px) {
  .l-feature-split-image__subfeatures {
    grid-template-columns: 1fr 1fr;
  }
}

.l-feature-split-image__subfeature {
  display: flex;
  flex-direction: column;
}

.l-feature-split-image__icon {
  width: 48px;
  height: 48px;
}

.l-feature-split-image__subfeature-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--foreground);
  line-height: 1.4;
}

@media (min-width: 768px) {
  .l-feature-split-image__subfeature-title {
    font-size: var(--font-size-xl);
  }
}

.l-feature-split-image__subfeature-body {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
  line-height: 1.6;
}

.l-feature-split-image__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-feature-split-image__actions {
    margin-top: var(--spacing-8);
  }
}

.l-feature-split-image__media img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}`,
};