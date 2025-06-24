import { createSignal, createEffect, onCleanup, For } from 'solid-js';
import { useAuth } from '../contexts/AuthContext';
import FeatureCard from '../components/FeatureCard';
import Hero from '../components/Hero';
import { Icon } from '@iconify-icon/solid';
import { theme } from '../stores/theme';
import Typewriter from '../components/Typewriter';
import { getThemeExtension } from '../utils/editorTheme';
import CodeWriterPanel from '../components/CodeWriterPanel';
const ttsFeatures = [
  {
    icon: 'mdi:text-to-speech',
    title: 'Multilingual Input',
    description: 'Supports over 20 languages and regional accents using standardized language codes.',
  },
  {
    icon: 'mdi:account-voice',
    title: 'Custom Voice Profiles',
    description: 'Define multiple speakers with distinct voices and tones like Bright, Smooth, or Informative.',
  },
  {
    icon: 'mdi:music-note',
    title: 'Real-Time Playback',
    description: 'Instantly listen to generated speech and download high-quality audio files.',
  },
  {
    icon: 'mdi:form-textbox',
    title: 'Interactive Form',
    description: 'Dynamic speaker fields, inline validation, and easy-to-use controls built with SolidJS.',
  },
  {
    icon: 'mdi:api',
    title: 'API Powered',
    description: 'Backed by a robust REST API for reliable, scalable TTS generation and playback.',
  },
  {
    icon: 'mdi:progress-clock',
    title: 'Future Enhancements',
    description: 'Plans include WebSocket streaming, sample previews, and enhanced customization.',
  },
];
const benefits = [
  {
    icon: 'mdi:hand-okay',
    title: 'Easy to Use',
    description: 'Intuitive UI that helps you get started quickly without any hassle.',
  },
  {
    icon: 'mdi:secure',
    title: 'Secure & Reliable',
    description: 'Your data is protected with industry-leading security measures.',
  },
  {
    icon: 'mdi:focus-field',
    title: 'Customizable',
    description: 'Tailor the platform to your specific needs with flexible options.',
  },
  {
    icon: 'mdi:rocket-launch',
    title: 'Boost Productivity',
    description: 'Capture screens, record workflows, and generate code documentation with built-in AI tools.',
  },
];
const editor_features = [
  {
    id: '7d2f7e98-983c-4d6a-896a-43bb8a5d85c5',
    title: 'Integrated Code Editor',
    icon: 'mdi:file-code-outline',
    description: 'Edit your files with a fast, Monaco-based editor tailored for developers.',
    page: 'fa6bc7dc-23ad-4174-84c4-bdb65de0c230',
  },
  {
    id: '5971b870-98f4-4a7e-b9e2-e8d7de7d1fa4',
    title: 'Terminal Access',
    icon: 'mdi:console',
    description: 'Execute commands directly from a built-in terminal interface with real-time output.',
    page: '3e8b3138-3f64-4a37-bd88-72c3fefb7d5c',
  },
  {
    id: '0f194ee1-f318-4a9f-8f10-bf26e23fcd57',
    title: 'Version Control',
    icon: 'mdi:source-branch',
    description: 'Seamlessly track changes and manage your codebase using Git integration.',
    page: '7a0f74b1-94d8-4ad0-9c4d-1b6599a6d4f3',
  },
  {
    id: 'e9786a13-3a3d-46a0-9b0f-b7f82dd13e42',
    title: 'Environment Configuration',
    icon: 'mdi:cog-outline',
    description:
      'Configure environment variables through a user-friendly setup form and automatic .env file generation.',
    page: '10495a57-c50b-40b3-8dbe-d0879ee589c3',
  },
  {
    id: 'c5775401-3be2-42d5-95ee-dc818c6e89ef',
    title: 'Project Explorer',
    icon: 'mdi:folder-outline',
    description: 'Navigate, organize, and manage your project files with a structured tree view.',
    page: 'c17beae3-9ef1-4bcb-9947-7f66d1a897b5',
  },
  {
    id: 'fc2f7a5c-d6f4-4b6f-b7f1-7a4043c0b0e2',
    title: 'Live Preview',
    icon: 'mdi:eye-outline',
    description: 'View changes in real time with an embedded browser preview of your web application.',
    page: '9495a528-65b5-4f6d-a43d-65c9cd6a215e',
  },
  {
    id: '0e149f6e-caa7-4a88-94c3-214dfc1f94e4',
    title: 'Authentication & Role Management',
    icon: 'mdi:shield-account-outline',
    description: 'Secure your workspace with JWT-based authentication and customizable role-based access control.',
    page: 'f1b13e8b-41cf-4d02-9d90-918b94ea88e7',
  },
  {
    id: '1e6fbbd3-d437-41fa-a96c-bf6f510bf4c1',
    title: 'Screen Recording',
    icon: 'mdi:record-rec',
    description: 'Record your screen directly from the browser to create tutorials or share your workflow.',
    page: 'page-id-screen-recording',
  },
  {
    id: '3a0e2dc6-1ea3-45e4-a429-66c4a5e7a2c8',
    title: 'Screen Capture',
    icon: 'mdi:camera-outline',
    description: 'Take instant screenshots of your code editor or project workspace.',
    page: 'page-id-screen-capture',
  },
  {
    id: 'd3be56c7-4047-4f57-bff3-48c05cb7f30e',
    title: 'Code Documentation Generator',
    icon: 'mdi:file-document-edit-outline',
    description: 'Automatically extract and generate markdown documentation from your source code.',
    page: 'page-id-doc-generator',
  },
  {
    id: '9b4d9db2-fb8d-471e-bb48-c0074d6826e0',
    title: 'AI Code Generator',
    icon: 'mdi:robot-outline',
    description: 'Leverage AI to generate, refactor, or explain code directly within the editor.',
    page: 'page-id-ai-code-generator',
  },
];

