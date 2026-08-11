import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';

const mockOpenPrintWindow = vi.hoisted(() => vi.fn());

vi.mock('../src/js/ui/print-view.js', () => ({
    openPrintWindow: mockOpenPrintWindow,
}));

import { renderCalendarView } from '../src/js/ui/calendar-view.js';

function buildMock() {
    const els = {};
    const addEl = (id) => {
        const el = {
            id,
            innerHTML: '',
            style: {},
            value: '2024',
            classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn(() => false) },
            addEventListener: vi.fn((ev, cb) => {
                el._handlers[ev] = cb;
            }),
            _handlers: {},
            querySelector: vi.fn(() => el),
            insertBefore: vi.fn(),
            parentElement: null,
        };
        els[id] = el;
        return el;
    };
    addEl('cal-lista');
    addEl('cal-print-toolbar');
    addEl('btn-print-cal');
    addEl('cal-year');

    const doc = {
        getElementById: vi.fn((id) => els[id] || null),
        createElement: vi.fn((t) => {
            const el = {
                tag: t,
                id: '',
                className: '',
                innerHTML: '',
                addEventListener: vi.fn((ev, cb) => {
                    el._handlers[ev] = cb;
                }),
                _handlers: {},
                querySelector: vi.fn(() => el),
            };
            return el;
        }),
    };
    return { els, doc };
}

function buildFestivals(overrides) {
    return [
        {
            date: new Date('2024-03-20T00:00:00Z'),
            q: { m: 0, d: 1 },
            index: 0,
        },
        Object.assign(
            {
                date: new Date('2024-04-03T00:00:00Z'),
                q: { m: 0, d: 15 },
                index: 3,
            },
            overrides,
        ),
    ];
}

describe('renderCalendarView', () => {
    let mock;
    beforeEach(() => {
        mock = buildMock();
        vi.stubGlobal('document', mock.doc);
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        mockOpenPrintWindow.mockReset();
    });

    test('retorna si no existe cal-lista', () => {
        mock.doc.getElementById.mockReturnValue(null);
        expect(() => renderCalendarView(buildFestivals(), 2024)).not.toThrow();
    });

    test('inserta el toolbar de impresion si no existe', () => {
        mock.doc.getElementById.mockImplementation((id) => {
            if (id === 'cal-print-toolbar') return null;
            return mock.els[id] || null;
        });
        const list = mock.els['cal-lista'];
        list.parentElement = { insertBefore: vi.fn() };
        renderCalendarView(buildFestivals(), 2024);
        expect(mock.doc.createElement).toHaveBeenCalled();
        expect(list.parentElement.insertBefore).toHaveBeenCalled();
    });

    test('no inserta toolbar si ya existe', () => {
        mock.els['cal-print-toolbar'].parentElement = mock.els['cal-lista'].parentElement = {
            insertBefore: vi.fn(),
        };
        renderCalendarView(buildFestivals(), 2024);
        expect(mock.els['cal-lista'].parentElement.insertBefore).not.toHaveBeenCalled();
    });

    test('no inserta toolbar si no hay calContainer', () => {
        mock.els['cal-lista'].parentElement = null;
        renderCalendarView(buildFestivals(), 2024);
        expect(mock.doc.createElement).not.toHaveBeenCalled();
    });

    test('el boton del toolbar abre la ventana de impresion', () => {
        mock.doc.getElementById.mockImplementation((id) => {
            if (id === 'cal-print-toolbar') return null;
            return mock.els[id] || null;
        });
        const list = mock.els['cal-lista'];
        list.parentElement = { insertBefore: vi.fn() };
        renderCalendarView(buildFestivals(), 2024);
        const btn = mock.doc.createElement.mock.results.find((r) => r.value.tag === 'div').value;
        expect(btn._handlers.click).toBeTruthy();
        btn._handlers.click();
        expect(mockOpenPrintWindow).toHaveBeenCalledWith(2024);
    });

    test('muestra rango de fechas para fiestas con dur > 1', () => {
        mock.doc.getElementById.mockImplementation((id) => {
            if (id === 'cal-print-toolbar') return null;
            return mock.els[id] || null;
        });
        renderCalendarView(buildFestivals(), 2024);
        expect(mock.els['cal-lista'].innerHTML).toContain(' - ');
    });

    test('no muestra rango para fiestas sin dur', () => {
        mock.doc.getElementById.mockImplementation((id) => {
            if (id === 'cal-print-toolbar') return null;
            return mock.els[id] || null;
        });
        const short = { date: new Date('2024-03-20T00:00:00Z'), q: { m: 0, d: 1 }, index: 0 };
        renderCalendarView([short], 2024);
        expect(mock.els['cal-lista'].innerHTML).not.toContain(' - ');
    });

    test('muestra mensaje cuando no hay fiestas', () => {
        mock.doc.getElementById.mockImplementation((id) => {
            if (id === 'cal-print-toolbar') return null;
            return mock.els[id] || null;
        });
        renderCalendarView([], 2024);
        expect(mock.els['cal-lista'].innerHTML).toContain('No se encontraron fiestas');
    });
});
