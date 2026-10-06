/** Small helpers shared by the islands. */
export const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`;

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode or storage disabled: the calculator still works, it just won't remember */
    }
  },
};

export const CALC_KEY = 'az:calculator:v1';
export const CALC_EVENT = 'az:calculator:set';

export interface CalcState {
  plan: 'basic' | 'premium';
  rate: 'regular' | 'student';
  periods: number;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
