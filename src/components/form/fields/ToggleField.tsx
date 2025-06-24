import { type Component } from 'solid-js';

interface ToggleFieldProps {
  id: string;
  value: boolean;
  property: any;
  isRequired: boolean;
  onChange: (value: boolean) => void;
}

const ToggleField: Component<ToggleFieldProps> = (props) => (
  <div class="mb-4">
    <label for={props.id} class="flex items-center cursor-pointer">
      <div class="relative">
        <input
          id={props.id}
          type="checkbox"
          class="sr-only"
          checked={props.value}
          onChange={(e) => props.onChange(e.target.checked)}
          required={props.isRequired}
        />
        <div
          class={`w-10 h-5 bg-gray-300 rounded-full shadow-inner transition ${props.value ? 'bg-sky-600' : ''}`}
        ></div>
        <div
          class={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${
            props.value ? 'translate-x-5' : ''
          }`}
        ></div>
      </div>
      <span class="ml-3 text-sm">
        {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
      </span>
    </label>
    {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
  </div>
);

export default ToggleField;
