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
      {header &&
        (typeof header === 'object' && 'title' in header ? (
          <ContentHeader title={header.title} subTitle={header.subTitle} />
        ) : (
          header
        ))}
      <Content content={content} />
    </div>
  );
}
