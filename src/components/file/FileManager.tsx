import { createMemo, onMount, onCleanup, For, Show, createSignal, createEffect } from 'solid-js';
import * as path from 'path-browserify';
import FileNode from '../../components/file/FileNode';
import Loading from '../../components/Loading';
import { Icon } from '@iconify-icon/solid';
import { useEditorFile } from '../../hooks/useEditorFile';
import { confirm, prompt, alert } from '../../services/modalService';
import ContextMenu, { type ContextMenuItem } from '../ui/ContextMenu';
import { useStore } from '@nanostores/solid';
import { editorCurrentDirectory, editorFilesDirectories } from '../../stores/editorContent';
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

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(dateStr));
}

export default function FileManager(props: {
  onFileSelect?: (path: string) => void;
  refreshList?: (refreshFn: (dir?: string) => Promise<void>) => void;
}) {
  const { currentDirectory, fetchDirectory, createFile, createFolder, deleteFileOrFolder } = useEditorFile();
  const $editorCurrentDirectory = useStore(editorCurrentDirectory);
  const $editorFilesDirectories = useStore(editorFilesDirectories);
  const fileTree = createMemo(() => buildTree($editorFilesDirectories()));

  const [contextMenu, setContextMenu] = createSignal({
    x: 0,
    y: 0,
    file: null as FileItem | null,
    visible: false,
  });

  const handleFileNodeSelect = (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fetchDirectory(filePath);
    } else {
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
      const targetDir = file.isDirectory ? file.path : currentDirectory();
      const name = await prompt(`Enter name for new ${type}:`, '', 'info');
      if (!name) return alert('Name cannot be empty.', 'warning');
      if (type === 'file') await createFile(targetDir, name);
      if (type === 'folder') await createFolder(targetDir, name);
    }

    if (action === 'delete') {
      const confirmed = await confirm(`Delete "${file.name}"? This action cannot be undone.`, 'warning');
      if (confirmed) await deleteFileOrFolder(file.path);
    }
  };

  onMount(() => {
    fetchDirectory($editorCurrentDirectory());
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
              <FileNode
                file={file}
                onSelect={handleFileNodeSelect}
                onContextMenu={handleContextMenu}
                onRefresh={() => fetchDirectory(currentDirectory() || './')}
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
              Created: {formatDate(contextMenu().file.createdAt)}
              <br />
              Updated: {formatDate(contextMenu().file.updatedAt)}
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
                  icon: Icon.bind(null, {
                    icon: 'qlementine-icons:add-file-16',
                  }),
                  label: 'New File',
                  action: () => handleFileAction('create', 'file'),
                },
                {
                  icon: Icon.bind(null, {
                    icon: 'mdi:folder-add-outline',
                  }),
                  label: 'New Folder',
                  action: () => handleFileAction('create', 'folder'),
                },
              ]
            : []),
          {
            icon: Icon.bind(null, {
              icon: 'streamline:file-delete-alternate',
            }),
            label: 'Delete',
            action: () => handleFileAction('delete'),
          },
        ]}
      />
    </div>
  );
}
