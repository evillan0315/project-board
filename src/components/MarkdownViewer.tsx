import { createEffect, onCleanup } from 'solid-js';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-http';

import '../styles/markdown.css';

interface MarkdownViewerProps {
  content: string;
}
interface Code {
  text: string;
  lang: string | undefined;
  escaped?: boolean;
}
export default function MarkdownViewer(props: MarkdownViewerProps) {
  let container: HTMLDivElement | undefined;

  const renderer = new marked.Renderer();

  renderer.code = ({ text, lang, escaped }): string => {
    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
    }
    return `<pre><code>${text}</code></pre>`;
  };

  marked.setOptions({ renderer });

  createEffect(async () => {
    if (container) {
      container.innerHTML = '';

      const html = await marked.parse(props.content);
      container.innerHTML = html;

      const blocks = container.querySelectorAll('pre');

      blocks.forEach((block) => {
        const code = block.querySelector('code');
        if (!code || block.parentElement?.classList.contains('markdown-wrapper')) return;

        const langClass = code.className.match(/language-(\w+)/);
        const lang = langClass ? langClass[1] : '';

        const langMap: Record<string, string> = {
          js: 'JavaScript',
          ts: 'TypeScript',
          py: 'Python',
          sh: 'Shell',
          bash: 'Bash',
          http: 'Http',
          html: 'HTML',
          css: 'CSS',
          json: 'JSON',
          yaml: 'YAML',
        };

        const displayLang = langMap[lang] || (lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : '');

        const wrapper = document.createElement('div');
        wrapper.className = 'relative group my-4';

        const langTag = document.createElement('div');
        langTag.textContent = displayLang;
        langTag.className =
          'absolute top-0 left-0 bg-sky-600 text-sm font-bold px-2 py-1 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-150';

        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.title = 'Copy code';
        copyButton.className =
          'absolute top-0 right-0 p-1 text-sm rounded-bl-md bg-sky-500 hover:bg-sky-600 hover:text-white transition-opacity opacity-0 group-hover:opacity-100';

        copyButton.addEventListener('click', () => {
          const text = code.innerText;
          if (text) {
            navigator.clipboard.writeText(text);
            copyButton.textContent = '✅';
            setTimeout(() => (copyButton.textContent = '📋'), 1000);
          }
        });

        const cloned = block.cloneNode(true);
        wrapper.appendChild(langTag);
        wrapper.appendChild(copyButton);
        wrapper.appendChild(cloned);
        block.replaceWith(wrapper);
      });
    }
  });

  onCleanup(() => {
    if (container) container.innerHTML = '';
  });

  return (
    <div class="markdown-wrapper">
      <div
        class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans p-6"
        ref={(el) => (container = el)}
      />
    </div>
  );
}
