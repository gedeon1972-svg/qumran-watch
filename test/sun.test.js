import { expect, test, describe } from 'vitest';
import { QumranSun } from '../src/js/core/sun.js';

const JERUSALEM = { lat: 31.7683, lng: 35.2137 };
const EQUATOR = { lat: 0, lng: 0 };

describe('QumranSun.calcSunTimes', () => {
    test('debe retornar objeto con rise, set y riseDecimal', () => {
        const result = QumranSun.calcSunTimes(new Date(2024, 5, 15), JERUSALEM.lat, JERUSALEM.lng);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('rise');
        expect(result).toHaveProperty('set');
        expect(result).toHaveProperty('riseDecimal');
    });

    test('rise y set deben ser strings HH:MM', () => {
        const result = QumranSun.calcSunTimes(new Date(2024, 5, 15), JERUSALEM.lat, JERUSALEM.lng);
        expect(result.rise).toMatch(/^\d{2}:\d{2}$/);
        expect(result.set).toMatch(/^\d{2}:\d{2}$/);
    });

    test('riseDecimal debe ser un nÃºmero finito', () => {
        const result = QumranSun.calcSunTimes(new Date(2024, 5, 15), JERUSALEM.lat, JERUSALEM.lng);
        expect(typeof result.riseDecimal).toBe('number');
        expect(Number.isFinite(result.riseDecimal)).toBe(true);
    });

    test('para la fecha ancla (20 Mar 2019) debe dar resultado vÃ¡lido en JerusalÃ©n', () => {
        const anchor = new Date(2019, 2, 20);
        const result = QumranSun.calcSunTimes(anchor, JERUSALEM.lat, JERUSALEM.lng);
        expect(result).not.toBeNull();
        expect(result.rise).not.toBe('--:--');
        expect(result.set).not.toBe('--:--');
    });

    test('para coordenadas polares (lat=90) debe retornar --:--', () => {
        const result = QumranSun.calcSunTimes(new Date(2024, 0, 1), 90, 0);
        expect(result.rise).toBe('--:--');
        expect(result.set).toBe('--:--');
    });

    test('los valores de salida y puesta deben estar en rango 0-24', () => {
        const result = QumranSun.calcSunTimes(new Date(2024, 5, 15), JERUSALEM.lat, JERUSALEM.lng);
        const riseH = parseInt(result.rise.split(':')[0], 10);
        const setH = parseInt(result.set.split(':')[0], 10);
        expect(riseH).toBeGreaterThanOrEqual(0);
        expect(riseH).toBeLessThan(24);
        expect(setH).toBeGreaterThanOrEqual(0);
        expect(setH).toBeLessThan(24);
    });

    test('para fechas en equinoccio, el dÃ­a debe durar ~12h en el ecuador', () => {
        const equinox = new Date(2024, 2, 20);
        const result = QumranSun.calcSunTimes(equinox, EQUATOR.lat, EQUATOR.lng);
        const riseH = Math.floor(result.riseDecimal);
        const riseM = (result.riseDecimal - riseH) * 60;
        const setH = parseInt(result.set.split(':')[0], 10);
        const setM = parseInt(result.set.split(':')[1], 10);
        const dayLength = setH + setM / 60 - (riseH + riseM / 60);
        expect(dayLength).toBeGreaterThan(11);
        expect(dayLength).toBeLessThan(13);
    });

    test('para diferentes fechas, los resultados deben ser distintos', () => {
        const summer = QumranSun.calcSunTimes(new Date(2024, 5, 15), JERUSALEM.lat, JERUSALEM.lng);
        const winter = QumranSun.calcSunTimes(new Date(2024, 11, 15), JERUSALEM.lat, JERUSALEM.lng);
        expect(summer.riseDecimal).not.toBe(winter.riseDecimal);
    });
});
