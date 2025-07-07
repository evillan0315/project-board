import Nav from './Nav';
import MobileNav from './MobileNav';
import type { MenuItem } from './types';
import { company } from '../../data/app';
import Logo from '../Logo';
import AvatarMenu from '../ui/AvatarMenu';
import { ThemeToggle } from '../ThemeToggle';
import { Icon } from '@iconify-icon/solid';
import { Button } from '../ui/Button';
import { openSettings } from '../../stores/settings';

export default function Header() {
  return (
    <header class="fixed sticky top-0 flex items-center h-12 px-2 justify-between shadow-lg border-b py-1 z-50">
      <div class="flex items-center justify-center">
        <div class="flex-1 align-center">
          <Logo name={company.name} />
        </div>
        <nav class="hidden md:flex">
          <Nav />
        </nav>
      </div>

      <div class="md:hidden">
        <MobileNav />
      </div>

      <div class="flex items-center justify-between gap-x-4">
        <ThemeToggle />

        <Button
          variant="secondary"
          class="p-1 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          onClick={() => openSettings('General')}
        >
          <Icon icon="mdi:cog-outline" width="1.2em" height="1.2em" />
        </Button>

        <AvatarMenu />
      </div>
    </header>
  );
}
