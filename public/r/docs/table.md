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
