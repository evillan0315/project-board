import { type IconifyIcon } from '@iconify-icon/solid';

export interface DropdownItem {
  label?: string;
  icon: string | IconifyIcon;
  onClick: () => void;
}

export interface DropdownHeader {
  label: string;
  show?: boolean;
}

export interface DropdownDivider {
  type: 'divider';
}
