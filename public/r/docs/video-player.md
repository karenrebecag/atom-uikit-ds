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

## Criterio de uso

- Es un controlador de Cloudflare Stream: necesita `videoId` y `customer`, no una URL de archivo.
- `autoplay` solo es aceptable con `muted`; ademas, reduced-motion desactiva el autoplay y deja el player operativo.
- Da siempre un `placeholder`: el primer frame en blanco se lee como error de carga.

## Gotchas

- El autoplay es una preferencia, no una garantia: politicas del navegador pueden bloquearlo y el player debe seguir usable.
- Es runtime-only: fuera del canal de paste, se consume via React.
