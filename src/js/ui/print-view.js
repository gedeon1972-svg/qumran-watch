import { QumranData } from '../core/data.js';
import { getFestivalsForYear } from '../core/calculations.js';

export function generatePrintHtml(year) {
    const festivals = getFestivalsForYear(year);
    let rows = '';
    festivals.forEach(function (item) {
        const d = item.date;
        const q = item.q;
        const f = QumranData.FIESTAS[item.index];
        const gregLabel = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
        const qDate = (q.d || '') + ' ' + (QumranData.MESES[q.m] || '');
        const festName = f.n;
        const festDesc = f.es || '';
        const dur = f.dur > 1 ? ' (' + f.dur + ' dias)' : '';
        rows +=
            '<tr>' +
            '<td>' +
            qDate +
            '</td>' +
            '<td>' +
            gregLabel +
            '</td>' +
            '<td><strong>' +
            festName +
            '</strong>' +
            dur +
            '</td>' +
            '<td>' +
            festDesc +
            '</td>' +
            '</tr>';
    });

    return (
        '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
        '<title>Calendario Qumran ' +
        year +
        '</title>' +
        '<style>' +
        'body{font-family:Georgia,serif;color:#222;margin:0;padding:20px;}' +
        '@page{size:A4;margin:15mm;}' +
        'h1{text-align:center;font-size:18pt;border-bottom:2px solid #d4af37;padding-bottom:8px;}' +
        'h2{text-align:center;font-size:12pt;color:#666;margin-top:4px;}' +
        'table{width:100%;border-collapse:collapse;margin-top:16px;font-size:9pt;}' +
        'th{background:#d4af37;color:#1a120b;padding:6px 8px;text-align:left;font-size:9pt;}' +
        'td{padding:5px 8px;border-bottom:1px solid #ddd;vertical-align:top;}' +
        'tr:nth-child(even){background:#f8f6f0;}' +
        '.footer{text-align:center;margin-top:20px;font-size:8pt;color:#999;}' +
        '@media print{body{padding:0;}th{background:#d4af37 !important;color:#000 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}' +
        '</style></head><body>' +
        '<h1>Ciclo de Fiestas - Calendario Solar de 364 Dias</h1>' +
        '<h2>Ano ' +
        year +
        ' (Restauracion)</h2>' +
        '<table><thead><tr>' +
        '<th>Fecha Qumran</th><th>Fecha Gregoriana</th><th>Fiesta</th><th>Descripcion</th>' +
        '</tr></thead><tbody>' +
        rows +
        '</tbody></table>' +
        '<div class="footer">Generado por Qumran Watch v13.1.19 - Basado en los Manuscritos del Mar Muerto</div>' +
        '</body></html>'
    );
}

export function openPrintWindow(year) {
    const html = generatePrintHtml(year);
    const win = window.open('');
    if (!win) {
        window.alert('Permite ventanas emergentes para imprimir el calendario.');
        return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(function () {
        win.print();
    }, 500);
}
