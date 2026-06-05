/**
 * js/ics.js
 * GENERADOR DE ALARMAS ICS
 * Crea un archivo de calendario para sincronizar con Google/Apple Calendar.
 */

import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';

export const QumranICS = {
    generateAndDownload: (year) => {
        // Calcular inicio dinámico: buscar 1 de Aviv (Mes 1, Día 1) del año solicitado
        let startDate = QumranICS.findLiturgicalStart(year);
        if (!startDate) {
            throw new Error('No se pudo determinar el inicio del año litúrgico para ' + year);
        }

        // Cabecera estándar del archivo ICS
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Qumran Watch//ES\nCALSCALE:GREGORIAN\n';

        // Calculamos 400 días para cubrir el año litúrgico completo
        for (let i = 0; i < 400; i++) {
            let d = new Date(startDate.getTime() + i * 86400000);
            let q = QumranCalendar.calculate(d);

            if (!q || q.special) continue;

            // 1. Añadir Alertas de las Fiestas (Moedim)
            let fIdx = QumranData.FIESTAS.findIndex((x) => x.m === q.m && x.d === q.d);
            if (fIdx !== -1) {
                let f = QumranData.FIESTAS[fIdx];
                let dateStr = d
                    .toISOString()
                    .replace(/-|:|\.\d+/g, '')
                    .substring(0, 8);

                icsContent += 'BEGIN:VEVENT\n';
                icsContent += `SUMMARY:Fiesta de YHWH: ${f.n}\n`;
                icsContent += `DESCRIPTION:${f.es} - ${f.instr || ''}\n`;
                icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
                icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;

                // Configuración de ALARMA PUSH nativa (1 día antes)
                icsContent += 'BEGIN:VALARM\n';
                icsContent += 'TRIGGER:-P1D\n';
                icsContent += 'ACTION:DISPLAY\n';
                icsContent += `DESCRIPTION:Recordatorio: ${f.n}\n`;
                icsContent += 'END:VALARM\n';
                icsContent += 'END:VEVENT\n';
            }

            // 2. Añadir Alertas del Shabat (Aviso de Preparación el viernes)
            if (q.idxSem === 6) {
                // Si es Sábado en Qumrán
                let dateStr = d
                    .toISOString()
                    .replace(/-|:|\.\d+/g, '')
                    .substring(0, 8);

                icsContent += 'BEGIN:VEVENT\n';
                icsContent += `SUMMARY:Shabat (Qumrán)\n`;
                icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
                icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;

                // Configuración de ALARMA PUSH nativa (12 horas antes)
                icsContent += 'BEGIN:VALARM\n';
                icsContent += 'TRIGGER:-PT12H\n';
                icsContent += 'ACTION:DISPLAY\n';
                icsContent += `DESCRIPTION:Día de Preparación para el Shabat\n`;
                icsContent += 'END:VALARM\n';
                icsContent += 'END:VEVENT\n';
            }
        }

        icsContent += 'END:VCALENDAR';

        // Empaquetar y forzar la descarga
        let blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `Qumran_Moedim_${year}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    findLiturgicalStart: (year) => {
        // Buscar 1 de Aviv (Mes 0, Día 1) escaneando alrededor del 20 de Marzo
        let base = new Date(year, 2, 15);
        for (let i = 0; i < 30; i++) {
            let d = new Date(base.getTime() + i * 86400000);
            let q = QumranCalendar.calculate(d);
            if (q && !q.special && q.m === 0 && q.d === 1) {
                return d;
            }
        }
        return null;
    },
};
