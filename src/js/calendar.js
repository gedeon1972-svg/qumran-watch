/**
 * src/js/calendar.js
 * EL MOTOR MATEMÁTICO: Lógica pura de conversión de fechas.
 * ---------------------------------------------------------
 * FUNDAMENTO ASTRONÓMICO Y TEOLÓGICO:
 * 1. Año Solar Perfecto: 364 días (52 semanas exactas).
 * 2. Ciclo Sacerdotal (Mishmarot): 6 años para sincronizar.
 * 3. Ajuste Solar: El año solar real es ~365.24 días. 
 * - En 6 años de 364 días acumulamos un déficit de ~7.5 días.
 * - El calendario de Qumrán/Enoc corrige esto añadiendo una "Semana de Ajuste"
 * al final del 6to año (Año de Intercalación).
 * - Ciclo total: (364 x 5) + 371 = 2191 días (Exactamente 313 semanas).
 * * Dependencias: QumranData (data.js) para Ancla y Nombres.
 */

const QumranCalendar = {

    /**
     * Calcula la fecha Qumrán para una fecha Gregoriana dada.
     * @param {Date} dateObj - Fecha Gregoriana de entrada
     * @returns {Object|null} - Objeto con datos litúrgicos o null si es fecha inválida.
     */
    calculate: (dateObj) => {
        // 1. VALIDACIÓN DEL ANCLA
        // El punto de partida es el 20 de Marzo de 2019 (Equinoccio + Luna Llena + Miércoles)
        if (!QumranData || !QumranData.ANCHOR) {
            console.error("Error Crítico: No se cargó QumranData.");
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
            let diasEnEsteAnio = (y === 6) ? 371 : 364;
            
            if (diasEnCiclo < diasEnEsteAnio) { 
                anioDelCiclo = y; 
                if(y === 6) esAnioIntercalar = true; 
                diasAcumulados = diasEnCiclo; // Días transcurridos en el año actual
                break; 
            }
            diasEnCiclo -= diasEnEsteAnio;
        }

        // Año Hebreo Calculado (Aprox 2019 = Año 1 de la Restauración)
        let anioRestauracion = QumranData.ANCHOR.y + (ciclosCompletos * 6) + (anioDelCiclo - 1);

        // 3. DETECCIÓN DE LA SEMANA DE AJUSTE (TEKUFAH FINAL)
        // Si estamos en el año 6 y pasamos el día 364, entramos en la "Zona Muerta" o ajuste.
        if (esAnioIntercalar && diasAcumulados >= 364) { 
            return { 
                special: true, // Bandera 'true' bloquea la visualización normal de fechas
                turno: QumranCalendar.getTurno(diff), 
                signo: QumranCalendar.getTurno(diff - diasAcumulados), // Signo del año
                idxSem: (diasAcumulados % 7) + 3, // Mantiene el ciclo semanal
                dCountYear: diasAcumulados, 
                m: 0, d: 0,
                mensaje: "SEMANA DE AJUSTE SOLAR (TEKUFAH)"
            }; 
        }

        // 4. CÁLCULO DE MES Y DÍA (ESTRUCTURA 30-30-31)
        // El año se divide en 4 estaciones de 91 días (30+30+31).
        let patronMeses = [30,30,31,30,30,31,30,30,31,30,30,31];
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

        // 7. CONSTRUCCIÓN DEL OBJETO DE FECHA FINAL
        return {
            y: anioRestauracion,   // Año Gregoriano/Qumrán Híbrido
            m: mesQ,               // Índice del mes (0-11)
            d: diaQ,               // Día del mes (1-31)
            idxSem: indiceSemana,  // 0=Domingo ... 6=Shabat
            
            turno: QumranCalendar.getTurno(diff), // Nombre del Mishmar activo HOY
            signo: signoDelAnio,                  // Nombre del Mishmar que inició el año
            
            // Estación: Se calcula dividiendo los meses en grupos de 3
            est: (mesQ < 3 ? "Primavera" : (mesQ < 6 ? "Verano" : (mesQ < 9 ? "Otoño" : "Invierno"))),
            
            puerta: QumranData.PUERTAS_SOLARES ? QumranData.PUERTAS_SOLARES[mesQ] : 0, 
            dCountYear: diasAcumulados, 
            special: false
        };
    },

    /**
     * Obtiene el Turno Sacerdotal (Mishmar) basado en los días totales.
     * El ciclo es infinito y continuo, no se reinicia anualmente.
     * Al usar 2191 días (divisible por 7) para el ciclo sexenal, la matemática
     * se alinea perfectamente con la realidad astronómica y teológica.
     */
    getTurno: (totalDays) => {
        if (!QumranData || !QumranData.TURNOS) return "Desconocido";
        
        // Semanas completas transcurridas desde el ancla
        let weeksPassed = Math.floor(totalDays / 7);
        
        // Índice base del ancla + semanas pasadas, módulo 24 turnos
        // Gamul es el índice 21 en el array.
        let turnoIndex = (QumranData.ANCHOR.turnoIdx + weeksPassed) % 24;
        
        // Manejo de números negativos si alguna vez calculamos fechas pasadas
        if (turnoIndex < 0) turnoIndex = 24 + turnoIndex;

        return QumranData.TURNOS[turnoIndex];
    }
};