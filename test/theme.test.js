import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../src/js/core/storage.js', () => {
    const store = {};
    return {
        storage: {
            getItem: vi.fn((k) => (k in store ? store[k] : null)),
            setItem: vi.fn((k, v) => {
                store[k] = String(v);
            }),
            removeItem: vi.fn((k) => {
                delete store[k];
            }),
            clear: vi.fn(() => {
                Object.keys(store).forEach((k) => delete store[k]);
            }),
        },
    };
});

import { storage } from '../src/js/core/storage.js';
import { initTheme, toggleTheme, applyTheme, getStoredTheme, getSystemTheme, resolveTheme } from '../src/js/theme.js';

function stubDom(toggleExists) {
    const root = {
        classList: {
            classes: new Set(),
            add(c) {
                this.classes.add(c);
            },
            remove(c) {
                this.classes.delete(c);
            },
            contains(c) {
                return this.classes.has(c);
            },
        },
    };
    const toggle = toggleExists ? { textContent: '', addEventListener: vi.fn() } : null;
    vi.stubGlobal('document', {
        documentElement: root,
        getElementById: vi.fn((id) => (id === 'theme-toggle' ? toggle : null)),
    });
    return { root, toggle };
}

function stubMatchMedia(matches, handlerRef) {
    const mm = vi.fn(() => ({
        matches,
        addEventListener: vi.fn((ev, cb) => {
            handlerRef.cb = cb;
        }),
    }));
    vi.stubGlobal('window', { matchMedia: mm });
    return mm;
}

describe('theme.js', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('getStoredTheme devuelve el tema guardado', () => {
        storage.getItem.mockReturnValueOnce('dark');
        expect(getStoredTheme()).toBe('dark');
    });

    test('getSystemTheme devuelve dark si el sistema prefiere oscuro', () => {
        stubMatchMedia(true, {});
        expect(getSystemTheme()).toBe('dark');
    });

    test('getSystemTheme devuelve light si el sistema prefiere claro', () => {
        stubMatchMedia(false, {});
        expect(getSystemTheme()).toBe('light');
    });

    test('getSystemTheme devuelve light sin matchMedia', () => {
        vi.stubGlobal('window', {});
        expect(getSystemTheme()).toBe('light');
    });

    test('resolveTheme prioriza el tema guardado', () => {
        storage.getItem.mockReturnValueOnce('light');
        expect(resolveTheme()).toBe('light');
    });

    test('resolveTheme usa el sistema si no hay guardado', () => {
        storage.getItem.mockReturnValueOnce(null);
        stubMatchMedia(true, {});
        expect(resolveTheme()).toBe('dark');
    });

    test('applyTheme agrega dark-theme y setea luna en modo oscuro', () => {
        const { root, toggle } = stubDom(true);
        applyTheme('dark');
        expect(root.classList.contains('dark-theme')).toBe(true);
        expect(toggle.textContent).toBe('\u263D');
    });

    test('applyTheme quita dark-theme y setea sol en modo claro', () => {
        const { root, toggle } = stubDom(true);
        applyTheme('light');
        expect(root.classList.contains('dark-theme')).toBe(false);
        expect(toggle.textContent).toBe('\u2600');
    });

    test('applyTheme tolera que no exista el toggle', () => {
        const { root } = stubDom(false);
        expect(() => applyTheme('dark')).not.toThrow();
        expect(root.classList.contains('dark-theme')).toBe(true);
    });

    test('toggleTheme cambia de oscuro a claro', () => {
        const { root } = stubDom(true);
        root.classList.add('dark-theme');
        toggleTheme();
        expect(storage.setItem).toHaveBeenCalledWith('qw_theme', 'light');
        expect(root.classList.contains('dark-theme')).toBe(false);
    });

    test('toggleTheme cambia de claro a oscuro', () => {
        const { root } = stubDom(true);
        toggleTheme();
        expect(storage.setItem).toHaveBeenCalledWith('qw_theme', 'dark');
        expect(root.classList.contains('dark-theme')).toBe(true);
    });

    test('initTheme aplica tema resuelto y registra el click del toggle', () => {
        const { toggle } = stubDom(true);
        stubMatchMedia(false, {});
        initTheme();
        expect(toggle.addEventListener).toHaveBeenCalledWith('click', toggleTheme);
    });

    test('initTheme no registra click si no hay toggle', () => {
        stubDom(false);
        stubMatchMedia(false, {});
        expect(() => initTheme()).not.toThrow();
    });

    test('initTheme no registra listener de sistema sin matchMedia', () => {
        const { toggle } = stubDom(true);
        vi.stubGlobal('window', {});
        initTheme();
        expect(toggle.addEventListener).toHaveBeenCalledWith('click', toggleTheme);
    });

    test('initTheme responde a cambio de sistema si no hay tema guardado', () => {
        stubDom(true);
        const handlerRef = {};
        const mm = stubMatchMedia(false, handlerRef);
        initTheme();
        expect(mm).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
        storage.getItem.mockReturnValueOnce(null);
        handlerRef.cb({ matches: true });
        expect(storage.setItem).not.toHaveBeenCalled();
    });

    test('initTheme ignora cambio de sistema si hay tema guardado', () => {
        stubDom(true);
        const handlerRef = {};
        stubMatchMedia(false, handlerRef);
        initTheme();
        storage.getItem.mockReturnValueOnce('dark');
        handlerRef.cb({ matches: false });
        expect(storage.setItem).not.toHaveBeenCalled();
    });
});

describe('theme-init.js (IIFE)', () => {
    beforeEach(() => {
        vi.resetModules();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    function stubLocalStorage(value) {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => value),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });
    }

    function stubInitDom() {
        vi.stubGlobal('document', {
            documentElement: {
                classList: {
                    classes: new Set(),
                    add(c) {
                        this.classes.add(c);
                    },
                    contains(c) {
                        return this.classes.has(c);
                    },
                },
            },
        });
    }

    test('aplica dark-theme si hay tema dark guardado', async () => {
        stubLocalStorage('dark');
        stubInitDom();
        vi.stubGlobal('window', {});
        await import('../src/js/theme-init.js');
        expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    test('no aplica dark-theme con tema light guardado', async () => {
        stubLocalStorage('light');
        stubInitDom();
        vi.stubGlobal('window', {});
        await import('../src/js/theme-init.js');
        expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });

    test('usa preferencia del sistema si no hay tema guardado (dark)', async () => {
        stubLocalStorage(null);
        stubInitDom();
        vi.stubGlobal('window', {
            matchMedia: vi.fn(() => ({ matches: true })),
        });
        await import('../src/js/theme-init.js');
        expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });

    test('usa preferencia del sistema si no hay tema guardado (light)', async () => {
        stubLocalStorage(null);
        stubInitDom();
        vi.stubGlobal('window', {
            matchMedia: vi.fn(() => ({ matches: false })),
        });
        await import('../src/js/theme-init.js');
        expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });

    test('cae a light si localStorage lanza y no hay preferencia', async () => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => {
                throw new Error('denied');
            }),
        });
        stubInitDom();
        vi.stubGlobal('window', {
            matchMedia: vi.fn(() => ({ matches: false })),
        });
        await import('../src/js/theme-init.js');
        expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });
});
