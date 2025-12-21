/* * sw.js (RAÍZ)
 * EL GUARDIÁN DEL UMBRAL: Service Worker para modo offline.
 * Actualizado para incluir fuentes locales.
 */

const CACHE_NAME = 'qumran-v5-offline-complete'; // Versión actualizada
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './src/css/styles.css',
    './src/js/data.js',
    './src/js/calendar.js',
    './src/js/app.js',
    
    // FUENTES LOCALES (Nombres exactos según tu descarga)
    './src/css/fonts/cinzel-v26-latin-regular.woff2',
    './src/css/fonts/cinzel-v26-latin-700.woff2',
    './src/css/fonts/david-libre-v17-latin-regular.woff2',
    './src/css/fonts/david-libre-v17-latin-700.woff2'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cacheando el santuario completo...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Limpiando cache antigua:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});