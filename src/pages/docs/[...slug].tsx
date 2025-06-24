import { useParams } from '@solidjs/router';
import { createResource, Show } from 'solid-js';
import { getDocContent } from '../../utils/docs';
import { marked } from 'marked';

interface DocContent {
  title: string;
  body: string;
}

async function fetchDocContent(slugArray: string[]): Promise<DocContent> {
  const slug = slugArray.join('/');

  try {
    const response = await fetch(`https://board-api.duckdns.org/docs/${slug}`);
    if (response.ok) {
      const raw = await response.text();
      const titleMatch = raw.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : slug;
      const bodyMarkdown = raw.replace(/^# .+$/m, '').trim();
      const html = await marked.parse(bodyMarkdown);
      return { title, body: html };
    }
  } catch (error) {
    console.warn('External fetch failed:', error);
  }

  const raw = getDocContent(slug);
  const titleMatch = raw?.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;
  const bodyMarkdown = raw?.replace(/^# .+$/m, '').trim() || '';
  const html = await marked.parse(bodyMarkdown);
  return { title, body: html };
}

export default function DocsPage() {
  const params = useParams(); // reactive
  const [doc] = createResource(() => {
    // recompute slugArray reactively
    return typeof params.slug === 'string' ? params.slug.split('/') : [];
  }, fetchDocContent);

  return (
    <main class="p-6 max-w-3xl mx-auto">
      <Show when={doc()} fallback={<p>Loading...</p>}>
        {(content) => (
          <>
            <h1 class="text-3xl mb-4">{content().title}</h1>
            <article class="prose" innerHTML={content().body} />
          </>
        )}
      </Show>
    </main>
  );
}
