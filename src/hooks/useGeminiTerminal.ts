// src/hooks/useTerminal.ts (now useGeminiTerminal.ts)
import { createSignal, onCleanup, type Accessor } from 'solid-js';
import { Terminal, ITheme } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { generateGeminiText, generateGeminiFile } from '../services/gemini';
import { useEditorFile } from './useEditorFile'; // Assuming this hook is available
import { editorFilePath, editorContent, editorLanguage } from '../stores/editorContent';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating conversation IDs

// Import the system instruction constant
import {
  SYSTEM_INSTRUCTIONS_BASH_ADMIN_EXPERT,
  SYSTEM_INSTRUCTIONS_DEVOPS_EXPERT,
  SYSTEM_INSTRUCTIONS_FULLSTACK_DEVELOPER_EXPERT,
  SYSTEM_INSTRUCTIONS_SOFTWARE_ENGINEER_EXPERT,
} from '../constants/aiPersona';

// Define the theme interface for xterm.js to ensure type safety
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

// Basic Xterm.js options
const TERMINAL_OPTIONS = {
  cursorBlink: true,
  macOptionIsMeta: true,
  altClickMovesCursor: false,
  bellStyle: 'none',
  theme: {
    background: '#000000', // Dark background for the terminal
    foreground: '#ffffff', // Light gray text
    cursor: '#9ae6b4', // Green cursor
    selection: '#38b2ac', // Darker gray selection
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
  } as XtermTheme, // Assert the theme type
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

/**
 * Custom SolidJS hook for managing an xterm.js terminal instance,
 * now integrated with the Google Gemini AI service and conversation state.
 *
 * @param {UseTerminalProps} props
 * @returns {UseTerminalReturn}
 */
export function useGeminiTerminal(props: UseTerminalProps): UseTerminalReturn {
  // `terminalOpen` signal seems unused, consider removing if not controlling visibility elsewhere
  // const [terminalOpen, setTerminalOpen] = createSignal(false);
  let term: Terminal | undefined; // xterm.js Terminal instance
  let fitAddon: FitAddon | undefined; // FitAddon instance for resizing
  let inputBuffer: string = ''; // Buffer to store user input
  let commandHistory: string[] = []; // Simple history for up/down arrows
  let historyIndex: number = -1;

  const [isProcessingCommand, setIsProcessingCommand] = createSignal<boolean>(false);
  const [conversationId, setConversationId] = createSignal<string | undefined>(undefined);
  const [currentSystemInstruction, setCurrentSystemInstruction] = createSignal<string | undefined>(undefined);

  const GEMINI_PROMPT: string = '🤖 AI > '; // Custom prompt for Gemini interaction

  /**
   * Writes the custom Gemini prompt to the terminal.
   */
  const writePrompt = (): void => {
    if (term) {
      term.write(`\r\n${GEMINI_PROMPT}`);
    }
  };

  /**
   * Initializes the xterm.js terminal and sets up event listeners.
   * @param {HTMLDivElement} terminalElement The DOM element to attach the terminal to.
   */
  const initialize = (terminalElement: HTMLDivElement): void => {
    if (!terminalElement) {
      console.error('Terminal element not found.');
      return;
    }

    term = new Terminal({
      fontSize: props.fontSize ?? 12,
      ...TERMINAL_OPTIONS,
    });
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalElement);
    fitAddon.fit(); // Initial fit

    term.write('Welcome to the AI-powered terminal!\r\n');
    term.write('Type your questions or commands below.\r\n');
    term.write('\r\n');
    term.write('Commands:\r\n');
    term.write('  /new                 - Start a new conversation, resetting system instruction.\r\n');
    term.write('  /system <instruction> - Set a system instruction (persona) for the current/new conversation.\r\n');
    term.write('  /persona bash-admin  - Load the expert Bash Admin persona.\r\n'); // New command for persona
    term.write('  /file <prompt>      - Analyze the current editor file content with a prompt.\r\n');
    writePrompt();

    // Event listener for user input
    term.onData((data: string) => {
      if (isProcessingCommand()) {
        return;
      }
      const charCode: number = data.charCodeAt(0);

      // Handle special keys
      if (charCode === 13) {
        // Enter key
        term?.write('\r\n'); // Move to a new line
        processCommand(inputBuffer.trim());
        inputBuffer = ''; // Clear the buffer
      } else if (charCode === 127) {
        // Backspace
        if (inputBuffer.length > 0) {
          term?.write('\b \b');
          inputBuffer = inputBuffer.slice(0, -1);
        }
      } else if (charCode === 27) {
        // Escape sequences (e.g., arrow keys)
        if (data === '\x1b[A') {
          // Up arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputBuffer = commandHistory[historyIndex];
            term?.write('\x1b[2K\r');
            term?.write(GEMINI_PROMPT + inputBuffer);
          }
        } else if (data === '\x1b[B') {
          // Down arrow
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
        // Printable characters
        term?.write(data);
        inputBuffer += data;
        historyIndex = -1;
      }
    });
  };

  /**
   * Processes the user's command, handling special commands and sending to Gemini.
   * @param {string} command The command/prompt entered by the user.
   */
  const processCommand = async (command: string): Promise<void> => {
    if (!command) {
      writePrompt();
      return;
    }

    // Add command to history
    if (command && commandHistory[0] !== command) {
      commandHistory.unshift(command);
    }
    historyIndex = -1;

    let promptToSend: string = command;
    let systemInstructionToSend: string | undefined = undefined; // Will be sent only on new convo with instruction or /system command
    let currentConvId = conversationId(); // Get current conversation ID

    // --- Command Parsing ---
    if (command.startsWith('/new')) {
      setConversationId(undefined); // Reset conversation
      setCurrentSystemInstruction(undefined); // Reset system instruction
      term?.write('\x1b[36mStarting a new conversation.\x1b[0m\r\n');
      writePrompt();
      return; // Do not send anything to Gemini for /new command
    } else if (command.startsWith('/system ')) {
      setIsProcessingCommand(true); // Indicate processing for command
      const instruction = command.substring('/system '.length).trim();
      if (instruction) {
        setCurrentSystemInstruction(instruction); // Store this as the active system instruction

        if (!currentConvId) {
          // If setting system instruction on a new conversation, generate ID now
          currentConvId = uuidv4();
          setConversationId(currentConvId);
          term?.write(`\x1b[36mNew conversation started with ID:\x1b[0m ${currentConvId}\r\n`);
        }
        term?.write(`\x1b[36mSystem instruction set for conversation:\x1b[0m "${instruction}"\r\n`);
      } else {
        term?.write('\x1b[31mError:\x1b[0m Please provide a system instruction (e.g., /system Act as a pirate).\r\n');
      }
      setIsProcessingCommand(false);
      writePrompt();
      return; // Do not send anything to Gemini for /system command itself
    } else if (command === '/persona bash-admin') {
      // New persona command
      setIsProcessingCommand(true);
      setCurrentSystemInstruction(SYSTEM_INSTRUCTIONS_BASH_ADMIN_EXPERT);

      if (!currentConvId) {
        currentConvId = uuidv4();
        setConversationId(currentConvId);
        term?.write(`\x1b[36mNew conversation started with ID:\x1b[0m ${currentConvId}\r\n`);
      }
      term?.write(
        '\x1b[36mLoaded "Bash Admin Expert" persona. Ask me about Linux, scripting, and system management!\x1b[0m\r\n',
      );
      setIsProcessingCommand(false);
      writePrompt();
      return; // Do not send anything to Gemini for this command
    } else if (command.startsWith('/file ')) {
      setIsProcessingCommand(true);
      term?.write('\x1b[33mProcessing...\x1b[0m\r\n');

      const editorContentValue = editorContent.get(); // Accessing Solid.js store
      const editorFilePathValue = editorFilePath.get();

      if (!editorContentValue) {
        term?.write('\x1b[31mError:\x1b[0m No file content in editor to analyze. Open a file.\r\n');
        setIsProcessingCommand(false);
        writePrompt();
        return;
      }

      promptToSend = command.substring('/file '.length).trim();
      if (!promptToSend) {
        term?.write(
          '\x1b[31mError:\x1b[0m Please provide a prompt for file analysis (e.g., /file summarize this code).\r\n',
        );
        setIsProcessingCommand(false);
        writePrompt();
        return;
      }

      term?.write(`\x1b[33mAnalyzing file '${editorFilePathValue || 'current editor file'}'...\x1b[0m\r\n`);

      // Ensure we have a conversation ID for file analysis
      if (!currentConvId) {
        currentConvId = uuidv4();
        setConversationId(currentConvId);
        term?.write(`\x1b[36mNew conversation started with ID:\x1b[0m ${currentConvId}\r\n`);
        // If it's a new convo and system instruction is set, include it
        systemInstructionToSend = currentSystemInstruction();
      } else {
        // For ongoing conversations, do NOT send systemInstruction. Backend will retrieve it.
        systemInstructionToSend = undefined;
      }

      console.log(editorFilePathValue, editorContentValue);
      try {
        const fileData = {
          data: btoa(unescape(encodeURIComponent(editorContentValue))), // Correctly handle UTF-8 to base64
          name: editorFilePathValue?.split('/').pop() || 'untitled.txt',
          type: editorLanguage.get(), // Or detect based on file extension more accurately
        };

        console.log(editorFilePathValue, editorContentValue);
        const response = await generateGeminiFile(promptToSend, fileData, systemInstructionToSend, currentConvId);
        term?.write('\r\n');
        term?.write('\x1b[32mAI Response (File Analysis):\x1b[0m\r\n');
        response.split('\n').forEach((line) => {
          term?.write(`${line}\r\n`);
        });
      } catch (error: any) {
        term?.write('\r\n');
        term?.write('\x1b[31mError during file analysis:\x1b[0m ');
        term?.write((error.message || 'An unexpected error occurred during file analysis.') + '\r\n');
      } finally {
        setIsProcessingCommand(false);
        writePrompt();
      }
      return; // Exit after handling /file command
    }

    // --- Standard Text Prompt Handling ---
    setIsProcessingCommand(true);
    term?.write('\x1b[33mProcessing with...\x1b[0m\r\n');

    promptToSend = command; // The command itself is the prompt

    // Ensure we have a conversation ID for regular prompts
    if (!currentConvId) {
      currentConvId = uuidv4();
      setConversationId(currentConvId);
      term?.write(`\x1b[36mNew conversation started with ID:\x1b[0m ${currentConvId}\r\n`);
      // If it's a new conversation and system instruction is set, send it with this first prompt
      systemInstructionToSend = currentSystemInstruction();
    } else {
      // For ongoing conversations, do NOT send systemInstruction with regular prompts.
      // The backend will retrieve it based on the conversationId.
      systemInstructionToSend = undefined;
    }

    try {
      const response: string = await generateGeminiText(promptToSend, systemInstructionToSend, currentConvId);
      term?.write('\r\n');
      term?.write('\x1b[32mAI Response:\x1b[0m\r\n');
      response.split('\n').forEach((line) => {
        term?.write(`${line}\r\n`);
      });
    } catch (error: any) {
      term?.write('\r\n');
      term?.write('\x1b[31mError:\x1b[0m ');
      term?.write((error.message || 'An unexpected error occurred.') + '\r\n');
    } finally {
      setIsProcessingCommand(false);
      writePrompt();
    }
  };

  /**
   * Handles terminal resizing to fit its container.
   */
  const handleResize = (): void => {
    if (term && fitAddon) {
      fitAddon.fit();
    }
  };

  /**
   * Cleans up the terminal instance and associated resources.
   */
  const dispose = (): void => {
    if (term) {
      term.dispose();
      term = undefined;
    }
    if (fitAddon) {
      fitAddon = undefined;
    }
  };

  onCleanup(() => {
    dispose();
  });

  return {
    term,
    initialize,
    handleResize,
    dispose,
    isProcessingCommand,
  };
}
