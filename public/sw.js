// sw-workbox.js - Workbox Service Worker para Qumran Watch v13.1.54
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

console.log('[SW] Workbox SW v13.1.54 iniciando...');

precacheAndRoute(
    [
        { revision: '830bb116a513550c5858d60ded660753', url: 'privacy.html' },
        { revision: '56878ed6b1c71b5d1ea4a6ae57ea5332', url: 'manifest.json' },
        { revision: 'c9572888756e5c887d1b56b6dff80e51', url: 'license.html' },
        { revision: '950230d03a16b61ad6ef4c11c9b867a5', url: 'index.html' },
        { revision: 'f214d4ac2c7f2e2c94e366ca34c5c92e', url: 'icon.png' },
        { revision: '022a532fb87b689feb3ea236a1d1425d', url: 'src/js/index.js' },
        { revision: '6f409fee918068d9b004dc3be0a6740d', url: 'src/css/index.css' },
        { revision: '2d8904c9b0cd7cb2929d0bb613047f58', url: 'src/css/fonts/david-libre-v17-latin-regular.woff2' },
        { revision: '1d9878b23b606fc71d20a4ed5bd2ce1f', url: 'src/css/fonts/david-libre-v17-latin-700.woff2' },
        { revision: '63126eeda8319b882d8d9320edc8ca5a', url: 'src/css/fonts/cinzel-v26-latin-regular.woff2' },
        { revision: '82175d611596bd4529ca178ff59fb1f4', url: 'src/css/fonts/cinzel-v26-latin-700.woff2' },
        { revision: 'f3cbad24e40bcc40a28cb3422428f6f3', url: 'screenshots/screenshot-mobile.png' },
        { revision: '501b5f4b3c05c1493b3159232202824f', url: 'screenshots/screenshot-desktop.png' },
        { revision: 'cfffe1bdc43de67a79dda9bfda56921a', url: 'icons/icon-96x96.png' },
        { revision: '5a05b85f35be2bccc989a6944fb64c01', url: 'icons/icon-72x72.png' },
        { revision: '5275b3630c847fb0d6eca560d7003b5e', url: 'icons/icon-48x48.png' },
        { revision: 'fc19164b1b3c0a5ef1cec05215e48f82', url: 'icons/icon-32x32.png' },
        { revision: '29e75c92dc87a39f004eb34346e7ce24', url: 'icons/icon-192x192.png' },
        { revision: 'ebc09dae95e62cf426329bf34dcfd363', url: 'icons/icon-144x144.png' },
    ] || [],
);
cleanupOutdatedCaches();

self.addEventListener('message', (event) => {
    if (event.data && (event.data.action === 'skipWaiting' || event.data.type === 'SKIP_WAITING')) {
        self.skipWaiting();
    }
});

self.skipWaiting();
self.clients.claim();

// HTML/Navigation -> NetworkFirst
registerRoute(
    ({ url }) => url.pathname === '/qumran-watch/' || url.pathname === '/qumran-watch/index.html',
    new NetworkFirst({
        cacheName: 'html-pages',
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// JS/CSS/Fonts -> CacheFirst
registerRoute(
    ({ url }) =>
        url.pathname.startsWith('/qumran-watch/') &&
        (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.woff2')),
    new CacheFirst({
        cacheName: 'static-assets',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// Imagenes -> CacheFirst
registerRoute(
    ({ url }) => url.pathname.match(/\.(png|jpg|webp|svg|ico)$/),
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// JSON -> StaleWhileRevalidate
registerRoute(
    ({ url }) => url.pathname.endsWith('.json') || url.pathname.endsWith('.manifest'),
    new StaleWhileRevalidate({
        cacheName: 'json-data',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// Background Sync para ICS
self.addEventListener('sync', (event) => {
    if (event.tag === 'ics-sync') {
        event.waitUntil(handleICSSync());
    }
});

async function handleICSSync() {
    console.log('[SW] Background sync: ics-sync iniciado');
    try {
        // Notificar a la app principal para procesar la cola
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            client.postMessage({ type: 'PROCESS_ICS_SYNC' });
        }
        console.log('[SW] Background sync: ics-sync completado');
    } catch (err) {
        console.error('[SW] Background sync error:', err);
    }
}

// Periodic Background Sync para actualizar datos solares diariamente
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'sun-data') {
        event.waitUntil(handleSunSync());
    }
});

async function handleSunSync() {
    console.log('[SW] Periodic sync: sun-data iniciado');
    try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            client.postMessage({ type: 'REFRESH_SOLAR' });
        }
        console.log('[SW] Periodic sync: sun-data completado');
    } catch (err) {
        console.error('[SW] Periodic sync error:', err);
    }
}

console.log('[SW] Workbox SW v13.1.54 listo');
