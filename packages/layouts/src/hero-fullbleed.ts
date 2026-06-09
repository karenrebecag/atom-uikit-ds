/**
 * Layout: hero-fullbleed
 *
 * Imagen a sangre completa con overlay oscuro y contenido blanco encima. Impacto maximo.
 * Structure-only. References DS components by BEM class.
 */

export const heroFullbleed = {
  slug: 'hero-fullbleed',
  name: 'Hero Fullbleed',
  description:
    'Imagen a sangre completa con overlay oscuro y contenido blanco encima. Impacto maximo. Structure only.',
  components: ['chip', 'button', 'typography'],
  html: `<!-- Layout: hero-fullbleed -->
<section class="l-hero-fullbleed" style="background-image: url('{{background}}')">
  <div class="l-hero-fullbleed__overlay"></div>
  <div class="l-hero-fullbleed__content">
    <span class="chip chip--outlined chip--s">
      <span class="chip__dot"></span>
      <span class="chip__label">{{eyebrow}}</span>
    </span>
    <h1 class="l-hero-fullbleed__headline">{{headline}}</h1>
    <p class="l-hero-fullbleed__subtitle">{{subtitle}}</p>
    <div class="l-hero-fullbleed__actions">
      <a href="{{cta_primary_href}}" class="button button--primary button--l">
        <span class="button__label">{{primaryCta}}</span>
      </a>
    </div>
  </div>
</section>`,
  css: `/* Layout: hero-fullbleed — structure only */
.l-hero-fullbleed {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  color: white;
  padding: var(--spacing-20) var(--spacing-8);
}
.l-hero-fullbleed__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65));
}
.l-hero-fullbleed__content {
  position: relative;
  z-index: 1;
  max-width: 640px;
}
.l-hero-fullbleed__headline {
  font-size: var(--text-5xl);
  line-height: 1.1;
  margin: var(--spacing-4) 0;
}
.l-hero-fullbleed__subtitle {
  max-width: 520px;
  margin-bottom: var(--spacing-6);
}
.l-hero-fullbleed__actions {
  display: flex;
  gap: var(--spacing-3);
}`,
};