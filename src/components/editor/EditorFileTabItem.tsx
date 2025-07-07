import { createMemo, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { editorUnsaved } from '../../stores/editorContent';

interface EditorFileTabItemProps {
  path: string;
  active?: boolean;
  unsaved?: boolean;
  unsavedContent?: string;
  onClick?: (path: string) => void;
  onClose?: (path: string) => void;
}

export default function EditorFileTabItem(props: EditorFileTabItemProps): JSX.Element {
  const $unsaved = useStore(editorUnsaved);
  // console.log(editorUnsaved.get()); // No need for this console.log in production code

  const fileName = createMemo(() => props.path.split('/').pop() || '');
  const hasUnsaved = createMemo(() => !!$unsaved()[props.path]);

  return (
    <div
      class={`
        file-tab-item
        cursor-pointer
        flex-shrink-0           // Important: Prevent tabs from shrinking too much initially
        flex
        items-center
        gap-0
        text-sm
        font-light
        pl-4 py-0              // Remove padding from here, add to inner div
        ${
          props.active
            ? 'text-sky-600 hover:bg-gray-900/40 font-semibold border-b-2 border-sky-600 active'
            : 'hover:text-sky-500'
        }
      `}
    >
      <div
        class="
          pr-1 py-2            // Apply padding here for clickable area
          flex
          items-center
          gap-1
          min-w-0              // Allow the div to shrink below its content's intrinsic size
          max-w-[150px]
        "
        onClick={() => props.onClick?.(props.path)}
      >
        <span
          class="
            truncate           // Truncate text if it overflows
            overflow-hidden    // Hide overflowing content
            whitespace-nowrap  // Prevent text from wrapping
            flex-grow          // Allow the text to grow and take available space
            min-w-0            // Essential for truncate to work correctly in flex containers
          "
          title={props.path}
        >
          {fileName()}
        </span>
      </div>
      <Icon
        title={`Close ${fileName()}`}
        icon="mdi:close"
        class="text-red-600 hover:text-red-500 mr-2 flex-shrink-0" // Add margin-right and flex-shrink-0
        onClick={(e) => {
          e.stopPropagation();
          props.onClose?.(props.path);
        }}
      />
    </div>
  );
}
