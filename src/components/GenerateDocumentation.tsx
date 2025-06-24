import type { JSX } from 'solid-js';
import { For, Show, createSignal } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
import MarkdownViewer from './MarkdownViewer';
import ToggleSwitch from './ui/ToggleSwitch';

type GenerateDocumentationProps = {
  prompt: () => string;
  setPrompt: (val: string) => void;
  topic: () => string;
  setTopic: (val: string) => void;
  topicOptions: string[];
  output: () => string;
  setOutput: (val: string) => void;
  language: () => string;
  setLanguage: (val: string) => void;
  languageOptions: { code: string; label: string }[];
  isComment?: () => boolean;
  setIsComment?: (val: boolean) => void;
  handleSubmit: (format: string) => void;
  loading: () => boolean;
  error: () => string;
  generatedContent: string | null;
};

const outputFormats = ['markdown', 'html', 'json', 'text'];

export default function GenerateDocumentation(props: GenerateDocumentationProps): JSX.Element {
  const [saveDoc, setSaveDoc] = createSignal(false);

  return (
    <div class="space-y-4 rounded-lg border p-6 bg-gray-800/10 border-gray-500/30">
      <label class="block mb-1 text-lg font-medium">Prompt</label>
      <textarea
        rows={4}
        class="w-full p-3 min-h-[160px] border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Paste your code snippet here..."
        value={props.prompt()}
        onInput={(e) => props.setPrompt(e.currentTarget.value)}
      />
      <div class="flex items-center justify-between gap-2 mt-1">
        <ToggleSwitch
          label="Inline Comments"
          checked={props.isComment ? props.isComment : false}
          onChange={props.setIsComment}
        />
        <ToggleSwitch label="Save Doc" checked={saveDoc()} onChange={setSaveDoc} />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Topic (Framework)</label>
          <select
            class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
            value={props.topic()}
            onChange={(e) => props.setTopic(e.currentTarget.value)}
          >
            <For each={props.topicOptions}>{(topic) => <option value={topic}>{topic}</option>}</For>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Programming Language</label>
          <select
            class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
            value={props.language()}
            onChange={(e) => props.setLanguage(e.currentTarget.value)}
          >
            <For each={props.languageOptions}>{(lang) => <option value={lang.code}>{lang.label}</option>}</For>
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
        class="px-4 py-3 w-full text-xl mt-2 mb-6 gap-4 disabled:bg-gray-200"
        onClick={() => props.handleSubmit(props.output())}
        variant="secondary"
        disabled={props.loading}
      >
        <Icon icon="mdi:file-document-outline" width="2.2em" height="2.2em" />
        {props.loading ? 'Generating Documentation...' : 'Generate Documentation'}
      </Button>

      <Show when={props.error}>
        <p class="text-red-500">{props.error}</p>
      </Show>

      <Show when={props.generatedContent}>
        <div>
          <Show
            when={props.output() === 'markdown'}
            fallback={
              <pre class="whitespace-pre-wrap p-4 rounded text-sm overflow-x-auto">{props.generatedContent}</pre>
            }
          >
            <MarkdownViewer content={props.generatedContent!} />
          </Show>
        </div>
      </Show>
    </div>
  );
}
