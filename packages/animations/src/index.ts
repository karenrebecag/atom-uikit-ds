export type CleanupFn = () => void;

export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

export { initButtonHover } from './button-hover';
export { initTextReveal } from './text-reveal';
export { initSidebarAnimation } from './sidebar';
export { initProgressNav } from './progress-nav';
