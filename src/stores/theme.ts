// src/stores/theme.ts
import { persistentAtom } from '@nanostores/persistent';

export type Theme = 'light' | 'dark';

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialTheme: Theme = (() => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored) return JSON.parse(stored);
  } catch {}
  return getSystemTheme();
})();

export const theme = persistentAtom<Theme>('theme', initialTheme, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function toggleTheme() {
  const current = theme.get();
  theme.set(current === 'dark' ? 'light' : 'dark');
}
