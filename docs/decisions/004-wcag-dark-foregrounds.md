# 004 — Foregrounds oscuros en brand y destructive (WCAG AA)

- **Status:** accepted  
- **Date:** 2026-07-28  
- **Context:** Blanco sobre `#ff6600` ≈ 2.9:1; sobre coral ≈ 3.6:1 — fallan AA normal text (4.5:1).  
- **Decision:** `brand-foreground` y `destructive-foreground` → `neutral.950`. Gate `scripts/check-contrast.mjs` en CI.  
- **Consequences:** Botones brand/danger se ven con texto oscuro. No “arreglar” a blanco sin bajar el gate o cambiar la rampa.
