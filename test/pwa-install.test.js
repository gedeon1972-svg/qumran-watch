import { describe, it, expect, vi, afterEach } from 'vitest';

describe('pwa-install: initPwaPrompt (5.3)', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    function makeElement() {
        const el = {
            id: '', className: '', innerHTML: '', textContent: '',
            style: { display: '' },
            lastChild: null,
            addEventListener: vi.fn(),
        };
        el.addEventListener.mockImplementation((t, cb) => { el.handlers[t] = cb; });
        el.handlers = {};
        el.appendChild = vi.fn((node) => { el.lastChild = node; });
        return el;
    }

    function setupEnv({ userAgent = 'Mozilla/5.0 (Linux)', platform = 'Win32', maxTouchPoints = 0, standalone = false } = {}) {
        const listeners = {};
        vi.stubGlobal('navigator', { userAgent, platform, maxTouchPoints });
        vi.stubGlobal('window', {
            addEventListener: vi.fn((t, cb) => { listeners[t] = cb; }),
            matchMedia: vi.fn(() => ({ matches: standalone })),
        });
        return { listeners };
    }

    function setupDoc(existingBanner = null) {
        const created = [];
        const doc = {
            getElementById: vi.fn((id) => (id === 'pwa-install-banner' ? existingBanner : null)),
            createElement: vi.fn(() => {
                const el = makeElement();
                created.push(el);
                return el;
            }),
            querySelector: vi.fn(() => ({ insertBefore: vi.fn(), firstChild: null })),
        };
        vi.stubGlobal('document', doc);
        return { doc, created };
    }

    it('no hace nada si la app ya esta instalada (standalone)', async () => {
        const { listeners } = setupEnv({ standalone: true });
        setupDoc();
        const { initPwaPrompt } = await import('../src/js/ui/pwa-install.js');
        initPwaPrompt();
        expect(listeners.beforeinstallprompt).toBeUndefined();
    });

    it('muestra banner iOS cuando el agente es iPhone', async () => {
        setupEnv({ userAgent: 'iPhone; CPU iPhone OS 17_0 like Mac OS X' });
        const { doc, created } = setupDoc();
        const { initPwaPrompt } = await import('../src/js/ui/pwa-install.js');
        initPwaPrompt();
        expect(doc.createElement).toHaveBeenCalledWith('div');
        const banner = created[0];
        expect(banner.id).toBe('pwa-install-banner');
        expect(banner.innerHTML).toContain('iOS');
        expect(banner.lastChild.textContent).toBe('Entendido');
        banner.lastChild.handlers.click();
        expect(banner.style.display).toBe('none');
    });

    it('muestra banner Android con beforeinstallprompt y prompt funcional', async () => {
        const { listeners } = setupEnv();
        const { created } = setupDoc();
        const { initPwaPrompt } = await import('../src/js/ui/pwa-install.js');
        initPwaPrompt();

        const deferredPrompt = {
            preventDefault: vi.fn(),
            prompt: vi.fn(),
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        };
        listeners.beforeinstallprompt(deferredPrompt);
        expect(deferredPrompt.preventDefault).toHaveBeenCalled();
        const banner = created[0];
        expect(banner.id).toBe('pwa-install-banner');
        expect(banner.innerHTML).toContain('Instala Qumran Watch');
        const btn = banner.lastChild;
        expect(btn.className).toBe('btn-action');
        expect(btn.textContent).toBe('Instalar ahora');
        btn.handlers.click();
        expect(deferredPrompt.prompt).toHaveBeenCalled();
        await deferredPrompt.userChoice;
        expect(banner.style.display).toBe('none');
    });

    it('reusa el banner existente en el DOM (no crea un div nuevo)', async () => {
        const { listeners } = setupEnv();
        const existing = makeElement();
        existing.id = 'pwa-install-banner';
        const { doc, created } = setupDoc(existing);
        const { initPwaPrompt } = await import('../src/js/ui/pwa-install.js');
        initPwaPrompt();
        listeners.beforeinstallprompt({ preventDefault: vi.fn(), prompt: vi.fn(), userChoice: Promise.resolve({}) });
        expect(doc.getElementById).toHaveBeenCalledWith('pwa-install-banner');
        // Solo se crea el boton, nunca un div banner nuevo
        expect(created.length).toBe(1);
        expect(created[0].className).toBe('btn-action');
        // El banner existente recibe el boton
        expect(existing.appendChild).toHaveBeenCalled();
    });

    it('detecta iOS en iPad con MacIntel y maxTouchPoints > 1', async () => {
        setupEnv({ platform: 'MacIntel', maxTouchPoints: 5 });
        const { created } = setupDoc();
        const { initPwaPrompt } = await import('../src/js/ui/pwa-install.js');
        initPwaPrompt();
        expect(created[0].innerHTML).toContain('iOS');
    });
});
