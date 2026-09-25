#!/usr/bin/env node
/**
 * Static-site generation step: renders every route in src/routes.tsx to real HTML
 * (so Googlebot, and anyone with JS disabled, gets full content immediately), then
 * writes robots.txt and sitemap.xml. Runs after `vite build` and the SSR build
 * (see package.json > scripts.build). React re-hydrates each page on the client.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadDotenv } from 'dotenv';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Standalone Node script (not run through Vite), so .env isn't loaded automatically like it is
// for `vite build` — load it here too, so VITE_SITE_URL etc. are consistent across both steps.
loadDotenv({ path: path.join(root, '.env'), quiet: true });
const clientDir = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const siteUrl = (process.env.VITE_SITE_URL || 'http://localhost:8443').replace(/\/+$/, '');

async function main() {
  const templatePath = path.join(clientDir, 'index.html');
  if (!existsSync(templatePath)) throw new Error(`Client build not found at ${templatePath}. Run "vite build" first.`);
  const template = await readFile(templatePath, 'utf8');

  const ssrEntryPath = path.join(ssrDir, 'entry-server.js');
  if (!existsSync(ssrEntryPath)) {
    throw new Error(`SSR build not found at ${ssrEntryPath}. Run "vite build --ssr src/entry-server.tsx --outDir dist-ssr" first.`);
  }
  const { render, staticPaths, SITE } = await import(`file://${ssrEntryPath}`);
  const urlPaths = staticPaths();

  for (const urlPath of urlPaths) {
    const { html, head } = await render(urlPath);
    const page = template.replace('<!--app-html-->', html).replace('<!--app-head-->', head);
    const outDir = urlPath === '/' ? clientDir : path.join(clientDir, urlPath.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), page, 'utf8');
    console.log('prerendered', urlPath);
  }

  // A top-level 404.html so static hosts (Netlify, Vercel, GitHub Pages, S3+CloudFront, etc.)
  // can serve a real "page not found" experience instead of a raw 404 or the homepage.
  const notFound = await render('/__not_found__');
  await writeFile(
    path.join(clientDir, '404.html'),
    template.replace('<!--app-html-->', notFound.html).replace('<!--app-head-->', notFound.head),
    'utf8',
  );
  console.log('prerendered /404.html');

  await writeFile(path.join(clientDir, 'robots.txt'), buildRobotsTxt(), 'utf8');
  await writeFile(path.join(clientDir, 'sitemap.xml'), buildSitemap(urlPaths, SITE.contentUpdated), 'utf8');
  console.log('wrote robots.txt and sitemap.xml for', urlPaths.length, 'pages');

  // The SSR-only build artifacts have no use once every page is prerendered.
  await rm(ssrDir, { recursive: true, force: true });
}

function buildRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function buildSitemap(urlPaths, contentUpdated) {
  const lastmod = contentUpdated || new Date().toISOString().slice(0, 10);
  const urls = urlPaths
    .map((p) => {
      const loc = p === '/' ? `${siteUrl}/` : `${siteUrl}${p}`;
      const depth = p.split('/').filter(Boolean).length;
      const priority = p === '/' ? '1.0' : depth > 1 ? '0.6' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
