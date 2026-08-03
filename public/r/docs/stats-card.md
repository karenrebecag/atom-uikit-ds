<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

KPI with delta:

```tsx
import { StatsCard } from '@/components/atoms/StatsCard';

<StatsCard value="12.4k" label="Active users" trend="up" trendValue="+8%" />
```

## Accesibilidad

- `value` and `label` are required. Trend icons are `aria-hidden` — put meaning in `trendValue` text (e.g. `+8%`).
- Do not rely on trend color alone for up/down.

## Cuándo no usar

- Full data tables → `Table`.
- Marketing hero copy without a metric → Typography / layout blocks, not a stats card.
