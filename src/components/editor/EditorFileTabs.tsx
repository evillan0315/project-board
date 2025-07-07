import { For, onMount, onCleanup, createSignal, createEffect, Show, type JSX } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { Icon } from '@iconify-icon/solid';
import {
  editorFilePath,
  editorActiveFilePath,
  editorOpenTabs,
  editorUnsaved,
  editorUnsavedContent,
  editorContent,
  editorActiveContent,
} from '../../stores/editorContent';
import EditorFileTabItem from './EditorFileTabItem';
import { Button } from '../ui/Button';
import { confirmDiscardIfUnsaved, closeAllTabsWithConfirmation } from '../../utils/editorUnsaved';

export default function EditorFileTabs(): JSX.Element {
  let scrollContainer: HTMLDivElement | undefined;
  const [showScrollButtons, setShowScrollButtons] = createSignal(false);

  const $openTabs = useStore(editorOpenTabs);
  const $unsaved = useStore(editorUnsaved);
  const $unsavedContent = useStore(editorUnsavedContent);
  const $editorActiveFilePath = useStore(editorActiveFilePath);

  const scrollBy = (amount: number) => {
    scrollContainer?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTabClick = async (path: string) => {
    if ($editorActiveFilePath() === path) return;
    const ok = await confirmDiscardIfUnsaved($editorActiveFilePath());
    if (!ok) return;

    editorActiveFilePath.set(path);
    editorFilePath.set(path);
    document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path } }));
  };

  const handleTabClose = async (closedPath: string) => {
    const ok = await confirmDiscardIfUnsaved(closedPath);
    if (!ok) return;

    const remainingTabs = $openTabs().filter((t) => t !== closedPath);
    editorOpenTabs.set(remainingTabs);

    const isActiveClosed = $editorActiveFilePath() === closedPath;
    if (isActiveClosed) {
      const nextPath = remainingTabs[remainingTabs.length - 1] || '';
      editorActiveFilePath.set(nextPath);
      editorFilePath.set(nextPath);
      if (!nextPath) {
        editorContent.set('');
        editorActiveContent.set('');
      }
      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path: nextPath } }));
    }

    const updatedUnsaved = { ...$unsaved() };
    const updatedUnsavedContent = { ...$unsavedContent() };
    delete updatedUnsaved[closedPath];
    delete updatedUnsavedContent[closedPath];
    editorUnsaved.set(updatedUnsaved);
    editorUnsavedContent.set(updatedUnsavedContent);
  };

  const handleCloseAllTabs = async () => {
    await closeAllTabsWithConfirmation();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const tabs = $openTabs();
    const idx = tabs.indexOf($editorActiveFilePath());

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if ($editorActiveFilePath()) handleTabClose($editorActiveFilePath());
    } else if (e.key === 'ArrowRight' && idx >= 0 && tabs.length > 1) {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      handleTabClick(next);
    } else if (e.key === 'ArrowLeft' && idx >= 0 && tabs.length > 1) {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      handleTabClick(prev);
    }
  };

  const checkScrollNeeded = () => {
    requestAnimationFrame(() => {
      if (scrollContainer) {
        setShowScrollButtons(scrollContainer.scrollWidth > scrollContainer.clientWidth + 1);
      }
    });
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);

    const resizeObserver = new ResizeObserver(() => checkScrollNeeded());
    if (scrollContainer) resizeObserver.observe(scrollContainer);

    const mutationObserver = new MutationObserver(() => checkScrollNeeded());
    if (scrollContainer) {
      mutationObserver.observe(scrollContainer, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    checkScrollNeeded();

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    });
  });

  createEffect(() => {
    $openTabs();
    checkScrollNeeded();
  });

  return (
    <div class="flex w-full">
      <div class="flex flex-grow items-center overflow-hidden">
        <Show when={$openTabs().length > 0}>
          <Button
            icon="mdi:close-box-multiple-outline"
            title="Close All Tabs"
            variant="ghost"
            size="sm"
            class="flex-shrink-0 mr-1"
            onClick={handleCloseAllTabs}
          />
        </Show>

        <Show when={showScrollButtons()}>
          <Button
            icon="mdi:chevron-left"
            variant="outline"
            size="sm"
            class="flex-shrink-0 mx-1"
            onClick={() => scrollBy(-150)}
          />
        </Show>

        <div
          ref={(el) => (scrollContainer = el)}
          class="flex overflow-x-auto scrollbar-hide flex-grow min-w-0 h-full items-center"
        >
          <For each={$openTabs()}>
            {(path) => (
              <EditorFileTabItem
                path={path}
                active={$editorActiveFilePath() === path}
                unsaved={!!$unsaved()[path]}
                unsavedContent={!!$unsavedContent()[path]}
                onClick={() => handleTabClick(path)}
                onClose={() => handleTabClose(path)}
              />
            )}
          </For>
        </div>

        <Show when={showScrollButtons()}>
          <Button
            icon="mdi:chevron-right"
            variant="outline"
            size="sm"
            class="flex-shrink-0 mx-1"
            onClick={() => scrollBy(150)}
          />
        </Show>
      </div>
    </div>
  );
}
