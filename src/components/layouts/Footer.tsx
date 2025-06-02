import { For, Show } from 'solid-js';
import { company } from '../../data/app';
import type { MenuItem } from "./types";

interface FooterProps {
  links: MenuItem[];
}

const Footer = (props: FooterProps) => {
  return (

      <footer class="sticky bottom-0 z-50 bg-gray-100 text-white py-1 flex gap-4 justify-between items-center border-t dark:border-gray-700 dark:bg-gray-900 px-4">
        
          <p>© 2025 {company.name}. All rights reserved.</p>
          <nav class="lg:flex lg:gap-x-12">

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
