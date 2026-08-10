import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';

const { idb } = await import('../src/js/core/idb.js');
const { notifStore } = await import('../src/js/core/notif-store.js');

describe('idb (IndexedDB queue ICS)', () => {
    beforeEach(async () => {
        await idb.clear();
    });

    it('add() encola item con timestamp y status pending', async () => {
        const key = await idb.add({ url: 'x.ics', title: 'test' });
        expect(key).toBeGreaterThan(0);
        const all = await idb.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].status).toBe('pending');
        expect(all[0].timestamp).toBeGreaterThan(0);
        expect(all[0].title).toBe('test');
    });

    it('getAll(status) filtra por status', async () => {
        const k1 = await idb.add({ url: 'a.ics' });
        const k2 = await idb.add({ url: 'b.ics' });
        await idb.update(k1, { status: 'synced' });
        const pending = await idb.getAll('pending');
        const synced = await idb.getAll('synced');
        expect(pending).toHaveLength(1);
        expect(pending[0].id).toBe(k2);
        expect(synced).toHaveLength(1);
        expect(synced[0].id).toBe(k1);
    });

    it('getAll() sin status devuelve todos', async () => {
        await idb.add({ url: 'a.ics' });
        await idb.add({ url: 'b.ics' });
        expect(await idb.getAll()).toHaveLength(2);
    });

    it('update() modifica campos del item', async () => {
        const key = await idb.add({ url: 'a.ics' });
        await idb.update(key, { status: 'synced', syncedAt: 123 });
        const all = await idb.getAll();
        expect(all[0].status).toBe('synced');
        expect(all[0].syncedAt).toBe(123);
    });

    it('update() falla si el item no existe', async () => {
        await expect(idb.update(9999, { status: 'x' })).rejects.toThrow('Item not found');
    });

    it('delete() elimina un item', async () => {
        const k1 = await idb.add({ url: 'a.ics' });
        const k2 = await idb.add({ url: 'b.ics' });
        await idb.delete(k1);
        const all = await idb.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].id).toBe(k2);
    });

    it('clear() vacia la cola completa', async () => {
        await idb.add({ url: 'a.ics' });
        await idb.add({ url: 'b.ics' });
        await idb.clear();
        expect(await idb.getAll()).toHaveLength(0);
    });
});

describe('notifStore (IndexedDB schedule notificaciones)', () => {
    beforeEach(async () => {
        const all = await notifStore.getAll();
        for (const item of all) await notifStore.delete(item.id);
    });

    it('add() guarda item con timestamp', async () => {
        const key = await notifStore.add({ type: 'shabat', date: '2026-08-14', title: 'Shabat' });
        expect(key).toBeGreaterThan(0);
        const all = await notifStore.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].date).toBe('2026-08-14');
        expect(all[0].timestamp).toBeGreaterThan(0);
    });

    it('findByDate() busca por indice date y devuelve el primero o null', async () => {
        await notifStore.add({ type: 'fiesta', date: '2026-09-10', title: 'Yom Teruah' });
        const found = await notifStore.findByDate('2026-09-10');
        expect(found).not.toBeNull();
        expect(found.title).toBe('Yom Teruah');
        expect(await notifStore.findByDate('2030-01-01')).toBeNull();
    });

    it('markShown() marca como mostrado', async () => {
        const key = await notifStore.add({ type: 'shabat', date: '2026-08-14' });
        await notifStore.markShown(key);
        const all = await notifStore.getAll();
        expect(all[0].shown).toBe(true);
    });

    it('markShown() sobre id inexistente no lanza', async () => {
        await expect(notifStore.markShown(9999)).resolves.toBeUndefined();
    });

    it('delete() elimina un item', async () => {
        const k1 = await notifStore.add({ type: 'a', date: '2026-08-01' });
        const k2 = await notifStore.add({ type: 'b', date: '2026-08-02' });
        await notifStore.delete(k1);
        const all = await notifStore.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].id).toBe(k2);
    });

    it('cleanup() borra items shown con mas de 30 dias', async () => {
        const viejo = await notifStore.add({ type: 'a', date: '2026-08-01' });
        const nuevo = await notifStore.add({ type: 'b', date: '2026-08-02' });
        await notifStore.markShown(viejo);
        await notifStore.markShown(nuevo);
        // Envejecer timestamp del item viejo
        const all1 = await notifStore.getAll();
        for (const item of all1) {
            if (item.id === viejo) {
                const db = await new Promise((res, rej) => {
                    const r = indexedDB.open('qumran-notif-db', 1);
                    r.onsuccess = () => res(r.result);
                    r.onerror = () => rej(r.error);
                });
                const tx = db.transaction('schedule', 'readwrite');
                const store = tx.objectStore('schedule');
                const g = store.get(viejo);
                g.onsuccess = () => {
                    const it = g.result;
                    it.timestamp = Date.now() - 31 * 24 * 60 * 60 * 1000;
                    store.put(it);
                };
            }
        }
        // Esperar microtasks de IndexedDB
        await new Promise((r) => setTimeout(r, 10));
        await notifStore.cleanup();
        const remaining = await notifStore.getAll();
        expect(remaining.some((i) => i.id === viejo)).toBe(false);
        expect(remaining.some((i) => i.id === nuevo)).toBe(true);
    });
});
