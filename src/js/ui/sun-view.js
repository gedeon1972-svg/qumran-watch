export function renderSunView(sunData, geoLabel) {
    if (sunData) {
        const riseEl = document.getElementById('sun-rise');
        const setEl = document.getElementById('sun-set');
        if (riseEl) riseEl.innerText = sunData.rise;
        if (setEl) setEl.innerText = sunData.set;
    }
    const container = document.getElementById('sun-container');
    if (container && sunData) container.style.display = 'flex';
    const btn = document.getElementById('geo-btn');
    if (btn) {
        if (geoLabel) btn.innerText = geoLabel;
        btn.style.display = 'block';
    }
}
