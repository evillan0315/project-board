import { createSignal, createEffect, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { throttle } from '@solid-primitives/scheduled';
import { isFirefox } from '@solid-primitives/platform';

const Dot: Component<{ isDragging: boolean }> = (props) => {
  return (
    <span
      class="h-1 w-1 rounded-full bg-gray-900 dark:bg-gray-300 dark:group-hover:bg-sky-200"
      classList={{
        'bg-sky-200': props.isDragging,
        'dark:bg-sky-200': props.isDragging,
      }}
    />
  );
};

type SolidRef = (el: HTMLDivElement) => void;

const GridResizer: Component<{
  ref: HTMLDivElement | SolidRef;
  isHorizontal: boolean;
  onResize: (clientX: number, clientY: number) => void;
}> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);

  const onResizeStart = () => setIsDragging(true);
  const onResizeEnd = () => setIsDragging(false);

  const onMouseMove = throttle((e: MouseEvent) => {
    props.onResize(e.clientX, e.clientY);
  }, 10);

  const onTouchMove = throttle((e: TouchEvent) => {
    const touch = e.touches[0];
    props.onResize(touch.clientX, touch.clientY);
  }, 10);

  const setRef = (el: HTMLDivElement) => {
    (props.ref as SolidRef)(el);

    el.addEventListener('mousedown', onResizeStart, { passive: true });
    el.addEventListener('touchstart', onResizeStart, { passive: true });

    onCleanup(() => {
      el.removeEventListener('mousedown', onResizeStart);
      el.removeEventListener('touchstart', onResizeStart);
    });
  };

  createEffect(() => {
    if (isDragging()) {
      // Fixes Firefox issue where dragging cursor fails to emit events to overlay, and instead to iframe, resulting in resizer bar not moving.
      if (isFirefox) {
        document.querySelectorAll('iframe').forEach((el) => (el.style.pointerEvents = 'none'));
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onResizeEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onResizeEnd);
    } else {
      if (isFirefox) {
        document.querySelectorAll('iframe').forEach((el) => (el.style.pointerEvents = ''));
      }

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onResizeEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onResizeEnd);
    }
  });

  return (
    <div
      ref={setRef}
      class="hover:bg-sky-500 dark:hover:bg-sky-600 flex items-center justify-center gap-2 border-gray-200 dark:border-gray-900"
      classList={{
        'bg-brand-default dark:bg-brand-default': isDragging(),
        'bg-gray-100 dark:bg-gray-950/50': !isDragging(),
        'flex-col cursor-col-resize border-l-1 border-r-1 w-[12px]': !props.isHorizontal,
        'flex-row cursor-row-resize border-t-1 border-b-1 h-[12px]': props.isHorizontal,
      }}
    >
      <div
        classList={{
          'fixed inset-0 z-10': isDragging(),
          'hidden': !isDragging(),
          'cursor-col-resize': !props.isHorizontal,
          'cursor-row-resize': props.isHorizontal,
        }}
      />
      <Dot isDragging={isDragging()} />
      <Dot isDragging={isDragging()} />
      <Dot isDragging={isDragging()} />
    </div>
  );
};
export default GridResizer;
