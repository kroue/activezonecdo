// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

/**
 * Canonical URLs, the sitemap and Open Graph tags all use this origin.
 * 1. SITE_URL env var (set this to the real domain once it is connected, e.g. https://activezonecdo.com)
 * 2. Vercel's production domain, exposed automatically at build time
 * 3. A local fallback for development
 */
const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://activezonecdo.vercel.app');

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  adapter: vercel({
    // Vercel Image Optimization serves AVIF/WebP at the right size in production.
    imageService: true,
    imagesConfig: {
      sizes: [360, 480, 640, 768, 960, 1280, 1600, 1920],
      formats: ['image/avif', 'image/webp'],
      domains: ['images.unsplash.com'],
    },
  }),
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes('/book-a-visit/thanks') && !page.includes('/404'),
    }),
  ],
  image: {
    // Stock photos are served from Unsplash until the owner's own photos are added (see src/data/photos.ts).
    domains: ['images.unsplash.com'],
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow',
      fallbacks: ['Arial Narrow', 'sans-serif'],
      options: {
        variants: [
          { weight: 600, style: 'normal', src: ['@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2'] },
          { weight: 700, style: 'normal', src: ['@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2'] },
          { weight: 800, style: 'normal', src: ['@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2'] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          { weight: '100 900', style: 'normal', src: ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'] },
        ],
      },
    },
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      INQUIRY_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      INQUIRY_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
