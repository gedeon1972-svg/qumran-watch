/**
 * src/js/ui/mishmar-dashboard.js
 * VISTA (Dumb View): Renderiza la tarjeta visual del Turno Sacerdotal (Mishmar).
 */

const MENORAH_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 38" width="22" height="34"><path d="M4 32 L20 32 L18 36 L6 36 Z" fill="currentColor" opacity="0.5"/><rect x="11" y="6" width="2" height="26" fill="currentColor"/><path d="M12 12 Q6 13 4 17" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 18 Q7 19 5 23" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 24 Q8 25 6 28" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 12 Q18 13 20 17" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 18 Q17 19 19 23" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 24 Q16 25 18 28" stroke="currentColor" stroke-width="1.3" fill="none"/><circle cx="4" cy="15" r="2" fill="currentColor" opacity="0.9"/><circle cx="5.5" cy="21" r="1.6" fill="currentColor" opacity="0.7"/><circle cx="7" cy="26" r="1.3" fill="currentColor" opacity="0.5"/><circle cx="20" cy="15" r="2" fill="currentColor" opacity="0.9"/><circle cx="18.5" cy="21" r="1.6" fill="currentColor" opacity="0.7"/><circle cx="17" cy="26" r="1.3" fill="currentColor" opacity="0.5"/><circle cx="12" cy="4" r="2" fill="currentColor" opacity="1"/></svg>';

