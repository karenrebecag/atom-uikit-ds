# ADR 015 — Foundation en el canal shadcn

**Status:** Accepted. Amends [ADR 011](011-shadcn-registry-channel.md) §5 (deps no emitidas se borran) y §7 (foundations y hooks fuera).
**Date:** 2026-10-09

## Contexto

Medido sobre `bae0e237`: `shadcn add @atom/button` copiaba 4 archivos y ninguna variable. El
emisor filtraba `registryDependencies` a los nombres emitidos, y `tokens` se caía en 50 de 50
ítems, `foundation` en 43. 49 de 50 ítems salían sin ninguna dep. El CSS de los componentes
consume solo semantics por contrato, así que sin tokens cada `var()` caía a su fallback: botón
sin color, radio ni tiempo. Dark tampoco viajaba (`tokens-dark` no se emitía).

Arc no resuelve esto con deps declaradas sino con un nodo `arc-foundation` más una instrucción
en su skill. Atom puede cerrarlo mejor: el nodo existe y además el grafo lo arrastra.

## Decisión

1. **Dos nodos nuevos**, emitidos desde el artefacto construido (`packages/css/dist`), nunca desde
   los items canónicos: sus `files` apuntan a `packages/css/src/**` y hacen `@import` relativo a
   otro paquete, que no resuelve copiado a un proyecto ajeno.
   - `atom-foundation` (`foundation.css`: tokens light y dark, fuentes, foundation, utilities).
   - `atom-tokens` (`tokens.css`: solo variables). Alternativo a `atom-foundation`, no se instalan juntos.
2. **Deps traducidas, no filtradas.** `tokens`, `foundation`, `utilities` y `tokens-dark` →
   `atom-foundation` (una sola entrada, primera de la lista). Componentes y hooks emitidos se
   mantienen. Lo que no se pueda emitir se registra en el log con motivo y se nombra en `docs`
   (lo que ADR 011 §5 ya hacía bien).
3. **Hooks emitidos** como `registry:lib` (los 18 `kind: hook`). Antes se perdían
   `accordion-animation`, `accordion-morph-animation`, `tooltip-animation` y `bouncy-tabs-animation`.
4. **Fuentes enlazadas, no copiadas.** Las `url()` de woff2 se reescriben (reemplazo de prefijo
   `./fonts/` y `../fonts/`, nada más) a `https://atom-web-ds.vercel.app/v1/fonts/`. Las 4 familias
   tienen licencia comercial: meter los binarios en cada repo consumidor es redistribuirlos.
5. **Si `dist/foundation.css` o `tokens.css` faltan, la emisión falla** en vez de publicar un nodo
   con `files[]` colgando.
6. **Las deps usan el nombre corto** (`atom-foundation`), como ya hacía `button-group → button`;
   exige el namespace `@atom` en el `components.json` del consumidor, que ya necesita para instalar
   cualquier ítem. Pendiente de verificar con el CLI real si hace falta URL absoluta del registry.

## Gates

Sección `distribution` de la conformance (`scripts/check-distribution.mjs`): `shadcnFoundationEmitted`,
`shadcnNoOrphanComponent`, `shadcnDepsResolve`, `shadcnFontUrlsAbsolute`, `shadcnBudget`,
`shadcnDarkPresent`. Corren sobre lo commiteado en `public/r/shadcn`, sin build.

## Consecuencias

- Todo componente instalado trae el sistema que necesita para pintar; el CLI deduplica el nodo.
- +24 kb por proyecto que antes no se copiaban (budget de `foundation.css`). `atom-tokens` (15 kb)
  es la salida para quien solo quiere variables.
- Quien ya carga `/v1/foundation.css` por `<link>` no debe instalar el nodo (idempotente si lo hace).
- El canónico `public/r/*.json` no cambia: la derivación no contamina la fuente.
- Layouts siguen fuera del canal shadcn.
