<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Dense records:

```tsx
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
} from '@/components/atoms/Table';

<Table>
  <TableCaption>Invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Customer</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow selected={false}>
      <TableCell>Ada</TableCell>
      <TableCell>$120</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Accesibilidad

- Use `TableHead` for column headers and `TableCaption` for a summary.
- `selected` lives on `TableRow`, not the root table.

## Cuándo no usar

- Marketing comparison layouts → layout blocks / cards.
- Simple key-value pairs → definition list or `Item` rows.

## Criterio de uso

- Usa Table cuando las relaciones entre columnas y filas importan y el usuario necesita comparar registros.
- Mantén encabezados descriptivos, una caption útil y estados de selección que se entiendan junto con el contenido de la fila.
- Para tablas densas, prioriza lectura y navegación por teclado antes de añadir decoración o acciones por celda.

## Gotchas

- Table es para datos, no para construir layout visual; usarlo como grid de marketing perjudica semántica y responsive.
- `selected` pertenece a `TableRow`; no lo apliques al root esperando que comunique una selección global.
