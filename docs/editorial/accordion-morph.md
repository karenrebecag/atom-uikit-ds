<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

```tsx
import { AccordionMorph } from '@atom-uikit/react';
import { initAccordionMorph } from '@atom-uikit/animations';
import { useEffect } from 'react';

const faqs = [
  { question: 'Que hace diferentes a los marcos?', answer: 'Cada marco se lamina en carbono crudo...' },
  { question: 'Cual es la garantia?', answer: 'Dos anos contra fallo estructural...' },
];

export function Faq() {
  useEffect(() => initAccordionMorph(), []);
  return <AccordionMorph items={faqs} startOpen={0} />;
}
```

```tsx
// Dentro de un dashboard: sin goo, disclosure instantaneo (D5 canal codigo)
<AccordionMorph items={faqs} animated={false} />
```

## Accesibilidad

- El disclosure es **funcional**: con `prefers-reduced-motion` o `data-motion-exempt`
  abre y cierra instantaneo por DOM directo — nunca depende de que gsap cargue.
- El behavior mantiene `aria-expanded` en el trigger y `aria-hidden` + `inert` en el
  panel; las flechas mueven el foco entre triggers con wrap.
- La capa goo lleva `aria-hidden`: son formas decorativas, el contenido real vive
  fuera del filtro (el blur destruye el texto — por eso existen dos capas).

## Cuándo no usar

- FAQ sobria dentro de flujos densos o legales → usa `Accordion` (CSS-only, grid trick).
- Lista de items plegables en un dashboard → usa `Accordion`; aqui el goo es
  protagonista y compite con los datos.
- Mas de ~8 preguntas → el filtro por fila cuesta GPU; usa `Accordion` o pagina el FAQ.
