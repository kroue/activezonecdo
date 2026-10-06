/**
 * Every photo on the site lives here.
 *
 * Right now these are royalty-free Unsplash stock photos (Unsplash License, free for commercial use).
 * SWAP: ActiveZone's Facebook and Instagram have plenty of real photos of the floor, classes and members.
 * To use one, put the file in src/assets/photos/ and replace `src` with an import, e.g.
 *
 *   import gymFloor from '../assets/photos/gym-floor.jpg';
 *   { id: 'gym-floor', src: gymFloor, alt: '…', … }
 *
 * Local imports get their width/height automatically. For remote URLs, set width/height to match the crop.
 * Photos are served as AVIF/WebP at the right size by Astro <Image> + Vercel Image Optimization.
 */
import type { ImageMetadata } from 'astro';

export type PhotoCategory = 'gym' | 'classes' | 'community';

export interface Photo {
  src: string | ImageMetadata;
  alt: string;
  width: number;
  height: number;
  category: PhotoCategory;
  /** Show in the gallery page grid. */
  gallery: boolean;
  /** Short caption for the lightbox. */
  caption: string;
}

/** Builds a cropped Unsplash URL so the intrinsic size is known (no layout shift). */
const unsplash = (id: string, w = 1600, h = 1067) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=80`;

export const photos = {
  // SWAP: wide shot of the ActiveZone gym floor (hero image).
  hero: {
    src: unsplash('1534438327276-14e5300c3a48', 1920, 1280),
    alt: 'Dumbbell racks and training area inside a modern gym',
    width: 1920,
    height: 1280,
    category: 'gym',
    gallery: true,
    caption: 'The training floor',
  },
  // SWAP: free weights area.
  'gym-weights': {
    src: unsplash('1540497077202-7c8a3999166f'),
    alt: 'Rows of weight machines and benches in a spacious gym',
    width: 1600,
    height: 1067,
    category: 'gym',
    gallery: true,
    caption: 'Machines and benches',
  },
  // SWAP: cardio / machines area.
  'gym-machines': {
    src: unsplash('1571902943202-507ec2618e8f'),
    alt: 'Bright gym interior with cardio and strength equipment',
    width: 1600,
    height: 1067,
    category: 'gym',
    gallery: true,
    caption: 'Clean, well-ventilated space',
  },
  // SWAP: a coach helping a member.
  coaching: {
    src: unsplash('1571019613454-1cb2f99b2d8b'),
    alt: 'Coach guiding a member through an exercise',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: true,
    caption: 'Fitness coaching',
  },
  // SWAP: Zumba class photo (their post: Tuesday and Thursday 8:30 AM).
  zumba: {
    src: unsplash('1524594152303-9fd13543fe6e'),
    alt: 'Group dance fitness class moving together',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: true,
    caption: 'Zumba',
  },
  // SWAP: boxing class photo.
  boxing: {
    src: unsplash('1549719386-74dfcbf7dbed'),
    alt: 'Boxing gloves ready for a training session',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: true,
    caption: 'Boxing',
  },
  // SWAP: Strong Nation class photo.
  'strong-nation': {
    src: unsplash('1518611012118-696072aa579a'),
    alt: 'Group fitness class training to music',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: true,
    caption: 'Strong Nation',
  },
  // SWAP: Meta Pro class photo.
  'meta-pro': {
    src: unsplash('1517836357463-d25dfeac3438'),
    alt: 'Member training with dumbbells',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: false,
    caption: 'Meta Pro',
  },
  // SWAP: Bootcamp class photo.
  bootcamp: {
    src: unsplash('1517963879433-6ad2b056d712'),
    alt: 'Circuit training workout in a gym',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: true,
    caption: 'Bootcamp',
  },
  // SWAP: Abs Workout class photo.
  abs: {
    src: unsplash('1571019614242-c5c5dee9f50b'),
    alt: 'Core workout on exercise mats',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: false,
    caption: 'Abs Workout',
  },
  // SWAP: HIIT class photo.
  hiit: {
    src: unsplash('1599058917212-d750089bc07e'),
    alt: 'High-intensity interval training session',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: true,
    caption: 'HIIT',
  },
  // SWAP: AZ Pulse class photo.
  'az-pulse': {
    src: unsplash('1574680096145-d05b474e2155'),
    alt: 'Energetic interval workout in the gym',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: false,
    caption: 'AZ Pulse',
  },
  // SWAP: Legs Workout class photo.
  legs: {
    src: unsplash('1583454110551-21f2fa2afe61'),
    alt: 'Lower-body strength training',
    width: 1600,
    height: 1067,
    category: 'classes',
    gallery: false,
    caption: 'Legs Workout',
  },
  // SWAP: members together after a class (their anniversary posts are perfect for this).
  'community-1': {
    src: unsplash('1552196563-55cd4e45efb3'),
    alt: 'Friends smiling together after a workout',
    width: 1600,
    height: 1067,
    category: 'community',
    gallery: true,
    caption: 'Community',
  },
  // SWAP: group photo of members and coaches.
  'community-2': {
    src: unsplash('1541534741688-6078c6bfb5c5'),
    alt: 'Members training side by side',
    width: 1600,
    height: 1067,
    category: 'community',
    gallery: true,
    caption: 'Training together',
  },
  // SWAP: a candid member moment.
  'community-3': {
    src: unsplash('1576678927484-cc907957088c'),
    alt: 'Member taking a break between sets',
    width: 1600,
    height: 1067,
    category: 'community',
    gallery: true,
    caption: 'Second home',
  },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;

export const photoCategories: { id: PhotoCategory; label: string }[] = [
  { id: 'gym', label: 'Gym' },
  { id: 'classes', label: 'Classes' },
  { id: 'community', label: 'Community' },
];

export const galleryPhotos = (Object.entries(photos) as [PhotoId, Photo][])
  .filter(([, p]) => p.gallery)
  .map(([id, p]) => ({ id, ...p }));
