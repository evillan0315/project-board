import { atom } from 'nanostores';

export function persistentAtom<T>(key: string, initialValue: T) {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  const store = atom<T>(initial);

  if (typeof window !== 'undefined') {
    store.listen((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return store;
}
