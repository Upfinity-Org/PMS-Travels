import { createContext, useContext, useEffect } from 'react';
import { applyHead, buildHead, type HeadData, type SeoInput } from './head';

/** During prerendering the server entry provides a collector so it can read each page's head data. */
export const HeadCollectorContext = createContext<((head: HeadData, input: SeoInput) => void) | null>(null);

/**
 * Declares the <title>, meta tags, canonical URL and JSON-LD for a page.
 * - At build time the data is captured and written into the static HTML (what Googlebot sees first).
 * - In the browser it keeps the head in sync when visitors navigate between pages.
 */
export function Seo(props: SeoInput) {
  const collect = useContext(HeadCollectorContext);
  const head = buildHead(props);
  collect?.(head, props);

  const signature = JSON.stringify(head);
  useEffect(() => {
    applyHead(JSON.parse(signature) as HeadData);
  }, [signature]);

  return null;
}
