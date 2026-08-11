import { expect, test, describe, vi, beforeAll, beforeEach } from 'vitest';
import { QumranCalendar } from '../src/js/core/calendar.js';

const mockIdb = vi.hoisted(() => {
    const state = {
        pending: [],
        completed: [],
        deleted: [],
        updates: [],
    };
    return {
        __reset() {
            state.pending = [];
            state.completed = [];
            state.deleted = [];
            state.updates = [];
        },
        __setPending(items) {
            state.pending = items;
        },
        __setCompleted(items) {
            state.completed = items;
        },
        get deleted() {
            return state.deleted;
        },
        get updates() {
            return state.updates;
        },
        add: vi.fn(async ({ year }) => 'id-' + year),
        getAll: vi.fn(async (status) => {
            if (status === 'pending') return state.pending;
            if (status === 'completed') return state.completed;
            return [];
        }),
        update: vi.fn(async (id, changes) => {
            state.updates.push({ id, ...changes });
        }),
        delete: vi.fn(async (id) => {
            state.deleted.push(id);
        }),
        clear: vi.fn(async () => {}),
    };
});

vi.mock('../src/js/core/idb.js', () => ({
    idb: mockIdb,
}));

import { QumranICS } from '../src/js/ics.js';
describe('QumranICS.findLiturgicalStart', () => {
    test('para 2019 debe encontrar 20 de Marzo (1 Aviv)', () => {
        const start = QumranICS.findLiturgicalStart(2019);
        expect(start).toBeInstanceOf(Date);
        const q = QumranCalendar.calculate(start);
        expect(q).not.toBeNull();
        expect(q.m).toBe(0);
        expect(q.d).toBe(1);
    });

    test('para 2024 debe encontrar el 1 de Aviv', () => {
        const start = QumranICS.findLiturgicalStart(2024);
        expect(start).toBeInstanceOf(Date);
        const q = QumranCalendar.calculate(start);
        expect(q).not.toBeNull();
        expect(q.m).toBe(0);
        expect(q.d).toBe(1);
    });

    test('para año anterior al ancla (2018) debe retornar null', () => {
        const start = QumranICS.findLiturgicalStart(2018);
        expect(start).toBeNull();
    });

    test('para años futuros debe encontrar fecha', () => {
        const start = QumranICS.findLiturgicalStart(2026);
        expect(start).toBeInstanceOf(Date);
        const q = QumranCalendar.calculate(start);
        expect(q).not.toBeNull();
        expect(q.m).toBe(0);
        expect(q.d).toBe(1);
    });
});

describe('QumranICS.generateAndDownload', () => {
    beforeAll(() => {
        vi.stubGlobal('window', {
            URL: {
                createObjectURL: vi.fn(() => 'blob:test'),
                revokeObjectURL: vi.fn(),
            },
        });
        vi.stubGlobal('document', {
            createElement: vi.fn(() => ({
                href: '',
                download: '',
                click: vi.fn(),
            })),
            body: {
                appendChild: vi.fn(),
                removeChild: vi.fn(),
            },
        });
    });

    test('debe lanzar error para año inválido (2018)', () => {
        expect(() => QumranICS.generateAndDownload(2018)).toThrow();
    });

    test('el contenido ICS debe comenzar con BEGIN:VCALENDAR y terminar con END:VCALENDAR', () => {
        let captured = '';
        vi.stubGlobal('Blob', function (content, _options) {
            captured = content[0];
        });

        QumranICS.generateAndDownload(2024);
        expect(captured).toContain('BEGIN:VCALENDAR');
        expect(captured).toContain('END:VCALENDAR');
    });

    test('el contenido ICS debe incluir eventos de fiestas y shabat', () => {
        let captured = '';
        vi.stubGlobal('Blob', function (content, _options) {
            captured = content[0];
        });

        QumranICS.generateAndDownload(2024);
        expect(captured).toContain('BEGIN:VEVENT');
        expect(captured).toContain('SUMMARY:Fiesta de YHWH');
        expect(captured).toContain('SUMMARY:Shabat');
        expect(captured).toContain('VALARM');
    });
});

