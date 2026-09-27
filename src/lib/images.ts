/**
 * Centralised image helpers.
 *
 * Property photography is served through the Unsplash CDN with explicit
 * `w` / `q` parameters so every <img> reserves its box (no CLS), is served in
 * a modern format, and is sized for the device that requests it.
 */

const BASE = 'https://images.unsplash.com';

export interface ImageOptions {
  width?: number;
  quality?: number;
}

/** Build a deterministic Unsplash URL for a photo id. */
export function unsplashUrl(photoId: string, options: ImageOptions = {}): string {
  const width = options.width ?? 1200;
  const quality = options.quality ?? 75;
  return `${BASE}/${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Hero / full-bleed imagery. */
export function heroImage(photoId: string, width = 2000): string {
  return unsplashUrl(photoId, { width, quality: 80 });
}

/** Card thumbnails. */
export function cardImage(photoId: string, width = 900): string {
  return unsplashUrl(photoId, { width, quality: 72 });
}

/** Small avatars / owner portraits. */
export function avatarImage(photoId: string, width = 160): string {
  return unsplashUrl(photoId, { width, quality: 70 });
}

/**
 * Responsive `srcset` descriptor string for a property photo.
 * Keeps mobile payloads small while retaining sharp desktop imagery.
 */
export function responsiveSrcSet(photoId: string, widths = [480, 768, 1080, 1440]): string {
  return widths.map((w) => `${unsplashUrl(photoId, { width: w, quality: 74 })} ${w}w`).join(', ');
}

export const PLACEHOLDER_IMAGE =
  'photo-1600585154340-be6161a56a0c';

export const CITY_IMAGES: Record<string, string> = {
  Mumbai: 'photo-1753806389001-80e994bfbf04',
  'Navi Mumbai': 'photo-1565838500329-d10006e80f55',
  Thane: 'photo-1564213053454-7fc0a81a3ea9',
  Pune: 'photo-1705955463252-e3f670e4041b',
  Bengaluru: 'photo-1706241137081-4b5e0f038d88',
  Hyderabad: 'photo-1764675286686-69b0e84d953c',
  'Delhi NCR': 'photo-1787055482226-8544df1e754a',
  Goa: 'photo-1652820330085-82a0c2b88d78',
};

/** Graceful fallback used when a listing has no photograph. */
export function imageForCity(city?: string | null): string {
  if (!city) return PLACEHOLDER_IMAGE;
  const key = Object.keys(CITY_IMAGES).find(
    (c) => c.toLowerCase() === city.toLowerCase() || city.toLowerCase().includes(c.toLowerCase()),
  );
  return key ? CITY_IMAGES[key] : PLACEHOLDER_IMAGE;
}
