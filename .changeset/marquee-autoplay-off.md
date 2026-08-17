---
"@atom-uikit/animations": patch
"@atom-uikit/components-react": patch
---

marquee-draggable: `data-autoplay="false"` para una tira que solo se mueve al
arrastrar.

La velocidad de REPOSO del loop era siempre ±1, asi que la tira avanzaba sola y
no habia forma de pedir un carrusel puramente manual. Ahora el reposo puede ser
0: arranca quieta y vuelve a quedarse quieta despues de cada arrastre. El resto
del gesto — impulso, tope por `multiplier`, inercia — es identico.

`data-direction` deja de actualizarse cuando la velocidad es 0, porque 0 no es
un sentido: el atributo existe para que el CSS reaccione a hacia donde va la
tira, y no debe parpadear a "left" cada vez que se detiene.

**Y `Marquee.tsx` no emitia `marquee--draggable`.** Sin esa clase la animacion
CSS de `__list` sigue corriendo mientras GSAP mueve `__collection` sobre el
mismo eje: la tira avanza al doble y el wrap deja de cuadrar con el ancho real.
El piloto de Webflow tenia el mismo hueco. Los dos corregidos.

El gate `webflow-dom` fue quien lo destapo: al declarar `data-autoplay` en
REQUIRED_HOOKS sin exponerlo en el componente, el marquee se cayo del canal de
Webflow con `domContract fail`. Funcionando como debe.
