/**
 * Layout: footer-minimal
 *
 * Footer simple con logo centrado, fila de links de navegación, divisor, y fila inferior con copyright + links legales.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/footer-minimal).
 */

export const footerMinimal = {
  slug: 'footer-minimal',
  name: 'Footer Minimal',
  description:
    'Footer centrado con logo, navegación horizontal, divisor y copyright + enlaces legales. Versión simple y limpia.',
  components: ['typography', 'image'],
  html: `<!-- Layout: footer-minimal -->
<footer class="l-footer-minimal" id="{{section_id}}">
  <div class="l-footer-minimal__container">
    <div class="l-footer-minimal__top">
      <a href="{{logo_href}}" class="l-footer-minimal__logo">
        <img src="{{logo_src}}" alt="{{logo_alt}}" />
      </a>
      <ul class="l-footer-minimal__nav">
        <li class="l-footer-minimal__nav-item"><a href="{{nav1_href}}">{{nav1}}</a></li>
        <li class="l-footer-minimal__nav-item"><a href="{{nav2_href}}">{{nav2}}</a></li>
        <li class="l-footer-minimal__nav-item"><a href="{{nav3_href}}">{{nav3}}</a></li>
        <li class="l-footer-minimal__nav-item"><a href="{{nav4_href}}">{{nav4}}</a></li>
        <li class="l-footer-minimal__nav-item"><a href="{{nav5_href}}">{{nav5}}</a></li>
      </ul>
    </div>
    <div class="l-footer-minimal__divider"></div>
    <div class="l-footer-minimal__bottom">
      <p class="l-footer-minimal__copyright">{{copyright}}</p>
      <ul class="l-footer-minimal__legal">
        <li class="l-footer-minimal__legal-item"><a href="{{legal1_href}}">{{legal1}}</a></li>
        <li class="l-footer-minimal__legal-item"><a href="{{legal2_href}}">{{legal2}}</a></li>
        <li class="l-footer-minimal__legal-item"><a href="{{legal3_href}}">{{legal3}}</a></li>
      </ul>
    </div>
  </div>
</footer>`,
  css: `/* Layout: footer-minimal — structure only, pure DS tokens */
.l-footer-minimal {
  padding: var(--spacing-12) var(--spacing-8);
}

@media (min-width: 768px) {
  .l-footer-minimal {
    padding: var(--spacing-18) var(--spacing-8);
  }
}

@media (min-width: 1024px) {
  .l-footer-minimal {
    padding: var(--spacing-20) var(--spacing-8);
  }
}

.l-footer-minimal__container {
  max-width: 1200px;
  margin: 0 auto;
}

.l-footer-minimal__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: var(--spacing-12);
}

@media (min-width: 768px) {
  .l-footer-minimal__top {
    padding-bottom: var(--spacing-18);
  }
}

@media (min-width: 1024px) {
  .l-footer-minimal__top {
    padding-bottom: var(--spacing-20);
  }
}

.l-footer-minimal__logo {
  display: inline-block;
  margin-bottom: var(--spacing-8);
}

.l-footer-minimal__nav {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
  justify-items: center;
}

@media (min-width: 768px) {
  .l-footer-minimal__nav {
    grid-template-columns: repeat(5, max-content);
    grid-auto-flow: column;
    gap: var(--spacing-6);
    justify-content: center;
    justify-items: start;
  }
}

.l-footer-minimal__nav-item {
  font-weight: var(--font-weight-semibold);
}

.l-footer-minimal__divider {
  height: 1px;
  width: 100%;
  background-color: var(--border);
}

.l-footer-minimal__bottom {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  text-align: center;
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .l-footer-minimal__bottom {
    flex-direction: row;
    padding-top: var(--spacing-8);
    padding-bottom: 0;
    text-align: left;
  }
}

.l-footer-minimal__copyright {
  margin-top: var(--spacing-8);
}

@media (min-width: 768px) {
  .l-footer-minimal__copyright {
    margin-top: 0;
  }
}

.l-footer-minimal__legal {
  display: grid;
  grid-template-columns: max-content;
  justify-content: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .l-footer-minimal__legal {
    grid-auto-flow: column;
    gap: var(--spacing-6);
  }
}

.l-footer-minimal__legal-item a {
  text-decoration: underline;
  text-underline-offset: 1px;
  color: inherit;
}`,
};