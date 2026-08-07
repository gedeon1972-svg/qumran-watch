/**
 * sw.js - EL GUARDIAN DEL UMBRAL (v13.1.51)
 * Estrategia hibrida: cache-first para assets estaticos,
 * network-first para navegaciones, fallback offline.
 */

const CACHE_NAME = 'qumran-cache-v13.1.51';

const URLS_TO_CACHE = [
    '/qumran-watch/',
    '/qumran-watch/index.html',
    '/qumran-watch/manifest.json',
    '/qumran-watch/icon.png',
    '/qumran-watch/src/js/index.js',
    '/qumran-watch/src/css/index.css',
    '/qumran-watch/src/css/fonts/cinzel-v26-latin-regular.woff2',
    '/qumran-watch/src/css/fonts/cinzel-v26-latin-700.woff2',
    '/qumran-watch/src/css/fonts/david-libre-v17-latin-regular.woff2',
    '/qumran-watch/src/css/fonts/david-libre-v17-latin-700.woff2',
];

function isNavigation(request) {
    return request.mode === 'navigate';
}

function isAsset(url) {
    return (
        url.includes('/src/js/') ||
        url.includes('/src/css/') ||
        url.endsWith('.woff2') ||
        url.endsWith('.png') ||
        url.endsWith('.json')
    );
}

self.addEventListener('install', (event) => {
    console.log('[SW] Instalando v13.1.51...');
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return Promise.allSettled(
                    URLS_TO_CACHE.map((url) => {
                        return cache.add(url).catch((err) => {
                            console.warn('[SW] No se pudo cachear: ' + url, err);
                        });
                    }),
                );
            })
            .then((results) => {
                const succeeded = results.filter((r) => r.status === 'fulfilled').length;
                console.log('[SW] Cache completado: ' + succeeded + ' archivos');
                self.skipWaiting();
            }),
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activado v13.1.51');
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Eliminando cache antiguo: ' + cacheName);
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

    if (isNavigation(event.request)) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                        return response;
                    }
                    return caches
                        .match('/qumran-watch/index.html')
                        .then((cached) => cached || caches.match('/qumran-watch/index.html'));
                })
                .catch(() => {
                    return caches.match('/qumran-watch/index.html');
                }),
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.ok && isAsset(event.request.url)) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {});

            return cached || fetchPromise;
        }),
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
