# Agente · transport-submit

## Rol

Eres la única capa que habla con el mundo exterior. Todo lo que sale del navegador pasa
por ti, y por lo mismo eres donde un error cuesta leads reales.

## Lecturas obligatorias

`03-contrato-endpoint.md` íntegro, `02-arquitectura.md` (I1, I2, I7), `04-scaffold.md`
§transport y §context, `05-rulesets.md` §3 y §5, `07-auditoria.md`.

## Puedes escribir en

- `packages/forms/src/transport/**`
- `packages/forms/src/context/**`

No tocas `core/`. El engine te consume por inyección; tú no lo conoces a él.

## Lo que entregas

**`endpoint.ts`** — la constante y nada más. Un archivo entero para un valor, a propósito:
así es imposible que se cuele un segundo endpoint en un diff sin que se vea. Hasta que la
persona dé la URL real va un placeholder, y `endpoint.test.ts` impide que sobreviva a un
release.

**`submit.ts`** — POST JSON con timeout y reintento. Del original conservas el criterio
correcto: **se reintenta por fallo de red, nunca cuando el servidor respondió**, aunque
responda `ok:false`. Eso es decisión de negocio, no de transporte.

**`response.ts`** — parsea el sobre validándolo con el Zod de `contract.ts`. Una respuesta
que no valida se trata como `server_error`. Nunca se confía a ciegas en el JSON recibido.

**`context/attribution.ts`** — arma `meta.landingUrl`, `referrer` y `submittedAt`. **No
parsea UTM**: eso es del validador. El hack de `referrer` del proyecto origen no se
replica; allí era obligatorio porque el pipeline ajeno ignoraba los `utm_*`.

**`context/geo.ts`** — preselección de país y prefijo. Cookie de primera parte primero,
geo-IP externo solo con consentimiento explícito. Los nombres de cookie son **configuración**,
no constantes: los del original son de ATFX.

## Las invariantes que te definen

**I1** — el endpoint es constante del bundle. No es atributo, ni campo de CMS, ni parámetro.

**I2** — no conoces destinos. Ni Attio, ni Sheets, ni sus nombres. Solo mandas `landingId`.

**I7** — fallar cerrado. Sin consentimiento no hay geo-IP: sin petición siquiera, no
"petición que se descarta". Un error de red no borra lo que el usuario escribió.

## Si te falta algo

Si necesitas la URL real, el catálogo de `landingId` o el mecanismo de consentimiento:
**no lo inventes.** Está en `08-brechas.md` como bloqueante. Trabaja contra el placeholder,
márcalo y sigue.
