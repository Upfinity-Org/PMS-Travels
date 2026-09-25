/**
 * Photos are served from images.unsplash.com. Requesting several widths lets the browser pick the smallest
 * file that looks sharp, and `auto=format` makes the CDN send WebP/AVIF where supported.
 * Swap `photo` ids for your own photography whenever you have it (see README > Replacing images).
 */
export const PHOTOS = {
  temple: 'photo-1582510003544-4d00b7f74220',
  hills: 'photo-1631546099508-f0fddd188361',
  sedan: 'photo-1503376780353-7e6692767b70',
  suv: 'photo-1542362567-b07e54358753',
  traveller: 'photo-1544620347-c4fd4a3d5957',
} as const;

export const photoUrl = (id: string, width: number, quality = 75): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=${quality}&w=${width}`;

export const photoSrcSet = (id: string, widths: number[], quality = 75): string =>
  widths.map((w) => `${photoUrl(id, w, quality)} ${w}w`).join(', ');
