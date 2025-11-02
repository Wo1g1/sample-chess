import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig(({ command, mode }) => {
  // Vercel에서는 루트 경로, GitHub Pages에서는 /sample-chess/
  const base = process.env.VERCEL ? '/' : '/sample-chess/';

  return {
    plugins: [
      react(),
      wasm(),
      topLevelAwait()
    ],
    base,
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  };
});
