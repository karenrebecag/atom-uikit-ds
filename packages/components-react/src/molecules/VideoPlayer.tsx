import { type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Icons ---- */

const PlayIcon = () => (
  <svg className="video-player__btn-play-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.38178 6.13982C6.40762 5.94017 6.48425 5.74878 6.60555 5.58089C6.72686 5.413 6.88949 5.27326 7.08049 5.17279C7.2715 5.07232 7.48559 5.01391 7.70574 5.00219C7.92587 4.99048 8.14597 5.02579 8.3485 5.10532C9.37235 5.50436 11.6669 6.45272 14.5784 7.98469C17.4908 9.51754 19.5395 10.8562 20.4294 11.4635C21.1891 11.9829 21.191 13.013 20.4304 13.5342C19.5491 14.1381 17.5256 15.4591 14.5784 17.0113C11.6283 18.5635 9.36078 19.5005 8.34657 19.8942C7.47311 20.2343 6.49554 19.7183 6.38178 18.8597C6.24873 17.856 6 15.5769 6 12.4989C6 9.42262 6.24777 7.14443 6.38178 6.13982Z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg className="video-player__btn-pause-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M8 6.5C8 6.22386 8.22386 6 8.5 6H10.5C10.7761 6 11 6.22386 11 6.5V17.5C11 17.7761 10.7761 18 10.5 18H8.5C8.22386 18 8 17.7761 8 17.5V6.5Z" fill="currentColor" />
    <path d="M14 6.5C14 6.22386 14.2239 6 14.5 6H16.5C16.7761 6 17 6.22386 17 6.5V17.5C17 17.7761 16.7761 18 16.5 18H14.5C14.2239 18 14 17.7761 14 17.5V6.5Z" fill="currentColor" />
  </svg>
);

const VolumeUpIcon = () => (
  <svg className="video-player__volume-up-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M3 8.99998V15H7L12 20V3.99998L7 8.99998H3ZM16.5 12C16.5 10.23 15.48 8.70998 14 7.96998V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.22998V5.28998C16.89 6.14998 19 8.82998 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.71998 18.01 4.13998 14 3.22998Z" fill="currentColor" />
  </svg>
);

const VolumeMuteIcon = () => (
  <svg className="video-player__volume-mute-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12ZM19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.45 14 18.7V20.76C15.38 20.45 16.63 19.81 17.69 18.95L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" fill="currentColor" />
  </svg>
);

const FullscreenScaleIcon = () => (
  <svg className="video-player__fullscreen-scale-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="2" height="7" fill="currentColor" /><rect x="3" y="3" width="2" height="7" fill="currentColor" />
    <rect x="19" y="3" width="2" height="7" fill="currentColor" /><rect x="19" y="14" width="2" height="7" fill="currentColor" />
    <rect x="3" y="19" width="7" height="2" fill="currentColor" /><rect x="14" y="19" width="7" height="2" fill="currentColor" />
    <rect x="3" y="3" width="7" height="2" fill="currentColor" /><rect x="14" y="3" width="7" height="2" fill="currentColor" />
  </svg>
);

const FullscreenShrinkIcon = () => (
  <svg className="video-player__fullscreen-shrink-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <rect x="7" y="2" width="2" height="7" fill="currentColor" /><rect x="15" y="2" width="2" height="7" fill="currentColor" />
    <rect x="15" y="15" width="2" height="7" fill="currentColor" /><rect x="8" y="15" width="2" height="7" fill="currentColor" />
    <rect x="2" y="7" width="7" height="2" fill="currentColor" /><rect x="3" y="15" width="7" height="2" fill="currentColor" />
    <rect x="15" y="7" width="7" height="2" fill="currentColor" /><rect x="15" y="15" width="7" height="2" fill="currentColor" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="video-player__loading-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path fill="currentColor" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
      <animateTransform attributeName="transform" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite" />
    </path>
  </svg>
);

/* ---- Component ---- */

export type VideoPlayerProps = {
  videoId: string;
  customer?: string;
  autoplay?: boolean;
  muted?: boolean;
  placeholder?: string;
  className?: string;
};

export function VideoPlayer({
  videoId,
  customer,
  autoplay = false,
  muted = false,
  placeholder,
  className,
}: VideoPlayerProps) {
  return (
    <div
      className={cn('video-player', className)}
      data-video-player-init=""
      data-video-id={videoId}
      {...(customer ? { 'data-video-customer': customer } : {})}
      data-video-autoplay={String(autoplay)}
      data-video-playing="false"
      data-video-activated="false"
      data-video-fullscreen="false"
      data-video-paused-by-user="false"
      data-video-hover="false"
      data-video-loaded="false"
      data-video-muted={String(muted || autoplay)}
    >
      <div className="video-player__before" />
      <iframe
        width="640"
        height="360"
        className="video-player__iframe"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
      {placeholder && (
        <img src={placeholder} loading="eager" alt="" className="video-player__placeholder" />
      )}
      <div className="video-player__dark" />

      <div className="video-player__play" data-video-control="play">
        <div className="video-player__btn"><PlayIcon /></div>
      </div>
      <div className="video-player__pause" data-video-control="pause">
        <div className="video-player__btn"><PauseIcon /></div>
      </div>

      <div className="video-player__interface">
        <div className="video-player__interface-bottom">
          <div className="video-player__duration">
            <span className="video-player__duration-span" data-video-duration="">0:00</span>
          </div>
          <div className="video-player__timeline">
            <progress className="video-player__timeline-progress" max={100} value={0} />
            <input className="video-player__timeline-input" type="range" min={0} max={100} step={0.01} data-video-control="timeline" defaultValue={0} />
          </div>
          <div className="video-player__mute" data-video-control="mute">
            <VolumeUpIcon />
            <VolumeMuteIcon />
          </div>
          <div className="video-player__fullscreen" data-video-control="fullscreen">
            <FullscreenScaleIcon />
            <FullscreenShrinkIcon />
          </div>
        </div>
      </div>

      <div className="video-player__loading"><LoadingSpinner /></div>
    </div>
  );
}
