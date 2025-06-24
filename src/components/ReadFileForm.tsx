// src/components/ReadFileForm.tsx
import { createSignal } from 'solid-js';
import { Button } from './ui/Button';
import api from '../services/api';
import { confirm, alert, prompt } from '../services/modalService';

export default function ReadFileForm() {
  const [file, setFile] = createSignal<File | null>(null);
  const [filePath, setFilePath] = createSignal('');
  const [url, setUrl] = createSignal('');
  const [generateBlobUrl, setGenerateBlobUrl] = createSignal(false);
  const [response, setResponse] = createSignal<any>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const formData = new FormData();
    if (file()) formData.append('file', file()!);
    if (filePath()) formData.append('filePath', filePath());
    if (url()) formData.append('url', url());
    formData.append('generateBlobUrl', String(generateBlobUrl()));

    try {
      const res = await api.post('/file/read', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: generateBlobUrl() ? 'blob' : 'json',
      });

      if (generateBlobUrl()) {
        const blob = new Blob([res.data]);
        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl, 'blobUrl');
        setResponse({ blobUrl });
      } else {
        setResponse(res.data);
      }
    } catch (err: any) {
      console.error('Error reading file:', err);
      setResponse({ error: err.response?.data?.message || err.message });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} class="space-y-4 p-4 border rounded">
        <div>
          <label class="block font-medium">Upload File:</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <div>
          <label class="block font-medium">File Path:</label>
          <input
            type="text"
            class="border p-1 w-full"
            value={filePath()}
            onInput={(e) => setFilePath(e.currentTarget.value)}
          />
        </div>

        <div>
          <label class="block font-medium">URL:</label>
          <input type="text" class="border p-1 w-full" value={url()} onInput={(e) => setUrl(e.currentTarget.value)} />
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={generateBlobUrl()}
            onChange={(e) => setGenerateBlobUrl(e.currentTarget.checked)}
          />
          <label>Return as blob URL</label>
        </div>

        <Button variant="primary" type="submit" class="px-4 py-2 rounded">
          Read File
        </Button>

        {response() && (
          <div class="mt-4">
            <h3 class="font-semibold">Response:</h3>
            {response().blobUrl ? (
              <a href={response().blobUrl} download="output" target="_blank" class="underline">
                Download Blob
              </a>
            ) : (
              <pre class="h-[200px] p-2 text-sm overflow-auto">{JSON.stringify(response(), null, 2)}</pre>
            )}
          </div>
        )}
      </form>
    </>
  );
}
