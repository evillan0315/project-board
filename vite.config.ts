import { defineConfig } from 'vite';

import path from 'path';
import dotenv from 'dotenv';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

// Load environment variables
dotenv.config({ path: './.env' }); // or '../.env'
export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), solidPlugin()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        name: 'VS Code Layout',
        formats: ['es'],
        fileName: () => 'index.js',
      },
      //outDir: 'public/assets',
      target: 'esnext',
      assetsInlineLimit: 0,
      emptyOutDir: true,
      /*rollupOptions: {
        output: {
          // Change assets directory name to "styles" for CSS
          assetFileNames: (chunkInfo) => {
            return 'assets/[name][extname]';
          },
        },
      },*/
    },
    worker: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
        },
      },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      cors: {
        origin: ['*'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    },
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
      'import.meta.env.GITHUB_CALLBACK_URL': JSON.stringify(process.env.GITHUB_CALLBACK_URL),
      'import.meta.env.GOOGLE_CALLBACK_URL': JSON.stringify(process.env.GOOGLE_CALLBACK_URL),
    },
  };
});
