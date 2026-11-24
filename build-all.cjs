const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== [PageHaven Build System] Running build & cache-purge ===');

// 1. Build frontend via vite directly
console.log('Building frontend with Vite...');
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

// 2. Ensure dist exists
const distDir = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(distDir)) {
  // Purge any _redirects file completely
  const redirectsFile = path.join(distDir, '_redirects');
  if (fs.existsSync(redirectsFile)) {
    fs.unlinkSync(redirectsFile);
    console.log('Successfully purged _redirects from dist');
  }

  // Inject a build-hash file so Wrangler NEVER says "No updated asset files to upload"
  const timestamp = Date.now().toString();
  fs.writeFileSync(path.join(distDir, '.build-hash'), timestamp);
  console.log(`Generated fresh asset signature in dist: ${timestamp}`);
}

// 3. Ensure wrangler.json at root points correctly to ./frontend/dist
const rootWrangler = {
  name: "the-midnight-library",
  compatibility_date: "2024-11-01",
  assets: {
    directory: "./frontend/dist",
    not_found_handling: "single-page-application"
  }
};
fs.writeFileSync(path.join(__dirname, 'wrangler.json'), JSON.stringify(rootWrangler, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, 'frontend', 'wrangler.json'), JSON.stringify({
  ...rootWrangler,
  assets: {
    directory: "./dist",
    not_found_handling: "single-page-application"
  }
}, null, 2) + '\n');

console.log('=== [PageHaven Build System] Completed successfully ===');
