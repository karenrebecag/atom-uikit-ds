---
"@atom-uikit/animations": patch
---

menu-button lee motion de los tokens del DS en runtime (--easing-osmo, --duration-300) con fallback, respeta prefers-reduced-motion en el nivel GSAP, y initMenuButton/initDraggableMarquee/initVideoPlayer ahora se exportan desde el índice. Los layouts navbar-* emiten burger-icon__line (el contrato real del CSS y la animación; __bar dejaba el burger sin estilos en silencio) y declaran su estado inicial data-menu-button="burger".
