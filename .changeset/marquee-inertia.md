---
"@atom-uikit/animations": patch
"@atom-uikit/components-react": patch
---

marquee-draggable: mas peso en la inercia.

Dos cambios, los dos sobre como se SIENTE el arrastre:

**La deceleracion sale con `power3.out`** (antes la ease por defecto, power1) y
dura 1.2s en vez de 1.0. La cola larga de esa curva es lo que se lee como peso;
con power1 la tira se frena de golpe y parece ligera.

**`data-lag`**: arrastre-retardo de los items. Cada uno se queda atras en
proporcion a la velocidad del frame y vuelve a su sitio con power3.out, asi que
el contenido pesa en vez de ir clavado al contenedor. 0 lo apaga.

Dos detalles que no son obvios:

- El wrap de GSAP devuelve `x` al origen de golpe, y ese salto vale el ancho
  entero de la lista. Sin descartarlo, cada vuelta del loop disparaba un tiron.
- Los items se buscan por ESTRUCTURA (`[data-draggable-marquee-list] > *`), no
  por clase. El canal de Webflow renombra `.marquee__item` a `.ds-marquee__item`
  y este modulo tiene que seguir siendo indiferente al prefijo — es justo lo que
  documenta su REQUIRED_ANATOMY.
