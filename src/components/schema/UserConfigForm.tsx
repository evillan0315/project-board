import { createSignal, Show, onMount } from 'solid-js';
import api from '../../services/api';
import DynamicForm from '../form/DynamicForm';
import type { JsonSchema, FormData } from '../form/DynamicForm';
import { useAuth } from '../../contexts/AuthContext';

export default function UserConfigForm() {
  const auth = useAuth();

  const [schema, setSchema] = createSignal<JsonSchema | null>(null);
  const [schemaId, setSchemaId] = createSignal<string | null>(null);
  const [schemaName, setSchemaName] = createSignal<string | null>(null);
  const [initialData, setInitialData] = createSignal<FormData | null>(null);
  const [jsonPreview, setJsonPreview] = createSignal<string>('');
  const [error, setError] = createSignal<string | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);
  const [isLoadingSchema, setIsLoadingSchema] = createSignal(true);

  onMount(async () => {
    try {
      setIsLoadingSchema(true);

      // Fetch the schema
      const schemaRes = await api.get(`/schema/e835f0a6-5018-4cde-8324-3e8c9378107e`);
      setSchema(schemaRes.data.schema);
      setSchemaId(schemaRes.data.id);
      setSchemaName(schemaRes.data.name);

      // Fetch user's submission if exists
      if (auth.user()?.id) {
        const subRes = await api.get(`/schema-submission/by-schema-user`, {
          params: {
            schemaId: schemaRes.data.id,
            submittedById: auth.user()?.id,
          },
        });
        console.log(subRes.data[0].data);
        if (Array.isArray(subRes.data) && subRes.data.length > 0) {
          setInitialData(subRes.data[0].data);
          setJsonPreview(JSON.stringify(subRes.data[0].data, null, 2));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load configuration or submission data.');
    } finally {
      setIsLoadingSchema(false);
    }
  });

  async function handleSubmit(data: FormData) {
    if (!schemaId() || !schemaName()) {
      setError('Schema ID or name is missing. Cannot submit form.');
      return;
    }
    setIsLoadingSchema(true);
    setIsSaving(true);
    setError(null);
    try {
      setJsonPreview(JSON.stringify(data, null, 2));
      await api.post('/schema-submission', {
        schemaId: schemaId(),
        schemaName: schemaName(),
        data: data,
      });
      setIsLoadingSchema(false);
      alert('Configuration submitted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit configuration.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div class="flex-1 overflow-auto">
      <h2 class="text-xl font-bold mb-2">User Configuration Form</h2>

      <Show when={error()}>
        <div class="text-red-600 mb-2">{error()}</div>
      </Show>

      <Show when={isLoadingSchema()}>
        <div class="text-gray-500">Loading schema...</div>
      </Show>

      <Show when={schema()}>
        <DynamicForm schema={schema()!} initialData={initialData() ?? undefined} onSubmit={handleSubmit} />
      </Show>

      <div class="mt-4">
        <h3 class="font-semibold">JSON Preview</h3>
        <pre class="border rounded p-2 text-sm overflow-auto bg-gray-50 dark:bg-gray-900">{jsonPreview()}</pre>
      </div>

      <Show when={isSaving()}>
        <div class="mt-2 text-sm text-gray-500">Saving...</div>
      </Show>
    </div>
  );
}
