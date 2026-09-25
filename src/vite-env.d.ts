/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public origin of the site, e.g. https://www.example.com (no trailing slash). Required for production builds. */
  readonly VITE_SITE_URL?: string;
  /** Optional public e-mail address shown on the Contact page and in structured data. */
  readonly VITE_PUBLIC_EMAIL?: string;
  /** Token from Google Search Console -> HTML tag verification (only the content="..." value). */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
