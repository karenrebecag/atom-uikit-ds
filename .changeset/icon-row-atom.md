---
"@atom-uikit/css": minor
---

Nuevo atomo `icon-row`: la fila de SVGs que el DS no tenia

El DS enviaba la escala de un icono suelto (`.icon`) pero no el contenedor que
los pone en linea, asi que cada consumidor se lo reimplementaba. `pricing-card`
lo resolvia DOS veces —`__channels` y `__logos`— con gaps y alturas propias, y
con un caso especial hardcodeado por logo.

`icon-row` da el gap en `em` (xs/s/m/l), normaliza los hijos por ALTURA dejando
el ancho libre (los logos de terceros no comparten caja: forzar el ancho los
deforma), y anade `--wrap` para filas largas y `--indented` para alinear con un
label que lleva icono. Las dos filas de la card pasan a componerlo y solo
declaran color y tamano.
