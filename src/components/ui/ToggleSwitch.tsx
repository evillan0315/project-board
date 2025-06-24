import type { JSX } from 'solid-js';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export default function ToggleSwitch(props: ToggleSwitchProps): JSX.Element {
  return (
    <label class="flex items-center gap-2 cursor-pointer select-none">
      {props.label && <span class="text-sm text-gray-300">{props.label}</span>}
      <div class="relative inline-block w-11 h-6">
        <input
          type="checkbox"
          class="sr-only peer"
          checked={props.checked}
          onChange={(e) => props.onChange(e.currentTarget.checked)}
        />
        <div class="block w-full h-full rounded-full bg-gray-600 peer-checked:bg-sky-500 transition-colors duration-300"></div>
        <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}
