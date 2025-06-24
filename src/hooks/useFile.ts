// Refactored useEditorFile.ts with directory file listing
import { createSignal, onCleanup } from 'solid-js';
import { FileSocketService } from './fileSocketService';
import { editorContent } from './editorContent';

export function useEditorFile(baseUrl: string, namespace: string, token: string) {
  const [content, setContent] = createSignal<string>('');
  const [files, setFiles] = createSignal<string[]>([]);
  const fileSocket = new FileSocketService(baseUrl, namespace);

  fileSocket.connect(token);

  fileSocket.on('fileContent', (data: { content: string }) => {
    setContent(data.content);
    editorContent.set(data.content);
  });

  fileSocket.on('fileList', (data: { files: string[] }) => {
    setFiles(data.files);
  });

  const requestFileList = (directory: string) => {
    fileSocket.emit('listFiles', { directory });
  };

  onCleanup(() => fileSocket.disconnect());

  return {
    content,
    files,
    emitSave: (updatedContent: string) => fileSocket.emit('saveFile', { content: updatedContent }),
    requestFileList,
  };
}
