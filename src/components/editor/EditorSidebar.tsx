import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useStore } from '@nanostores/solid';
import { Icon } from '@iconify-icon/solid';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { fileService } from '../../services/fileService';
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
import { currentDirectory } from '../../stores/fileStore';

import CollapsiblePanel from '../layouts/panels/CollapsiblePanel';
import EditorFileManager, { EditorFileManagerHeader } from './EditorFileManager';
import TextToSpeech from '../apps/TextToSpeech';
import MediaDownloader from '../apps/MediaDownloader';
import MarkdownViewer from '../MarkdownViewer';
import ChatFrontend from '../ChatFrontend';

import { type FileItem } from '../../types/types';

interface EditorPanelHeaderProps {
  title: string;
  icon?: string;
}

export function EditorPanelHeader(props: EditorPanelHeaderProps) {
  return (
    <div class="flex items-center gap-4">
      {props.icon && <Icon icon={props.icon} width="1.8em" height="1.8em" />}
      <h2>{props.title}</h2>
    </div>
  );
}

export function EditorLeftSidebar() {
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const $currentDirectory = useStore(currentDirectory);

  const fetchDirectory = async (directory = './') => {
    try {
      const res = await api.get(`/file/list?directory=${encodeURIComponent(directory)}&recursive=false`);
      setFiles(res.data);
      currentDirectory.set(directory);
    } catch (err: any) {
      console.error('Failed to fetch directory:', err);
      alert(`Failed to fetch directory: ${err.message}`);
    }
  };

  const loadFile = async (path: string, isDirectory?: boolean) => {
    if (!path) return;
    try {
      if (isDirectory) {
        await fetchDirectory(path);
      } else {
        const file = await fileService.emitDynamicFileEvent({
          endpoint: '/file/read',
          method: 'POST',
          body: { filePath: path },
          event: 'readFile',
        });

        editorFilePath.set(path);
        editorContent.set(file.content);
        editorActiveContent.set(file.content);
        editorActiveFilePath.set(path);
        editorLanguage.set(file.language);
        editorOriginalContent.set(file.content);
        editorUnsaved.set({ ...editorUnsaved.get(), [path]: false });
        editorUnsavedContent.set({ ...editorUnsavedContent.get(), [path]: file.content });

        const prevTabs = editorOpenTabs.get() ?? [];
        if (!prevTabs.includes(path)) {
          editorOpenTabs.set([...prevTabs, path]);
        }
      }
    } catch (err) {
      console.error('Failed to load file:', err);
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
    <div class="flex-1 overflow-hidden">
      <CollapsiblePanel header={<EditorFileManagerHeader fetchDirectory={fetchDirectory} />} defaultOpen={true}>
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
  const $editorLanguage = useStore(editorLanguage);
  const $editorContent = useStore(editorContent);

  return (
    <div class="flex flex-col">
      <Show when={$editorLanguage() === 'markdown'}>
        <CollapsiblePanel header={<EditorPanelHeader icon="mdi:markdown" title="Markdown Preview" />}>
          <MarkdownViewer content={$editorContent()} />
        </CollapsiblePanel>
      </Show>
      <CollapsiblePanel header={<EditorPanelHeader icon="mdi:chat" title="Chat" />} defaultOpen={true}>
        <ChatFrontend />
      </CollapsiblePanel>
      <CollapsiblePanel header={<EditorPanelHeader icon="mdi:tts" title="Text To Speech" />} defaultOpen={false}>
        <TextToSpeech />
      </CollapsiblePanel>
      <CollapsiblePanel
        header={<EditorPanelHeader icon="mdi-light:music" title="Media Downloader" />}
        defaultOpen={false}
      >
        <MediaDownloader />
      </CollapsiblePanel>
    </div>
  );
}
