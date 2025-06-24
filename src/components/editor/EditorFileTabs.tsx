import { For, onMount, onCleanup, type JSX, createSignal, createEffect, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import {
  editorFilePath,
  editorActiveFilePath,
  editorOpenTabs,
  editorUnsaved,
  editorContent,
  editorUnsavedContent,
  editorActiveContent,
} from '../../stores/editorContent';
import EditorFileTabItem from './EditorFileTabItem';
import { Button } from '../ui/Button';
import { confirm } from '../../services/modalService'; // Make sure this is correctly imported
import { confirmDiscardIfUnsaved, closeAllTabsWithConfirmation } from '../../utils/editorUnsaved'; // Assuming confirm is part of this or handled elsewhere

export default function EditorFileTabs(): JSX.Element {
  let scrollContainer: HTMLDivElement | undefined;
  const [showScrollButtons, setShowScrollButtons] = createSignal(false);

  const $openTabs = useStore(editorOpenTabs);
  const $filePath = useStore(editorFilePath);
  const $content = useStore(editorContent);
  const $unsaved = useStore(editorUnsaved);
  const $unsavedContent = useStore(editorUnsavedContent);
  const $editorActiveFilePath = useStore(editorActiveFilePath);
  const $editorActiveContent = useStore(editorActiveContent);
  const scrollBy = (amount: number) => {
    scrollContainer?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTabClick = async (path: string) => {
    if ($editorActiveFilePath() === path) return;

    const ok = await confirmDiscardIfUnsaved($editorActiveFilePath());
    if (!ok) return;

    editorActiveFilePath.set(path);
    editorFilePath.set(path);
    //editorActiveContent.set($unsavedContent()[path]);
    document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path } }));
  };
  // --- New Function: handleCloseAllTabs ---
  // Replace your old handleCloseAllTabs with this simplified version:
  const handleCloseAllTabs = async () => {
    // The utility now handles all the checking and state clearing internally
    await closeAllTabsWithConfirmation();
  };
  // --- End New Function ---
  const handleTabClose = async (closedPath: string) => {
    const ok = await confirmDiscardIfUnsaved(closedPath);
    if (!ok) return;

    // Proceed with closing
    const tabs = Array.isArray($openTabs()) ? $openTabs() : [];
    const remaining = tabs.filter((t) => t !== closedPath);
    editorOpenTabs.set(remaining);

    if ($editorActiveFilePath() === closedPath) {
      const r = remaining.length ? remaining[remaining.length - 1] : '';
      if (r.trim() === '') {
        editorContent.set('');
        editorActiveContent.set('');
      }

      editorActiveFilePath.set(r);
      editorFilePath.set(r);
      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path: $editorActiveFilePath() } }));
    }

    const updatedUnsaved = { ...$unsaved() };
    const updatedUnsavedContent = { ...$unsavedContent() };
    delete updatedUnsavedContent[closedPath];
    delete updatedUnsaved[closedPath];
    editorUnsavedContent.set(updatedUnsavedContent);
    editorUnsaved.set(updatedUnsaved);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const tabs = Array.isArray($openTabs()) ? $openTabs() : [];
    const index = tabs.indexOf($editorActiveFilePath());

    /*if (e.key === 'ArrowRight' && index >= 0) {
      e.preventDefault();
      editorActiveFilePath.set(tabs[(index + 1) % tabs.length]);
      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path: editorActiveFilePath.get() } }));
    } else if (e.key === 'ArrowLeft' && index >= 0) {
      e.preventDefault();
      editorActiveFilePath.set(tabs[(index - 1 + tabs.length) % tabs.length]);
      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path: editorActiveFilePath.get() } }));
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if ($editorActiveFilePath()) handleTabClose($editorActiveFilePath());
    }*/
  };

  const checkScrollNeeded = () => {
    // Use requestAnimationFrame for more accurate DOM measurements after layout updates
    requestAnimationFrame(() => {
      if (scrollContainer) {
        // Add a small buffer (e.g., 1px) to prevent flickering due to sub-pixel rendering
        setShowScrollButtons(scrollContainer.scrollWidth > scrollContainer.clientWidth + 1);
      }
    });
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Observe changes to the scroll container's size
    const resizeObserver = new ResizeObserver(() => checkScrollNeeded());
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }

    // Observe changes to the children of the scroll container (e.g., tabs added/removed, or their size changes)
    // This is more reliable than observing individual children for all mutations.
    const mutationObserver = new MutationObserver(() => checkScrollNeeded());
    if (scrollContainer) {
      mutationObserver.observe(scrollContainer, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    // Initial check
    checkScrollNeeded();

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
      resizeObserver.disconnect();
      mutationObserver.disconnect(); // Disconnect mutation observer on cleanup
    });
  });

  // Re-check scroll needed when open tabs change
  createEffect(() => {
    $openTabs(); // Dependency for the effect
    // Call checkScrollNeeded directly; requestAnimationFrame handles the timing
    checkScrollNeeded();
  });

  const filePathSegments = () => {
    const path = $editorActiveFilePath();
    if (!path) return [];
    const segments = path.split('/');
    const breadcrumbSegments: { name: string; path: string }[] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += segment;
      if (index < segments.length - 1) {
        currentPath += '/';
      }
      breadcrumbSegments.push({ name: segment, path: currentPath });
    });

    return breadcrumbSegments;
  };

  const handleBreadcrumbClick = (path: string) => {
    editorActiveFilePath.set(path);
    document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path } }));
  };

  return (
    <>
      <div class="flex">
        <div id="tabsContainer" class="flex flex-grow items-center overflow-hidden">
          {' '}
          {/* Changed flex-col to flex, removed px-0 */}
          <Show when={Array.isArray($openTabs()) && $openTabs().length > 0}>
            <Button
              icon="mdi:close-box-multiple-outline" // This is the icon for multiple close
              title="Close All Tabs"
              variant="ghost" // 'ghost' makes it subtle, you can choose 'secondary' or 'outline' if you prefer
              size="sm"
              class="flex-shrink-0 mr-1" // Keeps it from shrinking and adds some space
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
            class="flex overflow-x-auto scrollbar-hide flex-grow min-w-0 h-full items-center" // Added min-w-0 for flex children
            style={{ 'scroll-behavior': 'smooth' }}
          >
            <For
              each={
                Array.isArray($openTabs()) ? $openTabs().filter((tab) => typeof tab === 'string' && tab.trim()) : []
              }
            >
              {(tabPath) => (
                <EditorFileTabItem
                  path={tabPath}
                  active={$editorActiveFilePath() === tabPath}
                  unsaved={!!$unsaved()[tabPath]}
                  unsavedContent={!!$unsavedContent()[tabPath]}
                  onClick={() => handleTabClick(tabPath)}
                  onClose={() => handleTabClose(tabPath)}
                />
              )}
            </For>
          </div>
          <Show when={showScrollButtons()}>
            <Button
              variant="outline"
              icon="mdi:chevron-right"
              size="sm"
              class="flex-shrink-0 mx-1"
              onClick={() => scrollBy(150)}
            />
          </Show>
        </div>
      </div>
    </>
  );
}
