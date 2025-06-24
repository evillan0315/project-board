import { createStore } from 'solid-js/store';
import { createMemo, Show, For, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { fileService } from '../../services/fileService';
import { directoryChildren, setDirectoryChildren, filesDirectories, selectedFile } from '../../stores/fileStore';
import { useStore } from '@nanostores/solid';
import type { FileItem } from '../../types/types';

interface FileNodeProps {
  file: FileItem;
  onSelect: (path: string, isDirectory: boolean) => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
  onRefresh?: (directory?: string) => void;
}

const FileNodeSocket = (props: FileNodeProps) => {
  const [state, setState] = createStore({
    open: false,
    editing: false,
    newName: props.file.name,
    loadingChildren: false,
  });

  const $directoryChildren = useStore(directoryChildren);

  const currentIcon = createMemo(() =>
    props.file.isDirectory
      ? state.open
        ? 'vscode-icons:default-folder-opened'
        : 'vscode-icons:default-folder'
      : 'vscode-icons:default-file',
  );

  const toggle = async () => {
    if (!props.file.isDirectory) return;
    setState('open', (o) => !o);

    if (!state.open && !$directoryChildren()[props.file.path]) {
      setState('loadingChildren', true);
      try {
        const res = await fileService.emitDynamicFileEvent({
          endpoint: `/file/list?directory=${encodeURIComponent(props.file.path)}&recursive=true`,
          method: 'GET',
          event: 'listFiles',
        });
        if (Array.isArray(res)) {
          setDirectoryChildren(props.file.path, res);
        }
      } catch (err) {
        console.error('Failed to load directory contents:', err);
      } finally {
        setState('loadingChildren', false);
      }
    }
  };

  const handleRename = async () => {
    const trimmed = state.newName.trim();
    if (!trimmed || trimmed === props.file.name) {
      setState('editing', false);
      return;
    }

    try {
      await fileService.emitDynamicFileEvent({
        endpoint: '/file/rename',
        method: 'POST',
        body: {
          oldPath: props.file.path,
          newPath: `${props.file.path.substring(0, props.file.path.lastIndexOf('/') + 1)}${trimmed}`,
        },
        event: 'renameFile',
      });
      props.onRefresh?.();
    } catch (err) {
      console.error('Rename failed:', err);
      setState('newName', props.file.name);
    } finally {
      setState('editing', false);
    }
  };

  onMount(() => {
    setState('newName', props.file.name);
  });

  return (
    <div class="relative">
      <div
        class="cursor-pointer hover:bg-gray-700/10 px-1 rounded flex items-center justify-between gap-1"
        onContextMenu={(e) => props.onContextMenu(e, props.file)}
        onDblClick={() => props.onSelect(props.file.path, props.file.isDirectory)}
        onClick={() => !props.file.isDirectory && props.onSelect(props.file.path, false)}
      >
        <div class="flex items-center justify-start gap-3">
          <Icon width="1.2em" height="1.2em" icon={currentIcon()} />
          <Show when={state.editing} fallback={<div class="truncate max-w-[150px]">{props.file.name}</div>}>
            <input
              class="rounded px-1 text-sm"
              value={state.newName}
              autofocus
              onInput={(e) => setState('newName', e.currentTarget.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') setState({ newName: props.file.name, editing: false });
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Show>
        </div>
        {props.file.isDirectory && (
          <Icon
            icon={state.open ? 'mdi:chevron-down' : 'mdi:chevron-right'}
            class="w-4 h-4 text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          />
        )}
      </div>
      <Show when={state.open}>
        <div class="pl-2 border-l border-gray-500/30 ml-1">
          <Show when={state.loadingChildren}>
            <div class="text-sm px-2">Loading...</div>
          </Show>
          <For each={$directoryChildren()[props.file.path] || []}>
            {(child) => (
              <FileNodeSocket
                file={child}
                onSelect={props.onSelect}
                onContextMenu={props.onContextMenu}
                onRefresh={props.onRefresh}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default FileNodeSocket;
