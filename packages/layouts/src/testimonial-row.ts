/**
 * Layout: testimonial-row
 *
 * 2-3 quotes en cards horizontales con avatar, nombre y rol.
 * Structure-only. References DS components by BEM class.
 */

export const testimonialRow = {
  slug: 'testimonial-row',
  name: 'Testimonial Row',
  description:
    '2-3 quotes en cards horizontales con avatar, nombre y rol. Structure only.',
  components: ['avatar', 'typography', 'item'],
  html: `<!-- Layout: testimonial-row -->
<section class="l-testimonial-row">
  <div class="l-testimonial-row__header">
    <h2 class="l-testimonial-row__headline">{{headline}}</h2>
  </div>
  <div class="l-testimonial-row__grid">
    <figure class="l-testimonial-row__card">
      <blockquote class="l-testimonial-row__quote">{{quote1}}</blockquote>
      <figcaption class="l-testimonial-row__author">
        <img src="{{avatar1}}" alt="" class="avatar avatar--s" />
        <div>
          <div class="l-testimonial-row__name">{{name1}}</div>
          <div class="l-testimonial-row__role">{{role1}}</div>
        </div>
      </figcaption>
    </figure>
    <figure class="l-testimonial-row__card">
      <blockquote class="l-testimonial-row__quote">{{quote2}}</blockquote>
      <figcaption class="l-testimonial-row__author">
        <img src="{{avatar2}}" alt="" class="avatar avatar--s" />
        <div>
          <div class="l-testimonial-row__name">{{name2}}</div>
          <div class="l-testimonial-row__role">{{role2}}</div>
        </div>
      </figcaption>
    </figure>
    <figure class="l-testimonial-row__card">
      <blockquote class="l-testimonial-row__quote">{{quote3}}</blockquote>
      <figcaption class="l-testimonial-row__author">
        <img src="{{avatar3}}" alt="" class="avatar avatar--s" />
        <div>
          <div class="l-testimonial-row__name">{{name3}}</div>
          <div class="l-testimonial-row__role">{{role3}}</div>
        </div>
      </figcaption>
    </figure>
  </div>
</section>`,
  css: `/* Layout: testimonial-row — structure only */
.l-testimonial-row {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-testimonial-row__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-testimonial-row__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
}
@media (max-width: 768px) {
  .l-testimonial-row__grid {
    grid-template-columns: 1fr;
  }
}
.l-testimonial-row__card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}
.l-testimonial-row__quote {
  font-style: italic;
  margin: 0 0 var(--spacing-4);
}
.l-testimonial-row__author {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}
.l-testimonial-row__name {
  font-weight: 600;
}
.l-testimonial-row__role {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
}`,
};