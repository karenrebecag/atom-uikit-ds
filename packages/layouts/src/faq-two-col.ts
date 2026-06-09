/**
 * Layout: faq-two-col
 *
 * Titular + intro izquierda, preguntas expandidas (sin accordion) en grid derecha.
 * Structure-only. References DS components by BEM class.
 */

export const faqTwoCol = {
  slug: 'faq-two-col',
  name: 'FAQ dos columnas',
  description:
    'Titular + intro izquierda, preguntas expandidas (sin accordion) en grid derecha. Structure only.',
  components: ['typography', 'divider'],
  html: `<!-- Layout: faq-two-col -->
<section class="l-faq-two-col">
  <div class="l-faq-two-col__left">
    <h2 class="l-faq-two-col__headline">{{headline}}</h2>
    <p class="l-faq-two-col__intro">{{intro}}</p>
  </div>
  <div class="l-faq-two-col__right">
    <div class="l-faq-two-col__item">
      <h4 class="l-faq-two-col__question">{{faq1_question}}</h4>
      <p class="l-faq-two-col__answer">{{faq1_answer}}</p>
    </div>
    <div class="l-faq-two-col__item">
      <h4 class="l-faq-two-col__question">{{faq2_question}}</h4>
      <p class="l-faq-two-col__answer">{{faq2_answer}}</p>
    </div>
    <div class="l-faq-two-col__item">
      <h4 class="l-faq-two-col__question">{{faq3_question}}</h4>
      <p class="l-faq-two-col__answer">{{faq3_answer}}</p>
    </div>
  </div>
</section>`,
  css: `/* Layout: faq-two-col — structure only */
.l-faq-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-8);
}
@media (max-width: 768px) {
  .l-faq-two-col {
    grid-template-columns: 1fr;
  }
}
.l-faq-two-col__headline {
  font-size: var(--text-xl);
}
.l-faq-two-col__intro {
  color: var(--muted-foreground);
}
.l-faq-two-col__item {
  margin-bottom: var(--spacing-4);
}
.l-faq-two-col__question {
  font-weight: 600;
  margin-bottom: var(--spacing-1);
}
.l-faq-two-col__answer {
  color: var(--muted-foreground);
}`,
};