// sw-workbox.js - Workbox Service Worker para Qumran Watch v13.1.59
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

console.log('[SW] Workbox SW v13.1.59 iniciando...');

precacheAndRoute(self.__WB_MANIFEST || []);
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

console.log('[SW] Workbox SW v13.1.59 listo');
