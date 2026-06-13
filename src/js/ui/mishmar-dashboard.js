/**
 * src/js/ui/mishmar-dashboard.js
 * VISTA (Dumb View): Renderiza la tarjeta visual del Turno Sacerdotal (Mishmar).
 */

const MENORAH_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 38" width="22" height="34"><path d="M4 32 L20 32 L18 36 L6 36 Z" fill="currentColor" opacity="0.5"/><rect x="11" y="6" width="2" height="26" fill="currentColor"/><path d="M12 12 Q6 13 4 17" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 18 Q7 19 5 23" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 24 Q8 25 6 28" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 12 Q18 13 20 17" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 18 Q17 19 19 23" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 24 Q16 25 18 28" stroke="currentColor" stroke-width="1.3" fill="none"/><circle cx="4" cy="15" r="2" fill="currentColor" opacity="0.9"/><circle cx="5.5" cy="21" r="1.6" fill="currentColor" opacity="0.7"/><circle cx="7" cy="26" r="1.3" fill="currentColor" opacity="0.5"/><circle cx="20" cy="15" r="2" fill="currentColor" opacity="0.9"/><circle cx="18.5" cy="21" r="1.6" fill="currentColor" opacity="0.7"/><circle cx="17" cy="26" r="1.3" fill="currentColor" opacity="0.5"/><circle cx="12" cy="4" r="2" fill="currentColor" opacity="1"/></svg>';

export function renderMishmarCard(currentMishmar, containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    containerEl.className = 'mishmar-card';
    containerEl.setAttribute('role', 'region');
    containerEl.setAttribute('aria-label', 'Turno sacerdotal activo: ' + currentMishmar);

    const iconDiv = document.createElement('div');
    iconDiv.className = 'mishmar-icon';
    iconDiv.innerHTML = MENORAH_SVG;
    containerEl.appendChild(iconDiv);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'mishmar-content';

    const subtitle = document.createElement('span');
    subtitle.className = 'mishmar-subtitle';
    subtitle.textContent = 'Turno Sacerdotal Activo';
    contentDiv.appendChild(subtitle);

    const title = document.createElement('span');
    title.className = 'mishmar-title';
    title.textContent = currentMishmar || 'Desconocido';
    contentDiv.appendChild(title);

    containerEl.appendChild(contentDiv);
}
