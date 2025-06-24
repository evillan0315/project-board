// src/hooks/useCodeMirror.ts
import { createEffect, onCleanup } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';
import { detectLanguage } from '../utils/editorLanguage';
import { getThemeExtension } from '../utils/editorTheme';
export function useCodeMirror(
  getContainer: () => HTMLDivElement | undefined,
  $content: () => string,
  $filePath: () => string,
  $theme: () => string,
  onChange?: (content: string) => void,
  onSave?: () => void,
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
