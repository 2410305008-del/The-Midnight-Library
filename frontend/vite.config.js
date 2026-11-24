import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PageHaven - Bookstore & E-Library | Build v1.4.0
// Output dir changed to 'build' to bypass Cloudflare's stale dist/ build cache
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'build',
    emptyOutDir: true
  }
});
