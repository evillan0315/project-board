import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

type PageHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & {
  icon: string;
  variant?: 'primary' | 'secondary' | 'outline';
};

export function PageHeader(props: PageHeaderProps) {
  const [local, others] = splitProps(props, ['class', 'children', 'variant', 'icon']);

  const resolveClasses = (variant?: string): string => {
    switch (variant) {
      case 'primary':
        return '';
      case 'secondary':
        return '';
      case 'outline':
        return '';
      default:
        return '';
    }
  };

  return (
    <div
      class={`${resolveClasses(local.variant || 'primary')} flex items-center justify-start gap-4 my-6 ${local.class || ''}`}
      {...others}
    >
      {local.icon && <Icon icon={local.icon} width="2.2em" height="2.2em" />}
      {local.children}
    </div>
  );
}
