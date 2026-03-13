/**
 * sw.js
 * SERVICE WORKER PROFESIONAL (PWA)
 * Gestiona el caché offline y las actualizaciones de la aplicación.
 */

const CACHE_NAME = 'qumran-cache-v9.5';

// Lista de todos los archivos vitales para funcionar 100% offline
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
    './src/css/fonts/david-libre-v17-latin-regular.woff2',
    './src/css/fonts/david-libre-v17-latin-700.woff2',
    './src/css/fonts/cinzel-v26-latin-regular.woff2',
    './src/css/fonts/cinzel-v26-latin-700.woff2'
];

// 1. EVENTO DE INSTALACIÓN (Descarga y guarda todo)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('[Service Worker] Guardando archivos en Caché:', CACHE_NAME);
            return cache.addAll(URLS_TO_CACHE);
        })
        .catch(err => console.error('[Service Worker] Error al guardar caché:', err))
    );
});

// 2. EVENTO DE ACTIVACIÓN (Limpia la basura de versiones anteriores)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Si el nombre del caché no coincide con la versión actual, bórralo
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Borrando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Toma el control inmediato de todos los clientes/pestañas abiertas
            return self.clients.claim();
        })
    );
});

// 3. EVENTO FETCH (Intercepta peticiones de red)
self.addEventListener('fetch', event => {
    // Solo intercepta peticiones GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Si el archivo está en caché, devuélvelo rápido
            if (response) {
                return response;
            }
            
            // Si no está en caché, búscalo en internet (red)
            return fetch(event.request).then(networkResponse => {
                return networkResponse;
            }).catch(() => {
                // Falla de red silenciosa (El usuario está offline y el archivo no está en caché)
                console.warn('[Service Worker] Sin conexión para el recurso:', event.request.url);
            });
        })
    );
});

// 4. EVENTO MESSAGE (Escucha la orden de actualizar desde app.js)
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        console.log('[Service Worker] Forzando actualización inmediata...');
        self.skipWaiting();
    }
});
