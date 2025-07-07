import { createMemo, createSignal, createResource, Show, For } from 'solid-js';
import { listIcons, getIconSvg, downloadIcons } from '../services/icon';
import { Icon } from './ui/Icon';
import { KNOWN_PREFIXES } from '../constants/icon';
export default function IconManager() {
  const [page, setPage] = createSignal(1);
  const [prefix, setPrefix] = createSignal('');
  const [sort, setSort] = createSignal<'prefix' | 'name'>('name');
  const [order, setOrder] = createSignal<'asc' | 'desc'>('asc');
  const [inputIcons, setInputIcons] = createSignal('');
  const [downloading, setDownloading] = createSignal(false);

  const [icons, { refetch }] = createResource(
    () => ({ page: page(), prefix: prefix(), sort: sort(), order: order(), limit: 50 }),
    listIcons,
  );
  const parsedNames = createMemo(() =>
    inputIcons()
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean),
  );

  const invalidNames = createMemo(() => {
    const pattern = /^[a-z0-9-]+:[a-zA-Z0-9-]+$/;
    return parsedNames().filter((name) => !pattern.test(name));
  });

  const hasErrors = createMemo(() => invalidNames().length > 0);
  const [selectedSvg, setSelectedSvg] = createSignal<string | null>(null);

  const handlePreview = async (prefix: string, name: string) => {
    const svg = await getIconSvg(prefix, name);
    setSelectedSvg(svg);
  };
  const handleDownloadFromIconify = async () => {
    const raw = inputIcons();
    const names = raw
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    // Validate format: must match "prefix:name"
    const validPattern = /^[a-z0-9-]+:[a-zA-Z0-9-]+$/;
    const invalid = names.filter((name) => !validPattern.test(name));

    if (!names.length) {
      alert('Please enter at least one icon name.');
      return;
    }

    if (invalid.length) {
      alert(`Invalid icon names:\n${invalid.join(', ')}`);
      return;
    }

    // Optional: deduplicate
    const uniqueNames = Array.from(new Set(names));

    setDownloading(true);
    try {
      await downloadIcons(uniqueNames);
      setInputIcons('');
      await refetch();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download icons. See console for details.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div class="space-y-6 border rounded p-4 ">
      <div class="flex flex-col md:flex-row md:items-center gap-3">
        <input
          placeholder="Filter prefix..."
          value={prefix()}
          onInput={(e) => setPrefix(e.currentTarget.value)}
          class="border px-2 py-1 rounded"
        />
        <select onChange={(e) => setSort(e.currentTarget.value as 'prefix' | 'name')} value={sort()}>
          <option value="prefix">Sort by Prefix</option>
          <option value="name">Sort by Name</option>
        </select>
        <select onChange={(e) => setOrder(e.currentTarget.value as 'asc' | 'desc')} value={order()}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <button onClick={() => refetch()} class="px-3 py-1 border rounded bg-blue-600 text-white">
          Refresh
        </button>
      </div>

      <div class="flex flex-col gap-2 ">
        <div class="flex flex-col md:flex-row md:items-center gap-3">
          <input
            list="prefix-suggestions"
            placeholder="mdi:home, tabler:calendar"
            value={inputIcons()}
            onInput={(e) => setInputIcons(e.currentTarget.value)}
            class={`border px-2 py-1 rounded w-full md:w-1/2 ${hasErrors() ? 'border-red-500' : ''}`}
          />
          <button
            onClick={handleDownloadFromIconify}
            disabled={downloading() || hasErrors()}
            class="px-4 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          >
            {downloading() ? 'Downloading…' : 'Download from Iconify'}
          </button>
        </div>

        <datalist id="prefix-suggestions">
          <For each={KNOWN_PREFIXES}>{(prefix) => <option value={`${prefix}:`} />}</For>
        </datalist>

        <Show when={hasErrors()}>
          <div class="text-red-600 text-sm">Invalid format(s): {invalidNames().join(', ')}</div>
        </Show>
      </div>

      <Show when={icons.loading}>Loading icons...</Show>

      <Show when={icons()}>
        <div class="grid grid-cols-4 md:grid-cols-16 gap-2  border rounded p-4">
          <For each={icons().icons}>
            {(icon) => (
              <div class="text-center transition">
                {/**<div class="text-sm text-gray-500">{icon.prefix}</div>**/}
                <div class="font-semibold m-auto">
                  <Icon icon={`${icon.prefix}:${icon.name}`} width="40px" height="40px" />
                </div>
                {/**<div class="text-sm text-gray-500">{icon.name}</div>**/}
                {/**<div class="flex gap-2 mt-2 text-sm">
              <button
                onClick={() => handlePreview(icon.prefix, icon.name)}
                class="text-blue-600 underline"
              >
                Preview
              </button>
              <a
                href={`http://localhost:5000/api/file/download?filePath=${icon.path}`}
                target="_blank"
                download
                class="text-green-600 underline"
              >
                Download
              </a>
            </div>**/}
              </div>
            )}
          </For>
        </div>

        <div class="mt-4 flex items-center gap-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} class="px-3 py-1 border rounded">
            Previous
          </button>
          <span>Page {page()}</span>
          <button onClick={() => setPage((p) => p + 1)} class="px-3 py-1 border rounded">
            Next
          </button>
        </div>
      </Show>

      <Show when={selectedSvg()}>
        <div class="mt-6 p-4 border rounded shadow-lg">
          <h3 class="text-lg font-semibold mb-2">Preview</h3>
          <div innerHTML={selectedSvg()} class="w-20 h-20" />
          <button onClick={() => setSelectedSvg(null)} class="mt-2 text-red-500 underline">
            Close
          </button>
        </div>
      </Show>
    </div>
  );
}
