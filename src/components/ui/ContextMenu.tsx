import { type JSX, For, Show } from 'solid-js';

export interface ContextMenuItem {
  icon: string;
  label: string;
  action: () => void;
}

export interface FileMeta {
  isDirectory: boolean;
  size?: number; // in bytes
  createdAt?: string; // ISO string or formatted string
  updatedAt?: string;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  items: ContextMenuItem[];
  file?: FileMeta;
}

export default function ContextMenu(props: ContextMenuProps) {
  return (
    <Show when={props.visible}>
      <div
        id="context-menu"
        class="fixed min-w-[160px] rounded shadow-lg text-sm z-50"
        style={{ top: `${props.y - 10}px`, left: `${props.x}px` }}
      >
        <Show when={props.title}>
          <div class="px-3 py-2 font-semibold truncate">{props.title}</div>
        </Show>
        <Show when={props.file.size && !props.file.isDirectory}>
          <div class="px-3 py-1 text-xs border-b text-gray-500">
            <Show when={props.file?.size !== undefined}>
              Size: {(props.file!.size! / 1024).toFixed(2)} KB
              <br />
            </Show>
            <Show when={props.file?.createdAt}>
              Created: {props.file!.createdAt}
              <br />
            </Show>
            <Show when={props.file?.updatedAt}>Updated: {props.file!.updatedAt}</Show>
          </div>
        </Show>

        <ul class="py-1">
          <For each={props.items}>
            {(item) => (
              <li class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-500/30" onClick={item.action}>
                <span class="inline-block">
                  <item.icon width="1.2em" height="1.2em" />
                </span>
                {item.label}
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
}
