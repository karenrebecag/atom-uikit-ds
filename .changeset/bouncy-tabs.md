---
"@atom-uikit/animations": patch
"@atom-uikit/css": patch
---

bouncy-tabs: pestañas con indicador elastico y card que se comprime.

Sustituye al componente Tabs nativo de Webflow en secciones con video, donde el
cambio instantaneo entre paneles se lee como un salto de maquetacion.

Tres piezas, y cada una resuelve algo que la version obvia hace mal:

**El indicador se estira mientras viaja.** Entre botones de anchos distintos, un
indicador que solo se desplaza y luego cambia de ancho da dos movimientos
seguidos. Aqui el ancho interpola durante el trayecto, con un sobrepaso al
llegar. El sobrepaso se RECORTA contra los limites del nav: sin eso, saltar del
primer al ultimo boton empuja el indicador fuera de la pastilla.

**El alto de la card se anima al del panel entrante.** Los paneles van en
absoluto para que no se apilen, asi que el alto hay que medirlo y escribirlo; si
no, la card colapsa a cero en cada cambio.

**Los tiempos salen de los tokens**, no del JS: `--duration-300` (viaje),
`--duration-200` (alto), `--duration-150` (squash) y `--easing-spring`. Un
cambio de token mueve la animacion sin tocar el modulo.

Accesibilidad: flechas, Home y End recorren las pestañas; `prefers-reduced-motion`
deja el cambio instantaneo pero funcional. El ghost aparece en el sitio donde
esta el cursor en vez de volar desde su ultima posicion — un rastro cruzando la
pastilla al volver a entrar el raton se lee como un fallo.

Va con `layout/bouncy-tabs`: la anatomia tiene dos trampas (indicador y ghost
son HERMANOS de los botones, y `data-active` va en boton Y panel) que a mano se
ponen mal.

**Budget subido** a 155/40 (medido 147/37). Es el segundo behavior mas grande
tras mega-nav.
