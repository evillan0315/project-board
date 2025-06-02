// src/components/Toaster.tsx
import { For } from 'solid-js';
import { toasts } from '../stores/toast';

export default function Toaster() {
  return (
    <div class="fixed top-10 right-10 space-y-2 z-50">
      <For each={toasts()}>
        {(toast) => (
          <div
            class={`px-4 py-3 rounded shadow text-white animate-fade-in-out
              ${toast.type === 'success' && 'bg-green-600'}
              ${toast.type === 'error' && 'bg-red-600'}
              ${toast.type === 'info' && 'bg-blue-600'}`}
          >
            {toast.message}
          </div>
        )}
      </For>
    </div>
  );
}
