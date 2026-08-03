<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Embedded product demo:

```tsx
import { VideoPlayer } from '@/components/atoms/VideoPlayer';

<VideoPlayer
  videoId="abc123"
  muted
  autoplay={false}
  placeholder="/poster.jpg"
/>
```

## Accesibilidad

- `videoId` is required. Do not autoplay with sound; `autoplay` implies muted via data attributes.
- Provide a real poster/placeholder and ensure controls remain operable when motion hooks are installed.

## Cuándo no usar

- Decorative looping backgrounds without controls → lighter media patterns, not a full player chrome.
- Audio-only content → dedicated audio UI, not `VideoPlayer`.
