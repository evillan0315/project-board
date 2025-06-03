import { createSignal, onCleanup, onMount } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
//import 'xterm/css/xterm.css';

interface TerminalShellProps {
  fontSize?: number;
  autoFocus?: boolean;
}

export default function TerminalShell(props: TerminalShellProps) {
  let terminalRef!: HTMLDivElement;
  const [socket, setSocket] = createSignal<Socket>();
  const [term, setTerm] = createSignal<Terminal>();
  const [cwd, setCwd] = createSignal('~');

  const commandHistory: string[] = [];
  let historyIndex = -1;
  let currentLine = '';

  const prompt = () => {
    term()?.write(`\x1b[1;32m${cwd()}\x1b[0m $ `);
  };

  const handleCommand = (command: string) => {
    socket()?.emit('exec', command);
  };

  const handleKey = (key: string) => {
    const terminal = term();
    if (!terminal) return;

    switch (key) {
      case '\r': // Enter
        terminal.write('\r\n');
        handleCommand(currentLine);
        commandHistory.push(currentLine);
        historyIndex = commandHistory.length;
        currentLine = '';
        break;
      case '\u007F': // Backspace
        if (currentLine.length > 0) {
          terminal.write('\b \b');
          currentLine = currentLine.slice(0, -1);
        }
        break;
      case '\u001b[A': // Up arrow
        if (historyIndex > 0) {
          historyIndex--;
          const cmd = commandHistory[historyIndex];
          terminal.write('\x1b[2K\r'); // Clear line
          prompt();
          terminal.write(cmd);
          currentLine = cmd;
        }
        break;
      case '\u001b[B': // Down arrow
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          const cmd = commandHistory[historyIndex];
          terminal.write('\x1b[2K\r');
          prompt();
          terminal.write(cmd);
          currentLine = cmd;
        } else {
          historyIndex = commandHistory.length;
          terminal.write('\x1b[2K\r');
          prompt();
          currentLine = '';
        }
        break;
      default:
        terminal.write(key);
        currentLine += key;
    }
  };

  onMount(() => {
    const termInstance = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      convertEol: true,
      fontSize: props.fontSize ?? 12,
      theme: { background: '#030712' },
    });

    const fitAddon = new FitAddon();
    termInstance.loadAddon(fitAddon);
    setTerm(termInstance);

    termInstance.open(terminalRef);
    fitAddon.fit();

    window.addEventListener('resize', () => fitAddon.fit());

    termInstance.onData(handleKey);
    prompt();
    terminalRef.focus();

    terminalRef.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text');
      if (text) termInstance.write(text);
    });

    terminalRef.addEventListener('copy', (e: ClipboardEvent) => {
      const selection = termInstance.getSelection();
      if (selection) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', selection);
      }
    });

    const token = localStorage.getItem('token');

    const socketInstance = io('http://localhost:5000/terminal', {
      auth: { token: `Bearer ${token}` },
      withCredentials: false,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('[✔] Terminal connected');
      termInstance.writeln('Welcome to Terminal');
      termInstance.writeln('');
      handleCommand('osinfo');
      prompt();
    });

    socketInstance.on('output', (msg: string) => {
      termInstance.writeln(msg);
      prompt();
    });

    socketInstance.on('prompt', ({ cwd: newCwd }: { cwd: string }) => {
      setCwd(newCwd);
    });

    socketInstance.on('error', (err: string) => {
      termInstance.writeln(`\x1b[1;31mError:\x1b[0m ${err}`);
      prompt();
    });

    onCleanup(() => {
      window.removeEventListener('resize', () => fitAddon.fit());
      socketInstance.disconnect();
      termInstance.dispose();
    });
  });

  return (
    <div class="p-2 h-full">
      <div ref={(el) => (terminalRef = el)} class="h-full focus:outline-none" tabindex="0" />
    </div>
  );
}
