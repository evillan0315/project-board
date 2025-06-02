// src/components/Editor.tsx
import { createSignal, onMount, onCleanup, createEffect} from 'solid-js';
import type { JSX } from 'solid-js';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { Icon } from '@iconify-icon/solid';
import Loading from './Loading';
import api from '../services/api';

import { detectLanguage } from '../utils/editorLanguage';
import { getThemeExtension } from '../utils/editorTheme';

import { showToast } from '../stores/toast';

interface CodeEditorWithAPIProps {
  filePath: string;
  theme?: 'light' | 'dark';
  content?: string;
}
const Editor = (props: CodeEditorWithAPIProps): JSX.Element =>  {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const [content, setContent] = createSignal('');
  const [loading, setLoading] = createSignal(true);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');

  const fetchFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('filePath', props.filePath);
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

  const saveFile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('filePath', props.filePath);
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

  // Initial load
  onMount(fetchFile);

  // Re-fetch when filePath changes
  createEffect(() => {
    fetchFile();
  });

  // Cleanup
  onCleanup(() => {
    if (editorView) editorView.destroy();
  });

  return (
    <div class="h-full relative">
      <div class="absolute top-0 right-0 z-10 w-full">
        <div class="flex justify-between align-center">
          <div class="mb-1">
            <button
              title={props.filePath}
              class="flex cursor-alias items-center gap-4 px-4 pb-2 pt-1 mt-1 bg-neutral-900 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 rounded-t-lg border-l border-t  border-neutral-700"
            >
              {() => props.filePath?.split('/').pop()} <Icon icon="mdi:close" width="18" height="18" />
            </button>
          </div>
          <div class="flex align-center">
            <button
              onClick={saveFile}
              disabled={saving()}
              class="flex cursor-alias gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500  "
            >
              <Icon icon="mdi:content-save" width="20" height="20" /> {saving() ? 'Saving...' : 'Save'}
            </button>
            <button class="flex cursor-alias px-2 py-1 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 ">
              <Icon icon="mdi:menu" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>

      {loading() && <Loading />}
      {error() && <p class="text-red-600 p-4">{error()}</p>}

      <div ref={editorContainer} class="h-full w-full pt-10" />
    </div>
  );
};

export default Editor;
