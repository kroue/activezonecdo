/**
 * FAQ content. Rendered on /faq/ and as FAQPage JSON-LD.
 * Prices come from rates.ts so they never drift.
 *
 * `confirmed: true` means the answer is backed by ActiveZone's own rates graphic, posts or Google profile.
 * Unconfirmed answers use neutral wording and carry a TODO-confirm note for the owner.
 */
import { activationFee, getPlan, peso, sessions, walkIn } from './rates';
import { site } from '../config/site';

export interface FaqItem {
  q: string;
  a: string;
  confirmed: boolean;
  category: 'Rates' | 'Getting started' | 'Facilities' | 'Classes';
}

const basic = getPlan('basic');
const premium = getPlan('premium');
const zumba = sessions.find((s) => s.id === 'zumba')!;
const strong = sessions.find((s) => s.id === 'strong-nation')!;
const boxing = sessions.find((s) => s.id === 'boxing')!;

export const faq: FaqItem[] = [
  {
    category: 'Rates',
    q: 'How much is a membership at ActiveZone CDO?',
    a: `The Basic Plan is ${peso(basic.price.regular)} and the Premium Plan is ${peso(premium.price.regular)} per 4 weeks at the regular rate. Basic covers gym access, free basic coaching, a free fitness assessment and our HIIT classes. Premium adds 1 group class: Zumba, Boxing or Strong Nation.`,
    confirmed: true,
  },
  {
    category: 'Rates',
    q: 'Is there a student rate?',
    a: `Yes. Students pay ${peso(basic.price.student)} for Basic and ${peso(premium.price.student)} for Premium, per 4 weeks. We’ll tell you what to bring to verify your student status when you sign up.`,
    // TODO-confirm: what proof of enrollment the front desk accepts (school ID, registration form, age limit).
    confirmed: true,
  },
  {
    category: 'Rates',
    q: 'What is the activation fee and what does it cover?',
    a: `It is a one-time ${peso(activationFee.price)} fee when you first join. It covers your account setup, a fitness assessment, a program orientation and access to member promos.`,
    confirmed: true,
  },
  {
    category: 'Rates',
    q: 'Can I just walk in for a day?',
    a: `Yes. Walk-in gym use is ${peso(walkIn.price)} for the day, no membership needed. Single classes are ${peso(zumba.price)} for Zumba, ${peso(strong.price)} for Strong Nation and ${peso(boxing.price)} for Boxing.`,
    confirmed: true,
  },
  {
    category: 'Getting started',
    q: 'I’ve never been to a gym. Is that okay?',
    a: 'Absolutely. Wala pa kay gym experience? That’s completely okay. Every membership includes a free fitness assessment and free basic coaching sessions, so a coach will show you the equipment and help you start at your level. Our members describe us as beginner-friendly and non-judgmental.',
    confirmed: true,
  },
  {
    category: 'Classes',
    q: 'Which classes are included in each plan?',
    a: 'Basic includes our HIIT classes: Abs Workout, AZ Pulse, Legs Workout, Meta Pro and HIIT. Premium includes everything in Basic plus 1 group class of your choice: Zumba, Boxing or Strong Nation.',
    confirmed: true,
  },
  {
    category: 'Facilities',
    q: 'Do you have showers and parking?',
    a: 'Yes. We have showers and restrooms, plus a free parking lot and free street parking nearby.',
    confirmed: true,
  },
  {
    category: 'Facilities',
    q: 'Can I pay by card?',
    a: 'Yes, we accept credit and debit cards.',
    // TODO-confirm: GCash / Maya / bank transfer, if the owner wants them listed.
    confirmed: true,
  },
  {
    category: 'Facilities',
    q: 'Where exactly are you and when are you open?',
    a: `We’re on the ${site.directionsNote}, Cagayan de Oro City. Open Monday to Saturday, 6:00 AM to 10:00 PM, and Sunday, 1:00 PM to 9:00 PM.`,
    confirmed: true,
  },
  {
    category: 'Getting started',
    q: 'Is there a free trial?',
    // TODO-confirm: whether the owner wants to offer a trial day. Free passes so far were anniversary giveaway prizes only.
    a: `We don’t have a trial offer posted right now. Book a visit and we’ll show you around. If you want to try a workout first, walk-in gym use is ${peso(walkIn.price)} for the day.`,
    confirmed: false,
  },
  {
    category: 'Rates',
    q: 'Can I freeze my membership?',
    // TODO-confirm: freeze policy (allowed? how long? fee?). Do not publish terms until confirmed.
    a: 'Message us and we’ll go over the options for your situation. We’ll confirm the details with you directly.',
    confirmed: false,
  },
  {
    category: 'Classes',
    q: 'Do you have personal training?',
    // TODO-confirm: PT Package price, number of sessions and validity.
    a: 'Yes. A PT Package is available as one of our member promos. Ask us for the current rate and session details.',
    confirmed: false,
  },
];
