/**
 * Layout: stats-band
 *
 * Banda horizontal de 3-4 metricas grandes con label. Reusa stats-card.
 * Structure-only. References DS components by BEM class.
 */

export const statsBand = {
  slug: 'stats-band',
  name: 'Stats Band',
  description:
    'Banda horizontal de 3-4 metricas grandes con label. Reusa stats-card. Structure only.',
  components: ['stats-card', 'typography'],
  html: `<!-- Layout: stats-band -->
<section class="l-stats-band">
  <div class="l-stats-band__header">
    <h3 class="l-stats-band__headline">{{headline}}</h3>
  </div>
  <div class="l-stats-band__stats">
    <div class="stats-card">
      <div class="l-stats-band__value">{{stat1_value}}</div>
      <div class="l-stats-band__label">{{stat1_label}}</div>
    </div>
    <div class="stats-card">
      <div class="l-stats-band__value">{{stat2_value}}</div>
      <div class="l-stats-band__label">{{stat2_label}}</div>
    </div>
    <div class="stats-card">
      <div class="l-stats-band__value">{{stat3_value}}</div>
      <div class="l-stats-band__label">{{stat3_label}}</div>
    </div>
    <div class="stats-card">
      <div class="l-stats-band__value">{{stat4_value}}</div>
      <div class="l-stats-band__label">{{stat4_label}}</div>
    </div>
  </div>
</section>`,
  css: `/* Layout: stats-band — structure only */
.l-stats-band {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  padding: var(--spacing-8);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.l-stats-band__header {
  text-align: center;
}
.l-stats-band__stats {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-4);
}
@media (max-width: 768px) {
  .l-stats-band__stats {
    flex-direction: column;
    align-items: center;
  }
}
.l-stats-band__value {
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1;
}
.l-stats-band__label {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
}`,
};