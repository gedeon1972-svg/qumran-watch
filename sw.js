/**
 * sw.js
 * EL GUARDIÁN DEL UMBRAL (V12.1)
 * Estrategia: Cache-First con actualización en segundo plano.
 * Gestiona el funcionamiento 100% Offline y la instalación PWA.
 */

const CACHE_NAME = 'qumran-cache-v12.1';

// Lista de archivos vitales para funcionamiento offline
const URLS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './src/css/styles.css',
    './src/js/app.js',
    './src/js/data.js',
    './src/js/calendar.js',
    './src/js/sun.js',
    './src/js/ics.js',
    // Fuentes Locales (Ruta exacta según tu estructura)
    './src/css/fonts/david-libre-v17-latin-regular.woff2',
    './src/css/fonts/david-libre-v17-latin-700.woff2',
    './src/css/fonts/cinzel-v26-latin-regular.woff2',
    './src/css/fonts/cinzel-v26-latin-700.woff2'
];

// 1. INSTALACIÓN: Descarga y guarda todos los recursos iniciales
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('[SW] Creando caché de seguridad:', CACHE_NAME);
            return cache.addAll(URLS_TO_CACHE);
        })
        .then(() => self.skipWaiting()) // Fuerza la activación inmediata
    );
});

// 2. ACTIVACIÓN: Limpia versiones antiguas de la aplicación
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Eliminando caché obsoleta:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma control de las pestañas abiertas
    );
});

// 3. INTERCEPTACIÓN (FETCH): Estrategia de respuesta rápida
self.addEventListener('fetch', event => {
    // Solo manejamos peticiones GET (estándar para archivos estáticos)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // A. Devolver desde caché si existe (Velocidad instantánea)
            if (response) return response;

            // B. Si no está en caché, buscar en la red
            return fetch(event.request).then(networkResponse => {
                // Opcional: Podrías guardar dinámicamente nuevos archivos aquí
                return networkResponse;
            }).catch(() => {
                // Si falla la red y no hay caché (totalmente offline en recurso nuevo)
                console.log('[SW] Recurso no disponible offline:', event.request.url);
            });
        })
    );
});

// 4. MENSAJERÍA: Escucha la orden de actualización desde el botón "ACTUALIZAR" de la UI
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
