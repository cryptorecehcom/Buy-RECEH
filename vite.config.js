import { defineConfig } from 'vite';
export default defineConfig({
  base: '/buy/',
  publicDir: false,
  build: { target: 'es2020' }
});
