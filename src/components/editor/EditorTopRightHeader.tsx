import { createSignal, onMount, type Accessor } from 'solid-js'; // Import Accessor
import { useStore } from '@nanostores/solid';
import { editorFilePath } from '../../stores/editorContent';
import EditorActionButtons from './EditorActionButtons';
import EditorRightDrawers from './EditorRightDrawers';

interface EditorTopRightHeaderProps {
  // Update the signature of toggleTerminal to match what EditorContainer passes
  toggleTerminal: (mode: 'none' | 'ai' | 'local') => void;
  // Add activeTerminal to the props, so it can be passed down to EditorActionButtons
  activeTerminal: Accessor<'none' | 'ai' | 'local'>;
  viewMarkdown?: (content: string) => void;
}

export const EditorTopRightHeader = (props: EditorTopRightHeaderProps) => {
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [chatDrawerOpen, setChatDrawerOpen] = createSignal(false);
  const [docDrawerOpen, setDocDrawerOpen] = createSignal(false);
  // terminalOpen state is now managed in EditorContainer via activeTerminal
  // You might not need this signal here anymore if EditorTopRightHeader just passes the toggle function
  // const [terminalOpen, setTerminalState] = createSignal(false);
  const [docFileExists, setDocFileExists] = createSignal(false);

  const [markdownDrawerOpen, setMarkdownDrawerOpen] = createSignal(false);
  const $filePath = useStore(editorFilePath);

  onMount(async () => {
    if ($filePath()) {
      const newDocPath = $filePath().replace(/\.[^/.]+$/, '.md');
      try {
        await (await import('../../services/api')).default.post('/file/exists', { filePath: newDocPath });
        setDocFileExists(true);
      } catch {
        setDocFileExists(false);
      }
    }
  });

  return (
    <>
      <EditorActionButtons
        toggleTerminal={props.toggleTerminal} // Pass the updated toggleTerminal
        activeTerminal={props.activeTerminal} // Pass activeTerminal
        setDrawerOpen={setDrawerOpen}
        setChatDrawerOpen={setChatDrawerOpen}
        setDocDrawerOpen={setDocDrawerOpen}
        setMarkdownDrawerOpen={setMarkdownDrawerOpen}
      />
      <EditorRightDrawers
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        chatDrawerOpen={chatDrawerOpen}
        setChatDrawerOpen={setChatDrawerOpen}
        markdownDrawerOpen={markdownDrawerOpen}
        setMarkdownDrawerOpen={setMarkdownDrawerOpen}
        docDrawerOpen={docDrawerOpen}
        setDocDrawerOpen={setDocDrawerOpen}
      />
    </>
  );
};
