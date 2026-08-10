import { describe, it, expect } from 'vitest';
import { getQumranEquivalent, getSunriseTime } from '../src/js/core/time-translator.js';

describe('time-translator: getQumranEquivalent (5.4)', () => {
    it('retorna prev si la hora actual es anterior al amanecer', () => {
        const date = new Date(2024, 5, 15, 4, 0); // 04:00
        expect(getQumranEquivalent(date, 5.5)).toBe('prev');
    });

    it('retorna current si la hora actual es igual o posterior al amanecer', () => {
        const date = new Date(2024, 5, 15, 6, 0); // 06:00
        expect(getQumranEquivalent(date, 5.5)).toBe('current');
    });

    it('retorna current si sunriseHour es null', () => {
        const date = new Date(2024, 5, 15, 10, 0);
        expect(getQumranEquivalent(date, null)).toBe('current');
    });

    it('retorna current si sunriseHour es NaN', () => {
        const date = new Date(2024, 5, 15, 10, 0);
        expect(getQumranEquivalent(date, NaN)).toBe('current');
    });

    it('retorna current si sunriseHour es undefined', () => {
        const date = new Date(2024, 5, 15, 10, 0);
        expect(getQumranEquivalent(date, undefined)).toBe('current');
    });

    it('usa minutos decimales: 05:30 es anterior a 05:40', () => {
        const date = new Date(2024, 5, 15, 5, 30);
        expect(getQumranEquivalent(date, 5.65)).toBe('prev');
    });
});

describe('time-translator: getSunriseTime (5.4)', () => {
    it('retorna sunrise y firstLight con offset configurado', () => {
        const JERUSALEM = { lat: 31.7683, lng: 35.2137 };
        const date = new Date(2024, 5, 15);
        const result = getSunriseTime(JERUSALEM.lat, JERUSALEM.lng, date);
        expect(result).not.toBeNull();
        expect(typeof result.sunrise).toBe('number');
        expect(result.sunrise).toBeGreaterThan(0);
        expect(result.sunrise).toBeLessThan(24);
        // Primera luz = 30 min ANTES del amanecer (FIRST_LIGHT_OFFSET = -0.5h)
        expect(result.firstLight).toBeCloseTo(result.sunrise - 0.5, 5);
    });

    it('retorna null si el calculo no produce amanecer (latitud polar)', () => {
        const date = new Date(2024, 5, 15);
        // lat 90: sin salida de sol (cosH fuera de rango) -> calcSunTimes null
        expect(getSunriseTime(90, 0, date)).toBeNull();
    });
});
