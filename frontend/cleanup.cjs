const fs = require('fs');
const path = require('path');

console.log('=== [Frontend Build Cleanup] ===');

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  const redirectsFile = path.join(distDir, '_redirects');
  if (fs.existsSync(redirectsFile)) {
    fs.unlinkSync(redirectsFile);
    console.log('[cleanup] Deleted dist/_redirects');
  }
  const timestamp = Date.now().toString();
  fs.writeFileSync(path.join(distDir, '.build-hash'), timestamp);
  console.log(`[cleanup] Injected .build-hash: ${timestamp}`);
}

const wranglerConfig = {
  name: "the-midnight-library",
  compatibility_date: "2024-11-01",
  assets: {
    directory: "./dist",
    not_found_handling: "single-page-application"
  }
};
fs.writeFileSync(path.join(__dirname, 'wrangler.json'), JSON.stringify(wranglerConfig, null, 2) + '\n');
console.log('=== [Frontend Build Cleanup Done] ===');
