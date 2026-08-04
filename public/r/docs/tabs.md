<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Sectioned settings:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/Tabs';

<Tabs defaultValue="general" orientation="horizontal">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="general">Profile settings</TabsContent>
  <TabsContent value="billing">Invoices</TabsContent>
</Tabs>
```

## Accesibilidad

- Arrow keys move along `orientation`; keep one selected tab and matching `TabsContent` values.
- Uncontrolled: `defaultValue`. Controlled: `value` + `onValueChange`.

## Cuándo no usar

- Multi-step linear progress → `Stepper` / `ProgressNav`.
- Route-level navigation that should change the URL → real links / router nav.

## Criterio de uso

- Usa tabs para cambiar entre vistas relacionadas sin abandonar el contexto ni provocar un salto de página.
- Mantén los valores de `TabsTrigger` y `TabsContent` idénticos; cada tab debe tener un panel correspondiente.
- Usa orientación horizontal para secciones de contenido y vertical para settings con una navegación lateral.

## Gotchas

- El foco y las flechas deben seguir el eje declarado; no dependas sólo del click para cambiar de panel.
- Si el estado debe ser compartible por URL, indexable o conservarse al volver atrás, usa navegación real en lugar de tabs locales.
