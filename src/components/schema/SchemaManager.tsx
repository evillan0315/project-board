import { createResource, createSignal, For, Show } from 'solid-js';
import api from '../services/api';
import Editor from './editor/Editor';

export default function SchemaManager() {
  const [schemas, { refetch }] = createResource(fetchSchemas);
  const [selectedSchema, setSelectedSchema] = createSignal<any>(null);
  const [name, setName] = createSignal('');
  const [schemaText, setSchemaText] = createSignal('{}');
  const [jsonValid, setJsonValid] = createSignal(true);
  const [parsedJson, setParsedJson] = createSignal<any>(null);
  const [isEditing, setIsEditing] = createSignal(false);
  const [isSaving, setIsSaving] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal<string | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  async function fetchSchemas() {
    const res = await api.get('/schema');
    return res.data;
  }

  async function loadSchema(id: string) {
    try {
      const res = await api.get(`/schema/${id}`);
      setSelectedSchema(res.data);
      setName(res.data.name);
      const text = JSON.stringify(res.data.schema, null, 2);
      setSchemaText(text);
      validateJson(text);
      setIsEditing(true);
      setError(null);
    } catch {
      setError('Failed to load schema.');
    }
  }

  function validateJson(value: string) {
    try {
      const parsed = JSON.parse(value);
      setJsonValid(true);
      setParsedJson(parsed);
    } catch {
      setJsonValid(false);
      setParsedJson(null);
    }
  }

  async function saveSchema() {
    if (!jsonValid()) {
      setError('Schema field must contain valid JSON.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const data = {
        name: name(),
        schema: parsedJson(),
      };

      if (isEditing() && selectedSchema()) {
        await api.patch(`/schema/${selectedSchema().id}`, data);
      } else {
        await api.post('/schema', data);
      }

      setName('');
      setSchemaText('{}');
      setParsedJson(null);
      setSelectedSchema(null);
      setIsEditing(false);
      await refetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save schema.');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSchema(id: string) {
    if (!confirm('Are you sure you want to delete this schema?')) return;
    setIsDeleting(id);
    setError(null);

    try {
      await api.delete(`/schema/${id}`);
      await refetch();
    } catch {
      setError('Failed to delete schema.');
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div class="">
      <h2 class="text-xl font-bold mb-2">Schema Manager</h2>

      <Show when={error()}>
        <div class="text-red-600 mb-2">{error()}</div>
      </Show>
      <div class="flex items-start gap-2">
        <div class="mb-4 flex flex-col w-1/2 ">
          <label class="block font-semibold">Name</label>
          <input
            class="border p-2 w-full"
            value={name()}
            disabled={isSaving()}
            onInput={(e) => setName(e.currentTarget.value)}
          />

          <label class="block font-semibold mt-2">Schema (JSON)</label>
          <div class={`border ${jsonValid() ? '' : 'border-red-600'} rounded`}>
            <Editor
              content={schemaText}
              filePath={() => 'schema.json'}
              onChange={(val) => {
                setSchemaText(val);
                validateJson(val);
              }}
              readOnly={isSaving()}
            />
          </div>

          <button
            class={`mt-2 px-4 py-2 rounded ${
              isSaving() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={saveSchema}
            disabled={isSaving()}
          >
            {isSaving()
              ? isEditing()
                ? 'Updating...'
                : 'Creating...'
              : isEditing()
                ? 'Update Schema'
                : 'Create Schema'}
          </button>
        </div>
        <div class="flex flex-col w-1/2">
          <Show when={parsedJson()}>
            <div class="font-semibold mb-1">Parsed JSON Preview</div>
            <p>
              This configuration allows you to define essential settings for your server, database, and API keys in a
              structured JSON format. The configuration is validated to ensure correctness before it is applied.
            </p>
            <div class="mt-2 p-2 border rounded">
              <pre class="text-sm overflow-auto">{JSON.stringify(parsedJson(), null, 2)}</pre>
            </div>
          </Show>
        </div>
      </div>
      <h3 class="text-lg font-semibold mb-2 mt-6">Existing Schemas</h3>
      <Show when={schemas()}>
        <ul>
          <For each={schemas()}>
            {(schema) => (
              <li class="border p-2 mb-1 flex justify-between items-center">
                <span>
                  <strong>{schema.name}</strong>
                  <small class="ml-2 text-gray-600">{schema.id}</small>
                </span>
                <span class="flex gap-2">
                  <button class="text-sm text-blue-600" onClick={() => loadSchema(schema.id)} disabled={isSaving()}>
                    Edit
                  </button>
                  <button
                    class={`text-sm ${
                      isDeleting() === schema.id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'
                    }`}
                    onClick={() => deleteSchema(schema.id)}
                    disabled={isDeleting() === schema.id}
                  >
                    {isDeleting() === schema.id ? 'Deleting...' : 'Delete'}
                  </button>
                </span>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
