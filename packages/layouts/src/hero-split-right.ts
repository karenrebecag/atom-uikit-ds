/**
 * Layout: hero-split-right
 *
 * Split hero: content on left (heading, description, buttons), full-height image on right.
 * On mobile: content stacked above image.
 * 
 * Structure-only. Uses DS tokens and components.
 */

export const heroSplitRight = {
  slug: 'hero-split-right',
  name: 'Hero Split Right',
  description:
    'Hero dividido: contenido a la izquierda (headline, descripcion, CTAs), imagen full-height a la derecha. En mobile contenido arriba de la imagen. Structure only.',
  components: ['button', 'typography'],
  html: `<!-- Layout: hero-split-right -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-hero-split-right" id="{{section_id}}">
  <div class="container mx-[5%] sm:max-w-md md:justify-self-start lg:ml-[5vw] lg:mr-20 lg:justify-self-end">
    <h1 class="l-hero-split-right__heading mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
      {{heading}}
    </h1>
    <p class="l-hero-split-right__description md:text-md">
      {{description}}
    </p>
    <div class="l-hero-split-right__actions mt-6 flex flex-wrap gap-4 md:mt-8">
      <a href="{{cta_primary_href}}" class="button button--primary button--l">
        <span class="button__label">{{cta_primary}}</span>
      </a>
      <a href="{{cta_secondary_href}}" class="button button--secondary button--l">
        <span class="button__label">{{cta_secondary}}</span>
      </a>
    </div>
  </div>
  <div class="l-hero-split-right__media">
    <img 
      src="{{image}}" 
      class="w-full object-cover lg:h-screen lg:max-h-[60rem]" 
      alt="{{image_alt}}" 
    />
  </div>
</section>`,

  css: `/* Layout: hero-split-right — structure only */
.l-hero-split-right {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: var(--spacing-16);
  padding-top: var(--spacing-16);
}

@media (min-width: 768px) {
  .l-hero-split-right {
    padding-top: var(--spacing-24);
  }
}

@media (min-width: 1024px) {
  .l-hero-split-right {
    grid-template-columns: 1fr 1fr;
    padding-top: 0;
  }
}

.l-hero-split-right__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-hero-split-right__heading {
    font-size: var(--font-size-9xl);
    line-height: var(--line-height-9xl);
  }
}

@media (min-width: 1024px) {
  .l-hero-split-right__heading {
    font-size: var(--font-size-10xl);
    line-height: var(--line-height-10xl);
  }
}

.l-hero-split-right__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .l-hero-split-right__description {
    font-size: var(--font-size-md);
  }
}

.l-hero-split-right__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-hero-split-right__actions {
    margin-top: var(--spacing-8);
  }
}

.l-hero-split-right__media img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

@media (min-width: 1024px) {
  .l-hero-split-right__media img {
    height: 100vh;
    max-height: 60rem;
  }
}`,
};