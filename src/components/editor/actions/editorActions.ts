import api from '../../../services/api';
import { editorContent, editorOriginalContent } from '../../../stores/editorContent';
import { showToast } from '../../../stores/toast';
import { useEditorFile } from '../../../hooks/useEditorFile';
import { editorTools } from '../../../services/file';
import { APIProps } from '../../../types/api';

export async function handleRemoveComments(content: string) {
  try {
    const payload: APIProps = {
      endpoint: '/utils/remove-code-comment',
      method: 'POST',
      event: 'removeCodeComment',
      body: { content },
    };
    const response = await editorTools(payload);
    if (!response && response.data) showToast(`Error Event:  ${payload.event}`, 'error');
    editorActiveContent.set(response.data);
    editorContent.set(response.data);
    editorOriginalContent.set(response.data);
    showToast('Comments removed successfully.', 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export function formatCode(code: string, language: string) {
  try {
    const payload: APIProps = {
      endpoint: '/utils/format',
      method: 'POST',
      event: 'formatCode',
      body: {
        code,
        language,
      },
    };
    const response = await editorTools(payload);
    if (!response && response.data) showToast(`Error Event:  ${payload.event}`, 'error');
    editorActiveContent.set(response.data);
    editorContent.set(response.data);
    editorOriginalContent.set(response.data);
    showToast('Comments removed successfully.', 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export function optimize(codeSnippet: string, language: string, output: string) {
  try {
    const payload: APIProps = {
      endpoint: '/google-gemini/optimize-code',
      method: 'POST',
      event: 'optimizeCode',
      body: {
        codeSnippet,
        language,
        output,
      },
    };
    const response = await editorTools(payload);
    if (!response && response.data) showToast(`Error Event:  ${payload.event}`, 'error');
    editorActiveContent.set(response.data);
    editorContent.set(response.data);
    editorOriginalContent.set(response.data);
    showToast('Comments removed successfully.', 'success');
  } catch (err: any) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

export function analyze() {
  const tools = useCodeTools();
  tools.analyze();
}

export function repair() {
  const tools = useCodeTools();
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
export function saveFile() {
  const editor = useEditorFile();
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
