/**
 * Fleet photos are the business's own vehicle photography (see tools/build_vehicle_photos.py),
 * pre-resized into public/vehicles/ at a fixed set of widths — unlike the Unsplash-backed helpers
 * in lib/images.ts, there's no CDN to request arbitrary sizes from.
 */
export const VEHICLE_WIDTHS = [480, 720, 960, 1280] as const;

export const vehiclePhotoUrl = (slug: string, width: (typeof VEHICLE_WIDTHS)[number]): string => `/vehicles/${slug}-${width}.jpg`;

export const vehiclePhotoSrcSet = (slug: string): string =>
  VEHICLE_WIDTHS.map((w) => `${vehiclePhotoUrl(slug, w)} ${w}w`).join(', ');
