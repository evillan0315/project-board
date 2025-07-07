// src/components/Icon.tsx
import { createResource, type Component, Show, splitProps, mergeProps, type JSX } from 'solid-js';
import { getIconNameSvg } from '../../services/icon';

interface IconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  icon: string; // e.g., "mdi:home"
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

export const Icon: Component<IconProps> = (props) => {
  const merged = mergeProps({ size: '1em' }, props);
  const [local, others] = splitProps(merged, ['icon', 'size', 'width', 'height', 'class']);

  const resolvedWidth = () =>
    local.width ?? (typeof local.size === 'number' ? `${local.size}px` : (local.size ?? '1em'));

  const resolvedHeight = () =>
    local.height ?? (typeof local.size === 'number' ? `${local.size}px` : (local.size ?? '1em'));

  const [svg] = createResource(() => local.icon, getIconNameSvg);

  return (
    <Show
      when={svg()}
      fallback={
        <div
          class={`inline-block animate-pulse text-gray-300 ${local.class ?? ''}`}
          style={{ width: resolvedWidth(), height: resolvedHeight() }}
        >
          ⬤
        </div>
      }
    >
      <span
        innerHTML={svg()}
        style={{
          width: resolvedWidth(),
          height: resolvedHeight(),
        }}
        class={`inline-block align-middle ${local.class ?? ''}`}
        {...others}
      />
    </Show>
  );
};
