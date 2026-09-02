# Brief Webflow — Formulario de lead (`form-lead`)

Para una persona. **Nadie de este programa toca Webflow.** Este archivo dice qué
construir en el master y cómo se bindea. No es una acción.

## Qué crear en el master

Un componente en el grupo **Atom DS**, nombre sugerido **Form / Lead**.

No usar el Form Block nativo de Webflow: engancha su propio envío al store de
Webflow. Construir con un elemento **Form** (o un `form` HTML) de elementos
normales: labels, inputs, checkbox, botón. `novalidate` en el form. **Sin
`action`** hacia el validador — el endpoint vive en el bundle, no en el canvas.

Publicarlo en la Shared Library **Atom UIKit** cuando el componente esté fiel
en el master.

## Canvas del Designer

El canvas **no carga** `/v1/embed.css` ni `/v1/foundation.css`. El componente
tiene que verse con las Variables de la colección **Atom DS v1** (y el modo
`dark` si aplica). Pintar solo con esas variables: color, radius, spacing,
tipografía. No depender de clases CSS externas para que el canvas sea
reconocible.

En la página publicada el consumidor carga el CSS del DS (`/v1/embed.css` en
migraciones parciales bajo `.atom-embed`, o `/v1/foundation.css` en sitios
greenfield) y el bundle de forms pinneado. Ahí es donde `.field`, `.input`,
`.checkbox` y `.button` pintan de verdad.

## Anatomía (espejo de `layout/form-lead`)

Orden:

1. Titular
2. `<form>` con los atributos de abajo
3. Banner de estado (vacío)
4. Honeypot `trap` (`type="hidden"`)
5. Campos: nombre, email, teléfono, aceptación
6. Botón submit (con spinner en el markup, oculto hasta `.button--loading`)

Cada campo: `.field` > `.field__label` + control + `.field__error`.
Aceptación: `.field` > `.checkbox` (anatomía del DS) + `.field__error`.
No poner `data-invalid` al montar: lo pone el motor.

## Props / slots (CMS)

| Prop | Slot | Qué es | CMS |
|---|---|---|---|
| Headline | `headline` | Titular sobre el form | Texto de la landing |
| Name label | `name` | Etiqueta del nombre | Traducción / copy |
| Email label | `email` | Etiqueta del correo | Traducción / copy |
| Phone label | `phone` | Etiqueta del teléfono | Traducción / copy |
| Acceptance | `acceptance` | Texto legal (slot, no copy de cliente horneado) | Política de privacidad |
| Submit CTA | `submitCta` | Texto del botón | Traducción / copy |
| Landing id | `landingId` | Identificador de landing, **no** destino | Campo CMS por landing. Allowlist en el validador |
| Locale | `locale` | `es` \| `pt` \| `en` | Campo o locale de la página |

El destino (Attio, Sheets, etc.) **no** es prop ni atributo.

## Atributos que el componente escribe

En el `<form>` (o en un host que lo envuelva):

| Atributo | Valor | Notas |
|---|---|---|
| `data-atom-form` | `lead-basic` | Fijo. Es el `formKey`. |
| `data-atom-form-landing` | valor de `landingId` | Bindeado al CMS. Vacío = el motor no envía. |
| `data-atom-form-lang` | valor de `locale` | Bindeado al CMS / locale. Desconocido cae a `es`. |
| `novalidate` | presente | La validación es del bundle. |
| `method` | `post` (opcional) | Sin `action`. |

En cada control:

| Atributo | Valor |
|---|---|
| `data-atom-field` | `name` \| `email` \| `phone` \| `acceptance` |
| `name` | igual que `data-atom-field` en lead-basic |
| `id` | `atom-field-{schemaKey}` |
| `aria-describedby` | `atom-field-{schemaKey}-error` |

Honeypot: `name="trap"` y `data-atom-field="trap"`, `type="hidden"`,
`autocomplete="off"`, `aria-hidden="true"`, `tabindex="-1"`.

