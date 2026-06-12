import { expect, test } from 'vitest';
import { QumranCalendar } from '../src/js/core/calendar.js';

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

const ANCHOR = new Date(2019, 2, 20);

test('1. El Ancla (20 de Marzo 2019) debe ser matemáticamente perfecta', () => {
    const qDate = QumranCalendar.calculate(ANCHOR);

    expect(qDate).not.toBeNull();
    expect(qDate.y).toBe(2019);
    expect(qDate.m).toBe(0);
    expect(qDate.d).toBe(1);
    expect(qDate.turno).toBe('Gamul');
    expect(qDate.idxSem).toBe(3);
});

test('2. El Shabat nunca debe romperse (Debe caer en índice 6)', () => {
    const shabatDate = new Date(2019, 2, 23);
    const qDate = QumranCalendar.calculate(shabatDate);

    expect(qDate.idxSem).toBe(6);
    expect(qDate.turno).toBe('Gamul');
});

test('3. Año 1, Semana 0, Día 1 debe ser Gamul (índice 21)', () => {
    const qDate = QumranCalendar.calculate(ANCHOR);
    expect(qDate.turno).toBe('Gamul');
});

test('4. Año 2, Semana 0, Día 1 debe ser Jedaías (índice 1)', () => {
    const y2Start = addDays(ANCHOR, 364);
    const qDate = QumranCalendar.calculate(y2Start);
    expect(qDate.turno).toBe('Jedaiah');
});

test('5. Año 6, Semana 0, Día 1 debe ser Afses (índice 17)', () => {
    const y6Start = addDays(ANCHOR, 1820);
    const qDate = QumranCalendar.calculate(y6Start);
    expect(qDate.turno).toBe('Hapises');
});

test('6. Año 6, Semana 51, Día 364 debe ser Jachin (índice 20)', () => {
    const y6Day364 = addDays(ANCHOR, 2183);
    const qDate = QumranCalendar.calculate(y6Day364);
    expect(qDate.turno).toBe('Jaquín');
});
