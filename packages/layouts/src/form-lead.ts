/**
 * Layout: form-lead
 *
 * Anatomia del formulario de lead: diez campos (nombre, email, whatsapp, empresa,
 * cargo, pais, leads mensuales, objetivo, sitio web opcional y aceptacion).
 * Structure-only: rejilla propia, pintura de field/input/checkbox/button del DS.
 * Atributos data-atom-form-* para el motor @atom-uikit/forms.
 *
 * El landingId y el locale NO viajan por atributo: ver el comentario en el html.
 *
 * Los <option> de los cuatro selects los pinta el consumidor y sus valores tienen que
 * ser identicos a packages/forms/src/data/options.ts. El placeholder inicial va vacio
 * para obligar a elegir en vez de aceptar un default silencioso.
 */

export const formLead = {
  slug: 'form-lead',
  name: 'Formulario de lead',
  description:
    'Formulario de captura lead-basic: titular, diez campos y envio. Structure only. El motor se engancha por data-atom-form.',
  components: ['field', 'input', 'checkbox', 'button'],
  html: `<!-- Layout: form-lead -->
<section class="l-form-lead">
  <h2 class="l-form-lead__headline">{{headline}}</h2>
  <form
    class="l-form-lead__form"
    method="post"
    novalidate
    data-atom-form="lead-basic"
  >
    <!--
      Webflow no deja bindear el VALOR de un atributo a un campo de CMS
      (400: value must be a string or a binding) y las landings comparten una sola
      Collection Page. El CONTENIDO de texto si se bindea: atributo fijo, texto del CMS.
      Ocultos por CSS, no con [hidden]: el Designer poda un Text Block bindeado y marcado
      como hidden tratandolo como contenido vacio.
    -->
    <span class="l-form-lead__source" data-atom-form-landing-source>{{landingId}}</span>
    <span class="l-form-lead__source" data-atom-form-lang-source>{{locale}}</span>
    <div data-atom-form-status role="alert" tabindex="-1"></div>
    <input type="hidden" name="trap" data-atom-field="trap" autocomplete="off" tabindex="-1" aria-hidden="true" />
    <div class="l-form-lead__fields">
      <div class="field" data-col="100">
        <label class="field__label field__label--required" for="atom-field-nombre">{{nombre}}</label>
        <input
          id="atom-field-nombre"
          class="input"
          type="text"
          name="nombre"
          data-atom-field="nombre"
          autocomplete="name"
          aria-required="true"
          aria-describedby="atom-field-nombre-error"
        />
        <p class="field__error" id="atom-field-nombre-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="50">
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
      <div class="field" data-col="50">
        <label class="field__label field__label--required" for="atom-field-whatsapp">{{whatsapp}}</label>
        <input
          id="atom-field-whatsapp"
          class="input"
          type="tel"
          name="whatsapp"
          data-atom-field="whatsapp"
          autocomplete="tel"
          inputmode="tel"
          aria-required="true"
          aria-describedby="atom-field-whatsapp-error"
        />
        <p class="field__error" id="atom-field-whatsapp-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="50">
        <label class="field__label field__label--required" for="atom-field-empresa">{{empresa}}</label>
        <input
          id="atom-field-empresa"
          class="input"
          type="text"
          name="empresa"
          data-atom-field="empresa"
          autocomplete="organization"
          aria-required="true"
          aria-describedby="atom-field-empresa-error"
        />
        <p class="field__error" id="atom-field-empresa-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="50">
        <label class="field__label field__label--required" for="atom-field-cargo">{{cargo}}</label>
        <select
          id="atom-field-cargo"
          class="input input--select"
          name="cargo"
          data-atom-field="cargo"
          aria-required="true"
          aria-describedby="atom-field-cargo-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="field__error" id="atom-field-cargo-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="50">
        <label class="field__label field__label--required" for="atom-field-pais">{{pais}}</label>
        <select
          id="atom-field-pais"
          class="input input--select"
          name="pais"
          data-atom-field="pais" autocomplete="country"
          aria-required="true"
          aria-describedby="atom-field-pais-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="field__error" id="atom-field-pais-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="50">
        <label class="field__label field__label--required" for="atom-field-leads_mensuales">{{leadsMensuales}}</label>
        <select
          id="atom-field-leads_mensuales"
          class="input input--select"
          name="leads_mensuales"
          data-atom-field="leads_mensuales"
          aria-required="true"
          aria-describedby="atom-field-leads_mensuales-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="field__error" id="atom-field-leads_mensuales-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="100">
        <label class="field__label field__label--required" for="atom-field-objetivo">{{objetivo}}</label>
        <select
          id="atom-field-objetivo"
          class="input input--select"
          name="objetivo"
          data-atom-field="objetivo"
          aria-required="true"
          aria-describedby="atom-field-objetivo-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="field__error" id="atom-field-objetivo-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="100">
        <label class="field__label" for="atom-field-sitio_web">{{sitioWeb}} <span class="field__hint">{{opcional}}</span></label>
        <input
          id="atom-field-sitio_web"
          class="input"
          type="text"
          name="sitio_web"
          data-atom-field="sitio_web"
          autocomplete="url"
          inputmode="url"
          aria-describedby="atom-field-sitio_web-error"
        />
        <p class="field__error" id="atom-field-sitio_web-error" role="alert" aria-live="polite"></p>
      </div>
      <div class="field" data-col="100">
        <label class="checkbox" for="atom-field-aceptacion">
          <input
            id="atom-field-aceptacion"
            class="checkbox__input"
            type="checkbox"
            name="aceptacion"
            data-atom-field="aceptacion"
            aria-required="true"
            aria-describedby="atom-field-aceptacion-error"
          />
          <span class="checkbox__box">
            <span class="checkbox__icon">
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </span>
          <span class="checkbox__label">{{aceptacionPrefijo}}<a class="l-form-lead__legal" href="{{privacyUrl}}" target="_blank" rel="noopener noreferrer">{{aceptacionEnlace}}</a></span>
        </label>
        <p class="field__error" id="atom-field-aceptacion-error" role="alert" aria-live="polite"></p>
      </div>
    </div>
    <div class="l-form-lead__actions">
      <button type="submit" class="button button--primary button--l">
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
/* Fuentes de CMS: presentes en el DOM, fuera del flujo y del arbol de accesibilidad.
   No se usa [hidden] porque el Designer lo trata como contenido vacio y lo poda. */
.l-form-lead__source {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
/* Doce columnas para que data-col reparta sin fracciones raras: 50 -> 6, 100 -> 12. */
.l-form-lead__fields {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--spacing-4);
}
.l-form-lead__fields > .field {
  grid-column: span 12;
}
@media (min-width: 768px) {
  .l-form-lead__fields > .field[data-col='50'] {
    grid-column: span 6;
  }
}
.l-form-lead__actions {
  display: flex;
}
.l-form-lead__legal {
  color: inherit;
  text-decoration: underline;
}`,
};
