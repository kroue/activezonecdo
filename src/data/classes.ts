/**
 * Classes offered at ActiveZone CDO.
 *
 * Descriptions are intentionally general. Do not add intensity ratings, calories, durations
 * or coach names until the owner confirms them.
 *
 * `plans` says which membership includes the class:
 *  - 'basic'   → included in Basic (and therefore Premium)
 *  - 'premium' → the Premium plan's 1 group class pick (Zumba, Boxing or Strong Nation)
 *  - 'all'     → part of every membership
 *  - 'ask'     → not listed on the rates graphic; ask the front desk
 */
import type { PhotoId } from './photos';

export type ClassPlan = 'all' | 'basic' | 'premium' | 'ask';

export interface GymClass {
  id: string;
  name: string;
  short: string;
  description: string;
  plans: ClassPlan;
  /** Pay-per-session price id from rates.ts `sessions`, if the class can be booked without a membership. */
  sessionId?: 'zumba' | 'boxing' | 'strong-nation';
  /** Show on the home page class grid. */
  featured: boolean;
  photo: PhotoId;
}

export const classes: GymClass[] = [
  {
    id: 'fitness-coaching',
    name: 'Fitness Coaching',
    short: 'Learn the equipment, your form and a plan that fits you.',
    description:
      'Our coaches help you get comfortable on the gym floor. They show you how the equipment works, check your form and help you set up a program for your goals. Every membership starts with a free fitness assessment and free basic coaching sessions.',
    plans: 'all',
    featured: true,
    photo: 'coaching',
  },
  {
    id: 'zumba',
    name: 'Zumba',
    short: 'Dance fitness with easy-to-follow moves.',
    description:
      'A dance-based cardio class set to upbeat music. The moves are easy to follow, so you do not need any dance background. Just show up and move with the group.',
    plans: 'premium',
    sessionId: 'zumba',
    featured: true,
    photo: 'zumba',
  },
  {
    id: 'boxing',
    name: 'Boxing',
    short: 'Stance, footwork and combos in a full-body workout.',
    description:
      'Learn boxing fundamentals like stance, footwork and punch combinations, built into a full-body conditioning workout. Great for stress relief and for building confidence.',
    plans: 'premium',
    sessionId: 'boxing',
    featured: true,
    photo: 'boxing',
  },
  {
    id: 'strong-nation',
    name: 'Strong Nation',
    short: 'Strength and cardio moves synced to the music.',
    description:
      'A music-driven workout that mixes bodyweight strength, conditioning and cardio moves, with every move timed to the beat. The music keeps you pushing to the end.',
    plans: 'premium',
    sessionId: 'strong-nation',
    featured: true,
    photo: 'strong-nation',
  },
  {
    id: 'meta-pro',
    name: 'Meta Pro',
    short: 'HIIT-style conditioning in timed rounds.',
    description:
      'A HIIT-style conditioning class that combines strength and cardio moves in timed rounds. Part of the HIIT lineup included with every membership.',
    plans: 'basic',
    featured: true,
    photo: 'meta-pro',
  },
  {
    id: 'bootcamp',
    name: 'Bootcamp',
    short: 'A group circuit to work your whole body.',
    description:
      'A group workout that moves you through a mix of strength, cardio and bodyweight exercises. Train together, cheer each other on and finish strong.',
    // TODO-confirm: which plan includes Bootcamp, or whether it is priced separately.
    plans: 'ask',
    featured: true,
    photo: 'bootcamp',
  },
  {
    id: 'abs-workout',
    name: 'Abs Workout',
    short: 'Focused core work for strength and stability.',
    description:
      'A class that focuses on your core: the muscles that support your posture, balance and almost every lift you do in the gym.',
    plans: 'basic',
    featured: true,
    photo: 'abs',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    short: 'Short bursts of hard work, then recover. Repeat.',
    description:
      'High-intensity interval training: short bursts of effort followed by recovery, repeated in rounds. You work at your own level, and the coach helps you scale each move.',
    plans: 'basic',
    featured: true,
    photo: 'hiit',
  },
  {
    id: 'az-pulse',
    name: 'AZ Pulse',
    short: 'ActiveZone’s own high-energy interval class.',
    description:
      'ActiveZone’s own interval class and part of the HIIT lineup that comes with every membership. Expect an energetic, coach-led session with the group.',
    plans: 'basic',
    featured: false,
    photo: 'az-pulse',
  },
  {
    id: 'legs-workout',
    name: 'Legs Workout',
    short: 'A lower-body session for strong legs and glutes.',
    description:
      'A class focused on your lower body: legs and glutes. Part of the HIIT lineup included with every membership.',
    plans: 'basic',
    featured: false,
    photo: 'legs',
  },
];

export const planLabel: Record<ClassPlan, string> = {
  all: 'Included in every membership',
  basic: 'Included in Basic and Premium',
  premium: 'Premium: pick 1 group class',
  ask: 'Ask us which plan covers it',
};

export const getClass = (id: string) => classes.find((c) => c.id === id);
