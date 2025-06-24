// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/ThemeToggle.tsx

import { Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { theme, toggleTheme } from '../stores/theme';
import { useStore } from '@nanostores/solid';

/**
 * Props for the ThemeToggle component.
 */
interface ThemeToggleProps {
  /**
   * Optional CSS class to apply to the button.  Allows for customization of the button's appearance.
   */
  class?: string;
}

/**
 * A simple button that toggles the application's theme between light and dark mode.
 * It uses a basic icon to represent the current theme.
 *
 * @param {ThemeToggleProps} props - The component's props, allowing for optional CSS class customization.
 * @returns {JSX.Element} A JSX element representing the theme toggle button.
 */
export const ThemeToggle = (props: ThemeToggleProps): JSX.Element => {
  const $theme = useStore(theme);
  const isDark = () => $theme() === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class={`rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800 ${props.class || ''}`}
      aria-label={isDark() ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Show
        when={isDark()}
        fallback={
          <svg class="h-5 w-5 text-gray-500 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        }
      >
        <svg class="h-5 w-5 text-sky-400 hover:text-sky-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
          />
        </svg>
      </Show>
    </button>
  );
};

/**
 * Animated Theme Toggle Button Component.
 *
 * This component provides a visually appealing theme toggle switch with an animated transition.
 *
 * @param {ThemeToggleProps} props - The component's props, allowing for optional CSS class customization.
 * @returns {JSX.Element} A JSX element representing the animated theme toggle button.
 */
export const AnimatedThemeToggle = (props: ThemeToggleProps): JSX.Element => {
  const $theme = useStore(theme);
  const isDark = () => $theme() === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800 ${
        isDark() ? 'bg-sky-600' : 'bg-gray-200'
      } ${props.class || ''}`}
      aria-label={isDark() ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span class="sr-only">{isDark() ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      <span
        class={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isDark() ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        <span
          class={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
            isDark() ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
          }`}
          aria-hidden="true"
        >
          <svg class="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" />
          </svg>
        </span>
        <span
          class={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
            isDark() ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
          }`}
          aria-hidden="true"
        >
          <svg class="h-3 w-3 text-sky-600" fill="currentColor" viewBox="0 0 12 12">
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </button>
  );
};

/**
 * A fancy button that toggles the application's theme between light and dark mode.
 * It uses dynamic background and text colors, along with animated icon transitions for a visually appealing effect.
 *
 * @param {ThemeToggleProps} props - The component's props, allowing for optional CSS class customization.
 * @returns {JSX.Element} A JSX element representing the fancy theme toggle button.
 */
export const FancyThemeToggle = (props: ThemeToggleProps): JSX.Element => {
  const $theme = useStore(theme);
  const isDark = () => $theme() === 'dark';

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        class={`relative inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800 ${
          isDark() ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-600'
        } ${props.class || ''}`}
        aria-label={isDark() ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span class="sr-only">{isDark() ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        <Show
          when={isDark()}
          fallback={
            <svg class="h-5 w-5 transition-transform duration-300 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
          }
        >
          <svg class="h-5 w-5 transition-transform duration-300 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </Show>
      </button>
    </>
  );
};
