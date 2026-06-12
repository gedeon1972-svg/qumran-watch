import { QumranData } from '../core/data.js';

export function renderCalendarView(festivals, year) {
    const list = document.getElementById('cal-lista');
    if (!list) return;
    let html = '';
    festivals.forEach(({ date: d, q, index: fIdx }) => {
        const f = QumranData.FIESTAS[fIdx];
        let dateLabel = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        if (f.dur > 1) {
            const end = new Date(d.getTime() + (f.dur - 1) * 86400000);
            dateLabel += ' - ' + end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        }
        const nombreMes = QumranData.MESES[q.m];
        html += `
            <div class="edu-card fiesta interactive-card" data-index="${fIdx}" data-year="${year}">
                <div class="edu-card-title">${f.n}</div>
                <div class="edu-card-subtitle">${f.es}</div>
                <div class="card-meta-info">
                    <span>${dateLabel}</span>
                    <span class="q-date">Día ${q.d} &bull; ${nombreMes}</span>
                </div></div>`;
    });
    list.innerHTML = html || "<div class='card'>No se encontraron fiestas.</div>";
}
