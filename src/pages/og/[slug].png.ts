import type { APIRoute, GetStaticPaths } from 'astro';
import { ogPng } from '../../lib/brand-images';
import { getPlan, peso, walkIn } from '../../data/rates';

export const prerender = true;

const basic = getPlan('basic');

/** One Open Graph card per page. Slugs are referenced by each page's `ogImage` prop. */
const cards = {
  home: { eyebrow: 'Gym in Divisoria, Cagayan de Oro', title: 'Your gym in Divisoria. No experience needed.', subtitle: 'Classes, coaching and a clean, welcoming space.' },
  memberships: { eyebrow: 'Membership rates', title: `Plans from ${peso(basic.price.regular)}`, subtitle: `Student rate ${peso(basic.price.student)} · Walk-in ${peso(walkIn.price)}/day` },
  classes: { eyebrow: 'Classes & coaching', title: 'Zumba, Boxing, HIIT and more', subtitle: 'Beginner-friendly group classes in CDO.' },
  schedule: { eyebrow: 'Class schedule', title: 'Gym hours & class times', subtitle: 'Mon–Sat 6 AM–10 PM · Sun 1 PM–9 PM' },
  visit: { eyebrow: 'Book a visit', title: 'Come see the space', subtitle: 'New to the gym? Dali ra mag-start!' },
  gallery: { eyebrow: 'Gallery', title: 'Inside ActiveZone', subtitle: 'The gym floor, classes and community.' },
  about: { eyebrow: 'About us', title: 'What makes AZ home?', subtitle: 'A modern fitness studio in Divisoria, CDO.' },
  contact: { eyebrow: 'Location & contact', title: 'Find us in Divisoria', subtitle: 'Rizal corner Hayes Street, Cagayan de Oro City' },
  faq: { eyebrow: 'FAQ', title: 'Questions? We’ve got answers.', subtitle: 'Rates, student plans, walk-ins and more.' },
} as const;

export const getStaticPaths = (() => Object.keys(cards).map((slug) => ({ params: { slug } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const card = cards[params.slug as keyof typeof cards];
  const png = await ogPng(card);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
