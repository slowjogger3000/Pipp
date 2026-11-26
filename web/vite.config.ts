import { defineConfig } from 'vite';

// data/ and the fonts live outside web/, shared with the standalone.
export default defineConfig({
  server: { fs: { allow: ['..'] } },
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
