import { type Component } from 'solid-js';

interface BooleanFieldProps {
  id: string;
  value: boolean;
  property: any;
  isRequired: boolean;
  onChange: (value: boolean) => void;
}

const BooleanField: Component<BooleanFieldProps> = (props) => (
  <div class="mb-4">
    <label class="inline-flex items-center">
      <input
        type="checkbox"
        id={props.id}
        checked={props.value}
        onChange={(e) => props.onChange(e.target.checked)}
        class="rounded border-gray-300 text-sky-600 shadow-sm"
        required={props.isRequired}
      />
      <span class="ml-2 text-sm">
        {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
      </span>
    </label>
    {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
  </div>
);

export default BooleanField;
