import { createMemo, onMount, onCleanup, For, Show, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import * as path from 'path-browserify';
import { useStore } from '@nanostores/solid';
import { Icon } from '@iconify-icon/solid';

import buildTree from './utils/buildFileTree';

import { confirm, prompt, alert } from '../../services/modalService';
import ContextMenu from '../ui/ContextMenu';
import { Button } from '../ui/Button';
import DropdownMenu from '../ui/DropdownMenu';

import {
  currentDirectory,
  recentDirectories,
  addRecentDirectory,
  loadRecentDirectoriesFromStorage,
  filesDirectories,
  selectedFile,
  directoryChildren,
  setDirectoryChildren,
} from '../../stores/fileStore';
import { fileService } from '../../services/fileService';

import type { FileItem } from '../../types/types';
import { getFileIcon } from './utils/getIcon';

interface EditorFileManagerHeaderProps {
  fetchDirectory: (dir: string) => void;
}

interface EditorFileManagerNodeProps {
  file: FileItem;
  onSelect: (path: string, isDirectory: boolean) => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
  onRefresh?: (directory?: string) => void;
}

export function EditorFileManagerNode(props: EditorFileManagerNodeProps) {
  const [state, setState] = createStore({
    open: false,
    editing: false,
    newName: props.file.name,
    loadingChildren: false,
  });

  const $directoryChildren = useStore(directoryChildren);

  const currentIcon = createMemo(() => getFileIcon(props.file.name, props.file.isDirectory, state.open));

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
              <EditorFileManagerNode
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
}

export function EditorFileManagerHeader(props: EditorFileManagerHeaderProps) {
  const $currentDirectory = useStore(currentDirectory);
  const $recentDirectories = useStore(recentDirectories);
  const [showDropdown, setShowDropdown] = createSignal(false);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleDirectorySelect = (directory: string) => {
    currentDirectory.set(directory);
    addRecentDirectory(directory);
    props.fetchDirectory(directory);
    setShowDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const dropdown = document.getElementById('directory-dropdown-menu');
    const button = document.getElementById('browse-directory-button');
    if (dropdown && !dropdown.contains(e.target as Node) && button && !button.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  const handleCreate = async (type: 'file' | 'folder') => {
    const name = await prompt(`Enter name for new ${type}:`, '', 'info');
    if (!name) {
      await alert(`${type === 'file' ? 'File' : 'Folder'} name cannot be empty.`, 'warning');
      return;
    }
    try {
      await fileService.emitDynamicFileEvent({
        endpoint: '/file/create',
        method: 'POST',
        body: { filePath: `${$currentDirectory()}/${name}`, type },
        event: type === 'file' ? 'createFile' : 'createFolder',
      });
      props.fetchDirectory($currentDirectory());
    } catch (err: any) {
      console.error(`Error creating ${type}:`, err);
      alert(`Error creating ${type}: ${err.message}`);
    }
  };

  const goUpDirectory = () => {
    const parent = path.dirname($currentDirectory());
    if (parent !== $currentDirectory()) {
      //setShowDropdown(true);
      currentDirectory.set(parent);
      props.fetchDirectory(parent);
      //handleDirectorySelect(parent);
    }
  };

  onMount(() => {
    loadRecentDirectoriesFromStorage();
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="flex items-center gap-2 min-w-0 relative">
      <Button
        icon="mdi-light:arrow-up-circle"
        variant="secondary"
        size="sm"
        onClick={goUpDirectory}
        title="Go up directory"
      />

      <Button
        id="browse-directory-button"
        icon="mdi:folder-open"
        variant="secondary"
        onClick={toggleDropdown}
        title="Browse Directory"
      />

      <Button
        icon="mdi:refresh"
        variant="secondary"
        size="sm"
        onClick={() => props.fetchDirectory($currentDirectory())}
        title="Refresh Current Directory"
      />
      <DropdownMenu
        variant="secondary"
        icon="circum:menu-fries"
        className="-right-50"
        rounded
        items={[
          { type: 'divider' },
          { label: 'Manage File & Folder', type: 'header', icon: 'mdi:file-code-outline' },
          { type: 'divider' },
          { label: 'New File', icon: 'mdi:file-plus', onClick: () => handleCreate('file') },
          { label: 'New Folder', icon: 'mdi:format-align-right', onClick: () => handleCreate('folder') },
        ]}
      />
      <Show when={showDropdown()}>
        <div
          id="directory-dropdown-menu"
          class="absolute top-full left-0 mt-1 w-64 rounded shadow-lg z-50 py-1 bg-white dark:bg-gray-800"
        >
          <div
            class="flex gap-2 items-center px-3 cursor-pointer hover:bg-gray-700"
            onClick={() => handleDirectorySelect($currentDirectory())}
          >
            Current: <span class="font-semibold truncate max-w-[150px] inline-block">{$currentDirectory()}</span>
          </div>
          <div class="border-t border-gray-800 my-1"></div>

          <p class="text-xs text-gray-400 px-3 pt-1 pb-1">Recent Directories:</p>
          <For each={$recentDirectories()}>
            {(dir) => (
              <div
                class="px-3 py-1 cursor-pointer hover:bg-gray-700 text-sm truncate"
                onClick={() => handleDirectorySelect(dir)}
                title={dir}
              >
                {dir}
              </div>
            )}
          </For>
          <Show when={$recentDirectories().length === 0}>
            <p class="text-xs text-gray-500 px-3 py-1">No recent directories.</p>
          </Show>

          <div class="border-t border-gray-800 my-1"></div>
        </div>
      </Show>
    </div>
  );
}
interface EditorFileManagerProps {
  files: FileItem[];
  onFileSelect?: (path: string, isDirectory?: boolean) => void;
  refreshList?: (refreshFn: (dir?: string) => Promise<void>) => void;
  fetchDirectory?: (dir: string) => void;
}
// Editor Filemanager
export default function EditorFileManager(props: EditorFileManagerProps) {
  const $currentDirectory = useStore(currentDirectory);

  const $filesDirectories = useStore(filesDirectories);

  const fileTree = createMemo(() => {
    const files = props.files;
    return Array.isArray(files) ? files : [];
  });
  //const fileTree = createMemo(() => buildTree($filesDirectories()));

  const [contextMenu, setContextMenu] = createSignal({
    x: 0,
    y: 0,
    file: null as FileItem | null,
    visible: false,
  });

  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file, visible: true });
  };

  const closeContextMenu = () => setContextMenu((c) => ({ ...c, visible: false }));

  const handleClickOutside = (e: MouseEvent) => {
    if (!document.getElementById('context-menu')?.contains(e.target as Node)) {
      closeContextMenu();
    }
  };

  const handleFileAction = async (action: 'open' | 'delete' | 'create', type?: 'file' | 'folder') => {
    const file = contextMenu().file;
    if (!file) return closeContextMenu();
    closeContextMenu();

    if (action === 'open') {
      props.onFileSelect?.(file.path, file.isDirectory);
      return;
    }

    if (action === 'create') {
      const targetDir = file.isDirectory ? file.path : $currentDirectory();
      const name = await prompt(`Enter name for new ${type}:`, '', 'info');
      if (!name) return alert('Name cannot be empty.', 'warning');
      if (type === 'file') {
        await fileService.emitDynamicFileEvent({
          endpoint: '/file/create',
          method: 'POST',
          body: { directory: targetDir, name },
          event: 'createFile',
        });
      }
      if (type === 'folder') {
        await fileService.emitDynamicFileEvent({
          endpoint: '/file/create-folder',
          method: 'POST',
          body: { directory: targetDir, name },
          event: 'createFolder',
        });
      }
      props.fetchDirectory($currentDirectory());
    }

    if (action === 'delete') {
      const confirmed = await confirm(`Delete "${file.name}"? This action cannot be undone.`, 'warning');
      if (confirmed) {
        await fileService.emitDynamicFileEvent({
          endpoint: '/file/delete',
          method: 'POST',
          body: { filePath: file.path },
          event: 'deleteFile',
        });
        props.fetchDirectory($currentDirectory());
      }
    }
  };

  onMount(() => {
    props.fetchDirectory($currentDirectory());
    document.addEventListener('click', handleClickOutside);
    //props.refreshList?.(props.fetchDirectory);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="file-manager-wrapper flex flex-col h-full">
      <div class="p-2 flex-grow overflow-auto">
        <Show when={fileTree().length > 0} fallback={<div class="text-center text-gray-500">No files or folders.</div>}>
          <For each={fileTree()}>
            {(file) => (
              <EditorFileManagerNode
                file={file}
                onSelect={props.onFileSelect}
                onContextMenu={handleContextMenu}
                onRefresh={props.fetchDirectory}
              />
            )}
          </For>
        </Show>
      </div>
      <ContextMenu
        {...contextMenu()}
        title={contextMenu().file?.name}
        subtitle={
          contextMenu().file && (
            <>
              {contextMenu().file.isDirectory ? 'Folder' : 'File'}
              {!contextMenu().file.isDirectory && ` (${(contextMenu().file.size / 1024).toFixed(2)} KB)`}
              <br />
              Created: {contextMenu().file.createdAt}
              <br />
              Updated: {contextMenu().file.updatedAt}
            </>
          )
        }
        items={[
          {
            icon: Icon.bind(null, { icon: 'ion:open-outline' }),
            label: 'Open',
            action: () => handleFileAction('open'),
          },
          ...(contextMenu().file?.isDirectory
            ? [
                {
                  icon: Icon.bind(null, { icon: 'qlementine-icons:add-file-16' }),
                  label: 'New File',
                  action: () => handleFileAction('create', 'file'),
                },
                {
                  icon: Icon.bind(null, { icon: 'mdi:folder-add-outline' }),
                  label: 'New Folder',
                  action: () => handleFileAction('create', 'folder'),
                },
              ]
            : []),
          {
            icon: Icon.bind(null, { icon: 'streamline:file-delete-alternate' }),
            label: 'Delete',
            action: () => handleFileAction('delete'),
          },
        ]}
      />
    </div>
  );
}
