import { Show } from 'solid-js';

type LoadingProps = {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  type?: 'spinner' | 'dots' | 'bar';
  text?: string;
  backdrop?: boolean;
};

const sizeMap = {
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-12 w-12',
};

const positionMap = {
  top: 'items-start justify-center',
  bottom: 'items-end justify-center',
  left: 'items-center justify-start',
  right: 'items-center justify-end',
  center: 'items-center justify-center',
};

export default function Loading({
  position = 'center',
  size = 'medium',
  type = 'spinner',
  text,
  backdrop = false,
}: LoadingProps) {
  const loaderSize = sizeMap[size];
  const alignment = positionMap[position];

  return (
    <div class={`w-full h-full  flex ${alignment} ${backdrop ? ' inset-0 bg-black/50 z-50' : ''}`}>
      <div class="flex flex-col items-center space-y-2 p-4 relative">
        <div class="top-0 bottom-o right-0 left-0 w-full h-full">
          <Show when={type === 'spinner'}>
            <svg
              class={`animate-spin text-sky-500 ${loaderSize}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </Show>

          <Show when={type === 'dots'}>
            <div class="flex space-x-2">
              <div class={`bg-sky-500 rounded-full ${loaderSize} animate-bounce`} />
              <div class={`bg-sky-500 rounded-full ${loaderSize} animate-bounce delay-150`} />
              <div class={`bg-sky-500 rounded-full ${loaderSize} animate-bounce delay-300`} />
            </div>
          </Show>

          <Show when={type === 'bar'}>
            <div class="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-sky-500 animate-loading-bar" />
            </div>
          </Show>

          <Show when={text}>
            <span class="text-sm text-gray-200 dark:text-gray-300">{text}</span>
          </Show>
        </div>
      </div>
    </div>
  );
}
