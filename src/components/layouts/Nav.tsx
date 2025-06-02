import { For, Show } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';
import { menus } from '../../data/menus';
import ThemeToggle from '../ThemeToggle';
import { useNavigate, useLocation } from '@solidjs/router';

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // ← Navigate to login after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav class="flex items-center justify-between p-6 lg:px-2" aria-label="Global">
      {/* Mobile menu button */}
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
          <span class="sr-only">Open main menu</span>
          <svg
            class="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      {/* Desktop menu links */}
      <div class="hidden lg:flex lg:gap-x-10">
        <Show when={isAuthenticated()}>
          <a href={`/dashboard`} class="text-md leading-6 text-white" title="Dashboard">
            Dashboard
          </a>
        </Show>
        <For each={menus}>
          {(menu) => (
            <Show when={menu.show}>
              <a href={`/${menu.slug}`} class="text-md leading-6" title={menu.title}>
                {menu.title}
              </a>
            </Show>
          )}
        </For>
      </div>
      {/* Right-side controls: login/logout and theme toggle */}
      <Show
        when={isAuthenticated()}
        fallback={
          <Show when={!isLoginPage}>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end pl-8 items-center gap-4">
              <a
                href="/login"
                class="outline outline-offset-2 outline-sky-500 focus:outline-2 leading-6 bg-sky-400 rounded-sm px-4"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Show>
        }
      >
        <div class="hidden lg:flex lg:flex-1 lg:justify-end pl-8 items-center space-x-4">
          <span class="">Welcome, {user().name || 'User'}</span>
          <button onClick={handleLogout} class="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm">
            Logout
          </button>
        </div>
      </Show>
      <ThemeToggle /> {/* ✅ Theme toggle added */}
    </nav>
  );
}
