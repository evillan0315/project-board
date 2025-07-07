import { createSignal, Show, onMount, createEffect, onCleanup, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

interface CollapsiblePanelProps {
  header: string | JSX.Element;
  children: JSX.Element;
  defaultOpen?: boolean;
  icon?: string;
  onToggle?: (isOpen: boolean, height: number) => void; // Optional callback to inform parent
}

export default function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? true);
  let rootRef: HTMLDivElement | undefined;

  const measureHeight = () => {
    if (rootRef) {
      const height = rootRef.offsetHeight;
      props.onToggle?.(isOpen(), height);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      queueMicrotask(measureHeight); // defer to next tick
      return next;
    });
  };

  onMount(() => {
    measureHeight();
    const resizeObserver = new ResizeObserver(() => measureHeight());
    if (rootRef) resizeObserver.observe(rootRef);
    onCleanup(() => resizeObserver.disconnect());
  });

  return (
    <div ref={rootRef} class="collapsible-panel flex flex-col w-full">
      <div
        class="collapsible-panel-header flex items-center justify-between px-2 h-10 cursor-pointer select-none"
        onClick={toggleOpen}
      >
        <div class="font-semibold flex items-center gap-2">
          {props.icon && <Icon icon={props.icon} width="1.6em" height="1.6em" />}
          {props.header}
        </div>

        <svg
          class={`mr-1 w-4 h-4 transform transition-transform duration-200 ${isOpen() ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <Show when={isOpen()}>
        <div class="collapsible-panel-body py-1">{props.children}</div>
      </Show>
    </div>
  );
}
