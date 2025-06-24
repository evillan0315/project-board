import { atom, computed } from 'nanostores';

function persistentAtom<T>(key: string, initialValue: T) {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  const store = atom<T>(initial);

  if (typeof window !== 'undefined') {
    store.listen((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return store;
}

export const editorContent = atom<string>('');
export const editorFilePath = atom<string>('');

export const editorCurrentDirectory = persistentAtom<string>('editorCurrentDirectory', '/');
export const editorFilesDirectories = atom<string[]>([]);
export const editorOpenedDirectories = atom<string[]>([]);

export const editorOriginalContent = atom<string>('');
export const editorHistory = atom<string[]>([]);
export const editorFuture = atom<string[]>([]);
export const editorNewPath = atom<string>('');
export const editorOpenTabs = persistentAtom<string[]>('editorOpenTabs', []);
export const editorUnsaved = persistentAtom<Record<string, boolean>>('editorUnsaved', {});

export const editorUnsavedContent = persistentAtom<Record<string, string>>('editorUnsavedContent', {});

export const editorActiveContent = persistentAtom<string>('editorActiveContent', '');
export const editorActiveFilePath = persistentAtom<string>('editorActiveFilePath', '');
export const editorLanguage = persistentAtom<string>('editorLanguage', '');

export const isDirty = computed(
  [editorFilePath, editorContent, editorOriginalContent],
  (filePath, content, original) => {
    return content !== original || editorUnsaved.get()[filePath] === true;
  },
);
