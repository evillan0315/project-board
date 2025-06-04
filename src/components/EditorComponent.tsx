// src/components/EditorComponent.tsx
import { createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { detectLanguage } from '../utils/editorLanguage';
import { getThemeExtension } from '../utils/editorTheme';

import Loading from './Loading';
import api from '../services/api';

import { showToast } from '../stores/toast';

type EditorComponentProps = {
  param?: 'url' | 'filePath';
  filePath: string;
  theme?: 'light' | 'dark';
  content?: string;
};
const EditorComponent = (props: EditorComponentProps) => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const [contextMenuPos, setContextMenuPos] = createSignal<{ x: number; y: number } | null>(null);
  const [content, setContent] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');

  const initEditor = (code: string) => {
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }

    const theme = props.theme === 'light' ? 'light' : 'dark'; // default to dark

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        detectLanguage(props.filePath),
        ...getThemeExtension(theme),
        EditorView.lineWrapping,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            setContent(v.state.doc.toString());
          }
        }),
      ],
    });

    editorView = new EditorView({
      state,
      parent: editorContainer!,
    });
  };
  const fetchFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(props.param ? props.param : 'filePath', props.filePath);
      const response = await api.post('/file/read', formData);
      if (!response.data?.data) throw new Error('Failed to load file');

      const code = response.data.data;
      setContent(code);
      initEditor(code);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const saveFile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      props.param = props.param ? props.param : 'filePath';
      formData.append(props.param ? props.param : 'filePath', props.filePath);
      if (props.param !== 'filePath') throw new Error('Only internal file from the server can be save');
      formData.append('content', content());

      const response = await api.post('/file/write', formData);
      if (!response.data.success) throw new Error('Failed to save file');

      showToast('File saved successfully.', 'success');
    } catch (err) {
      showToast('Error saving file: ' + (err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };
  /** Global context menu handler */
  const handleContextMenu = (e: MouseEvent) => {
    if (!editorContainer?.contains(e.target as Node)) return;
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };
  /** Reset context menu on global click */
  const handleGlobalClick = () => setContextMenuPos(null);

  /** Ctrl+S / Cmd+S shortcut */
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveFile();
    }
  };
  onMount(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
  });
  // Initial load
  onMount(fetchFile);

  // Re-fetch when filePath changes
  createEffect(() => {
    fetchFile();
  });

  onCleanup(() => {
    editorView?.destroy();
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('click', handleGlobalClick);
    window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div class="bg-gray-950 h-screen flex flex-col overflow-auto relative">
      {loading() && <Loading />}
      {error() && <p class="text-red-600 p-4">{error()}</p>}

      <div ref={editorContainer} class="h-full w-full" />
    </div>
  );
};

export default EditorComponent;
