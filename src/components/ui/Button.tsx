import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export function Button(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [local, others] = splitProps(props, ['class', 'disabled', 'children']);

  return (
    <button
      class={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors
        bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
        ${local.class || ''}`}
      disabled={local.disabled}
      {...others}
    >
      {local.children}
    </button>
  );
}
