import { For, createSignal } from 'solid-js';

interface JsonFieldProps {
  id: string;
  value: Record<string, string>;
  description?: string;
  onChange: (val: Record<string, string>) => void;
}

const JsonField = (props: JsonFieldProps) => {
  const [localValue, setLocalValue] = createSignal<Record<string, string>>(props.value || {});

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const updated = { ...localValue() };
    if (oldKey !== newKey) {
      updated[newKey] = updated[oldKey];
      delete updated[oldKey];
      setLocalValue(updated);
      props.onChange(updated);
    }
  };

  const handleValueChange = (key: string, newValue: string) => {
    const updated = { ...localValue(), [key]: newValue };
    setLocalValue(updated);
    props.onChange(updated);
  };

  const handleAdd = () => {
    const newKey = `key_${Date.now()}`;
    const updated = { ...localValue(), [newKey]: '' };
    setLocalValue(updated);
    props.onChange(updated);
  };

  const handleRemove = (key: string) => {
    const updated = { ...localValue() };
    delete updated[key];
    setLocalValue(updated);
    props.onChange(updated);
  };

  return (
    <div class="field-group border rounded p-2 ">
      <label class="block font-semibold mb-1">{props.description || 'Key-Value Pairs'}</label>
      <For each={Object.entries(localValue())}>
        {([key, val]) => (
          <div class="flex flex-col gap-2 mb-1">
            <input
              class="border p-1 flex-1 rounded"
              placeholder="Key"
              value={key}
              onInput={(e) => handleKeyChange(key, e.currentTarget.value)}
            />
            <input
              class="border p-1 flex-1 rounded"
              placeholder="Value"
              value={val}
              onInput={(e) => handleValueChange(key, e.currentTarget.value)}
            />
            <button type="button" class="text-red-600" onClick={() => handleRemove(key)}>
              Remove
            </button>
          </div>
        )}
      </For>
      <button type="button" class="text-blue-600 text-sm mt-1" onClick={handleAdd}>
        + Add Entry
      </button>
    </div>
  );
};

export default JsonField;
