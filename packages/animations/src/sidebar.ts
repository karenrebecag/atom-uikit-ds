import type { CleanupFn, AnimationConfig } from './index';

/**
 * Sidebar expand/collapse animation.
 *
 * Contract:
 *   [data-sidebar]              → root sidebar element
 *   [data-sidebar-trigger]      → toggle button
 *   [data-sidebar-item]         → nav items (stagger reveal)
 *   [data-sidebar-label]        → text labels (fade in/out)
 *   [data-sidebar-group-label]  → section headings (fade in last)
 *   [data-sidebar-user-info]    → user profile text (fade in/out)
 *
 * Requires: gsap, CustomEase (registered externally)
 */
export function initSidebarAnimation(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const CustomEase = (globalThis as any).CustomEase;

  if (!gsap) {
    console.warn('[atom-uikit] initSidebarAnimation: gsap not found');
    return () => {};
  }

  if (CustomEase) {
    CustomEase.create('sidebar-energy', 'M0,0 C0.32,0.72 0,1 1,1');
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const sidebar = (scope as Element).querySelector?.('[data-sidebar]') || document.querySelector('[data-sidebar]');
  const trigger = (scope as Element).querySelector?.('[data-sidebar-trigger]') || document.querySelector('[data-sidebar-trigger]');

  if (!sidebar || !trigger) return () => {};

  const EXPANDED_WIDTH = 240;
  const COLLAPSED_WIDTH = 48;
  const ease = CustomEase ? 'sidebar-energy' : 'power3.out';

  let isCollapsed = sidebar.classList.contains('sidebar--collapsed');
  let tl: any;
  let enterEndTime = 0;

  function getTargets() {
    return {
      items: sidebar!.querySelectorAll('[data-sidebar-item]'),
      labels: sidebar!.querySelectorAll('[data-sidebar-label]'),
      groupLabels: sidebar!.querySelectorAll('[data-sidebar-group-label]'),
      userInfo: sidebar!.querySelectorAll('[data-sidebar-user-info]'),
      chevrons: sidebar!.querySelectorAll('[data-sidebar-chevron]'),
    };
  }

  function buildExpandTimeline() {
    const { items, labels, groupLabels, userInfo, chevrons } = getTargets();

    tl = gsap.timeline({
      paused: true,
      defaults: { ease, overwrite: true },
    });

    // Phase 1: expand width
    tl.to(sidebar, {
      width: EXPANDED_WIDTH,
      duration: 0.5,
    }, 0);

    // Phase 2: stagger items slide in
    if (items.length) {
      tl.fromTo(items,
        { opacity: 0.5, x: -4 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.03 },
        0.15
      );
    }

    // Phase 3: labels fade in
    if (labels.length) {
      tl.fromTo(labels,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.02 },
        0.2
      );
    }

    // Phase 4: group labels fade in last
    if (groupLabels.length) {
      tl.fromTo(groupLabels,
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
        0.3
      );
    }

    // Phase 5: user info
    if (userInfo.length) {
      tl.fromTo(userInfo,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.3 },
        0.25
      );
    }

    // Phase 6: chevrons
    if (chevrons.length) {
      tl.fromTo(chevrons,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        0.3
      );
    }

    enterEndTime = tl.duration();
    tl.addPause();

    // === Close half ===

    // Fade out content fast
    if (labels.length) {
      tl.to(labels, { opacity: 0, duration: 0.15 }, '<');
    }
    if (groupLabels.length) {
      tl.to(groupLabels, { opacity: 0, duration: 0.15 }, '<');
    }
    if (userInfo.length) {
      tl.to(userInfo, { opacity: 0, duration: 0.15 }, '<');
    }
    if (chevrons.length) {
      tl.to(chevrons, { opacity: 0, duration: 0.15 }, '<');
    }

    // Collapse width
    tl.to(sidebar, {
      width: COLLAPSED_WIDTH,
      duration: 0.4,
      ease: 'power2.inOut',
    }, '<+=0.05');
  }

  function toggle() {
    isCollapsed = !isCollapsed;

    // Toggle CSS class for non-animated styles (tooltip, centering, etc.)
    sidebar!.classList.toggle('sidebar--collapsed', isCollapsed);

    if (isCollapsed) {
      // Closing
      if (tl && tl.time() < enterEndTime) {
        tl.reverse();
      } else {
        buildExpandTimeline();
        // Jump to end of open, then play close
        tl.seek(enterEndTime + 0.001);
        tl.play();
      }
    } else {
      // Opening
      buildExpandTimeline();
      tl.timeScale(1).restart();
    }
  }

  // Set initial state
  if (isCollapsed) {
    gsap.set(sidebar, { width: COLLAPSED_WIDTH });
  } else {
    gsap.set(sidebar, { width: EXPANDED_WIDTH });
  }

  // Override CSS transition (GSAP takes control)
  (sidebar as HTMLElement).style.transition = 'none';

  // Intercept the existing trigger click
  const onClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  trigger.addEventListener('click', onClick, true);

  return () => {
    trigger.removeEventListener('click', onClick, true);
    tl?.kill();
    (sidebar as HTMLElement).style.transition = '';
  };
}
