// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/Hero.tsx

import { type JSX } from 'solid-js';
import { A } from '@solidjs/router';
import { Button } from './ui/Button';

/**
 * Defines the structure for a button displayed within the Hero component.  Allows for customization
 * of the button's label, link, visual appearance (variant), and visibility based on user authentication status.
 */
type HeroButton = {
  /**
   * The text displayed on the button.
   */
  label: string;
  /**
   * The URL that the button links to.
   */
  href: string;
  /**
   * The visual style of the button.  Can be 'primary', 'secondary', or 'outline'.  Defaults to no styling if not specified.
   */
  variant?: 'primary' | 'secondary' | 'outline';
  /**
   * Determines when the button should be displayed.
   * - 'authenticated': Only show when the user is authenticated.
   * - 'unauthenticated': Only show when the user is not authenticated.
   * - 'always': Always show the button.
   */
  showWhen?: 'authenticated' | 'unauthenticated' | 'always';
};

/**
 * Defines the properties required for the Hero component.  Allows for customization
 * of the heading, subheading, buttons, user display, and user object.
 */
type HeroProps = {
  /**
   * An optional user object containing user information.  Used for displaying personalized content.
   * Can be null or undefined to represent a non-authenticated user.
   */
  user?: { name?: string } | null;
  /**
   * The main heading of the hero section.  Can be any JSX element, allowing for rich text formatting.
   */
  heading: JSX.Element;
  /**
   * A subheading providing additional context or information.
   */
  subheading: string;
  /**
   * An array of `HeroButton` objects defining the buttons to be displayed in the hero section.
   * If not provided, no buttons will be rendered.
   */
  buttons?: HeroButton[];
  /**
   * A boolean flag indicating whether to display user-specific information (e.g., "Welcome, [User]!").
   * Only displayed when the user is authenticated and showUser is true.
   */
  showUser?: boolean;
};

/**
 * A Hero component that displays a heading, subheading, optional user greeting, and a set of buttons.
 *
 * @param {HeroProps} props - The properties for configuring the Hero component.
 * @returns {JSX.Element} - The rendered Hero component.
 */
const Hero = (props: HeroProps): JSX.Element => {
  /**
   * Determines if a user is authenticated based on the presence of a user object in the props.
   *
   * @returns {boolean} - True if the user is authenticated, false otherwise.
   */
  const isAuthenticated = (): boolean => !!props.user;

  /**
   * Determines whether a button should be rendered based on its `showWhen` property and the current authentication status.
   *
   * @param {HeroButton} btn - The button to check.
   * @returns {boolean} - True if the button should be rendered, false otherwise.
   */
  const shouldRenderButton = (btn: HeroButton): boolean => {
    if (btn.showWhen === 'authenticated') return isAuthenticated();
    if (btn.showWhen === 'unauthenticated') return !isAuthenticated();
    return true;
  };

  /**
   * Resolves the CSS class names for a button based on its variant.
   *
   * @param {string} variant - The variant of the button.
   * @returns {string} - The CSS class names for the button.
   */
  const resolveButtonClasses = (variant: string): string => {
    switch (variant) {
      case 'primary':
        return 'rounded-md bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition';
      case 'secondary':
        return 'rounded-md bg-sky-500 px-6 py-3 text-gray-950 font-semibold hover:bg-sky-600 dark:hover:bg-gray-900 dark:hover:text-gray-200 transition';
      case 'outline':
        return 'rounded-md border border-sky-600 px-6 py-3 text-sky-600 font-semibold hover:bg-sky-100 dark:hover:bg-sky-500 transition';
      default:
        return '';
    }
  };

  return (
    <section class="text-center py-16 px-4">
      <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">{props.heading}</h1>

      <p class="text-lg sm:text-xl mb-6">{props.subheading}</p>

      {isAuthenticated() && props.showUser && (
        <div class="mb-8">
          <p class="text-sky-600 dark:text-sky-400 text-lg font-medium">
            <span>Welcome, {props.user?.name ?? 'Guest'}!</span>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Your projects are just a click away.</p>
        </div>
      )}

      <div class="flex justify-center gap-4 flex-wrap">
        {props.buttons?.filter(shouldRenderButton).map((btn) => (
          <A href={btn.href}>
            <Button variant={btn.variant} class={`px-6 py-3 font-semibold`}>
              {btn.label}
            </Button>
          </A>
        ))}
      </div>
    </section>
  );
};

export default Hero;
