import { createSignal, Show, For, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../contexts/AuthContext';
import { SolidApexCharts } from 'solid-apexcharts';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';

import MetricCard from '../components/MetricCard';
import { theme } from '../stores/theme';
import Typewriter from '../components/Typewriter';
import { PageHeader } from '../components/ui/PageHeader';
import { getThemeExtension } from '../utils/editorTheme';
import DashboardPanel from '../components/DashboardPanel';
import ReadFileForm from '../components/ReadFileForm';
import SchemaManager from '../components/SchemaManager';
import IconManager from '../components/IconManager';
import Transcoder from '../components/Transcoder';
export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const codeWriter = `import {
  createEffect,
  onMount,
  onCleanup,
  Show,
} from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { editorOpenTabs } from '../stores/editorContent';
import { theme } from '../stores/theme';
import { useEditorFile } from '../hooks/useEditorFile';
import { undoEdit, redoEdit } from '../utils/editorUndoRedo';
import { getThemeExtension } from '../utils/editorTheme';
import { detectLanguage } from '../utils/editorLanguage';
import { EditorView, basicSetup } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';
import Typewriter from './Typewriter';

type EditorComponentProps = {
  content?: string;
  filePath: string;
  onSave?: () => void;
  onChange?: (content: string) => void;
  onLoadContent?: (content: string) => void;
};

const EditorComponent = (props: EditorComponentProps) => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const $theme = useStore(theme);
  const $openTabs = useStore(editorOpenTabs);
  const themeCompartment = new Compartment();

  const {
    content,
    setContent,
    loading,
    loadingMessage,
    saveFile,
  } = useEditorFile(
    props.filePath,
    (loadedContent) => {
      console.log(props.filePath, 'EditorComponent loaded');
      if ($openTabs().includes(props.filePath)) {
        initTypewriter(loadedContent);
        props.onLoadContent?.(loadedContent);
      }
    },
    props.onSave
  );

  const initTypewriter = (code: string) => {
    editorView?.destroy();
    editorView = null;

    // Render the typewriter component into the container
    if (editorContainer) {
      editorContainer.innerHTML = ''; // Clear previous editor if any
      const typewriterEl = document.createElement('div');
      typewriterEl.style.height = '100%';
      typewriterEl.style.width = '100%';
      typewriterEl.id = 'codemirror-container';
      editorContainer.appendChild(typewriterEl);

      // Typewriter handles creating the CodeMirror instance
      // Typewriter will create and manage its own editor view
    }
  };

  createEffect(() => {
    if (props.content) {
      initTypewriter(props.content);
    }

    if (!$openTabs().includes(props.filePath)) {
      editorView?.destroy();
      editorView = null;
    }
  });

  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension($theme())),
      });
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveFile();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoEdit();
    } else if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
    ) {
      e.preventDefault();
      redoEdit();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      editorView?.destroy();
      window.removeEventListener('keydown', handleKeyDown);
    });
  });

  return (
    <div class="bg-gray-950 h-screen flex flex-col overflow-auto relative">
      <Show
        when={$openTabs().includes(props.filePath)}
        fallback={
          <div class="flex items-center justify-center text-gray-500 h-full">
            No file selected or file was closed.
          </div>
        }
      >
        <div ref={editorContainer!} class="h-full w-full">
          {/* We render Typewriter here directly */}
          <Typewriter
            text={content() || ''}
            typingSpeed={50}
            deleteSpeed={30}
            loop={false}
            delayBeforeTyping={300}
            delayBeforeDeleting={1000}
          />
        </div>
      </Show>
      <Show when={loading()}>
        <div class="fixed bottom-10 right-0 z-60">
          <div class="flex items-center justify-center text-sky-500 text-lg gap-2">
            <Icon icon="line-md:loading-twotone-loop" /> {loadingMessage()}
          </div>
        </div>
      </Show>
    </div>
  );
};

export default EditorComponent;
`;
  const [metrics] = createSignal([
    { label: 'Users Online', value: 23, icon: 'mdi:account' },
    { label: 'Server Load', value: '47%', icon: 'mdi:server' },
    { label: 'Active Jobs', value: 12, icon: 'tabler:briefcase' },
    { label: 'Errors Today', value: 0, icon: 'ic:baseline-error-outline' },
  ]);

  const [entries] = createSignal([
    {
      id: 1,
      title: 'System Status',
      content: 'All systems operational.',
      timestamp: '2025-05-30 09:00',
    },
    {
      id: 2,
      title: 'User Activity',
      content: '15 users logged in within the last hour.',
      timestamp: '2025-05-30 08:45',
    },
    {
      id: 3,
      title: 'Error Logs',
      content: '0 critical errors reported today.',
      timestamp: '2025-05-30 08:30',
    },
  ]);

  onMount(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <div class="flex-1 h-full overflow-auto">
      <Show when={isAuthenticated()}>
        <div class="flex flex-col  max-w-7xl mx-auto">
          <div class="flex-1 scroll-smooth py-4 space-y-4 mt-2">
            <PageHeader icon="mdi:view-dashboard">
              <h1 class="leading-0 uppercase tracking-widest text-2xl">
                <b>Dash</b>board
              </h1>
            </PageHeader>
            {/* Metrics Cards */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  mt-4">
              <For each={metrics()}>{(metric) => <MetricCard {...metric} />}</For>
            </div>
            <Transcoder />
            <div class="flex  items-start justify-between gap-2">
              <IconManager />
              <ReadFileForm />
            </div>
            <SchemaManager />
            <DashboardPanel />
            {/* Recent Entries */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <For each={entries()}>
                {(entry) => (
                  <div class="rounded-xl border dark:border-gray-900 p-4 mt-2 shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                      <h2 class="font-semibold text-xl text-sky-500">{entry.title}</h2>
                      <span class="text-xs text-muted">{entry.timestamp}</span>
                    </div>
                    <p>{entry.content}</p>
                  </div>
                )}
              </For>

              <div class="typewriter-code-wrapper h-auto max-w-4xl mx-auto flex items-center my-10 border rounded-xl relative">
                <div class="absolute top-4 left-8">
                  <span class="flex items-center justify-center gap-3">
                    <Icon
                      icon="mdi:circle"
                      width="1em"
                      height="1em"
                      class="text-gray-950 shadow-sky-500 rounded-full shadow-lg"
                    />
                    <Icon
                      icon="mdi:circle"
                      width="1em"
                      height="1em"
                      class="text-sky-700 bg-sky-700 border border-gray-800 shadow-sky-500 rounded-full shadow-lg"
                    />
                    <Icon
                      icon="mdi:circle"
                      width="1em"
                      height="1em"
                      class="text-red-500 bg-red-500 border border-gray-600 shadow-sky-500 rounded-full shadow-lg"
                    />
                  </span>
                </div>
              </div>
              {/* Applications Section */}
              <div class="grid grid-cols-1 px-4 mt-4">
                <h2 class="leading-0 uppercase tracking-widest text-xl mt-6 mb-10">
                  <b>App</b>lications
                </h2>
                <div class="flex space-x-6">
                  {/* Editor */}
                  <Button
                    icon="mdi:xml"
                    class="flex flex-col items-center justify-center p-4 rounded-2xl border dark:border-gray-900 shadow-md w-32 hover:bg-gray-700 hover:text-white transition"
                    onClick={() => (window.location.href = '/editor')}
                    aria-label="Open Editor"
                  >
                    Editor
                  </Button>

                  {/* TTS */}
                  <Button
                    icon="mdi:microphone-message"
                    class="flex flex-col items-center justify-center p-4 rounded-2xl border dark:border-gray-900 shadow-md w-32 hover:bg-gray-700 hover:text-white transition"
                    onClick={() => (window.location.href = '/tts')}
                    aria-label="Open Text To Speech"
                  >
                    TTS
                  </Button>

                  {/* Terminal */}
                  <button
                    class="flex flex-col items-center justify-center border dark:border-gray-900 p-4 rounded-2xl shadow-md w-32 hover:bg-gray-700 hover:text-white transition"
                    onClick={() => (window.location.href = '/terminal')}
                    aria-label="Open Terminal"
                  >
                    <Icon icon="mdi:console" width="50" height="50" class="text-sky-500 shrink-0" />
                    Terminal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
