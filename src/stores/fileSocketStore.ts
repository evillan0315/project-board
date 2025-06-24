import { atom } from 'nanostores';
import type { FileItem } from '../types/types';

// Connection status: 'disconnected' | 'connected' | 'error' | 'connecting'
export const fileSocketConnectionStatus = atom<'disconnected' | 'connected' | 'error' | 'connecting'>('disconnected');
export const fileList = atom<FileItem[]>([]);
// Current directory being viewed
export const currentDirectory = atom<string>('./');

// List of files/directories in the current directory
export const currentDirectoryFiles = atom<FileItem[]>([]);

// Last search results (optional)
export const fileSearchResults = atom<FileItem[]>([]);

// Selected file path (e.g., for editor or preview)
export const selectedFilePath = atom<string | null>(null);

// Utility for clearing store data (optional)
export function resetFileSocketStore() {
  currentDirectory.set('./');
  currentDirectoryFiles.set([]);
  fileSearchResults.set([]);
  selectedFilePath.set(null);
  fileSocketConnectionStatus.set('disconnected');
}
