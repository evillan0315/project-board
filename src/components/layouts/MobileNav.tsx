// src/components/layouts/MobileNav.tsx
import { For, Show } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';
import { menus } from '../../data/menus';
import { company } from '../../data/app';
import Logo from '../Logo';

const MobileNav = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div class="lg:hidden" role="dialog" aria-modal="true">
      <div class="fixed inset-0 z-50"></div>
      <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <Logo name={company.name} logo={company.logo} />
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
            <span class="sr-only">Close menu</span>
            <svg
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <For each={menus}>
                {(menu) => (
                  <Show when={menu.show}>
                    <a
                      href={menu.slug === 'home' ? '/' : `/${menu.slug}`}
                      title={menu.title}
                      class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {menu.title}
                    </a>
                  </Show>
                )}
              </For>
            </div>

            <Show when={!isAuthenticated()}>
              <div class="py-6">
                <a
                  href="/login"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
