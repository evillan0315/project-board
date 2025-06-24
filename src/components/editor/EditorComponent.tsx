import { createEffect, onMount, onCleanup, type JSX, Show, createMemo } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';

import { theme } from '../../stores/theme';
import { detectLanguage } from '../../utils/editorLanguage';
import { getThemeExtension } from '../../utils/editorTheme';
import { undoEdit, redoEdit } from '../../utils/editorUndoRedo';
import { editorContent, editorFilePath } from '../../stores/editorContent';
import MarkdownViewer from '../MarkdownViewer';
type EditorComponentProps = {
  onSave?: () => void;
  onChange?: (content: string) => void;
};

const EditorComponent = (props: EditorComponentProps): JSX.Element => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const $theme = useStore(theme);
  const $content = useStore(editorContent);
  const $filePath = useStore(editorFilePath);

  const themeCompartment = new Compartment();
  const langCompartment = new Compartment();

  const initEditor = (code: string) => {
    if (editorView) editorView.destroy();

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        langCompartment.of(detectLanguage($filePath())),
        themeCompartment.of(getThemeExtension($theme())),
        EditorView.lineWrapping,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            const newCode = v.state.doc.toString();
            editorContent.set(newCode);
            props.onChange?.(newCode);
          }
        }),
      ],
    });

    editorView = new EditorView({
      state,
      parent: editorContainer!,
    });
  };

  createEffect(() => {
    if (editorContainer && !editorView) {
      initEditor($content());
    }
  });

  createEffect(() => {
    if (editorView) {
      const current = editorView.state.doc.toString();
      //console.log(current, 'current content editorComponent')
      if (current !== $content()) {
        //console.log($content(), 'if current content is not equal to stored editor content')
        editorView.dispatch({
          changes: { from: 0, to: current.length, insert: $content() },
        });
      }
    }
  });

  createEffect(() => {
    if (editorView && !$filePath()) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: '' },
      });
    }
  });

  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: langCompartment.reconfigure(detectLanguage($filePath())),
      });
    }
  });

  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension($theme())),
      });
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      props.onSave?.();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoEdit();
    } else if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
    ) {
      e.preventDefault();
      redoEdit();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    editorView?.destroy();
    editorView = null;
    window.removeEventListener('keydown', handleKeyDown);
  });
  const isMarkdown = createMemo(() => {
    const filePath = $filePath();
    return filePath ? filePath.endsWith('.md') : false;
  });

  return <div id="editor" ref={(el) => (editorContainer = el)} class={`h-full`} />;
};

export default EditorComponent;
