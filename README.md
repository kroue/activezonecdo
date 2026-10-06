# ActiveZone CDO Fitness Studio website

Marketing site for **ActiveZone CDO Fitness Studio**, 3rd Floor, Guerrero Adaza Building, Rizal corner Hayes Street, Divisoria, Cagayan de Oro City.

One fast, Google-readable home for rates, classes, hours and a way to book a visit.

- **Stack:** Astro 7 (static output) + Tailwind CSS 4 + TypeScript, Preact islands, Vercel adapter
- **JavaScript:** only the membership calculator, plan finder, schedule filter and visit form are interactive islands. The open-now badge, stats count-up and gallery lightbox use tiny inline scripts. The rate toggle and gallery filter are pure CSS.
- **One server endpoint:** `POST /api/inquiry` (Book a Visit form → email via Resend)
- **Lighthouse (mobile, local test with compression):** Performance 97–99, Accessibility 100, Best Practices 100, SEO 100 (with `DEMO_MODE` off)

---

## Setup

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build (static pages + 1 serverless function in .vercel/output)
npm run check      # TypeScript + Astro diagnostics
```

Requires Node 22+.

### Deploy to Vercel

1. Import the repository in Vercel. The framework preset is detected automatically (Astro).
2. Add the environment variables below.
3. Deploy. Canonical URLs and the sitemap use `SITE_URL` if set, otherwise Vercel's production domain.

## Environment variables

Copy `.env.example` to `.env` for local development.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For live email | API key from [resend.com](https://resend.com/api-keys) |
| `INQUIRY_TO_EMAIL` | For live email | Where visit requests are delivered. Comma-separate for several. Never shown on the site. |
| `INQUIRY_FROM_EMAIL` | Recommended | Sender on a domain verified in Resend, e.g. `ActiveZone Website <website@activezonecdo.com>`. Without it, Resend's test sender is used, which only delivers to your own Resend account email. |
| `SITE_URL` | Recommended at launch | The live domain, e.g. `https://activezonecdo.com`. Used for canonical URLs, Open Graph and the sitemap. |

**Demo mode for the form:** if `RESEND_API_KEY` or `INQUIRY_TO_EMAIL` is missing, the form still validates and shows the success message, but nothing is sent (a note is logged on the server). Handy for previews.

The form also works without JavaScript (it posts normally and redirects to `/book-a-visit/thanks/`). Spam protection: a hidden honeypot field, a minimum fill time, and Astro's built-in same-origin check.

---

## Before launch: turn off DEMO_MODE

In `src/config/site.ts`:

```ts
export const DEMO_MODE = false;
```

| `DEMO_MODE` | Effect |
| --- | --- |
| `true` (current) | Every page gets `<meta name="robots" content="noindex, nofollow">` and a small "Preview by Kuro" badge. |
| `false` | Pages are indexable (`index, follow`) and the badge is gone. |

Launch checklist:

- [ ] `DEMO_MODE = false`
- [ ] `SITE_URL` set to the real domain, and the domain connected in Vercel
- [ ] Resend domain verified, `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` set; send a test inquiry
- [ ] Rates re-checked against the latest Facebook "RATES" highlight
- [ ] Stock photos replaced with ActiveZone's own (see below)
- [ ] Search the code for `TODO-confirm` and get answers from the owner
- [ ] Submit `https://<domain>/sitemap-index.xml` in Google Search Console and link the site from the Google Business Profile, Facebook and Instagram bios

---

## Where content lives

All editable content is in `src/config` and `src/data`. Pages read from these files, so you rarely need to touch a page.

| What | File |
| --- | --- |
| Business name, address, phone, socials, hours, amenities, `DEMO_MODE` | `src/config/site.ts` |
| Plans, student rates, activation fee, walk-in and class prices, promos | `src/data/rates.ts` |
| Classes (descriptions, which plan includes them) | `src/data/classes.ts` |
| Class timetable | `src/data/schedule.ts` |
| FAQ | `src/data/faq.ts` |
| Google review excerpts | `src/data/reviews.json` |
| Every photo (hero, classes, gallery) | `src/data/photos.ts` |
| Brand colors and fonts (design tokens) | `src/styles/global.css` (`@theme`) and `astro.config.mjs` (`fonts`) |

### Update rates

Edit the numbers in `src/data/rates.ts`:

```ts
price: { regular: 1740, student: 1200 },
```

Plan cards, the calculator, the plan finder, FAQ answers, page descriptions and the JSON-LD offers all update from this one file. A few page `<title>`/description strings mention the lowest prices (search for `₱1,` in `src/pages`), so update those too if the starting price changes.

