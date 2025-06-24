import { createSignal, createEffect, For, Show } from 'solid-js';
import { io } from 'socket.io-client';

export default function DashboardPanel() {
  const [tab, setTab] = createSignal<'logs' | 'gemini'>('logs');
  const [logs, setLogs] = createSignal<any[]>([]);
  const [geminiData, setGeminiData] = createSignal<any[]>([]);

  createEffect(() => {
    const token = localStorage.getItem('token');

    const logSocket = io(`${import.meta.env.BASE_URL_API}/logs`, {
      auth: { token: `Bearer ${token}` },
    });
    logSocket.on('log', (log) => {
      setLogs((prev) => [log, ...prev].slice(0, 100));
    });

    const geminiSocket = io(`${import.meta.env.BASE_URL_API}/gemini`, {
      auth: { token: `Bearer ${token}` },
    });
    geminiSocket.on('gemini', (data) => {
      setGeminiData((prev) => [data, ...prev].slice(0, 100));
    });

    return () => {
      logSocket.disconnect();
      geminiSocket.disconnect();
    };
  });

  return (
    <div class="p-2 max-h-[32rem] overflow-y-auto bg-black text-white">
      <div class="flex space-x-2 mb-2">
        <button class="px-2 py-1 bg-gray-700 rounded" onClick={() => setTab('logs')}>
          Logs
        </button>
        <button class="px-2 py-1 bg-gray-700 rounded" onClick={() => setTab('gemini')}>
          Gemini
        </button>
      </div>

      <Show when={tab() === 'logs'}>
        <For each={logs()}>
          {(log) => (
            <div class="border-b border-gray-800 p-1">
              <div class="flex justify-between">
                <span class="text-sky-400">{log.type}</span>
                <span class="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
              <div class="text-sm">
                {log.level} - {JSON.stringify(log.data)}
              </div>
              <div class="text-xs text-gray-500">Tags: {(log.tags || []).join(', ')}</div>
            </div>
          )}
        </For>
      </Show>

      <Show when={tab() === 'gemini'}>
        <For each={geminiData()}>
          {(entry) => (
            <div class="border-b border-gray-800 p-1">
              <div class="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleTimeString()}</div>
              <div class="text-green-400 text-sm">Request: {JSON.stringify(entry.request)}</div>
              <div class="text-yellow-400 text-sm">Response: {JSON.stringify(entry.response)}</div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
