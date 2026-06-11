/**
 * Layout: hero-sticky-collage
 *
 * Complex sticky hero with scrolling image collage (parallax-like effect on scroll).
 * Left column images move at one speed, right column at another.
 * Centered content overlay.
 * 
 * Structure-only. Uses DS tokens and components.
 * The scroll animation requires JS (GSAP recommended via ATOM animations package).
 * CSS handles sticky positioning and base layout.
 */

export const heroStickyCollage = {
  slug: 'hero-sticky-collage',
  name: 'Hero Sticky Collage',
  description:
    'Sticky hero with multi-image collage that scrolls at different speeds for depth. Left images move faster, right slower. Centered bold content with CTAs. Requires GSAP for full parallax effect. Structure only.',
  components: ['button', 'typography', 'chip'],
  html: `<!-- Layout: hero-sticky-collage -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]), atom_uikit_source("chip", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->
<!-- Animation: use GSAP from @atom-uikit/animations or custom scroll handler -->

<section class="l-hero-sticky-collage" id="{{section_id}}">
  <div class="l-hero-sticky-collage__sticky">
    <!-- Left column images (faster scroll) -->
    <div class="l-hero-sticky-collage__images-left">
      <div class="l-hero-sticky-collage__image l-hero-sticky-collage__image--1">
        <img src="{{image_1}}" class="size-full object-cover" alt="{{image_1_alt}}" />
      </div>
      <div class="l-hero-sticky-collage__image l-hero-sticky-collage__image--2">
        <img src="{{image_2}}" class="size-full object-cover" alt="{{image_2_alt}}" />
      </div>
      <div class="l-hero-sticky-collage__image l-hero-sticky-collage__image--3">
        <img src="{{image_3}}" class="size-full object-cover" alt="{{image_3_alt}}" />
      </div>
      <div class="l-hero-sticky-collage__image l-hero-sticky-collage__image--4">
        <img src="{{image_4}}" class="size-full object-cover" alt="{{image_4_alt}}" />
      </div>
    </div>

    <!-- Right column images (slower scroll, more opaque) -->
    <div class="l-hero-sticky-collage__images-right">
      <div class="l-hero-sticky-collage__image l-hero-sticky-collage__image--5 l-hero-sticky-collage__image--dim">
        <img src="{{image_5}}" class="size-full object-cover" alt="{{image_5_alt}}" />
      </div>
      <div class="l-hero-sticky-collage__image l-hero-sticky-collage__image--6 l-hero-sticky-collage__image--dim">
        <img src="{{image_6}}" class="size-full object-cover" alt="{{image_6_alt}}" />
      </div>
    </div>

    <!-- Centered content -->
    <div class="l-hero-sticky-collage__content container">
      <div class="l-hero-sticky-collage__inner">
        <h1 class="l-hero-sticky-collage__heading">{{heading}}</h1>
        <p class="l-hero-sticky-collage__description">{{description}}</p>
        <div class="l-hero-sticky-collage__actions">
          <a href="{{cta_primary_href}}" class="button button--primary button--xl">
            <span class="button__label">{{cta_primary}}</span>
          </a>
          <a href="{{cta_secondary_href}}" class="button button--secondary button--xl">
            <span class="button__label">{{cta_secondary}}</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Spacer for scroll height -->
  <div class="l-hero-sticky-collage__spacer"></div>
</section>`,

  css: `/* Layout: hero-sticky-collage — structure + sticky effect */
.l-hero-sticky-collage {
  position: relative;
  padding-inline: var(--spacing-8);
}

.l-hero-sticky-collage__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.l-hero-sticky-collage__images-left,
.l-hero-sticky-collage__images-right {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 26vw;
  padding-top: 70vh;
}

.l-hero-sticky-collage__images-left {
  left: 0;
  right: auto;
  z-index: 10;
}

.l-hero-sticky-collage__images-right {
  left: auto;
  right: 0;
  z-index: 0;
}

.l-hero-sticky-collage__image {
  position: relative;
  height: 35vw;
  width: 30vw;
  padding-top: 120%;
  flex-shrink: 0;
}

.l-hero-sticky-collage__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .l-hero-sticky-collage__image {
    width: 28vw;
    height: auto;
  }
}

@media (min-width: 1024px) {
  .l-hero-sticky-collage__image {
    width: 22vw;
  }
}

/* Specific positioning to match the collage layout */
.l-hero-sticky-collage__image--1 { width: 30vw; }
.l-hero-sticky-collage__image--2 { 
  left: 52vw; 
  margin-top: -46vw; 
  width: 30vw; 
}
.l-hero-sticky-collage__image--3 { 
  left: 4vw; 
  margin-top: -5vw; 
  width: 28vw; 
}
.l-hero-sticky-collage__image--4 { 
  left: 64vw; 
  margin-top: -45vw; 
  width: 26vw; 
}

.l-hero-sticky-collage__image--5 { width: 28vw; }
.l-hero-sticky-collage__image--6 { 
  right: 50vw; 
  margin-top: -44vw; 
  width: 26vw; 
}

@media (min-width: 768px) {
  .l-hero-sticky-collage__image--1 { width: 28vw; }
  .l-hero-sticky-collage__image--2 { width: 28vw; }
  .l-hero-sticky-collage__image--3 { width: 26vw; }
  .l-hero-sticky-collage__image--4 { width: 24vw; }
  .l-hero-sticky-collage__image--5 { width: 26vw; }
  .l-hero-sticky-collage__image--6 { width: 24vw; }
}

@media (min-width: 1024px) {
  .l-hero-sticky-collage__image--1 { width: 22vw; }
  .l-hero-sticky-collage__image--2 { left: 58vw; width: 22vw; }
  .l-hero-sticky-collage__image--3 { width: 20vw; }
  .l-hero-sticky-collage__image--4 { width: 18vw; }
  .l-hero-sticky-collage__image--5 { width: 20vw; }
  .l-hero-sticky-collage__image--6 { right: 54vw; width: 18vw; }
}

.l-hero-sticky-collage__image--dim {
  opacity: 0.75;
}

.l-hero-sticky-collage__content {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 100%;
  max-width: 32rem;
  margin: 0 auto;
  padding-block: var(--spacing-16);
  text-align: center;
}

.l-hero-sticky-collage__inner {
  width: 100%;
}

.l-hero-sticky-collage__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: var(--spacing-5);
  color: var(--foreground);
}

.l-hero-sticky-collage__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
  max-width: 480px;
  margin: 0 auto;
}

.l-hero-sticky-collage__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
  margin-top: var(--spacing-6);
}

/* Spacer to enable the scroll range */
.l-hero-sticky-collage__spacer {
  height: 150vh;
}

@media (min-width: 768px) {
  .l-hero-sticky-collage__spacer {
    height: 300vh;
  }
}

/* Note: The different scroll speeds (y transforms) are applied via JS/GSAP.
   See ATOM animations package or attach a scroll listener to move the two columns at different rates.
   Example targets: .l-hero-sticky-collage__images-left and .l-hero-sticky-collage__images-right
*/`,
};