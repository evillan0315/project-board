import api from '../../services/api';
import { editorContent, editorActiveContent, editorOriginalContent, editorLanguage } from '../../stores/editorContent';
import { showToast } from '../../stores/toast';
import { useEditorFile } from '../../hooks/useEditorFile';
import { editorTools } from '../../services/file';
import { type APIProps } from '../../types/api';

export async function handleRemoveComments(content: string) {
  try {
    const payload: APIProps = {
      endpoint: '/utils/remove-code-comment',
      method: 'POST',
      event: 'removeCodeComment',
      body: { content: editorOriginalContent.get() },
    };
    const response = await editorTools(payload);
    if (!response && response.data) showToast(`Error Event:  ${payload.event}`, 'error');
    showToast('Comments removed successfully.', 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export async function formatCode() {
  try {
    const payload: APIProps = {
      endpoint: '/utils/format',
      method: 'POST',
      event: 'formatCode',
      body: {
        code: editorActiveContent.get(),
        language: editorLanguage.get(),
      },
    };
    const response = await editorTools(payload);
    if (!response && response.data) showToast(`Error Event:  ${payload.event}`, 'error');
    showToast(`${payload.event} successfully.`, 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export async function optimize() {
  try {
    const payload: APIProps = {
      endpoint: '/google-gemini/optimize-code',
      method: 'POST',
      event: 'optimizeCode',
      body: {
        codeSnippet: editorActiveContent.get(),
        language: editorLanguage.get(),
        output: editorLanguage.get(),
      },
    };
    const response = await editorTools(payload);
    if (!response && response.data) showToast(`Error Event:  ${payload.event}`, 'error');
    showToast(`${payload.event} successfully.`, 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export async function analyze() {
  const tools = await useCodeTools();
  tools.analyze();
}

export async function repair() {
  const tools = await useCodeTools();
  tools.repair();
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
export async function saveFile() {
  const editor = await useEditorFile();
  editor.saveFile();
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
