import { type JSX } from 'solid-js';
import { A } from '@solidjs/router';

type HeroButton = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showWhen?: 'authenticated' | 'unauthenticated' | 'always';
};
type HeroProps = {
  user?: { name?: string } | null;
  heading: JSX.Element;
  subheading: string;
  buttons?: HeroButton[];
};

const Hero = (props: HeroProps): JSX.Element => {
  const isAuthenticated = () => !!props.user;
  const shouldRenderButton = (btn: HeroButton) => {
    if (btn.showWhen === 'authenticated') return isAuthenticated();
    if (btn.showWhen === 'unauthenticated') return !isAuthenticated();
    return true;
  };
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

      <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-400 mb-6">{props.subheading}</p>

      {isAuthenticated() && (
        <div class="mb-8">
          <p class="text-sky-600 dark:text-sky-400 text-lg font-medium">
             <span>Welcome, {props.user?.name ?? 'Guest'}!</span>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Your projects are just a click away.</p>
        </div>
      )}

      <div class="flex justify-center gap-4 flex-wrap">
        {props.buttons?.filter(shouldRenderButton).map((btn) => (
          <A href={btn.href} class={resolveButtonClasses(btn.variant || 'primary')}>
            {btn.label}
          </A>
        ))}
      </div>
    </section>
  );
};

export default Hero;
