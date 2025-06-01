// src/index.tsx or src/main.tsx
import { render } from 'solid-js/web';
import './index.css';
import App from './App.tsx';
import ThemeProvider from './contexts/ThemeProvider';

const root = document.getElementById('app');

render(() => (
   <ThemeProvider>
      <App />
    </ThemeProvider>
), root!);

