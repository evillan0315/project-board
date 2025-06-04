import { Terminal } from '@xterm/xterm';
import { createSignal } from 'solid-js';

export function useTerminal(options: { term: Terminal; prompt?: string; socket?: WebSocket }) {
  const [history, setHistory] = createSignal<string[]>([]);
  let historyIndex = -1;
  let buffer = '';

  const prompt = options.prompt ?? '$ ';
  const term = options.term;
  const socket = options.socket;

  const printPrompt = () => term.write(`\r\n${prompt}`);
  const resetBuffer = () => (buffer = '');

  const handleData = (data: string) => {
    switch (data) {
      case '\r': // ENTER
        term.write('\r\n');
        executeCommand(buffer);
        setHistory([...history(), buffer]);
        historyIndex = history().length;
        resetBuffer();
        printPrompt();
        break;
      case '\u007F': // BACKSPACE
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          term.write('\b \b');
        }
        break;
      case '\u001b[A': // ↑
        if (historyIndex > 0) {
          historyIndex--;
          replaceCurrentLine(history()[historyIndex]);
        }
        break;
      case '\u001b[B': // ↓
        if (historyIndex < history().length - 1) {
          historyIndex++;
          replaceCurrentLine(history()[historyIndex]);
        } else {
          historyIndex = history().length;
          replaceCurrentLine('');
        }
        break;
      default:
        buffer += data;
        term.write(data);
        break;
    }
  };

  const replaceCurrentLine = (line: string) => {
    // Clear line and rewrite prompt + new line
    term.write(`\x1b[2K\r${prompt}${line}`);
    buffer = line;
  };

  const executeCommand = (cmd: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(cmd);
    } else {
      term.writeln(`Command: "${cmd}"`);
    }
  };

  return { handleData, history };
}
