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
    // El turno Gamul dura 7 días completos (del día 1 al día 7)
    // El cambio ocurre después del 7mo día, comenzando el día 8
    const ultimoDiaGamul = new Date(2019, 2, 26); // Día 7 (martes)
    const qDateUltimo = QumranCalendar.calculate(ultimoDiaGamul);
    
    expect(qDateUltimo.turno).toBe('Gamul'); 
    expect(qDateUltimo.d).toBe(7); // Último día del turno
    
    // El nuevo turno (Delaía) comienza en el día 8
    const primerDiaDelaia = new Date(2019, 2, 27); // Día 8 (miércoles)
    const qDateNuevo = QumranCalendar.calculate(primerDiaDelaia);
    
    expect(qDateNuevo.turno).toBe('Delaía'); // El turno que le sigue a Gamul
    expect(qDateNuevo.d).toBe(8); // Día 8 dentro del ciclo anual continuo
});