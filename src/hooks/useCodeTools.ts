import api from '../services/api';
import { editorContent, editorLanguage } from '../stores/editorContent';
import { showToast } from '../stores/toast';

export function useCodeTools() {
  const runGeneration = async (
    type: 'optimize' | 'analyze' | 'repair' | 'generate',
    additionalPayload: Record<string, any> = {},
  ) => {
    const code = editorContent.get();
    const lang = editorLanguage.get() || 'JavaScript';

    if (type !== 'generate' && !code.trim()) {
      showToast('No code to process.', 'error');
      return;
    }

    try {
      const label = type === 'generate' ? 'Generate Code' : type.charAt(0).toUpperCase() + type.slice(1);
      showToast(`${label} in progress...`, 'info');

      let payload: Record<string, any>;
      let endpoint: string;

      if (type === 'generate') {
        payload = {
          prompt: additionalPayload.prompt || 'Write a function that returns 42.',
          language: lang,
          output: 'text',
        };
        endpoint = `/google-gemini/generate-code`;
      } else {
        payload = {
          codeSnippet: code,
          language: lang,
          output: 'text',
        };
        endpoint = `/google-gemini/${type}-code`;
      }

      const response = await api.post(endpoint, payload);

      if (!response.data) throw new Error('No response from server.');

      const newContent = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);

      editorContent.set(newContent);
      showToast(`${label} complete.`, 'success');
    } catch (err) {
      const msg = (err as any).response?.data?.message || (err as Error).message;
      showToast(`Error during ${type}: ${msg}`, 'error');
    }
  };

  return {
    optimize: () => runGeneration('optimize'),
    analyze: () => runGeneration('analyze'),
    repair: () => runGeneration('repair'),
    generateCode: (prompt?: string) => runGeneration('generate', { prompt }),
  };
}
