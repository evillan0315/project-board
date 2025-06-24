// Button variant classes using your Tailwind base layer design tokens
export function resolveVariantClasses(variant?: string, isIconOnly = false): string {
  if (isIconOnly && !variant) {
    return 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100';
  }

  switch (variant) {
    case 'primary':
      return 'bg-sky-500 text-gray-950 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700';
    case 'secondary':
      return 'bg-gray-700/10 text-sky-500 hover:bg-sky-500/50';
    case 'outline':
      return 'border border-gray-300 dark:border-gray-800 hover:border-sky-600';
    case 'error':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'info':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    case 'warning':
      return 'bg-orange-400 text-gray-900 hover:bg-orange-500 dark:text-gray-100';
    case 'success':
      return 'bg-green-500 text-white hover:bg-green-600';
    default:
      return isIconOnly
        ? 'text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300'
        : 'hover:text-sky-600 dark:hover:text-sky-400';
  }
}

export function resolveSizeClasses(size?: string): string {
  switch (size) {
    case 'sm':
      return 'text-md px-2 py-1 shadow-sm rounded-sm';
    case 'md':
      return 'text-base px-3 py-1.5 shadow rounded-md';
    case 'lg':
      return 'text-lg px-4 py-2 shadow-md rounded-lg';
    case 'xl':
      return 'text-xl px-5 py-3 shadow-lg rounded-full';
    default:
      return 'text-sm px-2 py-1 shadow-sm rounded-sm';
  }
}

export function resolveStateClasses(options: {
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
}): string {
  const classes: string[] = [];

  if (options.active) {
    classes.push('ring-2 ring-offset-2 ring-sky-400 dark:ring-sky-500');
  }

  if (options.selected) {
    classes.push('bg-sky-600 text-white dark:bg-sky-500');
  }

  if (options.disabled || options.loading) {
    classes.push('opacity-50 cursor-not-allowed');
  }

  return classes.join(' ');
}
