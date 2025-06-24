import { createResource, For, Show, createSignal } from 'solid-js';
import { type JSX } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

interface FieldEditorProps {
  data: any;
  path: string[];
  onChange: (path: string[], value: string) => void;
}

function FieldEditor(props: FieldEditorProps): JSX.Element {
  console.log(Object.entries(props), props);

  return (
    <>
      <div class="space-y-3">
        <For each={Object.entries(props.data)}>
          {([key, value]) => {
            const fullPath = [...props.path, key];
            const [collapsed, setCollapsed] = createSignal(true);
            const isPrimitive = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
            console.log(fullPath, value);
            return (
              <div class="pl-2 border-l">
                <Show
                  when={isPrimitive}
                  fallback={
                    <div class="mt-2">
                      <button
                        type="button"
                        class="text-sm font-semibold text-blue-700 hover:underline"
                        onClick={() => setCollapsed(!collapsed())}
                      >
                        {collapsed() ? '▶' : '▼'} {key}
                      </button>
                      <Show when={!collapsed()}>
                        <div class="pl-4 mt-2 border-l border-gray-300">
                          <FieldEditor data={value} path={fullPath} onChange={props.onChange} />
                        </div>
                      </Show>
                    </div>
                  }
                >
                  <div class="flex flex-col">
                    <label class="font-medium">{key}</label>
                    <input
                      class="border px-3 py-2 rounded-md"
                      value={String(value)}
                      onInput={(e) => props.onChange(fullPath, e.currentTarget.value)}
                    />
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </>
  );
}

type PackageJson = Record<string, any>;

async function fetchPackageJson(): Promise<PackageJson> {
  const response = await fetch('/package.json');
  if (!response.ok) throw new Error('Failed to load package.json');
  return response.json();
}

export function PackageForm() {
  const [pkg] = createResource(fetchPackageJson);
  const [formState, setFormState] = createStore<PackageJson>({});

  const handleChange = (path: string[], value: string) => {
    setFormState(
      produce((state: PackageJson) => {
        let current = state;
        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          if (!(key in current)) current[key] = {};
          current = current[key];
        }
        const lastKey = path[path.length - 1];
        const original = current[lastKey];

        if (typeof original === 'number') {
          const parsed = Number(value);
          if (!isNaN(parsed)) current[lastKey] = parsed;
        } else if (typeof original === 'boolean') {
          current[lastKey] = value === 'true';
        } else {
          current[lastKey] = value;
        }
      }),
    );
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Updated package.json:', formState);
  };

  return (
    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Edit package.json</h1>

      <Show when={pkg()} fallback={<p>Loading...</p>}>
        {(data) => {
          if (Object.keys(formState).length === 0) {
            setFormState({ ...data });
          }

          return (
            <form onSubmit={handleSubmit} class="space-y-4">
              <FieldEditor data={formState} path={[]} onChange={handleChange} />

              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save
              </button>
            </form>
          );
        }}
      </Show>
    </div>
  );
}
