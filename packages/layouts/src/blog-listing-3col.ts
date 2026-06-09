/**
 * Layout: blog-listing-3col
 *
 * Posts en cards: imagen 3:2, categoria, titulo, resumen, meta de autor (avatar/nombre/fecha/lectura) y CTA global.
 * Structure-only. References DS components by BEM class.
 */

export const blogListing3col = {
  slug: 'blog-listing-3col',
  name: 'Blog Listing 3col',
  description:
    'Posts en cards: imagen 3:2, categoria, titulo, resumen, meta de autor (avatar/nombre/fecha/lectura) y CTA global. Structure only.',
  components: ['typography', 'image', 'tag', 'avatar', 'link-button', 'button', 'item'],
  html: `<!-- Layout: blog-listing-3col -->
<section class="l-blog-listing-3col">
  <div class="l-blog-listing-3col__header">
    <span class="l-blog-listing-3col__tagline">{{tagline}}</span>
    <h2 class="l-blog-listing-3col__headline">{{headline}}</h2>
    <p class="l-blog-listing-3col__description">{{description}}</p>
  </div>
  <div class="l-blog-listing-3col__grid">
    <article class="l-blog-listing-3col__card">
      <img src="{{post1_image}}" alt="" class="image" />
      <span class="tag tag--s">{{post1_category}}</span>
      <h3 class="l-blog-listing-3col__card-title">{{post1_title}}</h3>
      <p class="l-blog-listing-3col__card-desc">{{post1_description}}</p>
      <div class="l-blog-listing-3col__meta">
        <img src="{{post1_avatar}}" alt="" class="avatar avatar--s" />
        <span>{{post1_fullName}} · {{post1_date}} · {{post1_readTime}}</span>
      </div>
      <a href="{{post1_url}}" class="link-button">Leer más</a>
    </article>
    <!-- similar for post2, post3 (hardcoded for structure) -->
    <article class="l-blog-listing-3col__card">
      <img src="{{post2_image}}" alt="" class="image" />
      <span class="tag tag--s">{{post2_category}}</span>
      <h3 class="l-blog-listing-3col__card-title">{{post2_title}}</h3>
      <p class="l-blog-listing-3col__card-desc">{{post2_description}}</p>
      <div class="l-blog-listing-3col__meta">
        <img src="{{post2_avatar}}" alt="" class="avatar avatar--s" />
        <span>{{post2_fullName}} · {{post2_date}} · {{post2_readTime}}</span>
      </div>
      <a href="{{post2_url}}" class="link-button">Leer más</a>
    </article>
    <article class="l-blog-listing-3col__card">
      <img src="{{post3_image}}" alt="" class="image" />
      <span class="tag tag--s">{{post3_category}}</span>
      <h3 class="l-blog-listing-3col__card-title">{{post3_title}}</h3>
      <p class="l-blog-listing-3col__card-desc">{{post3_description}}</p>
      <div class="l-blog-listing-3col__meta">
        <img src="{{post3_avatar}}" alt="" class="avatar avatar--s" />
        <span>{{post3_fullName}} · {{post3_date}} · {{post3_readTime}}</span>
      </div>
      <a href="{{post3_url}}" class="link-button">Leer más</a>
    </article>
  </div>
  <div class="l-blog-listing-3col__cta">
    <a href="{{ctaAll_url}}" class="button button--secondary button--m">
      <span class="button__label">{{ctaAll}}</span>
    </a>
  </div>
</section>`,
  css: `/* Layout: blog-listing-3col — structure only */
.l-blog-listing-3col {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
}
.l-blog-listing-3col__header {
  text-align: center;
}
.l-blog-listing-3col__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
}
@media (max-width: 1024px) {
  .l-blog-listing-3col__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .l-blog-listing-3col__grid {
    grid-template-columns: 1fr;
  }
}
.l-blog-listing-3col__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}
.l-blog-listing-3col__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
}
.l-blog-listing-3col__cta {
  text-align: center;
  margin-top: var(--spacing-4);
}`,
};