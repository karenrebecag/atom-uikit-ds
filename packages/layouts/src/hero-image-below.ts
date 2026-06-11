/**
 * Layout: hero-image-below
 *
 * Centered hero content (heading, description, buttons) on top, followed by a full-width image/video below.
 * Clean, direct structure. Uses only DS tokens and components.
 * Structure-only — get real component CSS via atom_uikit_source.
 */

export const heroImageBelow = {
  slug: 'hero-image-below',
  name: 'Hero Image Below',
  description:
    'Hero with centered text content (headline, body, dual CTAs) followed by a full-bleed image or video below. Simple and impactful for lead gen. Structure only.',
  components: ['button', 'typography'],
  html: `<!-- Layout: hero-image-below -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-hero-image-below" id="{{section_id}}">
  <div class="l-hero-image-below__content px-[5%] py-16 md:py-24 lg:py-28">
    <div class="container max-w-lg">
      <div class="flex w-full flex-col items-center text-center">
        <h1 class="l-hero-image-below__heading mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
          {{heading}}
        </h1>
        <p class="l-hero-image-below__description md:text-md">
          {{description}}
        </p>
        <div class="l-hero-image-below__actions mt-6 flex items-center justify-center gap-x-4 md:mt-8">
          <a href="{{cta_primary_href}}" class="button button--primary button--l">
            <span class="button__label">{{cta_primary}}</span>
          </a>
          <a href="{{cta_secondary_href}}" class="button button--secondary button--l">
            <span class="button__label">{{cta_secondary}}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="l-hero-image-below__media">
    <img 
      src="{{image}}" 
      class="aspect-video size-full object-cover" 
      alt="{{image_alt}}" 
    />
  </div>
</section>`,

  css: `/* Layout: hero-image-below — structure only */
.l-hero-image-below__content {
  padding-inline: var(--spacing-8);
  padding-block: var(--spacing-20);
}

@media (min-width: 768px) {
  .l-hero-image-below__content {
    padding-block: var(--spacing-24);
  }
}

@media (min-width: 1024px) {
  .l-hero-image-below__content {
    padding-block: var(--spacing-28);
  }
}

.l-hero-image-below__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
  margin-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-hero-image-below__heading {
    font-size: var(--font-size-9xl);
    line-height: var(--line-height-9xl);
    margin-bottom: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .l-hero-image-below__heading {
    font-size: var(--font-size-10xl);
    line-height: var(--line-height-10xl);
  }
}

.l-hero-image-below__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
  max-width: 480px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .l-hero-image-below__description {
    font-size: var(--font-size-md);
  }
}

.l-hero-image-below__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
  margin-top: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-hero-image-below__actions {
    margin-top: var(--spacing-8);
  }
}

.l-hero-image-below__media img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}`,
};