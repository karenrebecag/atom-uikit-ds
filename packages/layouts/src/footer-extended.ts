/**
 * Layout: footer-extended
 *
 * Footer con gran titular y descripción + botones, dos columnas de links, logo + fila de avatares, y fila inferior con copyright + iconos sociales.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/footer-extended).
 */

export const footerExtended = {
  slug: 'footer-extended',
  name: 'Footer Extended',
  description:
    'Footer con encabezado grande (titular, descripción, botones), columnas de links, logo + avatares sociales, y copyright + iconos de redes.',
  components: ['button', 'typography', 'image'],
  html: `<!-- Layout: footer-extended -->
<footer class="l-footer-extended" id="{{section_id}}">
  <div class="l-footer-extended__container">
    <div class="l-footer-extended__main">
      <div class="l-footer-extended__content">
        <h1 class="l-footer-extended__heading">{{heading}}</h1>
        <p class="l-footer-extended__description">{{description}}</p>
        <div class="l-footer-extended__buttons">
          <a href="{{cta1_href}}" class="button button--primary">
            <span class="button__label">{{cta1}}</span>
          </a>
          <a href="{{cta2_href}}" class="button button--secondary">
            <span class="button__label">{{cta2}}</span>
          </a>
        </div>
      </div>
      <div class="l-footer-extended__links">
        <ul class="l-footer-extended__col">
          <li class="l-footer-extended__col-title"><a href="{{col1_title_href}}">{{col1_title}}</a></li>
          <li><a href="{{col1_link1_href}}">{{col1_link1}}</a></li>
          <li><a href="{{col1_link2_href}}">{{col1_link2}}</a></li>
          <li><a href="{{col1_link3_href}}">{{col1_link3}}</a></li>
          <li><a href="{{col1_link4_href}}">{{col1_link4}}</a></li>
          <li><a href="{{col1_link5_href}}">{{col1_link5}}</a></li>
        </ul>
        <ul class="l-footer-extended__col">
          <li class="l-footer-extended__col-title"><a href="{{col2_title_href}}">{{col2_title}}</a></li>
          <li><a href="{{col2_link1_href}}">{{col2_link1}}</a></li>
          <li><a href="{{col2_link2_href}}">{{col2_link2}}</a></li>
          <li><a href="{{col2_link3_href}}">{{col2_link3}}</a></li>
          <li><a href="{{col2_link4_href}}">{{col2_link4}}</a></li>
          <li><a href="{{col2_link5_href}}">{{col2_link5}}</a></li>
        </ul>
      </div>
    </div>

    <div class="l-footer-extended__brand-row">
      <a href="{{logo_href}}" class="l-footer-extended__logo">
        <img src="{{logo_src}}" alt="{{logo_alt}}" />
      </a>
      <div class="l-footer-extended__avatars">
        <img src="{{avatar1_src}}" alt="{{avatar1_alt}}" class="l-footer-extended__avatar" />
        <img src="{{avatar2_src}}" alt="{{avatar2_alt}}" class="l-footer-extended__avatar" />
        <img src="{{avatar3_src}}" alt="{{avatar3_alt}}" class="l-footer-extended__avatar" />
        <img src="{{avatar4_src}}" alt="{{avatar4_alt}}" class="l-footer-extended__avatar" />
        <img src="{{avatar5_src}}" alt="{{avatar5_alt}}" class="l-footer-extended__avatar" />
      </div>
    </div>
  </div>

  <div class="l-footer-extended__bottom">
    <p class="l-footer-extended__copyright">{{copyright}}</p>
    <div class="l-footer-extended__socials">
      <a href="{{social1_href}}" class="l-footer-extended__social" aria-label="Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1.5.67-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
      </a>
      <a href="{{social2_href}}" class="l-footer-extended__social" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.406-9.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </a>
      <a href="{{social3_href}}" class="l-footer-extended__social" aria-label="X">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25l-7.451 8.52L4.5 2.25H1.5l6.75 7.71L1.5 21.75h3l6.75-7.71 6.75 7.71h3l-6.75-7.71L22.5 2.25h-4.256z"/></svg>
      </a>
      <a href="{{social4_href}}" class="l-footer-extended__social" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
      </a>
      <a href="{{social5_href}}" class="l-footer-extended__social" aria-label="YouTube">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z"/></svg>
      </a>
    </div>
  </div>
</footer>`,
  css: `/* Layout: footer-extended — structure only, pure DS tokens */
.l-footer-extended {
  padding: var(--spacing-12) var(--spacing-8);
}

@media (min-width: 768px) {
  .l-footer-extended {
    padding: var(--spacing-18) var(--spacing-8);
  }
}

@media (min-width: 1024px) {
  .l-footer-extended {
    padding: var(--spacing-20) var(--spacing-8);
  }
}

.l-footer-extended__container {
  max-width: 1200px;
  margin: 0 auto;
}

.l-footer-extended__main {
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-12);
}

@media (min-width: 768px) {
  .l-footer-extended__main {
    padding-bottom: var(--spacing-18);
  }
}

@media (min-width: 1024px) {
  .l-footer-extended__main {
    padding-bottom: var(--spacing-20);
  }
}

.l-footer-extended__content {
  max-width: 32rem;
}

.l-footer-extended__heading {
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-5xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
  margin-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-footer-extended__heading {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-6xl);
    margin-bottom: var(--spacing-6);
  }
}

.l-footer-extended__description {
  margin-bottom: var(--spacing-6);
}

@media (min-width: 768px) {
  .l-footer-extended__description {
    margin-bottom: var(--spacing-8);
  }
}

.l-footer-extended__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.l-footer-extended__links {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
  margin-top: var(--spacing-12);
}

@media (min-width: 640px) {
  .l-footer-extended__links {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-8);
  }
}

.l-footer-extended__col {
  list-style: none;
  padding: 0;
  margin: 0;
}

.l-footer-extended__col-title {
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-2) 0;
}

.l-footer-extended__col li {
  padding: var(--spacing-2) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.l-footer-extended__brand-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--spacing-6) 0;
}

@media (min-width: 640px) {
  .l-footer-extended__brand-row {
    flex-direction: row;
    align-items: center;
  }
}

.l-footer-extended__logo {
  display: inline-block;
  margin-bottom: var(--spacing-6);
}

@media (min-width: 640px) {
  .l-footer-extended__logo {
    margin-bottom: 0;
  }
}

.l-footer-extended__avatars {
  display: flex;
  margin-left: 0.75rem;
}

.l-footer-extended__avatar {
  position: relative;
  margin-left: -0.75rem;
  width: 3rem;
  height: 3rem;
  min-height: 3rem;
  min-width: 3rem;
  border-radius: var(--radius-full);
  border: 2px solid var(--background);
  object-fit: cover;
}

.l-footer-extended__bottom {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .l-footer-extended__bottom {
    flex-direction: row;
    align-items: center;
    padding-top: var(--spacing-8);
    padding-bottom: 0;
  }
}

.l-footer-extended__copyright {
  margin-top: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-footer-extended__copyright {
    margin-top: 0;
  }
}

.l-footer-extended__socials {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(5, max-content);
  gap: var(--spacing-3);
}

.l-footer-extended__social {
  color: var(--foreground);
  display: inline-flex;
}

.l-footer-extended__social svg {
  width: 1.5rem;
  height: 1.5rem;
}`,
};