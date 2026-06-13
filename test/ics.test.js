import { expect, test, describe, vi, beforeAll } from 'vitest';
import { QumranCalendar } from '../src/js/core/calendar.js';
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
