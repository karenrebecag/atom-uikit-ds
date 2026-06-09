/**
 * Layout: pricing-comparison
 *
 * Tabla de comparacion de planes por feature. Para productos con matrices de capacidades.
 * Structure-only. References DS components by BEM class.
 */

export const pricingComparison = {
  slug: 'pricing-comparison',
  name: 'Pricing Comparativo',
  description:
    'Tabla de comparacion de planes por feature. Para productos con matrices de capacidades. Structure only.',
  components: ['table', 'button', 'badge', 'typography'],
  html: `<!-- Layout: pricing-comparison -->
<section class="l-pricing-comparison">
  <div class="l-pricing-comparison__header">
    <h2 class="l-pricing-comparison__headline">{{headline}}</h2>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>{{plan1_name}}<br />{{plan1_price}}</th>
        <th>{{plan2_name}}<br />{{plan2_price}}</th>
        <th>{{plan3_name}}<br />{{plan3_price}}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{row1_feature}}</td>
        <td>{{row1_value1}}</td>
        <td>{{row1_value2}}</td>
        <td>{{row1_value3}}</td>
      </tr>
      <tr>
        <td>{{row2_feature}}</td>
        <td>{{row2_value1}}</td>
        <td>{{row2_value2}}</td>
        <td>{{row2_value3}}</td>
      </tr>
    </tbody>
  </table>
  <div class="l-pricing-comparison__ctas">
    <a href="#" class="button button--secondary button--m">{{plan1_ctaLabel}}</a>
    <a href="#" class="button button--primary button--m">{{plan2_ctaLabel}}</a>
    <a href="#" class="button button--secondary button--m">{{plan3_ctaLabel}}</a>
  </div>
</section>`,
  css: `/* Layout: pricing-comparison — structure only */
.l-pricing-comparison {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-pricing-comparison__header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}
.l-pricing-comparison__ctas {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}`,
};