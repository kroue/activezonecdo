/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import { CALC_EVENT, peso } from './shared';

interface Props {
  prices: { basic: { regular: number; student: number }; premium: { regular: number; student: number } };
}

type Answer = 'yes' | 'no' | null;

const questions = [
  { id: 'classes', q: 'Do you want group classes included?', hint: 'Zumba, Boxing or Strong Nation' },
  { id: 'student', q: 'Are you a student?', hint: 'Student rates are lower' },
  { id: 'coach', q: 'Do you want coach guidance?', hint: 'Help with form, equipment and a program' },
] as const;

type QId = (typeof questions)[number]['id'];

export default function PlanFinder({ prices }: Props) {
  const [answers, setAnswers] = useState<Record<QId, Answer>>({ classes: null, student: null, coach: null });
  const done = Object.values(answers).every((a) => a !== null);

  const plan: 'basic' | 'premium' = answers.classes === 'yes' ? 'premium' : 'basic';
  const rate: 'regular' | 'student' = answers.student === 'yes' ? 'student' : 'regular';
  const price = prices[plan][rate];

  let reason = '';
  if (plan === 'premium') {
    reason =
      answers.coach === 'yes'
        ? 'You get guided training plus 1 group class (Zumba, Boxing or Strong Nation) on top of everything in Basic.'
        : 'It adds 1 group class (Zumba, Boxing or Strong Nation) on top of full gym access and HIIT classes.';
  } else {
    reason =
      answers.coach === 'yes'
        ? 'Self-paced training with free basic coaching sessions, a free fitness assessment and HIIT classes.'
        : 'Train at your own pace with full gym access and HIIT classes. Coaches are there whenever you want help.';
  }

  const useInCalculator = () => {
    window.dispatchEvent(new CustomEvent(CALC_EVENT, { detail: { plan, rate } }));
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div class="card-light p-6 sm:p-8">
      <ol class="space-y-6">
        {questions.map((item, i) => (
          <li key={item.id}>
            <fieldset>
              <legend class="font-semibold">
                <span class="mr-2 font-display text-lg font-extrabold text-leaf">{i + 1}.</span>
                {item.q}
              </legend>
              <p class="text-sm text-slate">{item.hint}</p>
              <div class="mt-3 flex gap-2">
                {(['yes', 'no'] as const).map((v) => (
                  <label
                    key={v}
                    class={`flex min-h-12 min-w-24 cursor-pointer items-center justify-center rounded-full border-2 px-5 font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-leaf ${
                      answers[item.id] === v ? 'border-night bg-night text-neon' : 'border-line bg-white text-ink hover:border-slate'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`finder-${item.id}`}
                      value={v}
                      checked={answers[item.id] === v}
                      onChange={() => setAnswers((a) => ({ ...a, [item.id]: v }))}
                      class="sr-only"
                    />
                    {v === 'yes' ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div class="mt-8 min-h-40 rounded-2xl bg-night p-5 text-white" aria-live="polite">
        {done ? (
          <>
            <p class="text-sm font-semibold uppercase tracking-wider text-neon">We recommend</p>
            <p class="mt-1 font-display text-4xl font-extrabold uppercase">
              {plan === 'premium' ? 'Premium Plan' : 'Basic Plan'}
            </p>
            <p class="mt-1 text-sm text-mist">
              {peso(price)} per 4 weeks · {rate === 'student' ? 'Student' : 'Regular'} rate
            </p>
            <p class="mt-3 text-white/90">{reason}</p>
            <button type="button" onClick={useInCalculator} class="btn btn-neon mt-5 w-full sm:w-auto">
              Use this in the calculator
            </button>
          </>
        ) : (
          <p class="text-mist">Answer the 3 questions and we’ll point you to the right plan.</p>
        )}
      </div>
    </div>
  );
}
