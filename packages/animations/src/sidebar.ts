import type { CleanupFn, AnimationConfig } from './index';

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
        { autoAlpha: 0, xPercent: 25 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.5,
          stagger: 0.04,
          ease,
          delay: 0.1,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }

    // Group labels: fade up
    if (groupLabels.length) {
      gsap.fromTo(groupLabels,
        { autoAlpha: 0, yPercent: 50 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.2,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }

    // User info: slide from left
    if (userInfo.length) {
      gsap.fromTo(userInfo,
        { autoAlpha: 0, xPercent: 30 },
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.5,
          ease,
          delay: 0.15,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }

    // Chevrons: fade in
    if (chevrons.length) {
      gsap.fromTo(chevrons,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.3,
          stagger: 0.03,
          ease: 'power2.out',
          delay: 0.25,
          clearProps: 'opacity,visibility',
        }
      );
    }
  });

  observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
}
