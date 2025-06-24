import { createEffect, onCleanup } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';
import { detectLanguage } from '../../utils/editorLanguage';
import { getThemeExtension } from '../../utils/editorTheme';
import {
  editorContent,
  editorFilePath,
  editorUnsaved,
  editorOriginalContent,
  editorHistory,
  editorFuture,
  editorUnsavedContent,
  editorActiveContent,
  editorActiveFilePath,
  editorLanguage,
} from '../../stores/editorContent';
import { theme } from '../../stores/theme';
import { showToast } from '../../stores/toast';
import { fileService } from '../../services/fileService';
import { useEditorKeybindings } from '../../hooks/useEditorKeybindings';
interface CodeMirrorEditorProps {
  onChange?: (content: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  let container: HTMLDivElement | undefined;
  let view: EditorView | null = null;

  const $theme = useStore(theme);
  const $content = useStore(editorContent);
  const $filePath = useStore(editorFilePath);
  const $editorActiveContent = useStore(editorActiveContent);
  const $editorActiveFilePath = useStore(editorActiveFilePath);
  const $editorLanguage = useStore(editorLanguage);
  const themeCompartment = new Compartment();
  const langCompartment = new Compartment();

  const handleSave = async () => {
    const fileCon = await fileService.emitDynamicFileEvent({
      endpoint: '/file/write',
      method: 'POST',
      body: { filePath: $filePath(), content: $content() },
      event: 'writeFileContent',
      updateStore: true,
    });
    console.log(fileCon, 'fileCon');
    editorOriginalContent.set($content());
    showToast('File saved successfully.', 'success');

    editorUnsaved.set({
      ...editorUnsaved.get(),
      [editorFilePath.get()]: false,
    });

    //onSave?.();
  };
  useEditorKeybindings(handleSave);
  const initialize = (code: string) => {
    if (view) view.destroy();

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        langCompartment.of(detectLanguage($editorActiveFilePath())),
        themeCompartment.of(getThemeExtension($theme())),
        EditorView.lineWrapping,
        EditorView.editable.of(!props.readOnly),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            const newCode = v.state.doc.toString();
            editorContent.set(newCode);
            props.onChange?.(newCode);
            if (newCode !== editorOriginalContent.get()) {
              editorUnsavedContent.set({
                ...editorUnsaved.get(),
                [$editorActiveFilePath()]: newCode,
              });
            }

            editorUnsaved.set({
              ...editorUnsaved.get(),
              [$editorActiveFilePath()]: newCode !== editorOriginalContent.get(),
            });
            // Track unsaved status

            // Update history (append new state)
            const history = editorHistory.get();
            editorHistory.set([...history, newCode]);
            editorFuture.set([]); // Clear future on new edit
          }
        }),
      ],
    });

    view = new EditorView({
      state,
      parent: container!,
    });
  };

  createEffect(() => {
    if (container && !view) {
      initialize($editorActiveContent());
    }
  });

  createEffect(() => {
    if (view) {
      const current = view.state.doc.toString();
      const incoming = $editorActiveContent();
      if (current !== incoming) {
        view.dispatch({
          changes: { from: 0, to: current.length, insert: incoming },
        });
      }
    }
  });

  createEffect(() => {
    if (view) {
      view.dispatch({
        effects: [
          langCompartment.reconfigure(detectLanguage($editorActiveFilePath())),
          themeCompartment.reconfigure(getThemeExtension($theme())),
        ],
      });
    }
  });

  onCleanup(() => {
    view?.destroy();
    view = null;
  });

  return (
    <div id="editorContainer" class="flex-1 overflow-auto">
      <div id="editor" ref={container} class="h-full" />
    </div>
  );
}
