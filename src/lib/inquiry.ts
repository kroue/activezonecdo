/**
 * "Book a Visit" form definition and validation. Shared by the form island (client)
 * and /api/inquiry (server) so the rules can never drift apart.
 */
export const interestOptions = [
  { value: 'basic', label: 'Basic Plan' },
  { value: 'premium', label: 'Premium Plan' },
  { value: 'class', label: 'A class' },
  { value: 'visit', label: 'Just visiting' },
] as const;

export const rateOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'student', label: 'Student' },
] as const;

export const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const timeOptions = [
  { value: 'morning', label: 'Morning (6 – 11 AM)' },
  { value: 'midday', label: 'Midday (11 AM – 2 PM)' },
  { value: 'afternoon', label: 'Afternoon (2 – 5 PM)' },
  { value: 'evening', label: 'Evening (5 – 10 PM)' },
] as const;

export const sourceOptions = ['Facebook', 'Instagram', 'TikTok', 'Google', 'Friend or family', 'Walked by', 'Other'] as const;

export interface Inquiry {
  name: string;
  mobile: string;
  email: string;
  interest: string;
  className: string;
  rate: string;
  day: string;
  time: string;
  isNew: boolean;
  notes: string;
  source: string;
  consent: boolean;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

/** Accepts 09XXXXXXXXX, +639XXXXXXXXX or 639XXXXXXXXX with spaces/dashes; returns 09XXXXXXXXX or null. */
export function normalizePhMobile(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '');
  const m = digits.match(/^(?:\+?63|0)(9\d{9})$/);
  return m ? `0${m[1]}` : null;
}

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bool = (v: unknown) => v === true || v === 'on' || v === 'true' || v === '1';

export function parseInquiry(raw: Record<string, unknown>): { data: Inquiry; errors: InquiryErrors } {
  const data: Inquiry = {
    name: str(raw.name, 100),
    mobile: str(raw.mobile, 30),
    email: str(raw.email, 120),
    interest: str(raw.interest, 20),
    className: str(raw.className, 50),
    rate: str(raw.rate, 20),
    day: str(raw.day, 20),
    time: str(raw.time, 20),
    isNew: bool(raw.isNew),
    notes: str(raw.notes, 1500),
    source: str(raw.source, 40),
    consent: bool(raw.consent),
  };
  const errors: InquiryErrors = {};

  if (data.name.length < 2) errors.name = 'Please enter your name.';
  const mobile = normalizePhMobile(data.mobile);
  if (!mobile) errors.mobile = 'Please enter a PH mobile number like 09XX XXX XXXX.';
  else data.mobile = mobile;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = 'Please check your email address.';
  if (!interestOptions.some((o) => o.value === data.interest)) errors.interest = 'Please choose what you’re interested in.';
  if (!rateOptions.some((o) => o.value === data.rate)) errors.rate = 'Please choose student or regular.';
  if (data.day && !(dayOptions as readonly string[]).includes(data.day)) data.day = '';
  if (data.time && !timeOptions.some((o) => o.value === data.time)) data.time = '';
  if (!data.consent) errors.consent = 'Please agree so we can contact you about your visit.';

  return { data, errors };
}

export const labelFor = {
  interest: (v: string) => interestOptions.find((o) => o.value === v)?.label ?? v,
  rate: (v: string) => rateOptions.find((o) => o.value === v)?.label ?? v,
  time: (v: string) => timeOptions.find((o) => o.value === v)?.label ?? v,
};
