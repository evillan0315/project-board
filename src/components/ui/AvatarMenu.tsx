import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';
import { A, useNavigate } from '@solidjs/router';
import { Button } from './Button';

export default function AvatarMenu() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = createSignal(false);
  let menuRef: HTMLDivElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => document.addEventListener('mousedown', handleClickOutside));
  onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));

  const handleLogout = async () => {
    await auth.logout();
    setIsOpen(false);
    navigate('/login');
  };

  const getInitial = () => (auth.user()?.name || auth.user()?.email || 'U')[0].toUpperCase();

  return (
    <Show
      when={auth.isAuthenticated()}
      fallback={
        <A href="/login" class="no-underline">
          <Button variant="primary">Login</Button>
        </A>
      }
    >
      <div class="relative flex items-center">
        <Show
          when={auth.user()?.image}
          fallback={
            <>
              <Button variant="secondary">{getInitial()}</Button>
            </>
          }
        >
          <Button
            variant="secondary"
            onClick={() => setIsOpen((prev) => !prev)}
            class="h-8 w-8 btn-icon border-none hover:bg-transparent hover:bg-transparent p-0"
          >
            <img
              src={`${import.meta.env.BASE_URL_API}/api/file/proxy?url=${encodeURIComponent(auth.user()?.image ?? '')}`}
              alt="Profile"
              class="rounded-xl h-full w-full object-cover outline-2 outline-offset-2 outline-gray-500 "
            />
          </Button>
        </Show>

        <Show when={isOpen()}>
          <div
            ref={menuRef}
            class="dropdown-menu absolute top-9 right-0 z-50 mt-2 w-48 origin-top-right rounded-md p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <A
              href="/profile"
              class="block w-full px-4 py-2 text-left text-sm rounded-md"
              onClick={() => setIsOpen(false)}
            >
              View Profile
            </A>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </Show>
      </div>
    </Show>
  );
}
