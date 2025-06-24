
```markdown
# MarkdownViewer Component Documentation

This document provides comprehensive documentation for the `MarkdownViewer` component, which renders Markdown content with syntax highlighting and copy-to-clipboard functionality for code blocks.

## Overview

The `MarkdownViewer` component leverages the `marked` library for parsing Markdown and `Prism.js` for syntax highlighting.  It enhances the standard Markdown rendering by adding a language tag and a copy button to each code block. It also handles cleanup when the component unmounts.

## Imports

```typescript
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
```

*   `createEffect` and `onCleanup` from `solid-js`: Used for managing side effects and cleanup within the SolidJS component.
*   `marked` from `marked`:  The Markdown parsing library.
*   `Prism` from `prismjs`: The syntax highlighting library.
*   `prismjs/components/...`: Imports specific language support for Prism.js.  These are necessary to enable syntax highlighting for the desired languages.
*   `../styles/markdown.css`: Imports custom styles for the Markdown viewer.

## Props

```typescript
interface MarkdownViewerProps {
  content: string;
}
```

*   `content`:  A string containing the Markdown content to be rendered.

## Component Definition

```typescript
export default function MarkdownViewer(props: MarkdownViewerProps) {
  // ... component logic ...
}
```

The `MarkdownViewer` function is the main component.  It accepts the `props` defined above.

## Internal State

```typescript
let container: HTMLDivElement | undefined;
```

*   `container`: A reference to the `div` element where the Markdown content will be rendered.  It is initialized as `undefined` and assigned using the `ref` attribute in the JSX.

## Marked Renderer

```typescript
const renderer = new marked.Renderer();

renderer.code = ({ text, lang, escaped }): string => {
  if (lang && Prism.languages[lang]) {
    const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
    return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
  }
  return `<pre><code>${text}</code></pre>`;
};

marked.setOptions({ renderer });
```

This section customizes the `marked` renderer to use `Prism.js` for syntax highlighting within code blocks.

*   A new `marked.Renderer` instance is created.
*   The `renderer.code` function is overridden to handle code block rendering:
    *   If a language (`lang`) is specified and Prism.js supports it, the code is highlighted using `Prism.highlight`.
    *   If no language is specified or Prism.js doesn't support it, the code is rendered without highlighting.
*   `marked.setOptions({ renderer })` sets the custom renderer as the default for `marked`.

## `createEffect` Hook

```typescript
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
```

This `createEffect` hook is responsible for rendering the Markdown content and adding the language tag and copy button to each code block.

1.  **Conditional Execution:** It first checks if the `container` element exists. If not, the effect does nothing.
2.  **Clearing Previous Content:**  It clears the inner HTML of the `container` to remove any previously rendered content.
3.  **Parsing Markdown:** It uses `marked.parse` to convert the Markdown content into HTML.
4.  **Setting HTML:**  It sets the `innerHTML` of the `container` to the generated HTML.
5.  **Finding Code Blocks:** It queries the `container` for all `pre` elements (code blocks).
6.  **Iterating Through Code Blocks:** It iterates through each code block:
    *   It retrieves the `code` element within the `pre` element.
    *   It checks if a `code` element exists and if the parent element has class `markdown-wrapper`. If any of these conditions are true the iteration continues to the next block.
    *   **Extracting Language:** It extracts the language from the `code` element's class name (e.g., `language-javascript`).
    *   **Mapping Language Names:** It uses a `langMap` to map language codes (e.g., `js`) to display names (e.g., `JavaScript`).
    *   **Creating Wrapper:** It creates a wrapper `div` element with classes for styling.
    *   **Creating Language Tag:** It creates a `div` element for the language tag, setting its text content and class names.
    *   **Creating Copy Button:** It creates a `button` element for the copy button, setting its text content, title, and class names.
    *   **Copy Button Event Listener:** It attaches a click event listener to the copy button:
        *   When clicked, it copies the code block's text to the clipboard using `navigator.clipboard.writeText`.
        *   It updates the button's text to "✅" to indicate success and then resets it to "📋" after a short delay.
    *   **Cloning and Appending elements:** The code block is cloned and the language tag, copy button and clone are appended to the wrapper div.
    *   **Replacing the original block:** The original code block is replaced with the new wrapper div.

## `onCleanup` Hook

```typescript
onCleanup(() => {
  if (container) container.innerHTML = '';
});
```

This `onCleanup` hook ensures that the `container`'s content is cleared when the component unmounts, preventing memory leaks and potential issues with SolidJS's reactivity.

## JSX

```typescript
return (
  <div class="markdown-wrapper">
    <div
      class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans p-6"
      ref={(el) => (container = el)}
    />
  </div>
);
```

*   The component renders a `div` with the class `markdown-wrapper` that wraps the markdown content.
*   Inside the wrapper, a `div` with `prose` classes is used. The prose classes come from `typography.js/tailwindcss-typography` and apply default styles to the rendered markdown.
*   The `ref` attribute is used to assign the `HTMLDivElement` to the `container` variable, allowing the component to access and manipulate the DOM element.

## Usage Example

```typescript
import MarkdownViewer from './MarkdownViewer';

function MyComponent() {
  const markdownContent = `
# Hello, world!

\`\`\`javascript
console.log("Hello from JavaScript!");
\`\`\`
`;

  return (
    <div>
      <MarkdownViewer content={markdownContent} />
    </div>
  );
}
```

This example demonstrates how to use the `MarkdownViewer` component within another SolidJS component.  The `markdownContent` variable holds the Markdown string, which is passed as the `content` prop to the `MarkdownViewer` component.

## Dependencies

*   `solid-js`
*   `marked`
*   `prismjs`
*   `prismjs/components/...` (for specific languages)
*   `tailwindcss` (For the `prose` classes in the JSX)
*   `markdown.css` (Custom Stylesheet)

## Customization

*   **Styling:**  The appearance of the Markdown viewer can be customized by modifying the `markdown.css` file and the CSS classes used in the JSX.
*   **Supported Languages:**  The languages supported for syntax highlighting can be extended by importing additional language components from `prismjs/components/`.
*   **Renderer Options:** The behavior of the `marked` renderer can be further customized by setting additional options in `marked.setOptions`.

## Notes

*   Ensure that the necessary Prism.js language components are imported for the languages you want to support.
*   The `markdown.css` file should contain styles to properly render the Markdown content and style the language tag and copy button.
*   The component relies on `navigator.clipboard.writeText` for the copy-to-clipboard functionality, which may not be supported in all browsers or environments.
```
