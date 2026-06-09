/**
 * Layout: faq-accordion
 *
 * Preguntas frecuentes en accordion de una columna, con CTA de contacto al final.
 * Structure-only. References DS components by BEM class.
 */

export const faqAccordion = {
  slug: 'faq-accordion',
  name: 'FAQ Accordion',
  description:
    'Preguntas frecuentes en accordion de una columna, con CTA de contacto al final. Structure only.',
  components: ['accordion', 'button', 'typography'],
  html: `<!-- Layout: faq-accordion -->
<section class="l-faq-accordion">
  <div class="l-faq-accordion__header">
    <h2 class="l-faq-accordion__headline">{{headline}}</h2>
  </div>
  <div class="l-faq-accordion__list">
    <details class="l-faq-accordion__item">
      <summary class="l-faq-accordion__question">{{faq1_question}}</summary>
      <div class="l-faq-accordion__answer">{{faq1_answer}}</div>
    </details>
    <details class="l-faq-accordion__item">
      <summary class="l-faq-accordion__question">{{faq2_question}}</summary>
      <div class="l-faq-accordion__answer">{{faq2_answer}}</div>
    </details>
    <details class="l-faq-accordion__item">
      <summary class="l-faq-accordion__question">{{faq3_question}}</summary>
      <div class="l-faq-accordion__answer">{{faq3_answer}}</div>
    </details>
    <details class="l-faq-accordion__item">
      <summary class="l-faq-accordion__question">{{faq4_question}}</summary>
      <div class="l-faq-accordion__answer">{{faq4_answer}}</div>
    </details>
    <details class="l-faq-accordion__item">
      <summary class="l-faq-accordion__question">{{faq5_question}}</summary>
      <div class="l-faq-accordion__answer">{{faq5_answer}}</div>
    </details>
  </div>
  <div class="l-faq-accordion__cta">
    <a href="#" class="button button--secondary button--m">
      <span class="button__label">{{contactCta}}</span>
    </a>
  </div>
</section>`,
  css: `/* Layout: faq-accordion — structure only */
.l-faq-accordion {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--spacing-12) var(--spacing-8);
}
.l-faq-accordion__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-faq-accordion__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}
.l-faq-accordion__item {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}
.l-faq-accordion__item summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}
.l-faq-accordion__item summary::-webkit-details-marker {
  display: none;
}
.l-faq-accordion__answer {
  margin-top: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--border);
  color: var(--muted-foreground);
}
.l-faq-accordion__cta {
  text-align: center;
  margin-top: var(--spacing-8);
}`,
};