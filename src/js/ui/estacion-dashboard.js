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

const ESTACION_STUDY_HTML =
    '<section id="est-sec-1"><p>Para la mente occidental moderna, las estaciones del aÑo son transiciones climÁticas un tanto difusas. Cambiamos de ropa cuando empieza a hacer frÍo o calor, y aceptamos que los equinoccios y solsticios caigan en dÍas variables de nuestro calendario gregoriano.</p><p>Para los sacerdotes zadokitas de QumrÁn, esto habrÍa sido una aberraciÓn. Los manuscritos calendÁricos (como 4QOtot, 4Q259 y los fragmentos del Libro AstronÓmico de Enoc hallados en las cuevas 4 y 1) revelan que las estaciones no eran simples cambios de clima; eran las <strong>Cuatro Puertas del Tiempo</strong>, engranajes matemÁticos inmutables tallados por el Creador en la estructura misma del cosmos.</p></section><hr class="separator-gold"><section id="est-sec-2"><h3>La GeometrÍa Sagrada de las Estaciones</h3><p>El calendario solar de QumrÁn consta de 364 dÍas exactos, una cifra que encierra una simetrÍa geomÉtrica perfecta. El aÑo se divide estrictamente en 4 estaciones, y cada una de ellas mide milimÉtricamente lo mismo:</p><div class="math-block">4 estaciones × 91 dÍas = 364 dÍas exactos</div><p>Cada estaciÓn dura exactamente 13 semanas. Esto significa que, para la comunidad del Mar Muerto, el tiempo era perfectamente predecible: una estaciÓn siempre comenzaba el mismo dÍa de la semana (miÉrcoles, el dÍa en que fueron creadas las lumbreras en el relato de la creaciÓn) y terminaba siempre en el mismo punto.</p><p>La estructura interna de cada estaciÓn seguÍa el patrÓn numÉrico 30-30-31:</p><ul><li><strong>Mes 1 de la estaciÓn:</strong> 30 dÍas.</li><li><strong>Mes 2 de la estaciÓn:</strong> 30 dÍas.</li><li><strong>Mes 3 de la estaciÓn:</strong> 31 dÍas.</li></ul><p>Ese dÍa 31 no era un dÍa comÚn. Los manuscritos de Enoc y Jubileos lo llaman el <strong>DÍa de ConjunciÓn</strong> o <strong>Yom Sarek</strong> (el dÍa seÑal). Era el "perno" o pestillo matemÁtico que cerraba una estaciÓn y abrÍa la puerta de la siguiente. No pertenecÍa a la cuenta regular de los meses de 30 dÍas; era un eslabÓn intercalar sagrado que mantenÍa el reloj cÓsmico en perfecta sincronÍa sin necesidad de alterar los meses humanos.</p></section><hr class="separator-gold"><section id="est-sec-3"><h3>FilologÍa Pura: Tequfah (תקופה), el Giro en el Horizonte</h3><p>En el pensamiento hebreo antiguo, las abstracciones occidentales no existen. Para entender quÉ es una estaciÓn, debemos desenterrar su nombre original: <strong>Tequfah</strong> (תקופה), cuyo plural es <strong>Tequfot</strong> (תקופות).</p><p>La teologÍa tradicional traduce esto simplemente como "estaciÓn" o "ciclo", pero su raÍz filolÓgica primaria es <strong>קוף</strong> (Q-W-Ph) o <strong>נקף</strong> (N-Q-Ph), que significa "dar la vuelta en un circuito", "rodear", "hacer una revoluciÓn completa".</p><p>Si analizamos los pictogramas de la raÍz קוף (Qof - Vav - Pey) bajo la mentalidad agrÍcola y nÓmada original, la morfologÍa nos revela un mapa visual:</p><ul><li><strong>Qof (ק):</strong> El sol en el horizonte, un cÍrculo, el tiempo que completa una revoluciÓn.</li><li><strong>Vav (ו):</strong> Una estaca o clavo; el conector que asegura, une y fija dos cosas.</li><li><strong>Pey (פ):</strong> Una boca; representa el borde, el lÍmite, la apertura o el extremo de algo.</li></ul><p>Uniendo estos conceptos, una <strong>Tequfah</strong> no es un espacio estÁtico de tres meses donde esperas a que cambie el clima. Es el momento exacto en que el sol golpea el lÍmite extremo de su cuadrante en el horizonte (Pey), se asegura firmemente a ese eje geomÉtrico (Vav) y ejecuta un giro completo (Qof) para iniciar el siguiente circuito.</p><p>Para QumrÁn, las cuatro <strong>Tequfot</strong> eran los cuatro pivotes de la maquinaria celeste: el Equinoccio de Primavera, el Solsticio de Verano, el Equinoccio de OtoÑo y el Solsticio de Invierno.</p></section><hr class="separator-gold"><section id="est-sec-4"><h3>Las Cuatro Puertas del AÑo AgrÍcola y Sacerdotal</h3><p>Los rollos del Mar Muerto intersectan la astronomÍa de las <strong>Tequfot</strong> con el ciclo de la tierra de Israel. Cada cuadrante de 91 dÍas gobernaba una etapa especÍfica de la vida y de la liturgia:</p><div class="estacion-table" style="display:grid;grid-template-columns:1fr 1.2fr 1fr 2fr;gap:4px;margin:12px 0;font-size:0.8rem;border:1px solid rgba(212,175,55,0.3);border-radius:6px;overflow:hidden;"><div style="font-weight:700;background:rgba(212,175,55,0.15);padding:6px 8px;border-bottom:1px solid #d4af37;">Cuadrante</div><div style="font-weight:700;background:rgba(212,175,55,0.15);padding:6px 8px;border-bottom:1px solid #d4af37;">Mes de Inicio</div><div style="font-weight:700;background:rgba(212,175,55,0.15);padding:6px 8px;border-bottom:1px solid #d4af37;">Evento CÓsmico</div><div style="font-weight:700;background:rgba(212,175,55,0.15);padding:6px 8px;border-bottom:1px solid #d4af37;">FunciÓn AgrÍcola</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Primera Tequfah</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Mes 1 (NisÁn / Primavera)</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Equinoccio de Primavera</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Despertar de la tierra. Primicias de la Cebada y cuenta hacia el Trigo (Shavuot).</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Segunda Tequfah</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Mes 4 (Tamuz / Verano)</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Solsticio de Verano</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">MaduraciÓn crÍtica de los frutos. CÚspide de la fuerza solar. Primicias del Vino Nuevo.</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Tercera Tequfah</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Mes 7 (Tishrei / OtoÑo)</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">Equinoccio de OtoÑo</div><div style="padding:6px 8px;border-bottom:1px solid rgba(212,175,55,0.15);">La gran recolecciÓn. Cierre de los olivares (Aceite Nuevo) y resguardo en Sukkot.</div><div style="padding:6px 8px;">Cuarta Tequfah</div><div style="padding:6px 8px;">Mes 10 (Tevet / Invierno)</div><div style="padding:6px 8px;">Solsticio de Invierno</div><div style="padding:6px 8px;">La tierra entra en el vientre de la oscuridad y las lluvias torrenciales para absorber el agua.</div></div><p>El Libro AstronÓmico de Enoc (encontrado en QumrÁn) describe que el sol opera a travÉs de <strong>Seis Puertas</strong> en el oriente y seis en el occidente. El sol viaja por estas puertas subiendo y bajando a lo largo del aÑo. El dÍa en que el sol llega al extremo de una puerta y cambia de direcciÓn, se marca la <strong>Tequfah</strong>. Cambiar el calendario significaba errar de puerta y, por ende, descarrilar la creaciÓn.</p></section><hr class="separator-gold"><section id="est-sec-5"><h3>La Brecha Cultural: El Caos de las Estaciones Flotantes</h3><p>AquÍ es donde el choque ideolÓgico entre QumrÁn y el sistema de JerusalÉn se vuelve insalvable. El judaÍsmo oficial de la Época (fariseos y saduceos helenizados) adoptÓ el calendario lunar babilÓnico de 354 dÍas. Como el aÑo lunar es 11 dÍas mÁs corto que el solar, las estaciones comenzaron a "flotar".</p><p>Para evitar que la primavera cayera en pleno invierno, el SanedrÍn de JerusalÉn tenÍa que decretar de forma humana e improvisada la aÑadidura de un mes babilÓnico extra (el mes de Adar II) cada dos o tres aÑos.</p><p>Para los guardianes de QumrÁn, esto era una profanaciÓn satÁnica del tiempo. Al alterar los dÍas, las fiestas de YHWH ya no caÍan en la <strong>Tequfah</strong> correcta. En su mentalidad, si celebrabas las primicias del grano, del vino o del aceite fuera del dÍa exacto en que el sol cruzaba la puerta estacional correspondiente, estabas presentando una ofrenda invÁlida. OfrecÍas el fruto de la tierra en un tiempo que la arquitectura del cielo no habÍa homologado.</p><p>Los manuscritos de QumrÁn nos demuestran que las estaciones no eran meteorologÍa; eran <strong>geometrÍa del Santuario</strong>. El aÑo era un templo cuadrangular invisible, y las cuatro estaciones eran sus cuatro columnas angulares. Mantenerlas fijas en el dÍa 1, el dÍa 92, el dÍa 183 y el dÍa 274 del reloj solar era la Única forma en que el hombre podÍa caminar en perfecta armonÍa con el orden original del Creador.</p></section>';

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

    containerEl.style.cursor = 'pointer';
    containerEl.addEventListener('click', function () {
        renderEstacionModal();
    });
}

export function renderEstacionModal() {
    const modal = document.getElementById('modal-estacion');
    const body = document.getElementById('estacion-body');
    if (!modal || !body) return;
    body.innerHTML = ESTACION_STUDY_HTML;
    modal.style.display = 'flex';
}
