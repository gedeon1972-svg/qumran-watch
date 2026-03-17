/**
 * sw.js - EL GUARDIÁN DEL UMBRAL (V12.5.1)
 * Optimizado para Arquitectura Modular y Estética Mishkan.
 */

const CACHE_NAME = 'qumran-cache-v12.5.1';

// Lista de archivos para funcionamiento 100% Offline
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    // Rutas de Estilos y Scripts (Verifica que el nombre del CSS sea este)
    '/src/css/styles modular.css',
    '/src/js/app.js',
    '/src/js/data.js',
    '/src/js/calendar.js',
    '/src/js/sun.js',
    '/src/js/ics.js',
    // Fuentes Locales
    '/src/css/fonts/david-libre-v17-latin-regular.woff2',
    '/src/css/fonts/david-libre-v17-latin-700.woff2',
    '/src/css/fonts/cinzel-v26-latin-regular.woff2',
    '/src/css/fonts/cinzel-v26-latin-700.woff2'
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