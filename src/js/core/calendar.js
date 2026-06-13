/**
 * @module calendar
 * @description Motor matemÃƒÂ¡tico del Calendario Solar de 364 DÃƒÂas.
 *
 * Basado en los Manuscritos del Mar Muerto (4Q320-4Q321, 4QMMT) y el
 * libro de Enoc/Jubileos. Implementa el ciclo sexenal de 2191 dÃƒÂas
 * con semana de ajuste intercalar en el aÃƒÂ±o 6.
 *
 * El sistema Mishmarot (24 turnos sacerdotales) sigue la secuencia
 * de Prophecy Vine / The Creation Calendar:
 *   AÃƒÂ±o 1: Gamul (ÃƒÂndice 21) Ã¢â€ â€™ AÃƒÂ±o 2: JedaÃƒÂas (1) Ã¢â€ â€™ AÃƒÂ±o 3: MijamÃƒÂn (5)
 *   AÃƒÂ±o 4: SecanÃƒÂas (9) Ã¢â€ â€™ AÃƒÂ±o 5: Jesebeab (13) Ã¢â€ â€™ AÃƒÂ±o 6: Afses (17)
 *
 * @author Qumran Watch
 * @version 13.0.0
 */

import { QumranData } from './data.js';

export const QumranCalendar = {
    calculate: (dateObj) => {
        if (!QumranData || !QumranData.ANCHOR) {
            console.error('Error CrÃƒÂtico: No se cargÃƒÂ³ QumranData.');
            return null;
        }

        const anchor = new Date(QumranData.ANCHOR.y, QumranData.ANCHOR.m, QumranData.ANCHOR.d);
        const diff = Math.floor((dateObj - anchor) / 86400000);
        if (diff < 0) return null;

        const CICLO_SEX = 2191;
        let diasEnCiclo = diff % CICLO_SEX;
        const ciclosCompletos = Math.floor(diff / CICLO_SEX);

        let anioDelCiclo = 1;
        let diasAcumulados = 0;
        let esAnioIntercalar = false;

        for (let y = 1; y <= 6; y++) {
            const diasEnEsteAnio = y === 6 ? 371 : 364;
            if (diasEnCiclo < diasEnEsteAnio) {
                anioDelCiclo = y;
                if (y === 6) esAnioIntercalar = true;
                diasAcumulados = diasEnCiclo;
                break;
            }
            diasEnCiclo -= diasEnEsteAnio;
        }

        const anioRestauracion = QumranData.ANCHOR.y + ciclosCompletos * 6 + (anioDelCiclo - 1);

        if (esAnioIntercalar && diasAcumulados >= 364) {
            return {
                special: true,
                turno: QumranCalendar.getTurno(diff),
                signo: QumranCalendar.getTurno(diff - diasAcumulados),
                idxSem: (diasAcumulados % 7) + 3,
                dCountYear: diasAcumulados,
                m: 0,
                d: 0,
                mensaje: 'SEMANA DE AJUSTE SOLAR (TEKUFAH)',
            };
        }

        const patronMeses = [30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
        let diasRestantes = diasAcumulados;
        let mesQ = 0;
        let diaQ = 0;

        for (let i = 0; i < 12; i++) {
            // eslint-disable-next-line security/detect-object-injection
            if (diasRestantes < patronMeses[i]) {
                mesQ = i;
                diaQ = diasRestantes + 1;
                break;
            }
            // eslint-disable-next-line security/detect-object-injection
            diasRestantes -= patronMeses[i];
        }

        const indiceSemana = (3 + diff) % 7;
        const diasAlInicioDelAnio = diff - diasAcumulados;
        const signoDelAnio = QumranCalendar.getTurno(diasAlInicioDelAnio);

        return {
            y: anioRestauracion,
            m: mesQ,
            d: diaQ,
            idxSem: indiceSemana,
            turno: QumranCalendar.getTurno(diff),
            signo: signoDelAnio,
            est: mesQ < 3 ? 'Primavera' : mesQ < 6 ? 'Verano' : mesQ < 9 ? 'OtoÃƒÂ±o' : 'Invierno',
            // eslint-disable-next-line security/detect-object-injection
            puerta: QumranData.PUERTAS_SOLARES ? QumranData.PUERTAS_SOLARES[mesQ] : 0,
            dCountYear: diasAcumulados,
            special: false,
        };
    },

    getTurno: (totalDays) => {
        if (!QumranData || !QumranData.TURNOS) return 'Desconocido';

        // Ciclo sexenal de 2191 dÃƒÂas (364*5 + 371)
        const YEAR_DAYS = [364, 364, 364, 364, 364, 371];
        let rem = totalDays % 2191;
        let yearInCycle = 0;

        for (let i = 0; i < YEAR_DAYS.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            if (rem < YEAR_DAYS[i] || i === YEAR_DAYS.length - 1) {
                yearInCycle = i;
                break;
            }
            // eslint-disable-next-line security/detect-object-injection
            rem -= YEAR_DAYS[i];
        }

        const weekOfYear = Math.floor(rem / 7);
        const absoluteWeek = yearInCycle * 52 + weekOfYear;
        const courseIndex = (21 + absoluteWeek) % 24;
        // eslint-disable-next-line security/detect-object-injection
        return QumranData.TURNOS[courseIndex];
    },
};
