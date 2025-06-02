// src/components/docs/DocPageList.tsx
import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { getDocSlugs } from '../../utils/docs';

export default function DocPageList() {
  const slugs = getDocSlugs();

  return (
    <div class="p-6 max-w-3xl">
      <h1 class="text-2xl font-bold mb-4">Documentations</h1>
      <ul class="space-y-2">
        <For each={slugs}>
          {(slug) => (
            <li>
              <A href={`/docs/${slug}`} class="text-blue-600 hover:underline">
                {slug}
              </A>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
