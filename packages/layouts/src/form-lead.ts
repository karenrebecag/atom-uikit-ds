/**
 * Layout: form-lead
 *
 * Anatomia del formulario de lead (nombre, email, telefono, aceptacion).
 * Structure-only: rejilla propia, pintura de field/input/checkbox/button del DS.
 * Atributos data-atom-form-* para el motor @atom-uikit/forms.
 */

export const formLead = {
  slug: 'form-lead',
  name: 'Formulario de lead',
  description:
    'Formulario de captura lead-basic: titular, nombre, email, telefono, aceptacion y envio. Structure only. El motor se engancha por data-atom-form.',
  components: ['field', 'input', 'checkbox', 'button'],
  html: `<!-- Layout: form-lead -->
<section class="l-form-lead">
  <h2 class="l-form-lead__headline">{{headline}}</h2>
  <form
    class="l-form-lead__form"
    method="post"
    novalidate
    data-atom-form="lead-basic"
    data-atom-form-landing="{{landingId}}"
    data-atom-form-lang="{{locale}}"
  >
    <div data-atom-form-status role="alert" tabindex="-1"></div>
    <input type="hidden" name="trap" data-atom-field="trap" autocomplete="off" tabindex="-1" aria-hidden="true" />
    <div class="l-form-lead__fields">
      <div class="field">
        <label class="field__label field__label--required" for="atom-field-name">{{name}}</label>
        <input
          id="atom-field-name"
          class="input"
          type="text"
          name="name"
          data-atom-field="name"
          autocomplete="name"
          aria-required="true"
          aria-describedby="atom-field-name-error"
        />
        <p class="field__error" id="atom-field-name-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field">
        <label class="field__label field__label--required" for="atom-field-email">{{email}}</label>
        <input
          id="atom-field-email"
          class="input"
          type="email"
          name="email"
          data-atom-field="email"
          autocomplete="email"
          aria-required="true"
          aria-describedby="atom-field-email-error"
        />
        <p class="field__error" id="atom-field-email-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field">
        <label class="field__label field__label--required" for="atom-field-phone">{{phone}}</label>
        <input
          id="atom-field-phone"
          class="input"
          type="tel"
          name="phone"
          data-atom-field="phone"
          autocomplete="tel"
          inputmode="tel"
          aria-required="true"
          aria-describedby="atom-field-phone-error"
        />
        <p class="field__error" id="atom-field-phone-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field">
        <label class="checkbox" for="atom-field-acceptance">
          <input
            id="atom-field-acceptance"
            class="checkbox__input"
            type="checkbox"
            name="acceptance"
            data-atom-field="acceptance"
            aria-required="true"
            aria-describedby="atom-field-acceptance-error"
          />
          <span class="checkbox__box">
            <span class="checkbox__icon">
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </span>
          <span class="checkbox__label">{{acceptance}}</span>
        </label>
        <p class="field__error" id="atom-field-acceptance-error" role="alert" aria-live="polite"></p>
      </div>
    </div>
    <div class="l-form-lead__actions">
      <button type="submit" class="button button--primary button--m">
        <span class="button__label">{{submitCta}}</span>
        <span class="button__spinner" aria-hidden="true">
          <span class="button__spinner-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity="0.25" stroke-width="2" />
              <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  </form>
</section>`,
  css: `/* Layout: form-lead — structure only */
.l-form-lead {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}
.l-form-lead__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}
.l-form-lead__fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}
.l-form-lead__actions {
  display: flex;
}`,
};
