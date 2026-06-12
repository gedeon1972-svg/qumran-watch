import { QumranData } from '../core/data.js';

export function renderCalendarView(festivals, year) {
    const list = document.getElementById('cal-lista');
    if (!list) return;

    const calContainer = list.parentElement;
    if (calContainer && !document.getElementById('cal-print-toolbar')) {
        const toolbar = document.createElement('div');
        toolbar.id = 'cal-print-toolbar';
        toolbar.className = 'cal-print-toolbar';
        toolbar.innerHTML =
            '<button id="btn-print-cal" class="btn-action btn-secondary">\uD83D\uDDA8\uFE0F Imprimir Calendario</button>';
        toolbar.querySelector('#btn-print-cal').addEventListener('click', function () {
            window.print();
        });
        calContainer.insertBefore(toolbar, list);
    }

    let html = '';
    festivals.forEach(({ date: d, q, index: fIdx }) => {
        const f = QumranData.FIESTAS[fIdx];
        let dateLabel = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        if (f.dur > 1) {
            const end = new Date(d.getTime() + (f.dur - 1) * 86400000);
            dateLabel += ' - ' + end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        }
        const nombreMes = QumranData.MESES[q.m];
        html += `            <div class="edu-card fiesta interactive-card" data-index="${fIdx}" data-year="${year}">
                <div class="edu-card-title">${f.n}</div>
                <div class="edu-card-subtitle">${f.es}</div>
                <div class="card-meta-info">
                    <span>${dateLabel}</span>
                    <span class="q-date">Día ${q.d} &bull; ${nombreMes}</span>
                </div></div>`;
    });
    list.innerHTML = html || "<div class='card'>No se encontraron fiestas.</div>";
}
