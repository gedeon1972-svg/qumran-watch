/**
 * src/js/utils/calculations.js
 * Funciones de cálculo puras — sin efectos secundarios, fácilmente testeables.
 */

import { QumranData } from '../data.js';
import { QumranCalendar } from '../calendar.js';

/**
 * Encuentra la fecha gregoriana de una fiesta de Qumrán en un año dado.
 * @param {number} festivalIndex - Índice en QumranData.FIESTAS
 * @param {number} year - Año gregoriano
 * @returns {Date|null}
 */
export function findFestivalDate(festivalIndex, year) {
    const f = QumranData.FIESTAS?.[festivalIndex];
    if (!f) return null;
    const anchorGreg = new Date(year, 2, 20);
    for (let i = -20; i < 370; i++) {
        const d = new Date(anchorGreg.getTime() + i * 86400000);
        const q = QumranCalendar.calculate(d);
        if (q && !q.special && q.m === f.m && q.d === f.d) {
            return d;
        }
    }
    return null;
}

/**
 * Calcula el día de la Cuenta del Omer (1-49) o null si no aplica.
 * @param {object} qDate - Resultado de QumranCalendar.calculate
 * @returns {number|null}
 */
export function calcOmerDay(qDate) {
    if (!qDate || qDate.m === undefined || qDate.special) return null;
    if (qDate.m === 0 && qDate.d >= 26) return qDate.d - 25;
    if (qDate.m === 1) return 5 + qDate.d;
    if (qDate.m === 2 && qDate.d <= 15) return 35 + qDate.d;
    return null;
}

/**
 * Obtiene todos los festivales de un año gregoriano.
 * @param {number} year - Año gregoriano
 * @returns {Array<{date: Date, q: object, index: number}>}
 */
export function getFestivalsForYear(year) {
    const test = new Date(year, 2, 5);
    const results = [];
    for (let i = 0; i < 380; i++) {
        const d = new Date(test.getTime() + i * 86400000);
        const q = QumranCalendar.calculate(d);
        if (!q || q.special) continue;
        const fIdx = QumranData.FIESTAS.findIndex((x) => x.m === q.m && x.d === q.d);
        if (fIdx !== -1) {
            results.push({ date: d, q, index: fIdx });
        }
    }
    return results;
}

/**
 * Genera mensajes de alerta del vigía.
 * @param {Date} hoy - Fecha gregoriana actual
 * @param {object} qHoy - Resultado de QumranCalendar.calculate
 * @returns {{ msg: string, omerDay: number|null }}
 */
export function getWatcherAlerts(hoy, qHoy) {
    let msg = '';

    if (qHoy?.idxSem === 5) {
        msg += '<strong>\u00a1D\u00eda de Preparaci\u00f3n!</strong><br>El Shabat entra al pr\u00f3ximo amanecer.';
    }

    for (let i = 1; i <= 3; i++) {
        const fut = new Date(hoy.getTime() + i * 86400000);
        const qFut = QumranCalendar.calculate(fut);
        if (qFut && !qFut.special) {
            const fIdx = QumranData.FIESTAS.findIndex((x) => x.m === qFut.m && x.d === qFut.d);
            if (fIdx !== -1) {
                if (msg !== '') msg += "<br><hr style='border-color:var(--gold); opacity:0.3; margin:8px 0;'>";
                msg +=
                    '<strong>\u00a1Atenci\u00f3n!</strong><br>En ' +
                    i +
                    ' d\u00eda(s) es <strong>' +
                    QumranData.FIESTAS[fIdx].n +
                    '</strong>.';
            }
        }
    }

    const omerDay = calcOmerDay(qHoy);

    return { msg, omerDay };
}
