/**
 * Layout: article-toc
 *
 * Documento largo con indice lateral: legales, documentacion, articulos de
 * fondo. Cabecera (eyebrow + titulo + fecha de vigencia) y, debajo, una rejilla
 * de dos columnas — indice sticky a la izquierda, cuerpo a la derecha.
 *
 * Structure-only, pure DS: cada clase existe como componente publicado
 * (section-header, toc, prose) o en foundation. Este archivo NO define color,
 * tipografia ni motion: solo la rejilla y el comportamiento sticky.
 *
 * El indice NO se escribe: [data-toc-list] trae UN link plantilla
 * ([data-toc-link]) que el behavior toc-animation clona por cada heading de
 * [data-toc-content] y luego retira. Un legal de 36 secciones no obliga a
 * mantener 36 links a mano.
 *
 * El CUERPO lo aporta el consumidor dentro de [data-toc-content]: es contenido
 * heterogeneo (h2, p, listas, tablas), no una lista de slots. La clase `prose`
 * ya lo estiliza por elemento, asi que sirve igual un rich text de Webflow, un
 * campo de CMS o nodos construidos en codigo.
 *
 * Contrato de edicion: EDITABLE -> eyebrow/titulo/fecha/label del indice/
 * niveles/offset y todo el cuerpo. FIJO -> nada.
 */

export const articleToc = {
  slug: 'article-toc',
  name: 'Article with Table of Contents',
  description:
    'Documento largo con indice lateral sticky generado desde sus headings: legales, documentacion y articulos de fondo. El cuerpo lo aporta el consumidor dentro de [data-toc-content]. Structure only.',
  components: ['section-header', 'toc', 'prose'],
  html: `<!-- Layout: article-toc -->
<!-- Behavior: el indice lo genera toc-animation (packages/animations/src/table-of-contents.ts).
     El host debe cargar gsap + ScrollTrigger (globales) y llamar initTableOfContents()
     DESPUES de que el cuerpo este en el DOM. Sin el behavior, el layout sigue siendo un
     documento legible: solo se queda sin indice.
     Get component CSS: atom_uikit_source("prose", ["css"]), atom_uikit_source("toc", ["css"]) -->
<section class="section l-article-toc" data-toc-wrap data-toc-levels="{{toc_levels}}" data-toc-offset="{{toc_offset}}">
  <div class="container">
    <header class="section-header l-article-toc__header">
      <span class="eyebrow section-header__eyebrow">{{eyebrow}}</span>
      <h1 class="h1 section-header__title">{{heading}}</h1>
      <p class="caption l-article-toc__updated">{{updated}}</p>
    </header>
    <div class="l-article-toc__grid">
      <aside class="l-article-toc__sidebar">
        <nav class="toc" aria-label="{{toc_label}}">
          <p class="label toc__label">{{toc_label}}</p>
          <div class="toc__list" data-toc-list>
            <!-- Plantilla del link: se clona una vez por heading y se retira del DOM.
                 [data-toc-text] recibe el texto, asi un template con icono no lo pierde. -->
            <a class="toc__link" data-toc-link href="#"><span data-toc-text></span></a>
          </div>
        </nav>
      </aside>
      <div class="prose l-article-toc__body" data-toc-content>
        <!-- El cuerpo va aqui. En no-code: un Rich Text de Webflow dentro de este div
             (prose lo estiliza por etiqueta, sin clases por nodo). En codigo: nodos
             appendidos desde el modelo de contenido. -->
      </div>
    </div>
  </div>
</section>`,
  css: `/* Layout: article-toc — solo la rejilla del documento.
   El lateral lo gobierna .container; la medida de lectura, prose (--prose-measure);
   el ritmo vertical de la cabecera, section-header. */
.l-article-toc__grid {
  display: grid;
  /* minmax(0, 1fr), no 1fr: el minimo automatico de una columna es el contenido
     de su item, y una tabla ancha dentro del documento ensancharia la rejilla mas
     que el viewport, arrastrando la pagina entera a scroll horizontal. */
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-10);
  /* start, no stretch: si el aside se estira a la altura del documento, sticky
     no tiene recorrido y el indice deja de seguir el scroll. */
  align-items: start;
}

.l-article-toc__sidebar,
.l-article-toc__body {
  min-width: 0;
}

.l-article-toc__updated {
  margin-block-start: 0;
}

@media (min-width: 992px) {
  .l-article-toc__grid {
    grid-template-columns: 15rem minmax(0, 1fr);
    gap: var(--spacing-16);
  }

  .l-article-toc__sidebar {
    position: sticky;
    /* El offset del sticky y el data-toc-offset del behavior describen la misma
       barra del host: si se cambia uno, se cambia el otro. */
    top: var(--spacing-10);
  }
}

@media (max-width: 991px) {
  /* Sin columna lateral el indice va arriba, y un documento de 36 secciones
     seria un muro antes del primer parrafo: se acota y scrollea el propio
     indice. Alternativa para el consumidor que prefiera colapsarlo: envolver
     el nav en <details class="toc toc--collapsible">. */
  .l-article-toc__sidebar {
    max-height: 40vh;
    overflow-y: auto;
  }

  .l-article-toc__body {
    --prose-measure: none;
  }
}`,
};
