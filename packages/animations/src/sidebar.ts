// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que marquee-draggable/progress-nav/video-player.
export type CleanupFn = () => void;
export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

/**
 * Sidebar expand reveal — stagger content entrance on expand.
 *
 * CSS owns layout (width, visibility). GSAP only choreographs
 * the entrance of labels/items when sidebar expands.
 *
 * Uses MutationObserver to detect .sidebar--collapsed removal.
 *
 * Contract:
 *   [data-sidebar]              → root (class change detection)
 *   [data-sidebar-label]        → text labels
 *   [data-sidebar-group-label]  → section headings
 *   [data-sidebar-user-info]    → user profile text
 *   [data-sidebar-chevron]      → collapsible chevrons
 */
export function initSidebarAnimation(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const CustomEase = (globalThis as any).CustomEase;

  if (!gsap) {
    console.warn('[atom-uikit] initSidebarAnimation: gsap not found');
    return () => {};
  }

  if (CustomEase) {
    CustomEase.create('sidebar-reveal', 'M0,0 C0.32,0.72 0,1 1,1');
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const sidebar = (scope as Element).querySelector?.('[data-sidebar]');
  if (!sidebar) return () => {};

  // CSS es dueño del layout (width/visibility): sin coreografia el contenido
  // simplemente aparece — saltarse el init es seguro y honra el contrato.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if ((sidebar as HTMLElement).dataset.motionExempt !== undefined) return () => {};

  const ease = CustomEase ? 'sidebar-reveal' : 'power3.out';
  let prevCollapsed = sidebar.classList.contains('sidebar--collapsed');

  const observer = new MutationObserver(() => {
    const nowCollapsed = sidebar.classList.contains('sidebar--collapsed');
    if (nowCollapsed === prevCollapsed) return;
    prevCollapsed = nowCollapsed;

    if (nowCollapsed) return; // collapsing — CSS handles fade out

    // Expanding — choreograph entrance
    const labels = sidebar.querySelectorAll('[data-sidebar-label]');
    const groupLabels = sidebar.querySelectorAll('[data-sidebar-group-label]');
    const userInfo = sidebar.querySelectorAll('[data-sidebar-user-info]');
    const chevrons = sidebar.querySelectorAll('[data-sidebar-chevron]');

    // Large items: stagger slide from left
    if (labels.length) {
      gsap.fromTo(labels,
        { autoAlpha: 0, xPercent: 15 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.3,
          stagger: 0.02,
          ease,
          delay: 0.05,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }

    if (groupLabels.length) {
      gsap.fromTo(groupLabels,
        { autoAlpha: 0, yPercent: 30 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.25,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.08,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }

    if (userInfo.length) {
      gsap.fromTo(userInfo,
        { autoAlpha: 0, xPercent: 15 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.3,
          ease,
          delay: 0.06,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }

    if (chevrons.length) {
      gsap.fromTo(chevrons,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.2,
          stagger: 0.02,
          ease: 'power2.out',
          delay: 0.1,
          clearProps: 'opacity,visibility',
        }
      );
    }
  });

  observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
}
