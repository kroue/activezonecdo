/**
 * Single source of truth for ActiveZone CDO business details.
 * Everything on the site (header, footer, contact page, JSON-LD, open-now badge) reads from here.
 */

/**
 * DEMO_MODE
 * true  → every page gets `noindex, nofollow` and a small "Preview by Kuro" badge.
 * false → the site is indexable and the badge disappears. Flip this before launch.
 */
export const DEMO_MODE = true;

export const site = {
  name: 'ActiveZone CDO Fitness Studio',
  shortName: 'ActiveZone CDO',
  tagline: 'Fitness coaching, classes and community in Divisoria',
  description:
    'ActiveZone CDO is a beginner-friendly gym and group-class fitness studio in Divisoria, Cagayan de Oro City. Classes, coaching and a clean, welcoming space.',
  locale: 'en-PH',
  ogLocale: 'en_PH',

  address: {
    floor: '3rd Floor',
    building: 'Guerrero Adaza Building',
    // Listed as "G&P Adaza Building" on Google Maps.
    buildingAlt: 'G&P Adaza Building',
    street: 'Rizal corner Hayes Street',
    barangay: 'Barangay 4 (Pob.)',
    district: 'Divisoria',
    city: 'Cagayan de Oro City',
    postalCode: '9000',
    province: 'Misamis Oriental',
    country: 'PH',
  },
  directionsNote: '3rd Floor, Guerrero Adaza Building, Rizal corner Hayes Street, Divisoria',
  geo: { lat: 8.4764439, lng: 124.642668 },

  phone: {
    display: '0926 755 6237',
    tel: '+639267556237',
  },
  // No public email. Form inquiries go to the INQUIRY_TO_EMAIL env var and are never shown on the page.

  social: {
    facebook: 'https://www.facebook.com/activezonecdo',
    instagram: 'https://www.instagram.com/activezonecdo/',
    // TODO-confirm: TikTok handle is activezone.ph. Confirm the exact profile URL with the owner.
    tiktok: 'https://www.tiktok.com/@activezone.ph',
    tiktokHandle: '@activezone.ph',
    messenger: 'https://m.me/activezonecdo',
  },

  /**
   * Opening hours. day: 0 = Sunday … 6 = Saturday. 24h "HH:MM", Asia/Manila time.
   * Used by the open-now badge, the hours tables and openingHoursSpecification JSON-LD.
   */
  timezone: 'Asia/Manila',
  hours: [
    { day: 1, open: '06:00', close: '22:00' },
    { day: 2, open: '06:00', close: '22:00' },
    { day: 3, open: '06:00', close: '22:00' },
    { day: 4, open: '06:00', close: '22:00' },
    { day: 5, open: '06:00', close: '22:00' },
    { day: 6, open: '06:00', close: '22:00' },
    { day: 0, open: '13:00', close: '21:00' },
  ],
  hoursSummary: [
    { label: 'Monday to Saturday', short: 'Mon–Sat', time: '6:00 AM – 10:00 PM' },
    { label: 'Sunday', short: 'Sun', time: '1:00 PM – 9:00 PM' },
  ],

  // From their Google Business Profile.
  amenities: {
    showers: true,
    restroom: true,
    freeParkingLot: true,
    freeStreetParking: true,
    cardsAccepted: true,
    onlineClasses: true,
    lgbtqFriendly: true,
    transgenderSafeSpace: true,
  },

  // From their Facebook page intro.
  servicesLine: ['Fitness Coaching', 'Zumba', 'Boxing', 'Strong Nation', 'Meta Pro', 'Bootcamp', 'Abs Workout'],

  ratings: {
    google: { score: '5.0', count: 21, label: 'on Google' },
    facebook: { percent: 100, count: 46, label: 'recommend on Facebook' },
  },

  // Anniversary campaign, from their own post (#ActiveZoneCDOTurns1).
  // TODO-confirm: exact opening date with the owner. First anniversary is June 2026.
  firstAnniversary: 'June 2026',

  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=ActiveZone+CDO+Fitness+Studio%2C+Divisoria%2C+Cagayan+de+Oro',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=8.4764439,124.642668',
  mapEmbedUrl: 'https://www.google.com/maps?q=8.4764439,124.642668&z=17&output=embed',

  credit: { name: 'Kuro', label: 'Preview by Kuro' },
} as const;

export const fullAddress = `${site.address.floor}, ${site.address.building}, ${site.address.street}, ${site.address.barangay}, ${site.address.district}, ${site.address.city} ${site.address.postalCode}, ${site.address.province}`;

export const nav = [
  { href: '/memberships/', label: 'Rates' },
  { href: '/classes/', label: 'Classes' },
  { href: '/schedule/', label: 'Schedule' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/faq/', label: 'FAQ' },
] as const;
