// src/components/FileManagerContainer.tsx

import { createSignal, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import FileManager from '../file/FileManager';

interface FileManagerContainerProps {
  left?: Accessor<string | number> | string | number;
  loadFile?: (filePath: string) => void;
}

const FileManagerContainer = (props: FileManagerContainerProps) => {
  const [refreshFileList, setRefreshFileList] = createSignal<((directory?: string) => Promise<void>) | null>(null);
  const [isOpen, setIsOpen] = createSignal(true);
  let contentRef: HTMLDivElement | undefined;

  const togglePanel = () => {
    if (!contentRef) return;

    const expanded = isOpen();
    setIsOpen(!expanded);

    if (expanded) {
      contentRef.style.maxHeight = `${contentRef.scrollHeight}px`;
      requestAnimationFrame(() => {
        contentRef!.style.maxHeight = '0px';
        contentRef!.style.overflow = 'hidden';
      });
    } else {
      contentRef.style.maxHeight = '0px';
      contentRef.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        contentRef!.style.maxHeight = `${contentRef!.scrollHeight}px`;
        setTimeout(() => {
          if (contentRef) {
            contentRef.style.maxHeight = 'none';
            contentRef.style.overflow = 'visible';
          }
        }, 300);
      });
    }
  };

  onMount(() => {
    if (isOpen() && contentRef) {
      contentRef.style.maxHeight = 'none';
      contentRef.style.overflow = 'visible';
    }
  });

  const flexValue = typeof props.left === 'function' ? props.left() : (props.left ?? 1);

  return (
    <>
      <div id="fileTree" class="p-2 text-sm font-mono">
        <FileManager
          onFileSelect={(path) => {
            props.loadFile?.(path); // Ensure this calls Editor.tsx loadFile
          }}
          refreshList={(fn) => setRefreshFileList(() => fn)}
        />
      </div>
    </>
  );
};

export default FileManagerContainer;
