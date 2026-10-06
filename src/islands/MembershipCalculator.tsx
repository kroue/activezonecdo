/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { CALC_EVENT, CALC_KEY, copyText, peso, storage, type CalcState } from './shared';

interface PlanLite {
  id: 'basic' | 'premium';
  name: string;
  price: { regular: number; student: number };
}

interface Props {
  plans: PlanLite[];
  activationFee: number;
  minPeriods: number;
  maxPeriods: number;
  messengerUrl: string;
  visitUrl: string;
}

export default function MembershipCalculator({ plans, activationFee, minPeriods, maxPeriods, messengerUrl, visitUrl }: Props) {
  const [state, setState] = useState<CalcState>({ plan: 'basic', rate: 'regular', periods: 1 });
  const [restored, setRestored] = useState(false);
  const [status, setStatus] = useState('');

  // Restore the last estimate so visitors don't lose it.
  useEffect(() => {
    const saved = storage.get<CalcState>(CALC_KEY);
    if (saved && plans.some((p) => p.id === saved.plan) && saved.periods >= minPeriods && saved.periods <= maxPeriods) {
      setState({ plan: saved.plan, rate: saved.rate === 'student' ? 'student' : 'regular', periods: saved.periods });
      setRestored(true);
    }
    const onSet = (e: Event) => {
      const detail = (e as CustomEvent<Partial<CalcState>>).detail;
      setState((s) => ({ ...s, ...detail }));
      setRestored(false);
    };
    window.addEventListener(CALC_EVENT, onSet);
    return () => window.removeEventListener(CALC_EVENT, onSet);
  }, []);

  useEffect(() => storage.set(CALC_KEY, state), [state]);

  const plan = plans.find((p) => p.id === state.plan) ?? plans[0];
  const planPrice = plan.price[state.rate];
  const subtotal = planPrice * state.periods;
  const total = subtotal + activationFee;
  const weeks = state.periods * 4;
  const rateLabel = state.rate === 'student' ? 'Student' : 'Regular';

  const summary = useMemo(
    () =>
      [
        'Hi ActiveZone! I used the membership calculator on your website:',
        `• Plan: ${plan.name} (${rateLabel})`,
        `• Length: ${state.periods} × 4 weeks (${weeks} weeks)`,
        `• Membership: ${peso(planPrice)} × ${state.periods} = ${peso(subtotal)}`,
        `• Activation fee: ${peso(activationFee)}`,
        `• Estimated first payment: ${peso(total)}`,
        'Can you confirm my total and any promo I can use? Thanks!',
      ].join('\n'),
    [plan, state, planPrice, subtotal, total],
  );

  const visitHref = `${visitUrl}?interest=${state.plan}&rate=${state.rate}&periods=${state.periods}&estimate=${total}`;

  const onCopy = async () => {
    const ok = await copyText(summary);
    setStatus(ok ? 'Copied! Paste it in Messenger.' : 'Could not copy automatically. Select the summary below and copy it.');
  };

  return (
    <div class="card-dark p-6 sm:p-8 text-white">
      <div class="grid gap-6">
        <fieldset>
          <legend class="field-label text-white">Plan</legend>
          <div class="grid grid-cols-2 gap-2">
            {plans.map((p) => (
              <label
                key={p.id}
                class={`cursor-pointer rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white ${
                  state.plan === p.id ? 'border-neon bg-neon/10' : 'border-graphite hover:border-white/40'
                }`}
              >
                <input
                  type="radio"
                  name="calc-plan"
                  value={p.id}
                  checked={state.plan === p.id}
                  onChange={() => setState((s) => ({ ...s, plan: p.id }))}
                  class="sr-only"
                />
                <span class="block font-display text-2xl font-bold uppercase leading-none">{p.name.replace(' Plan', '')}</span>
                <span class="mt-1 block text-sm text-mist">{peso(p.price[state.rate])} / 4 wks</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend class="field-label text-white">Rate</legend>
          <div class="segmented">
            {(['regular', 'student'] as const).map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  name="calc-rate"
                  value={r}
                  checked={state.rate === r}
                  onChange={() => setState((s) => ({ ...s, rate: r }))}
                />
                {r === 'regular' ? 'Regular' : 'Student'}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label for="calc-periods" class="field-label text-white">
            Number of 4-week periods
          </label>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-2xl font-bold ring-1 ring-white/15 hover:bg-white/10 disabled:opacity-40"
              onClick={() => setState((s) => ({ ...s, periods: Math.max(minPeriods, s.periods - 1) }))}
              disabled={state.periods <= minPeriods}
              aria-label="Fewer periods"
            >
              −
            </button>
            <input
              id="calc-periods"
              type="range"
              min={minPeriods}
              max={maxPeriods}
              step={1}
              value={state.periods}
              onInput={(e) => setState((s) => ({ ...s, periods: Number((e.target as HTMLInputElement).value) }))}
              class="h-2 w-full cursor-pointer accent-neon"
              aria-valuetext={`${state.periods} periods, ${weeks} weeks`}
            />
            <button
              type="button"
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-2xl font-bold ring-1 ring-white/15 hover:bg-white/10 disabled:opacity-40"
              onClick={() => setState((s) => ({ ...s, periods: Math.min(maxPeriods, s.periods + 1) }))}
              disabled={state.periods >= maxPeriods}
              aria-label="More periods"
            >
              +
            </button>
          </div>
          <p class="mt-2 text-sm text-mist">
            <span class="font-semibold text-white">{state.periods}</span> × 4 weeks = {weeks} weeks
          </p>
        </div>
      </div>

      <div class="mt-8 rounded-2xl bg-night p-5 ring-1 ring-white/10" aria-live="polite">
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-mist">
              {plan.name} ({rateLabel}) × {state.periods}
            </dt>
            <dd class="tabular font-semibold">{peso(subtotal)}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-mist">One-time activation fee</dt>
            <dd class="tabular font-semibold">{peso(activationFee)}</dd>
          </div>
          <div class="flex items-end justify-between gap-4 border-t border-white/10 pt-3">
            <dt class="font-display text-xl font-bold uppercase">First payment</dt>
            <dd class="price text-5xl text-neon">{peso(total)}</dd>
          </div>
        </dl>
        <p class="mt-3 text-xs text-mist">Estimate only. ActiveZone will confirm your final total and any promo.</p>
        {restored && <p class="mt-2 text-xs text-mist">We kept your last estimate from this device.</p>}
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <a href={visitHref} class="btn btn-neon">
          Send this to ActiveZone
        </a>
        <a href={messengerUrl} target="_blank" rel="noopener" class="btn btn-ghost" onClick={onCopy}>
          Copy for Messenger
        </a>
      </div>
      <p class="mt-3 min-h-5 text-sm text-neon" role="status">
        {status}
      </p>
      <details class="mt-2 text-sm text-mist">
        <summary class="cursor-pointer font-semibold text-white/85">Show the message we copy</summary>
        <pre class="mt-3 whitespace-pre-wrap rounded-xl bg-night p-4 font-sans text-[0.85rem] text-white/85 ring-1 ring-white/10">{summary}</pre>
      </details>
    </div>
  );
}
