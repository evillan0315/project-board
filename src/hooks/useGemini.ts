// src/hooks/useTerminal.ts (now useGeminiTerminal.ts)
import { createSignal, onCleanup, type Accessor } from 'solid-js';
import { Terminal, ITheme } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { generateGeminiText } from '../services/gemini';
import { v4 as uuidv4 } from 'uuid';

interface XtermTheme extends ITheme {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

const TERMINAL_OPTIONS = {
  cursorBlink: true,
  macOptionIsMeta: true,
  altClickMovesCursor: false,
  bellStyle: 'none',
  theme: {
    background: '#000000',
    foreground: '#ffffff',
    cursor: '#9ae6b4',
    selection: '#38b2ac',
    black: '#000000',
    red: '#e53e3e',
    green: '#48bb78',
    yellow: '#ecc94b',
    blue: '#4299e1',
    magenta: '#9f7aea',
    cyan: '#38b2ac',
    white: '#ffffff',
    brightBlack: '#2d3748',
    brightRed: '#f56565',
    brightGreen: '#68d391',
    brightYellow: '#f6e05e',
    brightBlue: '#63b3ed',
    brightMagenta: '#b794f4',
    brightCyan: '#4fd1c5',
    brightWhite: '#edf2f7',
  } as XtermTheme,
};

interface UseTerminalProps {
  fontSize?: number;
  prompt?: string;
}

interface UseTerminalReturn {
  term: Terminal | undefined;
  initialize: (terminalElement: HTMLDivElement) => void;
  handleResize: () => void;
  dispose: () => void;
  isProcessingCommand: Accessor<boolean>;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(term: Terminal, text: string, delayMs: number = 5): Promise<void> {
  for (const char of text) {
    term.write(char);
    await delay(delayMs);
  }
}

async function typeMultiline(term: Terminal, text: string, delayMs: number = 5): Promise<void> {
  const lines = text.split('\n');
  for (const line of lines) {
    await typeText(term, line + '\r\n', delayMs);
  }
}

export function useGeminiTerminal(props: UseTerminalProps): UseTerminalReturn {
  let term: Terminal | undefined;
  let fitAddon: FitAddon | undefined;
  let inputBuffer: string = '';
  let commandHistory: string[] = [];
  let historyIndex: number = -1;

  const [isProcessingCommand, setIsProcessingCommand] = createSignal<boolean>(false);
  const [conversationId, setConversationId] = createSignal<string | undefined>(undefined);
  const [isWriting, setIsWriting] = createSignal<boolean>(false);
  const GEMINI_PROMPT: string = '🤖 AI > ';

  const writePrompt = (): void => {
    if (term) {
      term.write(`\r\n${GEMINI_PROMPT}`);
    }
  };

  const initialize = (terminalElement: HTMLDivElement): void => {
    if (!terminalElement) return;
    term = new Terminal({ fontSize: props.fontSize ?? 12, ...TERMINAL_OPTIONS });
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalElement);
    fitAddon.fit();

    term.write('Welcome to the AI-powered terminal!\r\n');
    term.write('Type your questions or commands below.\r\n\r\n');
    writePrompt();

    term.onData((data: string) => {
      if (isProcessingCommand()) return;
      const charCode = data.charCodeAt(0);

      if (charCode === 13) {
        term?.write('\r\n');
        processCommand(inputBuffer.trim());
        inputBuffer = '';
      } else if (charCode === 127) {
        if (inputBuffer.length > 0) {
          term?.write('\b \b');
          inputBuffer = inputBuffer.slice(0, -1);
        }
      } else if (charCode === 27) {
        if (data === '\x1b[A') {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputBuffer = commandHistory[historyIndex];
            term?.write('\x1b[2K\r');
            term?.write(GEMINI_PROMPT + inputBuffer);
          }
        } else if (data === '\x1b[B') {
          if (historyIndex > 0) {
            historyIndex--;
            inputBuffer = commandHistory[historyIndex];
            term?.write('\x1b[2K\r');
            term?.write(GEMINI_PROMPT + inputBuffer);
          } else if (historyIndex === 0) {
            historyIndex = -1;
            inputBuffer = '';
            term?.write('\x1b[2K\r');
            term?.write(GEMINI_PROMPT);
          }
        }
      } else if (charCode >= 32 && charCode <= 126) {
        term?.write(data);
        inputBuffer += data;
        historyIndex = -1;
      }
    });
  };

  const processCommand = async (command: string): Promise<void> => {
    if (!command) return writePrompt();
    if (commandHistory[0] !== command) commandHistory.unshift(command);
    historyIndex = -1;

    let currentConvId = conversationId();
    setIsProcessingCommand(true);

    if (!currentConvId) {
      currentConvId = uuidv4();
      setConversationId(currentConvId);
      if (term) await typeMultiline(term, `New conversation started with ID: ${currentConvId}`, 1);
    }

    try {
      const response: string = await generateGeminiText(command, undefined, currentConvId);
      if (term) {
        setIsWriting(true);
        await typeMultiline(term, '\r\n\x1b[32mAI Response:\x1b[0m', 1);
        await typeMultiline(term, response, 1);
        setIsWriting(false);
      }
    } catch (error: any) {
      term?.write('\r\n\x1b[31mError:\x1b[0m ' + (error.message || 'Unexpected error') + '\r\n');
    } finally {
      setIsProcessingCommand(false);
      writePrompt();
    }
  };

  const handleResize = (): void => {
    if (term && fitAddon) fitAddon.fit();
  };

  const dispose = (): void => {
    term?.dispose();
    term = undefined;
    fitAddon = undefined;
  };

  onCleanup(dispose);

  return {
    term,
    initialize,
    handleResize,
    dispose,
    isProcessingCommand,
    isWriting,
  };
}
