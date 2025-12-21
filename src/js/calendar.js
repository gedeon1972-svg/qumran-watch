/**
 * src/js/calendar.js
 * EL MOTOR MATEMÁTICO: Lógica pura de conversión de fechas.
 * No toca el DOM (HTML). Solo recibe fechas y devuelve datos.
 * Depende de: QumranData (data.js)
 */

const QumranCalendar = {

    /**
     * Calcula la fecha Qumrán para una fecha Gregoriana dada.
     * @param {Date} dateObj - Fecha Gregoriana
     * @returns {Object|null} - Objeto con datos del calendario o null si es anterior al ancla.
     */
    calculate: (dateObj) => {
        // 1. Definir el Ancla (20 Marzo 2019)
        let anchor = new Date(QumranData.ANCHOR.y, QumranData.ANCHOR.m, QumranData.ANCHOR.d);
        
        // 2. Calcular diferencia en días
        let diff = Math.floor((dateObj - anchor) / 86400000);
        
        // Si la fecha es anterior al 2019, devolvemos null
        if (diff < 0) return null;

        // 3. Ciclo de 6 Años (Sexenio)
        // 5 años de 364 días + 1 año de 371 días = 2191 días
        let cicloSex = 2191; 
        let enCiclo = diff % cicloSex;
        
        // Determinar en qué año del ciclo (1-6) estamos
        let yInC = 1, dCount = 0, isInter = false;
        
        for (let y = 1; y <= 6; y++) {
            // El año 6 tiene 371 días (Semana de Ajuste extra), los demás 364
            let dYear = (y === 6) ? 371 : 364;
            
            if (enCiclo < dYear) { 
                yInC = y; 
                if(y === 6) isInter = true; // Estamos en año de ajuste
                dCount = enCiclo; 
                break; 
            }
            enCiclo -= dYear;
        }

        // 4. Detectar Semana de Ajuste (Días 364-370 del año 6)
        // Si estamos en año 6 y pasamos el día 364, es la semana extra.
        if (isInter && dCount >= 364) { 
            return { 
                special: true, // Bandera para indicar que no es un día normal
                turno: QumranCalendar.getTurno(diff), 
                idxSem: (dCount % 7) + 3, // Cálculo del día de la semana
                dCountYear: dCount, 
                m: 0, 
                d: 0 
            }; 
        }

        // 5. Calcular Mes y Día dentro del año normal (Patrón 30-30-31)
        let ptrn = [30,30,31,30,30,31,30,30,31,30,30,31];
        let dRest = dCount, mQ = 0, dQ = 0;
        
        for (let i = 0; i < 12; i++) {
            if (dRest < ptrn[i]) { 
                mQ = i; 
                dQ = dRest + 1; // +1 porque los días empiezan en 1, no 0
                break; 
            }
            dRest -= ptrn[i];
        }
        
        // 6. Retornar el Objeto de Fecha Qumrán Completo
        return {
            m: mQ,                 // Índice del mes (0-11)
            d: dQ,                 // Día del mes (1-31)
            idxSem: (3 + diff) % 7, // Día de la semana (0-6, donde 6 es Shabat)
                                    // Se suma 3 porque el ancla (2019) fue Miércoles (Día 4 -> índice 3)
            
            turno: QumranCalendar.getTurno(diff), // Nombre del Mishmar
            
            // Estación del año basada en el mes
            est: (mQ < 3 ? "Primavera" : (mQ < 6 ? "Verano" : (mQ < 9 ? "Otoño" : "Invierno"))),
            
            puerta: QumranData.PUERTAS_SOLARES[mQ], // Puerta de Enoc
            dCountYear: dCount,      // Día número X del año (1-364)
            special: false
        };
    },

    /**
     * Cálculo del Turno Sacerdotal (Ciclo continuo de 24 semanas)
     */
    getTurno: (totalDays) => {
        // Semanas transcurridas desde el ancla
        let weeksPassed = Math.floor(totalDays / 7);
        // Índice base del ancla + semanas pasadas, módulo 24 turnos
        let turnoIndex = (QumranData.ANCHOR.turnoIdx + weeksPassed) % 24;
        return QumranData.TURNOS[turnoIndex];
    }
};