### Update the schedule

Add entries to `src/data/schedule.ts`:

```ts
export const schedule: ScheduleEntry[] = [
  { classId: 'zumba', day: 2, start: '08:30' },              // Tue 8:30 AM (confirmed)
  { classId: 'zumba', day: 4, start: '08:30' },              // Thu 8:30 AM (confirmed)
  { classId: 'boxing', day: 1, start: '18:00', end: '19:00' } // example
];
```

- `day`: 0 = Sunday, 1 = Monday … 6 = Saturday
- `start` / `end`: 24-hour `HH:MM`, Manila time
- `classId`: the `id` from `src/data/classes.ts`

The Schedule page fills in automatically. Any class without an entry stays in the "Times posted on Messenger" list until it gets one. The Classes page also shows the times.

### Add or replace photos

1. Save the photo in `src/assets/photos/` (JPG or PNG, at least 1600 px wide is ideal).
2. In `src/data/photos.ts`, import it and use it as the `src` of the matching entry:

   ```ts
   import zumbaClass from '../assets/photos/zumba-class.jpg';

   zumba: {
     src: zumbaClass,
     alt: 'Members dancing in a Zumba class at ActiveZone CDO',
     width: zumbaClass.width,
     height: zumbaClass.height,
     category: 'classes',
     gallery: true,
     caption: 'Zumba',
   },
   ```

3. Write a short, specific `alt` text. Set `gallery: true` to show it on the Gallery page; `category` decides its filter (Gym, Classes, Community).

Images are converted to AVIF/WebP and resized automatically (Astro `<Image>` + Vercel Image Optimization), with explicit sizes so nothing shifts while loading. Only the hero loads eagerly; everything else is lazy.

The current photos are Unsplash stock (free for commercial use under the Unsplash License), each marked with a `SWAP` comment. ActiveZone's Facebook and Instagram have plenty of real photos to use instead.

> Note: Vercel's image optimizer only runs on Vercel. Locally (`npm run dev`) images are processed with Sharp instead.

### Logo

The AZ mark is a vector redraw of ActiveZone's logo in `src/assets/brand/az-mark.svg`. It's used for the header, footer, dividers, favicon, app icons and Open Graph images, all generated at build time. If the owner can share the original vector (AI/SVG/PDF), replace the paths in that file and keep the `viewBox`. The thin cut-out around the dumbbell is the stroke on the `<g>` group.

---

## SEO

- Unique title and meta description per page, targeting local searches ("gym in Cagayan de Oro", "gym membership rates CDO", "student gym rates Cagayan de Oro", "zumba class CDO", "boxing class Cagayan de Oro", "gym Divisoria Cagayan de Oro", and more)
- Dedicated indexable pages: `/memberships/`, `/classes/`, `/schedule/`, `/contact/`, plus `/faq/`, `/about/`, `/gallery/`, `/book-a-visit/`
- JSON-LD on every page: `Organization` and `ExerciseGym`/`HealthClub` (address, geo, opening hours, phone, `priceRange`, `sameAs`, offers for both plans and the walk-in rate). Also `BreadcrumbList` on inner pages and `FAQPage` on FAQ and Memberships.
- No `aggregateRating` in the markup on purpose: self-served review markup isn't eligible for local businesses. The 5.0 Google rating is shown as visible text.
- Generated Open Graph/Twitter cards per page (`/og/*.png`), `sitemap-index.xml`, `robots.txt`, canonical URLs, `lang="en-PH"`, one `<h1>` per page

## Accessibility

- WCAG AA contrast: neon green is only used on dark surfaces. Green text on light sections uses `#15792B` (5.1:1).
- Visible focus rings everywhere, skip link, keyboard-friendly menu, form errors announced and linked to fields
- `prefers-reduced-motion` turns off fades, count-ups and smooth scrolling
- No horizontal scroll at 360 px, sticky mobile action bar (Rates, Book a Visit, Call, Messenger)

## Project structure

```
src/
  assets/        brand mark, peso glyph font, (your photos)
  components/    Astro components (header, footer, cards, photo, badges…)
  config/        site.ts: business details + DEMO_MODE
  data/          rates, classes, schedule, faq, reviews, photos
  islands/       Preact islands: calculator, plan finder, schedule filter, visit form
  layouts/       BaseLayout (SEO, JSON-LD, fonts)
  lib/           hours (open-now logic), schema (JSON-LD), inquiry validation, brand images
  pages/         routes, /api/inquiry, /og/*.png, favicons, robots.txt, manifest
```
