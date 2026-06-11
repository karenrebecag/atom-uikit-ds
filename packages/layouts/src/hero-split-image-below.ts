/**
 * Layout: hero-split-image-below
 *
 * Two-column hero content (heading left, description + buttons right) on top,
 * followed by a full-width image below.
 * Clean split layout for more text-heavy heroes.
 * 
 * Structure-only. Uses DS tokens and components.
 */

export const heroSplitImageBelow = {
  slug: 'hero-split-image-below',
  name: 'Hero Split Image Below',
  description:
    'Hero with split content on top (headline left, body + CTAs right) and full-width image below. Good for detailed intros. Structure only.',
  components: ['button', 'typography'],
  html: `<!-- Layout: hero-split-image-below -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-hero-split-image-below" id="{{section_id}}">
  <div class="container px-[5%] py-16 md:py-24 lg:py-28">
    <div class="rb-12 mb-12 grid grid-cols-1 items-start gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-y-8 lg:mb-20 lg:gap-x-20 lg:gap-y-16">
      <h1 class="l-hero-split-image-below__heading text-6xl font-bold md:text-9xl lg:text-10xl">
        {{heading}}
      </h1>
      <div>
        <p class="l-hero-split-image-below__description md:text-md">
          {{description}}
        </p>
        <div class="l-hero-split-image-below__actions mt-6 flex flex-wrap gap-4 md:mt-8">
          <a href="{{cta_primary_href}}" class="button button--primary button--l">
            <span class="button__label">{{cta_primary}}</span>
          </a>
          <a href="{{cta_secondary_href}}" class="button button--secondary button--l">
            <span class="button__label">{{cta_secondary}}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="l-hero-split-image-below__media">
      <img 
        src="{{image}}" 
        class="w-full object-cover" 
        alt="{{image_alt}}" 
      />
    </div>
  </div>
</section>`,

  css: `/* Layout: hero-split-image-below — structure only */
.l-hero-split-image-below__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-hero-split-image-below__heading {
    font-size: var(--font-size-9xl);
    line-height: var(--line-height-9xl);
  }
}

@media (min-width: 1024px) {
  .l-hero-split-image-below__heading {
    font-size: var(--font-size-10xl);
    line-height: var(--line-height-10xl);
  }
}

.l-hero-split-image-below__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .l-hero-split-image-below__description {
    font-size: var(--font-size-md);
  }
}

.l-hero-split-image-below__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-hero-split-image-below__actions {
    margin-top: var(--spacing-8);
  }
}

.l-hero-split-image-below__media img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}`,
};