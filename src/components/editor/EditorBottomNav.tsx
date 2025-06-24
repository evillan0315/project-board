import { type JSX, createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import DropdownMenu from '../ui/DropdownMenu';
import { Button } from '../ui/Button';
import { useEditorFile } from '../../hooks/useEditorFile';
import { useCodeTools } from '../../hooks/useCodeTools';
import { showToast } from '../../stores/toast';
import api from '../../services/api';
import { useStore } from '@nanostores/solid';
import RightDrawer from '../ui/RightDrawer';
import GenerateCode from '../GenerateCode';
import GenerateDocumentation from '../GenerateDocumentation';
import ChatGenerateCode from '../ChatGenerate';

// Import the new component
import {
  editorFilePath,
  editorUnsaved,
  editorOriginalContent,
  editorContent,
  editorOpenTabs,
  //editorLanguage,
} from '../../stores/editorContent';

interface EditorBottomNavProps {
  setTerminalOpen: (open: boolean) => void;
}

export const EditorBottomNav = (props: EditorBottomNavProps): JSX.Element => {
  return <></>;
};
