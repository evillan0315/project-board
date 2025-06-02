import { Show, createMemo, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;
  title?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'small' | 'medium' | 'large' | 'full';
  showBackdrop?: boolean;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  class?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  footer?: any;
}

export const Drawer: Component<DrawerProps> = (props) => {
  const position = () => props.position || 'right';
  const size = () => props.size || 'medium';
  const showBackdrop = props.showBackdrop !== false;
  const showHeader = props.showHeader !== false;
  const showCloseButton = props.showCloseButton !== false;
  const closeOnBackdropClick = props.closeOnBackdropClick !== false;
  // 💡 Resizable width (only for left/right)
  const [width, setWidth] = createSignal(400); // initial width in px
  const [height, setHeight] = createSignal(300); // for top/bottom, if you wanna support it
  const isHorizontal = () => position() === 'top' || position() === 'bottom';

  const positionClasses = {
    top: 'inset-x-0 top-0 border-b',
    right: 'inset-y-0 right-0 border-l',
    bottom: 'inset-x-0 bottom-0 border border-t',
    left: 'inset-y-0 left-0 border-r',
  };

  const sizeClasses = {
    top: {
      small: 'h-1/4',
      medium: 'h-1/3',
      large: 'h-1/2',
      full: 'h-screen',
    },
    right: {
      small: 'w-1/4',
      medium: 'w-1/3',
      large: 'w-1/2',
      full: 'w-screen',
    },
    bottom: {
      small: 'h-1/4',
      medium: 'h-1/3',
      large: 'h-1/2',
      full: 'h-screen',
    },
    left: {
      small: 'w-1/4',
      medium: 'w-1/3',
      large: 'w-1/2',
      full: 'w-screen',
    },
  };

  const transformClasses = createMemo(() => {
    if (!props.isOpen) {
      switch (position) {
        case 'top':
          return '-translate-y-full';
        case 'right':
          return 'translate-x-full';
        case 'bottom':
          return 'translate-y-full';
        case 'left':
          return '-translate-x-full';
      }
    } else {
      return 'translate-x-0 translate-y-0'; // default visible
    }
  });
  const drawerStyle = createMemo(() => {
    if (!props.resizable) return undefined;

    if (position() === 'left' || position() === 'right') {
      return { width: `${width()}px` };
    } else if (position() === 'top' || position() === 'bottom') {
      return { height: `${height()}px` };
    }
  });
  const handleResize = (clientX: number, clientY: number) => {
    if (position() === 'left') setWidth(clientX);
    if (position() === 'right') setWidth(window.innerWidth - clientX);
    if (position() === 'top') setHeight(clientY);
    if (position() === 'bottom') setHeight(window.innerHeight - clientY);
  };
  return (
    <Portal>
      {/* Backdrop */}
      <Show when={showBackdrop}>
        <div
          class={`fixed cursor-alias inset-0 z-40 bg-[rgba(0,0,0,0.5)] transition-opacity duration-300 ease-in-out ${
            props.isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => closeOnBackdropClick && props.onClose()}
        />
      </Show>

      {/* Drawer Panel */}
      <Show when={props.isOpen}>
        <div
          class={`fixed z-50 transform shadow-xl transition-transform duration-300 ease-in-out bg-gray-950 ${positionClasses[position()]} ${sizeClasses[position()][size()]} ${transformClasses[position]} flex flex-col ${props.class || ''}`}
          style={drawerStyle()}
        >
          {/* Header */}
          <Show when={props.title || showCloseButton}>
            <div class={`flex items-center justify-between relative ${props.headerClass || ''}`}>
              <h3 class="text-lg font-semibold ">{props.title}</h3>
              <Show when={showCloseButton}>
                <button
                  onClick={props.onClose}
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
                </button>
              </Show>
            </div>
          </Show>

          {/* Body */}
          <div class={`flex-1 overflow-y-auto px-4 py-2 border-gray-950 ${props.bodyClass || ''}`}>
            {props.children}
          </div>

          {/* Footer */}
          <Show when={props.footer}>
            <div class={`flex px-4 py-3 0 ${props.footerClass || ''}`}>{props.footer}</div>
          </Show>
          <div
            class={`absolute ${
              position() === 'left' ? 'right-0' : position() === 'right' ? 'left-0' : ''
            } top-0 h-screen`}
          ></div>
        </div>
      </Show>
    </Portal>
  );
};
