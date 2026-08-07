const { injectManifest } = require('workbox-build');
const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const VERSION = pkg.version;

async function generateServiceWorker() {
  const { count, size, warnings } = await injectManifest({
    swSrc: path.join(__dirname, 'public', 'sw-workbox.js'),
    swDest: path.join(__dirname, 'public', 'sw.js'),
    globDirectory: path.join(__dirname, 'dist'),
    globPatterns: [
      '**/*.{js,css,html,json,woff2,png,ico}'
    ],
    globIgnores: [
      '**/*sw.js',
      '**/*sw.js.map',
      '**/sw-template.js',
      '**/sw-workbox.js'
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  });

  console.log('\n\u2705 Service Worker generado con Workbox injectManifest:');
  console.log('   Archivos precacheados: ' + count);
  console.log('   Tama\u00f1o total: ' + (size / 1024).toFixed(2) + ' KB');
  if (warnings.length > 0) {
    console.log('\n\u26a0\ufe0f Advertencias:');
    warnings.forEach(w => console.log('   - ' + w));
  }
}

generateServiceWorker().catch(err => {
  console.error('\u274c Error generando SW:', err);
  process.exit(1);
});