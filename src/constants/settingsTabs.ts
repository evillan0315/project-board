export const SETTINGS_TABS = ['Theme', 'AI', 'Terminal', 'General', 'User Configuration'] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];
