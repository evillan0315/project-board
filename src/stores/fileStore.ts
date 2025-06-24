import { atom } from 'nanostores';
import type { FileItem } from '../../types/types';
import { persistentAtom } from '../utils/persistentAtom';

export const saveRecordId = persistentAtom<string>('saveRecordId', '');

export const shuffledQueue = atom<number[]>([]);
export const queueIndex = atom<number>(0);
export const currentDirectory = persistentAtom<string>('currentDirectory', './');
export const selectedFile = atom<FileItem>({});
export const filesDirectories = atom<FileItem[]>([]);
// The current working directory

// Map of directory path → children
export const directoryChildren = atom<Record<string, FileItem[]>>({});

// Recent directories
export const recentDirectories = atom<string[]>([]);

export function addRecentDirectory(dir: string) {
  recentDirectories.set((prev) => {
    const updated = [dir, ...prev.filter((d) => d !== dir)].slice(0, 5);
    localStorage.setItem('recentDirectories', JSON.stringify(updated));
    return updated;
  });
}

export function loadRecentDirectoriesFromStorage() {
  const saved = localStorage.getItem('recentDirectories');
  if (saved) {
    try {
      recentDirectories.set(JSON.parse(saved));
    } catch {
      recentDirectories.set([]);
    }
  }
}
export function setFilesDirectories(dir: string, children: FileItem[]) {
  filesDirectories.set({
    ...filesDirectories.get(),
    [dir]: children,
  });
}
export function setDirectoryChildren(dir: string, children: FileItem[]) {
  directoryChildren.set({
    ...directoryChildren.get(),
    [dir]: children,
  });
}
