<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Single date pick:

```tsx
import { Calendar } from '@/components/atoms/Calendar';

<Calendar mode="single" selected={day} onSelect={setDay} />
```

Range for filters:

```tsx
<Calendar
  mode="range"
  rangeFrom={from}
  rangeTo={to}
  onRangeSelect={(a, b) => { setFrom(a); setTo(b); }}
/>
```

## Accesibilidad

- Wire `onSelect` vs `onRangeSelect` to match `mode`. `disabledDates` is a predicate, not a list.
- Pair with a labeled field when the calendar is the control for a form value.

## Cuándo no usar

- Typing a known ISO date quickly → `Input` with validation.
- Time-of-day without a date → a time control, not the month grid alone.

## Criterio de uso

- Usa modo `single` para una fecha y `range` para periodos; el label del campo debe explicar qué representa la selección.
- Deshabilita fechas inválidas con una regla de negocio estable y comunica restricciones antes de que el usuario explore todo el mes.
- Conserva el contexto de mes y año mientras se navega; la selección no debe depender sólo del color del día.

## Gotchas

- `disabledDates` es un predicate; no pases una lista esperando que el componente la interprete automáticamente.
- Los controles de navegación del mes necesitan nombres accesibles y el calendario debe seguir siendo usable con teclado.
