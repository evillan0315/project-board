import { type Component, createSignal, Show, For, onMount, onCleanup } from 'solid-js';
import { Button } from '../ui/Button';
import { Icon } from '@iconify-icon/solid';
import * as path from 'path-browserify';
import { prompt, alert } from '../../services/modalService';
import { fileService } from '../../services/fileService';
import ContextMenu from '../ui/ContextMenu';
import { useStore } from '@nanostores/solid';
import {
  currentDirectory,
  recentDirectories,
  addRecentDirectory,
  loadRecentDirectoriesFromStorage,
} from '../../stores/fileStore';

interface FileManagerHeaderProps {
  fetchDirectory: (dir: string) => void;
}

const FileManagerHeader: Component<FileManagerHeaderProps> = (props) => {
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
        body: { directory: $currentDirectory(), name },
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
    console.log(parent, 'parent');
    console.log($currentDirectory(), 'current directory');
    if (parent !== $currentDirectory()) {
      //setShowDropdown(true);
      currentDirectory.set(parent);
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
      <ContextMenu
        title="Manage File and Folder"
        subtitle={$currentDirectory()}
        items={[
          {
            icon: Icon.bind(null, { icon: 'mdi:file-plus' }),
            label: 'New File',
            action: () => handleCreate('file'),
          },
          {
            icon: Icon.bind(null, { icon: 'mdi:folder-plus' }),
            label: 'New Folder',
            action: () => handleCreate('folder'),
          },
        ]}
      />

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
};

export default FileManagerHeader;
