// src/components/ui/RightDrawer.tsx
/*import { type JSX, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { createSignal, onCleanup, onMount } from 'solid-js';

type RightDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
};

export default function RightDrawer(props: RightDrawerProps): JSX.Element {
  const [visible, setVisible] = createSignal(false);

  onMount(() => {
    requestAnimationFrame(() => setVisible(true)); // Trigger transition after mount
  });

  onCleanup(() => {
    setVisible(false);
  });

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-40 flex justify-end">
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          classList={{ 'opacity-100': visible(), 'opacity-0': !visible() }}
          onClick={props.onClose}
        ></div>
        <div
          class="relative z-50 w-full max-w-lg bg-gray-900 text-white shadow-xl flex flex-col transform transition-transform duration-300"
          classList={{
            'translate-x-0': visible(),
            'translate-x-full': !visible(),
          }}
        >
          <div class="flex justify-between items-center border-b border-gray-700 p-4">
            <span class="text-lg font-semibold">Generate Code</span>
            <button onClick={props.onClose}>
              <Icon icon="mdi:close" width="1.5em" height="1.5em" />
            </button>
          </div>
          <div class="flex-1 overflow-auto p-4">{props.children}</div>
        </div>
      </div>
    </Show>
  );
}*/

// src/components/ui/RightDrawer.tsx
import { type JSX, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { createSignal, onMount } from 'solid-js';

type RightDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  title?: string;
};

export default function RightDrawer(props: RightDrawerProps): JSX.Element {
  const [visible, setVisible] = createSignal(false);

  // Trigger entry animation
  onMount(() => {
    //if (props.isOpen) {
    requestAnimationFrame(() => setVisible(true));
    //}
  });

  // Watch prop change
  if (!props.isOpen) {
    setVisible(false);
  }

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-40 flex justify-end bg-black">
        {/* Backdrop */}
        <div
          class="fixed inset-0 bg-black/70 transition-opacity duration-300"
          classList={{
            'opacity-100': visible(),
            'opacity-0': !visible(),
          }}
          onClick={props.onClose}
        ></div>

        {/* Drawer */}
        <div
          class="relative z-200 w-full max-w-lg bg-black shadow-xl flex flex-col transform transition-transform duration-300"
          classList={{
            'translate-x-0': visible(), // Slide in to position
            'translate-x-full': !visible(), // Start/exit fully offscreen
          }}
        >
          <div class="flex justify-between items-center border-b border-gray-700 p-4">
            <span class="text-lg font-semibold">{props.title || 'Generate'}</span>
            <button onClick={props.onClose}>
              <Icon icon="mdi:close" width="1.5em" height="1.5em" />
            </button>
          </div>
          <div class="flex-1 overflow-auto p-4">{props.children}</div>
        </div>
      </div>
    </Show>
  );
}
