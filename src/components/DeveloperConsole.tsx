import { createSignal, Show } from 'solid-js';
import TerminalShell from './TerminalShell';
import TerminalShellAi from './TerminalShellAi';
import LoggerPanel from './LoggerPanel';

import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
import { openSettings } from '../stores/settings'; // your global settings store

export default function DeveloperConsole() {
  const [activeTab, setActiveTab] = createSignal<'terminal' | 'ai' | 'logs'>('terminal');

  const openDeveloperSettings = () => {
    const tabMap = {
      terminal: 'Terminal',
      ai: 'AI',
      logs: 'General',
    } as const;

    openSettings(tabMap[activeTab()]);
  };

  return (
    <div class="">
      <div class="flex items-center">
        <Button
          variant="secondary"
          class={`btn rounded-none rounded-t px-4 py-2 mr-1 ${activeTab() === 'terminal' ? 'text-sky-500' : ''}`}
          onClick={() => setActiveTab('terminal')}
        >
          <Icon icon="vscode-icons:file-type-codekit" width="1.2em" height="1.2em" /> Terminal
        </Button>
        <Button
          variant="secondary"
          class={`btn rounded-none  rounded-t px-4 py-2  mr-1 ${activeTab() === 'ai' ? 'text-sky-500' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Icon icon="vscode-icons:file-type-robots" width="1.2em" height="1.2em" /> AI Terminal
        </Button>
        <Button
          variant="secondary"
          class={`btn rounded-none   rounded-t px-4 py-2  mr-1 ${activeTab() === 'logs' ? 'text-sky-500' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Icon icon="vscode-icons:file-type-log" width="1.2em" height="1.2em" /> Logs
        </Button>

        <div class="ml-auto">
          <Button
            variant="secondary"
            icon="mdi:cog-outline"
            class="px-2 py-2 btn-icon"
            onClick={openDeveloperSettings}
          />
        </div>
      </div>

      <Show when={activeTab() === 'terminal'}>
        <TerminalShell />
      </Show>
      <Show when={activeTab() === 'ai'}>
        <TerminalShellAi />
      </Show>
      <Show when={activeTab() === 'logs'}>
        <LoggerPanel />
      </Show>
    </div>
  );
}
