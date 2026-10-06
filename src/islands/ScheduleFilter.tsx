/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';

interface Entry {
  classId: string;
  className: string;
  day: number;
  start: string;
  end?: string;
  note?: string;
}

interface Props {
  entries: Entry[];
  classes: { id: string; name: string }[];
  days: { day: number; label: string; short: string }[];
  hours: { day: number; open: string; close: string }[];
  messengerUrl: string;
}

const fmt = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
};

const manilaDay = () => new Date(Date.now() + 8 * 3600_000).getUTCDay();

export default function ScheduleFilter({ entries, classes, days, hours, messengerUrl }: Props) {
  const [day, setDay] = useState<number | 'all'>('all');
  const [cls, setCls] = useState<string>('all');
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => setToday(manilaDay()), []);

  const scheduledIds = new Set(entries.map((e) => e.classId));
  const visibleDays = days.filter((d) => day === 'all' || d.day === day);
  const slotsFor = (d: number) =>
    entries
      .filter((e) => e.day === d && (cls === 'all' || e.classId === cls))
      .sort((a, b) => a.start.localeCompare(b.start));
  const unscheduled = classes.filter((c) => !scheduledIds.has(c.id) && (cls === 'all' || c.id === cls));
  const selectedName = classes.find((c) => c.id === cls)?.name;
  const totalSlots = visibleDays.reduce((n, d) => n + slotsFor(d.day).length, 0);

  return (
    <div>
      {/* Filters */}
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <fieldset class="min-w-0">
          <legend class="field-label">Day</legend>
          <div class="no-scrollbar relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ day: 'all' as const, short: 'All days', label: 'All days' }, ...days].map((d) => {
              const active = day === d.day;
              return (
                <label
                  key={String(d.day)}
                  class={`flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border-2 px-4 font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-leaf ${
                    active ? 'border-night bg-night text-neon' : 'border-line bg-white text-ink hover:border-slate'
                  }`}
                >
                  <input
                    type="radio"
                    name="sched-day"
                    class="sr-only"
                    checked={active}
                    onChange={() => setDay(d.day)}
                  />
                  {d.short}
                  {today === d.day && <span class="ml-1.5 text-xs font-bold opacity-80">· Today</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div class="lg:w-64">
          <label for="sched-class" class="field-label">
            Class
          </label>
          <select id="sched-class" class="field" value={cls} onChange={(e) => setCls((e.target as HTMLSelectElement).value)}>
            <option value="all">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p class="mt-5 text-sm text-slate" aria-live="polite">
        {totalSlots > 0
          ? `Showing ${totalSlots} class ${totalSlots === 1 ? 'time' : 'times'}${selectedName ? ` for ${selectedName}` : ''}.`
          : selectedName
            ? `${selectedName} times are posted on Messenger.`
            : 'Showing gym hours.'}
      </p>

      {/* Day cards */}
      <ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDays.map((d) => {
          const h = hours.find((x) => x.day === d.day);
          const slots = slotsFor(d.day);
          const isToday = today === d.day;
          return (
            <li
              key={d.day}
              class={`card-light flex flex-col p-5 ${isToday ? 'ring-2 ring-leaf' : ''}`}
              aria-label={`${d.label}${isToday ? ' (today)' : ''}`}
            >
              <div class="flex items-baseline justify-between gap-3">
                <h3 class="text-2xl">{d.label}</h3>
                {isToday && <span class="rounded-full bg-night px-2.5 py-0.5 text-xs font-bold text-neon">Today</span>}
              </div>
              <p class="mt-1 text-sm text-slate">
                Gym open <span class="font-semibold text-ink">{h ? `${fmt(h.open)} – ${fmt(h.close)}` : 'Closed'}</span>
              </p>
              {slots.length > 0 ? (
                <ul class="mt-4 space-y-2">
                  {slots.map((s) => (
                    <li key={`${s.classId}-${s.start}`} class="flex items-center gap-3 rounded-xl bg-night px-4 py-3 text-white">
                      <span class="price min-w-[4.5rem] text-xl text-neon">{fmt(s.start)}</span>
                      <span class="font-semibold">
                        {s.className}
                        {s.end && <span class="block text-xs font-normal text-mist">until {fmt(s.end)}</span>}
                        {s.note && <span class="block text-xs font-normal text-mist">{s.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="mt-4 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-slate">
                  {cls === 'all' ? 'Open gym. Train anytime during gym hours.' : 'No posted class time on this day.'}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Classes without a posted time yet */}
      {unscheduled.length > 0 && (
        <div class="mt-10 rounded-[var(--radius-card)] bg-night p-6 text-white sm:p-8">
          <h3 class="text-3xl">Times posted on Messenger</h3>
          <p class="mt-2 max-w-2xl text-mist">
            Send us a quick message on Messenger and we’ll reply with the latest class times. You can also ask at the
            front desk.
          </p>
          <ul class="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unscheduled.map((c) => (
              <li key={c.id} class="flex items-center justify-between gap-3 rounded-xl bg-charcoal px-4 py-3 ring-1 ring-graphite">
                <span class="font-semibold">{c.name}</span>
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener"
                  class="shrink-0 rounded-full bg-neon px-3.5 py-2 text-sm font-bold text-night hover:bg-neon-bright"
                  aria-label={`Ask for ${c.name} times on Messenger`}
                >
                  Ask on Messenger
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
