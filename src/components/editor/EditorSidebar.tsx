import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useStore } from '@nanostores/solid';
import { Icon } from '@iconify-icon/solid';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { fileService } from '../../services/fileService';
import { useEditorFile } from '../../hooks/useEditorFile';

import {
  editorOriginalContent,
  editorFilePath,
  editorContent,
  editorUnsaved,
  editorLanguage,
  editorOpenTabs,
  editorUnsavedContent,
  editorActiveContent,
  editorActiveFilePath,
} from '../../stores/editorContent';

import { currentDirectory, selectedFile, directoryChildren, filesDirectories } from '../../stores/fileStore';

import CollapsiblePanel from '../layouts/panels/CollapsiblePanel';

import EditorFileManager, { EditorFileManagerHeader } from './EditorFileManager';

import TextToSpeech from '../apps/TextToSpeech';
import MediaDownloader from '../apps/MediaDownloader';
import MarkdownViewer from '../MarkdownViewer';

import { type FileItem } from '../../types/types';

interface EditorPanelHeaderProps {
  title: string;
  icon?: string;
}

export function EditorPanelHeader(props: EditorPanelHeaderProps) {
  return (
    <div class="flex items-center justify-start gap-4">
      {props.icon && <Icon icon={props.icon} width="1.8em" height="1.8em" />}
      <h2>{props.title}</h2>
    </div>
  );
}

export function EditorLeftSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const $currentDirectory = useStore(currentDirectory);
  const [contextMenu, setContextMenu] = createSignal({
    x: 0,
    y: 0,
    file: null as FileItem | null,
    visible: false,
  });
  const fetchDirectory = async (directory = './') => {
    try {
      /*const files = await fileService.emitDynamicFileEvent({
        endpoint: `/file/list?directory=${encodeURIComponent(directory)}&recursive=false`, // assuming API supports recursive
        method: 'GET',
        event: 'listFiles',
        updateStore: false,
      });*/
      const res = await api.get(`/file/list?directory=${encodeURIComponent(directory)}&recursive=false`);
      const files = res.data;
      setFiles(files);
      //directoryChildren.set(files); // immediate children (optional if filesDirectories is the main source)
      //filesDirectories.set(files); // full structure from API
      currentDirectory.set(directory);
    } catch (err) {
      console.error('Failed to fetch directory:', err);
      alert(`Failed to fetch directory: ${err.message}`);
    }
  };
  const loadFile = async (path: string, isDirectory?: boolean) => {
    if (!path) return;

    try {
      if (isDirectory) {
        fetchDirectory(path);
      } else {
        editorFilePath.set(path);
        const file = await fileService.emitDynamicFileEvent({
          endpoint: '/file/read',
          method: 'POST',
          body: { filePath: path },
          event: 'readFile',
        });
        //selectedFile.set(file);
        editorContent.set(file.content);
        editorActiveContent.set(file.content);
        editorActiveFilePath.set(path);
        editorFilePath.set(path);
        editorLanguage.set(file.language);
        editorOriginalContent.set(file.content);
        editorUnsaved.set({
          ...editorUnsaved.get(),
          [path]: false,
        });
        editorUnsavedContent.set({
          ...editorUnsavedContent.get(),
          [path]: file.content,
        });
        const prevTabs = editorOpenTabs.get() ?? [];
        if (!prevTabs.includes(path)) {
          editorOpenTabs.set([...prevTabs, path]);
        }
      }
    } catch (error) {
      console.error('Failed to load file:', error);
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
  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file, visible: true });
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
      <CollapsiblePanel header={<EditorFileManagerHeader fetchDirectory={fetchDirectory} />}>
        <EditorFileManager
          files={files()}
          fetchDirectory={fetchDirectory}
          onFileSelect={loadFile}
          refreshList={fetchDirectory}
        />
      </CollapsiblePanel>
    </div>
  );
}

export function EditorRightSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const $editorLanguage = useStore(editorLanguage);
  const $editorContent = useStore(editorContent);

  return (
    <div class="flex flex-col">
      <Show when={$editorLanguage() === 'markdown'}>
        <CollapsiblePanel header={<EditorPanelHeader icon="mdi:markdown" title={`Markdown Preview`} />}>
          <MarkdownViewer content={$editorContent()} />
        </CollapsiblePanel>
      </Show>
      <CollapsiblePanel header={<EditorPanelHeader icon="mdi:tts" title={`Text To Speech`} />}>
        <TextToSpeech />
      </CollapsiblePanel>
      <CollapsiblePanel header={<EditorPanelHeader icon="mdi-light:music" title={`Media Downloader`} />}>
        <MediaDownloader />
      </CollapsiblePanel>
    </div>
  );
}