const testimonials = [
  {
    name: 'Alice Johnson',
    title: 'Product Manager',
    quote: 'Project Board transformed how our team collaborates and delivered fantastic results!',
  },
  {
    name: 'Mark Lee',
    title: 'Software Engineer',
    quote: 'The ease of use and customization saved us weeks of development time.',
  },
  {
    name: 'Sandra Kim',
    title: 'CTO',
    quote: 'Reliable and secure, it’s the backbone of our daily operations.',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '$9/mo',
    features: ['Up to 5 projects', 'Basic support', 'Community access'],
  },
  {
    name: 'Pro',
    price: '$29/mo',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    features: ['Custom solutions', 'Dedicated support', 'Onboarding assistance'],
  },
];
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
export default function Home() {
  const { user, isAuthenticated } = useAuth(); // 🔁 Use real auth context

  const [currentTestimonial, setCurrentTestimonial] = createSignal(0);
  const [selectedPlan, setSelectedPlan] = createSignal(pricingPlans[0].name);

  // Rotate testimonials every 7 seconds
  createEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((idx) => (idx + 1) % testimonials.length);
    }, 7000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="flex flex-1 h-full overflow-auto">
      <main class="flex-1 px-6 py-12 md:px-12 lg:px-24">
        <div class="flex items-center gap-x-10">
          <Hero
            user={isAuthenticated() ? { name: user()?.name } : null}
            showUser={true}
            heading={
              <>
                Welcome to <span class="text-blue-600 dark:text-sky-400 italic text-6xl font-bold">Project</span>{' '}
                <span class="font-light">Board</span>
              </>
            }
            subheading="The best solution to manage your projects efficiently and effortlessly."
            buttons={[
              {
                label: 'Go to Dashboard',
                href: '/dashboard',
                variant: 'secondary',
                showWhen: 'authenticated',
              },
              {
                label: 'Get Started',
                href: '/login',
                variant: 'primary',
                showWhen: 'unauthenticated',
              },
              {
                label: 'Learn More',
                href: '/page/editor',
                variant: 'outline',
                showWhen: 'always',
              },
            ]}
          />
          <div class="w-1/2">
            <CodeWriterPanel codeWriter={codeWriter} theme={theme} />
          </div>
        </div>
        <section class="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <For each={benefits}>
            {({ icon, title, description }) => <FeatureCard icon={icon} title={title} description={description} />}
          </For>
        </section>

        {/* Editor Features Section */}
        <section class="mt-20 max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-2">Powerful Editor Features</h2>
          <p class="mb-10">
            Designed to feel like a full IDE in the browser, our editor provides a seamless development experience —
            complete with file navigation, in-browser coding, and an integrated terminal.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <For each={editor_features}>
              {({ icon, title, description }) => <FeatureCard icon={icon} title={title} description={description} />}
            </For>
          </div>
        </section>

        {/* Developer Tools Hero Section */}
        <section class="mt-24 mb-20 px-6 md:px-12 lg:px-24 text-center">
          <Hero
            user={isAuthenticated() ? { name: user()?.name } : null}
            heading={
              <>
                Build. <span class="text-blue-600 dark:text-sky-400 italic">Edit.</span> Speak.
              </>
            }
            subheading="From a powerful, resizable code editor to an intelligent text-to-speech engine, our platform gives you
            everything you need to create, communicate, and deploy content faster than ever."
            buttons={[
              {
                label: ' Launch Editor',
                href: '/editor',
                variant: 'primary',
                showWhen: 'authenticated',
              },
              {
                label: 'Learn More',
                href: '/page/editor',
                variant: 'secondary',
                showWhen: 'unauthenticated',
              },
            ]}
          />
        </section>
        <section class="mt-20 max-w-5xl mx-auto text-center pb-20">
          <h2 class="text-3xl font-bold mb-2">Text-to-Speech Generator</h2>
          <p class="mb-10">
            Generate realistic speech from text with support for multiple languages and custom voice profiles. Perfect
            for narration, accessibility, and voice-driven applications.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <For each={ttsFeatures}>
              {({ icon, title, description }) => <FeatureCard icon={icon} title={title} description={description} />}
            </For>
          </div>
        </section>
        {/*
         Testimonials Section 
        <section class="mt-20 max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div class="relative border rounded-lg p-8 shadow-md">
            <blockquote class="italic mb-4">&ldquo;{testimonials[currentTestimonial()].quote}&rdquo;</blockquote>
            <p class="font-semibold text-sky-600 dark:text-sky-400">{testimonials[currentTestimonial()].name}</p>
            <p class="text-sm">{testimonials[currentTestimonial()].title}</p>
  
            <div class="absolute bottom-2 right-4 flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setCurrentTestimonial(i)}
                  class={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial() === i ? 'bg-sky-600 dark:bg-sky-400' : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>*/}
      </main>
    </div>
  );
}
