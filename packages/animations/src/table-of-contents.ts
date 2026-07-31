// Table of Contents — indice generado desde los headings del contenido
//
// A diferencia de progress-nav (secciones declaradas a mano), aqui los links NO
// se escriben: se clonan de UN template por cada heading encontrado. Es lo que
// permite que un legal de 36 secciones o un articulo de CMS traigan indice sin
// que nadie mantenga la lista a mano.
//
// DOM contract:
//   [data-toc-wrap]              root; contiene el contenido y la lista
//   [data-toc-content]           contenedor del contenido (article / rich text)
//   [data-toc-list]              contenedor donde se insertan los links
//   [data-toc-link]              UN link plantilla dentro de la lista
//   [data-toc-text]              hijo del template que recibe el texto (opcional;
//                                sin el, el texto va al propio link — asi un
//                                template con icono no lo pierde)
//   [data-toc-levels="h2,h3"]    niveles incluidos (default h2,h3)
//   [data-toc-offset="80"]       offset de scroll en px (barra sticky del host)
//   [data-toc-ignore]            en un heading: lo excluye del indice
//   {skip} en el texto           lo excluye y borra el marcador del heading
//
// Escribe:
//   id                           en cada heading sin id (slug unico por root)
//   [data-toc-depth="2|3|4"]     nivel del heading, en cada link generado
//   [data-toc-item]              marca de link generado (delegacion del click)
//   [data-toc-status="active"]   en el link de la seccion visible
//
// Requires: gsap, ScrollTrigger (global)
//
// prefers-reduced-motion: SIN guarda de salida, a proposito. Este modulo es
// FUNCIONAL (genera la navegacion del documento y marca donde estas); saltarselo
// dejaria un indice vacio. Lo unico que SI respeta la preferencia es el scroll
// suave del click: bajo reduced-motion salta en vez de deslizar. La transicion
// del estado activo la apaga toc.css. No "arreglar" con un early-return.


/** F10b — Webflow/domContract single source; must cover data-* queried in this module. */
export const REQUIRED_HOOKS = [
  "data-toc-wrap",
  "data-toc-content",
  "data-toc-list",
  "data-toc-link",
  "data-toc-text"
] as const;

export const REQUIRED_ANATOMY = [
  "[data-toc-text]",
  "[data-toc-item]"
] as const;

export const GSAP_PLUGINS = [] as const;

export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

declare const gsap: any;
declare const ScrollTrigger: any;

/** Lenis del host, si lo hay: su scroll manda sobre window.scrollTo. */
interface LenisLike {
  scrollTo(target: Element, options?: { offset?: number; immediate?: boolean }): void;
}

const SKIP_MARKER = '{skip}';
const DEFAULT_LEVELS = 'h2,h3';
const DEFAULT_OFFSET = 50;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Slug estable y unico dentro de su documento (dos "Privacidad" no colisionan). */
function slugify(text: string, taken: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize('NFD')
      // NFD separa el acento de la letra y el filtro de abajo se come la marca:
      // sin esto "Información" daria "informacin" en vez de "informacion".
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';

  const count = taken.get(base) ?? 0;
  taken.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

/** Borra el marcador {skip} del texto visible del heading. */
function stripMarker(el: Element): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.textContent?.includes(SKIP_MARKER)) {
      node.textContent = node.textContent.replace(SKIP_MARKER, '').trim();
    }
  }
}

function parseLevels(raw: string | null): string {
  // Vacio, no solo ausente: el layout publica data-toc-levels="{{toc_levels}}" y
  // un consumidor que no manda el slot deja el atributo en "". Sin este OR el
  // indice quedaria mudo por un slot sin rellenar.
  return (raw || DEFAULT_LEVELS)
    .split(',')
    .map((level) => level.trim().toLowerCase())
    .filter((level) => /^h[1-6]$/.test(level))
    .join(', ');
}

