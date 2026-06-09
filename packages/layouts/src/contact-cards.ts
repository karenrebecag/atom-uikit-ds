/**
 * Layout: contact-cards
 *
 * Grid de 2-4 cards de canal (ventas, soporte, oficinas) con icono, texto y link.
 * Structure-only. References DS components by BEM class.
 */

export const contactCards = {
  slug: 'contact-cards',
  name: 'Contacto en cards',
  description:
    'Grid de 2-4 cards de canal (ventas, soporte, oficinas) con icono, texto y link. Structure only.',
  components: ['item', 'link-button', 'typography'],
  html: `<!-- Layout: contact-cards -->
<section class="l-contact-cards">
  <div class="l-contact-cards__header">
    <h2 class="l-contact-cards__headline">{{headline}}</h2>
  </div>
  <div class="l-contact-cards__grid">
    <div class="item l-contact-cards__card">
      <div class="l-contact-cards__icon"><!-- icon --></div>
      <h3 class="l-contact-cards__title">{{card1_title}}</h3>
      <p class="l-contact-cards__body">{{card1_body}}</p>
      <a href="{{card1_url}}" class="link-button">{{card1_linkLabel}}</a>
    </div>
    <div class="item l-contact-cards__card">
      <div class="l-contact-cards__icon"><!-- icon --></div>
      <h3 class="l-contact-cards__title">{{card2_title}}</h3>
      <p class="l-contact-cards__body">{{card2_body}}</p>
      <a href="{{card2_url}}" class="link-button">{{card2_linkLabel}}</a>
    </div>
  </div>
</section>`,
  css: `/* Layout: contact-cards — structure only */
.l-contact-cards {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-contact-cards__header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}
.l-contact-cards__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}
@media (max-width: 600px) {
  .l-contact-cards__grid {
    grid-template-columns: 1fr;
  }
}
.l-contact-cards__card {
  padding: var(--spacing-6);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.l-contact-cards__icon {
  width: 32px;
  height: 32px;
  background: var(--muted);
  border-radius: 50%;
  margin-bottom: var(--spacing-3);
}
.l-contact-cards__title {
  font-size: var(--text-lg);
  font-weight: 600;
}
.l-contact-cards__body {
  color: var(--muted-foreground);
  margin: var(--spacing-2) 0;
}`,
};