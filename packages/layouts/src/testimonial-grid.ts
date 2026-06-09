/**
 * Layout: testimonial-grid
 *
 * Grid masonry de 4-9 quotes cortas. Volumen de prueba social.
 * Structure-only. References DS components by BEM class.
 */

export const testimonialGrid = {
  slug: 'testimonial-grid',
  name: 'Testimonios en grid',
  description:
    'Grid masonry de 4-9 quotes cortas. Volumen de prueba social. Structure only.',
  components: ['avatar', 'typography', 'item'],
  html: `<!-- Layout: testimonial-grid -->
<section class="l-testimonial-grid">
  <div class="l-testimonial-grid__header">
    <h2 class="l-testimonial-grid__headline">{{headline}}</h2>
  </div>
  <div class="l-testimonial-grid__grid">
    <div class="l-testimonial-grid__card">
      <blockquote class="l-testimonial-grid__quote">{{quote1}}</blockquote>
      <div class="l-testimonial-grid__author">
        <img src="{{avatar1}}" alt="" class="avatar avatar--s" />
        <div>
          <div>{{name1}}</div>
          <div class="l-testimonial-grid__role">{{role1}}</div>
        </div>
      </div>
    </div>
    <div class="l-testimonial-grid__card">
      <blockquote class="l-testimonial-grid__quote">{{quote2}}</blockquote>
      <div class="l-testimonial-grid__author">
        <img src="{{avatar2}}" alt="" class="avatar avatar--s" />
        <div>
          <div>{{name2}}</div>
          <div class="l-testimonial-grid__role">{{role2}}</div>
        </div>
      </div>
    </div>
    <div class="l-testimonial-grid__card">
      <blockquote class="l-testimonial-grid__quote">{{quote3}}</blockquote>
      <div class="l-testimonial-grid__author">
        <img src="{{avatar3}}" alt="" class="avatar avatar--s" />
        <div>
          <div>{{name3}}</div>
          <div class="l-testimonial-grid__role">{{role3}}</div>
        </div>
      </div>
    </div>
    <div class="l-testimonial-grid__card">
      <blockquote class="l-testimonial-grid__quote">{{quote4}}</blockquote>
      <div class="l-testimonial-grid__author">
        <img src="{{avatar4}}" alt="" class="avatar avatar--s" />
        <div>
          <div>{{name4}}</div>
          <div class="l-testimonial-grid__role">{{role4}}</div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: testimonial-grid — structure only */
.l-testimonial-grid {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-testimonial-grid__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-testimonial-grid__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}
@media (max-width: 600px) {
  .l-testimonial-grid__grid {
    grid-template-columns: 1fr;
  }
}
.l-testimonial-grid__card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
}
.l-testimonial-grid__quote {
  font-style: italic;
  margin-bottom: var(--spacing-3);
}
.l-testimonial-grid__author {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
}
.l-testimonial-grid__role {
  color: var(--muted-foreground);
}`,
};