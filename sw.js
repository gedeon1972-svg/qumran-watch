/* * sw.js
 * EL GUARDIÁN DEL UMBRAL (Blindado)
 * Estrategia: Stale-While-Revalidate
 * Versión: 8.2 (Mejora y Ampliacion de Informacion de Reconstruccion del Calendario)
 */

const CACHE_NAME = 'qumran-v8.0-secure';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './src/css/styles.css',
    './src/js/data.js',
    './src/js/calendar.js',
    './src/js/app.js',
    // Fuentes Locales
    './src/css/fonts/cinzel-v26-latin-regular.woff2',
    './src/css/fonts/cinzel-v26-latin-700.woff2',
    './src/css/fonts/david-libre-v17-latin-regular.woff2',
    './src/css/fonts/david-libre-v17-latin-700.woff2'
];

// 1. INSTALACIÓN: Cachear lo crítico inicial
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Forzar activación inmediata
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cacheando núcleo...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. ACTIVACIÓN: Limpiar basura vieja
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Eliminando cache obsoleta:', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // Tomar control de clientes abiertos
    );
});

// 3. INTERCEPTACIÓN: Estrategia Stale-While-Revalidate
self.addEventListener('fetch', (e) => {
    // Solo manejar peticiones http/https (ignorar extensiones, etc.)
    if (!e.request.url.startsWith('http')) return;

    e.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(e.request).then((cachedResponse) => {
                // A. ESTRATEGIA DE RED: Buscar actualización en el fondo
                const fetchPromise = fetch(e.request).then((networkResponse) => {
                    // Si la respuesta es válida, actualizamos la caché
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(e.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // Si falla la red, no pasa nada
                    console.log('[SW] Modo offline activo');
                });

                // B. RESPUESTA: Devolver caché si existe, si no, esperar a la red
                return cachedResponse || fetchPromise;
            });
        })
    );
});