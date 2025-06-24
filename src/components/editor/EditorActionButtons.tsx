import { Show } from 'solid-js';
import { Button } from '../ui/Button';
import { useStore } from '@nanostores/solid';
import DropdownMenu from '../ui/DropdownMenu';
import { editorLanguage, editorUnsaved, editorFilePath } from '../../stores/editorContent';
import {
  formatCode,
  optimize,
  analyze,
  repair,
  handleRemoveComments,
  handleGenerateDocumentation,
  handleGenerateCode,
  handleDrawer,
  saveFile,
} from './editorActions';

interface Props {
  toggleTerminal: () => void;
  setDrawerOpen: (open: boolean) => void;
  setChatDrawerOpen: (open: boolean) => void;
  setDocDrawerOpen: (open: boolean) => void;
  setMarkdownDrawerOpen: () => void;
  toggleTerminal: (mode: 'none' | 'ai' | 'local') => void;
  activeTerminal: Accessor<'none' | 'ai' | 'local'>;
}
export default function EditorActionButtons(props: Props) {
  const $filePath = useStore(editorFilePath);
  const $unsaved = useStore(editorUnsaved);
  return (
    <div class="top-right-editor-buttons flex items-center justify-center gap-2">
      <Show when={$unsaved()[$filePath()]}>
        <Button
          icon="mdi-light:content-save"
          class="text-lg"
          title="Save File"
          variant="secondary"
          onClick={saveFile}
        />
      </Show>
      <Button
        icon="mdi-light:console"
        class="text-lg"
        title="Terminal"
        variant="secondary"
        onClick={() => props.toggleTerminal('local')}
      />
      {/*editorLanguage.get() === 'markdown' && (
      <Button icon="mdi:markdown" variant="secondary" onClick={props.setMarkdownDrawerOpen} />
      )*/}
      <DropdownMenu
        variant="secondary"
        icon="circum:menu-fries"
        label="Tools"
        rounded
        items={[
          { type: 'divider' },
          { label: 'Code Tools', type: 'header', icon: 'mdi:file-code-outline' },
          { type: 'divider' },
          { label: 'Remove Comments', icon: 'mdi:comment-remove', onClick: handleRemoveComments },
          { label: 'Format Code', icon: 'mdi:format-align-right', onClick: formatCode },
          { label: 'Optimize Code', icon: 'mdi:code-block-braces', onClick: optimize },
          { label: 'Analyze Code', icon: 'mdi:code-block-parentheses', onClick: analyze },
          { label: 'Repair Code', icon: 'mdi:code-tags-check', onClick: repair },
          { type: 'divider' },
          { label: 'Generate Docs', type: 'header', icon: 'mdi:book-open' },
          { type: 'divider' },

          { label: 'Inline Documentation', icon: 'mdi:book-open-page-variant', onClick: handleGenerateDocumentation },
          {
            label: 'Generate Documentation',
            icon: 'mdi:book-open-variant',
            onClick: () => props.setDocDrawerOpen(true),
          },
        ]}
      />
    </div>
  );
}
