/**
 * src/js/ui/mishmar-dashboard.js
 * VISTA (Dumb View): Renderiza la tarjeta visual del Turno Sacerdotal (Mishmar).
 */

const MENORAH_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 38" width="22" height="34"><path d="M4 32 L20 32 L18 36 L6 36 Z" fill="currentColor" opacity="0.5"/><rect x="11" y="6" width="2" height="26" fill="currentColor"/><path d="M12 12 Q6 13 4 17" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 18 Q7 19 5 23" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 24 Q8 25 6 28" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 12 Q18 13 20 17" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 18 Q17 19 19 23" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 24 Q16 25 18 28" stroke="currentColor" stroke-width="1.3" fill="none"/><circle cx="4" cy="15" r="2" fill="currentColor" opacity="0.9"/><circle cx="5.5" cy="21" r="1.6" fill="currentColor" opacity="0.7"/><circle cx="7" cy="26" r="1.3" fill="currentColor" opacity="0.5"/><circle cx="20" cy="15" r="2" fill="currentColor" opacity="0.9"/><circle cx="18.5" cy="21" r="1.6" fill="currentColor" opacity="0.7"/><circle cx="17" cy="26" r="1.3" fill="currentColor" opacity="0.5"/><circle cx="12" cy="4" r="2" fill="currentColor" opacity="1"/></svg>';

