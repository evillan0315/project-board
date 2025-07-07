import { type Component } from 'solid-js';

interface NumberFieldProps {
  id: string;
  value: number | string;
  property: {
    title?: string;
    description?: string;
    minimum?: number;
    maximum?: number;
    step?: number;
    placeholder?: string;
    [key: string]: any;
  };
  isRequired: boolean;
  onChange: (value: number) => void;
}

const NumberField: Component<NumberFieldProps> = (props) => {
  const label = props.property.title ?? props.id;
  const placeholder = props.property.placeholder ?? '';

  return (
    <div class="mb-4">
      <label for={props.id} class="block text-sm font-medium">
        {label} {props.isRequired && <span class="text-red-500">*</span>}
      </label>
      <input
        type="number"
        id={props.id}
        value={props.value}
        onInput={(e) => {
          const val = e.currentTarget.value;
          props.onChange(val === '' ? NaN : parseFloat(val));
        }}
        min={props.property.minimum}
        max={props.property.maximum}
        step={props.property.step}
        placeholder={placeholder}
        class="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm sm:text-sm"
        required={props.isRequired}
      />
      {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
    </div>
  );
};

export default NumberField;
