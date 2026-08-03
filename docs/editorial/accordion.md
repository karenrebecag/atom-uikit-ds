<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

FAQ stack:

```tsx
import { Accordion, AccordionItem } from '@/components/atoms/Accordion';

<Accordion>
  <AccordionItem title="What is Atom UIKit?" defaultOpen>
    A shared design system for product UI.
  </AccordionItem>
  <AccordionItem title="How do I install a component?">
    Use the registry / MCP install flow for your stack.
  </AccordionItem>
</Accordion>
```

## Accesibilidad

- Each item needs a clear `title` (the control name). Prefer one `defaultOpen` for progressive disclosure when starting a long FAQ.
- Do not put critical required form fields only inside a collapsed item.

## Cuándo no usar

- Mutually exclusive section switching with a selected tab look → `Tabs`.
- Single collapsible without siblings → a disclosure/`details` pattern may be lighter.
