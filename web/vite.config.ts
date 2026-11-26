import { defineConfig } from 'vite';

// data/ and the fonts live outside web/, shared with the standalone.
export default defineConfig({
  // Relative paths, so the build works under a sub path such as GitHub Pages.
  base: './',
  server: { fs: { allow: ['..'] } },
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
