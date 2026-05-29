/**
 * Layout: hero-split
 *
 * Two-column hero: content left, media placeholder right.
 * Structure-only. References DS components by BEM class.
 */

export const heroSplit = {
  slug: 'hero-split',
  name: 'Hero Split',
  description:
    'Two-column hero: content left (chip, heading, body, buttons), media right (image/video placeholder). Structure only.',
  components: ['chip', 'button'],
  html: `<!-- Layout: hero-split -->
<section class="l-hero-split">
  <div class="l-hero-split__content">
    <span class="chip chip--outlined chip--s">
      <span class="chip__dot"></span>
      <span class="chip__label">{{eyebrow}}</span>
    </span>
    <h1 class="l-hero-split__heading">{{heading}}</h1>
    <p class="l-hero-split__body">{{body}}</p>
    <div class="l-hero-split__actions">
      <a href="{{cta_primary_href}}" class="button button--primary button--l">
        <span class="button__label">{{cta_primary}}</span>
      </a>
      <a href="{{cta_secondary_href}}" class="button button--secondary button--l">
        <span class="button__label">{{cta_secondary}}</span>
      </a>
    </div>
  </div>
  <div class="l-hero-split__media">
    <!-- Replace with <img>, <video>, iframe, or illustration -->
    <div class="l-hero-split__placeholder">{{media}}</div>
  </div>
</section>`,

  css: `/* Layout: hero-split — structure only */
.l-hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-12);
  align-items: center;
  padding: var(--spacing-20) var(--spacing-8);
}
@media (max-width: 768px) {
  .l-hero-split { grid-template-columns: 1fr; }
}
.l-hero-split__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-6);
}
.l-hero-split__heading { max-width: 520px; }
.l-hero-split__body { max-width: 440px; }
.l-hero-split__actions {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}
.l-hero-split__media {
  display: flex;
  align-items: center;
  justify-content: center;
}
.l-hero-split__placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
}`,
};
