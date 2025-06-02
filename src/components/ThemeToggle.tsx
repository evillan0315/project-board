// src/components/ThemeToggle.tsx
import { useStore } from '@nanostores/solid';
import { theme, toggleTheme } from '../stores/theme';
import { Icon } from '@iconify-icon/solid';

export default function ThemeToggle() {
  const $theme = useStore(theme);
  return (
    <button onClick={toggleTheme} class="text-sm cursor-alias mt-1 pl-4">
      <Icon
        icon={$theme() === 'dark' ? 'mdi:alarm-light' : 'mdi:alarm-light-outline'}
        width="28"
        height="28"
        class="text-sky-500"
      />
    </button>
  );
}
