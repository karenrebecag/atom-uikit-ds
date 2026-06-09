/**
 * Layout: feature-tabs
 *
 * Tabs horizontales; cada tab muestra titulo + texto + imagen. Para comparar modos o casos de uso.
 * Structure-only. References DS components by BEM class.
 */

export const featureTabs = {
  slug: 'feature-tabs',
  name: 'Features con tabs',
  description:
    'Tabs horizontales; cada tab muestra titulo + texto + imagen. Para comparar modos o casos de uso. Structure only.',
  components: ['tabs', 'typography', 'image', 'button'],
  html: `<!-- Layout: feature-tabs -->
<section class="l-feature-tabs">
  <div class="l-feature-tabs__header">
    <h2 class="l-feature-tabs__headline">{{headline}}</h2>
  </div>
  <div class="l-feature-tabs__tabs">
    <button class="tab tab--active">{{tab1_label}}</button>
    <button class="tab">{{tab2_label}}</button>
    <button class="tab">{{tab3_label}}</button>
  </div>
  <div class="l-feature-tabs__content">
    <div class="l-feature-tabs__panel">
      <h3 class="l-feature-tabs__title">{{tab1_title}}</h3>
      <p class="l-feature-tabs__body">{{tab1_body}}</p>
      <img src="{{tab1_image}}" alt="" class="image" />
      <a href="#" class="button button--secondary button--m">Ver más</a>
    </div>
  </div>
</section>`,
  css: `/* Layout: feature-tabs — structure only */
.l-feature-tabs {
  padding: var(--spacing-12) var(--spacing-8);
}
.l-feature-tabs__header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}
.l-feature-tabs__tabs {
  display: flex;
  gap: var(--spacing-2);
  justify-content: center;
  margin-bottom: var(--spacing-6);
}
.l-feature-tabs__tabs .tab {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--background);
}
.l-feature-tabs__tabs .tab--active {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}
.l-feature-tabs__content {
  max-width: 600px;
  margin: 0 auto;
}
.l-feature-tabs__panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}
.l-feature-tabs__title {
  font-size: var(--text-xl);
}
.l-feature-tabs__body {
  color: var(--muted-foreground);
}`,
};