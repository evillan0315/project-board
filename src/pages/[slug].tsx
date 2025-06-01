// src/pages/[slug].tsx
import { useParams } from '@solidjs/router';

interface Page {
  title: string;
  body: string;
}
export default function Page() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <main class="p-4">
      <h1 class="text-2xl">Page: {slug}</h1>
    </main>
  );
}
