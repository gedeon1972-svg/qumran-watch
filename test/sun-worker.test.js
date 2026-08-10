
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calcSunTimesPure } from '../src/js/core/sun-algo.js';

const JERUSALEM = { lat: 31.7683, lng: 35.2137 };

describe('sun-worker.js (5.5)', () => {
    let posted;
    let selfMock;

    beforeEach(() => {
        posted = [];
        selfMock = {
            onmessage: null,
            postMessage: (msg) => posted.push(msg),
        };
        vi.stubGlobal('self', selfMock);
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('registra onmessage al importarse', async () => {
        await import('../src/js/core/sun-worker.js');
        expect(typeof selfMock.onmessage).toBe('function');
    });

    it('responde con el resultado calculado por sun-algo', async () => {
        await import('../src/js/core/sun-worker.js');
        const date = new Date(2024, 5, 15);
        const expected = calcSunTimesPure(date, JERUSALEM.lat, JERUSALEM.lng);
        selfMock.onmessage({ data: { id: 7, date, lat: JERUSALEM.lat, lng: JERUSALEM.lng } });
        expect(posted).toHaveLength(1);
        expect(posted[0].id).toBe(7);
        expect(posted[0].error).toBeNull();
        expect(posted[0].result).toEqual(expected);
    });

    it('tolera data nula y devuelve resultado (null-safe)', async () => {
        await import('../src/js/core/sun-worker.js');
        selfMock.onmessage({ data: null });
        expect(posted).toHaveLength(1);
        expect(posted[0]).toHaveProperty('id');
        expect(posted[0].id).toBeUndefined();
    });

    it('captura el error si el algoritmo lanza', async () => {
        vi.spyOn(await import('../src/js/core/sun-algo.js'), 'calcSunTimesPure').mockImplementation(() => {
            throw new Error('boom');
        });
        await import('../src/js/core/sun-worker.js');
        selfMock.onmessage({ data: { id: 9, date: new Date(2024, 5, 15), lat: 31.7683, lng: 35.2137 } });
        expect(posted).toHaveLength(1);
        expect(posted[0].id).toBe(9);
        expect(posted[0].result).toBeNull();
        expect(posted[0].error).toContain('boom');
    });
});
