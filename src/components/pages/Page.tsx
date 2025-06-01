// src/components/pages/Page.tsx
import type { JSX } from 'solid-js';
import PageHeader from './PageHeader';

interface PageProps {
  title: string;
  subTitle?: string;
  children?: JSX.Element;
}

export default function Page({ title, subTitle, children }: PageProps) {
  return (
    <div class="page-wrapper">
      <PageHeader title={title} subTitle={subTitle} />
      {children}
    </div>
  );
}
