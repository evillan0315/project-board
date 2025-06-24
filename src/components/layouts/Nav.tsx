import { For, Show } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';
import { menus } from '../../data/menus';
import AvatarMenu from '../../components/ui/AvatarMenu';
import { AnimatedThemeToggle } from '../ThemeToggle';

import { useNavigate, useLocation, A } from '@solidjs/router';

export default function Nav() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav class="">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          {/* Mobile menu button (placeholder for future expansion) */}
          <div class="flex lg:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
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

          {/* Navigation links */}
          <div class="hidden lg:flex lg:items-center text-sm lg:gap-x-8 uppercase tracking-widest font-light text-shadow-2xs ">
            <Show when={isAuthenticated()}>
              <>
                <A
                  href="/dashboard"
                  class={`transition-colors ${isActive('/dashboard') ? 'text-sky-500 font-medium' : ''}`}
                >
                  Dashboard
                </A>
                <For each={menus}>
                  {(menu) =>
                    menu.show && (
                      <A
                        href={`/${menu.slug}`}
                        class={`transition-colors ${isActive(`/${menu.slug}`) ? 'text-sky-500 font-medium' : ''}`}
                        title={menu.title}
                      >
                        {menu.title}
                      </A>
                    )
                  }
                </For>
              </>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
