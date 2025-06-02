import { For, Show } from 'solid-js';
import { company } from '../../data/app';
import type { MenuItem } from './types';

interface FooterProps {
  links: MenuItem[];
}

const Footer = (props: FooterProps) => {
  return (
    <footer class="sticky bottm-4 z-50 h-[2rem] flex items-center justify-start px-4 border-b text-white dark:bg-gray-900 bg-gray-100  dark:border-gray-800">
      <p>© 2025 {company.name}. All rights reserved.</p>
      <nav class="lg:flex lg:gap-x-6 ml-4">
        <For each={props.links}>
          {(link) => (
            <Show when={link.show}>
              <a
                class="hover:text-blue-600 dark:hover:text-blue-400"
                href={link.slug === 'home' ? '/' : `/${link.slug}`}
              >
                {link.title}
              </a>
            </Show>
          )}
        </For>
      </nav>
    </footer>
  );
};

export default Footer;
