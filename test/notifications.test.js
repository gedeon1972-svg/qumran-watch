// test/notifications.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { QumranData } from '../src/js/core/data.js';

const { Notifications } = await import('../src/js/core/notifications.js');

describe('Notificaciones locales (sin backend)', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('computeUpcoming detecta Shabat de preparacion (idxSem=5)', () => {
        const items = Notifications.computeUpcoming(8);
        const shabats = items.filter((i) => i.type === 'shabat');
        expect(shabats.length).toBeGreaterThan(0);
        expect(shabats[0].title).toContain('Preparacion');
    });

    it('computeUpcoming detecta Fiestas con titulo Fiesta de YHWH', () => {
        const items = Notifications.computeUpcoming(365);
        const fiestas = items.filter((i) => i.type === 'fiesta');
        expect(fiestas.length).toBeGreaterThan(0);
        expect(fiestas[0].title).toContain('Fiesta de YHWH');
        // Todas las fechas son ISO valida
        for (const item of items) {
            expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
    });

    it('init retorna false sin soporte de Notification', () => {
        expect(Notifications.init()).toBe(false);
    });

    it('init retorna true cuando Notification existe en window', () => {
        vi.stubGlobal('window', {
            Notification: {
                permission: 'granted',
                requestPermission: vi.fn(async () => 'granted'),
            },
        });
        vi.stubGlobal('Notification', {
            permission: 'granted',
            requestPermission: vi.fn(async () => 'granted'),
        });
        expect(Notifications.init()).toBe(true);
    });

    it('requestPermission retorna unsupported sin soporte', async () => {
        expect(await Notifications.requestPermission()).toBe('unsupported');
    });

    it('todas las fiestas de QumranData tienen nombre', () => {
        for (const f of QumranData.FIESTAS) {
            expect(f.n.length).toBeGreaterThan(0);
            expect(typeof f.es).toBe('string');
        }
    });
});
