import { createEffect, createMemo, onMount, onCleanup, type Component, type JSX, Show } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';
import { theme } from '../../stores/theme';
import { editorContent, editorFilePath, editorUnsaved } from '../../stores/editorContent';
import { detectLanguage } from '../../utils/editorLanguage';
import { getThemeExtension } from '../../utils/editorTheme';
import { undoEdit, redoEdit } from '../../utils/editorUndoRedo';
import MarkdownViewer from '../MarkdownViewer';
type EditorProps = {
  onSave?: () => void;
  onChange?: (content: string) => void;
  content?: () => string;
  filePath?: () => string;
  readOnly?: boolean;
};

const Editor: Component<EditorProps> = (props) => {
  let editorContainer: HTMLDivElement | undefined;

  const $theme = useStore(theme);
  const $content = props.content || useStore(editorContent);
  const $filePath = () => props.filePath?.() ?? useStore(editorFilePath)();

  const isMarkdown = createMemo(() => {
    const filePath = $filePath();
    return filePath ? filePath.endsWith('.md') : false;
  });
  useCodeMirror(() => editorContainer, $content, $filePath, $theme, props.onChange, props.readOnly);

  useEditorKeybindings(props.onSave);

  return (
    <div class="h-full">
      <Show when={isMarkdown()} fallback={<div id="editor" ref={(el) => (editorContainer = el)} class="h-full" />}>
        <MarkdownViewer content={$content()} />
      </Show>
    </div>
  );
};

function editorContainer(props: { ref: (el: HTMLDivElement) => void }): JSX.Element {
  return <div id="editor" ref={props.ref} class="h-full" />;
}

function useCodeMirror(
  getContainer: () => HTMLDivElement | undefined,
  $content: () => string,
  $filePath: () => string,
  $theme: () => string,
  onChange?: (content: string) => void,
  readOnly?: boolean,
) {
  let editorView: EditorView | null = null;
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
        EditorView.editable.of(!readOnly), // 🔑 read-only support
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            const newCode = v.state.doc.toString();
            editorContent.set(newCode);
            onChange?.(newCode);
          }
        }),
      ],
    });

    editorView = new EditorView({
      state,
      parent: getContainer()!,
    });
  };

  createEffect(() => {
    if (getContainer() && !editorView) {
      initEditor($content());
    }
  });

  // Update content when prop changes
  createEffect(() => {
    if (editorView) {
      const current = editorView.state.doc.toString();
      const incoming = $content();
      console.log(incoming, current);
      if (current !== incoming) {
        editorView.dispatch({
          changes: { from: 0, to: current.length, insert: incoming },
        });
      }
    }
  });

  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: [
          langCompartment.reconfigure(detectLanguage($filePath())),
          themeCompartment.reconfigure(getThemeExtension($theme())),
        ],
      });
    }
  });

  onCleanup(() => {
    editorView?.destroy();
    editorView = null;
  });
}

export function useEditorKeybindings(onSave?: () => void) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      onSave?.();
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
    window.removeEventListener('keydown', handleKeyDown);
  });
}

export default Editor;
