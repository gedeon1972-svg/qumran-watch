// src/js/core/notif-store.js
const DB_NAME = 'qumran-notif-db';
const DB_VERSION = 1;
const STORE = 'schedule';

let dbPromise = null;

function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE)) {
                const s = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
                s.createIndex('date', 'date', { unique: false });
            }
        };
    });
    return dbPromise;
}

function openTx(mode) {
    return openDB().then((db) => db.transaction(STORE, mode));
}

export const notifStore = {
    async add(item) {
        const t = await openTx('readwrite');
        return new Promise((resolve, reject) => {
            const req = t.objectStore(STORE).add({ ...item, timestamp: Date.now() });
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    },
    async getAll() {
        const t = await openTx('readonly');
        return new Promise((resolve, reject) => {
            const req = t.objectStore(STORE).getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    },
    async findByDate(date) {
        const t = await openTx('readonly');
        return new Promise((resolve, reject) => {
            const req = t.objectStore(STORE).index('date').getAll(date);
            req.onsuccess = () => resolve(req.result[0] || null);
            req.onerror = () => reject(req.error);
        });
    },
    async markShown(id) {
        const t = await openTx('readwrite');
        return new Promise((resolve, reject) => {
            const store = t.objectStore(STORE);
            const g = store.get(id);
            g.onsuccess = () => {
                const item = g.result;
                if (!item) return resolve();
                item.shown = true;
                const p = store.put(item);
                p.onsuccess = () => resolve();
                p.onerror = () => reject(p.error);
            };
            g.onerror = () => reject(g.error);
        });
    },
    async delete(id) {
        const t = await openTx('readwrite');
        return new Promise((resolve, reject) => {
            const req = t.objectStore(STORE).delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    },
    async cleanup() {
        const all = await notifStore.getAll();
        const now = Date.now();
        for (const item of all) {
            if (item.shown && now - (item.timestamp || 0) > 30 * 24 * 60 * 60 * 1000) {
                await notifStore.delete(item.id);
            }
        }
    },
};
