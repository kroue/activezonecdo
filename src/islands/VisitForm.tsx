/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  dayOptions,
  interestOptions,
  parseInquiry,
  rateOptions,
  sourceOptions,
  timeOptions,
  type InquiryErrors,
} from '../lib/inquiry';
import { peso } from './shared';

interface Props {
  classNames: string[];
  privacyUrl: string;
  messengerUrl: string;
  phoneDisplay: string;
  phoneTel: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldOrder = ['name', 'mobile', 'email', 'interest', 'rate', 'consent'] as const;

export default function VisitForm({ classNames, privacyUrl, messengerUrl, phoneDisplay, phoneTel }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [interest, setInterest] = useState('');
  const [startedAt] = useState(() => Date.now());

  // Pre-fill from links like /book-a-visit/?interest=premium&rate=student&periods=3&estimate=7820&new=1
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const q = new URLSearchParams(window.location.search);
    const set = (name: string, value: string) => {
      const el = form.elements.namedItem(name);
      if (el instanceof RadioNodeList) el.value = value;
      else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) el.value = value;
    };
    const qi = q.get('interest');
    if (qi === 'promo') {
      set('interest', 'visit');
      setInterest('visit');
      set('notes', 'I’d like to ask about your current member promos.');
    } else if (qi && interestOptions.some((o) => o.value === qi)) {
      set('interest', qi);
      setInterest(qi);
    }
    const qc = q.get('class');
    if (qc && classNames.includes(qc)) {
      set('interest', 'class');
      setInterest('class');
      set('className', qc);
    }
    const qr = q.get('rate');
    if (qr === 'student' || qr === 'regular') set('rate', qr);
    if (q.get('new') === '1') {
      const box = form.elements.namedItem('isNew');
      if (box instanceof HTMLInputElement) box.checked = true;
    }
    const periods = Number(q.get('periods'));
    const estimate = Number(q.get('estimate'));
    if (periods > 0 && estimate > 0 && qi) {
      const plan = qi === 'premium' ? 'Premium' : 'Basic';
      const rate = qr === 'student' ? 'Student' : 'Regular';
      set(
        'notes',
        `From the website calculator: ${plan} Plan (${rate}), ${periods} × 4 weeks. Estimated first payment ${peso(estimate)} including the activation fee. Please confirm my total and any promo.`,
      );
    }
  }, []);

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const form = formRef.current!;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries());
    const { errors: found } = parseInquiry(raw);
    setErrors(found);
    const firstInvalid = fieldOrder.find((k) => found[k]);
    if (firstInvalid) {
      const el = form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }
    setStatus('sending');
    try {
      fd.set('elapsed', String(Date.now() - startedAt));
      const res = await fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: InquiryErrors };
      if (res.ok && json.ok) {
        setStatus('sent');
        form.reset();
        requestAnimationFrame(() => document.getElementById('visit-success')?.focus());
      } else {
        if (json.errors) setErrors(json.errors);
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const err = (k: keyof InquiryErrors) =>
    errors[k] ? (
      <p id={`${k}-error`} class="field-error">
        {errors[k]}
      </p>
    ) : null;
  const invalid = (k: keyof InquiryErrors) =>
    errors[k] ? { 'aria-invalid': 'true' as const, 'aria-describedby': `${k}-error` } : {};

  if (status === 'sent') {
    return (
      <div id="visit-success" tabIndex={-1} class="card-light p-8 text-center outline-none" role="status">
        <span class="mx-auto flex size-16 items-center justify-center rounded-full bg-night text-neon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        {/* TODO-confirm: typical response time with the owner (e.g. "within the day") before adding it here. */}
        <p class="mt-5 font-display text-4xl font-extrabold uppercase">Thanks! We’ll message you to confirm your visit.</p>
        <p class="mt-3 text-slate">
          Want a faster reply? Call us at{' '}
          <a class="link" href={`tel:${phoneTel}`}>
            {phoneDisplay}
          </a>{' '}
          or{' '}
          <a class="link" href={messengerUrl} target="_blank" rel="noopener">
            message us on Messenger
          </a>
          .
        </p>
        <button type="button" class="btn btn-outline-dark mt-6" onClick={() => setStatus('idle')}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action="/api/inquiry" method="post" noValidate onSubmit={onSubmit} class="card-light p-6 sm:p-8">
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label for="vf-name" class="field-label">
            Name <span class="text-slate">(required)</span>
          </label>
          <input id="vf-name" name="name" type="text" autoComplete="name" required maxLength={100} class="field" {...invalid('name')} />
          {err('name')}
        </div>

        <div>
          <label for="vf-mobile" class="field-label">
            Mobile number <span class="text-slate">(required)</span>
          </label>
          <input
            id="vf-mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="09XX XXX XXXX"
            pattern="^(\+?63|0)9[\d\s-]{9,13}$"
            required
            class="field"
            {...(errors.mobile ? { 'aria-invalid': 'true', 'aria-describedby': 'mobile-error' } : { 'aria-describedby': 'mobile-hint' })}
          />
          {errors.mobile ? err('mobile') : <p id="mobile-hint" class="field-hint">We’ll text or call to confirm.</p>}
        </div>

        <div>
          <label for="vf-email" class="field-label">
            Email <span class="text-slate">(optional)</span>
          </label>
          <input id="vf-email" name="email" type="email" autoComplete="email" class="field" {...invalid('email')} />
          {err('email')}
        </div>

        <div>
          <label for="vf-interest" class="field-label">
            I’m interested in <span class="text-slate">(required)</span>
          </label>
          <select
            id="vf-interest"
            name="interest"
            required
            class="field"
            onChange={(e) => setInterest((e.target as HTMLSelectElement).value)}
            {...invalid('interest')}
          >
            <option value="">Choose one</option>
            {interestOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err('interest')}
        </div>

        <div class={interest === 'class' ? '' : 'hidden sm:block sm:invisible'} aria-hidden={interest !== 'class'}>
          <label for="vf-class" class="field-label">
            Which class?
          </label>
          <select id="vf-class" name="className" class="field" disabled={interest !== 'class'}>
            <option value="">Not sure yet</option>
            {classNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <fieldset class="sm:col-span-2" {...(errors.rate ? { 'aria-describedby': 'rate-error' } : {})}>
          <legend class="field-label">
            Rate <span class="text-slate">(required)</span>
          </legend>
          <div class="segmented">
            {rateOptions.map((o) => (
              <label key={o.value}>
                <input type="radio" name="rate" value={o.value} defaultChecked={o.value === 'regular'} />
                {o.label}
              </label>
            ))}
          </div>
          {err('rate')}
        </fieldset>

        <div>
          <label for="vf-day" class="field-label">
            Preferred day
          </label>
          <select id="vf-day" name="day" class="field">
            <option value="">Any day</option>
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label for="vf-time" class="field-label">
            Preferred time
          </label>
          <select id="vf-time" name="time" class="field" aria-describedby="time-hint">
            <option value="">Any time</option>
            {timeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p id="time-hint" class="field-hint">
            Sunday hours are 1 – 9 PM.
          </p>
        </div>

        <div class="sm:col-span-2">
          <label class="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-line bg-paper p-4 has-[:checked]:border-leaf">
            <input type="checkbox" name="isNew" class="mt-1 size-5 shrink-0 accent-[#15792b]" />
            <span>
              <span class="block font-semibold">I’m new to the gym</span>
              <span class="block text-sm text-slate">No problem at all. A coach will help you get started.</span>
            </span>
          </label>
        </div>

        <div class="sm:col-span-2">
          <label for="vf-notes" class="field-label">
            Notes <span class="text-slate">(optional)</span>
          </label>
          <textarea
            id="vf-notes"
            name="notes"
            rows={4}
            maxLength={1500}
            class="field"
            placeholder="Goals, questions, or anything we should know."
          />
        </div>

        <div class="sm:col-span-2">
          <label for="vf-source" class="field-label">
            How did you find us?
          </label>
          <select id="vf-source" name="source" class="field">
            <option value="">Choose one</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Honeypot: hidden from people, tempting for bots. */}
        <div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label for="vf-company">Company</label>
          <input id="vf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div class="sm:col-span-2">
          <label class="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              required
              class="mt-1 size-5 shrink-0 accent-[#15792b]"
              {...invalid('consent')}
            />
            <span class="text-sm text-slate">
              I agree that ActiveZone CDO may collect and use my details to respond to this request and arrange my visit,
              in line with the Data Privacy Act of 2012 (RA 10173) and the{' '}
              <a href={privacyUrl} class="link">
                Privacy Policy
              </a>
              . <span class="text-ink">(required)</span>
            </span>
          </label>
          {err('consent')}
        </div>
      </div>

      <div class="mt-7">
        <button type="submit" class="btn btn-dark w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Book my visit'}
        </button>
        <p class="mt-3 min-h-5 text-sm" role="alert">
          {status === 'error' && (
            <span class="text-[#b42318]">
              Sorry, that didn’t go through. Please try again, or call us at {phoneDisplay}.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
