/**
 * Layout: testimonial-spotlight
 *
 * Una sola cita grande centrada con avatar, nombre, rol y logo del cliente. Maximo peso.
 * Structure-only. References DS components by BEM class.
 */

export const testimonialSpotlight = {
  slug: 'testimonial-spotlight',
  name: 'Testimonio Spotlight',
  description:
    'Una sola cita grande centrada con avatar, nombre, rol y logo del cliente. Maximo peso. Structure only.',
  components: ['avatar', 'typography', 'image'],
  html: `<!-- Layout: testimonial-spotlight -->
<section class="l-testimonial-spotlight">
  <blockquote class="l-testimonial-spotlight__quote">{{quote}}</blockquote>
  <div class="l-testimonial-spotlight__author">
    <img src="{{avatar}}" alt="" class="avatar avatar--s" />
    <div>
      <div class="l-testimonial-spotlight__name">{{name}}</div>
      <div class="l-testimonial-spotlight__role">{{role}}</div>
    </div>
    <img src="{{companyLogo}}" alt="" class="image l-testimonial-spotlight__logo" />
  </div>
</section>`,
  css: `/* Layout: testimonial-spotlight — structure only */
.l-testimonial-spotlight {
  text-align: center;
  padding: var(--spacing-12) var(--spacing-8);
  max-width: 720px;
  margin: 0 auto;
}
.l-testimonial-spotlight__quote {
  font-size: var(--text-2xl);
  font-style: italic;
  margin-bottom: var(--spacing-6);
}
.l-testimonial-spotlight__author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
}
.l-testimonial-spotlight__name {
  font-weight: 600;
}
.l-testimonial-spotlight__role {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
}
.l-testimonial-spotlight__logo {
  height: 24px;
  margin-left: var(--spacing-4);
}`,
};