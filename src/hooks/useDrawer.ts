import { createSignal } from 'solid-js';
import { topicOptions, languageOptions, outputFormats } from '../constants/generateCodeOptions';

export function useDrawer() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [title, setTitle] = createSignal('');

  const [prompt, setPrompt] = createSignal('');
  const [topic, setTopic] = createSignal('');
  const [output, setOutput] = createSignal(outputFormats[0] || 'text');
  const [language, setLanguage] = createSignal<string>('ts');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [generatedContent, setGeneratedContent] = createSignal('');
  const [isComment, setIsComment] = createSignal(false);

  function openDrawer(newTitle = '') {
    setTitle(newTitle);
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  function resetDrawer() {
    setTitle('');
    setPrompt('');
    setTopic('');
    setOutput(outputFormats[0] || 'text');
    setLanguage('ts');
    setLoading(false);
    setError('');
    setGeneratedContent('');
    setIsComment(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    resetDrawer,

    title,
    setTitle,

    prompt,
    setPrompt,
    topic,
    setTopic,
    output,
    setOutput,
    language,
    setLanguage,
    loading,
    setLoading,
    error,
    setError,
    generatedContent,
    setGeneratedContent,
    isComment,
    setIsComment,

    topicOptions,
    languageOptions,
    outputFormats,
  };
}
