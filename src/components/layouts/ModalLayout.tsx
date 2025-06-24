import type { JSX } from 'solid-js';

interface ModalLayoutProps {
  title: string;
  onClose: () => void;
  children: JSX.Element;
}

export default function ModalLayout(props: ModalLayoutProps): JSX.Element {
  return (
    <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-30 transition-opacity duration-300">
      <div class="bg-gray-900 rounded-lg shadow-lg w-96 max-w-full p-4">
        <div class="flex justify-between items-center pb-2 mb-2">
          <h2 class="text-sky-500 font-bold">{props.title}</h2>
          <button class="text-gray-400 hover:text-red-400" onClick={props.onClose}>
            &times;
          </button>
        </div>
        <div class="space-y-3 text-sm">{props.children}</div>
      </div>
    </div>
  );
}
