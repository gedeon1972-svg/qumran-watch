/** * src/js/utils/calculations.js * Funciones de cÃ¯Â¿Â½lculo puras Ã¯Â¿Â½ sin efectos secundarios, fÃ¯Â¿Â½cilmente testeables. */ import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';
/** * Encuentra la fecha gregoriana de una fiesta de QumrÃ¯Â¿Â½n en un aÃ¯Â¿Â½o dado. * @param {number} festivalIndex - Ã¯Â¿Â½ndice en QumranData.FIESTAS * @param {number} year - AÃ¯Â¿Â½o gregoriano * @returns {Date|null} */ export function findFestivalDate(
    festivalIndex,
    year,
) {
    // eslint-disable-next-line security/detect-object-injection
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
/** * Calcula el dÃ¯Â¿Â½a de la Cuenta del Omer (1-49) o null si no aplica. * @param {object} qDate - Resultado de QumranCalendar.calculate * @returns {number|null} */ export function calcOmerDay(
    qDate,
) {
    if (!qDate || qDate.m === undefined || qDate.special) return null;
    if (qDate.m === 0 && qDate.d >= 26) return qDate.d - 25;
    if (qDate.m === 1) return 5 + qDate.d;
    if (qDate.m === 2 && qDate.d <= 15) return 35 + qDate.d;
    return null;
}
/** * Obtiene todos los festivales de un aÃ¯Â¿Â½o gregoriano. * @param {number} year - AÃ¯Â¿Â½o gregoriano * @returns {Array<{date: Date, q: object, index: number}>} */ export function getFestivalsForYear(
    year,
) {
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
/** * Genera mensajes de alerta del vigÃ¯Â¿Â½a. * @param {Date} hoy - Fecha gregoriana actual * @param {object} qHoy - Resultado de QumranCalendar.calculate * @returns {{ msg: string, omerDay: number|null }} */ export function getWatcherAlerts(
    hoy,
    qHoy,
) {
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
                            // eslint-disable-next-line security/detect-object-injection
                            QumranData.FIESTAS[fIdx].n +
                    '</strong>.';
            }
        }
    }
    const omerDay = calcOmerDay(qHoy);
    return { msg, omerDay };
}

/**
 * Construye el ViewModel para la vista "Hoy".
 * FunciÃƒÂ³n pura: recibe datos, retorna un objeto plano con strings listos para renderizar.
 * @param {Date} date - Fecha gregoriana (ya ajustada por salida del sol)
 * @param {object} qData - Resultado de QumranCalendar.calculate(date)
 * @param {object} sunData - { rise, set, riseDecimal, lat, lng }
 * @returns {object} ViewModel plano con todos los strings calculados
 */
export function buildHoyViewModel(date, qData) {
    const gregDate = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    if (!qData) return { gregDate };

    if (qData.special) {
        const diaEspecial = qData.dCountYear - 2184;
        return {
            gregDate,
            special: true,
            hebDate: 'SEMANA DE AJUSTE SOLAR',
            hebDia: 'DÃƒÂ­a ' + diaEspecial + ' de 7 Ã¢â‚¬Â¢ Sincronizando Equinoccio',
            gateActive: 'Puerta 4 (AlineaciÃƒÂ³n)',
        };
    }

    const alerts = getWatcherAlerts(date, qData);
    const omerDay = calcOmerDay(qData);

    const hIndex = qData.dCountYear ? Math.floor(qData.dCountYear / 7) % QumranData.HALAKHA.length : 0;
    // eslint-disable-next-line security/detect-object-injection
    const h = QumranData.HALAKHA[hIndex];

    const fIdx = QumranData.FIESTAS.findIndex((x) => x.m === qData.m && x.d === qData.d);

    let percent = ((qData.idxSem + 1) / 7) * 100;
    let s = null;
    let litType = '';
    let litMain = '';

    if (qData.idxSem === 6) {
        percent = 100;
         
        s = QumranData.CANTICOS_SHABAT[Math.floor((qData.dCountYear || 0) / 7) % 13];
        litType = 'LITURGIA CELESTIAL';
        litMain = 'CÃƒÂNTICO DEL SACRIFICIO DEL SHABAT';
    } else {
         
        s = QumranData.SALMOS[qData.idxSem];
        litType = 'LITURGIA DEL TEMPLO';
        litMain = 'SALMO DEL DÃƒÂA';
    }

    return {
        gregDate,
        special: false,
         
        hebDate: qData.d + ' del ' + QumranData.MESES[qData.m],
         
        hebDia: QumranData.DIAS[qData.idxSem],
        turno: qData.turno,
        estacion: qData.est,
        alertMsg: alerts.msg,
        omerDay,
        yamimNoraIm:
            qData.m === 6 && qData.d >= 1 && qData.d <= 10
                 
                ? { dia: qData.d, data: QumranData.YAMIM_NORAIM[qData.d - 1] }
                : null,
        halakha: {
            theme: h.t,
            hebrew: h.h || '',
            context: h.c ? 'Contexto: ' + h.c : '',
            philology: h.f || '',
            quote: '\u201c' + h.q + '\u201d',
            action: h.a + ' (' + h.r + ')',
        },
        // eslint-disable-next-line security/detect-object-injection
        festival: fIdx !== -1 ? { index: fIdx, name: '\u2605 ' + QumranData.FIESTAS[fIdx].n } : null,
        puerta: qData.puerta,
        shabat: {
            idxSem: qData.idxSem,
            percent,
            text: qData.idxSem === 6 ? 'Ã‚Â¡SHABAT SHALOM!' : 'Faltan ' + (6 - qData.idxSem) + ' dÃƒÂ­as para el Shabat',
            shabatBg: qData.idxSem === 6 ? '#fff' : undefined,
        },
        liturgia: {
            type: litType,
            main: litMain,
            title: (s && s.t) || '',
            context: (s && s.c) || '',
            text: (s && s.v) || '',
        },
    };
}