import { type Component } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import Typewriter from './Typewriter'; // Adjust the path if necessary
import { getThemeExtension } from '../utils/editorTheme'; // Adjust the path if necessary

interface CodeWriterPanelProps {
  codeWriter: string;
  theme?: { get: () => string };
}

const CodeWriterPanel: Component<CodeWriterPanelProps> = (props) => {
  return (
    <div class="typewriter-code-wrapper h-auto w-full max-w-4xl mx-auto flex items-center my-10 border rounded-xl relative">
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
      <div class="screen w-full border h-[320px] overflow-auto my-10 mx-10 p-1 rounded-xl animate-shadowPulse transition-shadow duration-500 hover:shadow-[15px_15px_30px_rgba(0,128,255,0.5)] animate-shadowGradient">
        <Typewriter
          text={props.codeWriter}
          typingSpeed={50}
          deleteSpeed={40}
          loop={false}
          delayBeforeTyping={1000}
          delayBeforeDeleting={500}
          themeExtension={getThemeExtension(props.theme.get())}
        />
      </div>
    </div>
  );
};

export default CodeWriterPanel;
