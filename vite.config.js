import { defineConfig } from 'vite';

// base relativa: funciona no GitHub Pages (usuario.github.io/biosense/) e abrindo localmente
export default defineConfig({
  base: './',
  build: { outDir: 'dist', target: 'es2022', chunkSizeWarningLimit: 900 }
});
