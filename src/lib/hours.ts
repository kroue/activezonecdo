/**
 * Opening-hours helpers. Pure functions, safe to use on the server and in the browser.
 * Asia/Manila is UTC+8 all year (no daylight saving), so we shift UTC directly instead of relying on Intl.
 */
export interface DayHours {
  day: number; // 0 = Sunday
  open: string; // "HH:MM"
  close: string; // "HH:MM"
}

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "06:00" → "6 AM", "08:30" → "8:30 AM", "13:00" → "1 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function manilaClock(now: Date = new Date()) {
  const m = new Date(now.getTime() + MANILA_OFFSET_MS);
  return { day: m.getUTCDay(), minutes: m.getUTCHours() * 60 + m.getUTCMinutes() };
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface OpenStatus {
  open: boolean;
  /** "Open now" | "Closed" */
  label: string;
  /** "until 10 PM" | "opens 1 PM today" | "opens 6 AM tomorrow" */
  detail: string;
}

export function getOpenStatus(hours: readonly DayHours[], now: Date = new Date()): OpenStatus {
  const { day, minutes } = manilaClock(now);
  const today = hours.find((h) => h.day === day);

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { open: true, label: 'Open now', detail: `until ${formatTime(today.close)}` };
    }
    if (minutes < open) {
      return { open: false, label: 'Closed', detail: `opens ${formatTime(today.open)} today` };
    }
  }

  // Find the next day with hours (handles Saturday night → Sunday 1 PM).
  for (let i = 1; i <= 7; i++) {
    const nextDay = (day + i) % 7;
    const next = hours.find((h) => h.day === nextDay);
    if (next) {
      const when = i === 1 ? 'tomorrow' : dayNames[nextDay];
      return { open: false, label: 'Closed', detail: `opens ${formatTime(next.open)} ${when}` };
    }
  }
  return { open: false, label: 'Closed', detail: '' };
}
