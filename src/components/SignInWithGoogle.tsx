import { createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

const BASE_URL = import.meta.env.BASE_URL;
const REDIRECT_URI = import.meta.env.GOOGLE_CALLBACK_URL;
const LOGIN_URI = '';
export default function SignInWithGoogle() {
  const [loginUrl, setLoginUrl] = createSignal('');

  onMount(() => {
    if (REDIRECT_URI) {
      setLoginUrl(`${REDIRECT_URI}`);
    }
  });

  return (
    <button
      onClick={() => loginUrl() && (window.location.href = loginUrl())}
      class="w-full flex items-center gap-2 justify-center p-3 text-white bg-neutral-900 rounded-md hover:bg-neutral-800 mt-4"
    >
      <Icon icon="flat-color-icons:google" width="20" height="20" /> Sign in with Google
    </button>
  );
}
