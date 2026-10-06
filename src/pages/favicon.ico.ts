import type { APIRoute } from 'astro';
import { iconSvg, pngsToIco, svgToPng } from '../lib/brand-images';
export const prerender = true;
export const GET: APIRoute = () => {
  const svg = iconSvg({ padding: 0.08 });
  const ico = pngsToIco([16, 32, 48].map((size) => ({ size, png: svgToPng(svg, size) })));
  return new Response(new Uint8Array(ico), { headers: { 'Content-Type': 'image/x-icon' } });
};
