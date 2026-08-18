---
"@atom-uikit/animations": patch
"@atom-uikit/css": patch
---

bouncy-tabs: tema por atributo, video que arranca de verdad y tipografia del sistema.

**Tema: cero CSS nuevo.** `tokens.css` declara `[data-theme=dark]` como selector
GENERICO, no `:root[data-theme=dark]`, asi que reasigna sus 112 tokens en
cualquier elemento. Poner el atributo en el root del componente lo oscurece
entero sin tocar el resto de la pagina. Escribir aqui un modificador propio
seria duplicar un contrato que el DS ya publica, y quedaria desincronizado en
cuanto cambie un token — asi que lo unico que se anade es documentacion.

El componente NO pinta `--background` a proposito: en dark es una isla oscura
sobre el fondo de la pagina. La banda entera oscura es cosa del layout que lo
envuelve, no de la pintura del componente.

Contraste medido en dark, todos AA con holgura: parrafo 7.11:1, nav 6.90:1,
pestana activa 18.97:1.

**El autoplay no bastaba con el atributo.** Los paneles inactivos llevan
`visibility: hidden`, y un elemento oculto puede no arrancar nunca: al conmutar
aparecia congelado en el primer frame. Ahora el modulo reproduce el video del
panel entrante y pausa el resto — de paso deja de haber cuatro videos
decodificando a la vez, que en movil es puro gasto.

Se busca por ETIQUETA, no por un `data-*` nuevo: el contrato F8b solo debe
listar los enganches que el consumidor tiene que declarar, y un `<video>` dentro
del panel no es una decision suya. El rechazo de `play()` se traga en silencio
porque es un caso esperado, no un error.

**Encuadre.** El hueco reserva `aspect-ratio` y el media recorta con
`object-fit: cover`. Antes el `height: 100%` se resolvia a `auto` — el
contenedor no tenia altura — asi que `object-fit` no tenia contra que recortar y
cada video imponia su alto al panel, ampliando el salto de altura entre
pestanas mas de lo que el contenido justifica.

**Tipografia.** Las pestanas suben de `--font-size-sm` a `--font-size-base`: con
cuatro etiquetas largas (33 caracteres en pt) 12.8px se leia pequeno. Los
`line-height` literales (1.5, 1.3) pasan a `--line-height-base` y
`--line-height-xl`; el `line-height: 1` del boton se queda y ahora dice por que
(es la convencion del DS para interactivos: la altura la fija el padding).
`font-family` sube al root para heredar en vez de repetirse por hijo.

Budget sin tocar: 148.1/155 raw, 37.4/40 gz.
