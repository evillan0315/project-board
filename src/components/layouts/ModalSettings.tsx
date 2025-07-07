import { createSignal, For, Show, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import ModalLayout from './ModalLayout';
import ThemeSettings from './settings/ThemeSettings';
import AISettings from './settings/AISettings';
import ToggleSwitch from '../ui/ToggleSwitch';
import { SETTINGS_TABS, type SettingsTab } from '../../constants/settingsTabs';
import { confirm, alert } from '../../services/modalService';
import { validateSettings } from '../../utils/settingsValidator';
import { Button } from '../ui/Button';
import UserConfigForm from '../schema/UserConfigForm';

export interface SettingsState {
  theme: 'Dark' | 'Light';
  fontSize: number;
  autoSave: boolean;
  aiModel: string;
  aiTemperature: number;
  aiMaxTokens: number;
  showMiniAudioPlayer: boolean;
  showMiniVideoPlayer: boolean;
}

interface ModalSettingsProps {
  settings: SettingsState;
  onChange: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  onSave: () => void;
  onClose: () => void;
  activeTab: SettingsTab;
}

export default function ModalSettings(props: ModalSettingsProps): JSX.Element {
  const [currentTab, setCurrentTab] = createSignal<SettingsTab>(props.activeTab);

  createEffect(() => {
    setCurrentTab(props.activeTab);
  });

  const handleSave = async (e: Event) => {
    e.preventDefault();

    const errors = validateSettings(props.settings);
    if (errors.length > 0) {
      await alert(`Please fix the following:\n- ${errors.join('\n- ')}`);
      return;
    }

    const confirmed = await confirm('Are you sure you want to save these settings?');
    if (!confirmed) {
      return;
    }

    props.onSave();
  };

  return (
    <ModalLayout size="xl" slideFrom="bottom" title="Settings" onClose={props.onClose}>
      <form onSubmit={handleSave}>
        {/* Tabs */}
        <div class="modal-tabs flex border-b mb-2 rounded">
          <For each={SETTINGS_TABS}>
            {(tab) => (
              <Button
                type="button"
                class={`border-b-none px-2 py-1 rounded-t ${currentTab() === tab ? 'text-sky-500 active' : ''}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </Button>
            )}
          </For>
        </div>

        {/* Theme Tab */}
        <Show when={currentTab() === 'Theme'}>
          <ThemeSettings
            theme={props.settings.theme}
            onChange={(value) => props.onChange('theme', value as 'Dark' | 'Light')}
          />
        </Show>

        {/* AI Tab */}
        <Show when={currentTab() === 'AI'}>
          <AISettings
            aiModel={props.settings.aiModel}
            aiTemperature={props.settings.aiTemperature}
            aiMaxTokens={props.settings.aiMaxTokens}
            onChange={props.onChange}
          />
        </Show>

        {/* Terminal Tab */}
        <Show when={currentTab() === 'Terminal'}>
          <div class="text-gray-400">Terminal settings coming soon...</div>
        </Show>

        {/* General Tab */}
        <Show when={currentTab() === 'General'}>
          <div class="space-y-4">
            <ToggleSwitch
              checked={props.settings.showMiniAudioPlayer}
              onChange={(checked) => props.onChange('showMiniAudioPlayer', checked)}
              label="Mini Audio Player"
            />

            <ToggleSwitch
              checked={props.settings.showMiniVideoPlayer}
              onChange={(checked) => props.onChange('showMiniVideoPlayer', checked)}
              label="Mini Video Player"
            />
          </div>
        </Show>

        {/* User Configuration Tab */}
        <Show when={currentTab() === 'User Configuration'}>
          <div class="max-h-[60vh] overflow-auto">
            <UserConfigForm />
          </div>
        </Show>

        {/* Save button */}
        <Show when={currentTab() !== 'User Configuration'}>
          <div class="flex justify-end mt-4">
            <button type="submit" class="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600">
              Save
            </button>
          </div>
        </Show>
      </form>
    </ModalLayout>
  );
}
