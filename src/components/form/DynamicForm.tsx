import { type Component, createSignal, For, onMount } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import StringField from './fields/StringField';
import NumberField from './fields/NumberField';
import BooleanField from './fields/BooleanField';
import DateField from './fields/DateField';
import ArrayField from './fields/ArrayField';
import ToggleField from './fields/ToggleField';
import PasswordField from './fields/PasswordField';
import JsonField from './fields/JsonField';
import { Button } from '../ui/Button';

interface SchemaProperty {
  type: string;
  title?: string;
  description?: string;
  format?: string;
  enum?: string[];
  order?: number;
  colSpan?: 1 | 2;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  patternProperties?: Record<string, SchemaProperty>;
  [key: string]: any;
}

interface JsonSchema {
  type: 'object';
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

interface FormData {
  [key: string]: any;
}

interface DynamicFormProps {
  schema: JsonSchema | string;
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
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
        const data = await response.json();
        resolvedSchema = data.schema || data;
      } else {
        resolvedSchema = props.schema;
      }

      setSchema(resolvedSchema);
      const baseData = initializeFormData(resolvedSchema);
      const mergedData = deepMerge(baseData, props.initialData || {});
      setFormData(mergedData);
    } catch (e: any) {
      setError(e.message || 'Failed to load schema.');
    } finally {
      setLoading(false);
    }
  });

  const initializeFormData = (schema: SchemaProperty): FormData => {
    const data: FormData = {};
    if (schema.properties) {
      for (const [key, property] of Object.entries(schema.properties)) {
        if (property.type === 'object') {
          data[key] = initializeFormData(property);
        } else if (property.type === 'array') {
          data[key] = [];
        } else if (property.type === 'boolean') {
          data[key] = false;
        } else {
          data[key] = '';
        }
      }
    }
    return data;
  };

  const deepMerge = (target: any, source: any): any => {
    if (typeof target !== 'object' || typeof source !== 'object') return source;
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  const handleChange = (path: string[], value: any) => {
    setFormData(
      produce((state) => {
        let target = state;
        for (let i = 0; i < path.length - 1; i++) {
          target = target[path[i]];
        }
        target[path[path.length - 1]] = value;
      }),
    );
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setLoading(true);
    props.onSubmit(formData);
  };

  const renderFields = (properties: Record<string, SchemaProperty>, required?: string[], path: string[] = []) => (
    <For each={Object.entries(properties).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))}>
      {([key, property]) => {
        const fullPath = [...path, key];
        const isRequired = required?.includes(key) ?? false;
        const colSpanClass = (property.colSpan ?? 1) === 2 ? 'md:col-span-2' : 'md:col-span-1';

        if (property.type === 'object' && property.properties) {
          return (
            <div class={`field-group border p-2 rounded ${colSpanClass}`}>
              <h4 class="mb-1 uppercase tracking-widest font-light text-shadow-2xs">{property.title || key}</h4>
              {renderFields(property.properties, property.required, fullPath)}
            </div>
          );
        }

        if (property.type === 'string') {
          if (property.format === 'date') {
            return (
              <div class={colSpanClass}>
                <DateField
                  id={key}
                  value={getValue(formData, fullPath)}
                  property={property}
                  isRequired={isRequired}
                  onChange={(val) => handleChange(fullPath, val)}
                />
              </div>
            );
          }
          if (property.format === 'password') {
            return (
              <div class={colSpanClass}>
                <PasswordField
                  id={key}
                  value={getValue(formData, fullPath)}
                  property={property}
                  isRequired={isRequired}
                  onChange={(val) => handleChange(fullPath, val)}
                />
              </div>
            );
          }
          return (
            <div class={colSpanClass}>
              <StringField
                id={key}
                value={getValue(formData, fullPath)}
                property={property}
                isRequired={isRequired}
                onChange={(val) => handleChange(fullPath, val)}
              />
            </div>
          );
        }

        if (property.type === 'number' || property.type === 'integer') {
          return (
            <div class={colSpanClass}>
              <NumberField
                id={key}
                value={getValue(formData, fullPath)}
                property={property}
                isRequired={isRequired}
                onChange={(val) => handleChange(fullPath, val)}
              />
            </div>
          );
        }

        if (property.type === 'boolean') {
          return (
            <div class={colSpanClass}>
              <ToggleField
                id={key}
                value={getValue(formData, fullPath)}
                property={property}
                isRequired={isRequired}
                onChange={(val) => handleChange(fullPath, val)}
              />
            </div>
          );
        }

        if (property.type === 'array') {
          return (
            <div class={colSpanClass}>
              <ArrayField
                id={key}
                value={getValue(formData, fullPath)}
                property={property}
                isRequired={isRequired}
                onChange={(val) => handleChange(fullPath, val)}
              />
            </div>
          );
        }

        if (property.type === 'object' && property.patternProperties) {
          return (
            <div class={colSpanClass}>
              <JsonField
                id={key}
                value={getValue(formData, fullPath) || {}}
                description={property.description}
                onChange={(val) => handleChange(fullPath, val)}
              />
            </div>
          );
        }

        return (
          <div class={colSpanClass}>
            <StringField
              id={key}
              value={getValue(formData, fullPath)}
              property={property}
              isRequired={isRequired}
              onChange={(val) => handleChange(fullPath, val)}
            />
          </div>
        );
      }}
    </For>
  );

  const getValue = (data: any, path: string[]) => {
    return path.reduce((acc, curr) => acc?.[curr], data);
  };

  return (
    <div class="container mx-auto">
      {loading() && <div class="text-center">Loading...</div>}
      {error() && <div class="text-red-500">Error: {error()}</div>}
      {schema() && (
        <form onSubmit={handleSubmit} class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFields(schema()!.properties, schema()!.required)}
          <div class="md:col-span-2 flex justify-end">
            <Button loading={loading()} disabled={loading()} type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DynamicForm;
