import { createSignal, Show } from 'solid-js';
//import { Dynamic } from 'solid-js/web';
import { Icon } from '@iconify-icon/solid';
import TerminalShell from './TerminalShell';

interface TerminalDrawerProps {
  position?: 'left' | 'right' | 'bottom';
  size?: string;
  fontSize?: number;
  resizable?: boolean;
  draggable?: boolean;
}

function TerminalDrawer(props: TerminalDrawerProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const positionClass = () => {
    switch (props.position) {
      case 'left':
        return 'left-0 top-0 bottom-0 h-full';
      case 'right':
        return 'right-0 top-0 bottom-0 h-full';
      case 'bottom':
      default:
        return 'bottom-0 left-0 right-0 w-full';
    }
  };

  const sizeStyle = () => {
    switch (props.position) {
      case 'left':
      case 'right':
        return `width: ${props.size ?? '400px'};`;
      case 'bottom':
      default:
        return `height: ${props.size ?? '300px'};`;
    }
  };

  const transitionClass = () => {
    switch (props.position) {
      case 'left':
        return 'transition-transform duration-300 transform translate-x-0';
      case 'right':
        return 'transition-transform duration-300 transform translate-x-0';
      case 'bottom':
      default:
        return 'transition-transform duration-300 transform translate-y-0';
    }
  };

  return (
    <>
      <Show when={isOpen()}>
        <div
          class={`fixed z-50 bg-gray-950 text-white shadow-lg mb-8 border ${positionClass()} ${transitionClass()}`}
          style={`${sizeStyle()}; font-size: ${props.fontSize ?? '14px'};`}
        >
          <button
                  onClick={()=>setIsOpen(false)}
                  aria-label="Close Drawer"
                  class="absolute -top-8 right-2 rounded-md p-1 cursor-alias focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:focus:ring-indigo-400"
                >
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {/**<Icon icon="mdi:code-greater-than-or-equal" width="2.2em" height="2.2em"  />**/}
                </button>
          <TerminalShell fontSize={props.fontSize}/>
        </div>
      </Show>

      <button
        onClick={() => setIsOpen(!isOpen())}
        class="fixed -bottom-2 right-2 p-2 z-60 shadow-lg cursor-pointer"
      >
        <Icon icon="mdi:code-greater-than-or-equal" width="1.4em" height="1.4em"  />
      </button>
    </>
  );
}

export default TerminalDrawer;
