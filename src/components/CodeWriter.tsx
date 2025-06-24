import { type Component, createSignal, onMount } from 'solid-js';
import { renderToString } from 'solid-js/web';
import { Icon } from '@iconify-icon/solid';
import Typewriter from './Typewriter';
import { theme } from '../stores/theme';
import { getThemeExtension } from '../utils/editorTheme';
interface IconProps {
  icon: string;
  width: string;
  height: string;
  class?: string;
}

interface TypewriterCodeWrapperProps {
  codeWriter: string;
}

const TypewriterCodeWrapper: Component<TypewriterCodeWrapperProps> = (props) => {
  return (
    <div class="typewriter-code-wrapper max-w-4xl mx-auto flex items-center my-10 border rounded-xl relative overflow-hidden">
      <div class="absolute top-4 left-8">
        <span class="flex items-center justify-center gap-3">
          <Icon
            icon="mdi:circle"
            width="1em"
            height="1em"
            class="text-gray-950 shadow-sky-500 rounded-full shadow-lg"
          />
          <Icon
            icon="mdi:circle"
            width="1em"
            height="1em"
            class="text-sky-700 bg-sky-700 border border-gray-800 shadow-sky-500 rounded-full shadow-lg"
          />
          <Icon
            icon="mdi:circle"
            width="1em"
            height="1em"
            class="text-red-500 bg-red-500 border border-gray-600 shadow-sky-500 rounded-full shadow-lg"
          />
        </span>
      </div>
      <div class="screen w-full overflow-auto border h-[320px] my-16 mx-16 p-1 rounded-xl animate-shadowPulse transition-shadow duration-500 hover:shadow-[15px_15px_30px_rgba(0,128,255,0.5)] animate-shadowGradient">
        <Typewriter
          text={props.codeWriter}
          typingSpeed={1000}
          deleteSpeed={50}
          loop={false}
          delayBeforeTyping={1000}
          delayBeforeDeleting={500}
          themeExtension={getThemeExtension(theme.get())}
        />
      </div>
    </div>
  );
};

export default TypewriterCodeWrapper;
