import { type JSX, Show } from 'solid-js';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import ContentLayout from './content/ContentLayout';
import type { MenuItem } from './types';

interface LayoutProps {
  title: string;
  menus: MenuItem[];
  content: JSX.Element;
  leftSidebar?: boolean;
  rightSidebar?: boolean;
  footer?: boolean;
}

export default function Layout({
  title,
  menus,
  content,
  leftSidebar = false,
  rightSidebar = false,
  footer = true,
}: LayoutProps) {
  return (
    <div class="flex flex-col h-[calc(100vh)] overflow-hidden">
      <Header />

      <div class="flex flex-1 overflow-auto">
        <Show when={leftSidebar}>
          <LeftSidebar />
        </Show>
        <ContentLayout content={content} />
        <Show when={rightSidebar}>
          <RightSidebar />
        </Show>
      </div>

      <Show when={footer}>
        <Footer links={menus} />
      </Show>
    </div>
  );
}
