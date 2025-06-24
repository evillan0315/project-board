import type { SettingsState } from '../components/layouts/ModalSettings';

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'Dark',
  fontSize: 14,
  autoSave: false,
};

/**
 * Loads settings from localStorage or returns defaults if not found.
 * @returns {SettingsState}
 */
export function loadDefaultSettings(): SettingsState {
  try {
    const stored = localStorage.getItem('developerConsoleSettings');
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SettingsState>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load settings, using defaults.', err);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Persists settings to localStorage.
 * @param settings {SettingsState}
 */
export function saveSettingsToStorage(settings: SettingsState): void {
  try {
    localStorage.setItem('developerConsoleSettings', JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings.', err);
  }
}
