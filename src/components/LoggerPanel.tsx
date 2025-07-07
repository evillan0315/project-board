import { createSignal, createEffect, onMount, onCleanup, For, Show } from 'solid-js';
import { Button } from './ui/Button';
import { fileService } from '../services/fileService'; // ✅ import fileService
import { io, Socket } from 'socket.io-client';
const NAMESPACES = ['/files', '/gemini', '/terminal', '/logs', '/download', '/upload', '/transcode'] as const;
type Namespace = (typeof NAMESPACES)[number];

interface LogEntry {
  type: string;
  level: string;
  data: unknown;
  tags?: string[];
  createdAt: string;
}

interface GeminiEntry {
  modelUsed?: string;
  prompt: string;
  responseText: string;
  createdAt: string;
}

export default function LoggerPanel() {
  let panelRef!: HTMLDivElement;
  const [activeNamespace, setActiveNamespace] = createSignal<Namespace>('/logs');
  const [logs, setLogs] = createSignal<LogEntry[]>([]);
  const [geminiData, setGeminiData] = createSignal<GeminiEntry[]>([]);
  const [filter, setFilter] = createSignal<string>('');
  const [height, setHeight] = createSignal(200);
  const [isResizing, setIsResizing] = createSignal(false);

  createEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let socket: any;

    if (activeNamespace() === '/files') {
      socket = fileService.connect(); // ✅ use shared FileService socket

      const handleFileRead = (data: any) => {
        setLogs((prev) =>
          [
            {
              type: 'file',
              level: 'info',
              data,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 100),
        );
      };

      socket.on('readFileResponse', handleFileRead);

      onCleanup(() => {
        socket.off('readFileResponse', handleFileRead);
      });
    } else {
      socket = io(`${import.meta.env.BASE_URL_API}${activeNamespace()}`, {
        auth: { token: `Bearer ${token}` },
      });

      if (activeNamespace() === '/logs') {
        socket.on('recentLogs', (initialLogs: LogEntry[]) => {
          setLogs(initialLogs.reverse());
        });
        socket.on('log', (log: LogEntry) => {
          setLogs((prev) => [log, ...prev].slice(0, 100));
        });
      }

      if (activeNamespace() === '/gemini') {
        socket.on('gemini', (data: GeminiEntry) => {
          setGeminiData((prev) => [data, ...prev].slice(0, 100));
        });
      }

      onCleanup(() => {
        socket.disconnect();
      });
    }
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
      const rect = panelRef.getBoundingClientRect();
      const newHeight = Math.max(100, rect.bottom - e.clientY);
      setHeight(newHeight);
    }
  };

  onMount(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResizing);

    onCleanup(() => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    });
  });

  const filteredLogs = () =>
    logs().filter(
      (log) =>
        !filter() ||
        log.type.toLowerCase().includes(filter().toLowerCase()) ||
        log.level.toLowerCase().includes(filter().toLowerCase()) ||
        (log.tags || []).some((tag) => tag.toLowerCase().includes(filter().toLowerCase())),
    );

  const filteredGemini = () =>
    geminiData().filter(
      (entry) =>
        !filter() ||
        entry.prompt.toLowerCase().includes(filter().toLowerCase()) ||
        entry.responseText.toLowerCase().includes(filter().toLowerCase()),
    );

  return (
    <div
      ref={(el) => (panelRef = el)}
      class="relative flex flex-col border-t transition-all duration-200"
      style={{ height: `${height()}px` }}
    >
      <div class="resizer h-1 cursor-ns-resize" onMouseDown={startResizing} />
      <div class="sticky top-0 z-10 border-b px-2 pt-2">
        <div class="flex items-center">
          <div class="flex flex-wrap space-x-1">
            <For each={NAMESPACES}>
              {(ns) => (
                <Button
                  variant="secondary"
                  class={`px-2 border-b-0 rounded-none rounded-t rounded-b-0 ${
                    activeNamespace() === ns ? 'text-sky-500' : ''
                  }`}
                  onClick={() => {
                    setLogs([]);
                    setGeminiData([]);
                    setActiveNamespace(ns);
                  }}
                >
                  {ns.replace('/', '') || 'root'}
                </Button>
              )}
            </For>
          </div>
          <div class="ml-auto">
            <input
              class="w-[200px] p-1 border rounded focus:outline-none focus:ring focus:ring-sky-500"
              placeholder="Filter..."
              value={filter()}
              onInput={(e) => setFilter(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>

      <div class="overflow-y-auto p-2 flex-1">
        <Show when={activeNamespace() === '/logs' && filteredLogs().length > 0}>
          <For each={filteredLogs()}>
            {(log) => (
              <div class="p-2 border-b m-1">
                <div class="flex justify-between">
                  <span class="font-bold text-sky-400">{log.type}</span>
                  <span class="text-gray-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <div class="text-gray-500">
                  {log.level} - <pre class="whitespace-pre-wrap break-all">{JSON.stringify(log.data, null, 2)}</pre>
                </div>
                <div class="text-xs">Tags: {log.tags?.join(', ') || 'none'}</div>
              </div>
            )}
          </For>
        </Show>

        <Show when={activeNamespace() === '/gemini' && filteredGemini().length > 0}>
          <div class="mb-2 font-bold text-purple-400">Gemini Events</div>
          <For each={filteredGemini()}>
            {(entry) => (
              <div class="border-b py-1">
                <div class="flex justify-between">
                  <span class="text-purple-400">{entry.modelUsed || 'Gemini'}</span>
                  <span class="text-gray-500">{new Date(entry.createdAt).toLocaleTimeString()}</span>
                </div>
                <div class="text-sky-500">
                  <div class="mb-1">
                    <span class="text-gray-500">Prompt:</span>{' '}
                    <pre class="whitespace-pre-wrap break-all">{entry.prompt}</pre>
                  </div>
                  <div>
                    <span class="text-gray-500">Response:</span>{' '}
                    <pre class="whitespace-pre-wrap break-all">{entry.responseText}</pre>
                  </div>
                </div>
              </div>
            )}
          </For>
        </Show>
        {/* File Logs */}
        <Show when={filteredLogs().some((log) => log.type === 'file')}>
          <For each={filteredLogs().filter((log) => log.type === 'file')}>
            {(log) => (
              <div class="p-2 border-b m-1 ">
                <div class="flex justify-between">
                  <span class="font-bold text-emerald-600">File Event</span>
                  <span class="text-gray-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <div class="text-emerald-700 text-sm">
                  <pre class="whitespace-pre-wrap break-all">{JSON.stringify(log.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </For>
        </Show>
        <Show
          when={
            (activeNamespace() === '/logs' && filteredLogs().length === 0) ||
            (activeNamespace() === '/gemini' && filteredGemini().length === 0) ||
            (activeNamespace() === '/files' && filteredLogs().length === 0)
          }
        >
          <div class="text-center mt-4">No data to display</div>
        </Show>
      </div>
    </div>
  );
}
