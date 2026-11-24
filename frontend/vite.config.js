import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PageHaven - Bookstore & E-Library | Build v1.1.0
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