Banner: `[data-atom-form-status]`, `role="alert"`, `tabindex="-1"`. Vacío al
montar. El motor lo crea si falta.

Submit: `type="submit"`, clases `button button--primary button--m`, spinner
dentro (`.button__spinner` / `.button__spinner-icon`). El motor pone
`aria-busy` y `.button--loading`. **No** `disabled` en carga.

## Qué se bindea al CMS

Copy: headline, labels, texto legal, CTA.

No se bindea: URL del validador, credenciales, nombre de plataforma, `action`.

### El `landingId` NO viaja por atributo

Webflow **no deja bindear el valor de un atributo** a un campo de colección ni a
una prop de componente: devuelve `400 · value must be a string or a binding`.
Verificado el 2026-09-02. Y las catorce landings comparten **una sola** Collection
Page, así que el atributo tampoco puede ser fijo.

El contenido de texto sí se bindea. Por eso el componente lleva dos elementos
fuente: atributo fijo, texto del CMS.

| Elemento | Atributo (fijo) | Texto (bindeado) |
|---|---|---|
| Text Block oculto | `data-atom-form-landing-source` | campo `landing-id` |
| Text Block oculto | `data-atom-form-lang-source` | campo `idioma` |

Van dentro del `<form>`. Ocultarlos con la clase de utilidad del DS o
`display:none` — **no** con `hidden` sobre un Text Block bindeado, porque el
Designer lo trata como contenido vacío y puede podarlo.

El bundle prueba primero `data-atom-form-landing` / `data-atom-form-lang` y solo
cae al elemento fuente si el atributo falta, así que fuera de Webflow el atributo
sigue siendo la vía normal. Cubierto en `test/cms-source.test.ts`.

Un `landing-id` vacío deja el campo vacío y el motor **no envía** (I7): es
preferible perder un lead a mandarlo sin atribución, porque el validador lo
rechazaría igual contra su allowlist.

## Los diez campos

| # | `schemaKey` = `name` | Control | `colSpan` | Req. |
|---|---|---|---|---|
| 1 | `nombre` | text | 100 | sí |
| 2 | `email` | email | 50 | sí |
| 3 | `whatsapp` | tel | 50 | sí |
| 4 | `empresa` | text | 50 | sí |
| 5 | `cargo` | select | 50 | sí |
| 6 | `pais` | select (searchable) | 50 | sí |
| 7 | `leads_mensuales` | select | 50 | sí |
| 8 | `objetivo` | select | 100 | sí |
| 9 | `sitio_web` | text | 100 | **no** |
| 10 | `aceptacion` | checkbox | 100 | sí |

Las OPCIONES de los cuatro selects se pintan en el markup de Webflow y sus
valores tienen que ser **idénticos** a `packages/forms/src/data/options.ts`. El
`<option>` inicial va vacío con el texto de `selectPlaceholder`: obliga a elegir
en vez de aceptar un default silencioso.

La aceptación se compone en dos partes, no como un HTML crudo: texto
(`aceptacionPrefijo`) + enlace al aviso de privacidad (`aceptacionEnlace`). El
`href` es distinto por idioma — en portugués es OTRO documento por LGPD, no una
traducción.

Solo `sitio_web` lleva la marca de opcional. Se marca lo opcional, no lo
requerido: es uno de diez.

## Script en la página publicada (no en el canvas)

Bundle pinneado con SRI, diferido, global `AtomForms`. Versión concreta, no
canal rodante `/v1/forms.js`. Tras cargar: `AtomForms.initAll()`. Cero JS por
página además de eso.

El thank-you (`.empty` / `.empty__title` / `.empty__description`) lo monta el
bundle tras éxito. No va en el componente del Designer.

## Fuera de alcance de este brief

Aplicar el componente, sincronizar variables, publicar la Library, pegar el
script. Eso lo hace una persona con acceso al master, no un agente.
