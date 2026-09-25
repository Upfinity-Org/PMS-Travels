import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { HeadCollectorContext } from './seo/Seo';
import { serializeHead, type HeadData, type SeoInput } from './seo/head';
export { staticPaths } from './routes';
export { SITE } from './config/site';
import { routes } from './routes';

/**
 * Renders one URL to a static HTML string plus its <head> tags, for scripts/prerender.mjs.
 * Data routers need a Request, so a bare `new Request('http://ssr'+path)` stands in for one at build time.
 */
export async function render(path: string): Promise<{ html: string; head: string }> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`http://ssr.local${path}`));
  if (context instanceof Response) throw context;

  const router = createStaticRouter(handler.dataRoutes, context);
  let captured: { head: HeadData; input: SeoInput } | null = null;

  const html = renderToString(
    <StrictMode>
      <HeadCollectorContext.Provider value={(head, input) => { captured = { head, input }; }}>
        <StaticRouterProvider router={router} context={context} />
      </HeadCollectorContext.Provider>
    </StrictMode>,
  );

  if (!captured) throw new Error(`No <Seo> rendered for ${path} — every routed page must render one.`);
  return { html, head: serializeHead((captured as { head: HeadData }).head) };
}
