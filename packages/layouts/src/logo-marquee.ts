/**
 * Layout: logo-marquee
 *
 * Logos de clientes en marquee infinito con titular corto. Reusa el componente marquee.
 * Structure-only. References DS components by BEM class.
 */

export const logoMarquee = {
  slug: 'logo-marquee',
  name: 'Logo Marquee',
  description:
    'Logos de clientes en marquee infinito con titular corto. Reusa el componente marquee. Structure only.',
  components: ['marquee', 'image', 'typography'],
  html: `<!-- Layout: logo-marquee -->
<section class="l-logo-marquee">
  <h3 class="l-logo-marquee__headline">{{headline}}</h3>
  <div class="marquee l-logo-marquee__track" data-marquee>
    <div class="l-logo-marquee__logos">
      <img src="{{logo1}}" alt="{{logo1_name}}" class="image" />
      <img src="{{logo2}}" alt="{{logo2_name}}" class="image" />
      <img src="{{logo3}}" alt="{{logo3_name}}" class="image" />
      <img src="{{logo4}}" alt="{{logo4_name}}" class="image" />
      <img src="{{logo5}}" alt="{{logo5_name}}" class="image" />
      <img src="{{logo6}}" alt="{{logo6_name}}" class="image" />
      <img src="{{logo7}}" alt="{{logo7_name}}" class="image" />
      <img src="{{logo8}}" alt="{{logo8_name}}" class="image" />
    </div>
    <!-- duplicate for seamless loop -->
    <div class="l-logo-marquee__logos" aria-hidden="true">
      <img src="{{logo1}}" alt="{{logo1_name}}" class="image" />
      <img src="{{logo2}}" alt="{{logo2_name}}" class="image" />
      <img src="{{logo3}}" alt="{{logo3_name}}" class="image" />
      <img src="{{logo4}}" alt="{{logo4_name}}" class="image" />
      <img src="{{logo5}}" alt="{{logo5_name}}" class="image" />
      <img src="{{logo6}}" alt="{{logo6_name}}" class="image" />
      <img src="{{logo7}}" alt="{{logo7_name}}" class="image" />
      <img src="{{logo8}}" alt="{{logo8_name}}" class="image" />
    </div>
  </div>
</section>`,
  css: `/* Layout: logo-marquee — structure only */
.l-logo-marquee {
  padding: var(--spacing-8) var(--spacing-8);
  overflow: hidden;
}
.l-logo-marquee__headline {
  text-align: center;
  margin-bottom: var(--spacing-6);
  font-size: var(--text-lg);
}
.l-logo-marquee__track {
  display: flex;
  gap: var(--spacing-12);
}
.l-logo-marquee__logos {
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  flex-shrink: 0;
}
.l-logo-marquee__logos img {
  height: 32px;
  width: auto;
  filter: grayscale(1);
  opacity: 0.8;
}`,
};