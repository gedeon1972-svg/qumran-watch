import { expect, test, describe } from 'vitest';
import { QumranData } from '../src/js/core/data.js';

describe('QumranData — ANCHOR', () => {
    test('ANCHOR debe tener coordenadas vÃ¡lidas', () => {
        expect(QumranData.ANCHOR).toBeDefined();
        expect(QumranData.ANCHOR.y).toBe(2019);
        expect(QumranData.ANCHOR.m).toBe(2);
        expect(QumranData.ANCHOR.d).toBe(20);
        expect(QumranData.ANCHOR.turnoIdx).toBe(21);
    });
});

describe('QumranData — MESES', () => {
    test('debe tener exactamente 12 meses', () => {
        expect(QumranData.MESES).toHaveLength(12);
    });

    test('cada mes debe ser un string no vacÃ­o', () => {
        QumranData.MESES.forEach((mes) => {
            expect(typeof mes).toBe('string');
            expect(mes.length).toBeGreaterThan(0);
        });
    });
});

describe('QumranData — DIAS', () => {
    test('debe tener exactamente 7 dÃ­as', () => {
        expect(QumranData.DIAS).toHaveLength(7);
    });

    test('cada dÃ­a debe ser un string no vacÃ­o', () => {
        QumranData.DIAS.forEach((dia) => {
            expect(typeof dia).toBe('string');
            expect(dia.length).toBeGreaterThan(0);
        });
    });
});

describe('QumranData — TURNOS (Sacerdotales)', () => {
    test('debe tener exactamente 24 turnos', () => {
        expect(QumranData.TURNOS).toHaveLength(24);
    });

    test('cada turno debe ser un string no vacÃ­o', () => {
        QumranData.TURNOS.forEach((turno) => {
            expect(typeof turno).toBe('string');
            expect(turno.length).toBeGreaterThan(0);
        });
    });

    test('Gamul debe estar en el Ã­ndice 21', () => {
        expect(QumranData.TURNOS[21]).toBe('Gamul');
    });
});

describe('QumranData — PUERTAS_SOLARES', () => {
    test('debe tener exactamente 12 valores', () => {
        expect(QumranData.PUERTAS_SOLARES).toHaveLength(12);
    });

    test('todos los valores deben ser nÃºmeros entre 1 y 6', () => {
        QumranData.PUERTAS_SOLARES.forEach((puerta) => {
            expect(typeof puerta).toBe('number');
            expect(puerta).toBeGreaterThanOrEqual(1);
            expect(puerta).toBeLessThanOrEqual(6);
        });
    });
});

describe('QumranData — YAMIM_NORAIM', () => {
    test('debe tener exactamente 10 dÃ­as', () => {
        expect(QumranData.YAMIM_NORAIM).toHaveLength(10);
    });

    test('cada entrada debe tener t y r como strings', () => {
        QumranData.YAMIM_NORAIM.forEach((yamim) => {
            expect(typeof yamim.t).toBe('string');
            expect(yamim.t.length).toBeGreaterThan(0);
            expect(typeof yamim.r).toBe('string');
            expect(yamim.r.length).toBeGreaterThan(0);
        });
    });
});

describe('QumranData — ENLACES', () => {
    test('cada enlace debe tener id, titulo, desc, url, label, color', () => {
        QumranData.ENLACES.forEach((enlace) => {
            expect(typeof enlace.id).toBe('string');
            expect(typeof enlace.titulo).toBe('string');
            expect(typeof enlace.desc).toBe('string');
            expect(typeof enlace.url).toBe('string');
            expect(typeof enlace.label).toBe('string');
            expect(typeof enlace.color).toBe('string');
        });
    });
});

describe('QumranData — FIESTAS', () => {
    test('cada fiesta debe tener m, d, n, es, instr, ref', () => {
        QumranData.FIESTAS.forEach((fiesta) => {
            expect(typeof fiesta.m).toBe('number');
            expect(typeof fiesta.d).toBe('number');
            expect(typeof fiesta.n).toBe('string');
            expect(fiesta.n.length).toBeGreaterThan(0);
            expect(typeof fiesta.es).toBe('string');
            expect(fiesta.es.length).toBeGreaterThan(0);
            expect(typeof fiesta.instr).toBe('string');
            expect(fiesta.instr.length).toBeGreaterThan(0);
            expect(typeof fiesta.ref).toBe('string');
            expect(fiesta.ref.length).toBeGreaterThan(0);
        });
    });

    test('los dÃ­as de mes deben ser vÃ¡lidos (1-31)', () => {
        QumranData.FIESTAS.forEach((fiesta) => {
            expect(fiesta.m).toBeGreaterThanOrEqual(0);
            expect(fiesta.m).toBeLessThanOrEqual(6);
            expect(fiesta.d).toBeGreaterThanOrEqual(1);
            expect(fiesta.d).toBeLessThanOrEqual(31);
        });
    });

    test('YOM KIPUR debe tener flag especial=true', () => {
        const kipur = QumranData.FIESTAS.find((f) => f.n === 'YOM KIPUR');
        expect(kipur).toBeDefined();
        expect(kipur.especial).toBe(true);
    });
});

describe('QumranData — ESTUDIOS', () => {
    test('cada estudio debe tener t, s, c como strings', () => {
        QumranData.ESTUDIOS.forEach((estudio) => {
            expect(typeof estudio.t).toBe('string');
            expect(estudio.t.length).toBeGreaterThan(0);
            expect(typeof estudio.s).toBe('string');
            expect(estudio.s.length).toBeGreaterThan(0);
            expect(typeof estudio.c).toBe('string');
            expect(estudio.c.length).toBeGreaterThan(0);
        });
    });
});

describe('QumranData — SALMOS', () => {
    test('debe tener exactamente 7 salmos', () => {
        expect(QumranData.SALMOS).toHaveLength(7);
    });

    test('cada salmo debe tener t, c, v como strings', () => {
        QumranData.SALMOS.forEach((salmo) => {
            expect(typeof salmo.t).toBe('string');
            expect(salmo.t.length).toBeGreaterThan(0);
            expect(typeof salmo.c).toBe('string');
            expect(salmo.c.length).toBeGreaterThan(0);
            expect(typeof salmo.v).toBe('string');
            expect(salmo.v.length).toBeGreaterThan(0);
        });
    });
});

describe('QumranData — CANTICOS_SHABAT', () => {
    test('debe tener exactamente 13 cÃ¡nticos', () => {
        expect(QumranData.CANTICOS_SHABAT).toHaveLength(13);
    });

    test('cada cÃ¡ntico debe tener t, c, v', () => {
        QumranData.CANTICOS_SHABAT.forEach((cantico) => {
            expect(typeof cantico.t).toBe('string');
            expect(typeof cantico.c).toBe('string');
            expect(typeof cantico.v).toBe('string');
        });
    });
});

describe('QumranData — HALAKHA', () => {
    test('debe tener exactamente 52 halajot', () => {
        expect(QumranData.HALAKHA).toHaveLength(52);
    });

    test('cada halajÃ¡ debe tener t, h, c, f, q, a, r', () => {
        QumranData.HALAKHA.forEach((hal) => {
            expect(typeof hal.t).toBe('string');
            expect(typeof hal.h).toBe('string');
            expect(typeof hal.c).toBe('string');
            expect(typeof hal.f).toBe('string');
            expect(typeof hal.q).toBe('string');
            expect(typeof hal.a).toBe('string');
            expect(typeof hal.r).toBe('string');
        });
    });
});
