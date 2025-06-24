import { type Component } from 'solid-js';

interface DateFieldProps {
  id: string;
  value: string;
  property: any;
  isRequired: boolean;
  onChange: (value: string) => void;
}

const DateField: Component<DateFieldProps> = (props) => (
  <div class="mb-4">
    <label for={props.id} class="block text-sm font-medium">
      {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
    </label>
    <input
      type="date"
      id={props.id}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
      required={props.isRequired}
    />
    {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
  </div>
);

export default DateField;
