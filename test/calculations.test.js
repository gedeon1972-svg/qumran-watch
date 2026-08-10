import { expect, test, describe } from 'vitest';
import { QumranData } from '../src/js/core/data.js';
const QD = QumranData;
import * as CALC from '../src/js/core/calculations.js';

function makeQData(overrides) {
    const base = {
        y: 1, m: 0, d: 1, idxSem: 0, turno: 'Gamul', signo: 'Gamul',
        est: 'Primavera', puerta: 1, dCountYear: 0, special: false,
    };
    return Object.assign(base, overrides);
}



describe('buildHoyViewModel — halakha (Instrucción del Mesías)', () => {

    test('dCountYear = 0 da halakha índice 0', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 0 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[0].t);
        expect(model.halakha.theme.length).toBeGreaterThan(0);
    });

    test('dCountYear = 7 da halakha índice 1', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 7 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[1].t);
    });

    test('dCountYear = 363 da halakha índice 51', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 363 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[51].t);
    });

    test('dCountYear = 6 da halakha índice 0 (semana 1, día 7)', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 6 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[0].t);
    });

    test('dCountYear = 182 da halakha índice 26 (mitad del año)', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 182 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[26].t);
    });

    test('dCountYear = 91 da halakha índice 13 (cuarto del año)', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 91 }));
        expect(model.halakha.theme).toBe(QumranData.HALAKHA[13].t);
    });

    test('modo special no incluye halakha', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ special: true, dCountYear: 364 }));
        expect(model.halakha).toBeUndefined();
    });

    test('todos los campos de halakha se mapean correctamente', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ dCountYear: 14 }));
        expect(model.halakha).toBeDefined();
        expect(typeof model.halakha.theme).toBe('string');
        expect(typeof model.halakha.hebrew).toBe('string');
        expect(typeof model.halakha.context).toBe('string');
        expect(typeof model.halakha.philology).toBe('string');
        expect(typeof model.halakha.quote).toBe('string');
        expect(typeof model.halakha.action).toBe('string');
    });
});


    test('idxSem 6 genera liturgia celestial del Shabat', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ idxSem: 6, dCountYear: 7 }));
        expect(model.liturgia.type).toBe('LITURGIA CELESTIAL');
        expect(model.liturgia.main).toBe('CÁNTICO DEL SACRIFICIO DEL SHABAT');
        expect(model.shabat.text).toBe('¡SHABAT SHALOM!');
        expect(model.shabat.percent).toBe(100);
        expect(model.shabat.shabatBg).toBe('#fff');
        expect(model.liturgia.title).toContain('Cántico del 2do Shabat');
    });

    test('no-shabat usa liturgia del templo y cuenta dias', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ idxSem: 3, dCountYear: 7 }));
        expect(model.liturgia.type).toBe('LITURGIA DEL TEMPLO');
        expect(model.liturgia.main).toBe('SALMO DEL DÍA');
        expect(model.shabat.text).toBe('Faltan 3 días para el Shabat');
        expect(model.shabat.percent).toBeCloseTo(57.14, 1);
    });

    test('fecha en dia de fiesta incluye festival', () => {
        const model = CALC.buildHoyViewModel(new Date('2026-06-14'), makeQData({ m: 0, d: 14, idxSem: 1, dCountYear: 7 }));
        expect(model.festival).not.toBeNull();
        expect(model.festival.name).toContain('PESAJ');
    });

