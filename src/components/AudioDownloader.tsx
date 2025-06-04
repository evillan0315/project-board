import { createSignal, onCleanup, onMount } from 'solid-js';
import io from 'socket.io-client';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
const socket = io('https://board-api.duckdns.org'); // Adjust if hosted elsewhere

export default function AudioDownloader() {
  const [url, setUrl] = createSignal('');
  const [progress, setProgress] = createSignal(0);
  const [filePath, setFilePath] = createSignal('');
  const [error, setError] = createSignal('');

  onMount(() => {
    socket.on('download_progress', (data) => {
      setProgress(data.progress);
    });

    socket.on('download_complete', (data) => {
      setFilePath(data.filePath);
    });

    socket.on('download_error', (data) => {
      setError(data.message);
    });

    onCleanup(() => {
      socket.off('download_progress');
      socket.off('download_complete');
      socket.off('download_error');
    });
  });

  const handleSubmit = () => {
    setProgress(0);
    setFilePath('');
    setError('');
    socket.emit('extract_audio', { url: url(), format: 'mp3' });
  };

  return (
    <div class="p-4 max-w-md mx-auto rounded shadow">
      <h2 class="text-xl font-bold mb-4">YouTube Audio Downloader</h2>
      <input
        type="text"
        class="w-full border p-2 mb-2"
        placeholder="Enter YouTube URL"
        value={url()}
        onInput={(e) => setUrl(e.currentTarget.value)}
      />
      <Button class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest" onClick={handleSubmit}>
        <Icon icon="mdi:download" width="2.2em" height="2.2em" />
        Download
      </Button>
      {progress() > 0 && (
        <div class="mt-4">
          <p>Progress: {progress().toFixed(2)}%</p>
          <div class="h-2 bg-gray-300 rounded overflow-hidden">
            <div class="h-full bg-blue-500" style={{ width: `${progress()}%` }} />
          </div>
        </div>
      )}

      {filePath() && (
        <div class="mt-4 text-green-600">
          ✅ Download complete: <code>{filePath()}</code>
        </div>
      )}

      {error() && <div class="mt-4 text-red-600">❌ Error: {error()}</div>}
    </div>
  );
}
