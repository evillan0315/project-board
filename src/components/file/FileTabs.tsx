import { For } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { editorOpenTabs, editorActiveFilePath } from '../../stores/editorContent';
import FileTabItem from './FileTabItem';

export default function EditorFileTabs() {
  const $openTabs = useStore(editorOpenTabs);
  const $activePath = useStore(editorActiveFilePath);

  const handleTabClick = (path: string) => {
    editorActiveFilePath.set(path);
    // Optionally load file content via fileService
  };

  const handleTabClose = (path: string) => {
    editorOpenTabs.set($openTabs().filter((p) => p !== path));
    if ($activePath() === path && $openTabs().length > 1) {
      const nextPath = $openTabs().find((p) => p !== path);
      editorActiveFilePath.set(nextPath || '');
    }
  };

  return (
    <div class="flex gap-1 overflow-x-auto hide-scrollbar">
      <For each={$openTabs()}>{(path) => <FileTabItem path={path} active={$activePath() === path} />}</For>
    </div>
  );
}
