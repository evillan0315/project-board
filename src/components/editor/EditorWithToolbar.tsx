import { createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { Icon } from '@iconify-icon/solid';
import Editor from './Editor';
import { fileService } from '../../services/fileService';
import { openTabs } from '../../stores/tab';
import { editorActiveFilePath, editorActiveContent, editorUnsaved } from '../../stores/editorContent';
import { currentDirectory, directoryChildren, setDirectoryChildren } from '../../stores/fileStore';

const EditorWithToolbarAndFileManager = () => {
  const $openTabs = useStore(openTabs);
  const $activeFilePath = useStore(editorActiveFilePath);
  const $unsaved = useStore(editorUnsaved);
  const $currentDirectory = useStore(currentDirectory);
  const $directoryChildren = useStore(directoryChildren);

  const [viewMode, setViewMode] = createSignal<'tree' | 'list'>('tree');

  // --- Mount and setup
  onMount(() => {
    fileService.connect();
    fetchDirectory($currentDirectory() || './');
  });

  onCleanup(() => {
    fileService.disconnect();
  });

  // --- Helpers
  const fetchDirectory = async (dir: string) => {
    try {
      const res = await fileService.emitDynamicFileEvent({
        endpoint: `/file/list?directory=${encodeURIComponent(dir)}&recursive=false`,
        method: 'GET',
        event: 'listFiles',
      });
      console.log(res, 'list');
      setDirectoryChildren(dir, res);
    } catch (err) {
      console.error(`Failed to fetch directory:`, err);
    }
  };

  const openFile = (path: string) => {
    fileService.connect().emit('openFile', { path });
  };

  const closeTab = (path: string) => {
    fileService.connect().emit('closeFile', { path });
  };

  const switchTab = (path: string) => {
    if ($activeFilePath() !== path) {
      openFile(path);
    }
  };

  const saveCurrentFile = async () => {
    const path = editorActiveFilePath.get();
    const content = editorActiveContent.get();
    if (!path) return;

    try {
      await fileService.emitDynamicFileEvent({
        endpoint: '/file/save',
        method: 'POST',
        body: { filePath: path, content },
        event: 'saveFile',
      });
      editorUnsaved.set((unsaved) => {
        unsaved[path] = false;
        return unsaved;
      });
      console.log(`✅ Saved: ${path}`);
    } catch (err) {
      console.error(`❌ Failed to save ${path}:`, err);
    }
  };

  // --- Render
  return (
    <div class="flex h-full">
      {/* File Manager Sidebar */}
      <div class="w-60 border-r border-gray-300 flex flex-col">
        <div class="flex justify-between p-2 border-b border-gray-200">
          <span class="font-bold">File Manager</span>
          <div class="flex gap-1">
            <button class="text-sm" onClick={() => setViewMode(viewMode() === 'tree' ? 'list' : 'tree')}>
              {viewMode() === 'tree' ? 'List' : 'Tree'}
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-auto text-sm">
          <Show when={$directoryChildren()?.length} fallback={<p class="p-2 text-gray-500">No files</p>}>
            <For each={$directoryChildren()}>
              {(file) => (
                <div
                  class="flex items-center gap-1 p-1 cursor-pointer "
                  onClick={() => {
                    if (file.isDirectory) {
                      fetchDirectory(file.path);
                    } else {
                      openFile(file.path);
                    }
                  }}
                >
                  <Icon icon={file.isDirectory ? 'mdi:folder' : 'mdi:file'} />
                  <span class="truncate">{file.name}</span>
                </div>
              )}
            </For>
          </Show>
        </div>
      </div>

      {/* Editor + Tabs */}
      <div class="flex-1 flex flex-col">
        {/* Tabs */}
        <div class="flex border-b border-gray-300 bg-gray-50">
          <For each={$openTabs()}>
            {(path) => {
              const fileName = path.split('/').pop() || path;
              const isActive = path === $activeFilePath();
              return (
                <div
                  class={`flex items-center gap-1 px-3 py-1 cursor-pointer ${
                    isActive ? 'bg-white border-t border-l border-r rounded-t-md' : ''
                  }`}
                  onClick={() => switchTab(path)}
                  title={path}
                >
                  <span class="truncate max-w-40">{fileName}</span>
                  <Show when={$unsaved()[path]}>
                    <Icon icon="mdi:circle-small" class="text-red-500" />
                  </Show>
                  <Icon
                    icon="mdi:close"
                    class="text-gray-400 hover:text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(path);
                    }}
                  />
                </div>
              );
            }}
          </For>
        </div>

        {/* Editor */}
        <div class="flex-1 overflow-hidden">
          <Show
            when={$activeFilePath()}
            fallback={<div class="p-4 text-gray-500">No file open. Select a file to begin editing.</div>}
          >
            <Editor />
          </Show>
        </div>

        {/* Footer */}
        <div class="flex justify-end p-2 border-t border-gray-300 bg-gray-100">
          <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={saveCurrentFile}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorWithToolbarAndFileManager;
