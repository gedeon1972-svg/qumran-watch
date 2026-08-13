import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { renderHoyView } from '../src/js/ui/hoy-view.js';
import * as buildHoyViewModelRef from '../src/js/core/calculations.js';
import { QumranData as QumranDataRef } from '../src/js/core/data.js';
import { getSunriseTime } from '../src/js/core/time-translator.js';

const mockSunriseTime = { firstLight: 25 };

const mockICS = vi.hoisted(() => ({
    generateAndDownload: vi.fn(),
    queueICSForSync: vi.fn(async () => 1),
    processICSSyncQueue: vi.fn(async () => ({ processed: 2 })),
    findLiturgicalStart: vi.fn(() => new Date('2024-03-20T00:00:00Z')),
}));

vi.mock('../src/js/ics.js', () => ({
    QumranICS: mockICS,
}));

vi.mock('../src/js/core/time-translator.js', () => ({
    getQumranEquivalent: vi.fn(() => 'current'),
    getSunriseTime: vi.fn(() => mockSunriseTime),
}));

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
            _handlers: {},
            addEventListener: vi.fn((ev, cb) => {
                el._handlers[ev] = cb;
            }),
            closest: vi.fn(() => null),
            click: vi.fn(),
            appendChild: vi.fn(),
            remove: vi.fn(),
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
        'toast-container',
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
        'cal-input-group',
        'btn-export-ics',
        'edu-grid',
        'btn-podcast-con',
        'btn-institute-con',
        'modal-fiesta',
        'modal-lectura',
        'btn-close-modal',
        'btn-close-lectura',
        'modal-privacy',
        'btn-privacy',
        'btn-close-privacy',
        'mod-title',
        'mod-fechas',
        'mod-fechas-heb',
        'mod-instr',
        'mod-ref',
        'mod-historia',
        'mod-qumran',
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
        'app-version',
        'card-evangelio',
        'card-edifica',
        'card-whatsapp',
        'modal-estacion',
        'btn-close-estacion',
        'modal-license',
        'btn-close-license',
        'btn-license',
        'modal-mishmar',
        'btn-close-mishmar',
        'vigia-progress-container',
        'vigia-solar-msg',
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
                appendChild: vi.fn(),
                style: {},
                classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
                addEventListener: vi.fn(),
                remove: vi.fn(),
            })),
            body: { appendChild: vi.fn(), removeChild: vi.fn() },
            createTextNode: vi.fn(() => ({ textContent: '' })),
            documentElement: {
                style: {},
                classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn(() => false) },
            },
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
        _handlers: {},
        location: { hash: '', href: '', pathname: '/' },
        history: { replaceState: vi.fn(), pushState: vi.fn() },
        addEventListener: vi.fn((ev, cb) => {
            win._handlers[ev] = cb;
        }),
        navigator: {
            serviceWorker: undefined,
            geolocation: undefined,
            userAgent: '',
            platform: '',
            maxTouchPoints: 0,
            standalone: false,
        },
        matchMedia: vi.fn(() => ({
            matches: false,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        })),
        open: vi.fn(),
        scrollTo: vi.fn(),
    };
    vi.stubGlobal('window', win);
    vi.stubGlobal('navigator', win.navigator);
    vi.stubGlobal('Blob', vi.fn());
    class MockURL extends URL {
        static createObjectURL = vi.fn();
        static revokeObjectURL = vi.fn();
    }
    vi.stubGlobal('URL', MockURL);

    await import('../src/js/app.js');
    appRef = win.QumranApp;
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('Estructura', () => {
    test('debe tener todos los m�todos principales', () => {
        expect(appRef).toBeDefined();
        expect(typeof appRef.init).toBe('function');
        expect(typeof appRef.nav).toBe('function');
        expect(typeof appRef.loadStoredLocation).toBe('function');
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

    test('pushState en navegaci�n manual', () => {
        appRef.nav('cal', null, false);
        expect(window.history.pushState).toHaveBeenCalledWith({ view: 'cal' }, '', '#cal');
    });

    test('no pushState en evento hist�rico', () => {
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

describe('renderHoyView (antes checkWatcher)', () => {
    function makeModel(overrides) {
        return Object.assign(
            {
                gregDate: 'viernes, 5 de enero',
                special: false,
                hebDate: '5 del mes 1',
                hebDia: 'D�a 5',
                turno: 'Gamul',
                estacion: 'Primavera',
                alertMsg: '',
                omerDay: null,
                yamimNoraIm: null,
                halakha: { theme: '', hebrew: '', context: '', philology: '', quote: '', action: '' },
                festival: null,
                puerta: 1,
                shabat: { idxSem: 0, percent: 14, text: 'Faltan 6 d�as para el Shabat' },
                liturgia: { type: '', main: '', title: '', context: '', text: '' },
            },
            overrides,
        );
    }

    test('alerta en d�a de preparaci�n (idxSem=5)', () => {
        renderHoyView(
            makeModel({
                alertMsg: '<strong>�D�a de Preparaci�n!</strong><br>El Shabat entra al pr�ximo amanecer.',
            }),
        );
        expect(mockElements['alert-container'].style.display).toBe('block');
        expect(mockElements['alert-msg'].innerHTML).toContain('Preparaci');
    });

    test('muestra Omer en per�odo (mes 0, d�a 26+)', () => {
        renderHoyView(makeModel({ omerDay: 3 }));
        expect(mockElements['card-omer'].style.display).toBe('block');
        expect(mockElements['omer-count'].innerText).toBe('3');
    });

    test('oculta Omer fuera de per�odo', () => {
        renderHoyView(makeModel({ omerDay: null }));
        expect(mockElements['card-omer'].style.display).toBe('none');
    });

    test('muestra Yamim Noraim en mes 6, d�as 1-10', () => {
        renderHoyView(
            makeModel({
                yamimNoraIm: { dia: 3, data: { t: 'D�a de Ayuno', r: 'Jon�s 3' } },
            }),
        );
        expect(mockElements['card-teshuva'].style.display).toBe('block');
        expect(mockElements['teshuva-cmd'].innerText).toContain('3:');
    });

    test('oculta Yamim Noraim fuera del per�odo', () => {
        renderHoyView(makeModel({ yamimNoraIm: null }));
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

    test('muestra historia y qumran cuando la fiesta los tiene (Rosh Hashaná)', () => {
        appRef.openFiesta(0, 2024);
        expect(mockElements['mod-historia'].style.display).toBe('block');
        expect(mockElements['mod-historia'].innerText.length).toBeGreaterThan(20);
        expect(mockElements['mod-qumran'].style.display).toBe('block');
        expect(mockElements['mod-qumran'].innerText).toContain('Qumrán');
    });

    test('oculta historia y qumran cuando la fiesta no los tiene', () => {
        const f = QumranDataRef.FIESTAS.find((x) => !x.historia);
        if (!f) return;
        const idx = QumranDataRef.FIESTAS.indexOf(f);
        appRef.openFiesta(idx, 2024);
        expect(mockElements['mod-historia'].style.display).toBe('none');
        expect(mockElements['mod-qumran'].style.display).toBe('none');
    });
});

describe('Año en curso por defecto', () => {
    test('cal-year toma el año actual al inicializar', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        expect(listener).toBeTruthy();
        listener[1]();
        const year = new Date().getFullYear();
        expect(mockElements['cal-year'].value).toBe(String(year));
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

    describe('Actualizacion SW y toasts', () => {
        test('showToast crea toast clicable con onClick', () => {
            const onClick = vi.fn();
            appRef.showToast('Nueva version disponible', onClick);
            const created = mockDoc.createElement.mock.results[0].value;
            expect(created.tag).toBe('div');
            expect(created.classList.add).toHaveBeenCalledWith('toast-clickable');
            expect(created.addEventListener).toHaveBeenCalledWith('click', onClick);
        });

        test('showToast sin onClick crea toast normal', () => {
            appRef.showToast('msg normal');
            const created = mockDoc.createElement.mock.results[0].value;
            expect(created.classList.add).not.toHaveBeenCalledWith('toast-clickable');
        });

        test('setupSWUpdate es una funcion', () => {
            expect(typeof appRef.setupSWUpdate).toBe('function');
        });
    });
});

describe('init - popstate y openFiestaHoy', () => {
    test('popstate con state.view navega a la vista', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const pop = window.addEventListener.mock.calls.find((c) => c[0] === 'popstate');
        expect(pop).toBeTruthy();
        pop[1]({ state: { view: 'edu' } });
        expect(mockElements['view-edu'].classList.contains('active')).toBe(true);
    });

    test('popstate sin state.view navega a hoy', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const pop = window.addEventListener.mock.calls.find((c) => c[0] === 'popstate');
        pop[1]({ state: null });
        expect(mockElements['view-hoy'].classList.contains('active')).toBe(true);
    });

    test('openFiestaHoy abre la fiesta del dia', () => {
        appRef.todayFiesta = 0;
        appRef.openFiestaHoy();
        expect(mockElements['mod-title'].innerText).not.toBe('');
    });

    test('openFiestaHoy no hace nada sin fiesta del dia', () => {
        appRef.todayFiesta = null;
        expect(() => appRef.openFiestaHoy()).not.toThrow();
    });
});

describe('calculateVigiaStatus - antes de la primera luz', () => {
    test('muestra la cuenta regresiva y el mensaje del vigia solar', () => {
        appRef._lastSunData = { lat: 31.7683, lng: 35.2137 };
        vi.stubGlobal('getSunriseTime', undefined);
        appRef.calculateVigiaStatus();
        const container = mockElements['sun-container'];
        expect(container.appendChild).toHaveBeenCalled();
        expect(mockElements['alert-container'].style.display).toBe('block');
        expect(mockElements['vigia-solar-msg']).toBeDefined();
    });
});
describe('calculateVigiaStatus - casos edge', () => {
    test('retorna early si no hay _lastSunData', () => {
        appRef._lastSunData = null;
        appRef.calculateVigiaStatus();
        expect(mockElements['sun-container'].appendChild).not.toHaveBeenCalled();
    });
    test('retorna early si getSunriseTime devuelve null', () => {
        appRef._lastSunData = { lat: 31.7683, lng: 35.2137 };
        vi.mocked(getSunriseTime).mockReturnValue(null);
        appRef.calculateVigiaStatus();
        expect(mockElements['sun-container'].appendChild).not.toHaveBeenCalled();
        vi.mocked(getSunriseTime).mockReturnValue(mockSunriseTime);
    });
    test('no muestra cuenta regresiva si el dia ya comenzo', () => {
        appRef._lastSunData = { lat: 31.7683, lng: 35.2137 };
        vi.mocked(getSunriseTime).mockReturnValue({ sunrise: 6, firstLight: 0 });
        appRef.calculateVigiaStatus();
        expect(mockElements['sun-container'].appendChild).not.toHaveBeenCalled();
        vi.mocked(getSunriseTime).mockReturnValue(mockSunriseTime);
    });
});
describe('setupListeners - botones de comunidad', () => {
    test('btn-podcast-con abre el playlist de YouTube', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const btn = mockElements['btn-podcast-con'];
        expect(btn._handlers.click).toBeTruthy();
        btn._handlers.click();
        expect(window.open).toHaveBeenCalledWith(
            'https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz',
            '_blank',
            'noopener,noreferrer',
        );
    });

    test('btn-institute-con abre el instituto', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['btn-institute-con']._handlers.click();
        expect(window.open).toHaveBeenCalledWith(
            'https://www.descubrelabiblia.online/',
            '_blank',
            'noopener,noreferrer',
        );
    });

    test('card-evangelio abre el evangelio', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['card-evangelio']._handlers.click();
        expect(window.open).toHaveBeenCalledWith(
            'https://www.descubreelevangelio.org/',
            '_blank',
            'noopener,noreferrer',
        );
    });

    test('card-edifica abre la web de edificacion', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['card-edifica']._handlers.click();
        expect(window.open).toHaveBeenCalledWith('https://www.edificamicasa.com/', '_blank', 'noopener,noreferrer');
    });

    test('card-whatsapp abre el chat', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['card-whatsapp']._handlers.click();
        expect(window.open).toHaveBeenCalled();
    });
});

describe('setupListeners - modales', () => {
    test('btn-privacy abre y btn-close-privacy cierra el modal de privacidad', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['btn-privacy']._handlers.click();
        expect(mockElements['modal-privacy'].style.display).toBe('flex');
        mockElements['btn-close-privacy']._handlers.click();
        expect(mockElements['modal-privacy'].style.display).toBe('none');
    });

    test('btn-license abre y cierra el modal de licencia', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['btn-license']._handlers.click();
        expect(mockElements['modal-license'].style.display).toBe('flex');
        mockElements['btn-close-license']._handlers.click();
        expect(mockElements['modal-license'].style.display).toBe('none');
    });

    test('cierra modales de mishmar y estacion', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['btn-close-mishmar']._handlers.click();
        expect(mockElements['modal-mishmar'].style.display).toBe('none');
        mockElements['btn-close-estacion']._handlers.click();
        expect(mockElements['modal-estacion'].style.display).toBe('none');
    });

    test('btn-close-modal y btn-close-lectura cierran sus modales', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockElements['btn-close-modal']._handlers.click();
        expect(mockElements['modal-fiesta'].style.display).toBe('none');
        mockElements['btn-close-lectura']._handlers.click();
        expect(mockElements['modal-lectura'].style.display).toBe('none');
    });
});

