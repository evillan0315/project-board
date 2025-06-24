import { type Component } from 'solid-js';

interface StringFieldProps {
  id: string;
  value: string;
  property: any;
  isRequired: boolean;
  onChange: (value: string) => void;
}

const StringField: Component<StringFieldProps> = (props) => {
  if (props.property.enum) {
    return (
      <div class="mb-4">
        <label for={props.id} class="block text-sm font-medium">
          {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
        </label>
        <select
          id={props.id}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          required={props.isRequired}
        >
          {props.property.enum.map((option: string) => (
            <option value={option}>{option}</option>
          ))}
        </select>
        {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
      </div>
    );
  }

  if (props.property.format === 'textarea') {
    return (
      <div class="mb-4">
        <label for={props.id} class="block text-sm font-medium">
          {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
        </label>
        <textarea
          id={props.id}
          rows={4}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          required={props.isRequired}
        />
        {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
      </div>
    );
  }

  return (
    <div class="mb-4">
      <label for={props.id} class="block text-sm font-medium">
        {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
      </label>
      <input
        type="text"
        id={props.id}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
        required={props.isRequired}
      />
      {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
    </div>
  );
};

export default StringField;
