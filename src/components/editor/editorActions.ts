import api from '../../services/api';
import { editorContent, editorOriginalContent } from '../../stores/editorContent';
import { showToast } from '../../stores/toast';
import { useEditorFile } from '../../hooks/useEditorFile';
import { useCodeTools } from '../../hooks/useCodeTools';

export async function handleRemoveComments() {
  try {
    const response = await api.post('/utils/remove-code-comment', { content: editorContent.get() });
    editorContent.set(response.data);
    editorOriginalContent.set(response.data);
    showToast('Comments removed successfully.', 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export async function handleGenerateDocumentation() {
  // Placeholder for documentation generation logic
  showToast('Documentation generation not implemented.', 'info');
}
export async function handleDrawer() {
  // Placeholder for documentation generation logic
  showToast('Handling opening of drawers not implemented.', 'info');
}
export async function handleGenerateCode() {
  // Placeholder for documentation generation logic
  showToast('Code generation not implemented.', 'info');
}
export function saveFile() {
  const editor = useEditorFile();
  editor.saveFile();
}
export function formatCode() {
  const editor = useEditorFile();
  editor.formatCode();
}

export function optimize() {
  const tools = useCodeTools();
  tools.optimize();
}

export function analyze() {
  const tools = useCodeTools();
  tools.analyze();
}

export function repair() {
  const tools = useCodeTools();
  tools.repair();
}

export const sharedDrawerProps = {
  prompt: () => '',
  setPrompt: () => {},
  topic: () => '',
  setTopic: () => {},
  topicOptions: ['React', 'SolidJS', 'NestJS', 'Vue', 'Angular'],
  output: () => 'text',
  setOutput: () => {},
  language: () => 'ts',
  setLanguage: () => {},
  languageOptions: [
    { code: 'ts', label: 'TypeScript' },
    { code: 'js', label: 'JavaScript' },
    { code: 'py', label: 'Python' },
    { code: 'java', label: 'Java' },
  ],
  handleSubmit: () => {},
  loading: false,
  error: '',
  generatedContent: '',
  isComment: false,
};
