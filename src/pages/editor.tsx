// src/pages/editor.tsx

import { createSignal, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useAuth } from '../contexts/AuthContext';
import EditorComponent from '../components/EditorComponent';
import FileManager from '../components/FileManager';
import GridResizer from '../components/GridResizer';
import TerminalDrawer from '../components/TerminalDrawer';

import api from '../services/api';

/**
 * The main `Editor` page component that provides:
 * - A file manager panel for selecting files
 * - A code editor panel with syntax highlighting
 * - A resizable layout controlled by a grid resizer
 * - An optional terminal drawer for command execution
 */
export default function Editor() {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = createSignal(false);
  const [filePath, setFilePath] = createSignal('./README.md');
  const [fileContent, setFileContent] = createSignal<string>('');

  const [fileManagerWidth, setFileManagerWidth] = createSignal(400);
  const [containerWidth, setContainerWidth] = createSignal(0);

  const [left, setLeft] = createSignal(0.325);
  const isHorizontal = () => false;

  let fileManagerRef!: HTMLDivElement;
  let containerRef!: HTMLDivElement;
  let grid!: HTMLDivElement;
  let resizer!: HTMLDivElement;

  /**
   * Calculates and updates the widths of the file manager and container panels.
   */
  const updateWidths = () => {
    if (fileManagerRef && containerRef) {
      setFileManagerWidth(fileManagerRef.offsetWidth);
      setContainerWidth(containerRef.offsetWidth);
    }
  };

  /**
   * Handles resizing of the file manager/editor split pane.
   * @param clientX - Mouse X coordinate
   * @param clientY - Mouse Y coordinate
   */
  const changeLeft = (clientX: number, clientY: number) => {
    const rect = grid.getBoundingClientRect();
    let position: number;
    let size: number;

    if (isHorizontal()) {
      position = clientY - rect.top - resizer.offsetHeight / 2;
      size = grid.offsetHeight - resizer.offsetHeight;
    } else {
      position = clientX - rect.left - resizer.offsetWidth / 2;
      size = grid.offsetWidth - resizer.offsetWidth;
    }

    const percentage = position / size;
    const percentageAdjusted = Math.min(Math.max(percentage, 0.25), 0.75);

    setLeft(percentageAdjusted);
  };

  /**
   * Loads file content from the backend for a given path.
   * @param path - Path to the file being loaded
   */
  const loadFile = async (path: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('filePath', path);

      const response = await api.post('/file/read', formData);
      if (!response.data) throw new Error('Failed to load file');

      const { data } = response.data;
      setFilePath(path);
      setFileContent(data.data);
    } catch (err) {
      console.error(`Error loading file "${path}":`, err);
      throw new Error(`Error loading file "${path}": ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadFile(filePath());
    updateWidths();

    // Cleanup listeners if added in the future
    onCleanup(() => {
      window.removeEventListener('resize', updateWidths);
    });
  });

  return (
    <div
      ref={grid}
      class="flex h-[calc(100vh-5rem)] min-h-0 flex-1 flex-col font-sans"
      classList={{
        'md:flex-row': !isHorizontal(),
        'dark': true,
      }}
    >
      {/* File Manager Panel */}
      <div class="flex min-h-0 min-w-0 flex-col overflow-auto relative" style={`flex: ${left()}`}>
        <div class="fixed top-12 left-0 right-0 z-10 w-full border-b border-gray-900 bg-gray-950 ">
          <div class="flex justify-between align-center">
            <div>
              <button class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 text-sm uppercase tracking-widest">
                <Icon icon="mdi:file" width="22" height="22" /> File Explorer
              </button>
            </div>
          </div>
        </div>
        <div class="pb-4 pt-12">
          <FileManager onFileSelect={loadFile} />
        </div>
      </div>

      {/* Grid Resizer */}
      <GridResizer ref={resizer} isHorizontal={isHorizontal()} onResize={changeLeft} />

      {/* Code Editor Panel */}
      <div class="flex min-h-0 min-w-0 flex-col overflow-auto pt-9" style={`flex: ${1 - left()}`}>
        <EditorComponent theme="dark" filePath={filePath()} content={fileContent()} language="typescript" />
      </div>

      {/* Integrated Terminal Drawer */}
      <TerminalDrawer position="bottom" size="200px" fontSize="12" resizable={true} draggable={false} />
    </div>
  );
}
