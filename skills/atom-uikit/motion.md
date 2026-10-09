# Motion

El motion explica una causa y un efecto: un titular que entra, un panel que abre. Si no explica nada, no se anima.

## Reglas

- Solo behaviors publicados. Cada uno es un item `kind: hook` del registry: míralos en `public/r/index.json`. Si el que necesitas no existe, pregunta; no lo inventes.
- Los layouts no animan. El motion vive en los componentes y en los behaviors, enganchados por atributos `data-*` que el bloque ya trae.
- Todo behavior respeta `prefers-reduced-motion`. Los decorativos aceptan `data-motion-exempt`; los funcionales (el accordion) nunca quitan el toggle.
- Los valores salen de tokens (`--duration-200`, `--easing-in-out`). Nunca escribas una duración ni una curva a mano.
- GSAP es dependencia del consumidor, no va empaquetado. Los behaviors que lo necesitan lo declaran.

## Cómo se usa un behavior

1. El bloque declara su hook en `atom.exemplar.motion` y trae los `data-*` en su html.
2. El hook figura en las `registryDependencies` del bloque: instálalo con el bloque.
3. Inicializa el behavior una vez en la página (el `init*` del módulo, o el bundle `/v1/animations.js`).

Ejemplos: `hook:text-reveal` anima un titular marcado con `data-split`; `hook:scroll-reveal` escalona hijos de un
contenedor con `data-reveal`; `hook:accordion-animation` abre y cierra paneles con el estado en `aria-expanded`.

## Moderación a escala de página

Puedes suprimir el motion de un bloque (quitar sus `data-*`) para que no anime toda la página. Nunca añades
motion que el bloque no declara. Un titular que se revela por encima del pliegue necesita que el behavior
corra antes del primer pintado, o parpadea: si no puedes garantizarlo, suprímelo.

## Qué NO es motion

Un `:hover` que cambia color no es un behavior, es estado del componente y ya viene resuelto.
