/*import { createSignal, createEffect, onCleanup } from 'solid-js';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-http';

import '../styles/markdown.css';

interface MarkdownViewerProps {
  content: string;
  typingSpeed?: number; // ms per character
}

export default function TypedMarkdownViewer(props: MarkdownViewerProps) {
  let containerRef: HTMLDivElement | undefined;
  const [typedHtml, setTypedHtml] = createSignal('');
  const speed = props.typingSpeed ?? 10;

  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }) => {
    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
    }
    return `<pre><code>${text}</code></pre>`;
  };

  marked.setOptions({ renderer });

  async function typeMarkdown(content: string) {
    const rawHtml = await marked.parse(content);
    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;

    const chars = temp.innerHTML.split('');
    let current = '';

    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      setTypedHtml(current);
      await new Promise((res) => setTimeout(res, speed));
    }

    // Final pass for language tags and copy buttons
    requestAnimationFrame(() => enhanceCodeBlocks());
  }

  function enhanceCodeBlocks() {
    if (!containerRef) return;
    const blocks = containerRef.querySelectorAll('pre');

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

  createEffect(() => {
    setTypedHtml('');
    typeMarkdown(props.content);
  });

  onCleanup(() => {
    if (containerRef) containerRef.innerHTML = '';
  });

  return (
    <div class="markdown-wrapper">
      <div
        class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans p-6"
        ref={(el) => (containerRef = el)}
        innerHTML={typedHtml()}
      />
    </div>
  );
}*/

import { createSignal, createEffect, onCleanup } from 'solid-js';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-http';

import '../styles/markdown.css';

interface MarkdownViewerProps {
  content: string;
  typingSpeed?: number; // ms per character
}

export default function TypedMarkdownViewer(props: MarkdownViewerProps) {
  let containerRef: HTMLDivElement | undefined;
  const speed = props.typingSpeed ?? 10;
  const [typedHtml, setTypedHtml] = createSignal('');

  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }) => {
    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
    }
    return `<pre><code>${text}</code></pre>`;
  };

  marked.setOptions({ renderer });

  async function typeMarkdown(markdown: string) {
    const fullHtml = await marked.parse(markdown);
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullHtml, 'text/html');

    if (!containerRef) return;
    containerRef.innerHTML = ''; // clear

    let buffer = '';
    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

    const appendNode = (node: Node) => {
      if (!containerRef) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node as Text).textContent || '';
        buffer += text;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        if (['IMG', 'VIDEO'].includes(el.tagName)) {
          // Flush buffer
          if (buffer.length > 0) {
            const temp = document.createElement('div');
            temp.innerHTML = buffer;
            [...temp.childNodes].forEach((n) => containerRef?.appendChild(n));
            buffer = '';
          }

          containerRef.appendChild(el.cloneNode(true));
        } else {
          buffer += el.outerHTML;
        }
      }
    };

    const nodes: Node[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) nodes.push(current);

    for (const node of nodes) {
      appendNode(node);
      if (node.nodeType === Node.TEXT_NODE) {
        await new Promise((res) => setTimeout(res, speed));
        setTypedHtml(containerRef.innerHTML);
      }
    }

    // Final flush
    if (buffer.length > 0) {
      const temp = document.createElement('div');
      temp.innerHTML = buffer;
      [...temp.childNodes].forEach((n) => containerRef?.appendChild(n));
      buffer = '';
    }

    setTypedHtml(containerRef.innerHTML);
    requestAnimationFrame(() => enhanceCodeBlocks());
  }

  function enhanceCodeBlocks() {
    if (!containerRef) return;
    const blocks = containerRef.querySelectorAll('pre');

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

  createEffect(() => {
    typeMarkdown(props.content);
  });

  onCleanup(() => {
    if (containerRef) containerRef.innerHTML = '';
  });

  return (
    <div class="markdown-wrapper">
      <div
        class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans p-6"
        ref={(el) => (containerRef = el)}
        innerHTML={typedHtml()}
      />
    </div>
  );
}
