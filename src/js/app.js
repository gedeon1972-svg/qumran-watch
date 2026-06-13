/* * src/js/app.js
 * EL ESPÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½RITU (CONTROLADOR PRINCIPAL)
 * V13.0.0: ReconstrucciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½n Modular Blindada
 */

// --- 1. IMPORTACIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“N DE MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“DULOS ---
import { QumranData } from './core/data.js';
import { QumranCalendar } from './core/calendar.js';
import { QumranSun } from './core/sun.js';
import { QumranICS } from './ics.js';
import { initTheme } from './theme.js';
import { storage } from './core/storage.js';
import { findFestivalDate, getFestivalsForYear, buildHoyViewModel } from './core/calculations.js';
import { renderHoyView } from './ui/hoy-view.js';
import { renderCalendarView } from './ui/calendar-view.js';
import { renderSunView } from './ui/sun-view.js';
import { renderSaberGrid, renderEstudioModal } from './ui/estudio-view.js';
import { renderFiestaModal } from './ui/fiesta-view.js';
import { initPwaPrompt } from './ui/pwa-install.js';
import { getSunriseTime } from './core/time-translator.js';
import './theme-init.js';

const APP_VERSION = '13.1.29';

// --- 2. GESTIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“N DE SERVICE WORKER & ACTUALIZACIONES ---

console.log('Qumran Watch v' + APP_VERSION + ' - System Online');
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/qumran-watch/sw.js', { scope: '/qumran-watch/' })
            .then(function () {
                console.log('SW Registered');
                console.log(
                    '[DEBUG VIGIA] Elemento DOM encontrado:',
                    document.getElementById('vigia-progress-container') !== null,
                );
            })
            .catch(function (err) {
                console.error('SW Error:', err);
            });
    });
}

