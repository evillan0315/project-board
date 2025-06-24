// src/components/layouts/content/ContentLayout.tsx
import type { JSX } from 'solid-js';
import Content from './Content';
import ContentHeader from './ContentHeader';

interface ContentLayoutProps {
  content: JSX.Element;
  header?: { title: string; subTitle?: string } | JSX.Element;
  classNames?: string;
}

export default function ContentLayout({ content, header, classNames = '' }: ContentLayoutProps) {
  return (
    <div class={`flex flex-1 ${classNames}`}>
      <LeftSidebar />
      <Content />
      <RightSidebar />
    </div>
  );
}
