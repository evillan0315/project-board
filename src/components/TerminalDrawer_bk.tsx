// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/TerminalDrawer.tsx

import { createSignal, Show, createEffect, onCleanup } from 'solid-js';
import { type Setter } from 'solid-js';
import TerminalShell from './TerminalShell';

/**
 * Defines the properties for the `TerminalDrawer` component.
 */
interface TerminalDrawerProps {
  /**
   * A boolean value indicating whether the terminal drawer is open or closed.
   */
  isOpen: boolean;
  /**
   * A setter function to update the `isOpen` state.
   */
  setIsOpen: Setter<boolean>;
  /**
   * The position of the terminal drawer on the screen.  Defaults to 'bottom'.
   */
  position?: 'left' | 'right' | 'bottom';
  /**
   * The size of the terminal drawer.  If `position` is 'bottom', this represents the height in pixels.
   * If `position` is 'left' or 'right', this represents the width.  Defaults to '300' for height and '400px' for width.
   */
  size?: string;
  /**
   * The font size of the text within the terminal.  Defaults to 14px.
   */
  fontSize?: number;
  /**
   * A boolean value indicating whether the terminal drawer is resizable. Only applicable for 'bottom' position.
   */
  resizable?: boolean;
  /**
   * A boolean value indicating whether the terminal drawer is draggable.  Not currently implemented.
   */
  draggable?: boolean;
  /**
   * A callback function that is called when the terminal drawer opens.
   */
  onOpen?: () => void;
}

/**
 * A component that renders a terminal shell in a drawer that can be opened and closed.
 *
 * @param props The properties for the component.
 * @returns A SolidJS component.
 */
function TerminalDrawer(props: TerminalDrawerProps) {
  const [height, setHeight] = createSignal(parseInt(props.size ?? '300', 10));
  const [resizing, setResizing] = createSignal(false);

  createEffect(() => {
    if (props.isOpen) {
      props.onOpen?.();
    }
  });

  /**
   * Determines the CSS class for the drawer's position.
   *
   * @returns The CSS class string based on the `position` prop.
   */
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

  /**
   * Determines the CSS style for the drawer's size (height or width).
   *
   * @returns The CSS style string based on the `position` and `size` props.
   */
  const sizeStyle = () => {
    if (props.position === 'bottom') {
      return `height: ${height()}px;`;
    } else if (props.position === 'left' || props.position === 'right') {
      return `width: ${props.size ?? '400px'};`;
    }
    return '';
  };

  /**
   * Determines the CSS class for the drawer's transition animation.
   *
   * @returns The CSS class string based on the `position` prop.
   */
  const transitionClass = () => {
    switch (props.position) {
      case 'left':
      case 'right':
        return 'transition-transform duration-300 transform translate-x-0';
      case 'bottom':
      default:
        return 'transition-transform duration-300 transform translate-y-0';
    }
  };

  /**
   * Handles the mouse down event on the resize handle.
   *
   * @param e The MouseEvent object.
   */
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  };

  /**
   * Handles the mouse move event while resizing.
   *
   * @param e The MouseEvent object.
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (resizing() && props.position === 'bottom') {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight >= 100) setHeight(newHeight);
    }
  };

  /**
   * Handles the mouse up event, stopping the resizing.
   */
  const handleMouseUp = () => {
    setResizing(false);
  };

  /**
   * Sets up event listeners for mousemove and mouseup when resizable is true.
   */
  createEffect(() => {
    if (props.resizable) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      onCleanup(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      });
    }
  });

  return (
    <Show when={props.isOpen}>
      <div
        class={`relative z-50 dark:bg-gray-950 shadow-lg mb-4 border-t border-gray-800/50 pt-0 ${positionClass()} ${transitionClass()}`}
        style={`${sizeStyle()} font-size: ${props.fontSize ?? '14px'};`}
      >
        <button
          onClick={() => props.setIsOpen(false)}
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

        <TerminalShell fontSize={props.fontSize} />

        {props.resizable && props.position === 'bottom' && (
          <div
            onMouseDown={handleMouseDown}
            class="absolute top-0 left-0 right-0 h-2 cursor-row-resize bg-gray-700/20 hover:bg-gray-600/30"
          />
        )}
      </div>
    </Show>
  );
}

export default TerminalDrawer;
