/**
 * Layout: contact-form
 *
 * Dos columnas: info de contacto izquierda (canales), formulario derecha (nombre, email, mensaje).
 * Structure-only. References DS components by BEM class.
 */

export const contactForm = {
  slug: 'contact-form',
  name: 'Contacto con formulario',
  description:
    'Dos columnas: info de contacto izquierda (canales), formulario derecha (nombre, email, mensaje). Structure only.',
  components: ['field', 'input', 'textarea', 'button', 'item', 'typography'],
  html: `<!-- Layout: contact-form -->
<section class="l-contact-form">
  <div class="l-contact-form__info">
    <h2 class="l-contact-form__headline">{{headline}}</h2>
    <p class="l-contact-form__subtitle">{{subtitle}}</p>
    <div class="l-contact-form__channels">
      <div class="item">
        <div class="l-contact-form__icon"><!-- icon --></div>
        <div>
          <div class="l-contact-form__channel-label">{{channel1_label}}</div>
          <div class="l-contact-form__channel-value">{{channel1_value}}</div>
        </div>
      </div>
    </div>
  </div>
  <form class="l-contact-form__form">
    <div class="field">
      <label>Nombre</label>
      <input type="text" class="input" />
    </div>
    <div class="field">
      <label>Email</label>
      <input type="email" class="input" />
    </div>
    <div class="field">
      <label>Mensaje</label>
      <textarea class="textarea"></textarea>
    </div>
    <button type="submit" class="button button--primary button--m">
      <span class="button__label">{{submitCta}}</span>
    </button>
  </form>
</section>`,
  css: `/* Layout: contact-form — structure only */
.l-contact-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
}
@media (max-width: 768px) {
  .l-contact-form {
    grid-template-columns: 1fr;
  }
}
.l-contact-form__headline {
  font-size: var(--text-xl);
}
.l-contact-form__subtitle {
  color: var(--muted-foreground);
}
.l-contact-form__channels {
  margin-top: var(--spacing-4);
}
.l-contact-form__channel-label {
  font-weight: 600;
}
.l-contact-form__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}`,
};