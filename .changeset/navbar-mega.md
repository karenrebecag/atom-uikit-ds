---
"@atom-uikit/animations": minor
---

Nuevo organismo layout/navbar-mega + behavior mega-nav-animation (initMegaNav): mega-dropdowns morficos con hover intent direccional en desktop y slide-over por panel en movil. Motion por tokens (--easing-osmo, --duration-300/200) via readMotionTokens; funcional bajo reduced-motion (duraciones a 0, el menu sigue operando). El burger delega en el CSS de menu-button via data-menu-button. Budget de atom-animations.js subido 93/24 -> 130/32 (115/28 medidos): es el behavior mas grande del DS.
