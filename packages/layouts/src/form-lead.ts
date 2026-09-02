/**
 * Layout: form-lead
 *
 * Anatomia del formulario de lead: diez campos (nombre, email, whatsapp, empresa, cargo,
 * pais, leads mensuales, objetivo, sitio web opcional y aceptacion).
 *
 * Espejo exacto del componente `Form / Lead` del master de Webflow. Si divergen, el
 * siguiente que copie esta anatomia construye algo que no es lo que hay publicado.
 *
 * Cuatro cosas que este markup tiene por restricciones REALES de Webflow, verificadas el
 * 2026-09-02, no por gusto:
 *
 * 1. El landingId y el locale llegan por CONTENIDO de dos elementos fuente. Webflow no
 *    bindea el VALOR de un atributo a un campo de CMS (400: value must be a string or a
 *    binding) y las catorce landings comparten una sola Collection Page.
 * 2. El grupo y su hueco de error se marcan con data-atom-field-group y
 *    data-atom-field-error. Webflow descarta toda clase para la que no tenga regla CSS
 *    propia, asi que el motor no puede depender de nombres de clase para encontrarlos.
 * 3. Todas las clases van prefijadas. Una clase llamada `input` en el master se vuelve
 *    global y viaja a la Shared Library.
 * 4. El <form> se vuelve Form Block de Webflow pase lo que pase; el motor descarta los
 *    listeners ajenos al montar, y por eso initAll() TIENE que correr despues de Webflow:
 *      window.Webflow = window.Webflow || [];
 *      window.Webflow.push(function () { AtomForms.initAll(); });
 *
 * Los <option> de los cuatro selects los pinta el consumidor y sus valores tienen que ser
 * identicos a packages/forms/src/data/options.ts.
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
  <form class="l-form-lead__form" novalidate data-atom-form="lead-basic">
    <span class="l-form-lead__source" data-atom-form-landing-source>{{landingId}}</span>
    <span class="l-form-lead__source" data-atom-form-lang-source>{{locale}}</span>
    <p class="l-form-lead__status" data-atom-form-status role="alert" tabindex="-1"></p>
    <input type="hidden" name="trap" data-atom-field="trap" autocomplete="off" tabindex="-1" aria-hidden="true" />
    <div class="l-form-lead__fields">
      <div class="l-form-lead__field l-form-lead__full" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-nombre">{{nombre}}</label>
        <input
          id="atom-field-nombre"
          class="l-form-lead__input"
          type="text"
          name="nombre"
          data-atom-field="nombre"
          autocomplete="name"
          aria-required="true"
          aria-describedby="atom-field-nombre-error"
        />
        <p class="l-form-lead__error" id="atom-field-nombre-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-email">{{email}}</label>
        <input
          id="atom-field-email"
          class="l-form-lead__input"
          type="email"
          name="email"
          data-atom-field="email"
          autocomplete="email"
          aria-required="true"
          aria-describedby="atom-field-email-error"
        />
        <p class="l-form-lead__error" id="atom-field-email-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-whatsapp">{{whatsapp}}</label>
        <input
          id="atom-field-whatsapp"
          class="l-form-lead__input"
          type="tel"
          name="whatsapp"
          data-atom-field="whatsapp"
          autocomplete="tel"
          inputmode="tel"
          aria-required="true"
          aria-describedby="atom-field-whatsapp-error"
        />
        <p class="l-form-lead__error" id="atom-field-whatsapp-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-empresa">{{empresa}}</label>
        <input
          id="atom-field-empresa"
          class="l-form-lead__input"
          type="text"
          name="empresa"
          data-atom-field="empresa"
          autocomplete="organization"
          aria-required="true"
          aria-describedby="atom-field-empresa-error"
        />
        <p class="l-form-lead__error" id="atom-field-empresa-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-cargo">{{cargo}}</label>
        <select
          id="atom-field-cargo"
          class="l-form-lead__input"
          name="cargo"
          data-atom-field="cargo"
          aria-required="true"
          aria-describedby="atom-field-cargo-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="l-form-lead__error" id="atom-field-cargo-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-pais">{{pais}}</label>
        <select
          id="atom-field-pais"
          class="l-form-lead__input"
          name="pais"
          data-atom-field="pais"
          autocomplete="country"
          aria-required="true"
          aria-describedby="atom-field-pais-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="l-form-lead__error" id="atom-field-pais-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-leads_mensuales">{{leadsMensuales}}</label>
        <select
          id="atom-field-leads_mensuales"
          class="l-form-lead__input"
          name="leads_mensuales"
          data-atom-field="leads_mensuales"
          aria-required="true"
          aria-describedby="atom-field-leads_mensuales-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="l-form-lead__error" id="atom-field-leads_mensuales-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field l-form-lead__full" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-objetivo">{{objetivo}}</label>
        <select
          id="atom-field-objetivo"
          class="l-form-lead__input"
          name="objetivo"
          data-atom-field="objetivo"
          aria-required="true"
          aria-describedby="atom-field-objetivo-error"
        >
          <option value="">{{selectPlaceholder}}</option>
        </select>
        <p class="l-form-lead__error" id="atom-field-objetivo-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field l-form-lead__full" data-atom-field-group>
        <label class="l-form-lead__label" for="atom-field-sitio_web">{{sitioWeb}} <span class="l-form-lead__hint">{{opcional}}</span></label>
        <input
          id="atom-field-sitio_web"
          class="l-form-lead__input"
          type="text"
          name="sitio_web"
          data-atom-field="sitio_web"
          autocomplete="url"
          inputmode="url"
          aria-describedby="atom-field-sitio_web-error"
        />
        <p class="l-form-lead__error" id="atom-field-sitio_web-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
      <div class="l-form-lead__field l-form-lead__full" data-atom-field-group>
        <label class="l-form-lead__check" for="atom-field-aceptacion">
          <input
            id="atom-field-aceptacion"
            class="l-form-lead__check-input"
            type="checkbox"
            name="aceptacion"
            data-atom-field="aceptacion"
            aria-required="true"
            aria-describedby="atom-field-aceptacion-error"
          />
          <span>{{aceptacionPrefijo}}<a class="l-form-lead__legal" href="{{privacyUrl}}" target="_blank" rel="noopener noreferrer">{{aceptacionEnlace}}</a></span>
        </label>
        <p class="l-form-lead__error" id="atom-field-aceptacion-error" data-atom-field-error role="alert" aria-live="polite"></p>
      </div>
    </div>
    <div class="l-form-lead__actions">
      <button type="submit" class="l-form-lead__button"><span>{{submitCta}}</span></button>
    </div>
  </form>
</section>`,
  css: `/* Layout: form-lead
   Todas las clases van prefijadas al layout, sin excepcion. En Webflow una clase llamada
   \`input\` o \`button\` se vuelve global del sitio y viaja a la Shared Library, donde choca
   con las de cada consumidor: es la colision que motivo el ADR 006. */
