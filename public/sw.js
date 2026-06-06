/**
 * sw.js - EL GUARDIÁN DEL UMBRAL (V13.0.1)
 * Optimizado para Arquitectura Modular y Estética Mishkan.
 */

const CACHE_NAME = 'qumran-cache-v13.0.1';

const URLS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './privacy.html',
    './license.html',
    './src/js/index.js',
    './src/css/index.css',
    './src/css/fonts/david-libre-v17-latin-regular.woff2',
    './src/css/fonts/david-libre-v17-latin-700.woff2',
    './src/css/fonts/cinzel-v26-latin-regular.woff2',
    './src/css/fonts/cinzel-v26-latin-700.woff2',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return Promise.allSettled(
                    URLS_TO_CACHE.map((url) => {
                        return cache.add(url).catch(() => {});
                    }),
                );
            })
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    }),
                );
            })
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches
            .match(event.request)
            .then((cached) => {
                const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {});

                return cached || fetchPromise;
            })
            .catch(() => {
                return new Response('Not Found', { status: 404 });
            }),
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
