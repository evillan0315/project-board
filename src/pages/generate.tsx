import { createSignal, Show, Switch, Match } from 'solid-js';
import { PageHeader } from '../components/ui/PageHeader';
import TTSForm from './tts';
import GenerateCode from '../components/GenerateCode';
import GenerateDocumentation from '../components/GenerateDocumentation';
import { Icon } from '@iconify-icon/solid';
import api from '../services/api';

export default function GeneratePage() {
  const [activeTab, setActiveTab] = createSignal<'gen' | 'tts'>('gen');
  const [generationType, setGenerationType] = createSignal<'documentation' | 'code'>('code');

  // Shared state
  const [prompt, setPrompt] = createSignal(
    generationType() === 'code' ? 'Create a SolidJS component that displays a user profile card.' : '',
  );

  const [topic, setTopic] = createSignal('SolidJS');
  const [language, setLanguage] = createSignal('ts');
  const [output, setOutput] = createSignal<'markdown' | 'json' | 'html' | 'text'>('text');
  const [isComment, setIsComment] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [content, setContent] = createSignal('');
  const [error, setError] = createSignal('');

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
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-4 space-y-6">
      <PageHeader icon="mdi:wand">
        <h1 class="leading-0 uppercase tracking-widest text-2xl">
          <b>Generate</b> AI Content
        </h1>
      </PageHeader>

      <div class="flex gap-2 border-b border-gray-600">
        <button
          class={`flex items-center justify-center gap-2 px-4 py-2 font-medium ${activeTab() === 'gen' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('gen')}
        >
          <Icon icon="mdi:code" width="20" height="20" /> Code
        </button>
        <button
          class={`flex items-center justify-center gap-2 px-4 py-2 font-medium ${activeTab() === 'tts' ? 'border-b-2 border-blue-500 ' : ''}`}
          onClick={() => setActiveTab('tts')}
        >
          <Icon icon="mdi:tts" width="20" height="20" /> Text To Speech
        </button>
      </div>

      <Show when={activeTab() === 'gen'}>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Generation Type</label>
          <select
            class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
            value={generationType()}
            onChange={(e) => setGenerationType(e.currentTarget.value as 'documentation' | 'code')}
          >
            <option value="documentation">Documentation</option>
            <option value="code">Code</option>
          </select>
        </div>
        <div class="flex gap-4">
          <Switch>
            <Match when={generationType() === 'documentation'}>
              <GenerateDocumentation
                prompt={prompt}
                setPrompt={setPrompt}
                topic={topic}
                setTopic={setTopic}
                topicOptions={topicOptions}
                output={output}
                setOutput={setOutput}
                language={language}
                setLanguage={setLanguage}
                languageOptions={languageOptions}
                isComment={isComment}
                setIsComment={setIsComment}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                generatedContent={content()}
              />
            </Match>
            <Match when={generationType() === 'code'}>
              <GenerateCode
                prompt={prompt}
                setPrompt={setPrompt}
                topic={topic}
                setTopic={setTopic}
                topicOptions={topicOptions}
                output={output}
                setOutput={setOutput}
                language={language}
                setLanguage={setLanguage}
                languageOptions={languageOptions}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                generatedContent={content()}
              />
            </Match>
          </Switch>
          {/* Sidebar Info */}
          <div class="w-full md:w-1/4 space-y-4">
            <div class="p-4 border rounded-lg bg-gray-800/10 border-gray-500/30">
              <h3 class="text-xl font-semibold">📄 About Code Documentation</h3>

              <h4 class="font-medium mt-4">✨ Key Features</h4>
              <ul class="list-disc pl-5 space-y-1">
                <li>Supports multiple frontend and backend frameworks</li>
                <li>Generates inline comments or separate markdown documentation</li>
                <li>Customizable by topic and programming language</li>
                <li>Powered by Google Gemini via secure API</li>
                <li>SolidJS-based responsive interface</li>
              </ul>

              <h4 class="font-medium mt-4">💡 Use Cases</h4>
              <ul class="list-disc pl-5 space-y-1">
                <li>Auto-generate documentation for learning or onboarding</li>
                <li>Improve code readability for teams</li>
                <li>Quickly explain unfamiliar code snippets</li>
              </ul>

              <h4 class="font-medium mt-4">🛠 Supported Technologies</h4>
              <p>
                Currently supports documentation generation for TypeScript, JavaScript, Python, and Java in frameworks
                like React, NestJS, Vue, and more.
              </p>
            </div>
          </div>
        </div>
      </Show>

      <Show when={activeTab() === 'tts'}>
        <TTSForm />
      </Show>
    </div>
  );
}
