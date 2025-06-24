import { createSignal, onMount, Show, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { useAuth } from '../contexts/AuthContext';

import EditorLayout from '../components/layouts/editor/EditorLayout';
import {
  editorOriginalContent,
  editorFilePath,
  editorOpenTabs,
  editorContent,
  editorUnsaved,
} from '../stores/editorContent';
import { showToast } from '../stores/toast';

import { useEditorFile } from '../hooks/useEditorFile';
import LogStream from '../components/logs/LogStream';

export default function Logger() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <LogStream />
    </>
  );
}
