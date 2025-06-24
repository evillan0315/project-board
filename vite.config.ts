import { defineConfig, loadEnv } from 'vite'; // Import loadEnv for accessing .env variables reliably

import path from 'path';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

// Load environment variables using Vite's `loadEnv`
// This ensures that all env variables (including those without VITE_ prefix)
// are available within the Vite config file.
// `mode` will be 'development' or 'production' based on command
// `process.cwd()` is the current working directory
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load all env vars (empty prefix means all)
  console.log(env, process.cwd());
  return {
    plugins: [tailwindcss(), solidPlugin()],
    // publicDir: false, // Reconsider this if you have static assets like favicon.ico
    // If you have static assets, you'd typically leave publicDir as its default ('public')
    // and put your favicon.ico, etc. there.

    build: {
      lib: {
        // Use path.resolve for absolute path
        entry: path.resolve(__dirname, 'src/index.tsx'),
        name: 'VSCodeLayout', // Changed name for consistency
        formats: ['es'],
        fileName: () => 'index.js',
      },
      // outDir: '../public/assets', // This looks like an output for a library build
      // If this is a standard SPA, outDir would typically be 'dist' or similar.
      // If you are bundling this as a library to be included in another project, this is fine.
      // Assuming this is a library for a larger project, keep this.
      //outDir: path.resolve(__dirname, 'public/assets'), // Ensure absolute path for outDir
      target: 'esnext',
      assetsInlineLimit: 0,
      emptyOutDir: true,
      // rollupOptions comments are fine, they are commented out
    },



    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        // Add a polyfill for 'process' if a dependency explicitly needs it
        // This is a common solution if 'process is not defined' still persists after defining NODE_ENV
        // 'process': 'process/browser', // You would need to `npm install process`
      },
    },

    server: {
      proxy: {
        '/api': {
          // Use the env variable loaded by `loadEnv`
          target: env.BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      cors: {
        // It's generally not recommended to use '*' for `origin` in production.
        // For development, it's often fine.
        origin: ['*'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
      port: 3000,
      allowedHosts: ['board-api.duckdns.org']
    },

    define: {
      // Define `process.env.NODE_ENV` for compatibility with libraries
      // Vite handles `import.meta.env.NODE_ENV` by default, but some libraries might still check `process.env.NODE_ENV`
      'process.env.NODE_ENV': JSON.stringify(mode),

      // Expose specific environment variables to your client-side code via `import.meta.env`
      // These should ideally be prefixed with `VITE_` to be automatically exposed by Vite.
      // If they are not `VITE_` prefixed, you MUST define them here.
      // If your .env file has BASE_URL, GITHUB_CALLBACK_URL etc. as is, this is correct.
      'import.meta.env.BASE_URL_API': JSON.stringify(env.BASE_URL), // Use a distinct name for client-side API base URL
      'import.meta.env.GITHUB_CALLBACK_URL': JSON.stringify(env.GITHUB_CALLBACK_URL),
      'import.meta.env.GOOGLE_CALLBACK_URL': JSON.stringify(env.GOOGLE_CALLBACK_URL),
      // Example: If you have a `VITE_APP_TITLE` in .env, Vite automatically exposes it as `import.meta.env.VITE_APP_TITLE`
      // So you wouldn't need to define it here.
    },
  };
});
