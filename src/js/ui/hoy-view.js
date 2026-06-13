/**
 * src/js/ui/hoy-view.js
 * VISTA (Dumb View): Renderiza el DOM para la vista "Hoy".
 * No realiza cálculos — solo consume las propiedades del ViewModel.
 */

import { renderMishmarCard } from './mishmar-dashboard.js';
import { renderEstacionCard } from './estacion-dashboard.js';

/**
 * Renderiza la vista "Hoy" a partir del ViewModel.
 * @param {object} model - ViewModel generado por buildHoyViewModel
 */
export function renderHoyView(model) {
    document.getElementById('greg-date').innerText = model.gregDate;
    document.getElementById('alert-container').style.display = 'none';

    if (model.special === undefined) return;

    if (model.special) {
        document.getElementById('heb-date').innerText = model.hebDate;
        document.getElementById('heb-dia').innerText = model.hebDia;
        const gateEl = document.getElementById('gate-active');
        if (gateEl) gateEl.innerText = model.gateActive;
        return;
    }

    // --- Normal day ---
    // Watcher alerts
    if (model.alertMsg) {
        document.getElementById('alert-msg').innerHTML = model.alertMsg;
        document.getElementById('alert-container').style.display = 'block';
    }

    // Omer count
    const omerEl = document.getElementById('card-omer');
    if (model.omerDay !== null && model.omerDay < 50) {
        omerEl.style.display = 'block';
        document.getElementById('omer-count').innerText = model.omerDay;
    } else {
        omerEl.style.display = 'none';
    }

    // Yamim Noraim (Days of Awe)
    const teshuvaEl = document.getElementById('card-teshuva');
    if (model.yamimNoraIm) {
        teshuvaEl.style.display = 'block';
        document.getElementById('teshuva-cmd').innerText =
            'D\u00cdA ' + model.yamimNoraIm.dia + ': ' + model.yamimNoraIm.data.t;
        document.getElementById('teshuva-ref').innerText = 'Lectura: ' + model.yamimNoraIm.data.r;
    } else {
        teshuvaEl.style.display = 'none';
    }

    // Hebrew date / day / priestly course / season
    document.getElementById('heb-date').innerText = model.hebDate;
    document.getElementById('heb-dia').innerText = model.hebDia;
    const turnoContainer = document.getElementById('heb-turno').parentNode;
    renderMishmarCard(model.turno, turnoContainer);
    const estContainer = document.getElementById('heb-estacion').parentNode;
    renderEstacionCard(model.estacion, estContainer);

    // Halakha (Messiah's Instruction)
    document.getElementById('messiah-theme').innerText = model.halakha.theme;
    document.getElementById('messiah-hebrew').innerText = model.halakha.hebrew;
    document.getElementById('messiah-context').innerText = model.halakha.context;
    document.getElementById('messiah-philology').innerText = model.halakha.philology;
    document.getElementById('messiah-quote').innerText = model.halakha.quote;
    document.getElementById('messiah-action').innerText = model.halakha.action;

    // Festival badge
    document.getElementById('heb-fiesta').innerText = model.festival ? model.festival.name : '';

    // Solar gates
    document.querySelectorAll('.gate-dot').forEach(function (d, i) {
        d.classList.toggle('active', i + 1 === model.puerta);
    });
    document.getElementById('heb-puerta-num').innerText = model.puerta + '\u00aa Puerta';

    // Shabbat progress
    document.getElementById('shabat-text').innerText = model.shabat.text;
    document.getElementById('shabat-progress').style.width = model.shabat.percent + '%';
    if (model.shabat.shabatBg) {
        document.getElementById('shabat-progress').style.background = model.shabat.shabatBg;
    }

    // Liturgy
    document.getElementById('lit-main-title').innerText = model.liturgia.main;
    document.getElementById('page-lit-type').innerText = model.liturgia.type;
    document.getElementById('page-lit-title').innerText = model.liturgia.title;
    if (model.liturgia.text) {
        const cHTML = model.liturgia.context
            ? '<div style="background:rgba(212,175,55,0.15); padding:15px; border-left:4px solid #d4af37; margin-bottom:25px; font-style:italic;"><strong>Contexto:</strong><br>' +
              model.liturgia.context +
              '</div>'
            : '';
        document.getElementById('page-lit-text').innerHTML =
            cHTML + '<div style="line-height:1.8;">' + model.liturgia.text.replace(/\n/g, '<br>') + '</div>';
    }
}
