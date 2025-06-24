import { createSignal, onCleanup, onMount } from 'solid-js';
import RightSidebar from './RightSidebar';

export default function ResizableLeftSidebar() {
  const [width, setWidth] = createSignal(200);
  const [isResizing, setIsResizing] = createSignal(false);

  let sidebarRef: HTMLDivElement | undefined;

  const startResizing = () => {
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing() || !sidebarRef) return;
    const newWidth = e.clientX;
    const clampedWidth = Math.max(100, Math.min(newWidth, 400)); // min 100px, max 400px
    setWidth(clampedWidth);
  };

  onMount(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopResizing);
  });

  onCleanup(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', stopResizing);
  });

  return (
    <div
      ref={sidebarRef}
      class="flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-150"
      style={{ width: `${width()}px` }}
    >
      <LeftSidebar />
      <div class="w-1 cursor-ew-resize bg-gray-700 hover:bg-sky-500" onMouseDown={startResizing} />
    </div>
  );
}
