import { describe, it, expect, vi, afterEach } from 'vitest';
import { calcSunTimesPure } from '../src/js/core/sun-algo.js';

const JERUSALEM = { lat: 31.7683, lng: 35.2137 };

describe('sun-worker-client (5.2)', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        vi.resetModules();
    });

    it('usa worker cuando esta disponible y resuelve con el resultado', async () => {
        const date = new Date(2024, 5, 15);
        const expected = calcSunTimesPure(date, JERUSALEM.lat, JERUSALEM.lng);
        const workerInstance = {
            postMessage: vi.fn((msg) => {
                setTimeout(() => {
                    if (workerInstance.onmessage) {
                        workerInstance.onmessage({ data: { id: msg.id, result: expected } });
                    }
                }, 0);
            }),
            onmessage: null,
            onerror: null,
        };
        vi.stubGlobal(
            'Worker',
            vi.fn(function () {
                return workerInstance;
            }),
        );
        vi.resetModules();
        const { calcSunTimesAsync } = await import('../src/js/core/sun-worker-client.js');
        const result = await calcSunTimesAsync(date, JERUSALEM.lat, JERUSALEM.lng);
        expect(result).toEqual(expected);
        expect(workerInstance.postMessage).toHaveBeenCalledTimes(1);
    });

    it('si worker responde con error, rechaza la promesa', async () => {
        const date = new Date(2024, 5, 15);
        const workerInstance = {
            postMessage: vi.fn((msg) => {
                setTimeout(() => {
                    if (workerInstance.onmessage) {
                        workerInstance.onmessage({ data: { id: msg.id, error: 'boom' } });
                    }
                }, 0);
            }),
            onmessage: null,
            onerror: null,
        };
        vi.stubGlobal(
            'Worker',
            vi.fn(function () {
                return workerInstance;
            }),
        );
        vi.resetModules();
        const { calcSunTimesAsync } = await import('../src/js/core/sun-worker-client.js');
        await expect(calcSunTimesAsync(date, JERUSALEM.lat, JERUSALEM.lng)).rejects.toThrow('boom');
    });

    it('si postMessage lanza, cae al fallback sincrono', async () => {
        const date = new Date(2024, 5, 15);
        const expected = calcSunTimesPure(date, JERUSALEM.lat, JERUSALEM.lng);
        const workerInstance = {
            postMessage: vi.fn(() => {
                throw new Error('worker muerto');
            }),
            onmessage: null,
            onerror: null,
        };
        vi.stubGlobal(
            'Worker',
            vi.fn(function () {
                return workerInstance;
            }),
        );
        vi.resetModules();
        const { calcSunTimesAsync } = await import('../src/js/core/sun-worker-client.js');
        const result = await calcSunTimesAsync(date, JERUSALEM.lat, JERUSALEM.lng);
        expect(result).toEqual(expected);
    });

    it('si worker no responde en 1s, cae al fallback sincrono (timeout)', async () => {
        vi.useFakeTimers();
        const date = new Date(2024, 5, 15);
        const expected = calcSunTimesPure(date, JERUSALEM.lat, JERUSALEM.lng);
        const workerInstance = { postMessage: vi.fn(), onmessage: null, onerror: null };
        vi.stubGlobal(
            'Worker',
            vi.fn(function () {
                return workerInstance;
            }),
        );
        vi.resetModules();
        const { calcSunTimesAsync } = await import('../src/js/core/sun-worker-client.js');
        const promise = calcSunTimesAsync(date, JERUSALEM.lat, JERUSALEM.lng);
        await vi.advanceTimersByTimeAsync(1100);
        const result = await promise;
        expect(result).toEqual(expected);
    });

    it('si worker dispara onerror, las siguientes llamadas usan fallback', async () => {
        const date = new Date(2024, 5, 15);
        const expected = calcSunTimesPure(date, JERUSALEM.lat, JERUSALEM.lng);
        const workerInstance = { postMessage: vi.fn(), onmessage: null, onerror: null };
        vi.stubGlobal(
            'Worker',
            vi.fn(function () {
                return workerInstance;
            }),
        );
        vi.resetModules();
        const { calcSunTimesAsync } = await import('../src/js/core/sun-worker-client.js');
        // primera llamada queda pendiente en worker
        const p1 = calcSunTimesAsync(date, JERUSALEM.lat, JERUSALEM.lng);
        // el worker muere
        workerInstance.onerror();
        // segunda llamada debe caer al fallback (workerOk false)
        const p2 = calcSunTimesAsync(date, JERUSALEM.lat, JERUSALEM.lng);
        expect(await p2).toEqual(expected);
        // p1 nunca respondio -> timeout 1s lo resuelve con fallback tambien
        const result1 = await p1;
        expect(result1).toEqual(expected);
    });
});
