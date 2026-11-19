/**
 * Single source of truth for business details. Everything that appears in the header, footer,
 * contact page, structured data (JSON-LD) and the sitemap comes from here or from src/content.
 */
const rawUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:8443';

/** Typed as plain strings (not narrowed to literals) so `hasAddress` below stays a real runtime check. */
type Address = { street: string; locality: string; region: string; postalCode: string; country: string };

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
  address: { street: '', locality: 'Perungudi', region: 'Tamil Nadu', postalCode: '', country: 'IN' } as Address,
  areaServed: ['Tamil Nadu', 'South India'],
  /**
   * Named contacts, shown on the contact page. The owner uses the main phone number above; the
   * manager has a separate direct line.
   */
  team: {
    owner: { name: 'Sanjay', role: 'Owner' },
    manager: { name: 'Sundaresan', role: 'Manager', phone: { display: '+91 93840 31361', tel: '+919384031361' } },
  },
  /** Used as <lastmod> in sitemap.xml – bump it when you make a meaningful content change. */
  contentUpdated: '2026-09-21',
  developer: { name: 'Upfinity', url: 'https://upfinityteam.netlify.app/' },
} as const;

export const absoluteUrl = (path = '/'): string => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`);

export const hasAddress = SITE.address.locality !== '';
