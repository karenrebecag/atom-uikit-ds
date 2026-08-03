export type CleanupFn = () => void;

export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

export { initButtonHover } from './button-hover';
export { initTextReveal } from './text-reveal';
export { initScrollReveal } from './scroll-reveal';
export { initSidebarAnimation } from './sidebar';
export { initProgressNav } from './progress-nav';
export { initTableOfContents } from './table-of-contents';
export { initMenuButton } from './menu-button';
export { initNavAutohide } from './nav-autohide';
export { initDraggableMarquee } from './marquee-draggable';
export { initVideoPlayer } from './video-player';