.l-form-lead { display: flex; flex-direction: column; gap: var(--spacing-6); }
.l-form-lead__form { display: flex; flex-direction: column; gap: var(--spacing-6); }
/* Fuentes de CMS: en el DOM, fuera del flujo y del arbol de accesibilidad. No se usa
   [hidden] porque el Designer trata un Text Block bindeado y oculto como contenido
   vacio y puede podarlo. */
.l-form-lead__source {
  position: absolute; width: 1px; height: 1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap;
}
.l-form-lead__status { margin: 0; font-size: var(--font-size-sm); color: var(--destructive); }
.l-form-lead__fields { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-4); }
.l-form-lead__full { grid-column: 1 / -1; }
.l-form-lead__field { display: flex; flex-direction: column; gap: var(--spacing-2); }
.l-form-lead__label { font-size: var(--font-size-sm); font-weight: 500; color: var(--foreground); }
.l-form-lead__hint { color: var(--muted-foreground); font-weight: 400; }
.l-form-lead__input {
  width: 100%; height: 2.5rem;
  padding-left: var(--spacing-3); padding-right: var(--spacing-3);
  font-size: var(--font-size-base); color: var(--foreground);
  background-color: var(--background);
  border: var(--stroke-hairline) solid var(--input);
  border-radius: var(--radius-md);
}
.l-form-lead__error { margin: 0; font-size: var(--font-size-sm); color: var(--destructive); }
.l-form-lead__check {
  display: flex; align-items: flex-start; gap: var(--spacing-2);
  font-size: var(--font-size-sm); color: var(--muted-foreground);
}
.l-form-lead__check-input { width: 1.125rem; height: 1.125rem; margin-top: 2px; flex: none; }
.l-form-lead__legal { color: var(--foreground); text-decoration: underline; }
.l-form-lead__actions { display: flex; }
.l-form-lead__button {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--spacing-2);
  height: 3rem;
  padding-left: var(--spacing-8); padding-right: var(--spacing-8);
  font-size: var(--font-size-base); font-weight: 500;
  color: var(--primary-foreground); background-color: var(--primary);
  border-style: none; border-radius: var(--radius-md); cursor: pointer;
}
/* Webflow solo admite SUS breakpoints, asi que el responsive va desktop-first. */
@media screen and (max-width: 767px) {
  .l-form-lead__fields { grid-template-columns: 1fr; }
}`,
};
