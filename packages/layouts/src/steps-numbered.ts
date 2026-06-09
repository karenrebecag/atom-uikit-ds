/**
 * Layout: steps-numbered
 *
 * Seccion "como funciona": titular + 3-4 pasos numerados horizontales usando el stepper.
 * Structure-only. References DS components by BEM class.
 */

export const stepsNumbered = {
  slug: 'steps-numbered',
  name: 'Steps Numbered',
  description:
    'Seccion como-funciona: titular + 3-4 pasos numerados con el componente stepper. Structure only.',
  components: ['stepper', 'typography', 'button'],
  html: `<!-- Layout: steps-numbered -->
<!-- Get component CSS: atom_uikit_source("stepper", ["css"]) -->
<section class="l-steps-numbered">
  <div class="l-steps-numbered__header">
    <span class="l-steps-numbered__eyebrow">{{eyebrow}}</span>
    <h2 class="l-steps-numbered__headline">{{headline}}</h2>
    <p class="l-steps-numbered__subtitle">{{subtitle}}</p>
  </div>
  <div class="stepper stepper--horizontal l-steps-numbered__stepper">
    <div class="stepper__step stepper__step--completed">
      <span class="stepper__indicator">1</span>
      <div class="stepper__content">
        <h3 class="l-steps-numbered__step-title">{{step1_title}}</h3>
        <p class="stepper__description">{{step1_body}}</p>
      </div>
      <span class="stepper__connector stepper__connector--completed"></span>
    </div>
    <div class="stepper__step stepper__step--active">
      <span class="stepper__indicator">2</span>
      <div class="stepper__content">
        <h3 class="l-steps-numbered__step-title">{{step2_title}}</h3>
        <p class="stepper__description">{{step2_body}}</p>
      </div>
      <span class="stepper__connector"></span>
    </div>
    <div class="stepper__step stepper__step--upcoming">
      <span class="stepper__indicator">3</span>
      <div class="stepper__content">
        <h3 class="l-steps-numbered__step-title">{{step3_title}}</h3>
        <p class="stepper__description">{{step3_body}}</p>
      </div>
    </div>
  </div>
  <div class="l-steps-numbered__cta">
    <a href="{{cta_href}}" class="button button--primary button--m">
      <span class="button__label">{{cta}}</span>
    </a>
  </div>
</section>`,
  css: `/* Layout: steps-numbered — structure only */
.l-steps-numbered {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-10);
  padding: var(--spacing-16) var(--spacing-8);
}
.l-steps-numbered__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  text-align: center;
  max-width: 640px;
}
.l-steps-numbered__stepper {
  width: 100%;
  max-width: 960px;
}
.l-steps-numbered__cta {
  display: flex;
  justify-content: center;
}
@media (max-width: 767px) {
  .l-steps-numbered__stepper.stepper--horizontal {
    flex-direction: column;
  }
}`,
};
