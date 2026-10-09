# Composición de la página

Lo global: qué regiones lleva la página, en qué orden y con qué presupuesto. Lo local de cada región
(ritmo, superficie natural, motion y copy de referencia) ya viene decidido en su bloque; no lo reescribas.

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
