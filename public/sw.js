/**
 * sw.js - EL GUARDIÁN DEL UMBRAL (v13.1.3)
 * Estrategia híbrida: cache-first para assets estáticos,
 * network-first para navegaciones, fallback offline.
 */

const CACHE_NAME = 'qumran-cache-v13.1.5';

const URLS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './src/js/index.js',
    './src/js/theme-init.js',
    './src/css/index.css',
    './src/css/fonts/david-libre-v17-latin-regular.woff2',
    './src/css/fonts/david-libre-v17-latin-700.woff2',
    './src/css/fonts/cinzel-v26-latin-regular.woff2',
    './src/css/fonts/cinzel-v26-latin-700.woff2',
];

const OFFLINE_RESPONSE = new Response(
    '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Sin Conexión — Qumran Watch</title><style>body{background:#1a120b;color:#d4af37;font-family:serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center}h1{font-size:1.5rem;margin-bottom:1rem}p{color:#c0b090;max-width:400px;line-height:1.6}.icon{font-size:3rem;margin-bottom:1rem}.retry-btn{margin-top:1.5rem;padding:12px 24px;background:#d4af37;color:#1a120b;border:none;border-radius:6px;font-size:1rem;cursor:pointer;font-family:serif}</style></head><body><div class="icon">📡</div><h1>Sin Conexión</h1><p>Qumran Watch necesita conexión a internet para cargarse por primera vez.<br>Una vez cargado, funciona completamente offline.</p><button class="retry-btn" onclick="location.reload()">Reintentar</button></body></html>',
    { headers: { 'Content-Type': 'text/html;charset=UTF-8' } },
);

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
    console.log('[SW] Instalando v13.1.3...');
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
            .then((results) => {
                const succeeded = results.filter((r) => r.status === 'fulfilled').length;
                console.log('[SW] Cache completado: ' + succeeded + ' archivos');
                self.skipWaiting();
            }),
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activado v13.1.3');
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
                    return caches.match('./index.html').then((cached) => cached || OFFLINE_RESPONSE);
                })
                .catch(() => {
                    return caches.match('./index.html').then((cached) => cached || OFFLINE_RESPONSE);
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

            return cached || fetchPromise || OFFLINE_RESPONSE;
        }),
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
