/**
 * Membership rates, session prices and promos.
 *
 * Source: ActiveZone Facebook highlight 'RATES'. Re-verify before launch.
 *
 * To change a price, edit the number here. Every page, the calculator, the plan finder,
 * the FAQ answers and the JSON-LD offers read from this file.
 */

export type PlanId = 'basic' | 'premium';
export type RateType = 'regular' | 'student';

export interface Plan {
  id: PlanId;
  name: string;
  /** One-line positioning under the plan name. */
  summary: string;
  /** Price per 4 weeks, in pesos. */
  price: Record<RateType, number>;
  period: string;
  includes: string[];
  /** Classes included with the plan, by class id from src/data/classes.ts. */
  classIds: string[];
  /** Classes the member picks one of (Premium only). */
  pickOneClassIds?: string[];
  highlight?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    summary: 'Self-paced training with coach guidance.',
    price: { regular: 1740, student: 1200 },
    period: '4 weeks',
    includes: [
      'Gym equipment and facilities access',
      'Free basic coaching sessions',
      'Free fitness assessment',
      'HIIT classes: Abs Workout, AZ Pulse, Legs Workout, Meta Pro, HIIT',
    ],
    classIds: ['abs-workout', 'az-pulse', 'legs-workout', 'meta-pro', 'hiit'],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    summary: 'Best for busy professionals who want guided training plus classes.',
    price: { regular: 2340, student: 1650 },
    period: '4 weeks',
    includes: [
      'Everything in Basic',
      '1 group class of your choice: Zumba, Boxing or Strong Nation',
    ],
    classIds: ['abs-workout', 'az-pulse', 'legs-workout', 'meta-pro', 'hiit'],
    pickOneClassIds: ['zumba', 'boxing', 'strong-nation'],
    highlight: true,
  },
];

export const activationFee = {
  name: 'One-time Activation Fee',
  price: 800,
  includes: ['Account setup', 'Fitness assessment', 'Program orientation', 'Access to member promos'],
};

/** Pay-per-visit prices. No membership needed. */
export const sessions = [
  { id: 'walk-in', name: 'Walk-in gym use', price: 200, unit: 'day' },
  { id: 'zumba', name: 'Zumba', price: 120, unit: 'session' },
  { id: 'strong-nation', name: 'Strong Nation', price: 120, unit: 'session' },
  { id: 'boxing', name: 'Boxing', price: 300, unit: 'session' },
] as const;

/**
 * Member promos, names only.
 * TODO-confirm: mechanics, prices and validity for each promo. Do not publish discounts until the owner confirms.
 */
export const promos = [
  'Weekly Plans',
  '3+1 Promo',
  'HIIT Class',
  'Birthday Promo',
  'Bring-A-Friend',
  // TODO-confirm: PT Package price and number of sessions.
  'PT Package',
];

/** Calculator limits: number of 4-week periods a visitor can pick. */
export const calculatorPeriods = { min: 1, max: 6 } as const;

export const ratesDisclaimer =
  'Rates shown are the latest posted by ActiveZone and may change. Please confirm at the front desk.';

export const peso = (amount: number) => `₱${amount.toLocaleString('en-PH')}`;

export const getPlan = (id: PlanId) => plans.find((p) => p.id === id)!;
export const walkIn = sessions.find((s) => s.id === 'walk-in')!;
