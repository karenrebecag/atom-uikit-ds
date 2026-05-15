// Video Player (Cloudflare Stream) Controller
// DOM contract: [data-video-player-init] on container
// Config via data attributes:
//   data-video-id          — Cloudflare Stream video UID
//   data-video-customer    — Cloudflare customer subdomain code (optional)
//   data-video-autoplay    — "true" | "false"
//   data-video-muted       — "true" | "false"
//
// Controls: [data-video-control="play|pause|mute|fullscreen|timeline"]
// State:    data-video-playing, data-video-activated, data-video-loaded,
//           data-video-fullscreen, data-video-hover, data-video-muted
//
// Requires: Cloudflare Stream SDK (global Stream function)
//   <script src="https://embed.cloudflarestream.com/embed/sdk.latest.js"></script>

type CleanupFn = () => void;

declare const Stream: any;

function secondsToTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' + sec : sec}`;
}

export function initVideoPlayer(): CleanupFn {
  if (typeof Stream === 'undefined') return () => {};

  const containers = document.querySelectorAll<HTMLElement>('[data-video-player-init]');
  const cleanups: CleanupFn[] = [];

  containers.forEach((el) => {
    if (el.dataset.videoPlayerInit === 'initialized') return;

    const videoId = el.getAttribute('data-video-id');
    const customer = el.getAttribute('data-video-customer');
    if (!videoId) return;

    const iframe = el.querySelector<HTMLIFrameElement>('iframe');
    if (!iframe) return;

    // Build embed URL
    const baseUrl = customer
      ? `https://customer-${customer}.cloudflarestream.com/${videoId}/iframe`
      : `https://iframe.videodelivery.net/${videoId}`;

    iframe.src = baseUrl;

    const player = Stream(iframe);
    const listeners: { target: EventTarget; event: string; handler: any }[] = [];

    const on = (target: EventTarget, event: string, handler: any, opts?: any) => {
      target.addEventListener(event, handler, opts);
      listeners.push({ target, event, handler });
    };

    // Play/Pause
    function videoPlay() {
      el.setAttribute('data-video-activated', 'true');
      el.setAttribute('data-video-playing', 'true');
      player.play();
    }

    function videoPause() {
      player.pause();
    }

    // Player events
    player.addEventListener('play', () => {
      el.setAttribute('data-video-loaded', 'true');
      el.setAttribute('data-video-playing', 'true');
    });

    player.addEventListener('pause', () => {
      el.setAttribute('data-video-playing', 'false');
    });

    player.addEventListener('ended', () => {
      const isAutoplay = el.getAttribute('data-video-autoplay') === 'true';
      if (!isAutoplay) {
        el.setAttribute('data-video-activated', 'false');
        el.setAttribute('data-video-playing', 'false');
      } else {
        player.currentTime = 0;
        player.play();
      }
    });

    // Autoplay
    const isAutoplay = el.getAttribute('data-video-autoplay') === 'true';
    let checkVisibility: (() => void) | null = null;

    if (!isAutoplay) {
      player.muted = false;
      player.pause();
    } else {
      player.muted = true;
      el.setAttribute('data-video-muted', 'true');

      if (el.getAttribute('data-video-paused-by-user') === 'false') {
        checkVisibility = () => {
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          inView ? videoPlay() : videoPause();
        };
        checkVisibility();
        on(window, 'scroll', checkVisibility);
      }
    }

    // Controls
    const playBtn = el.querySelector<HTMLElement>('[data-video-control="play"]');
    const pauseBtn = el.querySelector<HTMLElement>('[data-video-control="pause"]');
    const muteBtn = el.querySelector<HTMLElement>('[data-video-control="mute"]');
    const fullscreenBtn = el.querySelector<HTMLElement>('[data-video-control="fullscreen"]');
    const timelineInput = el.querySelector<HTMLInputElement>('[data-video-control="timeline"]');
    const progressEl = el.querySelector<HTMLProgressElement>('progress');
    const durationEl = el.querySelector<HTMLElement>('[data-video-duration]');

    if (playBtn) {
      on(playBtn, 'click', () => {
        player.muted = true;
        videoPlay();
        const muted = el.getAttribute('data-video-muted') === 'true';
        player.muted = muted;
      });
    }

    if (pauseBtn) {
      on(pauseBtn, 'click', () => {
        videoPause();
        if (isAutoplay) {
          el.setAttribute('data-video-paused-by-user', 'true');
          if (checkVisibility) window.removeEventListener('scroll', checkVisibility);
        }
      });
    }

    if (muteBtn) {
      on(muteBtn, 'click', () => {
        const muted = el.getAttribute('data-video-muted') === 'true';
        player.muted = !muted;
        el.setAttribute('data-video-muted', muted ? 'false' : 'true');
      });
    }

    // Fullscreen
    const fsSupported = !!document.fullscreenEnabled;
    if (!fsSupported && fullscreenBtn) fullscreenBtn.style.display = 'none';

    if (fullscreenBtn) {
      on(fullscreenBtn, 'click', () => {
        const isFs = !!document.fullscreenElement;
        if (isFs) {
          el.setAttribute('data-video-fullscreen', 'false');
          document.exitFullscreen();
        } else {
          el.setAttribute('data-video-fullscreen', 'true');
          el.requestFullscreen();
        }
      });
    }

    const handleFsChange = () => {
      el.setAttribute('data-video-fullscreen', document.fullscreenElement ? 'true' : 'false');
    };
    on(document, 'fullscreenchange', handleFsChange);

    // Duration
    player.addEventListener('loadedmetadata', () => {
      const dur = player.duration;
      if (durationEl) durationEl.textContent = secondsToTime(dur);
      if (timelineInput) timelineInput.max = String(dur);
      if (progressEl) progressEl.max = dur;
    });

    // Timeline seek
    if (timelineInput) {
      on(timelineInput, 'input', () => {
        const val = parseFloat(timelineInput.value);
        player.currentTime = val;
        if (progressEl) progressEl.value = val;
      });
    }

    // Time update
    player.addEventListener('timeupdate', () => {
      const t = player.currentTime;
      if (timelineInput) timelineInput.value = String(t);
      if (progressEl) progressEl.value = t;
      if (durationEl) durationEl.textContent = secondsToTime(Math.trunc(t));
    });

    // Hover timer
    let hoverTimer: number;
    on(el, 'mousemove', () => {
      el.setAttribute('data-video-hover', 'true');
      clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        el.setAttribute('data-video-hover', 'false');
      }, 3000);
    });

    el.dataset.videoPlayerInit = 'initialized';

    cleanups.push(() => {
      listeners.forEach(({ target, event, handler }) => target.removeEventListener(event, handler));
      clearTimeout(hoverTimer);
      delete el.dataset.videoPlayerInit;
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
