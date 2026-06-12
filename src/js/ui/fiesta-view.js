export function renderFiestaModal(data) {
    document.getElementById('mod-title').innerText = data.title;
    document.getElementById('mod-fechas').innerText = data.fechas;
    document.getElementById('mod-fechas-heb').innerText = data.fechasHeb;
    document.getElementById('mod-instr').innerText = data.instr;
    document.getElementById('mod-ref').innerText = data.ref;
    const noteEl = document.getElementById('mod-note');
    if (data.nota) {
        noteEl.style.display = 'block';
        noteEl.innerText = data.nota;
    } else {
        noteEl.style.display = 'none';
    }
    const warnEl = document.getElementById('mod-warn');
    if (warnEl) warnEl.style.display = data.especial ? 'block' : 'none';
    document.getElementById('modal-fiesta').style.display = 'flex';
}
