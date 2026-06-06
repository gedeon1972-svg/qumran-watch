import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';

let mockDoc, mockElements, appRef;

function buildDoc() {
    const els = {};

    const addEl = (id) => {
        let _innerText = '';
        let _innerHTML = '';
        let _value = '';
        const el = {
            id,
            get innerText() {
                return _innerText;
            },
            set innerText(v) {
                _innerText = String(v);
            },
            get innerHTML() {
                return _innerHTML;
            },
            set innerHTML(v) {
                _innerHTML = String(v);
            },
            get value() {
                return _value;
            },
            set value(v) {
                _value = String(v);
            },
            style: { display: 'none', width: '0%', background: '', _v: {} },
            classList: {
                _c: new Set(),
                add(x) {
                    this._c.add(x);
                },
                remove(x) {
                    this._c.delete(x);
                },
                toggle(x, f) {
                    if (f !== undefined) {
                        if (f) this._c.add(x);
                        else this._c.delete(x);
                    } else if (this._c.has(x)) this._c.delete(x);
                    else this._c.add(x);
                },
                contains(x) {
                    return this._c.has(x);
                },
            },
            dataset: {},
            addEventListener: vi.fn(),
            closest: vi.fn(() => null),
            click: vi.fn(),
        };
        els[id] = el;
        return el;
    };

    [
        'nav-hoy',
        'nav-lit',
        'nav-cal',
        'nav-con',
        'nav-edu',
        'alert-container',
        'alert-msg',
        'btn-install',
        'btn-refresh',
        'update-toast',
        'geo-btn',
        'sun-container',
        'sun-rise',
        'sun-set',
        'greg-date',
        'heb-date',
        'heb-dia',
        'heb-turno',
        'heb-estacion',
        'heb-fiesta',
        'heb-puerta-num',
        'shabat-progress',
        'shabat-text',
        'card-omer',
        'omer-count',
        'card-teshuva',
        'teshuva-cmd',
        'teshuva-ref',
        'messiah-theme',
        'messiah-hebrew',
        'messiah-context',
        'messiah-philology',
        'messiah-quote',
        'messiah-action',
        'lit-main-title',
        'page-lit-type',
        'page-lit-title',
        'page-lit-text',
        'btn-render-cal',
        'cal-year',
        'cal-lista',
        'btn-export-ics',
        'edu-grid',
        'btn-podcast-con',
        'btn-institute-con',
        'modal-fiesta',
        'modal-lectura',
        'btn-close-modal',
        'btn-close-lectura',
        'mod-title',
        'mod-fechas',
        'mod-fechas-heb',
        'mod-instr',
        'mod-ref',
        'mod-note',
        'mod-warn',
        'lec-title',
        'lec-meta',
        'lec-body',
        'view-hoy',
        'view-lit',
        'view-cal',
        'view-con',
        'view-edu',
    ].forEach(addEl);
    els['view-hoy'].classList.add('active');

    const gateDot = () => ({
        classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn(() => false) },
        dataset: {},
    });

    return {
        doc: {
            getElementById: vi.fn((id) => els[id] || null),
            querySelectorAll: vi.fn((sel) => {
                const p = sel === '.view' ? 'view-' : sel === '.nav-btn' ? 'nav-' : null;
                if (p) return Object.values(els).filter((e) => e.id && e.id.startsWith(p));
                if (sel === '.gate-dot') return Array.from({ length: 6 }, gateDot);
                return [];
            }),
            querySelector: vi.fn(() => null),
            createElement: vi.fn((t) => ({
                tag: t,
                href: '',
                download: '',
                click: vi.fn(),
                style: {},
                classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
                addEventListener: vi.fn(),
            })),
            body: { appendChild: vi.fn(), removeChild: vi.fn() },
            documentElement: { style: {} },
            addEventListener: vi.fn(),
        },
        els,
    };
}

beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();

    const built = buildDoc();
    mockDoc = built.doc;
    mockElements = built.els;
    vi.stubGlobal('document', mockDoc);

    const store = {};
    vi.stubGlobal('localStorage', {
        getItem: vi.fn((k) => store[k] ?? null),
        setItem: vi.fn((k, v) => {
            store[k] = String(v);
        }),
        removeItem: vi.fn((k) => {
            delete store[k];
        }),
    });

    const win = {
        location: { hash: '', href: '', pathname: '/' },
        history: { replaceState: vi.fn(), pushState: vi.fn() },
        addEventListener: vi.fn(),
        navigator: { serviceWorker: undefined, geolocation: undefined },
        open: vi.fn(),
        scrollTo: vi.fn(),
    };
    vi.stubGlobal('window', win);
    vi.stubGlobal('navigator', win.navigator);
    vi.stubGlobal('Blob', vi.fn());
    vi.stubGlobal('URL', { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() });

    await import('../src/js/app.js');
    appRef = win.QumranApp;
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('Estructura', () => {
    test('debe tener todos los métodos principales', () => {
        expect(appRef).toBeDefined();
        expect(typeof appRef.init).toBe('function');
        expect(typeof appRef.nav).toBe('function');
        expect(typeof appRef.loadStoredLocation).toBe('function');
        expect(typeof appRef.checkWatcher).toBe('function');
        expect(typeof appRef.renderHoy).toBe('function');
        expect(typeof appRef.openFiesta).toBe('function');
        expect(typeof appRef.openFiestaHoy).toBe('function');
        expect(typeof appRef.renderSaber).toBe('function');
        expect(typeof appRef.openEstudio).toBe('function');
        expect(typeof appRef.renderCalendar).toBe('function');
    });
});

