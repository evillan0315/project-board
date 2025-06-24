import { splitProps, Show, createEffect, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { resolveSizeClasses, resolveStateClasses } from '../../utils/classResolver';

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'error' | 'info' | 'warning' | 'success';
  active?: boolean;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: string | JSX.Element;
  loading?: boolean;
};

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, [
    'class',
    'disabled',
    'children',
    'variant',
    'active',
    'selected',
    'size',
    'icon',
    'loading',
    'aria-label',
  ]);

  const hasLabel = !!local.children;
  const isIconOnly = !!local.icon && !hasLabel;

  createEffect(() => {
    if (isIconOnly && !local['aria-label']) {
      console.warn('Accessibility warning: Icon-only button should have an aria-label for screen readers.');
    }
  });

  return (
    <button
      class={`${local.icon ? 'btn-icon' : 'btn'}  flex items-center justify-center gap-2 cursor-pointer transition
        ${resolveStateClasses({
          active: local.active,
          selected: local.selected,
          disabled: local.disabled,
          loading: local.loading,
        })}
        ${local.class || ''}`}
      disabled={local.disabled || local.loading}
      aria-label={local['aria-label']}
      {...others}
    >
      <Show when={local.loading}>
        <Icon icon="svg-spinners:180-ring-with-bg" class="animate-spin h-4 w-4" />
      </Show>
      <Show when={!local.loading && local.icon}>
        {typeof local.icon === 'string' ? (
          <Icon icon={local.icon} width={'1.4em'} height={'1.4em'} class="inline-block" />
        ) : (
          local.icon
        )}
      </Show>
      <Show when={!local.loading}>{local.children}</Show>
    </button>
  );
}
