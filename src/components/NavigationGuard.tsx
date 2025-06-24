import { onMount, onCleanup } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { editorUnsaved } from '../stores/editorContent';
import { useNavigate } from '@solidjs/router'; // if you're using Solid Router

export default function NavigationGuard() {
  const $unsaved = useStore(editorUnsaved);
  const navigate = useNavigate();

  const confirmLeave = (e: BeforeUnloadEvent) => {
    if ($unsaved()) {
      e.preventDefault();
      e.returnValue = ''; // required for some browsers
    }
  };

  const confirmRouteChange = (to: string, from: string) => {
    if ($unsaved() && !confirm(`You have unsaved changes. Are you sure you want to leave this page?`)) {
      // Prevent navigation
      return false;
    }
    return true;
  };

  onMount(() => {
    window.addEventListener('beforeunload', confirmLeave);

    // Solid Router doesn't have a built-in navigation guard, so you can patch navigate
    const originalNavigate = navigate;
    const wrappedNavigate = (to: string, options?: any) => {
      if ($unsaved()) {
        if (!confirm(`You have unsaved changes. Are you sure you want to leave this page?`)) {
          return;
        }
      }
      originalNavigate(to, options);
    };

    (navigate as any).__wrapped = wrappedNavigate; // Mark that we wrapped

    // You can optionally override navigate globally or pass this handler to buttons/links
  });

  onCleanup(() => {
    window.removeEventListener('beforeunload', confirmLeave);
  });

  return null; // This is a headless component; it just attaches listeners
}