const MISHMAR_STUDY_HTML =
    '<section id="seccion-1"><p>El descubrimiento de la Cueva 4 de Qumrán desenterró algo que los sistemas religiosos tradicionales prefieren ignorar: los manuscritos de las <strong>Mishmarot</strong> (documentos catalogados desde 4Q320 hasta 4Q330). Estos rollos no contienen oraciones místicas ni teología abstracta; son registros técnicos, matemáticos y astronómicos que detallan los <strong>turnos sacerdotales</strong> que debían custodiar el Templo.</p><blockquote>Para los sacerdotes de la línea de Sadoc (<em>Zadokitas</em>) exiliados en el desierto, el Templo de Jerusalén estaba profanado no solo por la corrupción moral de sus líderes, sino por algo peor: <strong>habían alterado el reloj del Creador</strong>.</blockquote></section><hr class="separator-gold"><section id="seccion-2"><h3>La Ingeniería del Tiempo: El Ciclo de los 6 Años</h3><p>La Torá y 1 Crónicas 24 establecen que el servicio del Santuario estaba dividido en <strong>24 familias o clases sacerdotales</strong>. Cada familia servía en el Templo durante una semana exacta, relevándose cada <em>Shabat</em>.</p><p>Mientras el judaísmo fariseo adoptó un calendario lunar babilónico modificable por el hombre, Qumrán operaba bajo un <strong>calendario solar perpetuo de 364 días</strong>. Al cruzar las 24 clases con este calendario, los sadokitas descubrieron una simetría matemática perfecta:</p><ul><li><strong>Rotación básica:</strong> 24 turnos × 7 días = 168 días para un ciclo completo de servicio.</li><li><strong>Desfase anual:</strong> 364 ÷ 168 = 2 ciclos completos y sobran 28 días (4 semanas).</li><li><strong>Matriz de 6 Años:</strong> El año nuevo jamás comenzaba con la misma familia sacerdotal. Al final del año 6, la primera familia (<em>Jehoiarib</em>) volvía a alinearse milimétricamente con el día 1 del mes 1.</li></ul><blockquote>En los rollos <em>4Q320</em> y <em>4Q321</em>, Qumrán tabuló este ciclo intersectando el turno sacerdotal, el día del mes solar y las fases de la luna (<em>Otot</em> / señales). Sabían exactamente qué familia ministraba en la tierra durante cada luna llena o equinoccio.</blockquote></section><hr class="separator-gold"><section id="seccion-3"><h3>Filología Pura: Mishmar (????), los Centinelas Cósmicos</h3><p>La palabra para "turno" o "clase" sacerdotal es <strong>Mishmar</strong> (????), derivada de la raíz primitiva <strong>??? (Sh-M-R)</strong>, que significa <em>"guardar, vigilar, proteger o custodiar"</em>.</p><p>En el contexto antiguo, el <strong>Shomer</strong> es el pastor que pasa la noche en vela protegiendo al rebaño, o el vigía en la muralla. Por lo tanto, los turnos sacerdotales (<em>Mishmarot</em>) no eran "horarios de misa". Los sacerdotes eran <strong>centinelas cósmicos</strong>: su trabajo consistía en vigilar que las frecuencias del Templo —los sacrificios, el fuego, las primicias— fluyeran en el segundo exacto que el diseño celestial dictaba.</p><blockquote>Si el turno fallaba o si se alteraba el calendario, el centinela abandonaba la guardia y el caos (<em>Mem</em>) entraba al Santuario.</blockquote></section><hr class="separator-gold"><section id="seccion-4"><h3>La Brecha Cultural: La Usurpación Político-Religiosa</h3><p>En el año 175 a.C., Antíoco IV Epífanes depuso al último Sumo Sacerdote legítimo de la línea de Sadoc, Onías III. Posteriormente, los reyes macabeos (Asmoneos) —sacerdotes pero <em>no</em> de la línea dinástica de Sadoc— se autoproclamaron Sumos Sacerdotes. Para legitimarse, <strong>abandonaron el calendario solar zadokita e impusieron el calendario lunar babilónico</strong>.</p><p>Este cambio destruyó el orden de las <em>Mishmarot</em>. Familias sacerdotales enteras que consideraban el calendario lunar como una abominación pagana abandonaron el Templo y se retiraron al desierto. Para Qumrán, el Templo de Jerusalén operaba en un "tiempo falso". Celebrar Pésaj o Shavuot en días dictados por la luna invalidaba por completo los sacrificios.</p><blockquote>Los sacerdotes en Jerusalén ya no eran <strong>Shomerim</strong> (guardianes); eran usurpadores que habían perdido la sincronía con el Creador.</blockquote></section><hr class="separator-gold"><section id="seccion-5"><h3>El Eslabón Perdido del Nuevo Testamento</h3><p>El evangelio de Lucas narra que el sacerdote Zacarías, padre de Juan el Bautista, era de la clase de <strong>Abías / Aviyah</strong> (Lucas 1:5) y recibió la visitación del ángel mientras ministraba en su turno. Gracias a los rollos de las <em>Mishmarot</em> sabemos exactamente en qué semanas del año servía la octava clase (<em>Aviyah</em>).</p><p>Calculando desde su turno y los meses de embarazo de Elisabet, se llega a una conclusión histórica disruptiva: <strong>Juan el Bautista nació durante las primicias de la primavera (Pésaj)</strong>, y <strong>Yeshua nació seis meses después, en Sukkot (la Fiesta de las Cabañas)</strong>.</p><blockquote>Los rollos de Qumrán demuestran que el Nuevo Testamento está edificado sobre la estructura exacta de las <em>Mishmarot</em> zadokitas. Los autores de los evangelios registraron la historia de un Mesías cuyo nacimiento e introducción en el mundo respetó milimétricamente los turnos de los centinelas del Templo.</blockquote></section>';

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

    const btnEstudio = document.createElement('button');
    btnEstudio.className = 'btn-mishmar-estudio';
    btnEstudio.textContent = '📖 Ver Estudio';
    containerEl.appendChild(btnEstudio);

    containerEl.style.cursor = 'pointer';
    containerEl.addEventListener('click', function (e) {
        if (e.target.closest('.btn-mishmar-estudio')) {
            renderMishmarModal();
        }
    });
}

export function renderMishmarModal() {
    const modal = document.getElementById('modal-mishmar');
    const body = document.getElementById('mishmar-body');
    if (!modal || !body) return;
    body.innerHTML = MISHMAR_STUDY_HTML;
    modal.style.display = 'flex';
}
