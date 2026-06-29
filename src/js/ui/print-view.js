import { QumranData } from '../core/data.js';
import { QumranCalendar } from '../core/calendar.js';

function htmlEscape(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        if (m === "'") return '&#39;';
        return m;
    });
}
function findQumranNewYear(year) {
    const start = new Date(year, 2, 15);
    for (let i = -15; i < 390; i++) {
        const d = new Date(start.getTime() + i * 86400000);
        const q = QumranCalendar.calculate(d);
        if (q && !q.special && q.m === 0 && q.d === 1) {
            return d;
        }
    }
    return null;
}

const MONTH_DAYS = [30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];

export function generatePrintHtml(year) {
    /* eslint-disable security/detect-object-injection */
    const newYear = findQumranNewYear(year);
    if (!newYear) {
        return '<p>No se pudo calcular el a\u00f1o de Qumr\u00e1n para ' + htmlEscape(year) + '.</p>';
    }

    const firstQ = QumranCalendar.calculate(newYear);
    const qYear = firstQ ? firstQ.y : year;

    // Build festival lookup: key = "m-d"
    const festivalLookup = {};
    for (let fi = 0; fi < QumranData.FIESTAS.length; fi++) {
        const f = QumranData.FIESTAS[fi];
        const key = f.m + '-' + f.d;
        if (!festivalLookup[key]) festivalLookup[key] = [];
        festivalLookup[key].push({ name: f.n, dur: f.dur });
    }

    let monthsHtml = '';
    for (let m = 0; m < 12; m++) {
        const daysInMonth = MONTH_DAYS[m];
        const monthName = QumranData.MESES[m];

        // Compute offset from year start to first day of this month
        let firstDayOffset = 0;
        for (let k = 0; k < m; k++) firstDayOffset += MONTH_DAYS[k];
        const firstDate = new Date(newYear.getTime() + firstDayOffset * 86400000);
        const firstQCalc = QumranCalendar.calculate(firstDate);
        const firstWeekday = firstQCalc ? firstQCalc.idxSem : 0;
        const emptyCells = firstWeekday; // 0-6

        // Build day cells
        let cells = '';
        for (let e = 0; e < emptyCells; e++) {
            cells += '<div class="dc empty"></div>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayOffset = firstDayOffset + (d - 1);
            const date = new Date(newYear.getTime() + dayOffset * 86400000);
            const q = QumranCalendar.calculate(date);
            const weekIdx = q ? q.idxSem : 0;

            const gregStr = date
                .toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                })
                .replace(/\./g, '');

            const festKey = m + '-' + d;
            const festList = festivalLookup[festKey];
            const festName = festList ? festList[0].name : '';

            const isShabbat = weekIdx === 6;
            const isFestival = !!festList;

            let cls = 'dc';
            if (isShabbat) cls += ' shab';
            if (isFestival) cls += ' fest';

            cells +=
                '<div class="' +
                cls +
                '">' +
                '<span class="qnum">' +
                d +
                '</span>' +
                '<span class="gdate">' +
                gregStr +
                '</span>' +
                (festName ? '<span class="fname">' + festName + '</span>' : '') +
                '</div>';
        }

        monthsHtml +=
            '<div class="mwrap">' +
            '<h3 class="mtitle">' +
            monthName +
            '</h3>' +
            '<div class="dheads">' +
            '<span>Dom</span><span>Lun</span><span>Mar</span><span>Mi\u00e9</span><span>Jue</span><span>Vie</span><span>S\u00e1b</span>' +
            '</div>' +
            '<div class="dgrid">' +
            cells +
            '</div>' +
            '</div>';
    }

    return (
        '' +
        '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
        '<title>Calendario Solar de 364 D\u00edas - ' +
        qYear +
        '</title>' +
        '<style>' +
        'body{font-family:Georgia,"Times New Roman",serif;color:#222;margin:0;padding:15px;}' +
        '@page{size:A4 landscape;margin:10mm;}' +
        'h1{text-align:center;font-size:16pt;border-bottom:2px solid #d4af37;padding-bottom:6px;margin:0 0 4px;}' +
        'h2{text-align:center;font-size:10pt;color:#666;margin:0 0 12px;font-weight:normal;}' +
        '.mwrap{' +
        '  page-break-inside:avoid;break-inside:avoid;' +
        '  margin-bottom:18px;border:1px solid #ccc;border-radius:6px;padding:8px 10px;' +
        '}' +
        '.mtitle{font-size:11pt;margin:0 0 6px;color:#1a120b;border-left:4px solid #d4af37;padding-left:8px;}' +
        '.dheads{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:7pt;' +
        '  font-weight:bold;color:#888;text-transform:uppercase;margin-bottom:4px;}' +
        '.dgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}' +
        '.dc{min-height:58px;border:1px solid #e0ddd5;padding:2px 3px;position:relative;background:#fff;}' +
        '.dc.empty{border-color:transparent;background:transparent;min-height:0;}' +
        '.qnum{display:block;font-size:14pt;font-weight:bold;color:#1a120b;line-height:1.1;}' +
        '.gdate{display:block;font-size:6.5pt;color:#999;line-height:1.2;}' +
        '.fname{display:block;font-size:6pt;font-weight:bold;color:#c00;margin-top:2px;line-height:1.2;}' +
        '.shab{background:#f8f4e8;}' +
        '.shab .qnum{color:#8b6914;}' +
        '.fest{background:#1a120b;border-color:#d4af37;}' +
        '.fest .qnum{color:#d4af37;}' +
        '.fest .gdate{color:#a08030;}' +
        '.fest .fname{color:#ffd700;}' +
        '.footer{text-align:center;margin-top:8px;font-size:7pt;color:#aaa;}' +
        '@media print{' +
        '  body{padding:0;}' +
        '  .mwrap{page-break-inside:avoid;break-inside:avoid;}' +
        '  .fest{background:#1a120b !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
        '  .shab{background:#f8f4e8 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
        '  .dheads span{font-size:6pt;}' +
        '  .qnum{font-size:12pt;}' +
        '  .gdate{font-size:6pt;}' +
        '  .fname{font-size:5.5pt;}' +
        '}' +
        '</style></head><body>' +
        '<h1>Calendario Solar de 364 D\u00edas</h1>' +
        '<h2>A\u00f1o ' +
        qYear +
        ' de la Restauraci\u00f3n</h2>' +
        monthsHtml +
        '<div class="footer">Generado por Qumran Watch - Basado en los Manuscritos del Mar Muerto (4Q320-4Q321, Jubileos)</div>' +
        '</body></html>'
    );
}

export function openPrintWindow(year) {
    const html = generatePrintHtml(year);
    const win = window.open('', '_blank');
    if (!win) {
        window.alert('Permite ventanas emergentes para imprimir el calendario.');
        return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    win.onload = function () {
        win.print();
    };
}
