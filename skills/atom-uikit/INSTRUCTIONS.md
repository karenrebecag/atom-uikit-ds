# Atom UIKit: reglas always-on

Pega esto en el `AGENTS.md` o `CLAUDE.md` del proyecto que consume el DS. Todo lo demás se lee bajo
demanda con `atom_uikit_skill` (capa `entrada`).

- El DS no está en npm. Pide el source por el MCP y cópialo; no reconstruyas componentes. Para el canal shadcn, instala `atom-foundation` una vez.
- Compón con bloques ejemplares, no con markup inventado. Antes de entregar corre la capa `cierre` y cita el veredicto de `atom_uikit_finalize`.
- Atom no usa formularios: el canal de conversión es WhatsApp, siempre un enlace a `wa.me`. <!-- regla: no-forms -->
- El logo es siempre el oficial de Atom, aunque la página sea de un cliente. <!-- regla: logo-oficial -->