function initRoot(root: HTMLElement): CleanupFn {
  const contentEl = root.querySelector<HTMLElement>('[data-toc-content]');
  const listEl = root.querySelector<HTMLElement>('[data-toc-list]');
  const template = listEl?.querySelector<HTMLAnchorElement>('[data-toc-link]');
  if (!contentEl || !listEl || !template) return () => {};

  const levelSelector = parseLevels(root.getAttribute('data-toc-levels'));
  if (!levelSelector) return () => {};

  const offset = Number.parseInt(root.getAttribute('data-toc-offset') ?? '', 10) || DEFAULT_OFFSET;

  const headings: HTMLElement[] = [];
  for (const heading of Array.from(contentEl.querySelectorAll<HTMLElement>(levelSelector))) {
    if (heading.hasAttribute('data-toc-ignore')) continue;
    if (heading.textContent?.includes(SKIP_MARKER)) {
      stripMarker(heading);
      continue;
    }
    if (!heading.textContent?.trim()) continue;
    headings.push(heading);
  }
  if (!headings.length) return () => {};

  // Ids inyectados: se anotan para devolver el DOM como estaba en el cleanup.
  const taken = new Map<string, number>();
  const injectedIds: HTMLElement[] = [];
  for (const heading of headings) {
    if (heading.id) continue;
    heading.id = slugify(heading.textContent?.trim() ?? '', taken);
    injectedIds.push(heading);
  }

  // El template sale del DOM (es un plano, no un item) pero se guarda: sin esto
  // un re-init despues del cleanup no tendria de donde clonar. El anchor se
  // captura ANTES de anexar los clones: si se capturara despues, en HTML sin
  // whitespace apuntaria al primer link generado y el insertBefore del cleanup
  // lanzaria NotFoundError al referenciar un nodo ya removido.
  const templateAnchor = template.nextSibling;
  template.remove();

  const links: HTMLAnchorElement[] = headings.map((heading) => {
    const link = template.cloneNode(true) as HTMLAnchorElement;
    const textTarget = link.querySelector<HTMLElement>('[data-toc-text]') ?? link;
    textTarget.textContent = heading.textContent?.trim() ?? '';
    link.setAttribute('href', `#${heading.id}`);
    link.removeAttribute('data-toc-link');
    link.setAttribute('data-toc-item', '');
    link.setAttribute('data-toc-depth', heading.tagName.charAt(1));
    listEl.append(link);
    return link;
  });

  function setActive(index: number): void {
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('data-toc-status', 'active');
      else link.setAttribute('data-toc-status', '');
    });
  }

  const triggers: Array<{ kill(): void }> = [];
  if (typeof ScrollTrigger !== 'undefined') {
    headings.forEach((heading, i) => {
      const next = headings[i + 1];
      triggers.push(
        ScrollTrigger.create({
          trigger: heading,
          start: `top ${offset + 1}px`,
          endTrigger: next ?? contentEl,
          end: next ? `top ${offset + 1}px` : 'bottom top',
          onToggle: (self: { isActive: boolean }) => {
            if (self.isActive) setActive(i);
          },
        }),
      );
    });
  }

  // Por encima del primer heading no hay tramo activo: el indice arrancaria en
  // blanco y pareceria roto.
  const firstTop = headings[0].getBoundingClientRect().top + window.scrollY;
  if (window.scrollY <= firstTop - offset) setActive(0);

  function onClick(event: MouseEvent): void {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('[data-toc-item]');
    if (!link) return;

    const id = link.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    // Sin destino se deja pasar el click: un href roto que navega es mejor que
    // un preventDefault que no hace nada.
    if (!target) return;

    event.preventDefault();

    const lenis = (window as typeof window & { lenis?: LenisLike }).lenis;
    const immediate = prefersReducedMotion();

    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { offset: -offset, immediate });
      return;
    }

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: immediate ? 'auto' : 'smooth',
    });
  }

  listEl.addEventListener('click', onClick);

  return () => {
    listEl.removeEventListener('click', onClick);
    triggers.forEach((trigger) => trigger.kill());
    links.forEach((link) => link.remove());
    listEl.insertBefore(template, templateAnchor);
    injectedIds.forEach((heading) => heading.removeAttribute('id'));
  };
}

export function initTableOfContents(): CleanupFn {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);

  const cleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-toc-wrap]')).map(
    initRoot,
  );

  return () => cleanups.forEach((cleanup) => cleanup());
}
