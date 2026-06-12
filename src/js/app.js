/* * src/js/app.js
 * EL ESP�RITU (CONTROLADOR PRINCIPAL)
 * V13.0.0: Reconstrucci�n Modular Blindada
 */

// --- 1. IMPORTACIÓN DE MÓDULOS ---
import { QumranData } from './core/data.js';
import { QumranCalendar } from './core/calendar.js';
import { QumranSun } from './core/sun.js';
import { QumranICS } from './ics.js';
import { initTheme } from './theme.js';
import { storage } from './core/storage.js';
import { findFestivalDate, getFestivalsForYear, buildHoyViewModel } from './core/calculations.js';
import { renderHoyView } from './ui/hoy-view.js';
import { renderCalendarView } from './ui/calendar-view.js';
import './theme-init.js';

const APP_VERSION = '13.1.15';

let deferredPrompt;
let newWorker;

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;
// --- 2. GESTIÓN DE SERVICE WORKER & ACTUALIZACIONES ---

console.log('Qumran Watch v' + APP_VERSION + ' - System Online');
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/qumran-watch/sw.js', { scope: '/qumran-watch/' })
            .then(function (reg) {
                console.log('SW Registered');
            })
            .catch(function (err) {
                console.error('SW Error:', err);
            });
    });
}

// --- 4. OBJETO PRINCIPAL DE LA APLICACIÓN ---
const QumranApp = {
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        initTheme();
        const verEl = document.getElementById('app-version');
        if (verEl) verEl.textContent = 'v' + APP_VERSION;
        QumranApp.setupListeners();
        const hasMemory = QumranApp.loadStoredLocation();
        if (!hasMemory) QumranApp.getLocationAndSun();
        QumranApp.renderHoy();
        QumranApp.renderSaber();

        // Manejo del historial y bot�n "atrás"
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
        // Navegaci�n
        document.getElementById('nav-hoy').addEventListener('click', (e) => QumranApp.nav('hoy', e.currentTarget));
        document.getElementById('nav-lit').addEventListener('click', (e) => QumranApp.nav('lit', e.currentTarget));
        document.getElementById('nav-cal').addEventListener('click', (e) => QumranApp.nav('cal', e.currentTarget));
        document.getElementById('nav-con').addEventListener('click', (e) => QumranApp.nav('con', e.currentTarget));
        document.getElementById('nav-edu').addEventListener('click', (e) => QumranApp.nav('edu', e.currentTarget));
        // Instalaci�n PWA
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
        // Interacci�n Hoy
        document.getElementById('heb-fiesta').addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn').addEventListener('click', () => QumranApp.getLocationAndSun(true));

        // Comunidad y Recursos
        document.getElementById('btn-podcast-con').addEventListener('click', () => {
            window.open('https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz', '_blank');
        });
        document.getElementById('btn-institute-con').addEventListener('click', () => {
            window.open('https://www.descubrelabiblia.online/', '_blank');
        });
        // El bot�n de Telegram se maneja con onclick directo en el HTML según tu original.

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

        // Delegaci�n de eventos para listas dinámicas
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
                    if (force) document.getElementById('geo-btn').innerText = 'Actualizar Ubicaci�n (GPS)';
                    QumranApp.updateSunData(lat, lng);
                },
                () => {
                    // --- INICIO DEL RESPALDO B�BLICO (JERUSALÉN) ---
                    console.warn('GPS fall� o denegado. Usando Jerusalén.');
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
        btn.innerText = '↻ Actualizar Ubicaci�n (GPS)';
        btn.style.display = 'block';
    },

    renderHoy: () => {
        let hoy = new Date();
        if (hoy.getHours() + hoy.getMinutes() / 60 < QumranApp.sunriseHour) {
            hoy = new Date(hoy.getTime() - 86400000);
        }
        const q = QumranCalendar.calculate(hoy);
        const model = buildHoyViewModel(hoy, q, QumranApp._lastSunData);
        QumranApp.todayFiesta = model.festival ? model.festival.index : null;
        renderHoyView(model);
    },

    openFiesta: (index, forceYear) => {
        // eslint-disable-next-line security/detect-object-injection
        const f = QumranData.FIESTAS[index];
        const year = forceYear || new Date().getFullYear();
        const foundDate = findFestivalDate(index, year);

        // RESTAURACIÓN: Día de la semana completo
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
            renderCalendarView(festivals, y);
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
