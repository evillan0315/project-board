# SolidJSCode previewer and builder

---

## 📝 **Feature Requirements**

✅ Left CodeMirror:

* SolidJS code editor
* A button (e.g., 🔨 build icon)
* When clicked → transpiles SolidJS to JavaScript
* Updates the Right CodeMirror with build output

✅ Right CodeMirror:

* Read-only JS code output
* A button to **preview the code as a webpage**

✅ Optional: Inline iframe or modal to render the preview

---

## 🏗 **Recommended Structure**

### Components

* `<EditorWithToolbar />` → wraps `EditorComponent` + build/preview button
* `<DualCodeEditor />` → renders left + right editors
* `useCodeMirror` hook as refactored previously

### Signals (per instance)

* `solidCode`, `setSolidCode` → content for left editor
* `jsCode`, `setJsCode` → content for right editor

---

## 🚀 **Implementation Sketch**

### 1️⃣ DualCodeEditor Component

```tsx
import { createSignal, Show } from 'solid-js';
import { transpileSolidToJs } from '../../utils/solidTranspiler'; // You will implement this (or use sucrase, esbuild, or Babel)
import EditorWithToolbar from './EditorWithToolbar';

const DualCodeEditor = () => {
  const [solidCode, setSolidCode] = createSignal('<div>Hello SolidJS</div>');
  const [jsCode, setJsCode] = createSignal('');
  const [showPreview, setShowPreview] = createSignal(false);

  const handleBuild = () => {
    try {
      const output = transpileSolidToJs(solidCode());
      setJsCode(output);
    } catch (e) {
      console.error('Build error:', e);
      setJsCode(`// Build failed: ${e}`);
    }
  };

  return (
    <div class="grid grid-cols-2 gap-4 h-full">
      <EditorWithToolbar
        code={solidCode}
        setCode={setSolidCode}
        onAction={handleBuild}
        actionIcon="🔨"
        actionLabel="Build"
      />

      <EditorWithToolbar
        code={jsCode}
        setCode={setJsCode}
        readOnly
        onAction={() => setShowPreview(true)}
        actionIcon="👁️"
        actionLabel="Preview"
      />

      <Show when={showPreview()}>
        <iframe
          class="absolute top-0 left-0 w-full h-full bg-white"
          srcDoc={`
            <html>
              <body>${jsCode()}</body>
              <script type="module">${jsCode()}</script>
            </html>
          `}
        />
        <button
          class="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded"
          onClick={() => setShowPreview(false)}
        >
          Close Preview
        </button>
      </Show>
    </div>
  );
};
export default DualCodeEditor;
```

---

### 2️⃣ EditorWithToolbar Component

```tsx
import { Component } from 'solid-js';
import EditorComponent from './EditorComponent';

type Props = {
  code: () => string;
  setCode: (code: string) => void;
  onAction: () => void;
  actionIcon: string;
  actionLabel: string;
  readOnly?: boolean;
};

const EditorWithToolbar: Component<Props> = (props) => {
  return (
    <div class="relative h-full border rounded shadow">
      <div class="absolute top-2 right-2 z-10">
        <button
          class="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={props.onAction}
          title={props.actionLabel}
        >
          {props.actionIcon}
        </button>
      </div>
      <EditorComponent
        content={props.code}
        filePath={() => ''} // no filePath needed
        onChange={props.setCode}
        readOnly={props.readOnly}
      />
    </div>
  );
};
export default EditorWithToolbar;
```

---

### 3️⃣ Transpile Utility (simplified example)

```ts
// utils/solidTranspiler.ts
import { transform } from 'sucrase';

export function transpileSolidToJs(code: string): string {
  const result = transform(code, {
    transforms: ['jsx', 'typescript'],
    production: true,
  });
  return result.code;
}
```

> ✅ *Note: Sucrase is fast for JSX+TS. If you need Solid-specific transforms, consider using Babel or esbuild.*

---

### 4️⃣ Update EditorComponent

Refactor it to support `readOnly` prop (add `EditorView.editable.of(false)` if readOnly). I can prepare that update too if you want.

---

## ✨ **Final Outcome**

✅ Left editor writes SolidJS → click build
✅ Right editor shows built JS → click preview
✅ Live preview runs the code
✅ Fully dynamic, supports multiple editors

---

## 📌 **Next steps**

Would you like me to:

* provide the full `EditorComponent` code with `readOnly` support?
* provide CSS refinements for the layout / iframe?
* assist with bundling (e.g. use esbuild or Babel in-browser)?

Please confirm, and I’ll produce a complete, polished solution!

