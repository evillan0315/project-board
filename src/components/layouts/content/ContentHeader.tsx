// src/components/layouts/content/ContentHeader.tsx
interface ContentHeaderProps {
  title: string;
  subTitle?: string;
}

const ContentHeader = ({ title, subTitle }: ContentHeaderProps) => {
  return (
    <header class="mb-4 pb-2">
      <h1 class="text-2xl font-semibold">{title}</h1>
      {subTitle && <p class="text-sm text-gray-600">{subTitle}</p>}
    </header>
  );
};

export default ContentHeader;
