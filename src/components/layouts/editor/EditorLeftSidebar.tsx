import { createSignal, onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../../contexts/AuthContext';
import { fileService } from '../../../services/fileService';
import { editorOriginalContent, editorFilePath, editorContent, editorUnsaved } from '../../../stores/editorContent';
import { currentDirectory, selectedFile } from '../../../stores/fileStore';
import FileManagerHeader from '../../../components/file/FileManagerHeader';
import CollapsiblePanel from '../panels/CollapsiblePanel';
import FileManagerSocket from '../../../components/file/FileManagerSocket';
import { useStore } from '@nanostores/solid';

export default function EditorLeftSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const $currentDirectory = useStore(currentDirectory);

  const loadFile = async (path: string) => {
    if (!path) return;
    try {
      editorFilePath.set(path);
      const file = await fileService.emitDynamicFileEvent({
        endpoint: '/file/read',
        method: 'POST',
        body: { filePath: path },
        event: 'readFile',
      });
      selectedFile.set(file);
      editorContent.set(file.content);
      editorOriginalContent.set(file.content);
      editorUnsaved.set({
        ...editorUnsaved.get(),
        [path]: false,
      });
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const fetchDirectory = async (directory?: string) => {
    try {
      const dir = directory || $currentDirectory();
      const files = await fileService.emitDynamicFileEvent({
        endpoint: `/file/list?directory=${encodeURIComponent(dir)}&recursive=false`,
        method: 'GET',
        event: 'listFiles',
      });
      currentDirectory.set(dir);
      selectedFile.set(null);
    } catch (error) {
      console.error('Failed to fetch directory:', error);
    }
  };

  const createFile = async (directory: string, name: string) => {
    await fileService.emitDynamicFileEvent({
      endpoint: '/file/create',
      method: 'POST',
      body: { directory, name },
      event: 'createFile',
    });
    await fetchDirectory(directory);
  };

  const createFolder = async (directory: string, name: string) => {
    await fileService.emitDynamicFileEvent({
      endpoint: '/file/create-folder',
      method: 'POST',
      body: { directory, name },
      event: 'createFolder',
    });
    await fetchDirectory(directory);
  };

  const handleFileAction = async (action: 'open' | 'delete', filePath: string, isDirectory: boolean) => {
    if (action === 'open') {
      if (isDirectory) {
        await fetchDirectory(filePath);
      } else {
        await loadFile(filePath);
      }
    } else if (action === 'delete') {
      await fileService.emitDynamicFileEvent({
        endpoint: '/file/delete',
        method: 'POST',
        body: { filePath },
        event: 'deleteFile',
      });
      await fetchDirectory($currentDirectory());
    }
  };

  const handleEditorLoadFile = (e: Event) => {
    const path = (e as CustomEvent).detail.path;
    loadFile(path);
  };

  onMount(() => {
    document.addEventListener('editor-load-file', handleEditorLoadFile);

    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (editorFilePath.get()) {
      loadFile(editorFilePath.get());
    }
  });

  onCleanup(() => {
    document.removeEventListener('editor-load-file', handleEditorLoadFile);
  });

  return (
    <div class="h-full flex flex-col">
      <CollapsiblePanel
        header={
          <FileManagerHeader
            currentDirectory={$currentDirectory}
            fetchDirectory={fetchDirectory}
            handleFileAction={handleFileAction}
            createFolder={createFolder}
            createFile={createFile}
          />
        }
      >
        <FileManagerSocket onFileSelect={loadFile} />
      </CollapsiblePanel>
    </div>
  );
}
