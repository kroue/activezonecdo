import type { APIRoute } from 'astro';
import { site } from '../config/site';
export const prerender = true;
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: site.name,
      short_name: site.shortName,
      start_url: '/',
      display: 'standalone',
      background_color: '#0e0f0e',
      theme_color: '#0e0f0e',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
