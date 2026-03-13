const CACHE_NAME = 'qumran-cache-v9.3';
const URLS_TO_CACHE = [
    './', './index.html', './manifest.json', './icon.png',
    './src/css/styles.css', './src/js/app.js', './src/js/data.js', './src/js/calendar.js'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)));
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});

self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') self.skipWaiting();
});

// Único añadido: Abre la app al tocar aviso
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('./');
        })
    );
});
