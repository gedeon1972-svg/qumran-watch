import { QumranData } from '../core/data.js';
import { openPrintWindow } from './print-view.js';

export function renderCalendarView(festivals, year) {
    const list = document.getElementById('cal-lista');
    if (!list) return;

    const calContainer = list.parentElement;
    if (calContainer && !document.getElementById('cal-print-toolbar')) {
        const toolbar = document.createElement('div');
        toolbar.id = 'cal-print-toolbar';
        toolbar.className = 'cal-print-toolbar';
        toolbar.innerHTML = '<button id="btn-print-cal" class="btn-action btn-secondary">Imprimir Calendario</button>';
        toolbar.querySelector('#btn-print-cal').addEventListener('click', function () {
            const yearEl = document.getElementById('cal-year');
            const y = yearEl ? parseInt(yearEl.value) : new Date().getFullYear();
            openPrintWindow(y);
        });
        calContainer.insertBefore(toolbar, list);
    }

    let html = '';
    festivals.forEach(function (_a) {
        const d = _a.date;
        const q = _a.q;
        const fIdx = _a.index;
        // eslint-disable-next-line security/detect-object-injection
        const f = QumranData.FIESTAS[fIdx];
        let dateLabel = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        if (f.dur > 1) {
            const end = new Date(d.getTime() + (f.dur - 1) * 86400000);
            dateLabel += ' - ' + end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        }

        const nombreMes = QumranData.MESES[q.m];
        html +=
            '<div class="edu-card fiesta interactive-card" data-index="' +
            fIdx +
            '" data-year="' +
            year +
            '">' +
            '<div class="edu-card-title">' +
            f.n +
            '</div>' +
            '<div class="edu-card-subtitle">' +
            f.es +
            '</div>' +
            '<div class="card-meta-info">' +
            '<span>' +
            dateLabel +
            '</span>' +
            '<span class="q-date">Dia ' +
            q.d +
            ' &bull; ' +
            nombreMes +
            '</span>' +
            '</div></div>';
    });
    list.innerHTML = html || "<div class='card'>No se encontraron fiestas.</div>";
}
