import { createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
//const BASE_URL = import.meta.env.BASE_URL;
const REDIRECT_URI = import.meta.env.GITHUB_CALLBACK_URL;

export default function SignInWithGithub() {
  const [loginUrl, setLoginUrl] = createSignal('');

  onMount(() => {
    if (REDIRECT_URI) {
      setLoginUrl(`${REDIRECT_URI}`);
    }
  });

  return (
    <Button
      onClick={() => loginUrl() && (window.location.href = loginUrl())}
      class="w-full flex gap-2 items-center justify-center p-3 text-white bg-gray-700 rounded-md hover:bg-gray-600 mt-4"
    >
      <Icon icon="mdi:github" width="24" class="text-gray-900" height="24" /> Sign in with Github
    </Button>
  );
}