describe('calcOmerDay', () => {
    test('null si qDate nulo o special', () => {
        const { calcOmerDay } = CALC;
        expect(calcOmerDay(null)).toBeNull();
        expect(calcOmerDay({ m: 0, d: 1, special: true })).toBeNull();
        expect(calcOmerDay({})).toBeNull();
    });
    test('mes 0 dia >= 26', () => {
        const { calcOmerDay } = CALC;
        expect(calcOmerDay({ m: 0, d: 26 })).toBe(1);
        expect(calcOmerDay({ m: 0, d: 30 })).toBe(5);
    });
    test('mes 1', () => {
        const { calcOmerDay } = CALC;
        expect(calcOmerDay({ m: 1, d: 1 })).toBe(6);
        expect(calcOmerDay({ m: 1, d: 30 })).toBe(35);
    });
    test('mes 2 dia <= 15', () => {
        const { calcOmerDay } = CALC;
        expect(calcOmerDay({ m: 2, d: 1 })).toBe(36);
        expect(calcOmerDay({ m: 2, d: 15 })).toBe(50);
    });
    test('mes 2 dia > 15 retorna null', () => {
        const { calcOmerDay } = CALC;
        expect(calcOmerDay({ m: 2, d: 16 })).toBeNull();
        expect(calcOmerDay({ m: 3, d: 1 })).toBeNull();
    });
});

describe('findFestivalDate', () => {
    test('indice invalido retorna null', () => {
        const { findFestivalDate } = CALC;
        expect(findFestivalDate(-1, 2024)).toBeNull();
        expect(findFestivalDate(999, 2024)).toBeNull();
    });
    test('encuentra Rosh Hashana (m0 d1) en 2024', () => {
        const { findFestivalDate } = CALC;
        const d = findFestivalDate(0, 2024);
        expect(d).toBeInstanceOf(Date);
    });
    test('encuentra PESAJ (m0 d14) en 2024', () => {
        const { findFestivalDate } = CALC;
        const d = findFestivalDate(2, 2024);
        expect(d).toBeInstanceOf(Date);
    });
});

describe('getFestivalsForYear', () => {
    test('retorna al menos las 5 fiestas principales en 2024', () => {
        const { getFestivalsForYear } = CALC;
        const result = getFestivalsForYear(2024);
        expect(result.length).toBeGreaterThanOrEqual(5);
        for (const r of result) {
            expect(r.date).toBeInstanceOf(Date);
            expect(r.q).toBeDefined();
            expect(r.index).toBeGreaterThanOrEqual(0);
        }
    });
    test('cada resultado debe coincidir con una fiesta real', () => {
        const { getFestivalsForYear } = CALC;
        const { QumranData } = { QumranData: QD };
        const result = getFestivalsForYear(2024);
        for (const r of result) {
            const f = QumranData.FIESTAS[r.index];
            expect(f.m).toBe(r.q.m);
            expect(f.d).toBe(r.q.d);
        }
    });
});

describe('getWatcherAlerts', () => {

    test('preparacion + festival proximo genera alerta con separador <hr>', () => {
        const { getWatcherAlerts } = CALC;
        const hoy = new Date(2019, 3, 12);
        const qHoy = { idxSem: 5, m: 0, d: 24, special: false };
        const r = getWatcherAlerts(hoy, qHoy);
        expect(r.msg).toContain('Día de Preparaci');
        expect(r.msg).toContain('<hr');
        expect(r.msg).toContain('Bikurim');
    });

    test('dia de preparacion (idxSem 5) genera alerta', () => {
        const { getWatcherAlerts } = CALC;
        const hoy = new Date(2019, 2, 22);
        const qHoy = { idxSem: 5, m: 0, d: 3, special: false };
        const r = getWatcherAlerts(hoy, qHoy);
        expect(r.msg).toContain('Día de Preparaci');
        expect(r.omerDay).toBeNull();
    });
    test('sin preparacion ni festivales proximos retorna msg vacio', () => {
        const { getWatcherAlerts } = CALC;
        const hoy = new Date(2019, 2, 24);
        const qHoy = { idxSem: 0, m: 0, d: 8, special: false };
        const r = getWatcherAlerts(hoy, qHoy);
        expect(r.msg).toBe('');
    });
    test('qHoy null no lanza', () => {
        const { getWatcherAlerts } = CALC;
        const hoy = new Date(2019, 2, 20);
        expect(() => getWatcherAlerts(hoy, null)).not.toThrow();
    });
});
