import { type Component, createSignal, onMount } from 'solid-js';
import MarkdownViewer from '../MarkdownViewer';
import api from '../../services/api';

const EditorInitialView: Component = () => {
  const [readme, setReadme] = createSignal<string>('');
  const [loading, setLoading] = createSignal<boolean>(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const response = await api.post('/file/read', {
        filePath: './frontend/README.md',
      });
      setReadme(response.data.content || '');
    } catch (err) {
      console.error('Failed to load README:', err);
      setError('Failed to load README.md');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="h-screen flex flex-col overflow-auto relative">
      <div class="container mx-auto p-4">
        {loading() && <p class="text-gray-500">Loading README...</p>}
        {error() && <p class="text-red-500">{error()}</p>}
        {!loading() && !error() && <MarkdownViewer content={readme()} />}
      </div>
    </div>
  );
};

export default EditorInitialView;
