// src/components/pages/PageSection.tsx
interface PageSectionProps {
  title?: string;
  subTitle?: string;
  content: string;
}

export default function PageSection({ title, subTitle, content }: PageSectionProps) {
  return (
    <section class="py-6 px-4">
      {title && <h2 class="text-xl mb-1">{title}</h2>}
      {subTitle && <p class="text-gray-600 italic mb-4">{subTitle}</p>}

      <div class="prose max-w-none">{content}</div>
    </section>
  );
}
