/**
 * sw.js - EL GUARDIÁN DEL UMBRAL (V12.5.1)
 * Optimizado para Arquitectura Modular y Estética Mishkan.
 */

const CACHE_NAME = 'qumran-cache-v12.5.1';

// Lista de archivos para funcionamiento 100% Offline
const URLS_TO_CACHE = [
    '/qumran-watch/',
    '/qumran-watch/index.html',
    '/qumran-watch/manifest.json',
    '/qumran-watch/icon.png',
    '/qumran-watch/src/css/styles.css',   // nombre real sin espacios
    '/qumran-watch/src/js/app.js',
    '/qumran-watch/src/js/data.js',
    '/qumran-watch/src/js/calendar.js',
    '/qumran-watch/src/js/sun.js',
    '/qumran-watch/src/js/ics.js',
    '/qumran-watch/src/css/fonts/david-libre-v17-latin-regular.woff2',
    '/qumran-watch/src/css/fonts/david-libre-v17-latin-700.woff2',
    '/qumran-watch/src/css/fonts/cinzel-v26-latin-regular.woff2',
    '/qumran-watch/src/css/fonts/cinzel-v26-latin-700.woff2'
];

// 1. INSTALACIÓN: Descarga y guarda los recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('[SW] Instalando nuevo caché:', CACHE_NAME);
            // Agregamos los archivos uno a uno para evitar que un error 404 detenga todo
            return Promise.allSettled(
                URLS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => console.warn(`[SW] No se pudo cachear: ${url}`, err));
                })
            );
        })
        .then(() => self.skipWaiting())
    );
});

// 2. ACTIVACIÓN: Elimina cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Borrando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. ESTRATEGIA: Cache First (Rápido) -> Network (Actualiza)
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request).then(networkResponse => {
                return networkResponse;
            });
        }).catch(() => {
            console.log('[SW] Error de red y sin copia en caché');
        })
    );
});

// 4. ESCUCHA DE ACTUALIZACIÓN
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
