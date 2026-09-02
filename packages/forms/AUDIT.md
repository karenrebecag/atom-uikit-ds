# Auditoría · 2026-09-01

Lectura completa de `docs/specs/forms/` (00–08, ORCHESTRATOR, agents/*, WEBFLOW-BRIEF, README) y de `packages/forms/` archivo por archivo más `packages/layouts/src/form-lead.ts`. Clases CSS verificadas abriendo `packages/css/src/components/forms/{field,input,select,checkbox}.css`, `buttons/button.css` y `layout/empty.css`. No se tocó producto.

## Puertas

| Comando | Resultado | Salida |
|---|---|---|
| `pnpm --filter @atom-uikit/forms typecheck` | PASA (exit 0) | ver bloque 1 |
| `pnpm --filter @atom-uikit/forms test` | PASA (9 files, 55 tests) | ver bloque 2 |
| vestigios (src + test + form-lead.ts) | PASA (vacío) | ver bloque 3 |
| `any` explícito en `src/` | PASA (vacío) | ver bloque 3 |
| `core/` → `transport/` o `context/` | PASA (vacío) | ver bloque 3 |
| URL `https?://` fuera de `endpoint.ts` | PASA (vacío) | ver bloque 3 |
| emojis (rg PCRE2) | PASA (vacío) | ver bloque 3 |
| `vitest run --coverage` | PASA umbrales de carpeta | ver bloque 4 |

### Bloque 1 — typecheck (literal)

```
> @atom-uikit/forms@0.1.0 typecheck /Users/karenrebecaog/Desktop/SoftwareDevProjects/ATOMUIKIT/atom-uikit-ds/packages/forms
> tsc --noEmit
```

Exit 0. Sin diagnóstico.

### Bloque 2 — test (literal)

```
> @atom-uikit/forms@0.1.0 test /Users/karenrebecaog/Desktop/SoftwareDevProjects/ATOMUIKIT/atom-uikit-ds/packages/forms
> vitest run


 DEPRECATED  "environmentMatchGlobs" is deprecated. Use `test.projects` to define different configurations instead.

 RUN  v3.2.7 /Users/karenrebecaog/Desktop/SoftwareDevProjects/ATOMUIKIT/atom-uikit-ds/packages/forms

 ✓ test/endpoint.test.ts (1 test) 1ms
 ✓ test/contract.test.ts (8 tests) 4ms
 ✓ test/schema-isomorph.test.ts (5 tests) 55ms
 ✓ test/submit.test.ts (6 tests) 16ms
 ✓ test/geo.test.ts (5 tests) 10ms
 ✓ test/registry.test.ts (4 tests) 2ms
 ✓ test/errors.test.ts (10 tests) 18ms
 ✓ test/a11y.test.ts (5 tests) 75ms
 ✓ test/engine.test.ts (11 tests) 292ms

 Test Files  9 passed (9)
      Tests  55 passed (55)
   Start at  13:21:12
   Duration  951ms (transform 229ms, setup 0ms, collect 362ms, tests 474ms, environment 2.11s, prepare 634ms)
```

(Los tiempos del run de cobertura, bloque 4, difieren en ms; la cuenta 9/55 es la misma.)

### Bloque 3 — greps (literal)

Comandos corridos desde el root del repo. Cuerpos vacíos = cero coincidencias.

```
=== VESTIGIOS ===
grep -rniE 'elementor|admin-ajax|atfx|aanumber|post_id|form_id|wp-admin|moove_gdpr|_atcg' \
  packages/forms/src packages/forms/test packages/layouts/src/form-lead.ts
(vacío)

=== ANY ===
grep -rnE ':\s*any\b|<any>|as any' packages/forms/src
(vacío)

=== CORE->TRANSPORT/CONTEXT ===
grep -rnE "from ['\"]\\.\\./(transport|context)" packages/forms/src/core
(vacío)
# también el grep de 07 con comillas simples: from '\.\./transport — vacío

=== URLS ===
grep -rnE 'https?://' packages/forms/src --exclude=endpoint.ts
(vacío)
# la única coincidencia del patrón en src/ es packages/forms/src/transport/endpoint.ts:7

=== EMOJIS ===
rg -n --pcre2 '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' packages/forms/src packages/forms/test
(vacío)
```

Grep extra (no puerta, evidencia): `innerHTML`, `console.`, `@ts-expect-error`, `attio|sheets|salesforce`, `form.action` / `setAttribute('action'` — vacío en el paquete. `querySelector` solo en `src/core/dom.ts`. `as` en `src/` solo `as const`. `ui/` no importa `transport/` ni `schemas/` de negocio.

### Bloque 4 — cobertura (literal)

```
pnpm --filter @atom-uikit/forms exec vitest run --coverage

 DEPRECATED  "environmentMatchGlobs" is deprecated. Use `test.projects` to define different configurations instead.

 RUN  v3.2.7 ... Coverage enabled with v8
 Test Files  9 passed (9)
      Tests  55 passed (55)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|---------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|---------------------
All files        |   91.02 |       80 |   98.68 |   91.02 |
 context         |   75.78 |    59.32 |   94.11 |   75.78 |
  attribution.ts |   14.28 |      100 |       0 |   14.28 | 7-12
  geo.ts         |   78.14 |    59.32 |     100 |   78.14 | ...,197-198,211-212
 core            |   93.91 |     84.9 |     100 |   93.91 |
  dom.ts         |   92.14 |    79.74 |     100 |   92.14 | ...,129-130,176-177
  engine.ts      |    95.1 |     91.3 |     100 |    95.1 | ...55,69-71,204-205
  errors.ts      |      95 |    84.61 |     100 |      95 | 60-61,99-100
  registry.ts    |     100 |      100 |     100 |     100 |
  types.ts       |       0 |        0 |       0 |       0 |
 schemas         |     100 |      100 |     100 |     100 |
  contract.ts    |     100 |      100 |     100 |     100 |
  index.ts       |     100 |      100 |     100 |     100 |
  lead-basic.ts  |     100 |      100 |     100 |     100 |
 transport       |     100 |    94.73 |     100 |     100 |
  endpoint.ts    |     100 |      100 |     100 |     100 |
  response.ts    |     100 |      100 |     100 |     100 |
  submit.ts      |     100 |    93.75 |     100 |     100 | 47
-----------------|---------|----------|---------|---------|---------------------
```

## Hallazgos

| # | Severidad | Archivo:línea | Qué | Regla violada | Cómo se corrige |
|---|---|---|---|---|---|
| 1 | Medio | `src/ui/molecules/field-group.ts:43-47`; `packages/layouts/src/form-lead.ts:30,46,59,73`; WEBFLOW-BRIEF `atom-field-{schemaKey}` | Ids fijos `atom-field-{schemaKey}`. Dos forms en la misma página duplican `id`/`for`/`aria-describedby`. | 05 §7 (label ligado por for/id) | ui-anatomy: namespacing por instancia (p. ej. id del form o contador). |
| 2 | Medio | `src/index.ts:63-75,114-130`; `src/core/engine.ts:161-165`; `src/ui/organisms/thank-you.ts:31` | `initAll` no pasa `onSuccess`. Tras `ok:true` el form sigue en el DOM y se puede reenviar. Confirma 08 thank-you. I3 no es alto: el bind/envío sí arranca solo con markup + IIFE; falta el tramo post-éxito. | 02 flujo ok→thank-you; I3 (funcionalidad que exige JS extra); 01 DoD | core-extractor: `initAll` inyecta `attachThankYou` (o deja el form inerte). ui-anatomy ya tiene el organismo. |
| 3 | Medio | `test/schema-isomorph.test.ts:4-6,83-87`; `src/index.ts:24-42`; `package.json` `exports` | I4 en producto se sostiene (un módulo Zod, cero DOM). El test no importa `dist/`; compara dos paths de `src/` que son la misma factory, y afirma que el barrel **no** reexporta el schema. Un validador Node no puede importar el schema desde `@atom-uikit/forms`. | 02 I4 (consumo); 06 schema-isomorph; 01 DoD «importar de las dos formas»; 04 schemas «importarse tal cual desde Node» | core-extractor: exportar schemas (`export` o subpath `./schemas`). test-author: importar ESM de `dist/` **y** el módulo de schema, no el barrel vacío. |
| 4 | Medio | `packages/forms/` (ausente) | 04 lista `README.md` (snippet, atributos, nada de arquitectura). No existe. | 04-scaffold | core-extractor: añadir README de consumo. |
| 5 | Medio | `src/ui/atoms/error-message.ts:2-3`; `packages/css/.../field.css:39-45` | El átomo declara «vacío no ocupa espacio» y delega `:empty` al DS. `.field__error` no tiene `:empty`; el `margin-top` queda con el slot vacío. | 04 error-message; I6 (no autodeclarar pintura) | ui-anatomy: no inventar CSS. Brecha de pintura en el DS (`:empty { margin: 0; display: none }`) o no afirmar el colapso. |
| 6 | Medio | `src/core/dom.ts:104-119` | `setFieldInvalid` pone `data-invalid` en `.field`. El DS pinta el box de error con `.checkbox--error` (`checkbox.css:110-112`). Aceptación en error: texto de `.field__error` sí; borde del box no. `.field[data-invalid] .field__label` no aplica: el control no usa `.field__label`. | 05 §7 contraste/estado de error; I6 usar clase real | core-extractor: en invalidación de `kind === 'acceptance'`, añadir/quitar `.checkbox--error` en el `.checkbox` del grupo. |
| 7 | Medio | `src/ui/organisms/form.ts:40-46`; `src/core/types.ts:87`; `form-lead.ts:26` | Banner `[data-atom-form-status]` sin clase DS. Errores de conexión/genéricos salen texto plano. types.ts ya lo anota. No se inventó clase (I6 bien aplicado). | I6 «si necesita pintura y no existe, se reporta» | ui-anatomy: brecha de átomo de alerta de form en el DS; mientras tanto el banner sigue sin pintura. |
| 8 | Medio | `src/auto-init.ts`; `src/index.ts` `initAll`; `test/` (cero matches de `initAll` / `data-atom-form-init`) | I3 (markup + `data-atom-form` + IIFE) no tiene test. Idempotencia de `data-atom-form-init` sin cubrir. Sin schema/formKey no monta: código sí, test no. | 06; 02 I3; 04 auto-init | test-author: jsdom con markup de layout, `initAll` dos veces, formKey desconocido. |
| 9 | Medio | `src/context/attribution.ts:6-12` | `collectAttribution` 14.28% / 0 funciones. Los tests inyectan `testCollectMeta`. La carpeta `context/` igual pasa ≥70% por `geo.ts`. | 06 transport/context ≥70% (carpeta OK); 03 meta.landingUrl | test-author: spy de `window.location` / `document.referrer`; no parsear UTM. |
| 10 | Medio | `test/a11y.test.ts:121-126`; `src/ui/organisms/thank-you.ts:31-39` | El caso «thank-you recibe foco» ejercita `renderThankYou` (microtask si está desconectado), no `attachThankYou` (`replaceWith` + foco). | 06 a11y «foco al montarse» | test-author: `attachThankYou` con form conectado y comprobar `document.activeElement`. |
| 11 | Medio | `src/ui/atoms/select.ts:1-24` | `<select>` nativo sin clase DS. `.select` es composite trigger/list. Confirma 08. lead-basic no usa select. | I6 | ui-anatomy / Karen: clase nativa o no pintar. |
| 12 | Medio | `src/ui/organisms/form.ts:48-58`; `form-lead.ts:27` | Honeypot `type="hidden"`. Confirma 08. | 05 §7 vs honeypot | ui-anatomy / Karen: visually-hidden del DS o aceptar el tradeoff. |
| 13 | Medio | `src/transport/endpoint.ts:6-11` | `ENDPOINT_IS_PLACEHOLDER === (FORMS_ENDPOINT === PLACEHOLDER_ENDPOINT)` sigue tautológico. El test de Ola 2 **sí** clava host `.invalid` (`endpoint.test.ts:12-18`), que era lo que pedía 08. | 05 §5; 08 ENDPOINT | transport-submit: flag por host `.invalid`, no por igualdad de dos consts. |
| 14 | Medio | `packages/layouts/src/form-lead.ts`; `registry.json` | Módulo existe; no está en `registry.json`. Confirma 08. | 04 fuera de packages/forms; organism-pipeline | Karen (registry raíz bloqueado). |
| 15 | Bajo | `src/ui/atoms/acceptance.ts:4-5`; `button.ts:4-5` | `http://www.w3.org/2000/svg` partido con `.join('//')` «para el grep de URLs de 07». No es destino de red. | 05 §5 espíritu del grep | ui-anatomy: dejar el namespace literal y excluirlo del grep, o documentar la excepción. |
| 16 | Bajo | `src/transport/response.ts:8-9,14-18` | Fallback de JSON podrido en español fijo, ignora locale. | 05 §2 i18n; no es detalle técnico | transport-submit: string neutro o dict inyectado. |
| 17 | Bajo | `vitest.config.ts:7`; salida de vitest | `environmentMatchGlobs` deprecado. | 04 vitest | core-extractor: `test.projects` cuando se toque el config. |
| 18 | Bajo | `src/ui/atoms/error-message.ts:13-14`; `form-lead.ts:26,41,...` | `role="alert"` más `aria-live="polite"` (alert ya es asertivo). Varios `role="alert"` vacíos al montar (banner + cada `.field__error`). | 05 §7 | ui-anatomy: un live region; `aria-live` solo si no hay `alert`. |
| 19 | Bajo | `src/i18n/index.ts:62-69` | `resolveLang` devuelve `{ recognized }` y nadie registra. Confirma 08. | 04 vs 05 §2 console | contract-schema / Karen: logger o no pedir registro. |

Sin altos. Invariantes de 02 (producto):

- **I1** — `FORMS_ENDPOINT` solo en `endpoint.ts`. `renderForm` / layout: `method=post`, **sin** `action`. Engine hace `preventDefault`. No se trata el placeholder como URL real; `endpoint.test.ts` clava `atom-forms.invalid`.
- **I2** — cero Attio/Sheets/destinos. `landingId` es identificador.
- **I3** — `auto-init` + `data-atom-form*` levantan validación y envío. Thank-you no (hallazgo 2, medio).
- **I4** — un schema, cero DOM en `schemas/`. Hueco el **test** y el **barrel** (hallazgo 3, medio), no una copia servidor.
- **I5** — `core/` no importa `transport/` ni `context/`. `instance.submitter` inyectado; `index.ts` (composition root) pasa `submitForm`.
- **I6** — `ui/` sin CSS. Clases usadas existen: `.field` / `__label` / `__label--required` / `__error`, `.input`, `.checkbox` + `__input` `__box` `__icon` `__label`, `.button` `--primary` `--m` `__label` `__spinner` `__spinner-icon` `--loading`, `.empty` `__header` `__title` `__description`. `.l-form-lead__*` es BEM de layout. No se usó `.select` en el nativo.
- **I7** — `resolveGeo({})` en `initAll` no fetchea (hay test). Error de red conserva valores (hay test). `landingId === ''` no llama submitter (hay test). Sin formKey/schema, `mountHost` retorna false (sin test, hallazgo 8).

Seguridad 05 §3: cero credenciales. Geo `credentials: 'omit'` y providers inyectados (no literales). `textContent` / `createElement`, cero `innerHTML`. Mensajes de `parseResponse` genéricos. Submitter inyectado; el placeholder no resuelve.

05 §2 tamaño: ningún archivo >400, ninguna función >50, anidamiento ≤4 (conteo estático). `tsconfig` extiende root `strict: true` sin excepciones locales. Runtime: solo `zod`.

06 casos sí-o-sí: engine (válido / inválido / red / integraciones allSettled / live blur-input) presentes; geo sin consentimiento espía `fetch`; a11y label / describedby+alert / foco primer error / aria-busy sin `disabled`; contract landingId vacío y respuesta sin `ok`; submit timeout/retry/ok:false. El isomorph no importa dist (hallazgo 3).

## Cobertura por carpeta

Umbral Gate 2: `core/` y `schemas/` ≥ 80%; `transport/` y `context/` ≥ 70% (stmts/lines del reporter v8).

| Carpeta | Stmts | Branch | Funcs | Lines | Umbral | Resultado |
|---|---|---|---|---|---|---|
| `core/` | 93.91 | 84.9 | 100 | 93.91 | ≥ 80% | PASA |
| `schemas/` | 100 | 100 | 100 | 100 | ≥ 80% | PASA |
| `transport/` | 100 | 94.73 | 100 | 100 | ≥ 70% | PASA |
| `context/` | 75.78 | 59.32 | 94.11 | 75.78 | ≥ 70% | PASA |
| `context/attribution.ts` | 14.28 | 100 | 0 | 14.28 | (archivo) | no tumba la carpeta; hallazgo 9 |
| `ui/`, `i18n/`, `integrations/`, `index.ts`, `auto-init.ts` | fuera del `include` de coverage | — | — | — | 06: ui persigue a11y, no % | a11y 5/5 verdes; initAll/thank-you de producción no (8, 10) |

## Veredicto

APROBADO CON MEDIOS

Cero altos: ninguna invariante de 02 rota en producto, ninguna regla de seguridad 05 §3 rota. Puertas de 07 verdes con salida. Los medios 1–10 son nuevos o efectos no listados; 11–14 y 19 confirman 08. Dueños de reinvocación (no hay altos): ui-anatomy (1, 5, 7, 11, 12, 18), core-extractor (2, 3 barrel, 4, 6), test-author (3 dist, 8, 9, 10), transport-submit (13, 16).
