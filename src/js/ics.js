/**
 * js/ics.js
 * GENERADOR DE ALARMAS ICS
 * Crea un archivo de calendario para sincronizar con Google/Apple Calendar.
 */

import { QumranData } from './core/data.js';
import { QumranCalendar } from './core/calendar.js';

export const QumranICS = {
    generateAndDownload: (year) => {
        // Calcular inicio dinÃ¡mico: buscar 1 de Aviv (Mes 1, DÃ­a 1) del aÃ±o solicitado
        const startDate = QumranICS.findLiturgicalStart(year);
        if (!startDate) {
            throw new Error('No se pudo determinar el inicio del aÃ±o litÃºrgico para ' + year);
        }

        // Cabecera estÃ¡ndar del archivo ICS
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Qumran Watch//ES\nCALSCALE:GREGORIAN\n';

        // Calculamos 400 dÃ­as para cubrir el aÃ±o litÃºrgico completo
        for (let i = 0; i < 400; i++) {
            const d = new Date(startDate.getTime() + i * 86400000);
            const q = QumranCalendar.calculate(d);

            if (!q || q.special) continue;

            // 1. AÃ±adir Alertas de las Fiestas (Moedim)
            const fIdx = QumranData.FIESTAS.findIndex((x) => x.m === q.m && x.d === q.d);
            if (fIdx !== -1) {
        // eslint-disable-next-line security/detect-object-injection
                const f = QumranData.FIESTAS[fIdx];
                const dateStr = d
                    .toISOString()
                    .replace(/-|:|\.\d+/g, '')
                    .substring(0, 8);

                icsContent += 'BEGIN:VEVENT\n';
                icsContent += `SUMMARY:Fiesta de YHWH: ${f.n}\n`;
                icsContent += `DESCRIPTION:${f.es} - ${f.instr || ''}\n`;
                icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
                icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;

                // ConfiguraciÃ³n de ALARMA PUSH nativa (1 dÃ­a antes)
                icsContent += 'BEGIN:VALARM\n';
                icsContent += 'TRIGGER:-P1D\n';
                icsContent += 'ACTION:DISPLAY\n';
                icsContent += `DESCRIPTION:Recordatorio: ${f.n}\n`;
                icsContent += 'END:VALARM\n';
                icsContent += 'END:VEVENT\n';
            }

            // 2. AÃ±adir Alertas del Shabat (Aviso de PreparaciÃ³n el viernes)
            if (q.idxSem === 6) {
                // Si es SÃ¡bado en QumrÃ¡n
                const dateStr = d
                    .toISOString()
                    .replace(/-|:|\.\d+/g, '')
                    .substring(0, 8);

                icsContent += 'BEGIN:VEVENT\n';
                icsContent += `SUMMARY:Shabat (QumrÃ¡n)\n`;
                icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
                icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;

                // ConfiguraciÃ³n de ALARMA PUSH nativa (12 horas antes)
                icsContent += 'BEGIN:VALARM\n';
                icsContent += 'TRIGGER:-PT12H\n';
                icsContent += 'ACTION:DISPLAY\n';
                icsContent += `DESCRIPTION:DÃ­a de PreparaciÃ³n para el Shabat\n`;
                icsContent += 'END:VALARM\n';
                icsContent += 'END:VEVENT\n';
            }
        }

        icsContent += 'END:VCALENDAR';

        // Empaquetar y forzar la descarga
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Qumran_Moedim_${year}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    findLiturgicalStart: (year) => {
        // Buscar 1 de Aviv (Mes 0, DÃ­a 1) escaneando desde el 1 de Marzo
        // Se necesitan ~45 dÃ­as por la deriva del aÃ±o de 364 dÃ­as
        const base = new Date(year, 2, 1);
        for (let i = 0; i < 50; i++) {
            const d = new Date(base.getTime() + i * 86400000);
            const q = QumranCalendar.calculate(d);
            if (q && !q.special && q.m === 0 && q.d === 1) {
                return d;
            }
        }
        return null;
    },
};