# Composición de la página

Lo global: qué regiones lleva la página, en qué orden y con qué presupuesto. Lo local de cada región
(ritmo, superficie natural, motion y copy de referencia) ya viene decidido en su bloque; no lo reescribas.

## El loop

Cuatro pasos, en este orden. El segundo es el que evita la página de catálogo.

1. **Plan.** Escribe las regiones en orden, con el bloque de cada una y el foco de cada una.
2. **Descarta el default.** Relee el plan contra el brief y tacha lo que pondrías por inercia:
   la región que no aporta argumento, el bloque elegido por el nombre, el tell que reconoces de
   la lista de [la entrada](SKILL.md). Si el plan serviría igual para otro producto, todavía no
   es un plan.
3. **Construye.** Pega los bloques, rellena con el brief, resuelve los estados.
4. **Autocrítica.** Relee la página escrita contra la rúbrica de [acabado](acabado.md) y los
   tells. No hace falta verla renderizada para notar que no hay foco. Luego ve a
   [cierre](cierre.md).

## Regiones y orden

1. Parte del brief: qué quiere hacer la persona al terminar de leer. Esa acción es el cierre.
2. Elige las regiones que cuentan el argumento: promesa, el dolor o la capacidad, la prueba, las
   objeciones y la acción. Una página es un argumento, no una lista de secciones.
3. Una región por trabajo. Si dos bloques hacen el mismo trabajo, quita uno.
4. Elige cada bloque por su `whenToUse` y `whenNotToUse` en [bloques](bloques.md), no por el nombre.
5. Orden habitual de una landing: promesa, capacidad, prueba, objeciones, cierre. Cambia el orden solo
   si el brief lo pide y puedes decir por qué.

Si necesitas una región que no tiene bloque, no escribas markup a mano: anótalo en el reporte como
hallazgo de catálogo y usa el bloque más cercano.

## El único h1

Los bloques declaran si pueden alojar el `h1` (columna `h1` de [bloques](bloques.md)). Tú asignas
exactamente uno por página, normalmente al primer hero. Si dos bloques elegibles aparecen en la
misma página, degrada el segundo a `h2`. Dos héroes no son dos `h1`.

## Presupuesto de superficies

- La página es blanca. Una landing típica lleva de 0 a 2 secciones oscuras, y solo si su tema es la IA o la automatización.
- Nunca el `body` oscuro. Lo oscuro va dentro de una sección, con la utilidad de fondo que el DS publica en `packages/css/src/utilities/backgrounds.css`.
- Si un bloque llega con superficie oscura y ya agotaste el presupuesto, fuérzalo a `default`.
- Nunca añadas un fondo que el DS no publique. Si una clase no está en ese archivo, no existe.

## Un solo ancho de contenido

Cada sección envuelve su contenido en `.container` (ancho `--size-container-content`, gutter
`--container-padding`): es el MISMO ancho y el MISMO margen lateral para toda la página, así los
bordes del contenido no bailan de una sección a otra. Los bloques ya vienen así; no les pongas un
ancho máximo propio ni un gutter a mano (nada de `80rem`, `5%`, `1200px` sueltos), y no dejes una
sección a sangre completa junto a otras centradas. Una banda que sangra a propósito (un marquee, un
fondo de color a todo el viewport) lleva su contenido interior igualmente en `.container`.

## Cadencia entre secciones

- Alterna el ritmo: no pongas dos `.section--hero` seguidas; el hero abre la página y el resto usa `.section`.
- Una banda de cierre corta usa `.section--compact`.
- No alteres el padding interno de un bloque para "darle más aire": el aire lo da la clase de uso.

## Cadencia de motion

Cada bloque trae su motion. A escala de página, modera: no anima todo. Como mucho animan las
regiones donde el movimiento explica algo (el titular que entra, el accordion que abre). Puedes
suprimir el motion de un bloque; nunca lo añades. Detalle en [motion](motion.md).

## Imágenes y media

Todo slot de imagen se llena con la herramienta de imagen (`atom_uikit_image`), no con URLs pegadas ni
mockups hechos con CSS. Los bloques traen una imagen de referencia que se sustituye.
