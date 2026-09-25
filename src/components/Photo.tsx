import { photoSrcSet, photoUrl } from '../lib/images';
import { vehiclePhotoSrcSet, vehiclePhotoUrl } from '../lib/vehiclePhotos';

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

/** A remote, resizable-on-request photo (currently Unsplash) — used for editorial/hero imagery. */
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

type VehiclePhotoProps = {
  /** Fleet slug from src/content/fleet.ts, e.g. "sedans" — resolves to /vehicles/<slug>-<width>.jpg. */
  slug: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * The business's own vehicle photography (pre-sized by tools/build_vehicle_photos.py). These are
 * studio cutouts on a near-white background, so callers should pair this with `object-contain`
 * and a light backdrop rather than `object-cover` — cropping a cutout car shot looks wrong.
 */
export function VehiclePhoto({ slug, alt, sizes, className, priority = false }: VehiclePhotoProps) {
  return (
    <img
      src={vehiclePhotoUrl(slug, 720)}
      srcSet={vehiclePhotoSrcSet(slug)}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