describe('setupListeners - delegacion de listas', () => {
    test('click en fila de fiesta abre la fiesta', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const row = { dataset: { index: '0', year: '2024' } };
        mockElements['cal-lista']._handlers.click({ target: { closest: vi.fn(() => row) } });
        expect(mockElements['mod-title'].innerText).not.toBe('');
    });

    test('click en fila de fiesta sin row no hace nada', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        expect(() =>
            mockElements['cal-lista']._handlers.click({ target: { closest: vi.fn(() => null) } }),
        ).not.toThrow();
    });

    test('click en card de estudio abre el estudio', () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const card = { dataset: { index: '0' } };
        mockElements['edu-grid']._handlers.click({ target: { closest: vi.fn(() => card) } });
        expect(mockElements['lec-title'].innerText).not.toBe('');
    });
});

describe('btn-export-ics', () => {
    test('online genera el calendario', async () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const spy = mockICS.generateAndDownload;
        mockElements['cal-year'].value = '2024';
        window.navigator.onLine = true;
        await mockElements['btn-export-ics']._handlers.click();
        expect(spy).toHaveBeenCalledWith(2024);
        spy.mockRestore();
    });

    test('offline encola para sync', async () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        const spy = mockICS.queueICSForSync;
        mockElements['cal-year'].value = '2024';
        window.navigator.onLine = false;
        await mockElements['btn-export-ics']._handlers.click();
        expect(spy).toHaveBeenCalledWith(2024);
        spy.mockRestore();
    });

    test('muestra error en alert si falla', async () => {
        const listener = mockDoc.addEventListener.mock.calls.find((c) => c[0] === 'DOMContentLoaded');
        listener[1]();
        mockICS.generateAndDownload.mockImplementation(() => {
            throw new Error('boom');
        });
        mockElements['cal-year'].value = '2024';
        window.navigator.onLine = true;
        await mockElements['btn-export-ics']._handlers.click();
        expect(mockElements['alert-container'].style.display).toBe('block');
        expect(mockElements['alert-msg'].appendChild).toHaveBeenCalled();
        mockICS.generateAndDownload.mockReset();
    });
});

