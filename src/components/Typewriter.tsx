import { createSignal, onMount, createEffect, type JSX } from 'solid-js';
import { EditorView, keymap, highlightActiveLine, drawSelection } from '@codemirror/view';
import { useStore } from '@nanostores/solid';

import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { theme } from '../stores/theme';
import { getThemeExtension } from '../utils/editorTheme';
import { history } from '@codemirror/commands';

interface TypewriterProps {
  text: string;
  typingSpeed?: number;
  deleteSpeed?: number;
  loop?: boolean;
  delayBeforeTyping?: number;
  delayBeforeDeleting?: number;
  themeExtension: any;
}

function Typewriter(props: TypewriterProps): JSX.Element {
  const {
    text,
    typingSpeed = 500,
    deleteSpeed = 30,
    loop = false,
    delayBeforeTyping = 300,
    delayBeforeDeleting = 500,
    themeExtension,
  } = props;

  const [currentText, setCurrentText] = createSignal('');
  const [editorView, setEditorView] = createSignal<EditorView | null>(null);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [charIndex, setCharIndex] = createSignal(0);
  const $theme = useStore(theme);
  const themeCompartment = new Compartment();

  const type = () => {
    if (!editorView()) return;
    const currentDeleting = isDeleting();
    setTimeout(
      () => {
        const currentIdx = charIndex();

        if (!currentDeleting) {
          if (currentIdx < text.length) {
            setCurrentText(text.substring(0, currentIdx + 1));
            setCharIndex(currentIdx + 1);
            type();
          } else {
            setTimeout(() => {
              setIsDeleting(true);
              type();
            }, delayBeforeDeleting);
          }
        } else {
          if (currentIdx > 0) {
            setCurrentText(text.substring(0, currentIdx - 1));
            setCharIndex(currentIdx - 1);
            setTimeout(() => {
              type();
            }, deleteSpeed);
          } else {
            setIsDeleting(false);
            if (loop) {
              setTimeout(() => {
                setCharIndex(0);
                setCurrentText('');
                type();
              }, delayBeforeTyping);
            }
          }
        }
      },
      currentDeleting ? deleteSpeed : typingSpeed,
    );
  };

  onMount(() => {
    const startState = EditorState.create({
      doc: '',
      extensions: [
        // Manually define desired extensions
        javascript(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([]), // disable keyboard input
        EditorView.editable.of(false),
        EditorView.lineWrapping,
        themeCompartment.of(getThemeExtension($theme())),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            if (editorView() && editorView()?.state.doc.toString() !== currentText()) {
              const transaction = editorView()!.state.update({
                changes: { from: 0, to: editorView()!.state.doc.length, insert: currentText() },
              });
              editorView()!.dispatch(transaction);
            }
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: document.getElementById('codemirror-container')!,
    });

    setEditorView(view);

    setTimeout(() => {
      type();
    }, delayBeforeTyping);
  });

  createEffect(() => {
    if (editorView()) {
      const wrapper = document.getElementById('codemirror-wrapper');
      if (wrapper) {
        wrapper.classList.add('fade-in');
        setTimeout(() => {
          wrapper.classList.remove('fade-in');
        }, 300); // duration of fade animation
      }

      const transaction = editorView()!.state.update({
        changes: { from: 0, to: editorView()!.state.doc.length, insert: currentText() },
        //selection: { anchor: currentText().length },
        //scrollIntoView: true,
      });
      editorView()!.dispatch(transaction);
    }
  });

  return <div id="codemirror-container" style={{ height: '100%', width: '100%' }} />;
}

export default Typewriter;
