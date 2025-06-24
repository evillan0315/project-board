// src/stores/toast.ts
import { createSignal } from 'solid-js';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const [toasts, setToasts] = createSignal<Toast[]>([]);

let idCounter = 0;

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  const id = ++idCounter;
  setToasts((prev) => [...prev, { id, message, type }]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, duration);
}

export { toasts };
