// src/components/layouts/Header.tsx
import Nav from './Nav';
import MobileNav from './MobileNav';
import type { MenuItem } from "./types";
import { company } from '../../data/app';
import Logo from '../Logo';

export default function Header() {

  return (
    <header class="sticky top-0 z-50 py-1 h-10 flex items-center justify-between px-4 border-b text-white dark:bg-gray-900 bg-gray-100  dark:border-gray-800">
    <div class="flex align-center justify-center gap-x-4">
      <Logo name={company.name} />
  
      </div>
      <nav class="hidden md:flex">
        <Nav />
      </nav>
      <div class="md:hidden">
        <MobileNav />
      </div>
    </header>
  );
}
