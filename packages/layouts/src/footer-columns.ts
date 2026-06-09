/**
 * Layout: footer-columns
 *
 * Footer completo: logo + tagline izquierda, columnas de links agrupados, fila legal abajo.
 * Structure-only. References DS components by BEM class.
 */

export const footerColumns = {
  slug: 'footer-columns',
  name: 'Footer Columns',
  description:
    'Footer completo: logo + tagline izquierda, columnas de links agrupados, fila legal abajo. Structure only.',
  components: ['nav-link', 'typography', 'divider', 'image'],
  html: `<!-- Layout: footer-columns -->
<footer class="l-footer-columns">
  <div class="l-footer-columns__brand">
    <img src="{{logo}}" alt="Logo" class="image" />
    <p class="l-footer-columns__tagline">{{tagline}}</p>
  </div>
  <div class="l-footer-columns__cols">
    <div class="l-footer-columns__col">
      <h4 class="l-footer-columns__col-title">{{col1_title}}</h4>
      <a href="{{link1_url}}" class="nav-link">{{link1_label}}</a>
      <a href="{{link2_url}}" class="nav-link">{{link2_label}}</a>
    </div>
    <div class="l-footer-columns__col">
      <h4 class="l-footer-columns__col-title">{{col2_title}}</h4>
      <a href="{{link3_url}}" class="nav-link">{{link3_label}}</a>
      <a href="{{link4_url}}" class="nav-link">{{link4_label}}</a>
    </div>
    <div class="l-footer-columns__col">
      <h4 class="l-footer-columns__col-title">{{col3_title}}</h4>
      <a href="{{link5_url}}" class="nav-link">{{link5_label}}</a>
      <a href="{{link6_url}}" class="nav-link">{{link6_label}}</a>
    </div>
  </div>
  <div class="l-footer-columns__legal">
    <hr class="divider" />
    <p>{{legal}}</p>
  </div>
</footer>`,
  css: `/* Layout: footer-columns — structure only */
.l-footer-columns {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
  border-top: 1px solid var(--border);
}
.l-footer-columns__brand {
  max-width: 200px;
}
.l-footer-columns__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8);
}
@media (max-width: 768px) {
  .l-footer-columns__cols {
    grid-template-columns: 1fr;
  }
}
.l-footer-columns__col-title {
  font-weight: 600;
  margin-bottom: var(--spacing-2);
}
.l-footer-columns__legal {
  margin-top: var(--spacing-4);
}`,
};