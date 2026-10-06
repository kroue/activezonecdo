/**
 * JSON-LD builders. Business data comes from src/config/site.ts and prices from src/data/rates.ts.
 *
 * Note: no aggregateRating on the business. Self-served review markup for local businesses is not
 * eligible for review rich results, so the Google rating is shown as visible text only.
 */
import { site } from '../config/site';
import { activationFee, plans, walkIn } from '../data/rates';
import type { FaqItem } from '../data/faq';

const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function businessSchema(origin: string) {
  const id = `${origin}/#gym`;
  const sameAs = [site.social.facebook, site.social.instagram, site.social.tiktok];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: site.name,
      alternateName: site.shortName,
      url: `${origin}/`,
      logo: `${origin}/icon-512.png`,
      sameAs,
    },
    {
      '@context': 'https://schema.org',
      '@type': ['ExerciseGym', 'HealthClub'],
      '@id': id,
      name: site.name,
      alternateName: site.shortName,
      description: site.description,
      slogan: site.tagline,
      url: `${origin}/`,
      image: `${origin}/og/home.png`,
      logo: `${origin}/icon-512.png`,
      telephone: site.phone.tel,
      priceRange: '₱₱',
      currenciesAccepted: 'PHP',
      paymentAccepted: 'Cash, Credit Card, Debit Card',
      parentOrganization: { '@id': `${origin}/#organization` },
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${site.address.floor}, ${site.address.building}, ${site.address.street}, ${site.address.barangay}`,
        addressLocality: site.address.city,
        addressRegion: site.address.province,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      hasMap: site.mapsUrl,
      areaServed: { '@type': 'City', name: 'Cagayan de Oro City' },
      openingHoursSpecification: site.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dayMap[h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
      amenityFeature: [
        'Showers',
        'Restroom',
        'Free parking lot',
        'Free street parking',
        'LGBTQ+ friendly',
        'Transgender safe space',
      ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
      sameAs,
      makesOffer: [
        ...plans.flatMap((p) =>
          (['regular', 'student'] as const).map((rate) => ({
            '@type': 'Offer',
            name: `${p.name} (${rate === 'regular' ? 'Regular' : 'Student'}, 4 weeks)`,
            description: p.summary,
            price: p.price[rate],
            priceCurrency: 'PHP',
            url: `${origin}/memberships/`,
            availability: 'https://schema.org/InStock',
          })),
        ),
        {
          '@type': 'Offer',
          name: 'Walk-in gym use (1 day)',
          price: walkIn.price,
          priceCurrency: 'PHP',
          url: `${origin}/memberships/`,
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: activationFee.name,
          price: activationFee.price,
          priceCurrency: 'PHP',
          url: `${origin}/memberships/`,
        },
      ],
    },
  ];
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(origin: string, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${origin}${c.path}`,
    })),
  };
}
