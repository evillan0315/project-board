import { createSignal, onCleanup, onMount } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';
import { Button } from './ui/Button';
import { useTerminal } from '../hooks/useTerminal';

interface TerminalShellProps {
  fontSize?: number;
  autoFocus?: boolean;
  onClose?: () => void;
}

export default function TerminalShell(props: TerminalShellProps) {
  let terminalRef!: HTMLDivElement;
  const [height, setHeight] = createSignal(200);
  const [isResizing, setIsResizing] = createSignal(false);

  const { term, socket, initialize, handleResize, dispose } = useTerminal({
    fontSize: props.fontSize ?? 10,
    prompt: '$',
  });

  const startResizing = () => {
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
  };

  const stopResizing = () => {
    if (isResizing()) {
      setIsResizing(false);
      document.body.style.cursor = '';
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isResizing()) {
      const rect = terminalRef.getBoundingClientRect();
      setHeight(Math.max(100, rect.bottom - e.clientY));
    }
  };

  const closeTerminal = () => props.onClose?.();

  onMount(() => {
    initialize(terminalRef);

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResizing);

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResizing);
      dispose();
    });
  });

  return (
    <div class=" flex flex-col border-t transition-all duration-200">
      <div class="terminal-wrapper flex items-center justify-between "></div>
      <div class="h-1 cursor-ns-resize bg-gray-700 hover:bg-sky-500" onMouseDown={startResizing} />
      <div
        ref={(el) => (terminalRef = el)}
        class="bg-black text-xs font-mono p-2"
        style={{ height: `${height()}px` }}
      />
    </div>
  );
}
