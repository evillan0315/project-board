import { createSignal } from 'solid-js';
import {
  editorContent,
  editorFilePath,
  editorLanguage,
  editorOriginalContent,
  editorHistory,
  editorFuture,
  editorOpenTabs,
} from '../stores/editorContent';
import api from '../services/api';
import { showToast } from '../stores/toast';

export function useCodeGenerator() {
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleGenerate = async (
    prompt: string,
    language: string,
    outputFormat: string,
    topic: string,
  ): Promise<{ success: boolean; newFilePath?: string }> => {
    setIsLoading(true);
    setError('');

    try {
      const openedFilePath = editorFilePath.get();
      const currentFileName = openedFilePath?.split('/').pop() || 'generated-file';

      const payload = {
        prompt: prompt || 'Write a function that returns 42.',
        language,
        output: outputFormat,
        topic,
      };

      const response = await api.post(`/google-gemini/generate-code`, payload);
      if (!response.data) throw new Error('No response from server.');

      const rawContent = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);

      const { data: strippedContent } = await api.post(`/utils/strip-code-block`, {
        content: rawContent,
      });

      const newFilePath = `./generated/code/${Date.now()}-${currentFileName}`;
      const createFilePayload = {
        filePath: newFilePath,
        isDirectory: false,
        content: strippedContent,
        type: 'file',
      };

      const { data: fileCreationResult } = await api.post(`/file/create`, createFilePayload);

      console.log(fileCreationResult, 'Created File');

      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { newFilePath } }));
      showToast(`Code generation complete and saved in ${fileCreationResult.message}.`, 'success');

      return { success: true, newFilePath };
    } catch (err: any) {
      const message = err?.message || 'Unknown error';
      setError(message);
      showToast(`Error: ${message}`, 'error');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleGenerate,
  };
}
