/* * src/js/app.js
 * EL ESPÍRITU (CONTROLADOR PRINCIPAL)
 * V13.0.0: Reconstrucción Modular Blindada
 */

// --- 1. IMPORTACIÃ“N DE MÃ“DULOS ---
import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';
import { QumranSun } from './sun.js';
import { QumranICS } from './ics.js';
import { initTheme } from './theme.js';
import { storage } from './storage.js';
import { findFestivalDate, getFestivalsForYear, getWatcherAlerts, calcOmerDay } from './utils/calculations.js';

let deferredPrompt;
let newWorker;

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;
// --- 2. GESTIÃ“N DE SERVICE WORKER & ACTUALIZACIONES ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' }).then((reg) => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        const toast = document.getElementById('update-toast');
                        const btn = document.getElementById('btn-refresh');
                        if (toast && btn) {
                            toast.style.display = 'flex';
                            btn.addEventListener('click', () => {
                                if (newWorker) newWorker.postMessage({ action: 'skipWaiting' });
                                window.location.reload();
                            });
                        }
                    }
                });
            });
        });
    });
}

// --- 3. LÃ“GICA DE INSTALACIÃ“N PWA ---
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('btn-install');
    if (installBtn) installBtn.style.display = 'block';
});

// --- 4. OBJETO PRINCIPAL DE LA APLICACIÃ“N ---
const QumranApp = {
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        initTheme();
        QumranApp.setupListeners();
        const hasMemory = QumranApp.loadStoredLocation();
        if (!hasMemory) QumranApp.getLocationAndSun();
        QumranApp.renderHoy();
        QumranApp.renderSaber();

        // Manejo del historial y botón "atrás"
        window.history.replaceState({ view: 'hoy' }, '', '#hoy');
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.view) {
                QumranApp.nav(event.state.view, null, true);
            } else {
                QumranApp.nav('hoy', null, true);
            }
        });
    },

    setupListeners: () => {
        // Navegación
        document.getElementById('nav-hoy').addEventListener('click', (e) => QumranApp.nav('hoy', e.currentTarget));
        document.getElementById('nav-lit').addEventListener('click', (e) => QumranApp.nav('lit', e.currentTarget));
        document.getElementById('nav-cal').addEventListener('click', (e) => QumranApp.nav('cal', e.currentTarget));
        document.getElementById('nav-con').addEventListener('click', (e) => QumranApp.nav('con', e.currentTarget));
        document.getElementById('nav-edu').addEventListener('click', (e) => QumranApp.nav('edu', e.currentTarget));
        // Instalación PWA
        const installBtn = document.getElementById('btn-install');
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    await deferredPrompt.userChoice;
                    deferredPrompt = null;
                    installBtn.style.display = 'none';
                }
            });
        }
        // Interacción Hoy
        document.getElementById('heb-fiesta').addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn').addEventListener('click', () => QumranApp.getLocationAndSun(true));

        // Comunidad y Recursos
        document.getElementById('btn-podcast-con').addEventListener('click', () => {
            window.open('https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz', '_blank');
        });
        document.getElementById('btn-institute-con').addEventListener('click', () => {
            window.open('https://www.descubrelabiblia.online/', '_blank');
        });
        // El botón de Telegram se maneja con onclick directo en el HTML según tu original.

        // Calendario y Alertas
        document.getElementById('btn-render-cal').addEventListener('click', QumranApp.renderCalendar);
        const btnExportICS = document.getElementById('btn-export-ics');
        if (btnExportICS) {
            btnExportICS.addEventListener('click', () => {
                const y = document.getElementById('cal-year')
                    ? parseInt(document.getElementById('cal-year').value)
                    : new Date().getFullYear();
                try {
                    QumranICS.generateAndDownload(y);
                } catch (err) {
                    const alertBox = document.getElementById('alert-container');
                    const alertMsg = document.getElementById('alert-msg');
                    if (alertBox && alertMsg) {
                        alertMsg.innerHTML = `<strong>Error al generar calendario:</strong> ${err.message}`;
                        alertBox.style.display = 'block';
                    }
                }
            });
        }

        // Delegación de eventos para listas dinámicas
        document.getElementById('cal-lista').addEventListener('click', (e) => {
            const row = e.target.closest('.edu-card.fiesta');
            if (row) QumranApp.openFiesta(parseInt(row.dataset.index), parseInt(row.dataset.year));
        });

        document.getElementById('edu-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.edu-card');
            if (card) QumranApp.openEstudio(parseInt(card.dataset.index));
        });

        // Privacy modal
        const btnPrivacy = document.getElementById('btn-privacy');
        const modalPrivacy = document.getElementById('modal-privacy');
        const btnClosePrivacy = document.getElementById('btn-close-privacy');
        if (btnPrivacy && modalPrivacy) {
            btnPrivacy.addEventListener('click', () => (modalPrivacy.style.display = 'flex'));
        }
        if (btnClosePrivacy && modalPrivacy) {
            btnClosePrivacy.addEventListener('click', () => (modalPrivacy.style.display = 'none'));
        }

        // License modal
        const btnLicense = document.getElementById('btn-license');
        const modalLicense = document.getElementById('modal-license');
        const btnCloseLicense = document.getElementById('btn-close-license');
        if (btnLicense && modalLicense) {
            btnLicense.addEventListener('click', () => (modalLicense.style.display = 'flex'));
        }
        if (btnCloseLicense && modalLicense) {
            btnCloseLicense.addEventListener('click', () => (modalLicense.style.display = 'none'));
        }
        // Cierre de Modales
        document
            .getElementById('btn-close-modal')
            .addEventListener('click', () => (document.getElementById('modal-fiesta').style.display = 'none'));
        document
            .getElementById('btn-close-lectura')
            .addEventListener('click', () => (document.getElementById('modal-lectura').style.display = 'none'));
    },

    nav: (viewId, btn, isHistoryEvent = false) => {
        document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
        const targetView = document.getElementById('view-' + viewId);
        if (targetView) targetView.classList.add('active');

        if (btn) {
            document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        } else {
            document.querySelectorAll('.nav-btn').forEach((b) => {
                b.classList.toggle('active', b.id === 'nav-' + viewId);
            });
        }

        if (!isHistoryEvent) window.history.pushState({ view: viewId }, '', '#' + viewId);
        window.scrollTo(0, 0);
    },

    loadStoredLocation: () => {
        const lat = storage.getItem('qw_lat');
        const lng = storage.getItem('qw_lng');
        if (lat && lng) {
            QumranApp.updateSunData(parseFloat(lat), parseFloat(lng));
            return true;
        }
        return false;
    },

    getLocationAndSun: (force = false) => {
        if (navigator.geolocation) {
            if (force) document.getElementById('geo-btn').innerText = 'Buscando...';
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    storage.setItem('qw_lat', lat);
                    storage.setItem('qw_lng', lng);
                    if (force) document.getElementById('geo-btn').innerText = 'Actualizar Ubicación (GPS)';
                    QumranApp.updateSunData(lat, lng);
                },
                () => {
                    // --- INICIO DEL RESPALDO BÍBLICO (JERUSALÃ‰N) ---
                    console.warn('GPS falló o denegado. Usando Jerusalén.');
                    if (force) document.getElementById('geo-btn').innerText = 'Jerusalén (GPS Inactivo)';

                    // Coordenadas exactas de Jerusalén
                    const latJerusalen = 31.7683;
                    const lngJerusalen = 35.2137;

                    // Calculamos el tiempo usando el reloj original
                    QumranApp.updateSunData(latJerusalen, lngJerusalen);
                    // --- FIN DEL RESPALDO ---
                },
            );
        }
    },

    updateSunData: (lat, lng) => {
        const now = new Date();
        const times = QumranSun.calcSunTimes(now, lat, lng);

        const _newData = { rise: times.rise, set: times.set, riseDecimal: times.riseDecimal, lat, lng };
        if (QumranApp._lastSunData && JSON.stringify(_newData) === JSON.stringify(QumranApp._lastSunData)) {
            return;
        }
        QumranApp._lastSunData = _newData;
        if (times && times.riseDecimal) {
            QumranApp.sunriseHour = times.riseDecimal;
            QumranApp.renderHoy();
        }
        document.getElementById('sun-rise').innerText = times.rise;
        document.getElementById('sun-set').innerText = times.set;
        document.getElementById('sun-container').style.display = 'flex';
        const btn = document.getElementById('geo-btn');
        btn.innerText = 'â†» Actualizar Ubicación (GPS)';
        btn.style.display = 'block';
    },

    checkWatcher: (hoy, qHoy) => {
        const alerts = getWatcherAlerts(hoy, qHoy);
        const msg = alerts.msg;
        const alertBox = document.getElementById('alert-container');
        alertBox.style.display = 'none';

        const omerDay = calcOmerDay(qHoy);

        if (qHoy.m !== undefined && !qHoy.special) {
            if (omerDay !== null && omerDay < 50) {
                document.getElementById('card-omer').style.display = 'block';
                document.getElementById('omer-count').innerText = omerDay;
            } else {
                document.getElementById('card-omer').style.display = 'none';
            }
        }

        if (qHoy.m === 6 && qHoy.d >= 1 && qHoy.d <= 10) {
            const tData = QumranData.YAMIM_NORAIM[qHoy.d - 1];
            document.getElementById('card-teshuva').style.display = 'block';
            document.getElementById('teshuva-cmd').innerText = `DÍA ${qHoy.d}: ${tData.t}`;
            document.getElementById('teshuva-ref').innerText = `Lectura: ${tData.r}`;
        } else {
            document.getElementById('card-teshuva').style.display = 'none';
        }

        if (msg !== '') {
            document.getElementById('alert-msg').innerHTML = msg;
            alertBox.style.display = 'block';
        }
    },

    renderHoy: () => {
        let hoy = new Date();
        // Ajuste de "Día" según la salida del sol (función pura, sin mutar)
        if (hoy.getHours() + hoy.getMinutes() / 60 < QumranApp.sunriseHour) {
            hoy = new Date(hoy.getTime() - 86400000);
        }

        const q = QumranCalendar.calculate(hoy);
        document.getElementById('greg-date').innerText = hoy.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });

        if (!q) return;

        if (q.special) {
            // Calculamos en qué día de la semana de ajuste estamos (del 1 al 7)
            const diaEspecial = q.dCountYear - 2184;

            document.getElementById('heb-date').innerText = 'SEMANA DE AJUSTE SOLAR';
            document.getElementById('heb-dia').innerText = `Día ${diaEspecial} de 7 â€¢ Sincronizando Equinoccio`;

            // Si tienes el elemento de la puerta del sol, lo fijamos en la Puerta 4
            const gateEl = document.getElementById('gate-active');
            if (gateEl) gateEl.innerText = 'Puerta 4 (Alineación)';
        } else {
            QumranApp.checkWatcher(hoy, q);
            document.getElementById('heb-date').innerText = `${q.d} del ${QumranData.MESES[q.m]}`;
            document.getElementById('heb-dia').innerText = QumranData.DIAS[q.idxSem];
            document.getElementById('heb-turno').innerText = q.turno;
            document.getElementById('heb-estacion').innerText = q.est;

            // Lógica de Instrucción del Mesías
            const hIndex = q.dCountYear ? Math.floor(q.dCountYear / 7) % QumranData.HALAKHA.length : 0;
            const h = QumranData.HALAKHA[hIndex];
            document.getElementById('messiah-theme').innerText = h.t;
            document.getElementById('messiah-hebrew').innerText = h.h || '';
            document.getElementById('messiah-context').innerText = h.c ? `Contexto: ${h.c}` : '';
            document.getElementById('messiah-philology').innerText = h.f || '';
            document.getElementById('messiah-quote').innerText = `"${h.q}"`;
            document.getElementById('messiah-action').innerText = `${h.a} (${h.r})`;

            // Distintivo de Fiesta
            const fIdx = QumranData.FIESTAS.findIndex((x) => x.m === q.m && x.d === q.d);
            if (fIdx !== -1) {
                QumranApp.todayFiesta = fIdx;
                document.getElementById('heb-fiesta').innerText = 'â˜… ' + QumranData.FIESTAS[fIdx].n;
            } else {
                QumranApp.todayFiesta = null;
                document.getElementById('heb-fiesta').innerText = '';
            }

            // Puertas del Sol
            document.querySelectorAll('.gate-dot').forEach((d, i) => d.classList.toggle('active', i + 1 === q.puerta));
            document.getElementById('heb-puerta-num').innerText = q.puerta + 'Âª Puerta';

            // Progreso del Shabat y Liturgia
            let percent = ((q.idxSem + 1) / 7) * 100;
            let s = null;
            let litType = '';
            let litMain = '';

            if (q.idxSem === 6) {
                document.getElementById('shabat-text').innerText = 'Â¡SHABAT SHALOM!';
                document.getElementById('shabat-progress').style.background = '#fff';
                percent = 100;
                s = QumranData.CANTICOS_SHABAT[Math.floor((q.dCountYear || 0) / 7) % 13];
                litType = 'LITURGIA CELESTIAL';
                litMain = 'CÁNTICO DEL SACRIFICIO DEL SHABAT';
            } else {
                document.getElementById('shabat-text').innerText = `Faltan ${6 - q.idxSem} días para el Shabat`;
                s = QumranData.SALMOS[q.idxSem];
                litType = 'LITURGIA DEL TEMPLO';
                litMain = 'SALMO DEL DÍA';
            }
            document.getElementById('shabat-progress').style.width = percent + '%';

            if (s) {
                document.getElementById('lit-main-title').innerText = litMain;
                document.getElementById('page-lit-type').innerText = litType;
                document.getElementById('page-lit-title').innerText = s.t;
                const cHTML = s.c
                    ? `<div style="background:rgba(212,175,55,0.15); padding:15px; border-left:4px solid #d4af37; margin-bottom:25px; font-style:italic;"><strong>Contexto:</strong><br>${s.c}</div>`
                    : '';
                document.getElementById('page-lit-text').innerHTML =
                    cHTML + `<div style="line-height:1.8;">${s.v.replace(/\n/g, '<br>')}</div>`;
            }
        }
    },

    openFiesta: (index, forceYear) => {
        const f = QumranData.FIESTAS[index];
        const year = forceYear || new Date().getFullYear();
        const foundDate = findFestivalDate(index, year);

        // RESTAURACIÃ“N: Día de la semana completo
        let dateStr = foundDate
            ? foundDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            : 'Calculando...';
        if (foundDate && f.dur > 1) {
            const end = new Date(foundDate.getTime() + (f.dur - 1) * 86400000);
            dateStr += ' al ' + end.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        }

        document.getElementById('mod-title').innerText = f.n;
        document.getElementById('mod-fechas').innerText = dateStr + ` (${year})`;
        document.getElementById('mod-fechas-heb').innerText = `${f.d} del ${QumranData.MESES[f.m]}\n${f.es}`;
        document.getElementById('mod-instr').innerText = f.instr;
        document.getElementById('mod-ref').innerText = f.ref;
        document.getElementById('mod-note').style.display = f.nota ? 'block' : 'none';
        if (f.nota) document.getElementById('mod-note').innerText = f.nota;
        document.getElementById('mod-warn').style.display = f.especial ? 'block' : 'none';
        document.getElementById('modal-fiesta').style.display = 'flex';
    },

    openFiestaHoy: () => {
        if (QumranApp.todayFiesta !== null) QumranApp.openFiesta(QumranApp.todayFiesta);
    },

    renderSaber: () => {
        const container = document.getElementById('edu-grid');
        if (!container) return;
        container.innerHTML = '';
        let htmlCards = '';
        QumranData.ESTUDIOS.forEach((item, idx) => {
            htmlCards += `<div class="edu-card interactive-card" data-index="${idx}"><div class="edu-card-title">${item.t}</div><div class="edu-card-subtitle">${item.s}</div></div>`;
        });
        container.innerHTML = htmlCards;
    },

    openEstudio: (index) => {
        const estudio = QumranData.ESTUDIOS[index];
        if (!estudio) return;
        document.getElementById('lec-title').innerText = estudio.t;
        document.getElementById('lec-meta').innerText = estudio.s;
        document.getElementById('lec-body').innerHTML = estudio.c;
        document.getElementById('modal-lectura').style.display = 'flex';
    },

    renderCalendar: () => {
        const y = document.getElementById('cal-year')
            ? parseInt(document.getElementById('cal-year').value)
            : new Date().getFullYear();
        const list = document.getElementById('cal-lista');
        if (!list) return;
        list.innerHTML = "<div class='text-center' style='padding:20px;'>Calculando ciclo sagrado...</div>";
        setTimeout(() => {
            const festivals = getFestivalsForYear(y);
            let html = '';
            festivals.forEach(({ date: d, q, index: fIdx }) => {
                const f = QumranData.FIESTAS[fIdx];
                let dateLabel = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                if (f.dur > 1) {
                    const end = new Date(d.getTime() + (f.dur - 1) * 86400000);
                    dateLabel += ' - ' + end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                }
                const nombreMes = QumranData.MESES[q.m];
                html += `
                    <div class="edu-card fiesta interactive-card" data-index="${fIdx}" data-year="${y}">
                        <div class="edu-card-title">${f.n}</div>
                        <div class="edu-card-subtitle">${f.es}</div>
                        <div class="card-meta-info">
                            <span>${dateLabel}</span>
                            <span class="q-date">Día ${q.d} &bull; ${nombreMes}</span>
                        </div></div>`;
            });
            list.innerHTML = html || "<div class='card'>No se encontraron fiestas.</div>";
        }, 50);
    },
    showToast: (msg) => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        container.appendChild(toast);
        toast.addEventListener('animationend', () => toast.remove());
        setTimeout(() => toast.remove(), 3000);
    },
};

document.addEventListener('DOMContentLoaded', QumranApp.init);

window.QumranApp = QumranApp;
