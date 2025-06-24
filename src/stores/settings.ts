import { atom } from 'nanostores';
import type { SettingsTab } from '../constants/settingsTabs';

// Settings state interface
export interface SettingsState {
  theme: 'Dark' | 'Light';
  fontSize: number;
  autoSave: boolean;

  aiModel: string;
  aiTemperature: number;
  aiMaxTokens: number;

  miniAudioPlayerVolume: number; // 0.0 - 1.0
  miniAudioPlayerMuted: boolean;
  showMiniAudioPlayer: boolean;

  miniVideoPlayerVolume: number; // 0.0 - 1.0
  miniVideoPlayerMuted: boolean;
  showMiniVideoPlayer: boolean;
}

// Default settings
export const defaultSettings: SettingsState = {
  theme: 'Dark',
  fontSize: 14,
  autoSave: false,

  aiModel: 'ChatGPT',
  aiTemperature: 0.5,
  aiMaxTokens: 1024,

  miniAudioPlayerVolume: 0.8,
  miniAudioPlayerMuted: false,

  miniVideoPlayerVolume: 0.8,
  miniVideoPlayerMuted: false,

  showMiniAudioPlayer: true, // default enabled
  showMiniVideoPlayer: true,
};

// Settings store
export const settingsStore = atom<SettingsState>(defaultSettings);

// Modal visibility and active tab
import { atom as atomNano } from 'nanostores';
export const showSettingsStore = atomNano(false);
export const settingsTabStore = atomNano<SettingsTab>('General');

export function openSettings(tab: SettingsTab = 'General') {
  settingsTabStore.set(tab);
  showSettingsStore.set(true);
}

export function closeSettings() {
  showSettingsStore.set(false);
}

// Helpers
export function updateSetting<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
  settingsStore.set({
    ...settingsStore.get(),
    [key]: value,
  });
}

export function resetSettings() {
  settingsStore.set(defaultSettings);
}

export function loadSettingsFromStorage() {
  const stored = localStorage.getItem('app-settings');
  if (stored) {
    try {
      settingsStore.set(JSON.parse(stored));
    } catch {
      resetSettings();
    }
  }
}

export function saveSettingsToStorage() {
  localStorage.setItem('app-settings', JSON.stringify(settingsStore.get()));
}
