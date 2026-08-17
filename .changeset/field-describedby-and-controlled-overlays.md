---
"@atom-uikit/components-react": patch
---

`Field` liga su texto de ayuda y su error al control con `aria-describedby`. Los pintaba como párrafos sueltos y sin `id`, así que un lector de pantalla anunciaba la etiqueta y nada más: la instrucción y el motivo del rechazo solo existían para quien podía verlos. Se referencia únicamente el texto presente en el DOM (el error sustituye a la descripción), se preserva el `aria-describedby` que traiga el consumidor, y con varios hijos no se anota nada, porque adivinar cuál es el campo y describir el equivocado es peor que no describir.

Los cuatro overlays con modo controlado —`Dialog`, `Drawer`, `Sheet` y `AlertDialog`— dejan de cerrarse por su cuenta. Al pedir el cierre desmontaban su propio contenido con estado local, ignorando que el consumidor puede vetar el cierre (el caso clásico: "tienes cambios sin guardar"). Peor que quedarse abierto de más: como `open` seguía en `true`, nunca volvía a transicionar y el overlay quedaba imposible de reabrir. Ahora `open` es lo único que decide y el estado local solo sostiene el nodo mientras dura la animación de salida.

Esos mismos cuatro overlays ganan focus trap real y devolución del foco. `aria-modal` ya escondía el fondo del lector de pantalla, pero el Tab del navegador seguía saliendo a la página de atrás: se podía tabular hasta un formulario tapado por el overlay. Ahora el recorrido da la vuelta dentro del contenedor y, al cerrar, el foco regresa a quien abrió — antes caía al principio del documento. `Drawer` además no movía el foco al abrirse en absoluto: se quedaba en el disparador, detrás del overlay.

Cobertura nueva de interacción sobre esos componentes: 49 tests (Escape, click en overlay, foco al abrir, bloqueo de scroll, modo controlado, y el teclado completo de `Select` — apertura con ArrowDown, recorrido con wrap, commit con Enter, cierre con Escape y click fuera).