const MISHMAR_STUDY_HTML =
    '<section id="seccion-1"><p>El descubrimiento de la Cueva 4 de Qumr�n desenterr� algo que los sistemas religiosos tradicionales prefieren ignorar: los manuscritos de las <strong>Mishmarot</strong> (documentos catalogados desde 4Q320 hasta 4Q330). Estos rollos no contienen oraciones m�sticas ni teolog�a abstracta; son registros t�cnicos, matem�ticos y astron�micos que detallan los <strong>turnos sacerdotales</strong> que deb�an custodiar el Templo.</p><blockquote>Para los sacerdotes de la l�nea de Sadoc (<em>Zadokitas</em>) exiliados en el desierto, el Templo de Jerusal�n estaba profanado no solo por la corrupci�n moral de sus l�deres, sino por algo peor: <strong>hab�an alterado el reloj del Creador</strong>.</blockquote></section><hr class="separator-gold"><section id="seccion-2"><h3>La Ingenier�a del Tiempo: El Ciclo de los 6 A�os</h3><p>La Tor� y 1 Cr�nicas 24 establecen que el servicio del Santuario estaba dividido en <strong>24 familias o clases sacerdotales</strong>. Cada familia serv�a en el Templo durante una semana exacta, relev�ndose cada <em>Shabat</em>.</p><p>Mientras el juda�smo fariseo adopt� un calendario lunar babil�nico modificable por el hombre, Qumr�n operaba bajo un <strong>calendario solar perpetuo de 364 d�as</strong>. Al cruzar las 24 clases con este calendario, los sadokitas descubrieron una simetr�a matem�tica perfecta:</p><ul><li><strong>Rotaci�n b�sica:</strong> 24 turnos � 7 d�as = 168 d�as para un ciclo completo de servicio.</li><li><strong>Desfase anual:</strong> 364 � 168 = 2 ciclos completos y sobran 28 d�as (4 semanas).</li><li><strong>Matriz de 6 A�os:</strong> El a�o nuevo jam�s comenzaba con la misma familia sacerdotal. Al final del a�o 6, la primera familia (<em>Jehoiarib</em>) volv�a a alinearse milim�tricamente con el d�a 1 del mes 1.</li></ul><blockquote>En los rollos <em>4Q320</em> y <em>4Q321</em>, Qumr�n tabul� este ciclo intersectando el turno sacerdotal, el d�a del mes solar y las fases de la luna (<em>Otot</em> / se�ales). Sab�an exactamente qu� familia ministraba en la tierra durante cada luna llena o equinoccio.</blockquote></section><hr class="separator-gold"><section id="seccion-3"><h3>Filolog�a Pura: Mishmar (????), los Centinelas C�smicos</h3><p>La palabra para "turno" o "clase" sacerdotal es <strong>Mishmar</strong> (????), derivada de la ra�z primitiva <strong>??? (Sh-M-R)</strong>, que significa <em>"guardar, vigilar, proteger o custodiar"</em>.</p><p>En el contexto antiguo, el <strong>Shomer</strong> es el pastor que pasa la noche en vela protegiendo al reba�o, o el vig�a en la muralla. Por lo tanto, los turnos sacerdotales (<em>Mishmarot</em>) no eran "horarios de misa". Los sacerdotes eran <strong>centinelas c�smicos</strong>: su trabajo consist�a en vigilar que las frecuencias del Templo �los sacrificios, el fuego, las primicias� fluyeran en el segundo exacto que el dise�o celestial dictaba.</p><blockquote>Si el turno fallaba o si se alteraba el calendario, el centinela abandonaba la guardia y el caos (<em>Mem</em>) entraba al Santuario.</blockquote></section><hr class="separator-gold"><section id="seccion-4"><h3>La Brecha Cultural: La Usurpaci�n Pol�tico-Religiosa</h3><p>En el a�o 175 a.C., Ant�oco IV Ep�fanes depuso al �ltimo Sumo Sacerdote leg�timo de la l�nea de Sadoc, On�as III. Posteriormente, los reyes macabeos (Asmoneos) �sacerdotes pero <em>no</em> de la l�nea din�stica de Sadoc� se autoproclamaron Sumos Sacerdotes. Para legitimarse, <strong>abandonaron el calendario solar zadokita e impusieron el calendario lunar babil�nico</strong>.</p><p>Este cambio destruy� el orden de las <em>Mishmarot</em>. Familias sacerdotales enteras que consideraban el calendario lunar como una abominaci�n pagana abandonaron el Templo y se retiraron al desierto. Para Qumr�n, el Templo de Jerusal�n operaba en un "tiempo falso". Celebrar P�saj o Shavuot en d�as dictados por la luna invalidaba por completo los sacrificios.</p><blockquote>Los sacerdotes en Jerusal�n ya no eran <strong>Shomerim</strong> (guardianes); eran usurpadores que hab�an perdido la sincron�a con el Creador.</blockquote></section><hr class="separator-gold"><section id="seccion-5"><h3>El Eslab�n Perdido del Nuevo Testamento</h3><p>El evangelio de Lucas narra que el sacerdote Zacar�as, padre de Juan el Bautista, era de la clase de <strong>Ab�as / Aviyah</strong> (Lucas 1:5) y recibi� la visitaci�n del �ngel mientras ministraba en su turno. Gracias a los rollos de las <em>Mishmarot</em> sabemos exactamente en qu� semanas del a�o serv�a la octava clase (<em>Aviyah</em>).</p><p>Calculando desde su turno y los meses de embarazo de Elisabet, se llega a una conclusi�n hist�rica disruptiva: <strong>Juan el Bautista naci� durante las primicias de la primavera (P�saj)</strong>, y <strong>Yeshua naci� seis meses despu�s, en Sukkot (la Fiesta de las Caba�as)</strong>.</p><blockquote>Los rollos de Qumr�n demuestran que el Nuevo Testamento est� edificado sobre la estructura exacta de las <em>Mishmarot</em> zadokitas. Los autores de los evangelios registraron la historia de un Mes�as cuyo nacimiento e introducci�n en el mundo respet� milim�tricamente los turnos de los centinelas del Templo.</blockquote></section>';

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

    containerEl.style.cursor = 'pointer';
    containerEl.addEventListener('click', function () {
        renderMishmarModal();
    });
}

export function renderMishmarModal() {
    const modal = document.getElementById('modal-mishmar');
    const body = document.getElementById('mishmar-body');
    if (!modal || !body) return;
    body.innerHTML = MISHMAR_STUDY_HTML;
    modal.style.display = 'flex';
}
