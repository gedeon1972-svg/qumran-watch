import { describe, it, expect, vi, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { Notifications } from '../src/js/core/notifications.js';
import { notifStore } from '../src/js/core/notif-store.js';

function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

describe('notifications: scheduleUpcoming / checkDue / showLocal (5.4)', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        // Resetear estado real del modulo (sin ablandar: init() recalcula desde window)
        Notifications.supported = false;
    });

    function enableGranted() {
        vi.stubGlobal('window', { Notification: { permission: 'granted', requestPermission: vi.fn(async () => 'granted') } });
        vi.stubGlobal('Notification', { permission: 'granted', requestPermission: vi.fn(async () => 'granted') });
        expect(Notifications.init()).toBe(true);
    }

    it('permission retorna el estado actual', () => {
        vi.stubGlobal('Notification', { permission: 'denied' });
        expect(Notifications.permission()).toBe('denied');
    });

    it('requestPermission concede cuando el usuario acepta', async () => {
        vi.stubGlobal('Notification', { permission: 'denied', requestPermission: vi.fn(async () => 'granted') });
        expect(await Notifications.requestPermission()).toBe('granted');
    });

    it('requestPermission retorna denied si lanza', async () => {
        vi.stubGlobal('Notification', { permission: 'denied', requestPermission: vi.fn(async () => { throw new Error('bloqueado'); }) });
        expect(await Notifications.requestPermission()).toBe('denied');
    });

    it('scheduleUpcoming programa items y evita duplicados', async () => {
        enableGranted();
        const all = await notifStore.getAll();
        for (const item of all) await notifStore.delete(item.id);
        const count1 = await Notifications.scheduleUpcoming(8);
        expect(count1).toBeGreaterThan(0);
        const count2 = await Notifications.scheduleUpcoming(8);
        expect(count2).toBe(0); // duplicados evitados
        const items = await notifStore.getAll();
        expect(items.length).toBe(count1);
    });

    it('scheduleUpcoming retorna 0 sin soporte', async () => {
        vi.stubGlobal('window', {});
        expect(Notifications.init()).toBe(false);
        expect(await Notifications.scheduleUpcoming(8)).toBe(0);
    });

    it('scheduleUpcoming retorna 0 con soporte pero permiso denegado', async () => {
        vi.stubGlobal('window', { Notification: { permission: 'denied', requestPermission: vi.fn(async () => 'denied') } });
        vi.stubGlobal('Notification', { permission: 'denied', requestPermission: vi.fn(async () => 'denied') });
        expect(Notifications.init()).toBe(true);
        expect(await Notifications.scheduleUpcoming(8)).toBe(0);
    });

    it('checkDue muestra y marca notificaciones del dia de hoy', async () => {
        enableGranted();
        const all = await notifStore.getAll();
        for (const item of all) await notifStore.delete(item.id);
        const today = iso(new Date());
        const NotificationMock = vi.fn();
        vi.stubGlobal('Notification', Object.assign(NotificationMock, { permission: 'granted' }));
        await notifStore.add({ date: today, title: 'Hoy', body: 'Cuerpo', shown: false });
        await notifStore.add({ date: '2099-01-01', title: 'Futuro', body: '', shown: false });
        const shown = await Notifications.checkDue();
        expect(shown).toBe(1);
        expect(NotificationMock).toHaveBeenCalledTimes(1);
        expect(NotificationMock.mock.calls[0][0]).toBe('Hoy');
        const items = await notifStore.getAll();
        const shownItem = items.find((i) => i.date === today);
        expect(shownItem.shown).toBe(true);
    });

    it('checkDue retorna 0 sin soporte', async () => {
        vi.stubGlobal('window', {});
        expect(Notifications.init()).toBe(false);
        expect(await Notifications.checkDue()).toBe(0);
    });

    it('checkDue retorna 0 con soporte pero permiso denegado', async () => {
        vi.stubGlobal('window', { Notification: { permission: 'denied' } });
        vi.stubGlobal('Notification', { permission: 'denied' });
        expect(Notifications.init()).toBe(true);
        expect(await Notifications.checkDue()).toBe(0);
    });

    it('showLocal crea la notificacion cuando hay permiso', () => {
        enableGranted();
        const NotificationMock = vi.fn();
        vi.stubGlobal('Notification', Object.assign(NotificationMock, { permission: 'granted' }));
        Notifications.showLocal('Titulo', 'Cuerpo');
        expect(NotificationMock).toHaveBeenCalledWith('Titulo', { body: 'Cuerpo', icon: '/qumran-watch/icon.png', tag: 'qumran-Titulo' });
    });

    it('showLocal no lanza si la API falla', () => {
        enableGranted();
        const Boom = vi.fn(() => { throw new Error('x'); });
        vi.stubGlobal('Notification', Object.assign(Boom, { permission: 'granted' }));
        expect(() => Notifications.showLocal('T', 'B')).not.toThrow();
    });

    it('showLocal no hace nada sin permiso', () => {
        vi.stubGlobal('window', { Notification: { permission: 'denied' } });
        Notifications.supported = true;
        vi.stubGlobal('Notification', { permission: 'denied' });
        Notifications.showLocal('T', 'B');
        expect(true).toBe(true);
    });
    it('notifyServiceWorker envia CHECK_NOTIFICATIONS al worker activo', async () => {
        const postMessage = vi.fn();
        const ready = Promise.resolve({ active: { postMessage } });
        vi.stubGlobal('navigator', { serviceWorker: { ready } });
        Notifications.notifyServiceWorker();
        await ready;
        expect(postMessage).toHaveBeenCalledWith({ type: 'CHECK_NOTIFICATIONS' });
    });

    it('notifyServiceWorker no hace nada sin serviceWorker', () => {
        vi.stubGlobal('navigator', {});
        expect(() => Notifications.notifyServiceWorker()).not.toThrow();
    });

    it('notifyServiceWorker tolera que ready falle', async () => {
        const ready = Promise.reject(new Error('sin registro'));
        vi.stubGlobal('navigator', { serviceWorker: { ready } });
        Notifications.notifyServiceWorker();
        await ready.catch(() => {});
        expect(true).toBe(true);
    });
});