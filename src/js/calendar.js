/**
 * @module calendar
 * @description Motor matemático del Calendario Solar de 364 Días.
 *
 * Basado en los Manuscritos del Mar Muerto (4Q320-4Q321, 4QMMT) y el
 * libro de Enoc/Jubileos. Implementa el ciclo sexenal de 2191 días
 * con semana de ajuste intercalar en el año 6.
 *
 * El sistema Mishmarot (24 turnos sacerdotales) sigue la secuencia
 * de Prophecy Vine / The Creation Calendar:
 *   Año 1: Gamul (índice 21) → Año 2: Jedaías (1) → Año 3: Mijamín (5)
 *   Año 4: Secanías (9) → Año 5: Jesebeab (13) → Año 6: Afses (17)
 *
 * @author Qumran Watch
 * @version 13.0.0
 */
 
import { QumranData } from './data.js';

export const QumranCalendar = {
    calculate: (dateObj) => {
        if (!QumranData || !QumranData.ANCHOR) {
            console.error('Error Crítico: No se cargó QumranData.');
            return null;
        }

        let anchor = new Date(QumranData.ANCHOR.y, QumranData.ANCHOR.m, QumranData.ANCHOR.d);
        let diff = Math.floor((dateObj - anchor) / 86400000);
        if (diff < 0) return null;

        const CICLO_SEX = 2191;
        let diasEnCiclo = diff % CICLO_SEX;
        let ciclosCompletos = Math.floor(diff / CICLO_SEX);

        let anioDelCiclo = 1;
        let diasAcumulados = 0;
        let esAnioIntercalar = false;

        for (let y = 1; y <= 6; y++) {
            let diasEnEsteAnio = y === 6 ? 371 : 364;
            if (diasEnCiclo < diasEnEsteAnio) {
                anioDelCiclo = y;
                if (y === 6) esAnioIntercalar = true;
                diasAcumulados = diasEnCiclo;
                break;
            }
            diasEnCiclo -= diasEnEsteAnio;
        }

        let anioRestauracion = QumranData.ANCHOR.y + ciclosCompletos * 6 + (anioDelCiclo - 1);

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

        let patronMeses = [30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
        let diasRestantes = diasAcumulados;
        let mesQ = 0;
        let diaQ = 0;

        for (let i = 0; i < 12; i++) {
            if (diasRestantes < patronMeses[i]) {
                mesQ = i;
                diaQ = diasRestantes + 1;
                break;
            }
            diasRestantes -= patronMeses[i];
        }

        let indiceSemana = (3 + diff) % 7;
        let diasAlInicioDelAnio = diff - diasAcumulados;
        let signoDelAnio = QumranCalendar.getTurno(diasAlInicioDelAnio);

        return {
            y: anioRestauracion,
            m: mesQ,
            d: diaQ,
            idxSem: indiceSemana,
            turno: QumranCalendar.getTurno(diff),
            signo: signoDelAnio,
            est: mesQ < 3 ? 'Primavera' : mesQ < 6 ? 'Verano' : mesQ < 9 ? 'Otoño' : 'Invierno',
            puerta: QumranData.PUERTAS_SOLARES ? QumranData.PUERTAS_SOLARES[mesQ] : 0,
            dCountYear: diasAcumulados,
            special: false,
        };
    },

    getTurno: (totalDays) => {
        if (!QumranData || !QumranData.TURNOS) return 'Desconocido';

        // Ciclo sexenal de 2191 días (364*5 + 371)
        const YEAR_DAYS = [364, 364, 364, 364, 364, 371];
        let rem = totalDays % 2191;
        let yearInCycle = 0;

        for (let i = 0; i < YEAR_DAYS.length; i++) {
            if (rem < YEAR_DAYS[i] || i === YEAR_DAYS.length - 1) {
                yearInCycle = i;
                break;
            }
            rem -= YEAR_DAYS[i];
        }

        const weekOfYear = Math.floor(rem / 7);
        const absoluteWeek = (yearInCycle * 52) + weekOfYear;
        const courseIndex = (21 + absoluteWeek) % 24;

        return QumranData.TURNOS[courseIndex];
    },
};
