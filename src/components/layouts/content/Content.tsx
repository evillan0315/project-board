// src/components/layouts/content/Content.tsx
import type { JSX } from 'solid-js';

interface ContentProps {
  content: JSX.Element;
  classNames?: string;
}

export default function Content({ content, classNames = '' }: ContentProps) {
  return <div class={`flex-grow overflow-auto ${classNames}`}>{content}</div>;
}
