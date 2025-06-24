// src/utils/settingsValidator.ts
import type { SettingsState } from '../stores/settings';

export function validateSettings(settings: SettingsState): string[] {
  const errors: string[] = [];

  if (settings.fontSize < 10 || settings.fontSize > 32) {
    errors.push('Font size must be between 10 and 32.');
  }

  if (settings.aiTemperature < 0 || settings.aiTemperature > 1) {
    errors.push('AI temperature must be between 0 and 1.');
  }

  if (settings.aiMaxTokens < 1 || settings.aiMaxTokens > 4096) {
    errors.push('AI max tokens must be between 1 and 4096.');
  }

  // Add more validation rules as needed

  return errors;
}
