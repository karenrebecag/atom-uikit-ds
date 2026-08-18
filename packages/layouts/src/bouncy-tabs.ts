/**
 * Layout: bouncy-tabs
 *
 * Pestañas con indicador elastico sobre una card que se comprime al conmutar.
 *
 * Publica la anatomia del behavior `bouncy-tabs`. Existe porque el patron tiene
 * dos partes que a mano se ponen mal: el indicador y el ghost son hermanos de
 * los botones (no envoltorios), y el panel activo se marca con data-active en
 * DOS sitios — boton y panel — o el modulo arranca sin estado inicial.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 */

export const bouncyTabs = {
  slug: 'bouncy-tabs',
  name: 'Bouncy Tabs',
  description:
    'Pestañas con indicador que se estira al viajar entre botones de anchos distintos, se pasa unos pixeles y vuelve. La card se comprime en el cambio y su alto se anima al del panel entrante. Pensada para paneles con media pesada (video, imagen) donde el corte seco se nota.',
  components: ['bouncy-tabs', 'bouncy-tabs-animation'],
  html: `<!-- Layout: bouncy-tabs -->
<!-- Get component CSS: atom_uikit_source("bouncy-tabs") -->
<!-- Behavior: atom_uikit_source("bouncy-tabs-animation") — requiere gsap (sin plugins) -->
<!--
  ANATOMIA, en el orden que importa:

  El indicador y el ghost van ANTES de los botones en el DOM. No es estetico:
  se posicionan en absoluto y el orden de pintado lo fija el z-index, asi que
  ponerlos primero deja los role="tab" seguidos y un lector de pantalla
  recorre las pestañas sin dos divs decorativos intercalados.

  data-active viaja en DOS sitios y los dos hacen falta: en el boton inicial
  (de ahi sale la posicion de arranque del indicador) y en su panel (de ahi
  sale el alto inicial de la card). Marcar solo uno deja el indicador en 0,0
  o la card en alto 0 hasta el primer clic.

  Los tiempos NO se declaran aqui. El modulo los lee de --duration-300/200/150
  y --easing-spring en runtime, asi que un cambio de token mueve la animacion
  sin tocar este markup.

  aria-controls / id: el modulo no los inyecta. Si el panel lleva contenido
  interactivo (un video con controles, un enlace), la relacion tiene que estar
  escrita o el foco de teclado se pierde entre nav y panel.

  TEMA: data-theme="dark" en el root del componente (o en cualquier ancestro)
  cambia el bloque entero. tokens.css declara [data-theme=dark] como selector
  generico, asi que reasigna los tokens solo dentro de ese subarbol — no hace
  falta clase ni modificador. El componente no pinta --background: en dark queda
  como isla oscura sobre el fondo de la pagina. Si se quiere la banda entera
  oscura, el fondo lo pone esta seccion, no el componente.

  Media dentro del panel: el hueco ya reserva proporcion (aspect-ratio) y recorta
  con object-fit, asi que el alto del panel no depende de cuando cargue el
  archivo ni de las dimensiones que traiga.

  Los <video> llevan autoplay/muted/playsinline, pero eso NO basta: el modulo
  reproduce el del panel activo y pausa el resto, porque un panel oculto puede
  no arrancar nunca y aparecer congelado al conmutar.
-->

<section class="l-bouncy-tabs" id="{{section_id}}">
  <div class="l-bouncy-tabs__header">
    <div class="l-bouncy-tabs__eyebrow">{{eyebrow}}</div>
    <h2 class="h2 l-bouncy-tabs__title" data-split="heading">{{heading}}</h2>
  </div>

  <div class="bouncy-tabs" data-bouncy-tabs>
    <div class="bouncy-tabs__nav" data-bouncy-tabs-nav role="tablist" aria-label="{{tablist_label}}">
      <div class="bouncy-tabs__ghost" data-bouncy-tabs-ghost aria-hidden="true"></div>
      <div class="bouncy-tabs__indicator" data-bouncy-tabs-indicator aria-hidden="true"></div>

      <button type="button" class="bouncy-tabs__button" data-bouncy-tabs-button data-active
              role="tab" id="tab-1" aria-controls="panel-1" aria-selected="true">{{tab_1_label}}</button>
      <button type="button" class="bouncy-tabs__button" data-bouncy-tabs-button
              role="tab" id="tab-2" aria-controls="panel-2" aria-selected="false">{{tab_2_label}}</button>
      <button type="button" class="bouncy-tabs__button" data-bouncy-tabs-button
              role="tab" id="tab-3" aria-controls="panel-3" aria-selected="false">{{tab_3_label}}</button>
      <button type="button" class="bouncy-tabs__button" data-bouncy-tabs-button
              role="tab" id="tab-4" aria-controls="panel-4" aria-selected="false">{{tab_4_label}}</button>
    </div>

    <div class="bouncy-tabs__card" data-bouncy-tabs-card>
      <div class="bouncy-tabs__panels" data-bouncy-tabs-panels>

        <div class="bouncy-tabs__panel" data-bouncy-tabs-panel data-active
             role="tabpanel" id="panel-1" aria-labelledby="tab-1">
          <div class="bouncy-tabs__panel-text">
            <h3 class="bouncy-tabs__heading">{{tab_1_label}}</h3>
            <p class="bouncy-tabs__para">{{tab_1_body}}</p>
          </div>
          <div class="bouncy-tabs__panel-visual">
            <video src="{{tab_1_video}}" autoplay loop muted playsinline preload="metadata"></video>
          </div>
        </div>

        <div class="bouncy-tabs__panel" data-bouncy-tabs-panel
             role="tabpanel" id="panel-2" aria-labelledby="tab-2">
          <div class="bouncy-tabs__panel-text">
            <h3 class="bouncy-tabs__heading">{{tab_2_label}}</h3>
            <p class="bouncy-tabs__para">{{tab_2_body}}</p>
          </div>
          <div class="bouncy-tabs__panel-visual">
            <video src="{{tab_2_video}}" autoplay loop muted playsinline preload="metadata"></video>
          </div>
        </div>

        <div class="bouncy-tabs__panel" data-bouncy-tabs-panel
             role="tabpanel" id="panel-3" aria-labelledby="tab-3">
          <div class="bouncy-tabs__panel-text">
            <h3 class="bouncy-tabs__heading">{{tab_3_label}}</h3>
            <p class="bouncy-tabs__para">{{tab_3_body}}</p>
          </div>
          <div class="bouncy-tabs__panel-visual">
            <video src="{{tab_3_video}}" autoplay loop muted playsinline preload="metadata"></video>
          </div>
        </div>

        <div class="bouncy-tabs__panel" data-bouncy-tabs-panel
             role="tabpanel" id="panel-4" aria-labelledby="tab-4">
          <div class="bouncy-tabs__panel-text">
            <h3 class="bouncy-tabs__heading">{{tab_4_label}}</h3>
            <p class="bouncy-tabs__para">{{tab_4_body}}</p>
          </div>
          <div class="bouncy-tabs__panel-visual">
            <video src="{{tab_4_video}}" autoplay loop muted playsinline preload="metadata"></video>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>`,
  css: `.l-bouncy-tabs {
  padding-block: var(--section-padding-l);
}

.l-bouncy-tabs__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  align-items: center;
  text-align: center;
  margin-inline: auto;
  margin-block-end: var(--rhythm-s);
  padding-inline: var(--spacing-6);
  max-width: 42rem;
}

.l-bouncy-tabs__eyebrow {
  color: var(--muted-foreground);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.l-bouncy-tabs__title {
  margin: 0;
}
`,
};