describe('refreshSolarData y nav con boton', () => {
    test('refreshSolarData con datos usa updateSunData', () => {
        appRef._lastSunData = { lat: 31.7683, lng: 35.2137, rise: 6, set: 18 };
        const spy = vi.spyOn(appRef, 'updateSunData').mockResolvedValue(undefined);
        appRef.refreshSolarData();
        expect(spy).toHaveBeenCalledWith(31.7683, 35.2137, 'Actualización solar periódica');
        spy.mockRestore();
    });

    test('refreshSolarData sin datos llama renderHoy', () => {
        appRef._lastSunData = null;
        const spy = vi.spyOn(appRef, 'renderHoy').mockImplementation(() => {});
        appRef.refreshSolarData();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    test('nav con boton activa la clase del boton', () => {
        const btn = { id: 'nav-lit', classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() } };
        appRef.nav('lit', btn, true);
        expect(btn.classList.add).toHaveBeenCalledWith('active');
        expect(window.history.pushState).not.toHaveBeenCalled();
    });
});

describe('getLocationAndSun', () => {
    test('usa GPS si esta disponible y guarda la ubicacion', async () => {
        const pos = { coords: { latitude: 31.7683, longitude: 35.2137 } };
        window.navigator.geolocation = { getCurrentPosition: vi.fn((succ) => succ(pos)) };
        appRef.getLocationAndSun(true);
        await new Promise((r) => setTimeout(r, 10));
        expect(localStorage.setItem).toHaveBeenCalledWith('qw_lat', 31.7683);
        expect(localStorage.setItem).toHaveBeenCalledWith('qw_lng', 35.2137);
    });

    test('usa Jerusalem como fallback si GPS falla', async () => {
        const spy = vi.spyOn(appRef, 'updateSunData').mockResolvedValue(undefined);
        window.navigator.geolocation = { getCurrentPosition: vi.fn((succ, err) => err()) };
        appRef.getLocationAndSun(false);
        await new Promise((r) => setTimeout(r, 10));
        expect(spy).toHaveBeenCalledWith(31.7683, 35.2137, expect.any(String));
        spy.mockRestore();
    });
});

describe('renderHoy antes del amanecer', () => {
    test('retrocede un dia si es antes del amanecer', () => {
        appRef.sunriseHour = 25;
        expect(() => appRef.renderHoy()).not.toThrow();
    });
});

describe('openFiesta con duracion', () => {
    test('muestra rango de fechas para fiestas con dur > 1', () => {
        appRef.openFiesta(3, 2024);
        expect(mockElements['mod-title'].innerText).not.toBe('');
        expect(mockElements['mod-fechas'].innerText).toContain('al');
    });
});

describe('updateSunData - misma data', () => {
    test('retorna temprano si los datos no cambiaron', async () => {
        appRef._lastSunData = { rise: 'X', set: 'Y', riseDecimal: 6, lat: 1, lng: 2 };
        const spy = vi.spyOn(buildHoyViewModelRef, 'buildHoyViewModel').mockImplementation(() => ({}));
        await appRef.updateSunData(1, 2);
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
