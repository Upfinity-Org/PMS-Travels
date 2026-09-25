/**
 * Single source of truth for business details. Everything that appears in the header, footer,
 * contact page, structured data (JSON-LD) and the sitemap comes from here or from src/content.
 */
const rawUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:8443';

export const SITE = {
  name: 'P.M.S Tours & Travels',
  shortName: 'PMS Tours & Travels',
  tagline: 'Journey your way',
  locale: 'en-IN',
  /** Public origin without a trailing slash. Set VITE_SITE_URL in .env (see .env.example). */
  url: rawUrl.replace(/\/+$/, ''),
  phone: { display: '+91 63807 98106', tel: '+916380798106' },
  whatsapp: 'https://wa.me/916380798106',
  instagram: { url: 'https://instagram.com/pms_travelhub', handle: '@pms_travelhub' },
  /** Optional public e-mail (VITE_PUBLIC_EMAIL). Leave unset to keep the address off the website. */
  email: import.meta.env.VITE_PUBLIC_EMAIL || '',
  /**
   * Fill these in to publish your address in the footer/contact page and in Google structured data.
   * Leave `locality` empty to keep the address out entirely (nothing is invented for you).
   */
  address: { street: '', locality: '', region: 'Tamil Nadu', postalCode: '', country: 'IN' },
  areaServed: ['Tamil Nadu', 'South India'],
  /** Used as <lastmod> in sitemap.xml – bump it when you make a meaningful content change. */
  contentUpdated: '2026-09-21',
  developer: { name: 'Upfinity', url: 'https://upfinity.netlify.app/' },
} as const;

export const absoluteUrl = (path = '/'): string => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`);

export const hasAddress = SITE.address.locality !== '';
