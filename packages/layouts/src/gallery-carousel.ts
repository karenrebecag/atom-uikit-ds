/**
 * Layout: gallery-carousel
 *
 * Carrusel horizontal arrastrable de imagenes grandes. Usa el hook marquee-draggable.
 * Structure-only. References DS components by BEM class.
 */

export const galleryCarousel = {
  slug: 'gallery-carousel',
  name: 'Gallery Carousel',
  description:
    'Carrusel horizontal arrastrable de imagenes grandes. Usa el hook marquee-draggable. Structure only.',
  components: ['image', 'typography', 'icon-button'],
  html: `<!-- Layout: gallery-carousel -->
<section class="l-gallery-carousel">
  <div class="l-gallery-carousel__header">
    <h2 class="l-gallery-carousel__headline">{{headline}}</h2>
  </div>
  <div class="marquee l-gallery-carousel__track" data-marquee-draggable>
    <div class="l-gallery-carousel__slides">
      <div class="l-gallery-carousel__slide">
        <img src="{{image1}}" alt="" class="image" />
        <p class="l-gallery-carousel__caption">{{caption1}}</p>
      </div>
      <div class="l-gallery-carousel__slide">
        <img src="{{image2}}" alt="" class="image" />
        <p class="l-gallery-carousel__caption">{{caption2}}</p>
      </div>
      <div class="l-gallery-carousel__slide">
        <img src="{{image3}}" alt="" class="image" />
        <p class="l-gallery-carousel__caption">{{caption3}}</p>
      </div>
      <div class="l-gallery-carousel__slide">
        <img src="{{image4}}" alt="" class="image" />
        <p class="l-gallery-carousel__caption">{{caption4}}</p>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: gallery-carousel — structure only */
.l-gallery-carousel {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-gallery-carousel__header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}
.l-gallery-carousel__track {
  display: flex;
  overflow: hidden;
}
.l-gallery-carousel__slides {
  display: flex;
  gap: var(--spacing-4);
  flex-shrink: 0;
}
.l-gallery-carousel__slide {
  min-width: 80%;
  position: relative;
}
.l-gallery-carousel__slide img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
.l-gallery-carousel__caption {
  position: absolute;
  bottom: var(--spacing-4);
  left: var(--spacing-4);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}`,
};