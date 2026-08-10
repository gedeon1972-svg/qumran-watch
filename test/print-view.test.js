import { describe, it, expect, vi, afterEach } from 'vitest';
import { generatePrintHtml, openPrintWindow } from '../src/js/ui/print-view.js';
import { QumranData } from '../src/js/core/data.js';

describe('print-view: generatePrintHtml (5.3)', () => {
    it('genera HTML completo para un año valido', () => {
        const html = generatePrintHtml(2026);
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('Calendario Solar de 364');
        expect(html).toContain('A\u00f1o ');
        expect(html).toContain('Manuscritos del Mar Muerto');
        expect(html).toContain('Dom');
        expect(html).toContain('S\u00e1b');
        expect(html).toContain('.dc.empty');
        for (const mes of QumranData.MESES) {
            expect(html).toContain(mes);
        }
    });

    it('marca dias de fiesta y shabat en el HTML', () => {
        const html = generatePrintHtml(2026);
        expect(html).toContain('class="dc fest"');
        expect(html).toContain('class="dc shab"');
        expect(html).toContain('class="fname"');
    });

    it('devuelve mensaje de error para año sin calculo (antes del ancla)', () => {
        const html = generatePrintHtml(1990);
        expect(html).toContain('No se pudo calcular');
        expect(html).toContain('1990');
    });
});

describe('print-view: openPrintWindow (5.3)', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    function mockDocForIframe(iframe) {
        const body = { appendChild: vi.fn() };
        vi.stubGlobal('document', { createElement: vi.fn(() => iframe), body });
        return { body };
    }

    it('crea iframe oculto, escribe el HTML e invoca print en onload', () => {
        vi.useFakeTimers();
        const removeChild = vi.fn();
        const iframe = {
            setAttribute: vi.fn(),
            contentWindow: {
                document: { open: vi.fn(), write: vi.fn(), close: vi.fn() },
                focus: vi.fn(),
                print: vi.fn(),
            },
            contentDocument: null,
            parentNode: { removeChild },
        };
        const { body } = mockDocForIframe(iframe);
        openPrintWindow(2026);
        expect(iframe.setAttribute).toHaveBeenCalled();
        expect(body.appendChild).toHaveBeenCalledWith(iframe);
        expect(iframe.contentWindow.document.open).toHaveBeenCalled();
        expect(iframe.contentWindow.document.write).toHaveBeenCalled();
        expect(iframe.contentWindow.document.close).toHaveBeenCalled();
        iframe.contentWindow.onload();
        expect(iframe.contentWindow.focus).toHaveBeenCalled();
        expect(iframe.contentWindow.print).toHaveBeenCalled();
        vi.advanceTimersByTime(2100);
        expect(removeChild).toHaveBeenCalledWith(iframe);
    });

    it('usa contentDocument cuando existe', () => {
        vi.useFakeTimers();
        const removeChild = vi.fn();
        const contentDocument = { open: vi.fn(), write: vi.fn(), close: vi.fn() };
        const iframe = {
            setAttribute: vi.fn(),
            contentWindow: {
                document: { open: vi.fn(), write: vi.fn(), close: vi.fn() },
                focus: vi.fn(),
                print: vi.fn(),
            },
            contentDocument,
            parentNode: { removeChild },
        };
        mockDocForIframe(iframe);
        openPrintWindow(2026);
        expect(contentDocument.open).toHaveBeenCalled();
        vi.advanceTimersByTime(2100);
    });

    it('no lanza si print falla', () => {
        vi.useFakeTimers();
        const iframe = {
            setAttribute: vi.fn(),
            contentWindow: {
                document: { open: vi.fn(), write: vi.fn(), close: vi.fn() },
                focus: vi.fn(() => { throw new Error('bloqueado'); }),
                print: vi.fn(),
            },
            contentDocument: null,
            parentNode: { removeChild: vi.fn() },
        };
        mockDocForIframe(iframe);
        expect(() => openPrintWindow(2026)).not.toThrow();
        iframe.contentWindow.onload();
        vi.advanceTimersByTime(2100);
    });
});
