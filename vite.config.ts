import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_PROXY_TARGET || 'https://api.whcp.pl';
  const proxy = {
    target,
    changeOrigin: true,
    secure: true,
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '~/': `${process.cwd()}/src/`,
      },
    },
    server: {
      host: true,
      // Dev-only: forward API paths to the backend so the browser stays
      // same-origin and CORS never applies. Scoped to the real API endpoints so
      // the SPA route /portfolio/:slug is still served by Vite (not proxied).
      proxy: {
        '/portfolio/home': proxy,
        '/portfolio/hero': proxy,
        '/portfolio/galleries': proxy,
        '/portfolio/gear': proxy,
        '/portfolio/settings': proxy,
        '/portfolio/contact': proxy,
        '/portfolio/inquiries': proxy,
        '/image': proxy,
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Long-lived vendor chunks: app deploys don't bust the cached libraries.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            markdown: ['react-markdown'],
            data: ['axios', 'zod'],
          },
        },
      },
    },
  };
});
