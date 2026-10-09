# ADR 016 — La skill del canal vive en el DS

**Status:** Accepted
**Date:** 2026-10-09

## Contexto

Las páginas del UIKit salían pobres no por los componentes sino por dónde vive el juicio de composición:
el conector intentaba planificar la página en el servidor y solo empujaba restricciones de marca; nada
coacheaba hacia lo bueno ni pedía revisar antes de entregar. Y las reglas que viven dentro del servidor
envejecen solas: `instructions.ts` anunciaba 49 componentes con 66 publicados, y la clase `bg-violet-soft`,
que el DS nunca publicó, quedó fosilizada en tres sitios del conector (un gate de tono, el enum de fondos
del catálogo y los fondos permitidos de `stats-band`), con tests que la mantienen verde a mano.

## Decisión

1. **La skill vive en `skills/atom-uikit/` dentro de este repo**, una capa por archivo, todo a un salto
   desde `SKILL.md`. Junto al DS que describe, porque solo ahí un gate puede verificar que lo que dice es
   verdad: `conformance/skill-contract.json` (sección `skill`) falla si una capa cita una clase, token,
   behavior, bloque o ruta que el árbol no tiene.
2. **El conector la sirve, no la copia.** `build:registry` publica `public/r/skills/atom-uikit/<capa>.md`
   y el conector la lee del canal con su caché, como ya hace con tokens y componentes. No se repite el
   espejo manual de `packages/layouts` (`PATTERN.md` se declara "mirror").
3. **Dos capas son generadas.** `bloques.md` sale de los `.exemplar.ts` (`scripts/build-skill-blocks.mjs`);
   la mitad contable de `cierre.md` sale de `conformance/skill-checks.json`
   (`scripts/build-skill-checklist.mjs`). Un PR que las edite a mano falla el gate.
4. **G-6: el registro de checks contables vive en el DS.** Es el `id` que `atom_uikit_finalize` reporta
   como `rule`. La skill renderiza esas líneas y no puede declarar una que la puerta no comprueba. El
   otro sentido (cada check ejecutable de `finalize` tiene un `id` del registro publicado) lo gatea el CI
   del conector, leyendo el canal: la dirección normal DS → canal → conector. Las reglas que `finalize`
   ejecuta hoy y no entran (`tone-background`, `plan-token`, `plan-conformance`) quedan en `excluded` con motivo.
5. **El juicio global se ejerce aquí y el local queda en el bloque.** La skill decide regiones, orden,
   asignación del único `h1`, presupuesto de secciones oscuras y moderación de motion; el bloque decide
   ritmo, superficie natural, motion y copy de referencia. La skill puede forzar `default` y suprimir
   motion, nunca reescribir ni añadir.
6. **Vocabulario del DS, desde el DS.** Ninguna capa lista a mano clases, tokens o behaviors: los cita, y
   el gate comprueba cada cita.

## Consecuencias

- Hay una sola fuente de la metodología y se versiona con el DS; el conector deja de empujar 60 KB de catálogo como contexto pasivo (cambio del lado del conector).
- Cambiar un bloque o un check obliga a regenerar `bloques.md` o `cierre.md`; el build lo hace y conformance lo exige.
- Pendientes que no son de este repo: la tool `atom_uikit_skill`, el CI del conector que mapea `finalize` a los `id`, y limpiar `bg-violet-soft` en el conector.
