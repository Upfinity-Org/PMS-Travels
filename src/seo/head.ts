import { SITE, absoluteUrl } from '../config/site';

export type PreloadImage = { href: string; srcSet: string; sizes: string };

export type SeoInput = {
  /** Page-specific title. The brand name is appended unless `absoluteTitle` is set. */
  title: string;
  description: string;
  /** Path of the page, e.g. "/fleet/sedans". Used for the canonical URL. */
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
  ogImage?: string;
  ogType?: 'website' | 'article';
  jsonLd?: object[];
  preload?: PreloadImage;
};

export type HeadTag = {
  tag: 'meta' | 'link' | 'script';
  /** Stable id used to update tags in place when navigating client-side. */
  key: string;
  attrs: Record<string, string>;
  text?: string;
};

export type HeadData = { title: string; tags: HeadTag[] };

const DEFAULT_OG_IMAGE = '/og-image.png';

export function buildHead(input: SeoInput): HeadData {
  const title = input.absoluteTitle ? input.title : `${input.title} | ${SITE.shortName}`;
  const canonical = absoluteUrl(input.path);
  const image = `${SITE.url}${input.ogImage ?? DEFAULT_OG_IMAGE}`;
  const robots = input.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const tags: HeadTag[] = [
    { tag: 'meta', key: 'description', attrs: { name: 'description', content: input.description } },
    { tag: 'meta', key: 'robots', attrs: { name: 'robots', content: robots } },
    { tag: 'link', key: 'canonical', attrs: { rel: 'canonical', href: canonical } },
    { tag: 'meta', key: 'og:type', attrs: { property: 'og:type', content: input.ogType ?? 'website' } },
    { tag: 'meta', key: 'og:site_name', attrs: { property: 'og:site_name', content: SITE.name } },
    { tag: 'meta', key: 'og:locale', attrs: { property: 'og:locale', content: 'en_IN' } },
    { tag: 'meta', key: 'og:title', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', key: 'og:description', attrs: { property: 'og:description', content: input.description } },
    { tag: 'meta', key: 'og:url', attrs: { property: 'og:url', content: canonical } },
    { tag: 'meta', key: 'og:image', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', key: 'og:image:width', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', key: 'og:image:height', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', key: 'og:image:alt', attrs: { property: 'og:image:alt', content: `${SITE.name}: car rentals with driver` } },
    { tag: 'meta', key: 'twitter:card', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', key: 'twitter:title', attrs: { name: 'twitter:title', content: title } },
    { tag: 'meta', key: 'twitter:description', attrs: { name: 'twitter:description', content: input.description } },
    { tag: 'meta', key: 'twitter:image', attrs: { name: 'twitter:image', content: image } },
  ];

  if (input.preload) {
    tags.push({
      tag: 'link',
      key: 'preload-image',
      attrs: {
        rel: 'preload',
        as: 'image',
        href: input.preload.href,
        imagesrcset: input.preload.srcSet,
        imagesizes: input.preload.sizes,
        fetchpriority: 'high',
      },
    });
  }

  (input.jsonLd ?? []).forEach((data, i) => {
    tags.push({
      tag: 'script',
      key: `ld-${i}`,
      attrs: { type: 'application/ld+json' },
      // "<" is escaped so the JSON can never close its own <script> element
      text: JSON.stringify(data).replace(/</g, '\\u003c'),
    });
  });

  return { title, tags };
}

const escapeAttr = (v: string): string =>
  v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escapeText = (v: string): string => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Server side: turn head data into HTML for the prerendered document. */
export function serializeHead(head: HeadData): string {
  const lines = [`<title>${escapeText(head.title)}</title>`];
  for (const t of head.tags) {
    const attrs = Object.entries(t.attrs)
      .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
      .join(' ');
    lines.push(
      t.tag === 'script'
        ? `<script ${attrs} data-seo="${t.key}">${t.text ?? ''}</script>`
        : `<${t.tag} ${attrs} data-seo="${t.key}" />`,
    );
  }
  return lines.join('\n    ');
}

/** Client side: apply head data to the live document (used on client-side navigation). */
export function applyHead(head: HeadData): void {
  document.title = head.title;
  const wanted = new Set(head.tags.map((t) => t.key));

  document.head.querySelectorAll('[data-seo]').forEach((el) => {
    if (!wanted.has(el.getAttribute('data-seo') ?? '')) el.remove();
  });

  for (const t of head.tags) {
    let el = document.head.querySelector<HTMLElement>(`[data-seo="${t.key}"]`);
    if (!el) {
      el = document.createElement(t.tag);
      el.setAttribute('data-seo', t.key);
      document.head.appendChild(el);
    }
    for (const [k, v] of Object.entries(t.attrs)) {
      if (el.getAttribute(k) !== v) el.setAttribute(k, v);
    }
    if (t.tag === 'script' && el.textContent !== (t.text ?? '')) el.textContent = t.text ?? '';
  }
}
