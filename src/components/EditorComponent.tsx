// src/components/EditorComponent.tsx
import { createSignal, onMount, onCleanup, createEffect} from 'solid-js';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { detectLanguage } from '../utils/editorLanguage';
import { getThemeExtension } from '../utils/editorTheme';

import Loading from './Loading';
import api from '../services/api';

import { showToast } from '../stores/toast';

type EditorComponentProps = {
  param: 'url' | 'filePath';
  filePath: string;
  theme?: 'light' | 'dark';
  content?: string;
};
const EditorComponent = (props: EditorComponentProps) => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;
  
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
      formData.append(props.param, props.filePath);
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
      if(props.param !== 'filePath') throw new Error('Only internal file from the server can be save');
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
    
    <div class="bg-gray-950">
      {error() && <p class="text-red-600 p-4">{error()}</p>}

      <div ref={editorContainer} class="h-full w-full" />
    </div>
    
  );
};

export default EditorComponent;