describe('nav', () => {
    test('activa vista correcta', () => {
        mockElements['view-hoy'].classList.remove('active');
        appRef.nav('lit', null, true);
        expect(mockElements['view-lit'].classList.contains('active')).toBe(true);
        expect(mockElements['view-hoy'].classList.contains('active')).toBe(false);
    });

    test('pushState en navegación manual', () => {
        appRef.nav('cal', null, false);
        expect(window.history.pushState).toHaveBeenCalledWith({ view: 'cal' }, '', '#cal');
    });

    test('no pushState en evento histórico', () => {
        appRef.nav('con', null, true);
        expect(window.history.pushState).not.toHaveBeenCalled();
    });
});

describe('loadStoredLocation', () => {
    test('carga desde localStorage si existe', () => {
        localStorage.setItem('qw_lat', '31.7683');
        localStorage.setItem('qw_lng', '35.2137');
        expect(appRef.loadStoredLocation()).toBe(true);
    });

    test('retorna false si no hay datos', () => {
        expect(appRef.loadStoredLocation()).toBe(false);
    });
});

describe('checkWatcher', () => {
    test('alerta en día de preparación (idxSem=5)', () => {
        appRef.checkWatcher(new Date(2024, 0, 5), { idxSem: 5, m: 0, d: 5, special: false });
        expect(mockElements['alert-container'].style.display).toBe('block');
        expect(mockElements['alert-msg'].innerHTML).toContain('Día de Preparación');
    });

    test('muestra Omer en período (mes 0, día 26+)', () => {
        appRef.checkWatcher(new Date(), { m: 0, d: 28, idxSem: 2, special: false });
        expect(mockElements['card-omer'].style.display).toBe('block');
        expect(mockElements['omer-count'].innerText).toBe('3');
    });

    test('oculta Omer fuera de período', () => {
        appRef.checkWatcher(new Date(), { m: 3, d: 10, idxSem: 2, special: false });
        expect(mockElements['card-omer'].style.display).toBe('none');
    });

    test('muestra Yamim Noraim en mes 6, días 1-10', () => {
        appRef.checkWatcher(new Date(), { m: 6, d: 3, idxSem: 2, special: false });
        expect(mockElements['card-teshuva'].style.display).toBe('block');
        expect(mockElements['teshuva-cmd'].innerText).toContain('DÍA 3');
    });

    test('oculta Yamim Noraim fuera del período', () => {
        appRef.checkWatcher(new Date(), { m: 2, d: 15, idxSem: 2, special: false });
        expect(mockElements['card-teshuva'].style.display).toBe('none');
    });
});

describe('renderSaber y openEstudio', () => {
    test('renderSaber llena grilla', () => {
        appRef.renderSaber();
        expect(mockElements['edu-grid'].innerHTML).not.toBe('');
        expect(mockElements['edu-grid'].innerHTML).toContain('edu-card');
    });

    test('openEstudio(0) abre modal', () => {
        appRef.openEstudio(0);
        expect(mockElements['lec-title'].innerText).not.toBe('');
        expect(mockElements['modal-lectura'].style.display).toBe('flex');
    });

    test('openEstudio(999) no hace nada', () => {
        appRef.openEstudio(999);
        expect(mockElements['lec-title'].innerText).toBe('');
    });
});

describe('openFiesta', () => {
    test('abre modal con datos de la fiesta', () => {
        appRef.openFiesta(0, 2024);
        expect(mockElements['mod-title'].innerText).not.toBe('');
        expect(mockElements['modal-fiesta'].style.display).toBe('flex');
    });
});

describe('renderCalendar', () => {
    test('genera lista de fiestas para 2024', async () => {
        mockElements['cal-year'].value = '2024';
        appRef.renderCalendar();
        await new Promise((r) => setTimeout(r, 100));
        expect(mockElements['cal-lista'].innerHTML).toContain('fiesta');
    });
});

describe('Evento DOMContentLoaded', () => {
    test('registra listener al importar', () => {
        expect(mockDoc.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    });
});
