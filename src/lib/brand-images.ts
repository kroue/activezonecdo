/**
 * Build-time brand image generation: favicons, app icons and Open Graph cards.
 * Runs only during `astro build` (all endpoints using it are prerendered).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import markSvg from '../assets/brand/az-mark.svg?raw';
import { site } from '../config/site';

const NIGHT = '#0e0f0e';
const NEON = '#3fe03f';

const markInner = markSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const markViewBox = { x: 40, y: 170, w: 670, h: 450 };

/** Square icon: AZ mark centered on a near-black rounded tile. */
export function iconSvg({ rounded = true, padding = 0.14 } = {}) {
  const size = 512;
  const inner = size * (1 - padding * 2);
  const scale = inner / markViewBox.w;
  const h = markViewBox.h * scale;
  const tx = size * padding - markViewBox.x * scale;
  const ty = (size - h) / 2 - markViewBox.y * scale;
  // The dumbbell's black outline must match the tile so it reads as a cut-out.
  const mark = markInner.replace(/stroke="#000"/g, `stroke="${NIGHT}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rounded ? 96 : 0}" fill="${NIGHT}"/>
  <g transform="translate(${tx} ${ty}) scale(${scale})" fill="${NEON}">${mark}</g>
</svg>`;
}

export function svgToPng(svg: string, width: number) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

/** Wraps PNG images in an .ico container (PNG-compressed entries, supported by all modern browsers). */
export function pngsToIco(images: { size: number; png: Buffer | Uint8Array }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + images.length * 16;
  for (const { size, png } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => Buffer.from(i.png))]);
}

const root = process.cwd();
const readFont = (rel: string) => fs.readFileSync(path.join(root, rel));
let fontsCache: Parameters<typeof satori>[1]['fonts'] | undefined;
function ogFonts() {
  fontsCache ??= [
    { name: 'Barlow Condensed', weight: 800, style: 'normal', data: readFont('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff') },
    { name: 'Barlow Condensed', weight: 600, style: 'normal', data: readFont('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff') },
    { name: 'AZ Peso', weight: 700, style: 'normal', data: readFont('src/assets/fonts/az-peso-700.woff') },
  ];
  return fontsCache;
}

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

/** 1200×630 Open Graph card in brand style. */
export async function ogPng({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const markDataUri = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 170 670 450" fill="${NEON}">${markInner}</svg>`,
  ).toString('base64')}`;

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      backgroundColor: NIGHT,
      backgroundImage: `radial-gradient(circle at 92% 8%, rgba(63,224,63,0.28), rgba(14,15,14,0) 45%)`,
      color: '#fff',
      fontFamily: 'AZ Peso, Barlow Condensed',
      position: 'relative',
    },
    [
      // Diagonal neon band
      h('div', {
        position: 'absolute',
        right: -120,
        bottom: 90,
        width: 760,
        height: 10,
        backgroundColor: NEON,
        transform: 'rotate(-14deg)',
      }),
      h('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
        h('img', { width: 112, height: 75 }, undefined, { src: markDataUri }),
        h('div', { display: 'flex', flexDirection: 'column' }, [
          h('div', { display: 'flex', fontSize: 44, fontWeight: 800, letterSpacing: 1, lineHeight: 1 }, [
            h('span', {}, 'ACTIVE'),
            h('span', { color: NEON }, 'ZONE'),
          ]),
          h('div', { fontSize: 20, fontWeight: 600, letterSpacing: 6, color: '#a3a8a2', marginTop: 6 }, 'CDO FITNESS STUDIO'),
        ]),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', maxWidth: 980 }, [
        h('div', { fontSize: 28, fontWeight: 600, letterSpacing: 5, color: NEON, textTransform: 'uppercase' }, eyebrow),
        h('div', { fontSize: 92, fontWeight: 800, lineHeight: 0.95, textTransform: 'uppercase', marginTop: 14 }, title),
        h('div', { fontSize: 34, fontWeight: 600, color: '#c9cdc8', marginTop: 22 }, subtitle),
      ]),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 600, color: '#c9cdc8' }, [
        h('span', {}, '3rd Floor, Guerrero Adaza Bldg · Divisoria, CDO'),
        h('span', { color: NEON }, site.phone.display),
      ]),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: ogFonts() });
  return svgToPng(svg, 1200);
}
