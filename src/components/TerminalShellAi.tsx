import { createSignal, onCleanup, onMount } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client'; //  import seems unused
import '@xterm/xterm/css/xterm.css';
import { Button } from './ui/Button';
import { useGeminiTerminal } from '../hooks/useGemini';

interface TerminalShellProps {
  fontSize?: number;
  autoFocus?: boolean; // Not used
  onClose?: () => void;
}

export default function TerminalShellAi(props: TerminalShellProps) {
  let terminalRef!: HTMLDivElement;
  const [height, setHeight] = createSignal(200);
  const [isResizing, setIsResizing] = createSignal(false);

  // Use the updated hook
  const { term, initialize, handleResize, dispose, isProcessingCommand, isWriting } = useGeminiTerminal({
    fontSize: props.fontSize ?? 12,
  });
  const fitAddon = new FitAddon();
  const startResizing = (e: MouseEvent) => {
    e.preventDefault(); // Prevent text selection during resize
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
    fitAddon.fit();
  };

  const stopResizing = () => {
    if (isResizing()) {
      setIsResizing(false);
      document.body.style.cursor = '';
      // After resizing stops, fit the terminal to the new size
      fitAddon.fit();
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isResizing()) {
      const rect = terminalRef.getBoundingClientRect();
      // Calculate the new height based on mouse position
      let newHeight = rect.bottom - e.clientY;
      newHeight = Math.max(100, newHeight); // Minimum height

      // Ensure the height is within reasonable bounds (optional)
      newHeight = Math.min(window.innerHeight - 50, newHeight); // Prevent going off-screen

      setHeight(newHeight);
      // Important: Force xterm.js to redraw with the new size.
      term?.resize(term.cols, Math.floor(newHeight / (term.rows / term.rows)));
      fitAddon.fit();
    }
  };

  const closeTerminal = () => props.onClose?.();

  onMount(() => {
    initialize(terminalRef); // Initialize the terminal instance

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.addEventListener('mouseleave', stopResizing); //stop resizing when mouse leaves the window

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResizing);
      document.removeEventListener('mouseleave', stopResizing);
      dispose(); // Clean up xterm.js instance
    });
  });

  return (
    <div class="flex flex-col h-auto transition-all duration-200">
      <div class="h-1 cursor-ns-resize resizer hover:bg-sky-500" onMouseDown={startResizing} />
      {isProcessingCommand() && (
        <div class="flex items-center gap-1">
          <span class="spinner text-sky-400">
            <svg
              class="animate-spin h-4 w-4 text-sky-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span class="text-xs text-yellow-400">({isWriting() ? 'Writing...' : 'Thinking...'})</span>
        </div>
      )}
      <div class="h-full" style={{ height: `${height()}px` }}>
        <div ref={(el) => (terminalRef = el)} class="text-xs font-mono h-full w-full" />
      </div>
    </div>
  );
}
