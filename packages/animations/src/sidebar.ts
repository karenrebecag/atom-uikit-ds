import type { CleanupFn, AnimationConfig } from './index';

/**
 * Sidebar content reveal animation.
 *
 * Does NOT control width/layout — CSS handles that via .sidebar--collapsed.
 * GSAP only adds stagger reveal for labels and items on expand.
 *
 * Contract:
 *   [data-sidebar]              → root (watches class changes)
 *   [data-sidebar-label]        → text labels (stagger fade)
 *   [data-sidebar-group-label]  → section headings (fade last)
 *   [data-sidebar-user-info]    → user profile text (fade)
 *
 * Requires: gsap (registered externally)
 */
export function initSidebarAnimation(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;

  if (!gsap) {
    console.warn('[atom-uikit] initSidebarAnimation: gsap not found');
    return () => {};
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const sidebar = (scope as Element).querySelector?.('[data-sidebar]');
  if (!sidebar) return () => {};

  let prevCollapsed = sidebar.classList.contains('sidebar--collapsed');

  const observer = new MutationObserver(() => {
    const nowCollapsed = sidebar.classList.contains('sidebar--collapsed');
    if (nowCollapsed === prevCollapsed) return;
    prevCollapsed = nowCollapsed;

    if (!nowCollapsed) {
      // Expanding — stagger reveal content
      const labels = sidebar.querySelectorAll('[data-sidebar-label]');
      const groupLabels = sidebar.querySelectorAll('[data-sidebar-group-label]');
      const userInfo = sidebar.querySelectorAll('[data-sidebar-user-info]');
      const chevrons = sidebar.querySelectorAll('[data-sidebar-chevron]');

      const all = [...Array.from(labels), ...Array.from(groupLabels), ...Array.from(userInfo), ...Array.from(chevrons)];

      gsap.fromTo(all,
        { opacity: 0, x: -6 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.025,
          ease: 'power3.out',
          delay: 0.15,
          clearProps: 'opacity,x',
        }
      );
    }
  });

  observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

  return () => {
    observer.disconnect();
  };
}
