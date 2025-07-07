import { type Component } from 'solid-js';

interface StringFieldProps {
  id: string;
  value: string;
  property: {
    title?: string;
    description?: string;
    enum?: string[];
    format?: string;
    placeholder?: string;
    [key: string]: any;
  };
  isRequired: boolean;
  onChange: (value: string) => void;
}

const StringField: Component<StringFieldProps> = (props) => {
  const label = props.property.title ?? props.id;
  const placeholder = props.property.placeholder ?? '';

  if (props.property.enum) {
    return (
      <div class="mb-4">
        <label for={props.id} class="block text-sm font-medium">
          {label} {props.isRequired && <span class="text-red-500">*</span>}
        </label>
        <select
          id={props.id}
          value={props.value}
          onChange={(e) => props.onChange(e.currentTarget.value)}
          class="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm sm:text-sm"
          required={props.isRequired}
        >
          <option value="" disabled selected={!props.value}>
            -- Select --
          </option>
          {props.property.enum.map((option: string) => (
            <option value={option} key={option}>
              {option}
            </option>
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
          {label} {props.isRequired && <span class="text-red-500">*</span>}
        </label>
        <textarea
          id={props.id}
          rows={4}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          placeholder={placeholder}
          class="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm sm:text-sm"
          required={props.isRequired}
        />
        {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
      </div>
    );
  }

  return (
    <div class="mb-4">
      <label for={props.id} class="block text-sm font-medium">
        {label} {props.isRequired && <span class="text-red-500">*</span>}
      </label>
      <input
        type="text"
        id={props.id}
        value={props.value}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        placeholder={placeholder}
        class="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm sm:text-sm"
        required={props.isRequired}
      />
      {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
    </div>
  );
};

export default StringField;
