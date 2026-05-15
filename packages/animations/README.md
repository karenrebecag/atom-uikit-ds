# @atom-uikit/animations

GSAP animation modules for the ATOM UIKit design system -- each module targets DOM elements via `data-*` attribute contracts and returns a cleanup function.

## Install

```bash
pnpm add @atom-uikit/animations
```

GSAP is a peer dependency and must be installed separately:

```bash
pnpm add gsap
```

## Usage

```ts
import { initButtonHover, initSidebarAnimation } from '@atom-uikit/animations';

// Initialize and store cleanup
const cleanup = initButtonHover({ scope: '#my-section' });

// Teardown when done (SPA route change, unmount, etc.)
cleanup();
```

Every `init*` function returns a `CleanupFn` (`() => void`) that removes event listeners and kills GSAP instances.

## Animation Modules

### initButtonHover

Text swap animation with per-character blur and slide on hover.

| Attribute | Target | Description |
|-----------|--------|-------------|
| `data-button-animate` | Root element | Marks button for animation |
| `data-button-text` | Text elements | Expects 2: default + hover clone |

Requires: `gsap`, `SplitText` (registered globally). Respects `prefers-reduced-motion` and `(hover: hover)`.

### initSidebarAnimation

Staggered content entrance when the sidebar expands. CSS owns layout; GSAP choreographs the reveal.

| Attribute | Target | Description |
|-----------|--------|-------------|
| `data-sidebar` | Root | Class change detection for collapse state |
| `data-sidebar-label` | Text labels | Animated on reveal |
| `data-sidebar-group-label` | Section headings | Animated on reveal |
| `data-sidebar-user-info` | User profile text | Animated on reveal |
| `data-sidebar-chevron` | Collapsible chevrons | Animated on reveal |

Requires: `gsap`, optionally `CustomEase`.

### initMenuButton

Burger-to-X icon transition on toggle.

| Attribute | Target | Description |
|-----------|--------|-------------|
| `data-menu-button-animate` | Button element | Marks burger for animation |
| `data-menu-button` | Button element | State: `"burger"` or `"close"` |

Children: 3x `.burger-icon__line` inside `.burger-icon`. Requires: `gsap`, `CustomEase`.

### initDraggableMarquee

Infinite horizontal marquee with drag-to-scrub interaction.

| Attribute | Target | Description |
|-----------|--------|-------------|
| `data-draggable-marquee` | Container | Root element |
| `data-direction` | Container | `"left"` or `"right"` |
| `data-duration` | Container | Seconds per loop (default: 20) |
| `data-multiplier` | Container | Max drag speed multiplier (default: 35) |
| `data-sensitivity` | Container | Velocity-to-timescale ratio (default: 0.01) |
| `data-draggable-marquee-collection` | Inner wrapper | Collection container |
| `data-draggable-marquee-list` | List wrapper | Contains `.marquee__item` children |

Requires: `gsap`, `Observer`, `ScrollTrigger`.

### initVideoPlayer

Cloudflare Stream video player controller with custom UI.

| Attribute | Target | Description |
|-----------|--------|-------------|
| `data-video-player-init` | Container | Root element |
| `data-video-id` | Container | Cloudflare Stream video UID |
| `data-video-customer` | Container | Cloudflare customer subdomain (optional) |
| `data-video-autoplay` | Container | `"true"` or `"false"` |
| `data-video-muted` | Container | `"true"` or `"false"` |
| `data-video-control` | Control elements | `"play"`, `"pause"`, `"mute"`, `"fullscreen"`, `"timeline"` |

State attributes set on container: `data-video-playing`, `data-video-activated`, `data-video-loaded`, `data-video-fullscreen`, `data-video-hover`, `data-video-muted`.

Requires: Cloudflare Stream SDK (`<script src="https://embed.cloudflarestream.com/embed/sdk.latest.js"></script>`).

## Configuration

All modules accept an optional `AnimationConfig`:

```ts
interface AnimationConfig {
  scope?: HTMLElement | string; // Limit queries to a subtree
  debug?: boolean;
}
```

## Motion Safety

All modules respect `prefers-reduced-motion: reduce`. Individual elements can opt out with `data-motion-exempt`.

## Peer Dependencies

- `gsap` >= 3.12.0

## License

MIT
