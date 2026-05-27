import { forwardRef, useState, type ImgHTMLAttributes } from 'react';

export type ImageSize = 'xs' | 's' | 'm' | 'l' | 'hero' | 'full';
export type ImageRatio = '1x1' | '4x3' | '16x9' | '21x9';
export type ImageFit = 'cover' | 'contain';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ImageProps = {
  size?: ImageSize;
  ratio?: ImageRatio;
  fit?: ImageFit;
  radius?: ImageRadius;
  className?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'className'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ size, ratio, fit, radius, className, loading = 'lazy', onLoad, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);

    const classes = cn(
      'image',
      size && `image--${size}`,
      ratio && `image--ratio-${ratio}`,
      fit && `image--${fit}`,
      radius && `image--rounded-${radius}`,
      !loaded && 'image--loading',
      loaded && 'image--loaded',
      className,
    );

    return (
      <img
        ref={ref}
        className={classes}
        loading={loading}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        {...props}
      />
    );
  },
);

Image.displayName = 'Image';
