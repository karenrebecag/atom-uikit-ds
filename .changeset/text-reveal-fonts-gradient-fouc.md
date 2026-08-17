---
"@atom-uikit/animations": patch
---

text-reveal: divide con la fuente real, deja los titulares con gradiente a otro
componente y resuelve su propio FOUC.

Tres cosas que solo se ven cuando el modulo corre en una pagina de verdad:

- Partia antes de que cargara la webfont, asi que medía los saltos de linea
  contra la cara de fallback y las mascaras quedaban cortadas donde no era.
  Ahora espera a `document.fonts.ready` sin volver `init` async: la firma
  `init*(): CleanupFn` se mantiene.
- Un titular pintado con `background-clip:text` se rompe al dividirse, porque
  cada linea estrena su propia caja y el degradado vuelve a empezar en cada
  trozo. Un titular con gradiente es otro componente, con su propio motion, y
  aqui se deja intacto.
- El split aterriza despues del pintado, asi que el titular se veia en reposo y
  luego saltaba para animarse. Ahora se esconde desde JS al iniciar y se
  devuelve al dividir — desde JS y no desde una hoja de estilo, para que en una
  pagina donde el modulo no llegue a correr no quede texto invisible.

Ademas, `autoSplit` vuelve a llamar a `onSplit` al cargar las fuentes y al
redimensionar; ya no re-esconde un titular que el lector ya vio.
