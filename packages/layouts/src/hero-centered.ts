/**
 * Layout: hero-centered
 *
 * Structure-only. References DS components by BEM class.
 * CSS is ONLY positioning (flex, gaps, max-widths).
 * Typography, colors, spacing values come from tokens.
 */

export const heroCentered = {
  slug: 'hero-centered',
  name: 'Hero Centered',
  description:
    'Centered hero: eyebrow chip, heading, body, CTA button pair, avatar group proof, feature tags. Structure only — get component CSS via atom_uikit_source.',
  components: ['chip', 'button', 'avatar', 'avatar-group', 'tag'],
  html: `<!-- Layout: hero-centered -->
<!-- Get component CSS: atom_uikit_source("chip", ["css"]), atom_uikit_source("button", ["css"]), etc. -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-hero-centered">
  <span class="chip chip--outlined chip--s">
    <span class="chip__dot"></span>
    <span class="chip__label">{{eyebrow}}</span>
  </span>

  <h1 class="l-hero-centered__heading">{{heading}}</h1>
  <p class="l-hero-centered__body">{{body}}</p>

  <div class="l-hero-centered__actions">
    <a href="{{cta_primary_href}}" class="button button--primary button--l">
      <span class="button__label">{{cta_primary}}</span>
    </a>
    <a href="{{cta_secondary_href}}" class="button button--secondary button--l">
      <span class="button__label">{{cta_secondary}}</span>
    </a>
  </div>

  <div class="l-hero-centered__proof">
    <div class="avatar-group">
      <div class="avatar avatar--s avatar--circle"><span class="avatar__fallback">A</span></div>
      <div class="avatar avatar--s avatar--circle"><span class="avatar__fallback">B</span></div>
      <div class="avatar avatar--s avatar--circle"><span class="avatar__fallback">C</span></div>
    </div>
    <p class="l-hero-centered__caption">{{proof_text}}</p>
  </div>

  <div class="l-hero-centered__tags">
    <span class="tag tag--filled tag--success tag--s"><span class="tag__label">{{tag_1}}</span></span>
    <span class="tag tag--filled tag--info tag--s"><span class="tag__label">{{tag_2}}</span></span>
    <span class="tag tag--filled tag--neutral tag--s"><span class="tag__label">{{tag_3}}</span></span>
  </div>
</section>`,

  css: `/* Layout: hero-centered — structure only */
.l-hero-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-8);
  padding: var(--spacing-20) var(--spacing-8);
}
.l-hero-centered__heading { max-width: 640px; }
.l-hero-centered__body { max-width: 480px; }
.l-hero-centered__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
  justify-content: center;
}
.l-hero-centered__proof {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}
.l-hero-centered__tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  justify-content: center;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border);
  width: 100%;
}`,
};
