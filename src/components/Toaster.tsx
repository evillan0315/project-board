import { For } from 'solid-js';
import { toasts } from '../stores/toast';

export default function Toaster() {
  return (
    <div class="fixed bottom-10 right-10 space-y-2 z-100">
      <For each={toasts()}>
        {(toast) => (
          <div
            class={`max-w-xl px-2 py-2 rounded-md shadow text-white animate-fade-in-out
              ${toast.type === 'success' ? 'bg-green-600' : ''}
              ${toast.type === 'error' ? 'bg-red-600' : ''}
              ${toast.type === 'info' ? 'bg-blue-600' : ''}`}
            innerHTML={toast.message}
          />
        )}
      </For>
    </div>
  );
}
