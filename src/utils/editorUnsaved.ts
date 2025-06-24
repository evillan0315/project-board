import {
  editorOpenTabs,
  editorUnsaved,
  editorFilePath,
  editorContent,
  editorActiveFilePath,
  editorActiveContent,
  editorLanguage,
  editorUnsavedContent,
} from '../stores/editorContent';
import { confirm } from '../services/modalService';
import { useStore } from '@nanostores/solid'; // You'll need this import if this utility is a SolidJS component or hook

/**
 * Checks if the file has unsaved changes and prompts user for confirmation to discard them.
 * @param path File path to check.
 * @returns Promise that resolves to true if it's okay to proceed (discard changes), false otherwise.
 */
export async function confirmDiscardIfUnsaved(path: string): Promise<boolean> {
  if (!path) return true;

  const unsavedMap = editorUnsaved.get();
  if (unsavedMap[path]) {
    const proceed = await confirm(`You have unsaved changes in "${path}". Discard changes and continue?`);
    return !!proceed;
  }

  return true;
}

/**
 * Checks all open tabs for unsaved changes. If any are found, prompts the user for confirmation to discard them.
 * If the user confirms or if there are no unsaved changes, it clears all tab-related state.
 * @returns Promise that resolves to true if tabs were closed (or no tabs were open), false if the user cancelled.
 */
export async function closeAllTabsWithConfirmation(): Promise<boolean> {
  // Use useStore only if this function is a SolidJS component or hook.
  // If it's a standalone utility, directly access nanostores.
  const openTabs = editorOpenTabs.get();
  const unsavedMap = editorUnsaved.get();

  const unsavedPaths = openTabs.filter((tabPath) => unsavedMap[tabPath]);

  if (unsavedPaths.length > 0) {
    const plural = unsavedPaths.length > 1 ? 'tabs' : 'tab';
    const confirmed = await confirm(
      'Discard All Changes?',
      `You have unsaved changes in ${unsavedPaths.length} ${plural}. Are you sure you want to close all tabs and discard them?`,
    );

    if (!confirmed) {
      return false; // User cancelled
    }
  }

  // If we reach here, either there were no unsaved changes, or the user confirmed to discard them.
  // Proceed with clearing all tab-related state.
  editorOpenTabs.set([]);
  editorFilePath.set('');
  editorActiveFilePath.set('');
  editorActiveContent.set('');
  editorLanguage.set('');
  editorUnsaved.set({});
  editorUnsavedContent.set({});
  editorContent.set(''); // Clear editor content (if it's tied to an active file)

  // Dispatch event to clear the editor view, if needed (reusing existing event logic)
  document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path: '' } }));

  return true; // Tabs were successfully closed (or no unsaved changes to block)
}
