/* sw.js - Service Worker V7.2 */
const CACHE_NAME = 'qumran-watch-v7.2'; // ¡Versión actualizada!
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/data.js',
  './js/calendar.js',
  './manifest.json',
  './icon.png'
];

// INSTALACIÓN (Guardar recursos)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Forzar activación inmediata
});

// ACTIVACIÓN (Limpiar caches viejas v1)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control de inmediato
});

// INTERCEPTOR (Servir contenido)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve cache si existe, sino busca en red
        return response || fetch(event.request);
      })
  );
});