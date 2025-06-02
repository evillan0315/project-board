import type { JSX } from 'solid-js';

interface LogoProps {
  name: string;
  logo?: string;
  className?: string;
  height?: number;
  width?: number;
}

const Logo = (props: LogoProps): JSX.Element => {
  return (
    <a href="/" class={`-m-1.5 p-1.5 ${props.className || ''}`}>
      <div class="flex align-center justify-center gap-4">
        <span class="sr-only">{props.name || 'Your Company Name'}</span>
        {props.logo ? (
          <img class={`h-${props.height || 8} w-${props.width || 'auto'}`} src={props.logo} alt={props.name} />
        ) : (
          <div
            class={`bg-sky-600 dark:bg-sky-400 text-gray-950 flex w-8 items-center justify-center font-semibold rounded-lg h-${props.height || 8} w-${props.width || 8}`}
          >
            {props.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div class="mt-1 uppercase tracking-widest font-light text-shadow-2xs ">
          <b class="font-bold text-shadow-black">Project</b> Board
        </div>
      </div>
    </a>
  );
};

export default Logo;
