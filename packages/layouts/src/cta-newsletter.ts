/**
 * Layout: cta-newsletter
 *
 * Captura de email: titular + input + boton, centrado. Para blogs y contenido.
 * Structure-only. References DS components by BEM class.
 */

export const ctaNewsletter = {
  slug: 'cta-newsletter',
  name: 'CTA Newsletter',
  description:
    'Captura de email: titular + input + boton, centrado. Para blogs y contenido. Structure only.',
  components: ['input', 'button', 'typography'],
  html: `<!-- Layout: cta-newsletter -->
<section class="l-cta-newsletter">
  <div class="l-cta-newsletter__content">
    <h2 class="l-cta-newsletter__headline">{{headline}}</h2>
    <p class="l-cta-newsletter__subtitle">{{subtitle}}</p>
    <form class="l-cta-newsletter__form">
      <input type="email" placeholder="tu@email.com" class="input" />
      <button type="submit" class="button button--primary button--m">
        <span class="button__label">{{cta}}</span>
      </button>
    </form>
    <p class="l-cta-newsletter__privacy">{{privacyNote}}</p>
  </div>
</section>`,
  css: `/* Layout: cta-newsletter — structure only */
.l-cta-newsletter {
  text-align: center;
  padding: var(--spacing-12) var(--spacing-8);
  max-width: 480px;
  margin: 0 auto;
}
.l-cta-newsletter__headline {
  font-size: var(--text-xl);
}
.l-cta-newsletter__subtitle {
  color: var(--muted-foreground);
}
.l-cta-newsletter__form {
  display: flex;
  gap: var(--spacing-2);
  margin: var(--spacing-4) 0;
}
.l-cta-newsletter__privacy {
  font-size: var(--text-xs);
  color: var(--muted-foreground);
}`,
};