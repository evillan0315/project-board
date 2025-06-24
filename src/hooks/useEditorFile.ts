import { createSignal, onCleanup } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { showToast } from '../stores/toast';
import { fileService } from '../services/fileService';
import type { FileItem } from '../types/types';

import {
  editorContent,
  editorFilePath,
  editorLanguage,
  editorOriginalContent,
  editorHistory,
  editorFuture,
  editorOpenTabs,
  editorUnsaved,
  editorCurrentDirectory,
  editorFilesDirectories,
} from '../stores/editorContent';

import { confirmDiscardIfUnsaved } from '../utils/editorUnsaved';

export function useEditorFile(onLoadContent?: (content: string) => void, onSave?: () => void) {
  const [content, setContent] = createSignal('');
  const [currentFilePath, setCurrentFilePath] = createSignal('');
  const [language, setLanguage] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [loadingMessage, setLoadingMessage] = createSignal('');
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');

  const $editorCurrentDirectory = useStore(editorCurrentDirectory);

  let latestRequestId = 0;

  const fetchFile = async (path: string) => {
    if (!path) return;

    const canProceed = await confirmDiscardIfUnsaved(editorFilePath.get());
    if (!canProceed) {
      showToast('File load cancelled.', 'info');
      return;
    }

    const requestId = ++latestRequestId;
    setLoading(true);
    setLoadingMessage(`Loading ${path}...`);

    try {
      const code = await fileSocketService.readFile({ filePath: path });
      console.log(code, 'code fetchFile');
      if (latestRequestId !== requestId) {
        console.log(`Stale fetch for ${path} (request ${requestId}), ignoring.`);
        return;
      }

      setContent(code);
      editorContent.set(code);
      editorOriginalContent.set(code);
      editorHistory.set([]);
      editorFuture.set([]);

      editorFilePath.set(path);
      setCurrentFilePath(path);

      // Optional: infer language based on extension or server hint
      const lang = path.split('.').pop() || '';
      setLanguage(lang);
      editorLanguage.set(lang);

      const prevTabs = editorOpenTabs.get() ?? [];
      if (!prevTabs.includes(path)) {
        editorOpenTabs.set([...prevTabs, path]);
      }

      onLoadContent?.(code);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
    } finally {
      if (latestRequestId === requestId) {
        setLoading(false);
        setLoadingMessage('');
      }
    }
  };

  const fetchDirectory = async (dirPath: string) => {
    setLoading(true);
    setLoadingMessage(`Loading directory ${dirPath}...`);

    try {
      const files: FileItem[] = await fileSocketService.listFiles({
        directory: dirPath,
      });
      editorFilesDirectories.set(files);
      editorCurrentDirectory.set(dirPath);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const saveFile = async () => {
    if (!editorFilePath.get()) {
      showToast('No file path specified', 'error');
      return;
    }

    setSaving(true);
    try {
      const fileCon = await fileSocketService.emitRequest(
        'writeFileContent',
        { filePath: editorFilePath.get(), content: editorContent.get() },
        'writeFileContentResponse',
        'writeFileContentError',
      );
      console.log(fileCon, 'fileCon');
      editorOriginalContent.set(editorContent.get());
      showToast('File saved successfully.', 'success');

      editorUnsaved.set({
        ...editorUnsaved.get(),
        [editorFilePath.get()]: false,
      });

      onSave?.();
    } catch (err) {
      const msg = (err as Error).message;
      showToast(`Error saving file: ${msg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const createFile = async (directory: string, fileName: string, initialContent = '') => {
    try {
      await fileSocketService.createFile({ directory, name: fileName });
      showToast(`File '${fileName}' created.`, 'success');
      await fetchDirectory(directory);
      await fetchFile(`${directory}/${fileName}`);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      showToast(`Error creating file: ${msg}`, 'error');
    }
  };

  const createFolder = async (directory: string, folderName: string) => {
    try {
      await fileSocketService.createFolder({ directory, name: folderName });
      showToast(`Folder '${folderName}' created.`, 'success');
      await fetchDirectory(directory);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      showToast(`Error creating folder: ${msg}`, 'error');
    }
  };

  const deleteFileOrFolder = async (filePath: string) => {
    try {
      await fileSocketService.deleteFile({ filePath });
      showToast(`'${filePath}' deleted.`, 'success');
      await fetchDirectory(editorCurrentDirectory.get());

      if (editorFilePath.get() === filePath) {
        editorFilePath.set('');
        editorContent.set('');
        editorOriginalContent.set('');
        editorLanguage.set('');
        editorHistory.set([]);
        editorFuture.set([]);

        editorOpenTabs.set(editorOpenTabs.get().filter((tab) => tab !== filePath));

        const updatedUnsaved = { ...editorUnsaved.get() };
        delete updatedUnsaved[filePath];
        editorUnsaved.set(updatedUnsaved);
      }
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      showToast(`Error deleting: ${msg}`, 'error');
    }
  };

  onCleanup(() => {
    latestRequestId++;
  });

  return {
    currentFilePath,
    setCurrentFilePath,
    content,
    setContent,
    language,
    loading,
    loadingMessage,
    saving,
    error,

    currentDirectory: $editorCurrentDirectory,

    fetchFile,
    fetchDirectory,
    saveFile,
    createFile,
    createFolder,
    deleteFileOrFolder,
  };
}