describe('QumranICS.queueICSForSync', () => {
    test('encola y registra background sync cuando está disponible', async () => {
        const register = vi.fn().mockResolvedValue(undefined);
        const mockNavigator = {
            serviceWorker: { ready: Promise.resolve({ sync: { register } }) },
            onLine: false,
        };
        vi.stubGlobal('navigator', mockNavigator);
        vi.stubGlobal('window', {
            ServiceWorkerRegistration: { prototype: { sync: {} } },
            URL: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() },
        });
        vi.stubGlobal('document', { createElement: vi.fn(), body: { appendChild: vi.fn(), removeChild: vi.fn() } });

        const id = await QumranICS.queueICSForSync(2024);
        expect(id).toBe('id-2024');
        expect(register).toHaveBeenCalledWith('ics-sync');
    });

    test('encola sin registrar sync cuando no hay soporte de ServiceWorkerRegistration', async () => {
        const mockNavigator = { serviceWorker: undefined, onLine: false };
        vi.stubGlobal('navigator', mockNavigator);
        vi.stubGlobal('window', {
            ServiceWorkerRegistration: { prototype: {} },
            URL: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() },
        });

        const id = await QumranICS.queueICSForSync(2024);
        expect(id).toBe('id-2024');
    });

    test('lanza error y genera directamente si hay conexión en el fallback', async () => {
        const spy = vi.spyOn(QumranICS, 'generateAndDownload').mockImplementation(() => {});
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.stubGlobal('navigator', { serviceWorker: undefined, onLine: true });
        vi.stubGlobal('window', { ServiceWorkerRegistration: { prototype: {} } });

        mockIdb.add.mockRejectedValueOnce(new Error('db fail'));
        await expect(QumranICS.queueICSForSync(2024)).rejects.toThrow('db fail');
        expect(spy).toHaveBeenCalledWith(2024);
        expect(warn).toHaveBeenCalled();
        spy.mockRestore();
        warn.mockRestore();
    });
});

describe('QumranICS.processICSSyncQueue', () => {
    beforeEach(() => {
        mockIdb.__reset();
        vi.stubGlobal('navigator', { onLine: true });
        vi.stubGlobal('window', { URL: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() } });
        vi.stubGlobal('document', {
            createElement: vi.fn(() => ({ click: vi.fn(), href: '', download: '' })),
            body: { appendChild: vi.fn(), removeChild: vi.fn() },
        });
    });

    test('retorna 0 procesados cuando no hay pendientes', async () => {
        const result = await QumranICS.processICSSyncQueue();
        expect(result).toEqual({ processed: 0 });
    });

    test('procesa los pendientes y limpia completados antiguos', async () => {
        const spy = vi.spyOn(QumranICS, 'generateAndDownload').mockImplementation(() => {});
        mockIdb.__setPending([
            { id: 1, year: 2024, status: 'pending' },
            { id: 2, year: 2025, status: 'pending' },
        ]);
        mockIdb.__setCompleted([{ id: 3, year: 2024, completedAt: Date.now() - 25 * 60 * 60 * 1000 }]);

        const result = await QumranICS.processICSSyncQueue();
        expect(result).toEqual({ processed: 2 });
        expect(spy).toHaveBeenCalledTimes(2);
        expect(mockIdb.deleted).toContain(3);
        expect(mockIdb.updates).toEqual(expect.arrayContaining([{ id: 1, status: 'processing' }]));
        spy.mockRestore();
    });

    test('no borra completados recientes', async () => {
        const spy = vi.spyOn(QumranICS, 'generateAndDownload').mockImplementation(() => {});
        mockIdb.__setPending([{ id: 1, year: 2024 }]);
        mockIdb.__setCompleted([{ id: 4, year: 2024, completedAt: Date.now() - 1000 }]);

        await QumranICS.processICSSyncQueue();
        expect(mockIdb.deleted).not.toContain(4);
        spy.mockRestore();
    });

    test('marca como failed si la generación lanza error', async () => {
        const spy = vi.spyOn(QumranICS, 'generateAndDownload').mockImplementation(() => {
            throw new Error('gen error');
        });
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockIdb.__setPending([{ id: 5, year: 2024 }]);

        const result = await QumranICS.processICSSyncQueue();
        expect(result).toEqual({ processed: 0 });
        expect(mockIdb.updates).toContainEqual({ id: 5, status: 'failed', error: 'gen error' });
        expect(err).toHaveBeenCalled();
        spy.mockRestore();
        err.mockRestore();
    });
});
