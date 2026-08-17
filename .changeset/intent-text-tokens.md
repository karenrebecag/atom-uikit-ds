---
"@atom-uikit/tokens": patch
"@atom-uikit/css": patch
---

Texto de intent legible en los dos temas: `success-text`, `warning-text`, `destructive-text`, `info-text`, `brand-text`, `ai-text`

Los acentos semanticos (`success`, `warning`, `info`, `destructive`, `brand`) son colores de SUPERFICIE y no flipan entre temas. Usados como texto fallan en uno de los dos: `forest` da 1.26:1 sobre el fondo oscuro y `green-electric` 1.90:1 sobre el claro. `Tag` los usaba asi en sus variantes ghost, filled y outlined, o sea que la mitad de sus intents eran ilegibles segun el tema.

Se anade un paso legible por intent, que si flipa — el mismo patron que ya existia para `link` (sky.700 en light, sky.500 en dark), ahora extendido al resto. Todos verificados: el peor caso es 5.13:1 en light y 5.46:1 en dark, y los seis pares entran en el gate de `check-contrast.mjs`, que antes cubria 14 pares para 16 tokens con rol de texto.

`warning-text` usa `amber.800` y no `amber.700` porque el 700 da 4.8:1 sobre el fondo pero solo 4.2:1 sobre el relleno tintado del tag: un paso mas lo hace servir en los dos usos.

De paso `tag.css` deja de consumir primitives. Ya no queda ningun `var(--color-*)` en el archivo, que era ademas una violacion de capas (los componentes consumen solo semanticos). Sus rellenos `filled` de warning y brand pasan de un tinte fijo claro —que en dark quedaba como un chip casi blanco sobre pagina oscura— al mismo `color-mix()` con `var(--background)` que ya usaban el resto.

El bug de origen lo cazo la seccion `references` del contrato de conformance: `tag.css` referenciaba `var(--color-sky)`, un paso de rampa que no existe, asi que `.tag--info` no pintaba nada en ghost ni en outlined y el `color-mix()` de filled caia entero.
