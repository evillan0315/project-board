/**
 * Attach a click outside handler to a target element.
 *
 * @param target - The target HTMLElement or a function returning the element.
 * @param handler - The function to call when a click outside is detected.
 * @returns A function to remove the event listener.
 */
export function onClickOutside(
  target: HTMLElement | (() => HTMLElement | null),
  handler: (event: MouseEvent) => void,
): () => void {
  const getElement = (): HTMLElement | null => (typeof target === 'function' ? target() : target);

  const handleClickOutside = (event: MouseEvent) => {
    const el = getElement();
    if (!el) return;
    if (!el.contains(event.target as Node)) {
      handler(event);
    }
  };

  document.addEventListener('click', handleClickOutside);

  // Return a cleanup function
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}
