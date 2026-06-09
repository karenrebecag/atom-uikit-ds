/**
 * Layout: logo-grid
 *
 * Grid estatico de logos (2 filas max). Para cuando el marquee distrae.
 * Structure-only. References DS components by BEM class.
 */

export const logoGrid = {
  slug: 'logo-grid',
  name: 'Logo Grid',
  description:
    'Grid estatico de logos (2 filas max). Para cuando el marquee distrae. Structure only.',
  components: ['image', 'typography', 'divider'],
  html: `<!-- Layout: logo-grid -->
<section class="l-logo-grid">
  <div class="l-logo-grid__header">
    <h3 class="l-logo-grid__headline">{{headline}}</h3>
  </div>
  <div class="l-logo-grid__grid">
    <img src="{{logo1}}" alt="{{logo1_name}}" class="image" />
    <img src="{{logo2}}" alt="{{logo2_name}}" class="image" />
    <img src="{{logo3}}" alt="{{logo3_name}}" class="image" />
    <img src="{{logo4}}" alt="{{logo4_name}}" class="image" />
    <img src="{{logo5}}" alt="{{logo5_name}}" class="image" />
    <img src="{{logo6}}" alt="{{logo6_name}}" class="image" />
    <img src="{{logo7}}" alt="{{logo7_name}}" class="image" />
    <img src="{{logo8}}" alt="{{logo8_name}}" class="image" />
  </div>
</section>`,
  css: `/* Layout: logo-grid — structure only */
.l-logo-grid {
  padding: var(--spacing-8) var(--spacing-8);
}
.l-logo-grid__header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}
.l-logo-grid__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-8);
  align-items: center;
}
@media (max-width: 768px) {
  .l-logo-grid__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.l-logo-grid__grid img {
  height: 40px;
  width: auto;
  filter: grayscale(1);
  opacity: 0.8;
  justify-self: center;
}`,
};