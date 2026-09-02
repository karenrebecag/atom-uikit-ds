# 08 · Brechas

Lo que no está confirmado. Se marca, no se disfraza de hecho. Los agentes **añaden** aquí;
nadie borra una entrada sin resolverla.

Formato: `[estado] fecha · descripción · dueño`

## Abiertas al arrancar el programa (2026-09-01)

**[BLOQUEA] URL del validador.** No existe todavía. El bundle usa placeholder en
`transport/endpoint.ts` y un test impide que llegue a un release. · Karen

**[BLOQUEA] Catálogo de `landingId`.** El validador necesita allowlist. Hasta que exista,
los tests usan identificadores ficticios. · Karen

**[ABIERTA] Nombres de cookie de consentimiento.** El proyecto origen usa `moove_gdpr_popup`
y `_atcg`, ambos de ATFX. Aquí son configuración; falta decidir el mecanismo de consentimiento
de los sitios de pauta. Sin él, `geo.ts` no hace ninguna petición, que es el fallback correcto. · Karen

**[ABIERTA] Propiedad del código origen.** `atfx-forms-newAug26` es de otro cliente. Falta
confirmar qué permite el contrato antes de mover código literal. Mientras tanto los agentes
extraen la forma y reescriben. · Karen

**[ABIERTA] Campos de `lead-basic`.** El primer schema de negocio está sin definir. Los
agentes asumen nombre, email, teléfono y aceptación, y lo marcan como supuesto. · Karen

**[ABIERTA] `WhatsAppButton2026` y las props por instancia.** El componente en Webflow
expone solo `Variant` y `Text`, y tiene 114 instancias. Para personalizar `data-message` y
`data-cta` por landing hace falta decidir si se le agregan props o si se ponen atributos
por instancia. Afecta a la ola paralela, no a esta flota. · Karen

**[ABIERTA] Registrar idioma desconocido.** 04 pide que un idioma desconocido caiga a `es`
y se registre; 05 prohíbe `console.log` en producto. `resolveLang` devuelve
`{ lang, recognized }` y nadie registra todavía. · contract-schema / Karen

**[ABIERTA] Supuestos de forma del sobre (Ola 0).** 03 no cubre estos detalles; el agente
eligió el mínimo y no los presenta como hecho: `submittedAt` = ISO-8601 con `Z`
(`z.string().datetime()`); `referrer` obligatorio como clave, string vacío permitido;
`landingUrl` string no vacío sin parsear UTM ni validar URL; `payload` =
`z.record(z.string(), z.unknown())` porque el sobre no puede ser el schema de negocio;
`trap` con valor es válido en el sobre (el rechazo es del validador); `ref` si viene,
`min(1)`. · contract-schema / Karen

**[ABIERTA] Atributo de `landingId`.** 04 no lo nombra. Ola 1 honra `data-atom-form-landing`
en el host `[data-atom-form]` o el `<form>`. Vacío → no envía (I7). · core-extractor / Karen

**[ABIERTA] `ENDPOINT_IS_PLACEHOLDER`.** Hoy se deriva de `FORMS_ENDPOINT === PLACEHOLDER_ENDPOINT`
y ambos apuntan al mismo string. Si se cambia el valor del placeholder in-place, el flag
sigue `true`. El test de release (Ola 2) tiene que clavar el host `.invalid`, no solo el
boolean. · transport-submit / Karen

**[ABIERTA] Timeout: devolver vs lanzar.** 06 dice «timeout aborta y propaga». `submitForm`
aborta y, agotados los reintentos, **devuelve** `{ ok: false, code: 'server_error' }` en
vez de tirar. Ola 2 testea el return, no un throw. · transport-submit / test-author

**[ABIERTA] Thank-you no está cableado en `index.ts`.** `attachThankYou` existe; `initAll`
no pasa `onSuccess`. El organismo se usa a mano o desde tests. · ui-anatomy / core-extractor

**[ABIERTA] `<select>` nativo sin clase DS.** `.select` es el composite trigger/list.
lead-basic no usa select; el átomo sale sin pintura. · ui-anatomy / Karen

**[ABIERTA] Honeypot `type="hidden"`.** El DS no tiene visually-hidden. Es peor contra
bots, mejor para AT. · ui-anatomy / Karen

**[ABIERTA] `layout/form-lead` no está en `registry.json`.** El módulo existe; registrar
es de la persona (registry raíz bloqueado para la flota). · ui-anatomy / Karen

## Añadidas en auditoría Ola 3 (2026-09-01)

No reescriben las abiertas de arriba. Si el tema ya estaba, la auditoría lo confirma
en `packages/forms/AUDIT.md` y no lo copia aquí.

**[ABIERTA] Ids `atom-field-{schemaKey}` chocan entre dos forms.** `field-group.ts` y
`layout/form-lead` (y el brief Webflow) usan el mismo `id`/`for`/`aria-describedby` por
clave. Dos instancias en una página rompen el ligue de 05 §7. · ui-anatomy

**[ABIERTA] Barrel no exporta schemas; I4 no se prueba contra `dist/`.** `src/index.ts`
no reexporta `createLeadBasicSchema` / `getSchema`; `exports` del package no tiene
subpath `./schemas`. `schema-isomorph.test.ts` compara dos imports de `src/` (la misma
factory) y afirma que el índice público **no** exporta el schema. El módulo Zod sigue
siendo uno (I4 producto); un validador Node no lo consume por la API pública. ·
core-extractor / test-author

**[ABIERTA] `README.md` del paquete ausente.** 04 lo lista (snippet de consumo,
atributos, nada de arquitectura). No está en `packages/forms/`. · core-extractor

**[ABIERTA] `.field__error` vacío no colapsa.** El átomo `error-message` declara que
vacío no ocupa espacio y delega `:empty` al DS. `field.css` no tiene `:empty`; el
`margin-top` queda. No autodeclarar CSS (I6). · ui-anatomy / Karen

**[ABIERTA] `.checkbox--error` no se aplica.** `setFieldInvalid` marca `.field` con
`data-invalid`. El borde de error del box vive en `.checkbox--error`. Aceptación en
error: mensaje sí, box no. · core-extractor

**[ABIERTA] Banner `[data-atom-form-status]` sin clase DS.** Errores de conexión/genéricos
salen texto plano. types.ts ya lo anota; I6 no se violó (no se inventó clase). ·
ui-anatomy / Karen

**[ABIERTA] Tras `ok:true` el form sigue enviable.** Consecuencia del thank-you no
cableado (entrada de arriba): `applyResponse` llama `onSuccess` opcional y no marca
enviado. Sin `attachThankYou` en `initAll` se puede reenviar el lead. · core-extractor

**[ABIERTA] Sin tests de `initAll` / auto-init / `collectAttribution` / `attachThankYou`.**
I3 (markup + IIFE) e I7 (sin formKey no monta) no se ejercitan. a11y de thank-you usa
`renderThankYou`, no el replace del organismo. attribution.ts queda al 14%. · test-author

## Resueltas

**[RESUELTA] 2026-09-01 · Scaffold del paquete vs Puerta 0.** Shell mínimo:
`packages/forms/package.json` + `tsconfig.json`. Runtime: solo `zod`, declarado ahí, no
en la raíz. Toolchain (`typescript`, `tsup`, `vitest`, `jsdom`) en `devDependencies` del
mismo paquete, reusando el store del DS. `tsup.config.ts` y `vitest.config.ts` siguen
siendo de `core-extractor`. · Orquestador / Karen
