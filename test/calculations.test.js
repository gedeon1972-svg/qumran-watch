import { expect, test, describe } from 'vitest';
import { QumranData } from '../src/js/core/data.js';
import { buildHoyViewModel } from '../src/js/core/calculations.js';

describe('buildHoyViewModel — halakha (Instrucción del Mesías)', () => {
    function makeQData(overrides) {
        const base = {
            y: 1,
            m: 0,
            d: 1,
            idxSem: 0,
            turno: 'Gamul',
            signo: 'Gamul',
            est: 'Primavera',
            puerta: 1,
            dCountYear: 0,
            special: false,
        };
        return Object.assign(base, overrides);
    }

    test('dCountYear = 0 da halakha índice 0', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 0 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[0].t);
        expect(model.halakha.theme.length).toBeGreaterThan(0);
    });

    test('dCountYear = 7 da halakha índice 1', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 7 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[1].t);
    });

    test('dCountYear = 363 da halakha índice 51', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 363 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[51].t);
    });

    test('dCountYear = 6 da halakha índice 0 (semana 1, día 7)', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 6 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[0].t);
    });

    test('dCountYear = 182 da halakha índice 26 (mitad del año)', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 182 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[26].t);
    });

    test('dCountYear = 91 da halakha índice 13 (cuarto del año)', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 91 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[13].t);
    });

    test('modo special no incluye halakha', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ special: true, dCountYear: 364 }));
        expect(model.halakha).toBeUndefined();
    });

    test('todos los campos de halakha se mapean correctamente', () => {
        const model = buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 14 }));
        expect(model.halakha).toBeDefined();
        expect(typeof model.halakha.theme).toBe('string');
        expect(typeof model.halakha.hebrew).toBe('string');
        expect(typeof model.halakha.context).toBe('string');
        expect(typeof model.halakha.philology).toBe('string');
        expect(typeof model.halakha.quote).toBe('string');
        expect(typeof model.halakha.action).toBe('string');
    });
});
