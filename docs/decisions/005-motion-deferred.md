# 005 — Motion comportamental diferido (W6)

- **Status:** accepted (deferred execution)  
- **Date:** 2026-07-28  
- **Context:** Tokens de motion (easings, duraciones largas) sí entran en el lenguaje; comportamientos GSAP/Webflow interactions no.  
- **Decision:** No iniciar W6 sin spec explícito. Tokens `easing-osmo`, `duration-1200/1800` ya existen.  
- **Consequences:** `packages/animations` permanece para módulos existentes; nuevos reveals/marquees requieren wave dedicada + `prefers-reduced-motion`.
