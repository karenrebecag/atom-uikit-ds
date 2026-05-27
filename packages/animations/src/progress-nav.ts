// Progress Navigation — scroll-triggered section indicator
// DOM contract:
//   [data-progress-nav-list] on the nav list container
//   [data-progress-nav-target="#sectionId"] on each nav button
//   [data-progress-nav-anchor] + id on each content section
//   .progress-nav__indicator inside the list (auto-created if missing)
//
// Requires: gsap, ScrollTrigger (global)

type CleanupFn = () => void;

declare const gsap: any;
declare const ScrollTrigger: any;

export function initProgressNav(): CleanupFn {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);

  const navList = document.querySelector<HTMLElement>('[data-progress-nav-list]');
  if (!navList) return () => {};

  let indicator = navList.querySelector<HTMLElement>('.progress-nav__indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'progress-nav__indicator';
    navList.appendChild(indicator);
  }

  const triggers: any[] = [];

  function updateIndicator(activeLink: HTMLElement) {
    const parentWidth = navList!.offsetWidth;
    const parentHeight = navList!.offsetHeight;
    const parentRect = navList!.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const leftPercent = ((linkRect.left - parentRect.left) / parentWidth) * 100;
    const topPercent = ((linkRect.top - parentRect.top) / parentHeight) * 100;
    const widthPercent = (activeLink.offsetWidth / parentWidth) * 100;
    const heightPercent = (activeLink.offsetHeight / parentHeight) * 100;

    indicator!.style.left = leftPercent + '%';
    indicator!.style.top = topPercent + '%';
    indicator!.style.width = widthPercent + '%';
    indicator!.style.height = heightPercent + '%';
  }

  function activateLink(anchorID: string) {
    const activeLink = navList!.querySelector<HTMLElement>(
      `[data-progress-nav-target="#${anchorID}"]`,
    );
    if (!activeLink) return;

    activeLink.classList.add('is--active');
    const siblings = navList!.querySelectorAll<HTMLElement>('[data-progress-nav-target]');
    siblings.forEach((sib) => {
      if (sib !== activeLink) sib.classList.remove('is--active');
    });
    updateIndicator(activeLink);
  }

  const anchors = gsap.utils.toArray('[data-progress-nav-anchor]') as HTMLElement[];

  anchors.forEach((anchor) => {
    const anchorID = anchor.getAttribute('id');
    if (!anchorID) return;

    const trigger = ScrollTrigger.create({
      trigger: anchor,
      start: '0% 50%',
      end: '100% 50%',
      onEnter: () => activateLink(anchorID),
      onEnterBack: () => activateLink(anchorID),
    });

    triggers.push(trigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
  };
}
