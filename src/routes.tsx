import type { RouteObject } from 'react-router';
import { Layout } from './components/Layout';
import { fleet } from './content/fleet';
import { services } from './content/services';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Fleet } from './pages/Fleet';
import { FleetDetail } from './pages/FleetDetail';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Pricing } from './pages/Pricing';
import { Privacy } from './pages/Privacy';
import { ServiceDetail } from './pages/ServiceDetail';
import { Services } from './pages/Services';

/**
 * Route tree shared by the browser app (src/App.tsx) and the SSR/prerender entry (src/entry-server.tsx).
 * Pages are imported eagerly (not React.lazy/route.lazy): this is a small marketing site, and eager
 * imports keep client hydration perfectly synchronous with the prerendered HTML — route-level lazy
 * loading here caused a hydration mismatch (the router briefly has no matched route while the chunk
 * loads, so React mounts a second copy of the page instead of reusing the server-rendered markup).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'fleet', Component: Fleet },
      { path: 'fleet/:slug', Component: FleetDetail },
      { path: 'services', Component: Services },
      { path: 'services/:slug', Component: ServiceDetail },
      { path: 'pricing', Component: Pricing },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'privacy-policy', Component: Privacy },
      { path: '*', Component: NotFound },
    ],
  },
];

/** Every concrete URL the site has. Used by scripts/prerender.mjs and to build sitemap.xml. */
export function staticPaths(): string[] {
  return [
    '/',
    '/fleet',
    ...fleet.map((c) => `/fleet/${c.slug}`),
    '/services',
    ...services.map((s) => `/services/${s.slug}`),
    '/pricing',
    '/about',
    '/contact',
    '/privacy-policy',
  ];
}
