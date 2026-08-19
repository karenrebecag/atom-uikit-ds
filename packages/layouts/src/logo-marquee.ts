/**
 * Layout: logo-marquee — "Logos Marquee"
 *
 * Tira infinita de logos de cliente. Reusa el componente marquee en su modo CSS
 * (keyframes + --marquee-duration), enganchado por el behavior marquee-css.
 *
 * Sustituye al par Logo_Marquee_Desktop / Logo_Marquee_Mobile del sitio, que no
 * eran dos disenos de un marquee sino dos rejillas ESTATICAS: la de desktop
 * recortada por overflow y la de movil sin recorte. Un solo componente que se
 * mueve de verdad hace innecesario el switch por viewport — en movil basta con
 * que el carril recorte antes.
 *
 * Structure-only. References DS components by BEM class.
 */

export const logoMarquee = {
  slug: 'logo-marquee',
  name: 'Logos Marquee',
  description:
    'Tira infinita de logos de cliente con avance continuo por CSS. La velocidad se declara en px/s y la duracion sale del ancho de la lista, asi que dos tiras con distinto numero de logos se mueven igual. Pausa sola fuera de viewport.',
  components: ['marquee', 'marquee-css', 'typography'],
  html: `<!-- Layout: logo-marquee -->
<!-- Get component CSS: atom_uikit_source("marquee") -->
<!-- Behavior: atom_uikit_source("marquee-css") — NO requiere gsap -->
<!--
  data-marquee   engancha el behavior sobre la raiz .marquee
  data-speed     pixeles por segundo (75 por defecto). Se declara velocidad y no
                 duracion porque es lo que el ojo compara entre dos tiras.

  El behavior CLONA .marquee__list las veces que hagan falta para tapar el
  carril y fija --marquee-duration a partir del ancho de UNA lista. No duplicar
  a mano: los clones llevan data-marquee-clone y aria-hidden.

  marquee--logos ajusta el espaciado al modelo de Osmo: padding a UN solo lado
  del item, para que el hueco entre logos sea el valor declarado y no el doble.
  El punto de acento entre logos es un pseudo-elemento, no markup: en una tira
  de logos el separador es ritmo, y puesto a mano se puede olvidar en un item.

  --marquee-logo-scale es la correccion optica por marca. Los logos llegan con
  pesos visuales dispares y solo la altura se puede igualar por CSS; el resto es
  caso por caso. Va como variable en el item, no como selector por nombre de
  archivo, para que sobreviva a renombrar el asset.
  (En Webflow no se puede: ahi va como combo class. Ver marquee.css.)

  El alt de cada logo es el nombre de la marca. Un alt vacio deja la prueba
  social invisible para un lector de pantalla, que es justo lo que la seccion
  viene a comunicar.
-->

<section class="l-logo-marquee" id="{{section_id}}">
  <h2 class="l-logo-marquee__headline">{{headline}}</h2>

  <div class="marquee marquee--logos marquee--fade" data-marquee data-speed="75">
    <div class="marquee__list">
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo1}}" alt="{{logo1_name}}" loading="lazy" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo2}}" alt="{{logo2_name}}" loading="lazy"
             style="--marquee-logo-scale: {{logo2_scale}}" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo3}}" alt="{{logo3_name}}" loading="lazy" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo4}}" alt="{{logo4_name}}" loading="lazy" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo5}}" alt="{{logo5_name}}" loading="lazy" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo6}}" alt="{{logo6_name}}" loading="lazy" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo7}}" alt="{{logo7_name}}" loading="lazy" />
      </div>
      <div class="marquee__item">
        <img class="marquee__logo" src="{{logo8}}" alt="{{logo8_name}}" loading="lazy" />
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: logo-marquee — structure only, pure DS tokens */
.l-logo-marquee {
  padding-block: var(--section-padding-m);
  overflow: hidden;
}

.l-logo-marquee__headline {
  margin: 0 auto var(--rhythm-s);
  padding-inline: var(--spacing-6);
  max-width: 42rem;
  text-align: center;
  font-size: var(--font-size-xl);
}

/* La tira sangra a todo el ancho aunque la seccion tenga container: el recorte
   lateral es lo que comunica que la lista sigue. */
.l-logo-marquee .marquee__item {
  padding-inline: var(--spacing-8);
}
`,
};
