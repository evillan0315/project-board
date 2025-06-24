// src/components/layouts/panels/EditorRightSidebar.tsx
import { Show, onMount, createSignal, onCleanup } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import { useAuth } from '../../../contexts/AuthContext';
import MarkdownViewer from '../../MarkdownViewer';
import CollapsiblePanel from '../panels/CollapsiblePanel';
import TextToSpeech from '../../apps/TextToSpeech';
import MediaDownloader from '../../apps/MediaDownloader';

import { useEditorFile } from '../../../hooks/useEditorFile';
import {
  editorOriginalContent,
  editorFilePath,
  editorContent,
  editorUnsaved,
  editorLanguage,
} from '../../../stores/editorContent';
interface PanelHeaderProps {
  title: string;
  icon?: string;
}
const PanelHeader = (props: PanelHeaderProps) => {
  return (
    <div class="flex items-center justify-start gap-4">
      {props.icon && <Icon icon={props.icon} width="1.8em" height="1.8em" />}
      <h2>{props.title}</h2>
    </div>
  );
};
export default function EditorRightSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const $editorLanguage = useStore(editorLanguage);
  const $editorContent = useStore(editorContent);

  return (
    <div class="flex flex-col">
      <Show when={$editorLanguage() === 'markdown'}>
        <CollapsiblePanel header={<PanelHeader icon="mdi:markdown" title={`Markdown Preview`} />}>
          <MarkdownViewer content={$editorContent()} />
        </CollapsiblePanel>
      </Show>
      <CollapsiblePanel icon="mdi:tts" header="Text To Speech">
        <TextToSpeech />
      </CollapsiblePanel>
      <CollapsiblePanel icon="mdi-light:music" header="Media Downloader">
        <MediaDownloader />
      </CollapsiblePanel>
    </div>
  );
}
