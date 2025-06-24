import { createSignal, onMount, Show, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { useAuth } from '../contexts/AuthContext';
import AudioPlayerToggle from '../components/media/AudioPlayerToggle';
import EditorLayout from '../components/editor/EditorLayout';
import {
  editorOriginalContent,
  editorFilePath,
  editorOpenTabs,
  editorContent,
  editorUnsaved,
} from '../stores/editorContent';
import { showToast } from '../stores/toast';

import { useEditorFile } from '../hooks/useEditorFile';
import EditorContainer from '../components/editor/EditorContainer';

export default function Editor() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <EditorLayout leftSidebar={true} rightSidebar={false} content={<EditorContainer />} />

      <AudioPlayerToggle />
    </>
  );
}
