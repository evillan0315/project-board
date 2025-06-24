import type { JSX } from 'solid-js';
import { FancyThemeToggle } from '../../ThemeToggle';

interface ThemeSettingsProps {
  theme: string; // Could be 'Dark' | 'Light' depending on your state type
  onChange: (value: string) => void;
}

export default function ThemeSettings(props: ThemeSettingsProps): JSX.Element {
  return (
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-gray-300">Current Theme:</span>
        <span class="font-semibold text-sky-400">{props.theme}</span>
      </div>

      <div class="flex justify-center">
        {/* Use any of your toggle variants here */}
        <FancyThemeToggle class="" onClick={() => props.onChange(props.theme === 'Dark' ? 'Light' : 'Dark')} />
      </div>

      <p class="text-xs text-gray-500">
        Use the toggle to switch between light and dark mode. The change will apply immediately.
      </p>
    </div>
  );
}
