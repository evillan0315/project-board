import { createSignal, Show, onMount } from 'solid-js';
import { transpileSolidToJs } from './utils/solidTranspiler';
import EditorWithToolbar from './EditorWithToolbar';
const DualCodeEditor = () => {
  const [solidCode, setSolidCode] = createSignal(`
import { render } from "solid-js/web";
import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(1);
  const increment = () => setCount(count => count + 1);

  return (
    <button type="button" onClick={increment}>
      {count()}
    </button>
  );
}

render(() => <Counter />, document.getElementById("root")!);
 `);
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

  // 👉 Run once when mounted
  onMount(() => {
    handleBuild();
  });
  const iframeSrcDoc = `
  <!doctype html><html>  <head>    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>  </head>  <body>    <h1 class="text-3xl font-bold underline">      Hello world!    </h1> <div id="root"></div> <script type="module">
      import { template as _$template } from "solid-js/web";
import { delegateEvents as _$delegateEvents } from "solid-js/web";
import { createComponent as _$createComponent } from "solid-js/web";
import { insert as _$insert } from "solid-js/web";
var _tmpl$ = /*#__PURE__*/_$template('<button type=button>');
import { render } from "solid-js/web";
import { createSignal } from "solid-js";
function Counter() {
  const [count, setCount] = createSignal(1);
  const increment = () => setCount(count => count + 1);
  return (() => {
    var _el$ = _tmpl$();
    _el$.$$click = increment;
    _$insert(_el$, count);
    return _el$;
  })();
}
render(() => _$createComponent(Counter, {}), document.getElementById("root"));
_$delegateEvents(["click"]);
    </script></body></html>
  
`;
  return (
    <div class="grid grid-cols-2 gap-4 h-full relative">
      <EditorWithToolbar
        code={solidCode}
        setCode={setSolidCode}
        onAction={handleBuild}
        actionIcon="▶"
        actionLabel="Build"
      />
      <EditorWithToolbar
        code={jsCode}
        setCode={setJsCode}
        onAction={() => setShowPreview(true)}
        actionIcon="👁"
        actionLabel="Preview"
        readOnly
      />
      <Show when={showPreview()}>
        <iframe class="absolute top-0 left-0 w-full h-full z-160 bg-gray-500" srcDoc={iframeSrcDoc} />

        <button class="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded" onClick={() => setShowPreview(false)}>
          Close Preview
        </button>
      </Show>
    </div>
  );
};
export default DualCodeEditor;
