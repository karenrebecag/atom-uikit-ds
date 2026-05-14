// ATOM UIKit Animations
// Each module exports init*(): CleanupFn
// Components use data-* attributes as animation hooks

export type CleanupFn = () => void;

export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}
