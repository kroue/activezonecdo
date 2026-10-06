import type { APIRoute } from 'astro';
import { iconSvg } from '../lib/brand-images';
export const prerender = true;
export const GET: APIRoute = () => new Response(iconSvg({ padding: 0.1 }), { headers: { 'Content-Type': 'image/svg+xml' } });
