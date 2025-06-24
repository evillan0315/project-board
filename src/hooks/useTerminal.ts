import { createSignal } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
import { generateGeminiText } from '../services/gemini';

const TERMINAL_OPTIONS = {
  cursorBlink: true,
  macOptionIsMeta: true,
  altClickMovesCursor: false,
  bellStyle: 'none',
  theme: {
    background: '#1a202c', // Dark background for the terminal
    foreground: '#a0aec0', // Light gray text
    cursor: '#9ae6b4', // Green cursor
    selection: '#4a5568', // Darker gray selection
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
  },
};
interface UseTerminalOptions {
  fontSize?: number;
  prompt?: string;
}

export function useTerminal(options: UseTerminalOptions) {
  const [terminalOpen, setTerminalOpen] = createSignal(false);
  const [term, setTerm] = createSignal<Terminal>();
  const [socket, setSocket] = createSignal<Socket>();
  const fitAddon = new FitAddon();

  let buffer = '';
  let commandHistory: string[] = [];
  let historyIndex = -1;
  const promptStr = options.prompt ?? '$';

  const printPrompt = () => {
    term()?.write(`\x1b[1;32m${promptStr}\x1b[0m `);
  };

  const handleKey = (key: string) => {
    const t = term();
    if (!t) return;

    switch (key) {
      case '\r':
        t.write('\r\n');
        executeCommand(buffer);
        commandHistory.push(buffer);
        historyIndex = commandHistory.length;
        buffer = '';
        break;
      case '\u007F':
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          t.write('\b \b');
        }
        break;
      case '\u001b[A':
        if (historyIndex > 0) {
          historyIndex--;
          replaceLine(commandHistory[historyIndex]);
        }
        break;
      case '\u001b[B':
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          replaceLine(commandHistory[historyIndex]);
        } else {
          historyIndex = commandHistory.length;
          replaceLine('');
        }
        break;
      default:
        buffer += key;
        t.write(key);
    }
  };

  const replaceLine = (line: string) => {
    const t = term();
    if (!t) return;
    t.write(`\x1b[2K\r${promptStr}${line}`);
    buffer = line;
  };

  const executeCommand = (cmd: string) => {
    const s = socket();
    if (s && s.connected) {
      s.emit('exec', cmd);
    } else {
      term()?.writeln(`\x1b[1;31m[WARN]\x1b[0m ${cmd}`);
    }
    printPrompt();
  };

  const initialize = (container: HTMLDivElement) => {
    const t = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: 'monospace',
      fontSize: options.fontSize ?? 10,
      theme: { background: '#000' },
    });
    t.loadAddon(fitAddon);
    t.open(container);
    fitAddon.fit();

    t.onData(handleKey);
    setTerm(t);

    const token = localStorage.getItem('token');
    const s = io(`${import.meta.env.BASE_URL_API}/terminal`, {
      auth: { token: `Bearer ${token}` },
    });

    s.on('connect', () => console.log('[✔] Terminal connected'));
    s.on('output', (msg) => {
      t.writeln(msg);
      printPrompt();
    });
    s.on('outputInfo', (msg) => t.writeln(`[cwd] ${msg.cwd}`));
    s.on('error', (err) => t.writeln(`\x1b[1;31mError:\x1b[0m ${err}`));

    setSocket(s);

    container.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text');
      if (text) t.write(text);
    });

    container.addEventListener('copy', (e) => {
      const selection = t.getSelection();
      if (selection) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', selection);
      }
    });

    printPrompt();
  };
  const toggleTerminal = () => {
    setTerminalOpen(!terminalOpen());
  };
  const handleResize = () => fitAddon.fit();

  const dispose = () => {
    socket()?.disconnect();
    term()?.dispose();
  };

  return {
    term,
    socket,
    initialize,
    handleResize,
    dispose,
    terminalOpen,
    setTerminalOpen,
    toggleTerminal,
  };
}
