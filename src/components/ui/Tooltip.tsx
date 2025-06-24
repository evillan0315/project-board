import {
  createComponent,
  type JSX,
  onMount,
  onCleanup,
  createSignal,
  Show,
  createEffect,
  mergeProps,
  splitProps,
} from 'solid-js';

interface FileItem {
  name: string;
  type: string;
  mimeType: string;
  size: number;
  path: string;
  created: Date;
  updated: Date;
}

interface TooltipProps {
  text?: string;
  html?: JSX.Element;
  children: JSX.Element;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  className?: string;
}

const Tooltip = (props: TooltipProps) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, left: 0 });

  const mergedProps = mergeProps(
    {
      delay: 500,
      position: 'top',
      offset: 5,
    },
    props,
  );

  let tooltipRef: HTMLDivElement | undefined;
  let targetRef: HTMLElement | undefined;

  const updatePosition = () => {
    if (!targetRef || !tooltipRef) return;

    const targetRect = targetRef.getBoundingClientRect();
    const tooltipRect = tooltipRef.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (mergedProps.position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - mergedProps.offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + mergedProps.offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - mergedProps.offset;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + mergedProps.offset;
        break;
    }

    setPosition({
      top: Math.max(0, top),
      left: Math.max(0, left),
    });
  };

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, mergedProps.delay);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  onMount(() => {
    window.addEventListener('resize', updatePosition);
  });

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
    window.removeEventListener('resize', updatePosition);
  });

  createEffect(() => {
    if (isVisible()) {
      updatePosition();
    }
  });

  return (
    <div class="relative inline-block" ref={(target) => (targetRef = target)}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {mergedProps.children}
      </div>

      <Show when={isVisible()}>
        <div
          ref={(el) => (tooltipRef = el)}
          class={`tooltip-wrapper absolute z-10 text-sm rounded py-2 px-3 shadow-lg min-w-70 transition-opacity duration-200 ${mergedProps.className}`}
          style={{
            'top': `${position().top}px`,
            'left': `${position().left}px`,
            'opacity': isVisible() ? 1 : 0,
            'pointer-events': 'none',
          }}
        >
          <Show when={mergedProps.text}>{mergedProps.text}</Show>
          <Show when={mergedProps.html}>{mergedProps.html}</Show>
        </div>
      </Show>
    </div>
  );
};

export default Tooltip;

// Example Usage
/*
import Tooltip from './Tooltip';

interface Props {
    file: FileItem;
}

const FileItemComponent = (props: Props) => {
    return (
        <Tooltip
            text={props.file.name}
            position="bottom"
            offset={10}
        >
            <div>{props.file.name}</div>
        </Tooltip>
    )
}
*/
