/**
 * Layout: blog-listing
 *
 * Sección de blog con encabezado (tagline, titular, descripción) y grid de 3 tarjetas de posts (imagen landscape 3:2, categoría, título, descripción, autor con avatar, fecha y tiempo de lectura). Botón "View all" al final.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/blog-listing).
 */

export const blogListing = {
  slug: 'blog-listing',
  name: 'Blog Listing',
  description:
    'Encabezado con tagline, titular y descripción. Grid de 3 posts con imagen, categoría, título, descripción y meta de autor (avatar, nombre, fecha, read time). Botón View all.',
  components: ['button', 'typography', 'image', 'link-button'],
  html: `<!-- Layout: blog-listing -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-blog-listing" id="{{section_id}}">
  <div class="l-blog-listing__container">
    <div class="l-blog-listing__header">
      <div class="l-blog-listing__header-content">
        <p class="l-blog-listing__tagline">{{tagline}}</p>
        <h2 class="l-blog-listing__heading">{{heading}}</h2>
        <p class="l-blog-listing__description">{{description}}</p>
      </div>
    </div>

    <div class="l-blog-listing__grid">
      <!-- Post 1 -->
      <div class="l-blog-listing__post">
        <a href="{{post1_url}}" class="l-blog-listing__image-link">
          <div class="l-blog-listing__image-wrapper">
            <img
              src="{{post1_image}}"
              alt="{{post1_image_alt}}"
              class="l-blog-listing__image"
            />
          </div>
        </a>
        <a href="{{post1_url}}" class="l-blog-listing__category">{{post1_category}}</a>
        <a href="{{post1_url}}" class="l-blog-listing__title-link">
          <h5 class="l-blog-listing__title">{{post1_title}}</h5>
        </a>
        <p class="l-blog-listing__excerpt">{{post1_description}}</p>
        <div class="l-blog-listing__author">
          <div class="l-blog-listing__author-avatar-wrapper">
            <img
              src="{{post1_avatar}}"
              alt="{{post1_avatar_alt}}"
              class="l-blog-listing__author-avatar"
            />
          </div>
          <div class="l-blog-listing__author-info">
            <h6 class="l-blog-listing__author-name">{{post1_fullName}}</h6>
            <div class="l-blog-listing__author-meta">
              <p class="l-blog-listing__author-date">{{post1_date}}</p>
              <span class="l-blog-listing__author-dot">•</span>
              <p class="l-blog-listing__author-read-time">{{post1_readTime}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Post 2 -->
      <div class="l-blog-listing__post">
        <a href="{{post2_url}}" class="l-blog-listing__image-link">
          <div class="l-blog-listing__image-wrapper">
            <img
              src="{{post2_image}}"
              alt="{{post2_image_alt}}"
              class="l-blog-listing__image"
            />
          </div>
        </a>
        <a href="{{post2_url}}" class="l-blog-listing__category">{{post2_category}}</a>
        <a href="{{post2_url}}" class="l-blog-listing__title-link">
          <h5 class="l-blog-listing__title">{{post2_title}}</h5>
        </a>
        <p class="l-blog-listing__excerpt">{{post2_description}}</p>
        <div class="l-blog-listing__author">
          <div class="l-blog-listing__author-avatar-wrapper">
            <img
              src="{{post2_avatar}}"
              alt="{{post2_avatar_alt}}"
              class="l-blog-listing__author-avatar"
            />
          </div>
          <div class="l-blog-listing__author-info">
            <h6 class="l-blog-listing__author-name">{{post2_fullName}}</h6>
            <div class="l-blog-listing__author-meta">
              <p class="l-blog-listing__author-date">{{post2_date}}</p>
              <span class="l-blog-listing__author-dot">•</span>
              <p class="l-blog-listing__author-read-time">{{post2_readTime}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Post 3 -->
      <div class="l-blog-listing__post">
        <a href="{{post3_url}}" class="l-blog-listing__image-link">
          <div class="l-blog-listing__image-wrapper">
            <img
              src="{{post3_image}}"
              alt="{{post3_image_alt}}"
              class="l-blog-listing__image"
            />
          </div>
        </a>
        <a href="{{post3_url}}" class="l-blog-listing__category">{{post3_category}}</a>
        <a href="{{post3_url}}" class="l-blog-listing__title-link">
          <h5 class="l-blog-listing__title">{{post3_title}}</h5>
        </a>
        <p class="l-blog-listing__excerpt">{{post3_description}}</p>
        <div class="l-blog-listing__author">
          <div class="l-blog-listing__author-avatar-wrapper">
            <img
              src="{{post3_avatar}}"
              alt="{{post3_avatar_alt}}"
              class="l-blog-listing__author-avatar"
            />
          </div>
          <div class="l-blog-listing__author-info">
            <h6 class="l-blog-listing__author-name">{{post3_fullName}}</h6>
            <div class="l-blog-listing__author-meta">
              <p class="l-blog-listing__author-date">{{post3_date}}</p>
              <span class="l-blog-listing__author-dot">•</span>
              <p class="l-blog-listing__author-read-time">{{post3_readTime}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="l-blog-listing__cta-wrapper">
      <a href="{{cta_href}}" class="button button--secondary button--l">
        <span class="button__label">{{cta}}</span>
      </a>
    </div>
  </div>
</section>`,
  css: `/* Layout: blog-listing — structure only, pure DS tokens */
.l-blog-listing {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-blog-listing__container {
  max-width: 1200px;
  margin: 0 auto;
}

.l-blog-listing__header {
  margin-bottom: var(--spacing-12);
}

@media (min-width: 768px) {
  .l-blog-listing__header {
    margin-bottom: var(--spacing-18);
  }
}

@media (min-width: 1024px) {
  .l-blog-listing__header {
    margin-bottom: var(--spacing-20);
  }
}

.l-blog-listing__header-content {
  max-width: 32rem;
}

.l-blog-listing__tagline {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--muted-foreground);
  margin-bottom: var(--spacing-3);
}

.l-blog-listing__heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-4xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--foreground);
  margin-bottom: var(--spacing-5);
}

@media (min-width: 768px) {
  .l-blog-listing__heading {
    font-size: var(--font-size-5xl);
    line-height: var(--line-height-5xl);
    margin-bottom: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .l-blog-listing__heading {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-6xl);
  }
}

.l-blog-listing__description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--muted-foreground);
}

@media (min-width: 768px) {
  .l-blog-listing__description {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-lg);
  }
}

.l-blog-listing__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-8) var(--spacing-12);
}

@media (min-width: 768px) {
  .l-blog-listing__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-8) var(--spacing-16);
  }
}

@media (min-width: 1024px) {
  .l-blog-listing__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.l-blog-listing__post {
  /* individual post */
}

.l-blog-listing__image-link {
  display: block;
  margin-bottom: var(--spacing-6);
}

.l-blog-listing__image-wrapper {
  width: 100%;
  overflow: hidden;
}

.l-blog-listing__image {
  aspect-ratio: 3 / 2;
  width: 100%;
  object-fit: cover;
  display: block;
}

.l-blog-listing__category {
  display: inline-block;
  max-width: 100%;
  margin-bottom: var(--spacing-2);
  margin-right: var(--spacing-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--foreground);
}

.l-blog-listing__title-link {
  display: block;
  max-width: 100%;
  margin-bottom: var(--spacing-2);
}

.l-blog-listing__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--foreground);
}

@media (min-width: 768px) {
  .l-blog-listing__title {
    font-size: var(--font-size-2xl);
  }
}

.l-blog-listing__excerpt {
  font-size: var(--font-size-base);
  color: var(--foreground);
}

.l-blog-listing__author {
  margin-top: var(--spacing-6);
  display: flex;
  align-items: center;
}

.l-blog-listing__author-avatar-wrapper {
  margin-right: var(--spacing-4);
  flex-shrink: 0;
}

.l-blog-listing__author-avatar {
  width: 3rem;
  height: 3rem;
  min-height: 3rem;
  min-width: 3rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.l-blog-listing__author-info {
  /* text */
}

.l-blog-listing__author-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--foreground);
}

.l-blog-listing__author-meta {
  display: flex;
  align-items: center;
}

.l-blog-listing__author-date,
.l-blog-listing__author-read-time {
  font-size: var(--font-size-sm);
  color: var(--muted-foreground);
}

.l-blog-listing__author-dot {
  margin: 0 var(--spacing-2);
  color: var(--muted-foreground);
}

.l-blog-listing__cta-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-10);
}

@media (min-width: 768px) {
  .l-blog-listing__cta-wrapper {
    margin-top: var(--spacing-14);
  }
}

@media (min-width: 1024px) {
  .l-blog-listing__cta-wrapper {
    margin-top: var(--spacing-16);
  }
}`,
};