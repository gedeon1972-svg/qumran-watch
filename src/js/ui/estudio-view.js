export function renderSaberGrid(ciclos) {
    const container = document.getElementById('edu-grid');
    if (!container) return;
    container.innerHTML = '';
    let htmlCards = '';
    ciclos.forEach(function (item, idx) {
        htmlCards +=
            '<div class="edu-card interactive-card" data-index="' +
            idx +
            '"><div class="edu-card-title">' +
            item.t +
            '</div><div class="edu-card-subtitle">' +
            item.s +
            '</div></div>';
    });
    container.innerHTML = htmlCards;
}

export function renderEstudioModal(estudio) {
    document.getElementById('lec-title').innerText = estudio.t;
    document.getElementById('lec-meta').innerText = estudio.s;
    document.getElementById('lec-body').innerHTML = estudio.c;
    document.getElementById('modal-lectura').style.display = 'flex';
}
