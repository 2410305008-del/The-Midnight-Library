// cleanup.cjs — Runs after vite build to fix Cloudflare deployment
// Uses .cjs extension so Node treats it as CommonJS regardless of "type":"module"
const fs = require('fs');
const path = require('path');

// 1. Delete _redirects from dist/ — removes the stale cached file
//    that causes Cloudflare error 100324 (Infinite loop detected)
const redirectsPath = path.join('dist', '_redirects');
if (fs.existsSync(redirectsPath)) {
  fs.unlinkSync(redirectsPath);
  console.log('[cleanup] Removed dist/_redirects');
} else {
  console.log('[cleanup] No dist/_redirects found (good)');
}

// 2. Overwrite wrangler.json with a NEW worker name (pagehaven-library).
//    A fresh worker name has zero upload history on Cloudflare, so ALL
//    assets in dist/ are treated as new and get uploaded fresh.
//    This breaks the cycle of "No updated asset files" reusing the stale manifest.
const wranglerConfig = {
  name: 'pagehaven-library',
  compatibility_date: '2024-11-01',
  assets: {
    directory: './dist',
    not_found_handling: 'single-page-application'
  }
};
fs.writeFileSync('wrangler.json', JSON.stringify(wranglerConfig, null, 2) + '\n');
console.log('[cleanup] Rewrote wrangler.json — worker: pagehaven-library');
