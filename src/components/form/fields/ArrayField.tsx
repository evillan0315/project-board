import { type Component, For, createSignal } from 'solid-js';

interface ArrayFieldProps {
  id: string;
  value: any[];
  property: any;
  isRequired: boolean;
  onChange: (value: any[]) => void;
}

const ArrayField: Component<ArrayFieldProps> = (props) => {
  const [items, setItems] = createSignal(props.value || []);

  const updateItems = (newItems: any[]) => {
    setItems(newItems);
    props.onChange(newItems);
  };

  const addItem = () => {
    updateItems([...items(), '']);
  };

  const updateItem = (index: number, value: any) => {
    const newItems = [...items()];
    newItems[index] = value;
    updateItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items()];
    newItems.splice(index, 1);
    updateItems(newItems);
  };

  return (
    <div class="mb-4">
      <label class="block text-sm font-medium">
        {props.property.title} {props.isRequired && <span class="text-red-500">*</span>}
      </label>
      <For each={items()}>
        {(item, index) => (
          <div class="flex items-center mt-1">
            <input
              type="text"
              class="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              value={item}
              onChange={(e) => updateItem(index(), e.target.value)}
            />
            <button
              type="button"
              class="ml-2 text-red-500 hover:text-red-700 text-sm"
              onClick={() => removeItem(index())}
            >
              Remove
            </button>
          </div>
        )}
      </For>
      <button type="button" class="mt-2 text-sm text-sky-600 hover:underline" onClick={addItem}>
        + Add Item
      </button>
      {props.property.description && <p class="mt-1 text-sm text-gray-500">{props.property.description}</p>}
    </div>
  );
};

export default ArrayField;
