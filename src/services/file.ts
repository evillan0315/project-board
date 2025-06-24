//import api from './api';

/*export async function getBlobFileUrl(
  filePath: string,
  onProgress?: (progress: { loaded: number; total?: number; percent?: number }) => void
): Promise<string | undefined> {
  if (!filePath) {
    console.error('File path is required.');
    return;
  }

  try {
    const res = await api.get('/file/download', {
      params: { filePath },
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = total ? Math.round((loaded * 100) / total) : undefined;
        if (onProgress) {
          onProgress({ loaded, total, percent });
        }
      },
    });

    const blob = new Blob([res.data]);
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (err: any) {
    console.error('Error downloading file:', err);
  }
}*/

import { fileService } from './fileService';
import api from './api'; // Your Axios API
//import { saveAs } from 'file-saver'; // Optional: to save blob directly

export function getBlobFileUrl(filePath: string): string {
  const baseUrl = import.meta.env.BASE_URL_API;
  return `${baseUrl}/api/file/stream?filePath=${encodeURIComponent(filePath)}`;
}

export async function getMediaStreamUrl(filePath: string): Promise<string> {
  // Ensure WebSocket connection
  const socket = await fileService.connect();

  // Listen to progress
  socket.on('fileDownloadProgress', (progress) => {
    console.log(`Download: ${progress.percent}%`, progress);
    // You can update UI here (e.g. progress bar)
  });

  socket.once('fileDownloadComplete', (info) => {
    console.log('Download finished:', info);
  });

  socket.once('fileDownloadError', (err) => {
    console.error('Download failed:', err.message);
  });

  try {
    // Send HTTP download request, passing the socket.id

    const response = await fileService.emitDynamicFileEvent({
      endpoint: '/file/download',
      method: 'GET',
      params: { filePath },
      event: 'fileDownload',
      responseType: 'blob',
    });
    const mimeType = response.headers?.['content-type'] || 'audio/mp3'; // fallback MIME type

    //console.log(response, 'response');
    const blob = new Blob([response.data], { type: 'audio/mp3' });
    const fileName = filePath.split(/[\\/]/).pop() || 'downloaded-file';
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (err: any) {
    console.error('HTTP download error:', err.message);
  }
}
