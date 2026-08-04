<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

```html
<!-- Opt-in por atributos: sin data-reveal, la seccion no se toca -->
<section data-reveal data-reveal-stagger="2">
  <div data-reveal-item>Uno</div>
  <div data-reveal-item>Dos</div>
  <div data-reveal-item>Tres</div>
</section>
```

```tsx
import { initScrollReveal } from '@atom-uikit/animations';
import { useEffect } from 'react';

useEffect(() => initScrollReveal(), []); // devuelve el cleanup
```

## Criterio de uso

- Usalo para dar entrada a secciones y rejillas al entrar en viewport, no para
  animar cada elemento de la pagina: cuando todo se revela, nada destaca.
- El stagger se elige por densidad: `1` para rejillas de muchas cards, `2` para
  hijos de seccion (default), `3` para reveals grandes y espaciados.
- Si no marcas `[data-reveal-item]`, el modulo anima los hijos directos; con un
  solo hijo se anima el propio contenedor.
- `data-reveal-delay` es de instancia (ms), para escalonar dos bloques entre si.
  No lo uses como escala: para eso estan los tokens de stagger.

## Accesibilidad

- Con `prefers-reduced-motion` el contenido aparece al instante y visible: la
  entrada es decoracion, la lectura no depende de ella.
- `data-motion-exempt` en la seccion la exime sin desmontar el resto.
- Nada queda invisible si el modulo no llega a inicializar: el estado oculto lo
  aplica el propio JS, no el CSS.

## Gotchas

- **Ojo**: el reveal ocurre UNA vez por elemento (el observer se desconecta al
  entrar). Volver a subir y bajar no lo repite — es entrada, no efecto de scroll.
- **Nota**: la duracion, el stagger y el ease salen de los tokens en runtime
  (`--duration-600`, `--stagger-*`, `--easing-osmo`); cambiar el token re-afina
  todos los consumidores sin tocar el modulo.
- **Ojo**: sin `CustomEase` el ease cae al vecino nombrado de GSAP. Funciona,
  pero no es la curva firma — cargalo si el feel importa.
- **Nota**: el modulo anterior de scroll-reveal (documentado en el CMS con
  ScrollTrigger + `data-scroll-*`) quedo superado por este contrato; los
  atributos viejos no se leen.

## Cuándo no usar

- Efectos ligados al progreso del scroll (parallax, pin) → ScrollTrigger directo.
- Entrada de un overlay o panel → el propio componente ya coreografia su apertura.
- Listas largas virtualizadas → animar filas que se montan y desmontan produce
  parpadeo; deja la lista quieta.
