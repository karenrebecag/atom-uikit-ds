/**
 * Layout: footer-newsletter
 *
 * Footer de columnas + bloque de suscripcion (input email + boton) arriba.
 * Structure-only. References DS components by BEM class.
 */

export const footerNewsletter = {
  slug: 'footer-newsletter',
  name: 'Footer con newsletter',
  description:
    'Footer de columnas + bloque de suscripcion (input email + boton) arriba. Structure only.',
  components: ['nav-link', 'input', 'button', 'typography', 'divider', 'image'],
  html: `<!-- Layout: footer-newsletter -->
<footer class="l-footer-newsletter">
  <div class="l-footer-newsletter__newsletter">
    <h4 class="l-footer-newsletter__newsletter-heading">{{newsletterHeading}}</h4>
    <p class="l-footer-newsletter__newsletter-body">{{newsletterBody}}</p>
    <form class="l-footer-newsletter__form">
      <input type="email" placeholder="tu@email.com" class="input" />
      <button type="submit" class="button button--primary button--m">
        <span class="button__label">{{newsletterCta}}</span>
      </button>
    </form>
  </div>
  <div class="l-footer-newsletter__brand">
    <img src="{{logo}}" alt="Logo" class="image" />
  </div>
  <div class="l-footer-newsletter__cols">
    <div class="l-footer-newsletter__col">
      <h4 class="l-footer-newsletter__col-title">{{col1_title}}</h4>
      <a href="{{link1_url}}" class="nav-link">{{link1_label}}</a>
      <a href="{{link2_url}}" class="nav-link">{{link2_label}}</a>
    </div>
    <div class="l-footer-newsletter__col">
      <h4 class="l-footer-newsletter__col-title">{{col2_title}}</h4>
      <a href="{{link3_url}}" class="nav-link">{{link3_label}}</a>
      <a href="{{link4_url}}" class="nav-link">{{link4_label}}</a>
    </div>
  </div>
  <div class="l-footer-newsletter__legal">
    <hr class="divider" />
    <p>{{legal}}</p>
  </div>
</footer>`,
  css: `/* Layout: footer-newsletter — structure only */
.l-footer-newsletter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
  border-top: 1px solid var(--border);
}
.l-footer-newsletter__newsletter {
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}
.l-footer-newsletter__newsletter-heading {
  font-size: var(--text-lg);
  font-weight: 600;
}
.l-footer-newsletter__form {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
}
.l-footer-newsletter__brand {
  max-width: 200px;
}
.l-footer-newsletter__cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-8);
}
@media (max-width: 768px) {
  .l-footer-newsletter__cols {
    grid-template-columns: 1fr;
  }
}
.l-footer-newsletter__col-title {
  font-weight: 600;
  margin-bottom: var(--spacing-2);
}
.l-footer-newsletter__legal {
  margin-top: var(--spacing-4);
}`,
};