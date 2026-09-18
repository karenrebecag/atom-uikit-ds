# 014 — `components.css` dentro de `@layer atom-ds`, en fases

- **Status:** accepted (fase 1)
- **Date:** 2026-09-18
- **Context:** `/v1/components.css` se enlaza en el head de Webflow, que va después de la hoja del sitio.
  Con una sola clase de cada lado gana la del DS, así que editar una clase `ds-*` desde el panel se
  ve en el canvas (que no carga el canal) y desaparece en preview y en producción. En la home de
  atomchat.io hubo que crear combos solo para ganar especificidad: `ds-tabs-steps--fit`,
  `__title--prominent`, `__trigger--prominent`, `__text--tight`, y el `--accent` del Stat Card.
  Revisa la regla 3 del modo connected en `webflow-playbook.md` ("en Webflow nadie itera"): en
  atomchat.io sí se itera ahí.
- **Decision:** publicar el mismo CSS dentro de `@layer atom-ds` como `/v1/components.layered.css`.
  Un estilo sin layer le gana siempre a uno con layer, sin importar la especificidad ni el orden, así
  que el DS pasa a ser el valor por defecto y el sitio manda. `components.css` NO cambia en esta fase.
  El build falla si la variante tiene reglas fuera del layer, y el smoke de producción lo vuelve a
  comprobar.
- **Consequences:**
  - Con el layer también gana el CSS sin layer del sitio que antes perdía. Medido el 2026-09-18 en la home
    publicada, cambiando el link por la variante con layer y comparando los estilos computados de los 537
    elementos `ds-*`:
    - **Estados rotos (lo grave):** una regla de estado del DS (`.x[data-active]`, activo) dentro del layer
      pierde contra la clase base de Webflow sin layer, aunque tenga más especificidad.
      - tabs-steps: el trigger activo vuelve al color muted y el visual activo queda en `display: none`.
      - bouncy-tabs: el indicador pasa de `absolute` a `relative`, y el botón activo pierde su color.
    - **Deriva de la copia de Webflow:**
      - `ds-marquee`: el padding horizontal queda a la mitad.
      - `ds-review-card`: en móvil pierde el padding del DS.
    - **Sin efecto visible:** `text-align: start` pasa a `left` (74 cards).
  - Por eso la fase 2 no es solo cambiar el link: antes, cada clase `ds-*` que Webflow copia tiene que dejar
    de declarar las propiedades que el DS cambia por estado o por breakpoint. Si la copia de Webflow solo
    declara lo que el sitio quiere sobrescribir, el layer funciona como está previsto.
  - Fases:
    1. **Esta:** publicar la variante en paralelo.
    2. Limpiar las copias de Webflow con el diff de estilos computados en cero o explicado. Cambiar el link
       en atomchat.io y quitar los combos de especificidad.
    3. Decidir si `components.css` lleva el layer por defecto. Sería un cambio de contrato de /v1: nuevo ADR
       o `/v2`.
  - `webflow.css` (canal master, ADR 009) y `embed.css` (ADR 006) quedan fuera. `embed.css` tiene que
    ganarle al host a propósito.
