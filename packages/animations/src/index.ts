export type CleanupFn = () => void;

export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

export { initButtonHover } from './button-hover';
export { initTextReveal } from './text-reveal';
export { initScrollReveal } from './scroll-reveal';
export { initBouncyTabs } from './bouncy-tabs';
export { initAccordionMorph } from './accordion-morph';
export { initTooltipSmart } from './tooltip';
export { initSidebarAnimation } from './sidebar';
export { initProgressNav } from './progress-nav';
export { initTableOfContents } from './table-of-contents';
export { initMenuButton } from './menu-button';
export { initMegaNav } from './mega-nav';
export { initNavAutohide } from './nav-autohide';
export { initDraggableMarquee } from './marquee-draggable';
export { initCssMarquee } from './marquee-css';
export { initVideoPlayer } from './video-player';
