import { createSignal, createEffect, For, Show } from 'solid-js';
import { loadSwaggerSpec } from '../services/swaggerService';
import type { SwaggerSpec, SwaggerOperation } from '../types/swagger';
import { createModalService } from './ui/CreateModalService';
const { Modal, confirm, alert, prompt } = createModalService();

export default function SwaggerBuilder() {
  const [swagger, setSwagger] = createSignal<SwaggerSpec | null>(null);
  const [error, setError] = createSignal<string>('');

  createEffect(async () => {
    try {
      const spec = await loadSwaggerSpec();
      if (!spec.components) spec.components = {};
      if (!spec.components.schemas) spec.components.schemas = {};
      setSwagger(spec);
    } catch (e) {
      setError((e as Error).message);
    }
  });

  const addPath = () => {
    const path = prompt('Enter new path (e.g., /api/new-endpoint):');
    if (path && swagger()) {
      const updated = { ...swagger() };
      updated.paths = {
        ...updated.paths,
        [path]: { get: { summary: 'New GET endpoint', responses: { '200': { description: 'OK' } } } },
      };
      setSwagger(updated);
    }
  };

  const deletePath = (path: string) => {
    if (swagger()) {
      const updated = { ...swagger() };
      delete updated.paths[path];
      setSwagger(updated);
    }
  };

  const updateSummary = (path: string, method: string) => {
    const summary = prompt('Enter new summary:');
    if (summary && swagger()) {
      const updated = { ...swagger() };
      updated.paths[path][method].summary = summary;
      setSwagger(updated);
    }
  };

  const addSchema = () => {
    const name = prompt('Enter schema (DTO) name:');
    if (name && swagger()) {
      const updated = { ...swagger() };
      updated.components!.schemas![name] = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      };
      setSwagger(updated);
    }
  };

  const deleteSchema = (name: string) => {
    if (swagger()) {
      const updated = { ...swagger() };
      delete updated.components!.schemas![name];
      setSwagger(updated);
    }
  };

  return (
    <div class="p-4 space-y-4">
      <h1 class="text-xl font-bold">Swagger Builder</h1>

      <Show when={error()}>
        <div class="text-red-500">{error()}</div>
      </Show>

      <Show when={swagger()}>
        <div class="space-x-2">
          <button class="bg-blue-500 p-2 rounded text-white" onClick={addPath}>
            Add Path
          </button>
          <button class="bg-green-500 p-2 rounded text-white" onClick={addSchema}>
            Add Schema
          </button>
        </div>

        <div class="mt-4">
          <h2 class="font-semibold">Paths</h2>
          <For each={Object.entries(swagger()!.paths || {})}>
            {([path, item]) => (
              <div class="border p-2 rounded mt-2">
                <div class="flex justify-between items-center">
                  <div class="font-mono">{path}</div>
                  <button class="text-red-500" onClick={() => deletePath(path)}>
                    Delete
                  </button>
                </div>
                <For each={Object.entries(item)}>
                  {([method, op]) => (
                    <div class="ml-4">
                      <span class="uppercase font-bold">{method}</span> - {op.summary || '(no summary)'}
                      <button class="ml-2 text-blue-500" onClick={() => updateSummary(path, method)}>
                        Edit Summary
                      </button>
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>

        <div class="mt-4">
          <h2 class="font-semibold">Schemas / DTOs</h2>
          <For each={Object.entries(swagger()!.components!.schemas! || {})}>
            {([name, schema]) => (
              <div class="border p-2 rounded mt-2">
                <div class="flex justify-between items-center">
                  <div class="font-mono">{name}</div>
                  <button class="text-red-500" onClick={() => deleteSchema(name)}>
                    Delete
                  </button>
                </div>
                <div class="ml-2">
                  <pre class="p-1 text-sm overflow-auto">{JSON.stringify(schema, null, 2)}</pre>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Modal />
    </div>
  );
}
