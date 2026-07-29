/**
 * Layout: loader
 *
 * Overlay de pantalla completa con fondo negro y spinner animado centrado. Representa el estado de carga antes de la transición de salida.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/loader).
 */

export const loader = {
  slug: 'loader',
  name: 'Loader',
  description:
    'Cargador de pantalla completa con overlay negro y spinner giratorio centrado. Incluye transición para salida.',
  components: ['spinner'],
  html: `<!-- Layout: loader -->
<div class="l-loader">
  <div class="l-loader__overlay">
    <div class="l-loader__content">
      <svg
        class="spinner l-loader__spinner"
        stroke="currentColor"
        fill="none"
        stroke-width="0"
        viewBox="0 0 24 24"
        height="4rem"
        width="4rem"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.2"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="currentColor"
        ></path>
        <path
          d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  </div>
</div>`,
  css: `/* Layout: loader — structure only, pure DS tokens */
.l-loader {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.l-loader__overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-70);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-black);
  color: var(--color-white);
  transform: translateY(0);
}

.l-loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.l-loader__spinner {
  /* El giro lo pone el componente spinner (con su reduced-motion); el layout
     solo dimensiona el slot. Ley: layouts sin motion — maquetan, no animan. */
  width: 4rem;
  height: 4rem;
}`,
};