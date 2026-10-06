import type { APIRoute } from 'astro';
export const prerender = true;
// Pages carry their own noindex while DEMO_MODE is on, so crawlers are allowed in to see it.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
