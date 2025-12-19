// sw.js - Service Worker FINAL (Estructura Modular)
const CACHE_NAME = 'qumran-cache-v2'; // Subimos versión para forzar actualización
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './css/styles.css',    // <-- Nueva ruta añadida
  './js/data.js',        // <-- Nueva ruta añadida
  './js/calendar.js',    // <-- Nueva ruta añadida
  './js/app.js'          // <-- Nueva ruta añadida
];

// 1. Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando estructura modular...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. Activación (Limpieza de versiones viejas)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Borrando caché antigua:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // Reclamar el control inmediatamente para que funcione sin recargar
  return self.clients.claim();
});

// 3. Interceptación de red (Offline First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});