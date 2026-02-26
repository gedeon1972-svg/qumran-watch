import { expect, test } from 'vitest';
import { QumranCalendar } from '../src/js/calendar.js';

test('1. El Ancla (20 de Marzo 2019) debe ser matemáticamente perfecta', () => {
    // Recordatorio: En JavaScript los meses empiezan en 0, así que Marzo es 2
    const anchorDate = new Date(2019, 2, 20); 
    const qDate = QumranCalendar.calculate(anchorDate);
    
    expect(qDate).not.toBeNull();
    expect(qDate.y).toBe(2019); // Año 1 de la restauración
    expect(qDate.m).toBe(0);    // Mes 1 (Aviv)
    expect(qDate.d).toBe(1);    // Día 1
    expect(qDate.turno).toBe('Gamul'); // Turno Sacerdotal
    expect(qDate.idxSem).toBe(3); // Miércoles (Día 4 en índice base 0)
});

test('2. El Shabat nunca debe romperse (Debe caer en índice 6)', () => {
    const shabatDate = new Date(2019, 2, 23); // 3 días después del miércoles ancla
    const qDate = QumranCalendar.calculate(shabatDate);
    
    expect(qDate.idxSem).toBe(6); // 6 representa el 7mo día (Shabat)
    expect(qDate.turno).toBe('Gamul'); 
});

test('3. Cambio de Turno Sacerdotal correcto', () => {
    const proximoDomingo = new Date(2019, 2, 24); // Inicio de la nueva semana
    const qDate = QumranCalendar.calculate(proximoDomingo);
    
    expect(qDate.idxSem).toBe(0); // Domingo (Día 1)
    expect(qDate.turno).toBe('Delaía'); // El turno que le sigue a Gamul
});