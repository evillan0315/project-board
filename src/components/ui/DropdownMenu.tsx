import { type Component, type JSX, For, createSignal, Show, onCleanup, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './Button';
import type { DropdownItem, DropdownHeader, DropdownDivider } from '../../types/dropdown';
import { resolveVariantClasses, resolveSizeClasses, resolveStateClasses } from '../../utils/classResolver';

type DropdownMenuItem = DropdownItem | DropdownHeader | DropdownDivider;

interface DropdownMenuProps {
  content?: string | JSX.Element;
  label?: string;
  items: DropdownMenuItem[];
  icon: string | IconifyIcon;
  iconSize?: string | number;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showButtonLabel?: boolean;
  xPosition?: 'left' | 'right';
  yPosition?: 'top' | 'bottom';
  rounded?: boolean;
  className?: string;
  width?: number;
}

const DropdownMenu: Component<DropdownMenuProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const resolveTextSizeClass = (size?: string): string => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-sm';
    }
  };

  return (
    <div
      class={`relative inline-block  ${props.xPosition === 'left' ? 'text-left' : 'text-right'} max-w-2xl`}
      ref={containerRef}
    >
      {props.content ? (
        props.content
      ) : (
        <Button
          title={props.label}
          variant={props.variant}
          size={props.size}
          onClick={toggleDropdown}
          icon={props.icon}
        >
          {props.showButtonLabel && props.label}
        </Button>
      )}

      <Show when={isOpen()}>
        <div
          class={`${props.className || ''} dropdown-menu absolute z-150 border shadow-${props.size ? props.size : 'sm'} 
            ${props.rounded ? 'rounded' : ''}
            ${props.size ? `rounded-${props.size}` : ''}
            ${props.xPosition === 'left' ? 'left-0' : 'right-0'}
            ${props.yPosition === 'bottom' ? 'bottom-0' : 'top-full'}
            
          `}
          style={props.width ? `width: ${props.width}px` : ''}
        >
          <ul class={`${resolveTextSizeClass(props.size)} min-w-48`}>
            <For each={props.items}>
              {(item) => {
                if ('type' in item && item.type === 'divider') {
                  return <li class="border-b" />;
                }
                if ('label' in item && 'onClick' in item && 'icon' in item) {
                  const dropdownItem = item as DropdownItem;
                  return (
                    <li
                      class={`${resolveTextSizeClass(props.size)} flex items-center gap-4 px-4 py-2 cursor-pointer whitespace-nowrap
                        `}
                      onClick={() => {
                        dropdownItem.onClick();
                        setIsOpen(false);
                      }}
                    >
                      <Icon icon={dropdownItem.icon} />
                      {dropdownItem.label}
                    </li>
                  );
                }
                if ('label' in item) {
                  const dropdownHeader = item as DropdownHeader;
                  return (
                    <li
                      title={dropdownHeader.label}
                      class="flex items-center gap-2 px-4 py-2 uppercase font-semibold text-gray-600 dark:text-gray-400"
                    >
                      {dropdownHeader.icon && <Icon icon={dropdownHeader.icon} />}
                      {dropdownHeader.label}
                    </li>
                  );
                }
                return null;
              }}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
};

export default DropdownMenu;