// --- 4. OBJETO PRINCIPAL DE LA APLICACIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“N ---
const QumranApp = {
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        initTheme();
        const verEl = document.getElementById('app-version');
        if (verEl) verEl.textContent = 'v' + APP_VERSION;
        initPwaPrompt();
        QumranApp.setupListeners();
        const hasMemory = QumranApp.loadStoredLocation();
        if (!hasMemory) QumranApp.getLocationAndSun();
        QumranApp.renderHoy();
        QumranApp.renderSaber();

        // Manejo del historial y botÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½n "atrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡s"
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
        // NavegaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½n
        document.getElementById('nav-hoy').addEventListener('click', (e) => QumranApp.nav('hoy', e.currentTarget));
        document.getElementById('nav-lit').addEventListener('click', (e) => QumranApp.nav('lit', e.currentTarget));
        document.getElementById('nav-cal').addEventListener('click', (e) => QumranApp.nav('cal', e.currentTarget));
        document.getElementById('nav-con').addEventListener('click', (e) => QumranApp.nav('con', e.currentTarget));
        document.getElementById('nav-edu').addEventListener('click', (e) => QumranApp.nav('edu', e.currentTarget));
        // InteracciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½n Hoy
        document.getElementById('heb-fiesta').addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn').addEventListener('click', () => QumranApp.getLocationAndSun(true));

        // Comunidad y Recursos
        document.getElementById('btn-podcast-con').addEventListener('click', () => {
            window.open('https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz', '_blank');
        });
        document.getElementById('btn-institute-con').addEventListener('click', () => {
            window.open('https://www.descubrelabiblia.online/', '_blank');
        });
        // El botÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½n de Telegram se maneja con onclick directo en el HTML segÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºn tu original.

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

        // DelegaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½n de eventos para listas dinÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡micas
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
            if (force) renderSunView(null, 'Buscando...');
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    storage.setItem('qw_lat', lat);
                    storage.setItem('qw_lng', lng);
                    QumranApp.updateSunData(
                        lat,
                        lng,
                        force ? 'Actualizar UbicaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n (GPS)' : undefined,
                    );
                },
                () => {
                    // --- INICIO DEL RESPALDO BÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½BLICO (JERUSALÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â°N) ---
                    console.warn(
                        'GPS fallÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ o denegado. Usando JerusalÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©n.',
                    );
                    const latJerusalen = 31.7683;
                    const lngJerusalen = 35.2137;
                    QumranApp.updateSunData(
                        latJerusalen,
                        lngJerusalen,
                        'JerusalÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©n (GPS Inactivo)',
                    );
                    // --- FIN DEL RESPALDO ---
                },
            );
        }
    },

    updateSunData: (lat, lng, geoLabel) => {
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
        renderSunView({ rise: times.rise, set: times.set }, geoLabel);
        QumranApp.calculateVigiaStatus();
    },

    renderHoy: () => {
        let hoy = new Date();
        if (hoy.getHours() + hoy.getMinutes() / 60 < QumranApp.sunriseHour) {
            hoy = new Date(hoy.getTime() - 86400000);
        }
        const q = QumranCalendar.calculate(hoy);
        const model = buildHoyViewModel(hoy, q);
        QumranApp.todayFiesta = model.festival ? model.festival.index : null;
        renderHoyView(model);
    },

    openFiesta: (index, forceYear) => {
        // eslint-disable-next-line security/detect-object-injection
        const f = QumranData.FIESTAS[index];
        const year = forceYear || new Date().getFullYear();
        const foundDate = findFestivalDate(index, year);

        // RESTAURACIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“N: DÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âa de la semana completo
        let dateStr = foundDate
            ? foundDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            : 'Calculando...';
        if (foundDate && f.dur > 1) {
            const end = new Date(foundDate.getTime() + (f.dur - 1) * 86400000);
            dateStr += ' al ' + end.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        }

        renderFiestaModal({
            title: f.n,
            fechas: dateStr + ' (' + year + ')',
            fechasHeb: f.d + ' del ' + QumranData.MESES[f.m] + '\n' + f.es,
            instr: f.instr,
            ref: f.ref,
            nota: f.nota || null,
            especial: f.especial || false,
        });
    },

    openFiestaHoy: () => {
        if (QumranApp.todayFiesta !== null) QumranApp.openFiesta(QumranApp.todayFiesta);
    },

    renderSaber: () => {
        renderSaberGrid(QumranData.ESTUDIOS);
    },

    openEstudio: (index) => {
        // eslint-disable-next-line security/detect-object-injection
        const estudio = QumranData.ESTUDIOS[index];
        if (!estudio) return;
        renderEstudioModal(estudio);
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
    calculateVigiaStatus: () => {
        if (!QumranApp._lastSunData) return;
        const lat = QumranApp._lastSunData.lat;
        const lng = QumranApp._lastSunData.lng;
        const sunriseData = getSunriseTime(lat, lng, new Date());
        if (!sunriseData) return;
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;

        // --- Simple text line in sun-container ---
        const sunContainer = document.getElementById('sun-container');
        const existingBar = document.getElementById('vigia-progress-container');
        if (existingBar) existingBar.remove();

        if (currentHour < sunriseData.firstLight) {
            const minsToFirstLight = Math.round((sunriseData.firstLight - currentHour) * 60);
            const hoursLeft = Math.floor(minsToFirstLight / 60);
            const minsLeft = minsToFirstLight % 60;

            const el = document.createElement('div');
            el.id = 'vigia-progress-container';
            el.style.cssText =
                'display:none;width:100%;text-align:center;margin-top:10px;font-size:0.9em;color:#d4af37;';
            el.innerHTML =
                'ÃƒÂ¢Ã‚ÂÃ‚Â³ Faltan <span id="vigia-hours">' +
                hoursLeft +
                '</span>h <span id="vigia-mins">' +
                minsLeft +
                '</span>m para el Nuevo DÃƒÆ’Ã‚Âa';
            el.style.display = 'block';
            if (sunContainer) sunContainer.appendChild(el);

            // --- Also keep the watcher alert message ---
            const alertContainer = document.getElementById('alert-container');
            const alertMsg = document.getElementById('alert-msg');
            if (alertContainer && alertMsg) {
                const alertExisting = document.getElementById('vigia-solar-msg');
                if (alertExisting) alertExisting.remove();
                const yesterday = new Date(now.getTime() - 86400000);
                const qPrev = QumranCalendar.calculate(yesterday);
                const prevDayLabel = qPrev ? qPrev.d + ' del ' + QumranData.MESES[qPrev.m] : 'dÃƒÆ’Ã‚Âa anterior';
                const solarMsg = document.createElement('div');
                solarMsg.id = 'vigia-solar-msg';
                solarMsg.style.cssText =
                    'margin-top:8px;padding-top:8px;border-top:1px solid rgba(212,175,55,0.3);font-size:0.9rem;';
                solarMsg.innerHTML =
                    '<strong>VigÃƒÆ’Ã‚Âa Solar:</strong> AÃƒÆ’Ã‚Âºn en ' +
                    prevDayLabel +
                    '. El nuevo dÃƒÆ’Ã‚Âa comenzarÃƒÆ’Ã‚Â¡ en ~' +
                    minsToFirstLight +
                    ' min.';
                alertMsg.appendChild(solarMsg);
                alertContainer.style.display = 'block';
            }
        }
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
