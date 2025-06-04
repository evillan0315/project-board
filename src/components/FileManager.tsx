import { createResource, createSignal, For, Show, onCleanup } from 'solid-js';
import api from '../services/api';

type FileItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  type: 'file' | 'folder';
  children: FileItem[];
};

type ContextMenuState = {
  x: number;
  y: number;
  file: FileItem | null;
  visible: boolean;
};

const fetchFileList = async (): Promise<FileItem[]> => {
  const dir = '/var/www/webapps/project-board';
  const res = await api.get(`/file/list?directory=./`);
  if (!res.data) throw new Error('Failed to load files');
  console.log(res.data, 'res.data');
  return res.data;
};

function buildTree(files: FileItem[] = []): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();
  for (const file of files) {
    map.set(file.path, { ...file, children: file.children || [] });
  }

  const tree: FileItem[] = [];
  for (const file of map.values()) {
    const segments = file.path.split('/');
    if (segments.length === 1) {
      tree.push(file);
    } else {
      const parentPath = segments.slice(0, -1).join('/');
      const parent = map.get(parentPath);
      if (parent) parent.children.push(file);
    }
  }

  return tree;
}

const FileNode = (props: {
  file: FileItem;
  onSelect: (path: string) => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
}) => {
  const [open, setOpen] = createSignal(false);
  const [editing, setEditing] = createSignal(false);
  const [newName, setNewName] = createSignal(props.file.name);

  const isDir = props.file.isDirectory && props.file.children.length > 0;

  const toggle = () => {
    if (isDir) setOpen(!open());
  };

  const handleRename = async () => {
    if (newName() !== props.file.name) {
      //await renameFile(props.file.path, newName());
    }
    setEditing(false);
  };

  return (
    <div class="ml-2">
      <div
        class="cursor-pointer"
        onClick={() => (isDir ? toggle() : props.onSelect(props.file.path))}
        onContextMenu={(e) => props.onContextMenu(e, props.file)}
        onDblClick={() => setEditing(true)}
      >
        <Show
          when={editing()}
          fallback={
            <div class="inline-flex items-center max-w-[220px] truncate whitespace-nowrap overflow-hidden">
              {isDir ? (open() ? '📂' : '📁') : '📄'}&nbsp;
              <span class="truncate">{props.file.name}</span>
            </div>
          }
        >
          <input
            class="border border-neutral-300 rounded px-1"
            value={newName()}
            autofocus
            onInput={(e) => setNewName(e.currentTarget.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRename();
              }
            }}
          />
        </Show>
      </div>

      <div
        class="pl-3 border-l border-gray-300 dark:border-gray-900 transition-all duration-200 origin-top"
        style={{ display: open() ? 'block' : 'none' }}
      >
        <For each={props.file.children}>
          {(child) => <FileNode file={child} onSelect={props.onSelect} onContextMenu={props.onContextMenu} />}
        </For>
      </div>
    </div>
  );
};

export default function FileManager(props: { onFileSelect: (path: string) => void }) {

  const [files, { refetch }] = createResource(fetchFileList);
  
  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    setContextMenu({
      x: rect.left,
      y: rect.bottom,
      file,
      visible: true,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#context-menu')) closeContextMenu();
  };

  document.addEventListener('click', handleClickOutside);
  onCleanup(() => document.removeEventListener('click', handleClickOutside));

  return (
    <div class="relative">
      <Show when={files()} fallback={<div>Loading...</div>}>
        <For each={buildTree(files())} fallback={<div>No files found.</div>}>
          {(file) => <FileNode file={file} onSelect={props.onFileSelect} onContextMenu={handleContextMenu} />}
        </For>
      </Show>

      <Show when={contextMenu().visible && contextMenu().file}>
        <div
          id="context-menu"
          class="fixed min-w-[140px] border shadow-md rounded p-2 z-50"
          style={{
            top: `${contextMenu().y}px`,
            left: `${contextMenu().x}px`,
          }}
        >
          <div class="text-sm font-semibold">{contextMenu().file?.name}</div>
          <div class="text-xs mb-2">{contextMenu().file?.type === 'folder' ? '📁 Folder' : '📄 File'}</div>
          <div
            class="text-sm text-yellow-500 hover:underline cursor-pointer"
            onClick={() => {
              props.onFileSelect(contextMenu().file!.path);
              closeContextMenu();
            }}
          >
            Open
          </div>
          <div
            class="text-sm text-red-500 hover:underline cursor-pointer mt-1"
            onClick={() => {
              alert(`Delete ${contextMenu().file!.name} (not implemented)`);
              closeContextMenu();
            }}
          >
            Delete
          </div>
        </div>
      </Show>
    </div>
  );
}
