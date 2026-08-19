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

  data-marquee-list marca la lista que el behavior clona. Va por atributo y no
  por clase porque el canal de Webflow prefija todo con ds-: buscando
  .marquee__list el modulo no la encuentra ahi y la tira se queda con el default
  del CSS (30s fijos, una sola lista) — rapida y con hueco.

  El behavior la CLONA las veces que hagan falta para tapar el carril y fija
  --marquee-duration a partir del ancho de UNA lista. No duplicar a mano: los
  clones llevan data-marquee-clone y aria-hidden.

  loading="eager" en los logos: en un marquee estan siempre a la vista, y una
  imagen sin cargar hace que su lista mida de menos. Como el keyframe desplaza
  -100% del ancho PROPIO de cada lista, dos listas con anchos distintos se
  desincronizan. El behavior tambien lo fuerza, por si el markup llega de otro
  sitio.

  marquee__item--logo ajusta el espaciado al modelo de Osmo: padding a UN solo
  lado del item, para que el hueco entre logos sea el valor declarado y no el
  doble.

  --marquee-logo-scale es la correccion optica por marca: multiplica la altura,
  no un transform. Un transform no cambia la caja y el logo corregido al alza se
  monta sobre el siguiente. Va como variable en el item, no como selector por
  nombre de archivo, para que sobreviva a renombrar el asset.
  (En Webflow no se puede: ahi va como combo class. Ver marquee.css.)

  El alt de cada logo es el nombre de la marca. Un alt vacio deja la prueba
  social invisible para un lector de pantalla, que es justo lo que la seccion
  viene a comunicar.
-->

<section class="l-logo-marquee" id="{{section_id}}">
  <!--
    Titular y tira comparten gutter y contenedor: la herencia de layout del
    proyecto (padding lateral fuera del ancho maximo, ancho maximo centrado
    dentro). Compartir la MISMA caja es lo que garantiza que el borde izquierdo
    del titular y el del primer logo no puedan separarse nunca.
    El recorte del carril pasa a ser el del contenedor, no el del viewport.
  -->
  <div class="l-logo-marquee__gutter">
    <div class="l-logo-marquee__container">
      <h2 class="l-logo-marquee__headline">{{headline}}</h2>

      <div class="marquee marquee--fade" data-marquee data-speed="75">
    <div class="marquee__list" data-marquee-list>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo1}}" alt="{{logo1_name}}" loading="eager" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo2}}" alt="{{logo2_name}}" loading="eager"
             style="--marquee-logo-scale: {{logo2_scale}}" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo3}}" alt="{{logo3_name}}" loading="eager" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo4}}" alt="{{logo4_name}}" loading="eager" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo5}}" alt="{{logo5_name}}" loading="eager" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo6}}" alt="{{logo6_name}}" loading="eager" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo7}}" alt="{{logo7_name}}" loading="eager" />
      </div>
      <div class="marquee__item marquee__item--logo">
        <img class="marquee__logo" src="{{logo8}}" alt="{{logo8_name}}" loading="eager" />
      </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: logo-marquee — structure only, pure DS tokens */
.l-logo-marquee {
  padding-block: var(--section-padding-m);
  overflow: hidden;
}

/* El DS no publica tokens de contenedor: el ancho maximo y el gutter son
   convencion del sitio consumidor (container-large = 80rem, padding-global =
   5%). Van como variables para que otro consumidor los cambie sin tocar el
   layout. */
.l-logo-marquee__gutter {
  padding-inline: var(--l-logo-marquee-gutter, 5%);
}

.l-logo-marquee__container {
  width: 100%;
  max-width: var(--l-logo-marquee-container, 80rem);
  margin-inline: auto;
}

.l-logo-marquee__headline {
  margin: 0 0 var(--spacing-8);
  text-align: left;
  font-size: var(--font-size-xl);
}

/* La tira sangra a todo el ancho aunque la seccion tenga container: el recorte
   lateral es lo que comunica que la lista sigue. */
.l-logo-marquee .marquee__item {
  padding-inline: var(--spacing-8);
}
`,
};
