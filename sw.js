// sw-workbox.js - Workbox Service Worker para Qumran Watch v13.1.78
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

console.log('[SW] Workbox SW v13.1.78 iniciando...');

precacheAndRoute(
    [
        { revision: '830bb116a513550c5858d60ded660753', url: 'privacy.html' },
        { revision: '16603f2aa3f40b213cd8c7049f3305ee', url: 'manifest.json' },
        { revision: 'c9572888756e5c887d1b56b6dff80e51', url: 'license.html' },
        { revision: 'f1cbc59aab6ea2c2624968a6b3de6a66', url: 'index.html' },
        { revision: 'f214d4ac2c7f2e2c94e366ca34c5c92e', url: 'icon.png' },
        { revision: 'f870b20a9230097409be6c230e882814', url: 'src/js/index.js' },
        { revision: 'd5aba1be0ac0004b70f852b8091af83d', url: 'src/js/core.js' },
        { revision: '1a442051dcee6065b76084d3d59a984f', url: 'src/css/index.css' },
        { revision: '2d8904c9b0cd7cb2929d0bb613047f58', url: 'src/css/fonts/david-libre-v17-latin-regular.woff2' },
        { revision: '1d9878b23b606fc71d20a4ed5bd2ce1f', url: 'src/css/fonts/david-libre-v17-latin-700.woff2' },
        { revision: '63126eeda8319b882d8d9320edc8ca5a', url: 'src/css/fonts/cinzel-v26-latin-regular.woff2' },
        { revision: '82175d611596bd4529ca178ff59fb1f4', url: 'src/css/fonts/cinzel-v26-latin-700.woff2' },
        { revision: 'f3cbad24e40bcc40a28cb3422428f6f3', url: 'screenshots/screenshot-mobile.png' },
        { revision: '501b5f4b3c05c1493b3159232202824f', url: 'screenshots/screenshot-desktop.png' },
        { revision: 'cfffe1bdc43de67a79dda9bfda56921a', url: 'icons/icon-96x96.png' },
        { revision: '5a05b85f35be2bccc989a6944fb64c01', url: 'icons/icon-72x72.png' },
        { revision: '5275b3630c847fb0d6eca560d7003b5e', url: 'icons/icon-48x48.png' },
        { revision: 'fc19164b1b3c0a5ef1cec05215e48f82', url: 'icons/icon-32x32.png' },
        { revision: '29e75c92dc87a39f004eb34346e7ce24', url: 'icons/icon-192x192.png' },
        { revision: 'ebc09dae95e62cf426329bf34dcfd363', url: 'icons/icon-144x144.png' },
        { revision: '8b801237234729c3dc34d4f6118aec82', url: 'assets/sun-worker.js' },
    ] || [],
);
cleanupOutdatedCaches();

self.addEventListener('message', (event) => {
    if (event.data && (event.data.action === 'skipWaiting' || event.data.type === 'SKIP_WAITING')) {
        self.skipWaiting();
        self.clients.claim();
    }
    if (event.data && event.data.type === 'CHECK_NOTIFICATIONS') {
        event.waitUntil(showDueNotifications());
    }
});

// HTML/Navigation -> NetworkFirst
registerRoute(
    ({ url }) => url.pathname === '/qumran-watch/' || url.pathname === '/qumran-watch/index.html',
    new NetworkFirst({
        cacheName: 'html-pages',
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// JS/CSS/Fonts -> CacheFirst
registerRoute(
    ({ url }) =>
        url.pathname.startsWith('/qumran-watch/') &&
        (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.woff2')),
    new CacheFirst({
        cacheName: 'static-assets',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// Imagenes -> CacheFirst
registerRoute(
    ({ url }) => url.pathname.match(/\.(png|jpg|webp|svg|ico)$/),
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// JSON -> StaleWhileRevalidate
registerRoute(
    ({ url }) => url.pathname.endsWith('.json') || url.pathname.endsWith('.manifest'),
    new StaleWhileRevalidate({
        cacheName: 'json-data',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }),
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// Background Sync para ICS
self.addEventListener('sync', (event) => {
    if (event.tag === 'ics-sync') {
        event.waitUntil(handleICSSync());
    }
});

async function handleICSSync() {
    console.log('[SW] Background sync: ics-sync iniciado');
    try {
        // Notificar a la app principal para procesar la cola
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            client.postMessage({ type: 'PROCESS_ICS_SYNC' });
        }
        console.log('[SW] Background sync: ics-sync completado');
    } catch (err) {
        console.error('[SW] Background sync error:', err);
    }
}

// Periodic Background Sync para actualizar datos solares diariamente
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'sun-data') {
        event.waitUntil(Promise.all([handleSunSync(), showDueNotifications()]));
    }
});

async function handleSunSync() {
    console.log('[SW] Periodic sync: sun-data iniciado');
    try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            client.postMessage({ type: 'REFRESH_SOLAR' });
        }
        console.log('[SW] Periodic sync: sun-data completado');
    } catch (err) {
        console.error('[SW] Periodic sync error:', err);
    }
}

// Notificaciones locales (sin backend): leer agenda de IndexedDB y mostrar Notification
function openNotifDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('qumran-notif-db', 1);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('schedule')) {
                const s = db.createObjectStore('schedule', { keyPath: 'id', autoIncrement: true });
                s.createIndex('date', 'date', { unique: false });
            }
        };
    });
}

function isoToday() {
    const d = new Date();
    return (
        d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    );
}

async function showDueNotifications() {
    try {
        if (!self.registration || !self.registration.showNotification) return;
        const db = await openNotifDb();
        const today = isoToday();
        const items = await new Promise((resolve, reject) => {
            const tx = db.transaction('schedule', 'readonly');
            const req = tx.objectStore('schedule').index('date').getAll(today);
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
        for (const item of items) {
            if (item.shown) continue;
            await self.registration.showNotification(item.title, {
                body: item.body,
                icon: '/qumran-watch/icon.png',
                tag: 'qumran-' + item.title,
            });
            await new Promise((resolve) => {
                const tx = db.transaction('schedule', 'readwrite');
                const store = tx.objectStore('schedule');
                const g = store.get(item.id);
                g.onsuccess = () => {
                    const it = g.result;
                    if (it) {
                        it.shown = true;
                        store.put(it);
                    }
                    resolve();
                };
                g.onerror = () => resolve();
            });
        }
        console.log('[SW] Notificaciones locales: ' + items.length + ' pendientes para hoy');
    } catch (err) {
        console.error('[SW] Error en notificaciones locales:', err);
    }
}

console.log('[SW] Workbox SW v13.1.78 listo');
