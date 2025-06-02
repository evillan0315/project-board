// src/App.tsx
import { Router, Route } from '@solidjs/router';
import { Suspense, createResource, For, Show, lazy } from 'solid-js';
import './app.css';

import ThemeProvider from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext'; // <- add this
import Layout from './components/layouts/Layout';
import { menus } from './data/menus';
import { company } from './data/app';
import DocPageList from './components/docs/DocPageList';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Editor from './pages/editor';
import TTSForm from './pages/tts';
import DynamicPage from './components/pages/DynamicPage';
import { getDocSlugs } from './utils/docs';
import LoginForm from './components/LoginForm';

import Toaster from './components/Toaster';

//import DocsPage from './pages/docs/[...slug]';
const fetchRoutes = async () => [];

export default function App() {
  const DocsPage = lazy(() => import('./pages/docs/[...slug]'));
  const [pages] = createResource(fetchRoutes);
  console.log(pages, 'pages');
  const docSlugs = getDocSlugs();

  return (
    <ThemeProvider>
      <Toaster />
      <AuthProvider>
        {' '}
        {/* ✅ Wrap everything with AuthProvider */}
        <Router
          root={(props) => (
            <Layout title={company.name} menus={menus} content={<Suspense>{props.children}</Suspense>} />
          )}
        >
          <Route path="/" component={Home} />
          <Route path="/docs" component={DocPageList} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/editor" component={Editor} />
          <Route path="/tts" component={TTSForm} />
          {/**<Show when={menus}>
            <For each={menus}>
              {(page) => (
                <Route
                  path={page.slug === 'home' ? '/' : `/${page.slug}`}
                  component={() =>
                    page.slug === 'dashboard' ? (
                      <Dashboard />
                    ) : (
                      <DynamicPage title={page.title} subTitle={page.subTitle} />
                    )
                  }
                />
              )}
            </For>
          </Show>**/}
          {/* Dynamically register docs pages */}
          <Show when={docSlugs}>
            <For each={docSlugs}>{(slugParts) => <Route path={`/docs/${slugParts}`} component={DocsPage} />}</For>
          </Show>
          <Route path="/login" component={() => <LoginForm />} />
          <Route path="*" component={() => <div class="p-4">404 Not Found</div>} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
