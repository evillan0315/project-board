// src/components/pages/DynamicPage.tsx
import Page from './Page';
import PageSection from './PageSection';

interface DynamicPageProps {
  title: string;
  subTitle?: string;
}

export default function DynamicPage({ title, subTitle }: DynamicPageProps) {
  return (
    <Page title={title} subTitle={subTitle}>
      <PageSection
        title={`Hero Section - ${title}`}
        subTitle={`${subTitle}`}
        content={`Welcome to the ${title} page.`}
      />
      <PageSection
        title="Featured Section"
        subTitle="Highlights and key features."
        content={`Here are some featured items on the ${title} page.`}
      />
    </Page>
  );
}
