/**
 * Layout: footer-columns
 *
 * Footer completo: marca + tagline a la izquierda, columnas de links
 * agrupados, fila legal abajo. Structure-only: cero color/tipografia/motion —
 * los atomos (logo, nav-link, eyebrow, divider) ponen la personalidad.
 *
 * Modernizado 2026-07-30 (pipeline de organismos):
 *   - logo atom dual light/dark (antes un <img class="image"> con un solo src)
 *   - nav-links con el part __text (sin el, el subrayado animado del atomo no dispara)
 *   - columnas repetibles via data-repeat (antes 3 columnas x 2 links fijos)
 *   - titulos de columna con .eyebrow (antes h4 con font-weight literal)
 *   - theming opcional: {{footer_theme}} = "dark" voltea los semantics del footer
 *
 * Contrato de edicion (decision de Karen 2026-07-30): EDITABLE -> tagline,
 * titulos de columna, links (repetibles 0..N por columna) y legal. FIJO -> el
 * logo (sin slots). Columna sin titulo ni links desaparece sola (prune).
 */

export const footerColumns = {
  slug: 'footer-columns',
  name: 'Footer Columns',
  description:
    'Footer completo: logo + tagline izquierda, columnas repetibles de links agrupados, fila legal abajo. Superficie clara u oscura via data-theme. Structure only.',
  components: ['logo', 'nav-link', 'divider'],
  html: `<!-- Layout: footer-columns -->
<footer class="l-footer-columns" data-theme="{{footer_theme}}">
  <div class="container">
    <div class="l-footer-columns__top">
      <div class="l-footer-columns__brand">
        <!-- LOGO FIJO de marca (sin slots a proposito): assets oficiales R2,
             el atomo voltea light/dark con data-theme -->
        <a class="logo logo--m" href="https://atomchat.io" aria-label="Atom">
          <img class="logo__light" src="https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-light.svg" alt="Atom" />
          <img class="logo__dark" src="https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-dark.svg" alt="Atom" />
        </a>
        <p class="l-footer-columns__tagline body-sm">{{tagline}}</p>
      </div>
      <!-- 3 columnas fijas (data-repeat no anida): columna sin titulo ni links
           queda vacia e invisible. Cada lista de links si es repetible. -->
      <div class="l-footer-columns__cols">
        <div class="l-footer-columns__col">
          <span class="eyebrow l-footer-columns__col-title">{{col1_title}}</span>
          <nav class="l-footer-columns__col-links" aria-label="{{col1_title}}" data-repeat="col1_link">
            <a href="{{link_url}}" class="nav-link"><span class="nav-link__text">{{link_label}}</span></a>
          </nav>
        </div>
        <div class="l-footer-columns__col">
          <span class="eyebrow l-footer-columns__col-title">{{col2_title}}</span>
          <nav class="l-footer-columns__col-links" aria-label="{{col2_title}}" data-repeat="col2_link">
            <a href="{{link_url}}" class="nav-link"><span class="nav-link__text">{{link_label}}</span></a>
          </nav>
        </div>
        <div class="l-footer-columns__col">
          <span class="eyebrow l-footer-columns__col-title">{{col3_title}}</span>
          <nav class="l-footer-columns__col-links" aria-label="{{col3_title}}" data-repeat="col3_link">
            <a href="{{link_url}}" class="nav-link"><span class="nav-link__text">{{link_label}}</span></a>
          </nav>
        </div>
      </div>
    </div>
    <div class="l-footer-columns__legal">
      <hr class="divider" />
      <p class="l-footer-columns__legal-text body-sm">{{legal}}</p>
    </div>
  </div>
</footer>`,
  css: `/* Layout: footer-columns — structure only.
   Distribucion citada del footer de ATOM: marca separada de las columnas por
   un vacio grande (8.5em entre bloques), columnas cap a 13.375em con listas
   APRETADAS (0.3125em entre links — la densidad es parte del look), y fila
   legal en grid de 3 columnas. El lateral lo gobierna .container. */
.l-footer-columns {
  padding-block: var(--section-padding-m) var(--spacing-8);
  background-color: var(--background);
  color: var(--foreground);
  border-top: var(--stroke-hairline) solid var(--border);
}

.l-footer-columns__top {
  display: flex;
  justify-content: space-between;
  /* separacion marca <-> columnas del footer-top__links de ATOM */
  gap: 8.5em;
}

.l-footer-columns__brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  max-width: 22rem;
}

.l-footer-columns__tagline {
  color: var(--muted-foreground);
}

.l-footer-columns__cols {
  display: flex;
  /* gap-sm de ATOM entre columnas; cada una cap a su 13.375em */
  gap: var(--spacing-5);
  flex-wrap: wrap;
}

.l-footer-columns__col {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 13.375em;
  min-width: 9em;
  flex: 1;
}

.l-footer-columns__col-title {
  color: var(--muted-foreground);
  /* footer-link__col-top de ATOM: aire grande titulo -> lista */
  margin-block-end: var(--spacing-6);
}

.l-footer-columns__col-links {
  display: flex;
  flex-direction: column;
  /* lista apretada de ATOM (footer-link__col-ul: 0.3125em) */
  gap: 0.3125em;
  align-items: flex-start;
}

.l-footer-columns__legal {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  margin-block-start: var(--section-padding-s);
}

.l-footer-columns__legal-text {
  color: var(--muted-foreground);
}

@media (max-width: 991px) {
  .l-footer-columns__top {
    flex-direction: column;
    gap: var(--spacing-12);
  }
}

@media (max-width: 767px) {
  .l-footer-columns__cols {
    gap: var(--spacing-10);
  }
  .l-footer-columns__col {
    max-width: none;
    min-width: 12em;
  }
  .l-footer-columns__legal {
    margin-block-start: var(--spacing-12);
  }
}`,
};
