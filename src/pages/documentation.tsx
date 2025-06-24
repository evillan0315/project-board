import { createSignal, createResource } from 'solid-js';
import { PageHeader } from '../components/ui/PageHeader';
import MarkdownViewer from '../components/MarkdownViewer';
import Loading from '../components/Loading';
import GenerateDocumentation from '../components/GenerateDocumentation';
import api from '../services/api';

export default function GenerateDocumentationPage() {
  const [prompt, setPrompt] = createSignal('');
  const [topic, setTopic] = createSignal('SolidJS');
  const [output, setOutput] = createSignal('markdown');
  const [language, setLanguage] = createSignal('ts');
  const [isComment, setIsComment] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [content, setContent] = createSignal('');
  const [error, setError] = createSignal('');
  const topicOptions = ['', 'React', 'SolidJS', 'NestJS', 'Vue', 'Angular'];

  const languageOptions = [
    { code: '', label: '' },
    { code: 'ts', label: 'TypeScript' },
    { code: 'js', label: 'JavaScript' },
    { code: 'py', label: 'Python' },
    { code: 'java', label: 'Java' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/google-gemini/generate-doc', {
        codeSnippet: prompt(),
        language: language(),
        topic: topic(),
        isComment: false,
        output: '',
      });
      if (!response.data) throw new Error('Failed to generate documentation');

      setContent(response.data);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div class="flex flex-col max-w-7xl mx-auto">
      <div class="flex-1 scroll-smooth px-4 space-y-4">
        <PageHeader icon="mdi:code">
          <h2 class="leading-0 uppercase tracking-widest text-xl">
            <b>Code</b> Documentation
          </h2>
        </PageHeader>
        <p class="">
          This tool generates clean, context-aware documentation for your code using AI-powered natural language models.
          Choose a topic (e.g., React, NestJS), specify the programming language, and indicate whether you want inline
          comments or external descriptions.
        </p>
        {/* Main Content */}
        <div class="flex flex-col md:flex-row gap-6">
          <GenerateDocumentation
            prompt={prompt}
            setPrompt={setPrompt}
            topic={topic}
            setTopic={setTopic}
            output={output}
            setOutput={setOutput}
            topicOptions={topicOptions}
            language={language}
            setLanguage={setLanguage}
            languageOptions={languageOptions}
            isComment={isComment}
            setIsComment={setIsComment}
            handleSubmit={handleSubmit}
            loading={loading}
            error={() => (error() ? 'Failed to generate documentation.' : '')}
            generatedContent={content() ?? ''}
          />

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
      </div>
    </div>
  );
}
