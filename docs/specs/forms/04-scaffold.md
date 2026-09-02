# 04 · Scaffold

Árbol objetivo. **La línea de comentario de cada archivo es su contrato de intención**: si
lo que escribes ahí no cabe en esa frase, el archivo está mal cortado o falta uno.

Un agente no crea archivos que no estén aquí. Si cree que falta uno, lo anota en
`08-brechas.md` y sigue con lo que sí está.

## `packages/forms/`

```
packages/forms/
├── package.json          # Nombre @atom-uikit/forms, build tsup a IIFE + ESM, deps: solo zod.
├── tsconfig.json         # Extiende el base del repo. strict true. Sin excepciones locales.
├── tsup.config.ts        # Dos salidas: IIFE global AtomForms para CDN, ESM para consumidores Node.
├── vitest.config.ts      # Entorno jsdom para core y ui; node para schemas y transport.
├── README.md             # Cómo se consume: el snippet, los atributos, y nada de arquitectura.
└── AUDIT.md              # Lo escribe SOLO el auditor. Ningún otro agente lo toca.
```

### `src/` — raíz

```
src/
├── index.ts       # API pública y única. Exporta initAll, registerForm, tipos. Monta el global.
└── auto-init.ts   # Escanea [data-atom-form], resuelve config y monta. Idempotente: marca
                   # data-atom-form-init y llamarlo dos veces no duplica listeners.
```

### `src/core/` — el motor, sin transporte

Dueño: `core-extractor`. **No importa nada de `transport/`** (invariante I5).

```
src/core/
├── types.ts     # FieldDef como unión discriminada: fuente única de render, name de envío y
│                # schemaKey. FormConfig, FormInstance, IntegrationHook. Cero tipos de Elementor.
├── registry.ts  # Map de formKey → FormConfig. registerForm / getForm. Avisa al sobreescribir.
├── engine.ts    # Orquesta: validación en vivo, submit, estados, errores, thank-you. Recibe el
│                # submitter inyectado; no sabe a dónde va la data. Es el corazón del paquete.
├── dom.ts       # Lectura y escritura del formulario: collectValues, setLoading, getField.
│                # Toda consulta al DOM pasa por aquí; ningún otro módulo hace querySelector.
└── errors.ts    # Traduce fallos a estado visual: zod → errores por campo, sobre del servidor →
                 # errores por campo, foco al primero. No inventa mensajes: los toma del dict.
```

### `src/schemas/` — el contrato compartido

Dueño: `contract-schema`. Todo lo de aquí debe importarse tal cual desde Node.

```
src/schemas/
├── contract.ts     # El sobre de 03-contrato-endpoint: petición y respuesta como Zod + tipos.
│                   # Esta es la frontera con el validador. Cambiarla es cambiar el programa.
├── lead-basic.ts   # Primer schema de negocio: nombre, email, teléfono, aceptación. Factory del
│                   # diccionario para que los mensajes viajen traducidos.
└── index.ts        # formKey → schema. El único lugar que sabe qué schemas existen.
```

### `src/transport/` — la frontera con el validador

Dueño: `transport-submit`.

```
src/transport/
├── endpoint.ts  # LA constante del endpoint y nada más. Un archivo entero para que sea imposible
│                # de esconder en un diff. Placeholder hasta que la persona dé la URL real.
├── submit.ts    # POST JSON con timeout y reintento por fallo de RED. No reintenta cuando el
│                # servidor sí respondió, aunque responda ok:false: eso es decisión de negocio.
└── response.ts  # Parsea el sobre con el Zod de contract.ts. Una respuesta que no valida se
                 # trata como server_error, nunca se confía a ciegas en el JSON recibido.
```

### `src/context/` — lo que rodea al envío

Dueño: `transport-submit`.

