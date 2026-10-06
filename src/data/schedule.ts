/**
 * Class timetable. The Schedule page is generated from this list.
 *
 * Add one entry per class slot. As entries are added, the schedule grid and filters fill in
 * automatically, and the class drops out of the "Times posted on Messenger" list.
 *
 *   { classId: 'boxing', day: 1, start: '18:00', end: '19:00' }
 *
 * day: 0 = Sunday, 1 = Monday … 6 = Saturday. Times are 24h, Asia/Manila. `end` is optional.
 *
 * TODO-confirm: get the full weekly timetable from the owner. Only Zumba is confirmed so far.
 */
export interface ScheduleEntry {
  classId: string;
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start: string;
  end?: string;
  /** Optional short note, e.g. coach-led or "bring gloves". */
  note?: string;
}

export const schedule: ScheduleEntry[] = [
  // Confirmed from their own Facebook post: Zumba every Tuesday and Thursday, 8:30 AM.
  { classId: 'zumba', day: 2, start: '08:30' },
  { classId: 'zumba', day: 4, start: '08:30' },
];

/** Days in display order, Monday first. */
export const weekDays = [
  { day: 1, label: 'Monday', short: 'Mon' },
  { day: 2, label: 'Tuesday', short: 'Tue' },
  { day: 3, label: 'Wednesday', short: 'Wed' },
  { day: 4, label: 'Thursday', short: 'Thu' },
  { day: 5, label: 'Friday', short: 'Fri' },
  { day: 6, label: 'Saturday', short: 'Sat' },
  { day: 0, label: 'Sunday', short: 'Sun' },
] as const;
