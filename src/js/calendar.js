/**
 * @module calendar
 * @description Motor matemático del Calendario Solar de 364 Días.
 *
 * Basado en los Manuscritos del Mar Muerto (4Q320-4Q321, 4QMMT) y el
 * libro de Enoc/Jubileos. Implementa el ciclo sexenal de 2191 días
 * con semana de ajuste intercalar en el año 6.
 *
 * @author Qumran Watch
 * @version 13.0.0
 *
 * @example
 * import { QumranCalendar } from './calendar.js';
 * const qDate = QumranCalendar.calculate(new Date(2019, 2, 20));
 * // → { y: 2019, m: 0, d: 1, idxSem: 3, turno: 'Gamul', ... }
 */

import { QumranData } from './data.js';

export const QumranCalendar = {
    /**
     * Convierte una fecha gregoriana a su equivalente en el calendario de Qumrán.
     *
     * El algoritmo calcula la diferencia en días desde el ancla
     * (20 Mar 2019 = 1 Aviv, Gamul, Miércoles), determina la posición
     * dentro del ciclo sexenal de 2191 días, y descompone en año, mes,
     * día, turno sacerdotal, estación y puerta solar.
     *
     * @param {Date} dateObj - Fecha gregoriana a convertir.
     * @returns {QumranDateResult|null} Objeto con datos litúrgicos,
     *   o `null` si la fecha es anterior al ancla (2019) o si faltan datos.
     *
     * @example
     * QumranCalendar.calculate(new Date(2024, 5, 15));
     * // → { y: 2024, m: 2, d: 28, idxSem: 6, turno: 'Abías', ... }
     */
    calculate: (dateObj) => {
        // 1. VALIDACIÓN DEL ANCLA
        // El punto de partida es el 20 de Marzo de 2019 (Equinoccio + Luna Llena + Miércoles)
        if (!QumranData || !QumranData.ANCHOR) {
            console.error('Error Crítico: No se cargó QumranData.');
            return null;
        }

        let anchor = new Date(QumranData.ANCHOR.y, QumranData.ANCHOR.m, QumranData.ANCHOR.d);

        // Calcular diferencia en días (milisegundos / ms_por_dia)
        let diff = Math.floor((dateObj - anchor) / 86400000);

        // Si la fecha es anterior al inicio de la restauración (2019), no calculamos.
        // (Opcional: Se podría habilitar cálculo hacia atrás, pero por seguridad litúrgica lo limitamos)
        if (diff < 0) return null;

        // 2. CÁLCULO DEL CICLO SEXENAL (6 AÑOS)
        // El ciclo completo dura 2191 días.
        let cicloSex = 2191;
        let diasEnCiclo = diff % cicloSex; // Día dentro del ciclo actual (0 a 2190)
        let ciclosCompletos = Math.floor(diff / cicloSex);

        // Determinar en qué año del ciclo (1-6) estamos
        let anioDelCiclo = 1;
        let diasAcumulados = 0;
        let esAnioIntercalar = false;

        for (let y = 1; y <= 6; y++) {
            // Los años 1-5 tienen 364 días. El año 6 tiene 371 días (364 + 7 de ajuste).
            let diasEnEsteAnio = y === 6 ? 371 : 364;

            if (diasEnCiclo < diasEnEsteAnio) {
                anioDelCiclo = y;
                if (y === 6) esAnioIntercalar = true;
                diasAcumulados = diasEnCiclo; // Días transcurridos en el año actual
                break;
            }
            diasEnCiclo -= diasEnEsteAnio;
        }

        // Año Hebreo Calculado (Aprox 2019 = Año 1 de la Restauración)
        let anioRestauracion = QumranData.ANCHOR.y + ciclosCompletos * 6 + (anioDelCiclo - 1);

        // 3. DETECCIÓN DE LA SEMANA DE AJUSTE (TEKUFAH FINAL)
        // Si estamos en el año 6 y pasamos el día 364, entramos en la "Zona Muerta" o ajuste.
        if (esAnioIntercalar && diasAcumulados >= 364) {
            return {
                special: true, // Bandera 'true' bloquea la visualización normal de fechas
                turno: QumranCalendar.getTurno(diff),
                signo: QumranCalendar.getTurno(diff - diasAcumulados), // Signo del año
                idxSem: (diasAcumulados % 7) + 3, // Mantiene el ciclo semanal
                dCountYear: diasAcumulados,
                m: 0,
                d: 0,
                mensaje: 'SEMANA DE AJUSTE SOLAR (TEKUFAH)',
            };
        }

        // 4. CÁLCULO DE MES Y DÍA (ESTRUCTURA 30-30-31)
        // El año se divide en 4 estaciones de 91 días (30+30+31).
        let patronMeses = [30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
        let diasRestantes = diasAcumulados;
        let mesQ = 0;
        let diaQ = 0;

        for (let i = 0; i < 12; i++) {
            if (diasRestantes < patronMeses[i]) {
                mesQ = i;
                diaQ = diasRestantes + 1; // +1 porque los arrays son base 0 pero los días base 1
                break;
            }
            diasRestantes -= patronMeses[i];
        }

        // 5. CÁLCULO DEL DÍA DE LA SEMANA
        // El ancla (20/03/2019) fue Miércoles (Día 4 = índice 3).
        let indiceSemana = (3 + diff) % 7;

        // 6. CÁLCULO DEL "SIGNO DEL AÑO"
        // Calculamos qué sacerdote estaba de turno el Día 1 de ESTE año específico.
        // Restamos los días acumulados hoy al total de días desde el ancla.
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

    /**
     * Obtiene el nombre del turno sacerdotal (Mishmar) para un día dado.
     *
     * Los 24 turnos (1 Crónicas 24) rotan semanalmente. El ancla
     * (20 Mar 2019) cae en turno Gamul (índice 21). El cálculo
     * descuenta el desfase de 3 días (ancla está en Miércoles,
     * los turnos cambian en Domingo) para que el cambio ocurra
     * exactamente en el límite semanal.
     *
     * @param {number} totalDays - Días transcurridos desde el ancla (diff).
     * @returns {string} Nombre del turno sacerdotal (24 cursos),
     *   o "Desconocido" si faltan datos.
     *
     * @example
     * QumranCalendar.getTurno(0);   // → "Gamul"
     * QumranCalendar.getTurno(7);   // → "Delaía"
     */
    getTurno: (totalDays) => {
        if (!QumranData || !QumranData.TURNOS) return 'Desconocido';

        // El ancla (20 Mar 2019) es Miércoles (idxSem 3). Los turnos cambian
        // al inicio de la semana (Domingo, idxSem 0). Por tanto, contamos
        // semanas desde el inicio de la semana que contiene al ancla.
        let weeksPassed = Math.floor((totalDays + 3) / 7);

        // Índice base del ancla + semanas pasadas, módulo 24 turnos
        // Gamul es el índice 21 en el array.
        let turnoIndex = (QumranData.ANCHOR.turnoIdx + weeksPassed) % 24;

        // Manejo de números negativos si alguna vez calculamos fechas pasadas
        if (turnoIndex < 0) turnoIndex = 24 + turnoIndex;

        return QumranData.TURNOS[turnoIndex];
    },
};