```
src/context/
├── attribution.ts # Arma meta.landingUrl, referrer y submittedAt. No parsea UTM: eso es del
│                  # validador. Sin el hack de referrer del proyecto origen.
└── geo.ts         # Preselección de país y prefijo. Cookie de primera parte primero; geo-IP
                   # externo SOLO con consentimiento explícito. Sin consentimiento no hay
                   # petición y los selects arrancan vacíos. La IP es dato personal.
```

### `src/i18n/`

Dueño: `contract-schema`.

```
src/i18n/
├── index.ts  # Tipo Dict y resolución de idioma desde data-atom-form-lang. Sin fallback mudo:
│             # un idioma desconocido cae a es y lo registra.
├── es.ts     # Diccionario español. Labels, placeholders, mensajes de error, thank-you.
├── pt.ts     # Portugués. Se pauta en Brasil: no es opcional ni una traducción de relleno.
└── en.ts     # Inglés.
```

### `src/integrations/`

Dueño: `core-extractor`.

```
src/integrations/
└── index.ts  # Hooks de analítica: GA4, GTM, Meta. Corren SOLO tras éxito confirmado, en
              # paralelo y aislados con allSettled: una falla no tumba el registro ni a las otras.
              # Cero campos de negocio de otro cliente.
```

### `src/ui/` — la anatomía, con clases del DS

Dueño: `ui-anatomy`. **Cero CSS propio** (invariante I6).

```
src/ui/
├── atoms/
│   ├── input.ts          # <input> con su label, aria-describedby y estado. Clases del DS.
│   ├── select.ts         # <select> accesible por teclado. Sin librería externa.
│   ├── label.ts          # Label ligado por for/id. El id lo genera el field-group, no el átomo.
│   ├── error-message.ts  # Mensaje con role="alert" y aria-live. Vacío no ocupa espacio.
│   ├── acceptance.ts     # Checkbox de consentimiento. El texto legal entra como slot, no horneado.
│   └── button.ts         # Botón de envío con estado de carga y aria-busy. Reusa el botón del DS.
├── molecules/
│   └── field-group.ts    # Une label + control + error y cablea los ids y el aria. El único
│                         # lugar donde se decide la relación accesible entre las tres piezas.
└── organisms/
    ├── form.ts           # Arma el <form> desde FormConfig.fields. novalidate: la validación es
    │                     # nuestra. Es lo que un consumidor de código instancia.
    └── thank-you.ts      # Reemplaza el form tras éxito. Recibe foco para que un lector de
                          # pantalla anuncie el cambio. Sin confeti ni animación bloqueante.
```

### `test/`

Dueño: `test-author`. Detalle en `06-tests.md`.

```
test/
├── engine.test.ts        # El ciclo completo con un submitter falso: válido, inválido, error de red.
├── registry.test.ts      # Alta, colisión y lectura de formKey inexistente.
├── errors.test.ts        # zod → campo, sobre del servidor → campo, y el foco al primer error.
├── contract.test.ts      # El sobre de 03 valida lo que debe y rechaza lo que debe.
├── schema-isomorph.test.ts # El MISMO schema se importa desde ESM Node y desde el bundle. Invariante I4.
├── submit.test.ts        # Timeout, reintento solo por red, y cero reintentos con ok:false.
├── endpoint.test.ts      # El placeholder no sobrevive a un build de release.
├── geo.test.ts           # Sin consentimiento no sale ninguna petición. El caso que más importa.
├── a11y.test.ts          # Label ligado, aria-describedby en error, foco al primero, aria-busy.
└── fixtures/
    └── forms.ts          # FormConfig de prueba. No importa schemas de negocio reales.
```

## Fuera de `packages/forms/`

```
packages/layouts/src/form-lead.ts   # Anatomía del form como layout del registry: HTML con
                                    # {{slots}}, structure-only, cero color y cero tipografía.
                                    # Sigue packages/layouts/src/PATTERN.md al pie de la letra.

docs/specs/forms/WEBFLOW-BRIEF.md   # Lo escribe ui-anatomy. Qué componente crear en el master,
                                    # con qué props y qué atributos. Es un brief para una persona:
                                    # ningún agente de este programa toca Webflow.
```
