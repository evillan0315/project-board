import { createSignal, For } from 'solid-js';
import { SolidApexCharts } from 'solid-apexcharts';
import { Icon } from '@iconify-icon/solid';
import MetricCard from '../components/MetricCard';
export default function Dashboard() {

  const [metrics] = createSignal([
    { label: 'Users Online', value: 23, icon: 'mdi:account' },
    { label: 'Server Load', value: '47%', icon: 'mdi:server' },
    { label: 'Active Jobs', value: 12, icon: 'tabler:briefcase' },
    { label: 'Errors Today', value: 0, icon: 'ic:baseline-error-outline' },
  ]);

  const [entries] = createSignal([
    {
      id: 1,
      title: 'System Status',
      content: 'All systems operational.',
      timestamp: '2025-05-30 09:00',
    },
    {
      id: 2,
      title: 'User Activity',
      content: '15 users logged in within the last hour.',
      timestamp: '2025-05-30 08:45',
    },
    {
      id: 3,
      title: 'Error Logs',
      content: '0 critical errors reported today.',
      timestamp: '2025-05-30 08:30',
    },
  ]);

  

  return (
    <div class="flex flex-col max-w-7xl mx-auto">
      {/* Entry Logs */}
      <div class="flex-1 scroll-smooth px-4 py-4 space-y-4 mt-2 mb-6">
        <h1 class="leading-0 uppercase tracking-widest text-2xl mt-6 mb-10 px-4">
          <b>Dash</b>board
        </h1>
        {/* Metrics Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mt-4">
          <For each={metrics()}>{(metric) => <MetricCard {...metric} />}</For>
        </div>


        

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-4">
          <For each={entries()}>
            {(entry) => (
              <div class="rounded-xl border dark:border-gray-900 p-4 mt-2 shadow-sm">
                <div class="flex justify-between items-center mb-2">
                  <h2 class="font-semibold text-xl text-sky-500">{entry.title}</h2>
                  <span class="text-xs text-muted">{entry.timestamp}</span>
                </div>
                <p class="">{entry.content}</p>
              </div>
            )}
          </For>
        </div>

        {/* Apps section */}
        <div class="grid grid-cols-1 px-4 mt-4">
          <h2 class="leading-0 uppercase tracking-widest text-xl mt-6 mb-10 ">
            <b>App</b>lications
          </h2>
          <div class="flex space-x-6">
            {/* Editor */}
            <button
              class="flex flex-col items-center justify-center p-4 rounded-2xl border dark:border-gray-900 shadow-md w-32 hover:bg-gray-700 hover:text-white transition"
              onClick={() => (window.location.href = '/editor')}
              aria-label="Open Editor"
            >
              <Icon icon="mdi:xml" width="50" height="50" class="text-sky-500 shrink-0" />
              Editor
            </button>

            {/* TTS (Text To Speech) */}
            <button
              class="flex flex-col items-center justify-center p-4 rounded-2xl  border dark:border-gray-900 shadow-md w-32 hover:bg-gray-700 hover:text-white transition"
              onClick={() => (window.location.href = '/tts')}
              aria-label="Open Text To Speech"
            >
              <Icon icon="mdi:microphone-message" width="50" height="50" class="text-sky-500 shrink-0" />
              TTS
            </button>

            {/* Terminal */}
            <button
              class="flex flex-col items-center justify-center  border dark:border-gray-900  p-4 rounded-2xl shadow-md w-32 hover:bg-gray-700 hover:text-white transition"
              onClick={() => (window.location.href = '/terminal')}
              aria-label="Open Terminal"
            >
              <Icon icon="mdi:console" width="50" height="50" class="text-sky-500 shrink-0" />
              Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
