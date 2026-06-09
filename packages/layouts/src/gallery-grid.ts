/**
 * Layout: gallery-grid
 *
 * Grid de imagenes 2-3 columnas con caption opcional. Para casos, producto o equipo.
 * Structure-only. References DS components by BEM class.
 */

export const galleryGrid = {
  slug: 'gallery-grid',
  name: 'Gallery Grid',
  description:
    'Grid de imagenes 2-3 columnas con caption opcional. Para casos, producto o equipo. Structure only.',
  components: ['image', 'typography'],
  html: `<!-- Layout: gallery-grid -->
<section class="l-gallery-grid">
  <div class="l-gallery-grid__header">
    <h2 class="l-gallery-grid__headline">{{headline}}</h2>
  </div>
  <div class="l-gallery-grid__grid">
    <div class="l-gallery-grid__item">
      <img src="{{image1}}" alt="" class="image" />
      <p class="l-gallery-grid__caption">{{caption1}}</p>
    </div>
    <div class="l-gallery-grid__item">
      <img src="{{image2}}" alt="" class="image" />
      <p class="l-gallery-grid__caption">{{caption2}}</p>
    </div>
    <div class="l-gallery-grid__item">
      <img src="{{image3}}" alt="" class="image" />
      <p class="l-gallery-grid__caption">{{caption3}}</p>
    </div>
    <div class="l-gallery-grid__item">
      <img src="{{image4}}" alt="" class="image" />
      <p class="l-gallery-grid__caption">{{caption4}}</p>
    </div>
    <div class="l-gallery-grid__item">
      <img src="{{image5}}" alt="" class="image" />
      <p class="l-gallery-grid__caption">{{caption5}}</p>
    </div>
    <div class="l-gallery-grid__item">
      <img src="{{image6}}" alt="" class="image" />
      <p class="l-gallery-grid__caption">{{caption6}}</p>
    </div>
  </div>
</section>`,
  css: `/* Layout: gallery-grid — structure only */
.l-gallery-grid {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-gallery-grid__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-gallery-grid__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4);
}
@media (max-width: 768px) {
  .l-gallery-grid__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .l-gallery-grid__grid {
    grid-template-columns: 1fr;
  }
}
.l-gallery-grid__item {
  position: relative;
}
.l-gallery-grid__item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
.l-gallery-grid__caption {
  position: absolute;
  bottom: var(--spacing-2);
  left: var(--spacing-2);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}`,
};