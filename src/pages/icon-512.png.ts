import type { APIRoute } from 'astro';
import { iconSvg, svgToPng } from '../lib/brand-images';
export const prerender = true;
export const GET: APIRoute = () =>
  new Response(new Uint8Array(svgToPng(iconSvg({ rounded: false, padding: 0.16 }), 512)), { headers: { 'Content-Type': 'image/png' } });
