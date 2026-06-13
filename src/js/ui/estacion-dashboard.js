/**
 * src/js/ui/estacion-dashboard.js
 * VISTA (Dumb View): Renderiza la tarjeta visual de la Estacion actual.
 */

const ICONS = {
    primavera:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 34" width="22" height="28"><path d="M14 32 L14 18" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M14 18 Q10 14 10 10 Q10 6 14 6 Q18 6 18 10 Q18 14 14 18" fill="currentColor" opacity="0.8"/><path d="M8 22 Q14 20 20 22" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/><path d="M6 26 Q14 23 22 26" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/></svg>',
    verano: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="22" height="22"><circle cx="15" cy="15" r="6" fill="currentColor"/><path d="M15 1 L15 5 M15 25 L15 29 M1 15 L5 15 M25 15 L29 15 M4 4 L7 7 M23 23 L26 26 M4 26 L7 23 M23 7 L26 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    otonio: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="20" height="26"><path d="M12 28 L12 14" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 14 Q16 10 18 8 Q20 6 18 4 Q16 2 14 4 Q12 6 10 4 Q8 2 6 4 Q4 6 6 8 Q8 10 12 14" fill="currentColor" opacity="0.7"/></svg>',
    invierno:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 28" width="20" height="22"><circle cx="13" cy="10" r="5" fill="currentColor" opacity="0.8"/><path d="M13 0 L13 4 M13 16 L13 20 M2 10 L6 10 M20 10 L24 10 M5 3 L8 6 M18 14 L21 17 M5 17 L8 14 M18 6 L21 3" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>',
};

export function renderEstacionCard(estacionStr, containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    containerEl.className = 'estacion-card';
    containerEl.setAttribute('role', 'region');
    containerEl.setAttribute('aria-label', 'Estacion actual: ' + estacionStr);

    let iconHtml = ICONS.primavera;
    const estrLower = (estacionStr || '').toLowerCase();
    if (estrLower.indexOf('vera') !== -1) iconHtml = ICONS.verano;
    else if (estrLower.indexOf('oto') !== -1) iconHtml = ICONS.otonio;
    else if (estrLower.indexOf('inv') !== -1) iconHtml = ICONS.invierno;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'estacion-icon';
    iconDiv.innerHTML = iconHtml;
    containerEl.appendChild(iconDiv);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'estacion-content';

    const subtitle = document.createElement('span');
    subtitle.className = 'estacion-subtitle';
    subtitle.textContent = 'Estacion Actual';
    contentDiv.appendChild(subtitle);

    const title = document.createElement('span');
    title.className = 'estacion-title';
    title.textContent = estacionStr || 'Desconocida';
    contentDiv.appendChild(title);

    containerEl.appendChild(contentDiv);
}
