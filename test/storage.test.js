import { describe, it, expect, vi, afterEach } from 'vitest';
import { storage } from '../src/js/core/storage.js';

describe('storage (wrapper localStorage con fallback memoria)', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('setItem/getItem con localStorage funcional', () => {
        const store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: (k) => { delete store[k]; },
            clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        });
        storage.setItem('qw_lat', 31.7683);
        expect(storage.getItem('qw_lat')).toBe('31.7683');
        expect(storage.getItem('no-existe')).toBeNull();
    });

    it('removeItem borra la clave', () => {
        const store = { qw_lat: '31.7683' };
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: (k) => { delete store[k]; },
            clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        });
        storage.removeItem('qw_lat');
        expect(storage.getItem('qw_lat')).toBeNull();
    });

    it('clear vacia todo', () => {
        const store = { a: '1', b: '2' };
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: (k) => { delete store[k]; },
            clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        });
        storage.clear();
        expect(storage.getItem('a')).toBeNull();
        expect(storage.getItem('b')).toBeNull();
    });

    it('cae a memoria si localStorage lanza (modo incognito)', () => {
        vi.stubGlobal('localStorage', {
            getItem: () => { throw new Error('SecurityError'); },
            setItem: () => { throw new Error('SecurityError'); },
            removeItem: () => { throw new Error('SecurityError'); },
            clear: () => { throw new Error('SecurityError'); },
        });
        storage.setItem('qw_lat', 31.7683);
        expect(storage.getItem('qw_lat')).toBe('31.7683');
        storage.removeItem('qw_lat');
        expect(storage.getItem('qw_lat')).toBeNull();
    });

    it('clear en modo incognito vacia la memoria', () => {
        vi.stubGlobal('localStorage', {
            getItem: () => { throw new Error('SecurityError'); },
            setItem: () => { throw new Error('SecurityError'); },
            removeItem: () => { throw new Error('SecurityError'); },
            clear: () => { throw new Error('SecurityError'); },
        });
        storage.setItem('a', '1');
        storage.setItem('b', '2');
        storage.clear();
        expect(storage.getItem('a')).toBeNull();
        expect(storage.getItem('b')).toBeNull();
    });
});
