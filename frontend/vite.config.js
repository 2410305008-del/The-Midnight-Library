import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// PageHaven - Bookstore & E-Library | Build v1.2.0
// Plugin: after every build, nuke any _redirects that Cloudflare cache may
// have restored into dist/, and stamp a build-info.txt so Wrangler always
// sees at least one changed file and uploads a fresh asset bundle.
function cleanRedirectsPlugin() {
  return {
    name: 'clean-redirects-stamp-build',
    closeBundle() {
      const distDir = path.resolve('dist');
      const redirectsPath = path.join(distDir, '_redirects');
      if (fs.existsSync(redirectsPath)) {
        fs.unlinkSync(redirectsPath);
        console.log('[vite] Removed dist/_redirects (Cloudflare cache ghost)');
      }
      // Always write a fresh timestamp so Wrangler detects a changed asset
      fs.writeFileSync(
        path.join(distDir, 'build-info.txt'),
        `build=${new Date().toISOString()}\n`
      );
      console.log('[vite] Wrote dist/build-info.txt to bust Wrangler asset cache');
    }
  };
}

export default defineConfig({
  plugins: [react(), cleanRedirectsPlugin()],
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
