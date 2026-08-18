---
"@atom-uikit/css": patch
---

review-card + layout/review-marquee: el testimonio como componente.

La seccion de reviews de los homes estaba hecha tres veces mal, y el componente
existe para que no se pueda repetir:

**Estaba duplicada por viewport.** Escritorio usaba dos tiras con animacion CSS;
movil, un Slider nativo maquetado aparte. El mismo texto en dos sitios se
desincroniza solo — y ya habia pasado: los dos ordenes estaban INVERTIDOS entre
si (escritorio autor→cita, movil cita→autor) y una card usaba una clase distinta
que el resto. Ahora es una sola maquetacion para todos los anchos: `data-snap`
del marquee cubre el caso movil midiendo cuantas cards entran, en vez de cambiar
de componente.

**El movimiento era una animacion CSS.** No se puede arrastrar y no se pausa
fuera del viewport. El behavior `marquee-draggable` ya existia y hace las dos
cosas; aqui solo se consume.

**La semantica era divs.** Un testimonio es una cita con atribucion:
`<figure><blockquote>` + `<figcaption>`. `<blockquote>` NO admite `<cite>` dentro
de si mismo — la atribucion va FUERA, y `<figure>` es lo que las une. Con divs
sueltos un lector de pantalla no anuncia que es una cita ni de quien es.

Detalles que no son obvios:

- La cita va PRIMERO. Al reves obliga a encabezar un blockquote que aun no ha
  empezado, y es ademas lo que ya hacia el movil.
- Las comillas las pone el CSS con `open-quote`, no el contenido: escritas a
  mano acaban mezclando rectas y tipograficas segun quien edite, y un lector de
  pantalla las deletrea. Cuelgan del flujo con margen negativo para que la
  primera letra siga alineada con el resto de la card.
- El layout pone `align-items: stretch` en el item: con altura por contenido
  cada atribucion cae donde acabe su cita y la fila se lee como un serrucho.
- Lleva `marquee--fade`, al reves que la tira de features. Alli el degradado
  insinuaba un movimiento que no existia porque esta quieta; aqui la tira avanza
  sola y el degradado dice la verdad.
