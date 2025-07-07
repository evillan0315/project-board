import { type Component } from 'solid-js';

interface PasswordFieldProps {
  id: string;
  value: string;
  property: {
    title?: string;
    description?: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    [key: string]: any;
  };
  isRequired: boolean;
  onChange: (value: string) => void;
}

const PasswordField: Component<PasswordFieldProps> = (props) => {
  const label = props.property.title ?? props.id;
  const placeholder = props.property.placeholder ?? '';

  return (
    <div class="mb-4">
      <label for={props.id} class="block text-sm font-medium">
        {label} {props.isRequired && <span class="text-red-500">*</span>}
      </label>
      <input
        type="password"
        id={props.id}
        value={props.value}
        placeholder={placeholder}
        minLength={props.property.minLength}
        maxLength={props.property.maxLength}
        pattern={props.property.pattern}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        required={props.isRequired}
        class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
      />
      {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
    </div>
  );
};

export default PasswordField;
