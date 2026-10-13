# Acabado: la rúbrica de criterio

Guía, no gate: `atom_uikit_finalize` no puntúa estética. Es el criterio con el que relees la página
antes de entregar. Una página puede pasar la mitad contable entera y seguir leyéndose como
plantilla: eso es lo que estos cinco ejes atrapan.

## 1. Un foco por superficie

- Cada sección tiene UNA cosa que mirar: el titular, la cifra, el plan recomendado. Si dos elementos
  pelean por el mismo peso no se mira ninguno: baja uno de tamaño, contraste o aire.
- El acento de marca señala el foco, no decora: dos acentos en una pantalla equivalen a ninguno.
- La sección que no sabe decir su foco es relleno: quítala o fúndela con la vecina.

## 2. El ritmo lo da el aire, no el relleno

- El ritmo entre regiones sale de la clase de uso: `.section--hero` abre y `.section` lleva el cuerpo.
  Nunca se "da más aire" tocando el padding interno de un bloque.
- Dentro de una región el aire agrupa: lo junto, más cerca que lo aparte. Si todo está a la misma
  distancia no hay grupos y la jerarquía desaparece.

## 3. Profundidad por capas, no por sombras

- El plano se declara con la superficie y el borde. La sombra es para lo que de verdad flota
  (overlay, menú), no para dar "sensación de card". Si todo lleva sombra, nada está encima de nada.
- Los radios anidados son concéntricos: el interior lleva el radio del exterior menos su padding.

## 4. Gasta la audacia en un solo lugar

- Una página memorable tiene UN detalle que se recuerda: una cifra que rueda, un titular que se
  revela por líneas, una card que se levanta. Uno, en la región que más importa, y sale de un
  behavior publicado (ver [motion](motion.md)): no se inventa.
- El resto de la página es tranquila a propósito. Si todo llama la atención, el detalle no existe.

## 5. Un solo ancho para todo el contenido

- Toda sección comparte el MISMO ancho y gutter vía `.container` (`--size-container-content` +
  `--container-padding`): los bordes del contenido caen en la misma línea de arriba abajo. Un ancho
  inventado por sección (una a sangre junto a otra angosta, dos centradas a anchos distintos) lee a
  plantilla aunque cada bloque esté bien. Una medida angosta DENTRO de una sección sí es deliberada.

## Cómo se usa

Relee eje por eje y nombra en el reporte el foco de cada región, el detalle memorable y cualquier
borde que se salga del ancho común. Si no puedes nombrarlos, todavía no están.
