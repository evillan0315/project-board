export const SETTINGS_TABS = ['Theme', 'AI', 'Terminal', 'General'] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];
