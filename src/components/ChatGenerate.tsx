import type { JSX } from 'solid-js';
import { For, Show, createEffect } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
import MarkdownViewer from './MarkdownViewer';
import { topicOptions, languageOptions, outputFormats } from '../constants/generateCodeOptions';
import { useCodeGenerator } from '../hooks/useCodeGenerator';
const { isLoading, error, handleGenerate } = useCodeGenerator();

type GenerateCodeProps = {
  prompt: () => string;
  setPrompt: (val: string) => void;
  topic: () => string;
  setTopic: (val: string) => void;
  output: () => string;
  setOutput: (val: string) => void;
  language: () => string;
  setLanguage: (val: string) => void;
  handleSubmit: (format: string) => void;
  loading: () => boolean;
  error: () => string;
  generatedContent: string | null;
  topicOptions?: string[];
  languageOptions?: { code: string; label: string }[];
  outputFormats?: string[];
};

export default function ChatGenerateCode(props: GenerateCodeProps): JSX.Element {
  let outputRef: HTMLDivElement | undefined;
  const { isLoading, error, handleGenerate } = useCodeGenerator();
  // Smooth scroll to latest output
  createEffect(() => {
    if (props.generatedContent && outputRef) {
      outputRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return (
    <div class="space-y-4 rounded-lg border p-6 bg-gray-800/10 border-gray-500/30">
      <Show when={props.generatedContent}>
        <div ref={outputRef} class="mb-4 rounded border border-gray-500/30 bg-gray-100 p-4 dark:bg-gray-900">
          <MarkdownViewer content={props.generatedContent!} />
        </div>
      </Show>

      <Show when={props.error()}>
        <p class="text-red-500">{props.error()}</p>
      </Show>

      <label class="block mb-1 text-lg font-medium">Prompt</label>
      <textarea
        rows={4}
        class="w-full p-3 min-h-[160px] border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Paste your code snippet here..."
        value={props.prompt()}
        onInput={(e) => props.setPrompt(e.currentTarget.value)}
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Topic (Framework)</label>
          <select
            class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
            value={props.topic()}
            onChange={(e) => props.setTopic(e.currentTarget.value)}
          >
            <For each={topicOptions}>{(topic) => <option value={topic}>{topic}</option>}</For>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Programming Language</label>
          <select
            class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
            value={props.language()}
            onChange={(e) => props.setLanguage(e.currentTarget.value)}
          >
            <For each={languageOptions}>{(lang) => <option value={lang.code}>{lang.label}</option>}</For>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Output Format</label>
          <select
            class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
            value={props.output()}
            onChange={(e) => props.setOutput(e.currentTarget.value)}
          >
            <For each={outputFormats}>{(format) => <option value={format}>{format}</option>}</For>
          </select>
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={async () => {
          const result = await handleGenerate(props.prompt(), props.language(), props.output(), props.topic());
          if (result.success) {
            setDrawerOpen(false); // or whatever controls your drawer
          }
        }}
        disabled={props.loading()}
      >
        Generate Code
      </Button>

      <Show when={error()}>
        <p class="text-red-500">{error()}</p>
      </Show>
    </div>
  );
}
