// sw-workbox.js - Workbox Service Worker para Qumran Watch v13.1.52
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

console.log('[SW] Workbox SW v13.1.52 iniciando...');

precacheAndRoute(self.__WB_MANIFEST || []);
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

console.log('[SW] Workbox SW v13.1.52 listo');
