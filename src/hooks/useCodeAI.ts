import { createSignal } from 'solid-js';
import api from '../services/api';
import { showToast } from '../stores/toast';

export type GenerationType = 'code' | 'documentation';
export type OutputType = 'markdown' | 'json' | 'html' | 'text';

export function useCodeGeneration(initialType: GenerationType = 'code') {
  const [generationType, setGenerationType] = createSignal<GenerationType>(initialType);
  const [prompt, setPrompt] = createSignal('');
  const [topic, setTopic] = createSignal('SolidJS');
  const [language, setLanguage] = createSignal('ts');
  const [output, setOutput] = createSignal<OutputType>('json');
  const [isComment, setIsComment] = createSignal(true);
  const [content, setContent] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const topicOptions = ['React', 'SolidJS', 'NestJS', 'Vue', 'Angular'];
  const languageOptions = [
    { code: 'ts', label: 'TypeScript' },
    { code: 'js', label: 'JavaScript' },
    { code: 'py', label: 'Python' },
    { code: 'java', label: 'Java' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    showToast('Submitting request...', 'info');

    try {
      let response;

      if (generationType() === 'documentation') {
        response = await api.post('/google-gemini/generate-doc', {
          codeSnippet: prompt(),
          language: language(),
          topic: topic(),
          output: output(),
          isComment: isComment(),
        });
      } else {
        response = await api.post('/google-gemini/generate-code', {
          prompt: prompt(),
          topic: topic(),
          language: language(),
          output: output(),
        });
      }

      if (!response.data) throw new Error('No content generated');
      setContent(typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
      showToast('Generation completed successfully.', 'success');
    } catch (err: any) {
      const msg = err.message || 'Unexpected error';
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const optimizeCode = () => handleSpecialRequest('/google-gemini/optimize-code', 'Code optimized');
  const analyzeCode = () => handleSpecialRequest('/google-gemini/analyze-code', 'Code analyzed');
  const repairCode = () => handleSpecialRequest('/google-gemini/repair-code', 'Code repaired');

  const handleSpecialRequest = async (endpoint: string, successMessage: string) => {
    setLoading(true);
    setError('');
    showToast(`Sending ${successMessage.toLowerCase()} request...`, 'info');

    try {
      const response = await api.post(endpoint, {
        codeSnippet: prompt(),
        language: mapLanguageCode(language()),
        output: output(),
      });

      if (!response.data) throw new Error('No response received');
      setContent(typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
      showToast(successMessage, 'success');
    } catch (err: any) {
      const msg = err.message || 'Unexpected error';
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const mapLanguageCode = (code: string): string => {
    switch (code) {
      case 'ts':
        return 'TypeScript';
      case 'js':
        return 'JavaScript';
      case 'py':
        return 'Python';
      case 'java':
        return 'Java';
      default:
        return code;
    }
  };

  return {
    generationType,
    setGenerationType,
    prompt,
    setPrompt,
    topic,
    setTopic,
    topicOptions,
    language,
    setLanguage,
    languageOptions,
    output,
    setOutput,
    isComment,
    setIsComment,
    content,
    error,
    loading,
    handleSubmit,
    optimizeCode,
    analyzeCode,
    repairCode,
  };
}
