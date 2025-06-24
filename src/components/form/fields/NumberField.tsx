import { type Component } from 'solid-js';

interface NumberFieldProps {
  id: string;
  value: number | string;
  property: any;
  isRequired: boolean;
  onChange: (value: number) => void;
}

const NumberField: Component<NumberFieldProps> = (props) => (
  <div class="mb-4">
    <label for={props.id} class="block text-sm font-medium">
      {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
    </label>
    <input
      type="number"
      id={props.id}
      value={props.value}
      onChange={(e) => props.onChange(parseFloat(e.target.value))}
      class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
      required={props.isRequired}
    />
    {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
  </div>
);

export default NumberField;
