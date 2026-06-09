/**
 * Layout: footer-simple
 *
 * Una fila: logo, links horizontales, legal. Para landings de una pagina.
 * Structure-only. References DS components by BEM class.
 */

export const footerSimple = {
  slug: 'footer-simple',
  name: 'Footer Simple',
  description:
    'Una fila: logo, links horizontales, legal. Para landings de una pagina. Structure only.',
  components: ['nav-link', 'typography', 'divider', 'image'],
  html: `<!-- Layout: footer-simple -->
<footer class="l-footer-simple">
  <div class="l-footer-simple__brand">
    <img src="{{logo}}" alt="Logo" class="image" />
  </div>
  <div class="l-footer-simple__links">
    <a href="{{link1_url}}" class="nav-link">{{link1_label}}</a>
    <a href="{{link2_url}}" class="nav-link">{{link2_label}}</a>
    <a href="{{link3_url}}" class="nav-link">{{link3_label}}</a>
  </div>
  <div class="l-footer-simple__legal">
    <p>{{legal}}</p>
  </div>
</footer>`,
  css: `/* Layout: footer-simple — structure only */
.l-footer-simple {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-6);
  padding: var(--spacing-6) var(--spacing-8);
  border-top: 1px solid var(--border);
  font-size: var(--text-sm);
}
.l-footer-simple__brand {
  flex-shrink: 0;
}
.l-footer-simple__links {
  display: flex;
  gap: var(--spacing-4);
}
.l-footer-simple__legal {
  flex-shrink: 0;
  color: var(--muted-foreground);
}`,
};