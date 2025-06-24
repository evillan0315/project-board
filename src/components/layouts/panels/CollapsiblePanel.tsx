import { createSignal, Show, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
interface CollapsiblePanelProps {
  header: string | JSX.Element;
  children: JSX.Element;
  defaultOpen?: boolean;
  icon?: string;
}

export default function CollapsiblePanel(props: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? true);

  return (
    <div class="collapsible-panel flex flex-col h-full">
      <div class="collapsible-panel-header flex items-center justify-between px-2 h-10 cursor-pointer elect-none">
        <div class="font-semibold flex flex-items gap-2">
          {props.icon && <Icon icon={props.icon} width="1.6em" height="1.6em" />}
          {props.header}
        </div>

        <span onClick={() => setIsOpen(!isOpen())}>
          <svg
            class={`mr-1 w-4 h-4 transform transition-transform ${isOpen() ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      <Show when={isOpen()}>
        <div class="flex-1 overflow-auto collapsible-panel-body">{props.children}</div>
      </Show>
    </div>
  );
}
