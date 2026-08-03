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
