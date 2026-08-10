/**
 * js/ics.js
 * GENERADOR DE ALARMAS ICS
 * Crea un archivo de calendario para sincronizar con Google/Apple Calendar.
 */

import { QumranData } from './core/data.js';
import { QumranCalendar } from './core/calendar.js';
import { idb } from './core/idb.js';

export const QumranICS = {
    generateAndDownload: (year) => {
        // Calcular inicio dinámico: buscar 1 de Aviv (Mes 1, Día 1) del año solicitado
        const startDate = QumranICS.findLiturgicalStart(year);
        if (!startDate) {
            throw new Error('No se pudo determinar el inicio del año litúrgico para ' + year);
        }

        // Cabecera estándar del archivo ICS
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Qumran Watch//ES\nCALSCALE:GREGORIAN\n';

        // Calculamos 400 días para cubrir el año litúrgico completo
        for (let i = 0; i < 400; i++) {
            const d = new Date(startDate.getTime() + i * 86400000);
            const q = QumranCalendar.calculate(d);

            if (!q || q.special) continue;

            // 1. Añadir Alertas de las Fiestas (Moedim)
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
                const dateStr = d
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

    // Encolar generacion ICS para sincronizacion en background
    async queueICSForSync(year) {
        try {
            const id = await idb.add({ year, status: 'pending' });
            // Registrar background sync si esta disponible
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('ics-sync');
            }
            return id;
        } catch (err) {
            console.warn('No se pudo encolar ICS para sync:', err);
            // Fallback: generar directamente si hay conexion
            if (navigator.onLine) {
                QumranICS.generateAndDownload(year);
            }
            throw err;
        }
    },

    // Procesar cola de sincronizacion ICS
    async processICSSyncQueue() {
        const pending = await idb.getAll('pending');
        if (pending.length === 0) return { processed: 0 };

        let processed = 0;
        for (const item of pending) {
            try {
                // Marcar como procesando
                await idb.update(item.id, { status: 'processing' });

                // Generar y descargar el ICS
                QumranICS.generateAndDownload(item.year);

                // Marcar como completado
                await idb.update(item.id, { status: 'completed', completedAt: Date.now() });
                processed++;
            } catch (err) {
                console.error('Error procesando ICS sync:', err);
                await idb.update(item.id, { status: 'failed', error: err.message });
            }
        }

        // Limpiar completados antiguos (> 24h)
        const completed = await idb.getAll('completed');
        const now = Date.now();
        for (const item of completed) {
            if (now - (item.completedAt || item.timestamp) > 24 * 60 * 60 * 1000) {
                await idb.delete(item.id);
            }
        }

        return { processed };
    },

    findLiturgicalStart: (year) => {
        // Buscar 1 de Aviv (Mes 0, Día 1) escaneando desde el 1 de Marzo
        // Se necesitan ~45 días por la deriva del año de 364 días
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
