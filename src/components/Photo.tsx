import { photoSrcSet, photoUrl } from '../lib/images';

type PhotoProps = {
  id: string;
  alt: string;
  widths: number[];
  sizes: string;
  className?: string;
  /** Above-the-fold image: loads immediately with high priority. Everything else is lazy. */
  priority?: boolean;
  quality?: number;
  /** Intrinsic size; set it on images that are not absolutely positioned to avoid layout shift. */
  width?: number;
  height?: number;
};

export function Photo({ id, alt, widths, sizes, className, priority = false, quality = 75, width, height }: PhotoProps) {
  const fallbackWidth = widths[Math.floor(widths.length / 2)];
  return (
    <img
      src={photoUrl(id, fallbackWidth, quality)}
      srcSet={photoSrcSet(id, widths, quality)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
