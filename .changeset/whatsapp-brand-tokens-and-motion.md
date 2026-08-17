---
"@atom-uikit/tokens": minor
"@atom-uikit/css": minor
---

El boton de WhatsApp llega entero al canal de Webflow: tokens de marca + motion

Dos huecos que se veian en produccion como un boton negro y sin animar.

`--whatsapp` y `--whatsapp-foreground` estaban declarados como literales dentro
de `whatsapp-button.css`, no en la capa semantica. Al no ser tokens no entraban
en el plan de sync, no existian como Variables en Webflow, y quien reconstruyera
el boton alla tenia que elegir otra cosa: se uso `success`/`success-foreground`,
cuyo foreground es #0a0a0a por WCAG sobre el verde — de ahi el texto negro. Ahora
son semanticos con su porque: `whatsapp` NO es `success`, coincide hoy en valor
pero responde a la marca del canal; si success cambia, este no.

El motion (patron button-009, el deslizamiento del icono en hover) vivia dentro
del CSS del componente, que el canal de Webflow no lleva — su contrato es servir
SOLO lo que el panel de estilos no puede declarar. Se extrae a
`whatsapp-button-motion.css` y se importa en `webflow.css`, junto a
button-text-swap. El canal queda en 8kb raw / 1kb gz (budget 22/3).

El motion EXIGE la anatomia completa (`__inner` con `__icon.is--left` +
`__label` + `__icon.is--right`): con un solo icono no hay nada que deslizar. Los
tres estados entran en STATE_RENAMES del prefijador, que los expone como
`ds-is-left`, `ds-is-right` y `ds-atom-wa-btn-animated`.
