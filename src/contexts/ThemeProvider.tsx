import { type JSX, onCleanup } from 'solid-js';
import { theme } from '../stores/theme';

interface ThemeProviderProps {
  children: JSX.Element;
}

export default function ThemeProvider(props: ThemeProviderProps) {
  const unsubscribe = theme.subscribe((currentTheme) => {
    const html = document.documentElement;
    const body = document.body;

    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    html.classList.add(currentTheme);
    body.classList.add(currentTheme);
  });

  onCleanup(() => {
    unsubscribe();
    document.documentElement.style.transition = '';
    document.body.style.transition = '';
  });

  return props.children;
}
