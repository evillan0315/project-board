import { type Component, createSignal, For, onMount } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import StringField from './fields/StringField';
import NumberField from './fields/NumberField';
import BooleanField from './fields/BooleanField';
import DateField from './fields/DateField';
import ArrayField from './fields/ArrayField';
import ToggleField from './fields/ToggleField';

interface SchemaProperty {
  type: string;
  title: string;
  description?: string;
  format?: string;
  enum?: string[];
  order?: number;
  colSpan?: 1 | 2;
  [key: string]: any;
}

interface JsonSchema {
  type: 'object';
  properties: {
    [key: string]: SchemaProperty;
  };
  required?: string[];
}

interface FormData {
  [key: string]: any;
}

interface DynamicFormProps {
  schema: JsonSchema | string;
  onSubmit: (data: FormData) => void;
}

const DynamicForm: Component<DynamicFormProps> = (props) => {
  const [schema, setSchema] = createSignal<JsonSchema | null>(null);
  const [formData, setFormData] = createStore<FormData>({});
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      setLoading(true);
      let resolvedSchema: JsonSchema;

      if (typeof props.schema === 'string') {
        const response = await fetch(props.schema);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        resolvedSchema = await response.json();
      } else {
        resolvedSchema = props.schema;
      }

      setSchema(resolvedSchema);

      const initialData: FormData = {};
      Object.entries(resolvedSchema.properties).forEach(([key, property]) => {
        if (property.default !== undefined) {
          initialData[key] = property.default;
        } else if (property.type === 'boolean') {
          initialData[key] = false;
        } else if (property.type === 'array') {
          initialData[key] = [];
        } else {
          initialData[key] = '';
        }
      });
      setFormData(initialData);
    } catch (e: any) {
      setError(e.message || 'Failed to load schema.');
    } finally {
      setLoading(false);
    }
  });

  const handleChange = (key: string, value: any) => {
    setFormData(
      produce((state) => {
        state[key] = value;
      }),
    );
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData);
  };

  const renderField = (key: string, property: SchemaProperty) => {
    const isRequired = schema()?.required?.includes(key) || false;

    if (property.type === 'string') {
      if (property.format === 'date') {
        return (
          <DateField
            id={key}
            value={formData[key]}
            property={property}
            isRequired={isRequired}
            onChange={(value) => handleChange(key, value)}
          />
        );
      }
      return (
        <StringField
          id={key}
          value={formData[key]}
          property={property}
          isRequired={isRequired}
          onChange={(value) => handleChange(key, value)}
        />
      );
    }

    if (property.type === 'number') {
      return (
        <NumberField
          id={key}
          value={formData[key]}
          property={property}
          isRequired={isRequired}
          onChange={(value) => handleChange(key, value)}
        />
      );
    }

    if (property.type === 'boolean') {
      return (
        <ToggleField
          id={key}
          value={formData[key]}
          property={property}
          isRequired={isRequired}
          onChange={(value) => handleChange(key, value)}
        />
      );
    }

    if (property.type === 'array') {
      return (
        <ArrayField
          id={key}
          value={formData[key]}
          property={property}
          isRequired={isRequired}
          onChange={(value) => handleChange(key, value)}
        />
      );
    }

    // fallback
    return (
      <StringField
        id={key}
        value={formData[key]}
        property={property}
        isRequired={isRequired}
        onChange={(value) => handleChange(key, value)}
      />
    );
  };

  return (
    <div class="container mx-auto p-4 dark:bg-gray-950 dark:text-gray-100">
      {loading() && <div class="text-center">Loading...</div>}
      {error() && <div class="text-red-500">Error: {error()}</div>}
      {schema() && (
        <form onSubmit={handleSubmit} class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={Object.entries(schema()!.properties).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))}>
            {([key, property]) => {
              const colSpan = property.colSpan ?? 1;
              const colSpanClass = colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1';
              return <div class={colSpanClass}>{renderField(key, property)}</div>;
            }}
          </For>
          <div class="md:col-span-2 mt-6 flex justify-end">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:bg-sky-950 dark:hover:bg-sky-900"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DynamicForm;
