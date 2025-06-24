// src/components/pagess/PageHeader.tsx

interface PageHeaderProps {
  title: string;
  subTitle?: string;
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div class="pb-2">
      <h1 class="text-2xl capitalize">{props.title}</h1>
      <p class="text-gray-700">{props.subTitle}</p>
    </div>
  );
};

export default PageHeader;
