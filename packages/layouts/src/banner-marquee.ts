/**
 * Layout: banner-marquee
 *
 * Thin horizontal banner with repeated text in a seamless scrolling marquee,
 * with top and bottom borders.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/banner-marquee).
 */

export const bannerMarquee = {
  slug: 'banner-marquee',
  name: 'Banner Marquee',
  description:
    'Barra delgada horizontal con texto repetido en marquee infinito, bordes superior e inferior. Efecto de scroll o auto-scroll para destacar un mensaje de marca.',
  components: ['marquee', 'typography'],
  html: `<!-- Layout: banner-marquee -->
<!-- Get component CSS: atom_uikit_source("typography") or marquee if available -->
<!-- Get tokens: atom_uikit_source("tokens") -->
<!-- The horizontal scroll / marquee animation is powered by the DS marquee system or GSAP (scroll-linked or constant speed). The duplicated groups enable seamless looping. -->

<section class="l-banner-marquee" id="{{section_id}}">
  <div class="l-banner-marquee__bar">
    <div class="l-banner-marquee__track" data-marquee>
      <div class="l-banner-marquee__group">
        <div class="l-banner-marquee__item">{{heading1}}</div>
        <div class="l-banner-marquee__item">{{heading2}}</div>
        <div class="l-banner-marquee__item">{{heading3}}</div>
        <div class="l-banner-marquee__item">{{heading4}}</div>
        <div class="l-banner-marquee__item">{{heading5}}</div>
      </div>
      <!-- duplicate for seamless loop -->
      <div class="l-banner-marquee__group" aria-hidden="true">
        <div class="l-banner-marquee__item">{{heading1}}</div>
        <div class="l-banner-marquee__item">{{heading2}}</div>
        <div class="l-banner-marquee__item">{{heading3}}</div>
        <div class="l-banner-marquee__item">{{heading4}}</div>
        <div class="l-banner-marquee__item">{{heading5}}</div>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: banner-marquee — structure only, pure DS tokens */
.l-banner-marquee {
  overflow: hidden;
}

.l-banner-marquee__bar {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.l-banner-marquee__track {
  display: flex;
  align-items: center;
  padding-block: var(--spacing-4);
}

.l-banner-marquee__group {
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  flex-shrink: 0;
  padding-left: var(--spacing-12);
}

.l-banner-marquee__item {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-banner-marquee__item {
    font-size: var(--font-size-lg);
  }
}`,
};