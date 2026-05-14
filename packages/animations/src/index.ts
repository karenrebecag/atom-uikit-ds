export type CleanupFn = () => void;

export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

export { initButtonHover } from './button-hover';
