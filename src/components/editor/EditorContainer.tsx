import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import CodeMirrorEditor from './CodeMirrorEditor';
import { EditorTopRightHeader } from './EditorTopRightHeader';
import { useGeminiTerminal } from '../../hooks/useGeminiTerminal';
import { useTerminal } from '../../hooks/useTerminal';
import EditorFileTabs from './EditorFileTabs';
import TerminalShellAi from '../TerminalShellAi';
import TerminalShell from '../TerminalShell';
import DeveloperConsole from '../DeveloperConsole';
import { useEditorFile } from '../../hooks/useEditorFile';
import {
  editorUnsaved,
  editorFilePath,
  editorContent,
  editorActiveFilePath,
  editorActiveContent,
} from '../../stores/editorContent';
import { Button } from '../ui/Button';
import EditorInitialView from '../ui/EditorInitialView';
type TerminalMode = 'none' | 'ai' | 'local';

import { showLeftSidebar, showRightSidebar, activeTerminal } from '../../stores/editorLayoutStore';
interface EditorContainerProps {
  show?: boolean;
}

export default function EditorContainer({ show = true }: EditorContainerProps) {
  const $filePath = useStore(editorFilePath);
  const $unsaved = useStore(editorUnsaved);
  const $activeTerminal = useStore(activeTerminal);
  const $showLeftSidebar = useStore(showLeftSidebar);
  const $showRightSidebar = useStore(showRightSidebar);
  const $editorActiveFilePath = useStore(editorActiveFilePath);
  const $editorActiveContent = useStore(editorActiveContent);
  const {} = useGeminiTerminal({ prompt: '🤖 AI > ' });
  const {} = useTerminal({ prompt: '$ ' });
  const { saveFile } = useEditorFile();

  const handleSave = async () => {
    await saveFile();
    await fileService.emitDynamicFileEvent({
      endpoint: '/file/create',
      method: 'POST',
      body: { filePath: `${$currentDirectory()}/${name}`, type },
      event: 'updateFile',
    });
  };

  const toggleTerminal = (mode: TerminalMode) => {
    if ($activeTerminal() === mode) {
      activeTerminal.set('none');
    } else {
      activeTerminal.set(mode);
    }
  };

  const handleCloseTerminal = () => {
    activeTerminal.set('none');
  };

  return (
    <>
      <div class="editor-top-header flex items-center justify-between gap-1 h-10 px-0 py-0">
        <div class="flex items-center flex-grow min-w-0">
          <Button
            icon="gala:menu-left"
            title="Toggle Left Panel"
            variant="secondary"
            onClick={() => showLeftSidebar.set(!$showLeftSidebar())}
            class="flex-shrink-0 mr-2"
          />
          <EditorFileTabs />
        </div>

        <div class="top-right-editor-buttons flex items-center gap-2 flex-shrink-0 ml-auto py-1">
          <EditorTopRightHeader
            unsaved={$unsaved}
            toggleTerminal={toggleTerminal}
            onSave={handleSave}
            activeTerminal={$activeTerminal}
          />
          <Button
            icon="gala:menu-right"
            title="Toggle Right Panel"
            variant="secondary"
            onClick={() => showRightSidebar.set(!$showRightSidebar())}
            class="flex-shrink-0"
          />
        </div>
      </div>
      <Show when={$editorActiveContent()} fallback={<EditorInitialView />}>
        <CodeMirrorEditor onSave={handleSave} />
      </Show>
      <Show when={$activeTerminal() === 'ai'}>
        <TerminalShellAi onClose={handleCloseTerminal} />
      </Show>
      <Show when={$activeTerminal() === 'local'}>
        <DeveloperConsole onClose={handleCloseTerminal} />
      </Show>
    </>
  );
}
