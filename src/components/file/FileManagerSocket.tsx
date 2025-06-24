import { createMemo, onMount, onCleanup, For, Show, createSignal } from 'solid-js';
import * as path from 'path-browserify';
import FileNodeSocket from '../../components/file/FileNodeSocket';
import { Icon } from '@iconify-icon/solid';
import { confirm, prompt, alert } from '../../services/modalService';
import ContextMenu from '../ui/ContextMenu';
import { useStore } from '@nanostores/solid';
import { currentDirectory, directoryChildren, selectedFile, filesDirectories } from '../../stores/fileStore';
import { fileService } from '../../services/fileService';
import type { FileItem } from '../../types/types';

function buildTree(files: FileItem[] = []): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();
  files.forEach((file) => map.set(file.path, { ...file, children: [] }));

  const tree: FileItem[] = [];
  for (const file of map.values()) {
    const parentPath = path.dirname(file.path);
    if (parentPath === '.' || parentPath === file.path) {
      tree.push(file);
    } else {
      const parent = map.get(parentPath);
      if (parent) {
        parent.children.push(file);
      } else {
        console.warn(`Orphaned file/folder: ${file.path}`);
        tree.push(file);
      }
    }
  }

  const sortTree = (nodes: FileItem[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children?.length && sortTree(n.children));
  };

  sortTree(tree);
  return tree;
}

export default function FileManagerSocket(props: {
  onFileSelect?: (path: string) => void;
  refreshList?: (refreshFn: (dir?: string) => Promise<void>) => void;
}) {
  const $currentDirectory = useStore(currentDirectory);

  const $filesDirectories = useStore(filesDirectories);

  const fileTree = createMemo(() => {
    const files = $filesDirectories();
    return Array.isArray(files) ? files : [];
  });
  //const fileTree = createMemo(() => buildTree($filesDirectories()));

  const [contextMenu, setContextMenu] = createSignal({
    x: 0,
    y: 0,
    file: null as FileItem | null,
    visible: false,
  });

  const fetchDirectory = async (directory = './') => {
    try {
      const files = await fileService.emitDynamicFileEvent({
        endpoint: `/file/list?directory=${encodeURIComponent(directory)}&recursive=true`, // assuming API supports recursive
        method: 'GET',
        event: 'listFiles',
      });
      directoryChildren.set(files); // immediate children (optional if filesDirectories is the main source)
      filesDirectories.set(files); // full structure from API
      currentDirectory.set(directory);
    } catch (err) {
      console.error('Failed to fetch directory:', err);
      alert(`Failed to fetch directory: ${err.message}`);
    }
  };

  const handleFileNodeSelect = async (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fetchDirectory(filePath);
    } else {
      // Update this to use fileStore if does not exists use fileService
      props.onFileSelect?.(filePath);
    }
  };

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
      handleFileNodeSelect(file.path, file.isDirectory);
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
      fetchDirectory($currentDirectory());
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
        fetchDirectory($currentDirectory());
      }
    }
  };

  onMount(() => {
    fileService.connect();
    fetchDirectory($currentDirectory());
    document.addEventListener('click', handleClickOutside);
    props.refreshList?.(fetchDirectory);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="flex flex-col h-full">
      <div class="p-2 flex-grow overflow-auto">
        <Show when={fileTree().length > 0} fallback={<div class="text-center text-gray-500">No files or folders.</div>}>
          <For each={fileTree()}>
            {(file) => (
              <FileNodeSocket
                file={file}
                onSelect={handleFileNodeSelect}
                onContextMenu={handleContextMenu}
                onRefresh={fetchDirectory}
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
